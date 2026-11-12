// The instrumented fixture MCP server.
//
//   node dist/server/fixture-server.js --fixture summary_and_data --mode sdk --transport stdio --capture runs/x
//   node dist/server/fixture-server.js --fixture summary_and_data --mode raw --transport http --port 4101 --capture runs/x
//
// Modes:
//   sdk        low-level `Server` from @modelcontextprotocol/server. Validates
//              tools/call results against the era's schema and normalizes a
//              content-less result to content: [].
//   mcpserver  high-level `McpServer.registerTool`. Adds outputSchema
//              validation and the 2025-era {result: ...} wrap for non-object
//              structuredContent.
//   raw        hand-written JSON-RPC in raw-jsonrpc.ts. Sends the fixture
//              result byte for byte.
//
// Every JSON-RPC message in or out is appended to <capture>/wire.jsonl before
// anything validates it. HTTP captures also carry status and the headers that
// matter (MCP-Protocol-Version, Mcp-Session-Id, content-type).
import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createInterface } from 'node:readline';
import { Server, McpServer, createMcpHandler, type McpServerFactory } from '@modelcontextprotocol/server';
import { fromJsonSchema } from '@modelcontextprotocol/server';
import { StdioServerTransport, serveStdio } from '@modelcontextprotocol/server/stdio';
import type { Transport, JSONRPCMessage, CallToolResult } from '@modelcontextprotocol/server';
import { Capture, arg } from '../lib/capture.js';
import { fixtureById, APP_RESOURCE, type Fixture } from '../fixtures/tool-results.js';
import { RawServer, fixtureCapabilities, fixtureToolDefinition, type EraPolicy } from './raw-jsonrpc.js';

const SERVER_INFO = { name: 'canimcp-probe-fixture', version: '0.1.0' };

type Mode = 'sdk' | 'mcpserver' | 'raw';

const fixture = fixtureById(arg('fixture'));
const mode = arg('mode', 'sdk') as Mode;
const transportKind = arg('transport', 'stdio') as 'stdio' | 'http';
const era = arg('era', 'both') as EraPolicy;
const captureDir = arg('capture');
const wire = new Capture(`${captureDir}/wire.jsonl`);
const log = (entry: Record<string, unknown>) => wire.write({ transport: transportKind, mode, ...entry });

// ---------------------------------------------------------------- SDK side

function sdkFactory(f: Fixture): McpServerFactory {
  return () => {
    if (mode === 'mcpserver') {
      const mcp = new McpServer(SERVER_INFO, { capabilities: fixtureCapabilities(f) });
      mcp.registerTool(
        f.tool,
        {
          description: f.description,
          inputSchema: fromJsonSchema({ type: 'object', properties: {}, additionalProperties: false }),
          ...(f.outputSchema ? { outputSchema: fromJsonSchema(f.outputSchema) } : {}),
          ...(f.toolMeta ? { _meta: f.toolMeta } : {}),
        },
        async () => f.result as unknown as CallToolResult
      );
      if (f.appResource) {
        mcp.registerResource('dashboard', APP_RESOURCE.uri, { mimeType: APP_RESOURCE.mimeType }, async () => ({
          contents: [{ uri: APP_RESOURCE.uri, mimeType: APP_RESOURCE.mimeType, text: APP_RESOURCE.text }],
        }));
      }
      return mcp;
    }
    const server = new Server(SERVER_INFO, { capabilities: fixtureCapabilities(f) });
    server.setRequestHandler('tools/list', async () => ({ tools: [fixtureToolDefinition(f)] }) as never);
    server.setRequestHandler('tools/call', async (req) => {
      const name = (req.params as { name: string }).name;
      if (name !== f.tool) throw new Error(`Unknown tool: ${name}`);
      return f.result as unknown as CallToolResult;
    });
    if (f.appResource) {
      server.setRequestHandler('resources/list', async () => ({
        resources: [{ uri: APP_RESOURCE.uri, name: 'dashboard', mimeType: APP_RESOURCE.mimeType }],
      }));
      server.setRequestHandler('resources/read', async () => ({
        contents: [{ uri: APP_RESOURCE.uri, mimeType: APP_RESOURCE.mimeType, text: APP_RESOURCE.text }],
      }));
    }
    return server;
  };
}

/** Wrap a transport so every message in or out is captured before the SDK sees it. */
function captured(inner: Transport): Transport {
  const wrapped: Transport = {
    start: () => inner.start(),
    send: (message, options) => {
      log({ dir: 'out', message });
      return inner.send(message, options);
    },
    close: () => inner.close(),
    get sessionId() {
      return inner.sessionId;
    },
  };
  Object.defineProperty(wrapped, 'onmessage', {
    set(handler: ((m: JSONRPCMessage, extra?: unknown) => void) | undefined) {
      inner.onmessage = handler
        ? (m, extra) => {
            log({ dir: 'in', message: m });
            handler(m, extra);
          }
        : undefined;
    },
    get() {
      return inner.onmessage;
    },
  });
  Object.defineProperty(wrapped, 'onerror', {
    set(h) {
      inner.onerror = h;
    },
    get() {
      return inner.onerror;
    },
  });
  Object.defineProperty(wrapped, 'onclose', {
    set(h) {
      inner.onclose = h;
    },
    get() {
      return inner.onclose;
    },
  });
  return wrapped;
}

// --------------------------------------------------------------- HTTP side

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function pickHeaders(h: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of ['mcp-protocol-version', 'mcp-session-id', 'content-type', 'accept', 'user-agent', 'authorization']) {
    const v = h[k];
    if (v !== undefined) out[k] = k === 'authorization' ? '<redacted>' : String(v);
  }
  return out;
}

function parseSseOrJson(text: string, contentType: string): unknown {
  if (contentType.includes('text/event-stream')) {
    const messages: unknown[] = [];
    for (const block of text.split(/\r?\n\r?\n/)) {
      const data = block
        .split(/\r?\n/)
        .filter((l) => l.startsWith('data:'))
        .map((l) => l.slice(5).trim())
        .join('\n');
      if (!data) continue;
      try {
        messages.push(JSON.parse(data));
      } catch {
        messages.push({ unparsed: data });
      }
    }
    return messages;
  }
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return { unparsed: text };
  }
}

async function serveHttp(port: number): Promise<void> {
  const raw = mode === 'raw' ? new RawServer({ fixture, era, serverInfo: SERVER_INFO }) : undefined;
  const handler = raw
    ? undefined
    : createMcpHandler(sdkFactory(fixture), { legacy: era === 'modern' ? 'reject' : 'stateless', onerror: (e) => log({ dir: 'error', error: String(e) }) });

  const server = createHttpServer(async (req, res) => {
    const body = await readBody(req);
    const bodyText = body.toString('utf8');
    const url = req.url ?? '/';
    const headers = pickHeaders(req.headers);
    let inbound: unknown = undefined;
    if (bodyText) {
      try {
        inbound = JSON.parse(bodyText);
      } catch {
        inbound = { unparsed: bodyText };
      }
    }
    log({ dir: 'in', http: { method: req.method, url, headers }, message: inbound });

    if (raw) {
      if (req.method === 'GET') {
        log({ dir: 'out', http: { status: 405 }, message: undefined });
        res.writeHead(405, { allow: 'POST, DELETE' }).end();
        return;
      }
      if (req.method === 'DELETE') {
        log({ dir: 'out', http: { status: 200 } });
        res.writeHead(200).end();
        return;
      }
      const headerVersion = typeof req.headers['mcp-protocol-version'] === 'string' ? req.headers['mcp-protocol-version'] : undefined;
      const messages = Array.isArray(inbound) ? inbound : [inbound];
      const replies = messages.map((m) => raw.handle((m ?? {}) as Record<string, unknown>, headerVersion));
      const responses = replies.map((r) => r.response).filter((r) => r !== undefined);
      const status = responses.length === 0 ? 202 : Math.max(...replies.map((r) => r.status));
      const payload = responses.length === 0 ? '' : responses.length === 1 && !Array.isArray(inbound) ? JSON.stringify(responses[0]) : JSON.stringify(responses);
      log({ dir: 'out', http: { status, headers: { 'content-type': 'application/json' } }, message: responses.length === 1 ? responses[0] : responses, revision: replies[0]?.revision });
      res.writeHead(status, payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {});
      res.end(payload);
      return;
    }

    // SDK path: adapt Node's request to a web-standard Request.
    const webHeaders = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v === undefined) continue;
      webHeaders.set(k, Array.isArray(v) ? v.join(', ') : v);
    }
    const request = new Request(`http://localhost:${port}${url}`, {
      method: req.method,
      headers: webHeaders,
      body: req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE' ? undefined : new Uint8Array(body),
    });
    const response = await (handler as NonNullable<typeof handler>).fetch(request);
    const outHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => {
      outHeaders[k] = v;
    });
    if (req.method === 'GET') {
      // A long-lived stream. Pipe it through without buffering.
      log({ dir: 'out', http: { status: response.status, headers: outHeaders }, message: '<stream>' });
      res.writeHead(response.status, outHeaders);
      if (!response.body) {
        res.end();
        return;
      }
      const reader = response.body.getReader();
      const pump = async () => {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      };
      pump().catch(() => res.end());
      req.on('close', () => reader.cancel().catch(() => undefined));
      return;
    }
    const text = await response.text();
    const parsed = parseSseOrJson(text, outHeaders['content-type'] ?? '');
    log({ dir: 'out', http: { status: response.status, headers: outHeaders }, message: parsed });
    delete outHeaders['content-length'];
    res.writeHead(response.status, { ...outHeaders, 'content-length': Buffer.byteLength(text) });
    res.end(text);
  });

  await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));
  process.stderr.write(`fixture-server listening http://127.0.0.1:${port}/mcp mode=${mode} fixture=${fixture.id}\n`);
  const shutdown = () => {
    handler?.close().catch(() => undefined);
    server.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// -------------------------------------------------------------- stdio side

function serveStdioRaw(): void {
  const raw = new RawServer({ fixture, era, serverInfo: SERVER_INFO });
  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on('line', (line) => {
    if (!line.trim()) return;
    let message: Record<string, unknown>;
    try {
      message = JSON.parse(line);
    } catch {
      log({ dir: 'in', message: { unparsed: line } });
      return;
    }
    log({ dir: 'in', message });
    const reply = raw.handle(message);
    if (reply.response) {
      log({ dir: 'out', message: reply.response, revision: reply.revision });
      process.stdout.write(JSON.stringify(reply.response) + '\n');
    }
  });
  rl.on('close', () => process.exit(0));
}

function serveStdioSdk(): void {
  const transport = captured(new StdioServerTransport());
  serveStdio(sdkFactory(fixture), {
    transport,
    legacy: era === 'modern' ? 'reject' : 'serve',
    onerror: (e) => log({ dir: 'error', error: String(e) }),
  });
}

if (transportKind === 'http') {
  await serveHttp(Number(arg('port')));
} else if (mode === 'raw') {
  serveStdioRaw();
} else {
  serveStdioSdk();
}

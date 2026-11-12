// The mock model endpoint. Logs every request body and replays a scripted
// turn: turn 1 calls the fixture tool, turn 2 ends with text.
//
//   node dist/mock-model/server.js --port 4201 --capture runs/x --tool probe_summary_and_data [--script path.js]
//
// Serves OpenAI Chat Completions (/v1/chat/completions), OpenAI Responses
// (/v1/responses), Anthropic Messages (/v1/messages) and Gemini generateContent
// (/v1beta/models/<model>:generateContent, :streamGenerateContent?alt=sse),
// streaming or not, with or without the version prefix. Everything else is
// logged and answered 404.
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { pathToFileURL } from 'node:url';
import { Capture, arg } from '../lib/capture.js';
import { decide, type Decision, type ScriptContext, type Script } from './script.js';
import { chatResponse, responsesResponse, anthropicResponse, geminiResponse } from './apis.js';

const port = Number(arg('port'));
const captureDir = arg('capture');
const fixtureTool = arg('tool');
const scriptPath = arg('script', '');
const toolArgs = JSON.parse(arg('args', '{}')) as Record<string, unknown>;
const capture = new Capture(`${captureDir}/model.jsonl`);

let script: Script | undefined;
if (scriptPath) {
  const mod = (await import(pathToFileURL(scriptPath).href)) as { default: Script };
  script = mod.default;
}

type Api = 'chat' | 'responses' | 'anthropic' | 'gemini';

function apiFor(url: string): Api | undefined {
  // Match on the path: the Anthropic SDK's beta endpoint posts to /v1/messages?beta=true.
  const path = url.split('?')[0];
  if (/\/chat\/completions\/?$/.test(path)) return 'chat';
  if (/\/responses\/?$/.test(path)) return 'responses';
  if (/\/messages\/?$/.test(path)) return 'anthropic';
  if (/\/models\/[^/?]+:(?:stream)?[gG]enerateContent$/.test(path)) return 'gemini';
  return undefined;
}

/** Gemini puts the model in the path and the stream flag in the method name, not the body. */
function geminiModel(url: string): string | undefined {
  const m = url.match(/\/models\/([^/?:]+):/);
  return m ? m[1] : undefined;
}

export interface OfferedTool {
  name: string;
  description?: string;
  parameters?: unknown;
  /** Responses API namespace tools nest functions; the call back must name the namespace. */
  namespace?: string;
}

export interface ToolResultSeen {
  callId?: string;
  /** The tool result payload exactly as the client put it in the request. */
  payload: unknown;
  /** Where in the request body it sat. */
  path: string;
}

function offeredTools(api: Api, body: Record<string, unknown>): OfferedTool[] {
  const tools = Array.isArray(body.tools) ? (body.tools as Array<Record<string, unknown>>) : [];
  const out: OfferedTool[] = [];
  for (const t of tools) {
    if (api === 'chat') {
      const fn = (t.function ?? {}) as Record<string, unknown>;
      out.push({ name: String(fn.name ?? t.name ?? ''), description: fn.description as string | undefined, parameters: fn.parameters });
    } else if (api === 'responses') {
      if (t.type === 'namespace' && Array.isArray(t.tools)) {
        for (const inner of t.tools as Array<Record<string, unknown>>) {
          out.push({ name: String(inner.name ?? ''), description: inner.description as string | undefined, parameters: inner.parameters, namespace: String(t.name ?? '') });
        }
      } else {
        out.push({ name: String(t.name ?? t.type ?? ''), description: t.description as string | undefined, parameters: t.parameters });
      }
    } else if (api === 'gemini') {
      // tools[].functionDeclarations[]; google-genai 2.34 sends parameters, or parameters_json_schema in snake case.
      const decls = Array.isArray(t.functionDeclarations) ? (t.functionDeclarations as Array<Record<string, unknown>>) : [];
      for (const fn of decls) out.push({ name: String(fn.name ?? ''), description: fn.description as string | undefined, parameters: fn.parameters ?? fn.parametersJsonSchema ?? fn.parameters_json_schema });
    } else {
      out.push({ name: String(t.name ?? ''), description: t.description as string | undefined, parameters: t.input_schema });
    }
  }
  return out;
}

function toolResults(api: Api, body: Record<string, unknown>): ToolResultSeen[] {
  const out: ToolResultSeen[] = [];
  if (api === 'chat') {
    const messages = Array.isArray(body.messages) ? (body.messages as Array<Record<string, unknown>>) : [];
    messages.forEach((m, i) => {
      if (m.role === 'tool') out.push({ callId: m.tool_call_id as string | undefined, payload: m.content, path: `messages[${i}].content` });
    });
  } else if (api === 'responses') {
    const input = Array.isArray(body.input) ? (body.input as Array<Record<string, unknown>>) : [];
    input.forEach((item, i) => {
      if (item.type === 'function_call_output') out.push({ callId: item.call_id as string | undefined, payload: item.output, path: `input[${i}].output` });
      if (item.type === 'custom_tool_call_output') out.push({ callId: item.call_id as string | undefined, payload: item.output, path: `input[${i}].output` });
    });
  } else if (api === 'gemini') {
    // contents[].parts[].functionResponse: {id?, name, response}; the response object is the tool result payload.
    const contents = Array.isArray(body.contents) ? (body.contents as Array<Record<string, unknown>>) : [];
    contents.forEach((c, i) => {
      const parts = Array.isArray(c.parts) ? (c.parts as Array<Record<string, unknown>>) : [];
      parts.forEach((p, j) => {
        const fr = p.functionResponse as Record<string, unknown> | undefined;
        if (fr) out.push({ callId: fr.id as string | undefined, payload: fr.response, path: `contents[${i}].parts[${j}].functionResponse.response` });
      });
    });
  } else {
    const messages = Array.isArray(body.messages) ? (body.messages as Array<Record<string, unknown>>) : [];
    messages.forEach((m, i) => {
      const content = m.content;
      if (!Array.isArray(content)) return;
      (content as Array<Record<string, unknown>>).forEach((block, j) => {
        if (block.type === 'tool_result') out.push({ callId: block.tool_use_id as string | undefined, payload: block.content, path: `messages[${i}].content[${j}].content` });
      });
    });
  }
  return out;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function pickHeaders(req: IncomingMessage): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of ['content-type', 'accept', 'user-agent', 'anthropic-version', 'anthropic-beta', 'openai-beta', 'x-stainless-lang', 'originator', 'authorization', 'x-api-key', 'x-goog-api-key', 'x-goog-api-client']) {
    const v = req.headers[k];
    if (v !== undefined) out[k] = k === 'authorization' || k === 'x-api-key' || k === 'x-goog-api-key' ? '<redacted>' : String(v);
  }
  return out;
}

let requestCounter = 0;

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url ?? '/';
  const text = await readBody(req);
  let body: Record<string, unknown> = {};
  if (text) {
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      body = { unparsed: text };
    }
  }
  const seq = ++requestCounter;
  const api = apiFor(url);
  const headers = pickHeaders(req);

  if (req.method === 'GET' && /\/models\/?$/.test(url.split('?')[0])) {
    const payload = { object: 'list', data: [{ id: 'gpt-probe', object: 'model', created: 0, owned_by: 'canimcp' }] };
    capture.write({ seq, kind: 'request', method: req.method, url, headers, api: 'models' });
    capture.write({ seq, kind: 'response', status: 200, body: payload });
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(payload));
    return;
  }

  if (!api || req.method !== 'POST') {
    capture.write({ seq, kind: 'request', method: req.method, url, headers, body });
    capture.write({ seq, kind: 'response', status: 404 });
    res.writeHead(404, { 'content-type': 'application/json' }).end(JSON.stringify({ error: { message: `mock model: no route for ${req.method} ${url}` } }));
    return;
  }

  const offered = offeredTools(api, body);
  const results = toolResults(api, body);
  const stream = api === 'gemini' ? /streamGenerateContent/.test(url) : body.stream === true;
  capture.write({
    seq,
    kind: 'request',
    method: req.method,
    url,
    headers,
    api,
    stream,
    offeredTools: offered.map((t) => (t.namespace ? `${t.namespace}/${t.name}` : t.name)),
    toolResults: results,
    body,
  });

  const ctx: ScriptContext = { api, fixtureTool, toolArgs, offeredTools: offered, toolResults: results, body, seq };
  let decision: Decision;
  try {
    decision = decide(ctx, script);
  } catch (e) {
    decision = { type: 'text', text: `script error: ${String(e)}` };
  }
  capture.write({ seq, kind: 'decision', decision });
  // A script may hold the reply, for clients that start the turn before their MCP servers are ready.
  if (decision.delayMs) await new Promise((r) => setTimeout(r, decision.delayMs));

  const model = String(body.model ?? (api === 'gemini' ? geminiModel(url) : undefined) ?? 'gpt-probe');
  const reply =
    api === 'chat'
      ? chatResponse(decision, model, stream)
      : api === 'responses'
        ? responsesResponse(decision, model, stream, body)
        : api === 'gemini'
          ? geminiResponse(decision, model, stream)
          : anthropicResponse(decision, model, stream);
  capture.write({ seq, kind: 'response', status: 200, stream, body: reply.logged });
  res.writeHead(200, reply.headers);
  res.end(reply.text);
});

server.listen(port, '127.0.0.1', () => {
  process.stderr.write(`mock-model listening http://127.0.0.1:${port} tool=${fixtureTool}\n`);
});
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

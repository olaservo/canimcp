// A hand-written MCP server for results the SDK will not send unchanged.
// Speaks the 2025 initialize handshake and the 2026-07-28 per-request
// envelope. tools/call returns the fixture's result value byte for byte.
import type { Fixture } from '../fixtures/tool-results.js';
import { APP_RESOURCE } from '../fixtures/tool-results.js';

export const LEGACY_VERSIONS = ['2024-11-05', '2025-03-26', '2025-06-18', '2025-11-25'];
export const MODERN_VERSIONS = ['2026-07-28'];
const META_VERSION = 'io.modelcontextprotocol/protocolVersion';
const META_SERVER_INFO = 'io.modelcontextprotocol/serverInfo';

/** Which eras the server answers. `legacy` hides server/discover so clients fall back to initialize. */
export type EraPolicy = 'both' | 'legacy' | 'modern';

export interface RawServerOptions {
  fixture: Fixture;
  era: EraPolicy;
  serverInfo: { name: string; version: string };
}

type Json = Record<string, unknown>;

export interface RawReply {
  /** JSON-RPC response to send, or undefined for notifications. */
  response?: Json;
  /** HTTP status to use when the transport is HTTP. */
  status: number;
  /** The negotiated or claimed protocol revision for this message, when known. */
  revision?: string;
}

export function fixtureCapabilities(fixture: Fixture): Json {
  const caps: Json = { tools: {} };
  if (fixture.appResource) caps.resources = {};
  return caps;
}

export function fixtureToolDefinition(fixture: Fixture): Json {
  const def: Json = {
    name: fixture.tool,
    description: fixture.description,
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  };
  if (fixture.outputSchema) def.outputSchema = fixture.outputSchema;
  if (fixture.toolMeta) def._meta = fixture.toolMeta;
  return def;
}

export class RawServer {
  constructor(private readonly opts: RawServerOptions) {}

  /** Handle one JSON-RPC message. `headerVersion` is the MCP-Protocol-Version header on HTTP. */
  handle(message: Json, headerVersion?: string): RawReply {
    const id = message.id as string | number | undefined;
    const method = message.method as string | undefined;
    const params = (message.params ?? {}) as Json;
    const meta = (params._meta ?? {}) as Json;
    const claimed = meta[META_VERSION] as string | undefined;
    const modern = claimed !== undefined;

    const err = (code: number, msg: string, status = 200, data?: unknown): RawReply => ({
      status,
      response: {
        jsonrpc: '2.0',
        id: id ?? null,
        error: data === undefined ? { code, message: msg } : { code, message: msg, data },
      },
    });
    const ok = (result: Json, revision?: string): RawReply => ({ status: 200, revision, response: { jsonrpc: '2.0', id, result } });

    if (method === undefined) return { status: 202 };

    if (modern) {
      if (this.opts.era === 'legacy') return err(-32022, 'Unsupported protocol version', 400, { supported: LEGACY_VERSIONS, requested: claimed });
      if (!MODERN_VERSIONS.includes(claimed as string)) return err(-32022, 'Unsupported protocol version', 400, { supported: MODERN_VERSIONS, requested: claimed });
      if (headerVersion !== undefined && headerVersion !== claimed) return err(-32020, 'MCP-Protocol-Version header does not match _meta protocolVersion', 400);
      const stamp = (result: Json, cacheable: boolean): Json => {
        const out: Json = { ...result, resultType: 'complete' };
        if (cacheable) {
          out.ttlMs = 0;
          out.cacheScope = 'private';
        }
        out._meta = { ...(result._meta as Json | undefined), [META_SERVER_INFO]: this.opts.serverInfo };
        return out;
      };
      switch (method) {
        case 'server/discover':
          return ok(stamp({ supportedVersions: MODERN_VERSIONS, capabilities: fixtureCapabilities(this.opts.fixture) }, true), claimed);
        case 'tools/list':
          return ok(stamp({ tools: [fixtureToolDefinition(this.opts.fixture)] }, true), claimed);
        case 'tools/call':
          return this.call(params, id, claimed, true);
        case 'resources/list':
          return ok(stamp({ resources: this.resources() }, true), claimed);
        case 'resources/read':
          return ok(stamp({ contents: [{ uri: APP_RESOURCE.uri, mimeType: APP_RESOURCE.mimeType, text: APP_RESOURCE.text }] }, true), claimed);
        default:
          if (id === undefined) return { status: 202, revision: claimed };
          return err(-32601, `Method not found: ${method}`, 404);
      }
    }

    // Legacy era: initialize handshake.
    if (this.opts.era === 'modern' && method !== 'server/discover') {
      return err(-32022, 'Unsupported protocol version', 400, { supported: MODERN_VERSIONS, requested: params.protocolVersion ?? null });
    }
    switch (method) {
      case 'server/discover':
        // A discover probe without an envelope. A legacy-only server does not know the method.
        if (this.opts.era === 'legacy') return err(-32601, 'Method not found: server/discover', 404);
        return ok({
          supportedVersions: MODERN_VERSIONS,
          capabilities: fixtureCapabilities(this.opts.fixture),
          resultType: 'complete',
          ttlMs: 0,
          cacheScope: 'private',
          _meta: { [META_SERVER_INFO]: this.opts.serverInfo },
        });
      case 'initialize': {
        const requested = params.protocolVersion as string | undefined;
        const version = requested && LEGACY_VERSIONS.includes(requested) ? requested : '2025-11-25';
        return ok({ protocolVersion: version, capabilities: fixtureCapabilities(this.opts.fixture), serverInfo: this.opts.serverInfo }, version);
      }
      case 'notifications/initialized':
        return { status: 202 };
      case 'ping':
        return ok({});
      case 'tools/list':
        return ok({ tools: [fixtureToolDefinition(this.opts.fixture)] }, headerVersion);
      case 'tools/call':
        return this.call(params, id, headerVersion, false);
      case 'resources/list':
        return ok({ resources: this.resources() }, headerVersion);
      case 'resources/read':
        return ok({ contents: [{ uri: APP_RESOURCE.uri, mimeType: APP_RESOURCE.mimeType, text: APP_RESOURCE.text }] }, headerVersion);
      default:
        if (id === undefined) return { status: 202 };
        return err(-32601, `Method not found: ${method}`);
    }
  }

  private resources(): Json[] {
    return this.opts.fixture.appResource ? [{ uri: APP_RESOURCE.uri, name: 'dashboard', mimeType: APP_RESOURCE.mimeType }] : [];
  }

  private call(params: Json, id: string | number | undefined, revision: string | undefined, modern: boolean): RawReply {
    const name = params.name as string;
    if (name !== this.opts.fixture.tool) {
      return { status: 200, revision, response: { jsonrpc: '2.0', id, error: { code: -32602, message: `Unknown tool: ${name}` } } };
    }
    // The fixture's result object is the result value. The 2026 era requires
    // resultType on every result, so it is added there and nowhere else.
    const result: Json = modern ? { ...this.opts.fixture.result, resultType: 'complete' } : { ...this.opts.fixture.result };
    return { status: 200, revision, response: { jsonrpc: '2.0', id, result } };
  }
}

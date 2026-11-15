// Turns one run's wire capture into a negotiation observation: which version
// the client proposed and how, what the server answered, and what the client
// sent afterwards.
import { readFileSync, existsSync } from 'node:fs';

const META_VERSION = 'io.modelcontextprotocol/protocolVersion';

export interface HandshakeStep {
  /** `in` is the client's request, `out` the server's answer to it. */
  dir: 'in' | 'out';
  method: 'initialize' | 'server/discover';
  /** in: the version the client proposed. out: the version in the initialize result. */
  version?: string;
  /** out, server/discover: the versions the server listed. */
  supportedVersions?: string[];
  /** out: the JSON-RPC error code, when the server refused. */
  errorCode?: number;
}

export interface NegotiationObservation {
  type: 'protocol.negotiation';
  /** The version the fixture server was told to put in every initialize result. Absent: it echoed the client's. */
  forcedReply?: string;
  /** initialize and server/discover requests and their answers, in wire order. */
  handshake: HandshakeStep[];
  /** notifications/initialized was seen. */
  initializedSent: boolean;
  /** Methods the client sent after the handshake, in order of first appearance. */
  followUps: string[];
  /** Distinct per-request _meta protocol versions on those messages. */
  requestMetaVersions: string[];
  /** Distinct MCP-Protocol-Version header values on those messages (HTTP). */
  headerVersions: string[];
  /** tools/call was seen on the wire. */
  toolCalled: boolean;
  /** The revision the client used after the handshake: the per-request _meta version if it sent one, else the last initialize result. */
  negotiatedRevision?: string;
  notes: string[];
}

interface WireLine {
  dir: 'in' | 'out' | 'error';
  message?: unknown;
  http?: { headers?: Record<string, string> };
}

function readJsonl<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as T);
}

export function classifyNegotiation(runDir: string, forcedReply?: string): NegotiationObservation {
  const wire = readJsonl<WireLine>(`${runDir}/wire.jsonl`);
  const handshake: HandshakeStep[] = [];
  const pending = new Map<string, HandshakeStep['method']>();
  const followUps: string[] = [];
  const requestMetaVersions: string[] = [];
  const headerVersions: string[] = [];
  const notes: string[] = [];
  let initializedSent = false;
  let toolCalled = false;
  let lastInitializeResult: string | undefined;

  for (const line of wire) {
    // HTTP captures hold batches and SSE frames as arrays; stdio captures hold one message.
    const messages = Array.isArray(line.message) ? (line.message as unknown[]) : [line.message];
    for (const msg of messages) {
      const m = msg as Record<string, unknown> | undefined;
      if (!m || typeof m !== 'object') continue;
      const params = (m.params ?? {}) as Record<string, unknown>;
      const meta = (params._meta ?? {}) as Record<string, unknown>;
      const metaVersion = typeof meta[META_VERSION] === 'string' ? (meta[META_VERSION] as string) : undefined;

      if (line.dir === 'in' && typeof m.method === 'string') {
        if (m.method === 'initialize' || m.method === 'server/discover') {
          const version = m.method === 'initialize' ? (typeof params.protocolVersion === 'string' ? params.protocolVersion : undefined) : metaVersion;
          handshake.push({ dir: 'in', method: m.method, ...(version ? { version } : {}) });
          if (m.id !== undefined) pending.set(String(m.id), m.method);
          continue;
        }
        if (m.method === 'notifications/initialized') initializedSent = true;
        else if (!followUps.includes(m.method)) followUps.push(m.method);
        if (m.method === 'tools/call') toolCalled = true;
        if (metaVersion && !requestMetaVersions.includes(metaVersion)) requestMetaVersions.push(metaVersion);
        const header = line.http?.headers?.['mcp-protocol-version'];
        if (header && !headerVersions.includes(header)) headerVersions.push(header);
      }

      if (line.dir === 'out' && m.id !== undefined && pending.has(String(m.id))) {
        const method = pending.get(String(m.id)) as HandshakeStep['method'];
        pending.delete(String(m.id));
        const step: HandshakeStep = { dir: 'out', method };
        const result = m.result as Record<string, unknown> | undefined;
        const error = m.error as { code?: unknown } | undefined;
        if (error && typeof error.code === 'number') step.errorCode = error.code;
        if (result && typeof result.protocolVersion === 'string') {
          step.version = result.protocolVersion;
          lastInitializeResult = result.protocolVersion;
        }
        if (result && Array.isArray(result.supportedVersions)) step.supportedVersions = result.supportedVersions.map(String);
        handshake.push(step);
      }
    }
  }

  if (handshake.length === 0) notes.push('the client sent neither initialize nor server/discover');
  if (requestMetaVersions.length > 1) notes.push('more than one per-request _meta protocol version after the handshake');
  if (headerVersions.length > 1) notes.push('more than one MCP-Protocol-Version header value after the handshake');

  const negotiatedRevision = requestMetaVersions[requestMetaVersions.length - 1] ?? lastInitializeResult;
  return {
    type: 'protocol.negotiation',
    ...(forcedReply ? { forcedReply } : {}),
    handshake,
    initializedSent,
    followUps,
    requestMetaVersions,
    headerVersions,
    toolCalled,
    ...(negotiatedRevision ? { negotiatedRevision } : {}),
    notes,
  };
}

/** A one-line reading of the observation. */
export function negotiationVerdict(o: NegotiationObservation): string {
  if (o.handshake.length === 0) return 'no initialize or server/discover on the wire';
  const parts: string[] = [];
  for (const step of o.handshake) {
    if (step.dir === 'in') {
      parts.push(`${step.method} at ${step.version ?? '(no version)'}`);
      continue;
    }
    const answer = step.errorCode !== undefined ? `error ${step.errorCode}` : step.method === 'initialize' ? (step.version ?? 'no protocolVersion') : `supported ${(step.supportedVersions ?? []).join(', ') || '(none listed)'}`;
    parts[parts.length - 1] += ` → ${answer}`;
  }
  const sent = [...(o.initializedSent ? ['notifications/initialized'] : []), ...o.followUps];
  const after = sent.length === 0 ? 'client sent nothing further' : `client continued${o.negotiatedRevision ? ` at ${o.negotiatedRevision}` : ''} (${sent.join(', ')})`;
  return `${parts.join('; then ')}; ${after}`;
}

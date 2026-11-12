// Turns one run's captures into a probe observation: which markers reached
// the model, in what order, how often, in what form, plus any placeholder,
// and whether the tool was offered to the model at all.
import { readFileSync, existsSync } from 'node:fs';
import { MARK, fixtureById, type Fixture } from '../fixtures/tool-results.js';
import { matchesFixtureTool } from '../mock-model/script.js';

export type MarkerKey = keyof typeof MARK;

export interface MarkerHit {
  marker: MarkerKey;
  count: number;
  /** Character offset of the first hit inside the serialized payload. */
  firstIndex: number;
}

export type PayloadForm = 'text' | 'json' | 'envelope' | 'blocks' | 'empty' | 'unknown';

export interface ToolResultObservation {
  type: 'tools.result';
  fixture: string;
  /** How the client sent the result to the model: the provider API it used. */
  api?: 'chat' | 'responses' | 'anthropic' | 'gemini';
  /** Was a tool matching the fixture offered in any model request? */
  toolOffered: boolean;
  /** The tool name as the client offered it. */
  offeredAs?: string;
  /** Did the client call the tool on the wire? */
  toolCalled: boolean;
  /** Did a tool result reach the model at all? */
  resultSentToModel: boolean;
  /** The tool result payload as the client put it in the model request, serialized. Truncated past 4000 chars. */
  payloadExcerpt?: string;
  payloadBytes?: number;
  form: PayloadForm;
  /** Markers found in the payload, in order of first appearance. */
  markers: MarkerHit[];
  /** The payload text when no marker reached the model, which is where placeholders show up. */
  placeholder?: string;
  /** Image data reached the model as an image part of the provider API, as text, or not at all. */
  image?: 'image-part' | 'base64-text' | 'absent';
  /** The protocol revision the client negotiated with the fixture server, as seen on the wire. */
  negotiatedRevision?: string;
  /** Which server path served the fixture. */
  serverMode: 'sdk' | 'mcpserver' | 'raw';
  /** The result as the fixture server sent it, when the capture has it. */
  sentResult?: unknown;
  /** Did the server send the fixture unchanged? */
  sentUnchanged?: boolean;
  /** The payload is a client or SDK error message, not the fixture's fields. Markers inside it are the rejected value echoed back. */
  clientError?: boolean;
  /** Free-form notes the classifier adds when it sees something odd. */
  notes: string[];
  /** The client's final text, when the capture has it. */
  finalText?: string;
}

interface WireLine {
  dir: 'in' | 'out' | 'error';
  mode?: string;
  message?: unknown;
  revision?: string;
  http?: { headers?: Record<string, string>; status?: number };
}

interface ModelLine {
  kind: 'request' | 'response' | 'decision';
  seq: number;
  api?: 'chat' | 'responses' | 'anthropic' | 'gemini';
  offeredTools?: string[];
  toolResults?: Array<{ callId?: string; payload: unknown; path: string }>;
  body?: Record<string, unknown>;
  decision?: { type: 'call' | 'text'; tool?: string; callId?: string; args?: Record<string, unknown> };
}

/** Error prefixes a client or SDK puts in front of a rejected result. Only consulted on the fixtures the SDK may reject. */
const CLIENT_ERROR = /validation error|Invalid structured content|Invalid result for tools\/call|Error executing|Failed to call_tool|Unexpected error during MCP tool execution|MCP error -32|Tool execution failed|Failed to parse server response|Structured content does not match|failed:|"error"\s*:/i;
const SDK_REJECTABLE = new Set(['schema_mismatch', 'sc_string', 'sc_null', 'no_content_key', 'empty_object']);

/** Text-like provider blocks (Anthropic text, Responses input_text, chat parts) joined into one string, or undefined. */
function blocksText(payload: unknown): string | undefined {
  if (!Array.isArray(payload) || payload.length === 0) return undefined;
  const texts: string[] = [];
  for (const p of payload) {
    if (typeof p === 'string') texts.push(p);
    else if (p && typeof p === 'object' && typeof (p as { text?: unknown }).text === 'string' && /^(text|input_text|output_text)$/.test(String((p as { type?: unknown }).type))) texts.push((p as { text: string }).text);
    else return undefined;
  }
  return texts.join('\n');
}

/** A client-added prefix such as codex's "Wall time: … Output:" line, when the rest of the text is JSON. */
function splitHeader(text: string): { header: string; json: unknown } | undefined {
  // The header itself may contain brackets (fx: "[Tool images were retained but not sent ...]"),
  // so try each opening bracket in the first 400 characters until the remainder parses.
  const re = /[[{]/g;
  let m: RegExpExecArray | null;
  let attempts = 0;
  while ((m = re.exec(text)) && m.index <= 400 && attempts < 12) {
    attempts++;
    if (m.index === 0) continue;
    try {
      return { header: text.slice(0, m.index).trim(), json: JSON.parse(text.slice(m.index)) };
    } catch {
      // try the next bracket
    }
  }
  return undefined;
}

function readJsonl<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as T);
}

function serialize(payload: unknown): string {
  return typeof payload === 'string' ? payload : JSON.stringify(payload);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
}

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) out[k] = sortKeys((v as Record<string, unknown>)[k]);
    return out;
  }
  return v;
}

/** Classify how the payload carries the fixture's fields. */
function formOf(payload: unknown, fixture: Fixture): PayloadForm {
  if (payload === undefined || payload === null || payload === '' || (Array.isArray(payload) && payload.length === 0)) return 'empty';
  // Provider-native block arrays (Anthropic content, chat content parts).
  if (Array.isArray(payload)) {
    const texts = payload.filter((p) => p && typeof p === 'object' && (p as { type?: string }).type === 'text');
    if (texts.length === payload.length && texts.length === 1) return formOf((texts[0] as { text?: unknown }).text, fixture);
    return 'blocks';
  }
  let value: unknown = payload;
  if (typeof payload === 'string') {
    try {
      value = JSON.parse(payload);
    } catch {
      return 'text';
    }
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const hasEnvelopeKeys = 'content' in obj || 'structuredContent' in obj || 'isError' in obj;
    if (hasEnvelopeKeys) return 'envelope';
    // Nested envelopes such as fx's {server, tool, result: {content, ...}}.
    for (const v of Object.values(obj)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const inner = v as Record<string, unknown>;
        if ('content' in inner || 'structuredContent' in inner) return 'envelope';
      }
    }
    if (fixture.result.structuredContent !== undefined && deepEqual(value, fixture.result.structuredContent)) return 'json';
    return 'json';
  }
  if (Array.isArray(value)) return 'json';
  return typeof payload === 'string' ? 'text' : 'json';
}

function countMarkers(text: string): MarkerHit[] {
  const hits: MarkerHit[] = [];
  for (const key of Object.keys(MARK) as MarkerKey[]) {
    const marker = MARK[key];
    let count = 0;
    let idx = text.indexOf(marker);
    const first = idx;
    while (idx >= 0) {
      count++;
      idx = text.indexOf(marker, idx + marker.length);
    }
    if (count > 0) hits.push({ marker: key, count, firstIndex: first });
  }
  return hits.sort((a, b) => a.firstIndex - b.firstIndex);
}

function imageDelivery(api: ModelLine['api'], body: Record<string, unknown> | undefined, serialized: string, payload: unknown): ToolResultObservation['image'] {
  const whole = JSON.stringify(body ?? {});
  // A provider image block inside the tool result payload (Anthropic tool_result content, chat image_url parts).
  const isImagePart = (v: unknown): boolean =>
    Array.isArray(v) ? v.some(isImagePart) : !!v && typeof v === 'object' && /^(image|image_url|input_image)$/.test(String((v as { type?: unknown }).type)) && JSON.stringify(v).includes(MARK.image);
  if (isImagePart(payload)) return 'image-part';
  if (serialized.includes(MARK.image)) return 'base64-text';
  if (!whole.includes(MARK.image)) return 'absent';
  // The data appears somewhere other than the tool result payload text: an image part.
  if (api === 'chat' && /"type":"image_url"/.test(whole)) return 'image-part';
  if (api === 'responses' && /"type":"input_image"/.test(whole)) return 'image-part';
  if (api === 'anthropic' && /"type":"image"/.test(whole)) return 'image-part';
  return 'image-part';
}

export function classify(runDir: string, fixtureId: string, serverMode: ToolResultObservation['serverMode'], finalText?: string): ToolResultObservation {
  const fixture = fixtureById(fixtureId);
  const wire = readJsonl<WireLine>(`${runDir}/wire.jsonl`);
  const model = readJsonl<ModelLine>(`${runDir}/model.jsonl`);
  const notes: string[] = [];

  // Wire side: was the tool called, what revision, what did the server send.
  let toolCalled = false;
  let negotiatedRevision: string | undefined;
  let sentResult: unknown;
  for (const line of wire) {
    // HTTP captures hold batches and SSE frames as arrays; stdio captures hold one message.
    const messages = Array.isArray(line.message) ? (line.message as unknown[]) : [line.message];
    for (const msg of messages) {
      const m = msg as Record<string, unknown> | undefined;
      if (!m || typeof m !== 'object') continue;
      if (line.dir === 'in' && m.method === 'tools/call') toolCalled = true;
      if (line.dir === 'in' && m.method === 'initialize') {
        const p = (m.params ?? {}) as Record<string, unknown>;
        if (typeof p.protocolVersion === 'string') negotiatedRevision = negotiatedRevision ?? `requested:${p.protocolVersion}`;
      }
      if (line.dir === 'out' && m.result && typeof m.result === 'object' && 'protocolVersion' in (m.result as object)) {
        negotiatedRevision = String((m.result as Record<string, unknown>).protocolVersion);
      }
      const meta = ((m.params ?? {}) as Record<string, unknown>)._meta as Record<string, unknown> | undefined;
      if (line.dir === 'in' && meta && typeof meta['io.modelcontextprotocol/protocolVersion'] === 'string') {
        negotiatedRevision = meta['io.modelcontextprotocol/protocolVersion'] as string;
      }
    }
    if (line.dir === 'out' && line.revision && !negotiatedRevision) negotiatedRevision = line.revision;
  }
  // The result the server sent for the fixture tool: the out message whose id matches a tools/call in.
  const callIds = new Set<string>();
  for (const line of wire) {
    const m = line.message as Record<string, unknown> | undefined;
    if (line.dir === 'in' && m && m.method === 'tools/call' && m.id !== undefined) callIds.add(String(m.id));
  }
  for (const line of wire) {
    const messages = Array.isArray(line.message) ? (line.message as unknown[]) : [line.message];
    for (const msg of messages) {
      const m = msg as Record<string, unknown> | undefined;
      if (line.dir === 'out' && m && m.id !== undefined && callIds.has(String(m.id)) && 'result' in m) sentResult = m.result;
    }
  }
  let sentUnchanged: boolean | undefined;
  if (sentResult !== undefined) {
    const stripped = { ...(sentResult as Record<string, unknown>) };
    delete stripped.resultType;
    if (stripped._meta && typeof stripped._meta === 'object') {
      const meta = { ...(stripped._meta as Record<string, unknown>) };
      delete meta['io.modelcontextprotocol/serverInfo'];
      if (Object.keys(meta).length === 0) delete stripped._meta;
      else stripped._meta = meta;
    }
    sentUnchanged = deepEqual(stripped, fixture.result);
    if (!sentUnchanged) notes.push('server sent a reshaped result; compare sentResult with the fixture');
  }

  // Model side.
  const requests = model.filter((l) => l.kind === 'request' && (l.api === 'chat' || l.api === 'responses' || l.api === 'anthropic' || l.api === 'gemini'));
  let toolOffered = false;
  let offeredAs: string | undefined;
  let api: ModelLine['api'];
  for (const r of requests) {
    api = api ?? r.api;
    for (const name of r.offeredTools ?? []) {
      if (matchesFixtureTool(name, fixture.tool)) {
        toolOffered = true;
        offeredAs = offeredAs ?? name;
      }
    }
  }
  // Indirect routes: the model never sees the fixture tool by name but reaches it through a
  // script or bridge tool (pi codemode, opencode execute, eve__tool, deepagents js_eval), or the
  // client hashes the name (crewAI). The mock's decision line records what it called and with what.
  const calls = model.filter((l) => l.kind === 'decision' && l.decision?.type === 'call' && l.decision.tool);
  const indirect = calls.find((l) => {
    const d = l.decision!;
    if (matchesFixtureTool(d.tool as string, fixture.tool)) return false;
    return JSON.stringify(d.args ?? {}).includes(fixture.tool) || (d.callId ?? '').startsWith('call_probe_fixture');
  });
  if (!toolOffered && indirect) {
    toolOffered = true;
    offeredAs = `${indirect.decision!.tool} (indirect: ${fixture.tool})`;
    notes.push('fixture tool reached through another tool, not offered to the model by name');
  } else if (!toolOffered && toolCalled && calls.length > 0 && requests.some((r) => (r.toolResults ?? []).length > 0)) {
    toolOffered = true;
    offeredAs = `${calls[calls.length - 1].decision!.tool} (renamed)`;
    notes.push('tool offered under a name the matcher did not recognise; the mock called it and a result came back');
  }
  const withResults = requests.filter((r) => (r.toolResults ?? []).length > 0);
  let last = withResults[withResults.length - 1];
  // Hosts without a model (the SDK reference clients) write what callTool returned instead.
  if (requests.length === 0 && existsSync(`${runDir}/host-result.json`)) {
    const host = JSON.parse(readFileSync(`${runDir}/host-result.json`, 'utf8')) as Record<string, unknown>;
    notes.push('host-level result: what the SDK client returned, no model involved');
    toolOffered = host.toolOffered === true;
    offeredAs = toolOffered ? fixture.tool : undefined;
    if (typeof host.negotiatedVersion === 'string') negotiatedRevision = host.negotiatedVersion;
    if (host.callError) notes.push(`callTool threw: ${String(host.callError).slice(0, 300)}`);
    if (host.connectError) notes.push(`connect threw: ${String(host.connectError).slice(0, 300)}`);
    if (host.result !== undefined) {
      last = { kind: 'request', seq: 0, toolResults: [{ payload: host.result, path: 'callTool()' }] };
      withResults.push(last);
    }
  } else if (requests.length === 0) notes.push('no model request was captured');
  if (withResults.length === 0 && toolCalled) notes.push('tool was called on the wire but no tool result reached the model');

  let form: PayloadForm = 'unknown';
  let markers: MarkerHit[] = [];
  let payloadExcerpt: string | undefined;
  let payloadBytes: number | undefined;
  let placeholder: string | undefined;
  let clientError: boolean | undefined;
  let image: ToolResultObservation['image'];
  if (last) {
    // Keep only the results of the fixture tool call(s) the mock issued; warm-up calls to other tools are not evidence.
    const fixtureCallIds = new Set(
      model
        .filter((l) => l.kind === 'decision' && l.decision?.type === 'call' && l.decision.tool && l.decision.callId && (matchesFixtureTool(l.decision.tool, fixture.tool) || l === indirect))
        .map((l) => l.decision!.callId as string)
    );
    let results = last.toolResults ?? [];
    const ofFixture = results.filter((r) => r.callId && fixtureCallIds.has(r.callId));
    if (ofFixture.length > 0) results = ofFixture;
    else if (fixtureCallIds.size > 0 && results.length > 1) notes.push('tool result call ids do not match the mock call ids; classified every tool result in the request');
    const payloads = results.map((t) => t.payload);
    const payload = payloads.length === 1 ? payloads[0] : payloads;
    const serialized = serialize(payload);
    payloadBytes = Buffer.byteLength(serialized);
    payloadExcerpt = serialized.length > 4000 ? serialized.slice(0, 2000) + ` ... [${serialized.length - 4000} chars omitted] ... ` + serialized.slice(-2000) : serialized;
    form = formOf(payload, fixture);
    // Provider block arrays that are all text: classify the joined text instead.
    const joined = blocksText(payload);
    if (joined !== undefined) {
      form = formOf(joined, fixture);
      notes.push(`${(payload as unknown[]).length} text block(s) joined for classification`);
    }
    const asText = joined ?? (typeof payload === 'string' ? payload : undefined);
    if (asText !== undefined && form === 'text') {
      const split = splitHeader(asText);
      if (split) {
        form = formOf(JSON.stringify(split.json), fixture);
        notes.push(`client prefixed the payload with a header: ${JSON.stringify(split.header.slice(0, 120))}`);
      }
    }
    markers = countMarkers(serialized);
    if (SDK_REJECTABLE.has(fixture.id) && CLIENT_ERROR.test(serialized.slice(0, 600))) {
      clientError = true;
      placeholder = serialized.slice(0, 500);
      if (markers.length) notes.push('markers appear inside an error message that echoes the rejected value; the field itself did not reach the model');
    }
    if (markers.length === 0) placeholder = serialized.slice(0, 500);
    if (fixture.id === 'with_image') image = imageDelivery(last.api, last.body, serialized, payload);
    if (payloads.length > 1) notes.push(`${payloads.length} tool results in one request`);
  }

  return {
    type: 'tools.result',
    fixture: fixture.id,
    api,
    toolOffered,
    offeredAs,
    toolCalled,
    resultSentToModel: withResults.length > 0,
    payloadExcerpt,
    payloadBytes,
    form,
    markers,
    placeholder,
    clientError,
    image,
    negotiatedRevision,
    serverMode,
    sentResult: sentResult !== undefined && JSON.stringify(sentResult).length < 4000 ? sentResult : sentResult !== undefined ? '<large; see wire.jsonl>' : undefined,
    sentUnchanged,
    notes,
    finalText,
  };
}

/** A one-line reading of the observation, in the glyphs the clients page uses. */
export function verdict(o: ToolResultObservation): string {
  if (!o.toolOffered) return 'tool not offered to the model';
  if (!o.toolCalled) return 'tool offered but never called';
  if (!o.resultSentToModel) return 'result never sent to the model';
  if (o.clientError) return `"…" client error text, no fixture field: ${JSON.stringify((o.placeholder ?? '').slice(0, 80))}`;
  const has = (k: MarkerKey) => o.markers.some((m) => m.marker === k);
  const count = (k: MarkerKey) => o.markers.find((m) => m.marker === k)?.count ?? 0;
  if (o.fixture === 'mirror') {
    // The text is an exact copy of the JSON, so the marker cannot say which field it came from. Count and form can.
    const n = count('sc');
    if (o.form === 'envelope') return `⟨…⟩ envelope (payload ${n}x)`;
    if (n === 0) return o.placeholder !== undefined ? `"…" no marker reached the model; payload: ${JSON.stringify(o.placeholder.slice(0, 80))}` : 'no marker reached the model';
    return `payload ${n === 1 ? 'once' : n + 'x'} (as ${o.form})`;
  }
  const metaNote = o.fixture.includes('meta') ? (has('meta') ? ', _meta reached the model' : ', _meta did not reach the model') : '';
  if (o.form === 'envelope') return `⟨…⟩ envelope (content ${count('content')}x, structuredContent ${count('sc')}x${metaNote})`;
  if (has('content') && has('sc')) return `[…] and {…} (content ${count('content')}x, structuredContent ${count('sc')}x, as ${o.form}${metaNote})`;
  if (has('sc')) return `{…} structuredContent only (${count('sc')}x, as ${o.form}${metaNote})`;
  if (has('content')) return `[…] content only (${count('content')}x, as ${o.form}${metaNote})`;
  if (o.placeholder !== undefined) return `"…" no marker reached the model; payload: ${JSON.stringify(o.placeholder.slice(0, 80))}`;
  return 'no marker reached the model';
}

// Mock-model script for conformance runs. The scenario server, not the probe,
// decides which tools exist, so the "model" plans its calls from what the host
// offered and makes them one per turn, then ends with text.
// Loaded by probe/dist/mock-model/server.js through --script; it inherits the
// suite's MCP_CONFORMANCE_SCENARIO and MCP_CONFORMANCE_CONTEXT, and the
// adapter profile (CONF_PROFILE, see profiles.mjs), from the bridge.
//
// Plans, in order of precedence:
// - MCP_CONFORMANCE_CONTEXT.toolCalls (http-custom-headers): make exactly those calls.
// - json_schema_echo offered (json-schema-2020-12-preservation): echo the focal
//   tool's parameters as the host presented them to the model.
// - otherwise: every offered MCP tool once, arguments built from its schema.
//
// Profile keys: `mcp` picks the MCP tools among the offered ones ('probe', the
// default: names containing the server name; 'all': every offered tool, for
// frameworks that offer nothing else). `mcpMatch` is a regex for hosts that name
// the server after its URL (goose). `warmup` names built-ins to call, up to three
// times, while no MCP tool is offered yet (codex). `route: 'eve'` reaches tools through
// eve__search and eve__tool. `route: 'fx-select'` (fx 0.0.16) searches with
// capability_search, selects each quoted name with mcp_select_tool, then calls
// the tools fx then offers. `finish` names a tool to call once the plan is
// done (cline's submit_and_exit). Built-in host tools are never called.

const CALL_PREFIX = 'call_conf_';
const SEARCH_PREFIX = 'call_confsearch_';
const FINISH_PREFIX = 'call_conffinish_';
const SELECT_PREFIX = 'call_confselect_';
const WARMUP_PREFIX = 'call_confwarmup_';
// fx's capability_search is lexical and needs words from the tool names; these
// are the words of every no-auth client scenario's tools in suite 0.2.0-alpha.12.
const FX_QUERY = 'add numbers test client elicitation defaults custom headers null valid tool hyphenated json schema 2020 12 echo lookup user mrtr state result type reconnection';
const DONE = 'PROBE_DONE: every planned tool call has been made.';

function profile() {
  try {
    return JSON.parse(process.env.CONF_PROFILE ?? '{}');
  } catch {
    return {};
  }
}

function valueFor(schema) {
  if (!schema || typeof schema !== 'object') return 'x';
  if ('default' in schema) return schema.default;
  if (Array.isArray(schema.enum) && schema.enum.length) return schema.enum[0];
  if ('const' in schema) return schema.const;
  for (const k of ['anyOf', 'oneOf']) {
    if (Array.isArray(schema[k])) {
      const branch = schema[k].find((b) => b && b.type !== 'null') ?? schema[k][0];
      return valueFor(branch);
    }
  }
  const type = Array.isArray(schema.type) ? schema.type.find((t) => t !== 'null') : schema.type;
  switch (type) {
    case 'number':
    case 'integer':
      return 1;
    case 'boolean':
      return true;
    case 'array':
      return [];
    case 'object':
      return argsFor(schema);
    case 'null':
      return null;
    default:
      return 'x';
  }
}

function argsFor(schema) {
  const props = (schema && schema.properties) || {};
  const out = {};
  for (const [k, v] of Object.entries(props)) out[k] = valueFor(v);
  return out;
}

// Adapters name the MCP server "probe", and most hosts prefix MCP tool names with it.
function mcpTools(offered, prof) {
  if (prof.mcp === 'all') return offered;
  if (prof.mcpMatch) return offered.filter((t) => new RegExp(prof.mcpMatch).test(t.name));
  return offered.filter((t) => /probe/i.test(t.name) || /probe/i.test(t.namespace ?? ''));
}

const bare = (name) => name.replace(/^.*?probe[_\-.:]+/i, '');
const find = (tools, name) => tools.find((t) => t.name === name || bare(t.name) === name || t.name.endsWith(`_${name}`) || t.name.endsWith(`__${name}`));

function context() {
  try {
    return JSON.parse(process.env.MCP_CONFORMANCE_CONTEXT ?? '{}');
  } catch {
    return {};
  }
}

function plan(tools) {
  const ctx = context();
  if (Array.isArray(ctx.toolCalls) && ctx.toolCalls.length) {
    return ctx.toolCalls.map((c) => ({ tool: find(tools, c.name), args: c.arguments })).filter((c) => c.tool);
  }
  const echo = find(tools, 'json_schema_echo');
  if (echo) {
    const focal = find(tools, 'json_schema_2020_12_tool');
    return [{ tool: echo, args: { schema: focal?.parameters ?? {} } }];
  }
  return tools.map((t) => ({ tool: t, args: argsFor(t.parameters) }));
}

const payloadText = (r) => (typeof r.payload === 'string' ? r.payload : JSON.stringify(r.payload ?? ''));

// eve lists no connection tool to the model. eve__search with the connection
// prefix returns the matching tools; the script reads names (and, where the
// result carries them, input schemas) from it and calls each through eve__tool.
function eveTools(ctx) {
  const results = ctx.toolResults.filter((r) => r.callId?.startsWith(SEARCH_PREFIX));
  if (results.length === 0) return undefined;
  const text = results.map(payloadText).join('\n');
  const names = [...new Set(text.match(/probe__[A-Za-z0-9_\-]+/g) ?? [])];
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }
  const schemas = {};
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) return v.forEach(walk);
    const name = v.name ?? v.tool ?? v.id;
    const schema = v.inputSchema ?? v.input_schema ?? v.parameters ?? v.schema;
    if (typeof name === 'string' && schema && typeof schema === 'object') schemas[name] = schema;
    Object.values(v).forEach(walk);
  };
  walk(parsed);
  const sigs = {};
  const sigWalk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) return v.forEach(sigWalk);
    if (typeof v.tool === 'string' && typeof v.signature === 'string') sigs[v.tool] = v.signature;
    Object.values(v).forEach(sigWalk);
  };
  sigWalk(parsed);
  return names.map((n) => ({ name: n, route: 'eve', parameters: schemas[n] ?? schemaFromSignature(sigs[n]), signature: sigs[n] }));
}

// eve__search describes each tool by a TypeScript signature, for example
// `probe__add_numbers(input: { a: number /* First number */; b: number }): Promise<unknown>`.
// Enough of it is turned back into a schema to build arguments.
function schemaFromSignature(sig) {
  if (typeof sig !== 'string') return {};
  const start = sig.indexOf('input');
  const open = sig.indexOf('{', start);
  if (start < 0 || open < 0) return {};
  const src = sig.replace(/\/\*.*?\*\//g, '');
  let i = src.indexOf('{', src.indexOf('input'));
  function skipWs() {
    while (i < src.length && /\s/.test(src[i])) i++;
  }
  function parseType() {
    skipWs();
    let t;
    if (src[i] === '{') t = parseObject();
    else {
      let depth = 0;
      const begin = i;
      while (i < src.length) {
        const ch = src[i];
        if (ch === '{' || ch === '(' || ch === '<' || ch === '[') depth++;
        else if (ch === '}' || ch === ')' || ch === '>' || ch === ']') {
          if (depth === 0) break;
          depth--;
        } else if ((ch === ';' || ch === ',') && depth === 0) break;
        i++;
      }
      const text = src.slice(begin, i).trim();
      const first = text.split('|')[0].trim();
      if (/\[\]$/.test(first) || /^Array</.test(first)) t = { type: 'array' };
      else if (/^["']/.test(first)) t = { const: first.slice(1, -1) };
      else if (/^-?\d/.test(first)) t = { const: Number(first) };
      else if (first === 'number') t = { type: 'number' };
      else if (first === 'boolean' || first === 'true' || first === 'false') t = { type: 'boolean' };
      else if (first === 'null') t = { type: 'null' };
      else t = { type: 'string' };
    }
    return t;
  }
  function parseObject() {
    const out = { type: 'object', properties: {}, required: [] };
    i++;
    for (;;) {
      skipWs();
      if (i >= src.length || src[i] === '}') {
        i++;
        return out;
      }
      const m = /^(?:"([^"]+)"|([A-Za-z0-9_$\-]+))(\??)\s*:/.exec(src.slice(i));
      if (!m) {
        i++;
        continue;
      }
      i += m[0].length;
      const key = m[1] ?? m[2];
      out.properties[key] = parseType();
      if (!m[3]) out.required.push(key);
      skipWs();
      if (src[i] === ';' || src[i] === ',') i++;
    }
  }
  try {
    return parseObject();
  } catch {
    return {};
  }
}

function decision(call, idx, ctx) {
  const { tool, args } = call;
  const callId = `${CALL_PREFIX}${idx}_${ctx.seq}`;
  if (tool.route === 'eve') return { type: 'call', tool: 'eve__tool', args: { name: tool.name, input: args }, callId };
  return { type: 'call', tool: tool.name, namespace: tool.namespace, args, callId };
}

function finish(ctx, prof, text) {
  if (prof.finish) {
    const tool = ctx.offeredTools.find((t) => t.name === prof.finish);
    const finished = ctx.toolResults.some((r) => r.callId?.startsWith(FINISH_PREFIX));
    if (tool && !finished) return { type: 'call', tool: tool.name, args: { summary: text, verified: true }, callId: `${FINISH_PREFIX}${ctx.seq}` };
  }
  return { type: 'text', text };
}

export default function script(ctx) {
  const prof = profile();
  let tools;
  if (prof.route === 'eve') {
    if (!ctx.offeredTools.some((t) => t.name === 'eve__tool')) return { type: 'text', text: 'PROBE_NO_EVE_TOOL' };
    tools = eveTools(ctx);
    if (!tools) return { type: 'call', tool: 'eve__search', args: { query: 'probe__' }, callId: `${SEARCH_PREFIX}${ctx.seq}` };
  } else if (prof.route === 'fx-select' && ctx.offeredTools.some((t) => t.name === 'mcp_select_tool')) {
    const searches = ctx.toolResults.filter((r) => r.callId?.startsWith(SEARCH_PREFIX));
    if (searches.length === 0) return { type: 'call', tool: 'capability_search', args: { query: FX_QUERY, server: 'probe' }, callId: `${SEARCH_PREFIX}${ctx.seq}` };
    const quoted = [...new Set(searches.map(payloadText).join('\n').match(/[A-Za-z0-9_.:-]*probe[A-Za-z0-9_.:-]*/g) ?? [])].filter((n) => !/^probe$/.test(n));
    const selected = ctx.toolResults.filter((r) => r.callId?.startsWith(SELECT_PREFIX)).length;
    if (selected < quoted.length) return { type: 'call', tool: 'mcp_select_tool', args: { name: quoted[selected] }, callId: `${SELECT_PREFIX}${selected}_${ctx.seq}` };
    tools = mcpTools(ctx.offeredTools, prof);
  } else {
    tools = mcpTools(ctx.offeredTools, prof);
  }
  if (tools.length === 0 && Array.isArray(prof.warmup)) {
    const warm = ctx.offeredTools.find((t) => prof.warmup.includes(t.name));
    const warmups = ctx.toolResults.filter((r) => r.callId?.startsWith(WARMUP_PREFIX)).length;
    if (warm && warmups < 3) return { type: 'call', tool: warm.name, args: {}, callId: `${WARMUP_PREFIX}${ctx.seq}`, delayMs: 1500 };
  }
  if (tools.length === 0) return finish(ctx, prof, `PROBE_NO_MCP_TOOLS among: ${ctx.offeredTools.map((t) => t.name).join(', ')}`);
  const calls = plan(tools);
  const done = ctx.toolResults.filter((r) => typeof r.callId === 'string' && r.callId.startsWith(CALL_PREFIX)).length;
  if (done >= calls.length) return finish(ctx, prof, DONE);
  return decision(calls[done], done, ctx);
}

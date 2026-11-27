// Mock-model script for conformance runs. The scenario server, not the probe,
// decides which tools exist, so the "model" plans its calls from what the host
// offered and makes them one per turn, then ends with text.
// Loaded by probe/dist/mock-model/server.js through --script; it inherits the
// suite's MCP_CONFORMANCE_SCENARIO and MCP_CONFORMANCE_CONTEXT from the bridge.
//
// Plans, in order of precedence:
// - MCP_CONFORMANCE_CONTEXT.toolCalls (http-custom-headers): make exactly those calls.
// - json_schema_echo offered (json-schema-2020-12-preservation): echo the focal
//   tool's parameters as the host presented them to the model.
// - otherwise: every offered MCP tool once, arguments built from its schema.

const CALL_PREFIX = 'call_conf_';

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

// Prefer the tools the adapter's MCP server entry contributed. Adapters name
// that server "probe", and hosts prefix MCP tool names with the server name.
function mcpTools(offered) {
  const named = offered.filter((t) => /probe/i.test(t.name) || /probe/i.test(t.namespace ?? ''));
  return named.length ? named : offered;
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

export default function script(ctx) {
  const tools = mcpTools(ctx.offeredTools);
  if (tools.length === 0) return undefined;
  const calls = plan(tools);
  const done = ctx.toolResults.filter((r) => typeof r.callId === 'string' && r.callId.startsWith(CALL_PREFIX)).length;
  if (done >= calls.length) return { type: 'text', text: 'PROBE_DONE: every planned tool call has been made.' };
  const { tool, args } = calls[done];
  return { type: 'call', tool: tool.name, namespace: tool.namespace, args, callId: `${CALL_PREFIX}${done}_${ctx.seq}` };
}

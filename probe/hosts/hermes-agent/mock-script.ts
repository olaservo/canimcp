// Hermes defers every MCP tool behind its tool_search bridge (tools.tool_search.enabled: auto
// at a9ff9799), so the model sees tool_search / tool_describe / tool_call and not the MCP tool.
// The bridge's own description says the exact name needs no search, so the script calls
// tool_call directly with the registry name mcp__<server>__<tool>, then ends with text.
// When the fixture tool is offered directly (tools.tool_search.enabled: off) the default applies.
import type { Script, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

const script: Script = (ctx, helpers): Decision | undefined => {
  if (ctx.toolResults.length > 0) return { type: 'text', text: DONE_TEXT };
  if (helpers.findFixtureTool(ctx)) return undefined;
  const bridge = ctx.offeredTools.find((t) => t.name === 'tool_call');
  if (!bridge) return undefined;
  const name = `mcp__probe__${ctx.fixtureTool}`;
  return { type: 'call', tool: 'tool_call', args: { calls: [{ name, arguments: ctx.toolArgs }] }, callId: `call_probe_${ctx.seq}` };
};

export default script;

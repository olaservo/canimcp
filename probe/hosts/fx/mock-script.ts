// fx advertises no MCP tool until the model selects it. The script first asks
// capability_search for the fixture tool, then selects the dynamic name the
// search result quotes, then calls it, then ends with text.
import type { Script, ScriptContext, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

function lastResultText(ctx: ScriptContext): string {
  const last = ctx.toolResults[ctx.toolResults.length - 1];
  return last ? (typeof last.payload === 'string' ? last.payload : JSON.stringify(last.payload)) : '';
}

/** The dynamic tool name fx quotes back, for example `probe__probe_mirror` or `mcp_probe_probe_mirror`. */
function dynamicName(text: string, fixtureTool: string): string | undefined {
  const re = new RegExp(`[A-Za-z0-9_.:/-]*${fixtureTool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[A-Za-z0-9_-]*`, 'g');
  const names = text.match(re) ?? [];
  // Prefer a name that is not the bare fixture tool, since fx prefixes server names.
  return names.find((n) => n !== fixtureTool) ?? names[0];
}

const script: Script = (ctx, helpers): Decision | undefined => {
  const fixture = helpers.findFixtureTool(ctx);
  const calledFixture = ctx.toolResults.some((r) => r.callId && ctx.body && JSON.stringify(ctx.body).includes(`"${r.callId}"`) && JSON.stringify(ctx.body).includes(ctx.fixtureTool) && ctx.toolResults.length >= 1 && fixture === undefined && ctx.toolResults.length >= 3);
  if (calledFixture) return { type: 'text', text: DONE_TEXT };
  // The fixture tool is offered: call it, unless its result is already in the conversation.
  if (fixture) {
    const alreadyCalled = ctx.toolResults.some((r) => JSON.stringify(ctx.body).includes(`"name":"${fixture.name}"`) && r.callId !== undefined && lastResultText(ctx).includes('MARK_'));
    if (alreadyCalled || ctx.toolResults.length >= 3) return { type: 'text', text: DONE_TEXT };
    return { type: 'call', tool: fixture.name, args: ctx.toolArgs, callId: `call_probe_${ctx.seq}` };
  }
  const select = ctx.offeredTools.find((t) => t.name === 'mcp_select_tool');
  const search = ctx.offeredTools.find((t) => t.name === 'capability_search');
  const previous = lastResultText(ctx);
  if (select && ctx.toolResults.length >= 1) {
    const name = dynamicName(previous, ctx.fixtureTool) ?? dynamicName(JSON.stringify(ctx.body), ctx.fixtureTool);
    if (name && ctx.toolResults.length < 3) return { type: 'call', tool: 'mcp_select_tool', args: { name }, callId: `call_probe_${ctx.seq}` };
  }
  if (search && ctx.toolResults.length === 0) return { type: 'call', tool: 'capability_search', args: { query: ctx.fixtureTool }, callId: `call_probe_${ctx.seq}` };
  if (select && ctx.toolResults.length === 0) return { type: 'call', tool: 'mcp_select_tool', args: { name: `probe__${ctx.fixtureTool}` }, callId: `call_probe_${ctx.seq}` };
  if (ctx.toolResults.length > 0) return { type: 'text', text: `PROBE_TOOL_NOT_OFFERED: after ${ctx.toolResults.length} steps no tool matching ${ctx.fixtureTool} was offered; offered: ${ctx.offeredTools.map((t) => t.name).join(', ')}` };
  return undefined;
};

export default script;

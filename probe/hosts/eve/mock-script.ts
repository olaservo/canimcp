// eve never lists a connection tool to the model. Every MCP tool is deferred
// behind eve__search and eve__tool, and eve__tool resolves `<connection>__<tool>`
// by exact name without a prior search (connectionEntryNamed). The script calls
// eve__tool with the probe connection's name for the fixture tool, then ends
// with text. If eve reports the name unknown, it searches once and retries.
import type { Script, ScriptContext, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

const CONNECTION = 'probe';

function lastResultText(ctx: ScriptContext): string {
  const last = ctx.toolResults[ctx.toolResults.length - 1];
  return last ? (typeof last.payload === 'string' ? last.payload : JSON.stringify(last.payload)) : '';
}

const script: Script = (ctx, helpers): Decision | undefined => {
  // A client that lists the fixture tool directly takes the default path.
  if (helpers.findFixtureTool(ctx)) return undefined;
  const call = ctx.offeredTools.find((t) => t.name === 'eve__tool');
  const search = ctx.offeredTools.find((t) => t.name === 'eve__search');
  if (!call) return undefined;
  const name = `${CONNECTION}__${ctx.fixtureTool}`;
  const routed = (): Decision => ({ type: 'call', tool: 'eve__tool', args: { name, input: ctx.toolArgs }, callId: `call_probe_${ctx.seq}` });
  if (ctx.toolResults.length === 0) return routed();
  const previous = lastResultText(ctx);
  const unknown = /unknown|isn't|is not|not found|no tool|couldn't find|could not find/i.test(previous) && !previous.includes('MARK_');
  if (unknown && search && ctx.toolResults.length === 1) return { type: 'call', tool: 'eve__search', args: { query: `${CONNECTION}__` }, callId: `call_probe_${ctx.seq}` };
  if (ctx.toolResults.length === 2 && search && !previous.includes('MARK_') && /"tool"|signature/i.test(previous)) return routed();
  return { type: 'text', text: DONE_TEXT };
};

export default script;

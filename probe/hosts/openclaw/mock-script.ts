// With Tool Search on (the default), OpenClaw declares a small MCP inventory directly and
// defers a larger one behind tool_search / tool_describe / dispatch_action, listing the
// deferred names in the system prompt. A directly offered fixture tool is called by name.
// Otherwise the script calls dispatch_action with the catalog id mcp:<server>:<server>__<tool>,
// which the directory says needs no search first.
import type { Script, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

const script: Script = (ctx, helpers): Decision | undefined => {
  if (ctx.toolResults.some((r) => r.callId?.startsWith('call_probe_fixture'))) return { type: 'text', text: DONE_TEXT };
  const fixture = helpers.findFixtureTool(ctx);
  if (fixture) return { type: 'call', tool: fixture.name, namespace: fixture.namespace, args: ctx.toolArgs, callId: `call_probe_fixture_${ctx.seq}` };
  const dispatch = ctx.offeredTools.find((t) => t.name === 'dispatch_action');
  if (!dispatch) return undefined;
  const id = `mcp:probe:probe__${ctx.fixtureTool}`;
  return { type: 'call', tool: dispatch.name, args: { id, args: ctx.toolArgs }, callId: `call_probe_fixture_${ctx.seq}` };
};

export default script;

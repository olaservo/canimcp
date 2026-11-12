// codex exec starts its first turn while MCP servers are still listing
// tools, so the first model request may carry no MCP tool. When that
// happens the script calls a cheap built-in (list_mcp_resources) to spend a
// round trip; the next request carries the probe tool and the default
// script takes over.
import type { Script, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

const WARMUP_TOOLS = ['list_mcp_resources', 'list_mcp_resource_templates'];

const script: Script = (ctx, helpers): Decision | undefined => {
  const fixture = helpers.findFixtureTool(ctx);
  if (fixture) {
    // A result from the fixture tool itself ends the turn; a warm-up result does not.
    const fixtureResult = ctx.toolResults.find((r) => r.callId?.startsWith('call_probe_fixture'));
    if (fixtureResult) return { type: 'text', text: DONE_TEXT };
    return { type: 'call', tool: fixture.name, namespace: fixture.namespace, args: ctx.toolArgs, callId: `call_probe_fixture_${ctx.seq}` };
  }
  const warmups = ctx.toolResults.filter((r) => r.callId?.startsWith('call_probe_warmup')).length;
  if (warmups < 3) {
    const warm = ctx.offeredTools.find((t) => WARMUP_TOOLS.includes(t.name));
    if (warm) return { type: 'call', tool: warm.name, args: {}, callId: `call_probe_warmup_${ctx.seq}`, delayMs: 1500 };
  }
  return { type: 'text', text: `PROBE_TOOL_NOT_OFFERED: after ${warmups} warm-up calls no tool matching ${ctx.fixtureTool}; offered: ${ctx.offeredTools.map((t) => t.name).join(', ')}` };
};

export default script;

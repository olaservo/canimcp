// With Code Mode on, opencode offers the model one `execute` tool and lists
// MCP tools in a catalog inside the instructions. The script calls `execute`
// with a program that calls the fixture tool and returns its value. When the
// fixture tool is offered directly (codemode off), the script calls it.
//
// The first turn can start before the MCP server's tools are registered: the
// execute result is then `Unknown tool 'probe.<tool>' ...`, or the direct tool
// is missing from the first request. The script retries after a hold, up to
// three times, and ends the turn only on a result from the fixture tool.
import type { Script, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

const script: Script = (ctx, helpers): Decision | undefined => {
  const fixture = helpers.findFixtureTool(ctx);
  if (fixture) {
    if (ctx.toolResults.some((r) => r.callId?.startsWith('call_probe_fixture'))) return { type: 'text', text: DONE_TEXT };
    return { type: 'call', tool: fixture.name, namespace: fixture.namespace, args: ctx.toolArgs, callId: `call_probe_fixture_${ctx.seq}` };
  }
  const execute = ctx.offeredTools.find((t) => t.name === 'execute');
  if (!execute) return undefined;
  const results = ctx.toolResults.filter((r) => r.callId?.startsWith('call_probe_execute'));
  const last = results[results.length - 1];
  const unknown = last !== undefined && /^Unknown tool '/.test(typeof last.payload === 'string' ? last.payload : JSON.stringify(last.payload));
  if (last !== undefined && (!unknown || results.length >= 4)) return { type: 'text', text: DONE_TEXT };
  // Catalog paths are <server>.<tool>; the server is named probe in the adapter's config.
  const code = `return await tools.probe.${ctx.fixtureTool}(${JSON.stringify(ctx.toolArgs)});`;
  return { type: 'call', tool: 'execute', args: { code }, callId: `call_probe_execute_${ctx.seq}`, ...(unknown ? { delayMs: 1500 } : {}) };
};

export default script;

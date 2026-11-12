// pi hides MCP tools from the model under its default `codemode` exposure and
// under `deferred`. With codemode the model gets one `codemode` tool and
// reaches MCP tools from a script; the script here awaits the probe tool and
// returns its value, so the model sees what a script receives. With deferred
// the model must call `tool_search` first; the matched tool is declared on the
// next request and is then called like a direct tool.
import type { Script, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

const SERVER = 'probe';

/** pi's `mcp__<server>__<tool>` name, with everything else turned into `_`. */
function piToolName(tool: string): string {
  return `mcp__${SERVER}__${tool}`.replace(/[^A-Za-z0-9_]/g, '_');
}

const script: Script = (ctx, helpers): Decision | undefined => {
  const fixtureDone = ctx.toolResults.some((r) => r.callId?.startsWith('call_probe_fixture'));
  if (fixtureDone) return { type: 'text', text: DONE_TEXT };

  const fixture = helpers.findFixtureTool(ctx);
  if (fixture) return { type: 'call', tool: fixture.name, namespace: fixture.namespace, args: ctx.toolArgs, callId: `call_probe_fixture_${ctx.seq}` };

  const searched = ctx.toolResults.some((r) => r.callId?.startsWith('call_probe_search'));
  const search = ctx.offeredTools.find((t) => t.name === 'tool_search');
  if (search && !searched) return { type: 'call', tool: search.name, args: { query: ctx.fixtureTool }, callId: `call_probe_search_${ctx.seq}` };

  const codemode = ctx.offeredTools.find((t) => t.name === 'codemode');
  if (codemode) {
    const code = `const result = await tools.${piToolName(ctx.fixtureTool)}(${JSON.stringify(ctx.toolArgs)});\nreturn result;`;
    return { type: 'call', tool: codemode.name, args: { code }, callId: `call_probe_fixture_${ctx.seq}` };
  }

  return { type: 'text', text: `PROBE_TOOL_NOT_OFFERED: no ${ctx.fixtureTool}, tool_search or codemode among: ${ctx.offeredTools.map((t) => t.name).join(', ')}` };
};

export default script;

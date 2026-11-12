// deepagents `interpreter` config: the MCP tools are reachable only through
// the QuickJS js_eval tool as tools.<camelCase>(). When the fixture tool is
// not offered directly but js_eval is, call it with code that awaits the
// bridged tool. Every other config falls through to the default script.
import type { Script, Decision } from '../../mock-model/script.js';

function camel(name: string): string {
  const parts = name.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return parts.map((p, i) => (i === 0 ? p.toLowerCase() : p[0].toUpperCase() + p.slice(1).toLowerCase())).join('');
}

const script: Script = (ctx, helpers): Decision | undefined => {
  if (helpers.findFixtureTool(ctx)) return undefined;
  const evalTool = ctx.offeredTools.find((t) => t.name === 'js_eval');
  if (!evalTool || ctx.toolResults.length > 0) return undefined;
  const fn = camel(`probe_${ctx.fixtureTool}`);
  return { type: 'call', tool: evalTool.name, args: { code: `await tools.${fn}({})` }, callId: `call_probe_${ctx.seq}` };
};

export default script;

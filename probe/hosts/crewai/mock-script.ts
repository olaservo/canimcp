// crewAI's native client names a tool `<server>_<tool>` and runs the whole
// name through sanitize_tool_name, which cuts it to 64 characters and ends it
// with an 8-hex hash of the full name. For a stdio server the server part is
// the command line (`node_c_users_..._fixture_server_js_fixture_...`), so the
// fixture tool's name is cut off and the default matcher cannot see it. When
// no offered name matches and exactly one tool carries that hash suffix, the
// script calls it; the client sends the server's original name on the wire.
import type { Script, Decision } from '../../mock-model/script.js';

const HASHED = /_[0-9a-f]{8}$/;

const script: Script = (ctx, helpers): Decision | undefined => {
  if (ctx.toolResults.length > 0 || helpers.findFixtureTool(ctx)) return undefined;
  const hashed = ctx.offeredTools.filter((t) => HASHED.test(t.name));
  if (hashed.length !== 1) return undefined;
  return { type: 'call', tool: hashed[0].name, args: ctx.toolArgs, callId: `call_probe_${ctx.seq}` };
};

export default script;

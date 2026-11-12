// cline --yolo appends "[SYSTEM] This run is not complete until you call
// submit_and_exit" to every turn and loops on a plain text reply (observed:
// 776 iterations in two minutes on app_only). The script ends the run through
// submit_and_exit once the fixture result has come back, or at once when the
// fixture tool is not offered, with the marker text as the summary. The
// fixture call itself falls through to the default script.
import type { Script, Decision } from '../../mock-model/script.js';
import { DONE_TEXT } from '../../mock-model/script.js';

const script: Script = (ctx, helpers): Decision | undefined => {
  const submit = ctx.offeredTools.find((t) => t.name === 'submit_and_exit');
  const submitted = ctx.toolResults.some((r) => r.callId?.startsWith('call_probe_submit'));
  const finish = (text: string): Decision =>
    submit && !submitted ? { type: 'call', tool: submit.name, args: { summary: text, verified: true }, callId: `call_probe_submit_${ctx.seq}` } : { type: 'text', text };
  if (ctx.toolResults.length > 0) return finish(DONE_TEXT);
  if (!helpers.findFixtureTool(ctx)) return finish(`PROBE_TOOL_NOT_OFFERED: no tool matching ${ctx.fixtureTool} among ${ctx.offeredTools.length} tools.`);
  return undefined;
};

export default script;

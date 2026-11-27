// Conformance-only config for the mastra adapter: `answer` runs
// probe/hosts/mastra/conformance-agent.mjs, which sets an inputRequests handler
// that accepts every elicitation with empty content and declares
// elicitation.form.applyDefaults; `answer-no-defaults` keeps Mastra's stock { form: {} }.
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/mastra');
const { runCommand, ensureDir, findFinalText } = await import(pathToFileURL(resolve(here, '../../../dist/lib/hosts.js')).href);

export default {
  configs: [
    { name: 'answer', kind: 'harness', description: 'default plus inputRequests on the server entry and capabilities.elicitation.form.applyDefaults: every elicitation accepted with empty content.', modelApi: 'chat' },
    { name: 'answer-no-defaults', kind: 'harness', description: 'answer without applyDefaults: Mastra declares its stock elicitation { form: {} }.', modelApi: 'chat' },
  ],
  async run(ctx) {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = { ...process.env, PROBE_MOCK_URL: ctx.mockUrl, PROBE_PROMPT: ctx.prompt, PROBE_SERVER_URL: ctx.serverUrl ?? '', PROBE_APPLY_DEFAULTS: ctx.config.name === 'answer' ? '1' : '0' };
    const r = await runCommand(process.execPath, [resolve(hostDir, 'conformance-agent.mjs')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

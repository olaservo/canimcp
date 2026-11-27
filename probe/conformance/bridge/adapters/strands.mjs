// Conformance-only config for the strands adapter: `answer` runs
// probe/hosts/strands/agent.py with PROBE_CONFIG=answer, the default config plus an
// MCPClient elicitation_callback that accepts every request with empty content.
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/strands');
const python = resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const { runCommand, ensureDir, findFinalText } = await import(pathToFileURL(resolve(here, '../../../dist/lib/hosts.js')).href);

export default {
  configs: [{ name: 'answer', kind: 'harness', description: 'default plus MCPClient(elicitation_callback=...) accepting every request with empty content. Strands already passes allow_input_required=True and resolves input-required results through the same callback.', modelApi: 'chat' }],
  async run(ctx) {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = {
      ...process.env,
      PYTHONUTF8: '1',
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: 'answer',
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
    };
    const r = await runCommand(python, [resolve(hostDir, 'agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

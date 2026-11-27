// Conformance-only config for the agent-framework adapter: `answer` runs
// probe/hosts/agent-framework/conformance_agent.py, which hands MCPStreamableHTTPTool a
// caller-owned mcp.Client (`mcp_client=`) whose elicitation_callback accepts with empty content.
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/agent-framework');
const python = resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const { runCommand, ensureDir, findFinalText } = await import(pathToFileURL(resolve(here, '../../../dist/lib/hosts.js')).href);

export default {
  configs: [{ name: 'answer', description: 'default plus a caller-owned mcp.Client passed as mcp_client= with an elicitation_callback accepting every request with empty content; its call_tool answers input-required results through the same callback.', modelApi: 'chat' }],
  async run(ctx) {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = {
      ...process.env,
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PYTHONUTF8: '1',
      PYTHONUNBUFFERED: '1',
    };
    const r = await runCommand(python, [resolve(hostDir, 'conformance_agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

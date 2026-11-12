// Strands Agents (Python): an Agent with MCPClient tools, model routed to the mock by base_url.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/strands');
const python = resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');

const adapter: HostAdapter = {
  id: 'strands',
  title: 'Strands Agents (Python)',
  configs: [
    { name: 'default', description: 'Agent + MCPClient, OpenAIModel, Chat Completions.', modelApi: 'chat' },
    { name: 'responses', description: 'OpenAIResponsesModel: the Responses API converter.', modelApi: 'responses' },
    { name: 'anthropic', description: 'AnthropicModel: the Messages API converter.', modelApi: 'anthropic' },
  ],
  async version() {
    if (!existsSync(python)) return { missing: 'create probe/hosts/strands/.venv with uv and install requirements.txt' };
    const code = 'import importlib.metadata as m; print(m.version("strands-agents") + "+mcp-" + m.version("mcp"))';
    const r = await runCommand(python, ['-c', code], { timeoutMs: 30000 });
    const version = r.stdout.trim();
    if (!version) return { missing: `could not read the installed version: ${r.stderr.trim()}` };
    return { version, detail: 'strands-agents from PyPI; python/v1.64.0 is the last release tag below the research pin 3d32c22' };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = {
      ...process.env,
      PYTHONUTF8: '1',
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
    };
    const r = await runCommand(python, [resolve(hostDir, 'agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

// Microsoft Agent Framework (Python): an Agent with an MCPStdioTool or MCPStreamableHTTPTool,
// model routed to the mock by base_url. Runs agent.py with the venv interpreter.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/agent-framework');
const venvPython = process.platform === 'win32' ? resolve(hostDir, '.venv/Scripts/python.exe') : resolve(hostDir, '.venv/bin/python');

/** Read a package's version from its dist-info directory in the venv. */
function installedVersion(dist: string): string | undefined {
  const sitePackages = process.platform === 'win32' ? resolve(hostDir, '.venv/Lib/site-packages') : undefined;
  const dirs = sitePackages && existsSync(sitePackages) ? [sitePackages] : [];
  if (!sitePackages) {
    const lib = resolve(hostDir, '.venv/lib');
    if (existsSync(lib)) for (const d of readdirSync(lib)) dirs.push(resolve(lib, d, 'site-packages'));
  }
  const prefix = `${dist.replace(/-/g, '_')}-`;
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    const match = readdirSync(dir).find((d) => d.startsWith(prefix) && d.endsWith('.dist-info'));
    if (match) {
      const meta = readFileSync(resolve(dir, match, 'METADATA'), 'utf8');
      const m = meta.match(/^Version:\s*(\S+)/m);
      if (m) return m[1];
    }
  }
  return undefined;
}

const adapter: HostAdapter = {
  id: 'agent-framework',
  title: 'Microsoft Agent Framework (Python)',
  configs: [
    { name: 'default', description: 'MCPStdioTool default tool_result_content=structured_first, OpenAIChatCompletionClient (Chat Completions).', modelApi: 'chat' },
    { name: 'content-first', description: 'tool_result_content=content_first: content when non-empty, else structuredContent.', modelApi: 'chat' },
    { name: 'content-only', description: 'tool_result_content=content_only: structuredContent ignored.', modelApi: 'chat' },
    { name: 'structured-only', description: 'tool_result_content=structured_only: content ignored.', modelApi: 'chat' },
    { name: 'both', description: 'tool_result_content=both: content blocks, then serialized structuredContent.', modelApi: 'chat' },
    { name: 'responses', description: 'OpenAIChatClient (Responses API), default structured_first.', modelApi: 'responses' },
    { name: 'anthropic', description: 'AnthropicClient (Messages API), default structured_first.', modelApi: 'anthropic' },
  ],
  async version() {
    if (!existsSync(venvPython)) return { missing: 'create the venv: see probe/hosts/agent-framework/requirements.txt' };
    const core = installedVersion('agent-framework-core');
    if (!core) return { missing: 'agent-framework-core is not installed in probe/hosts/agent-framework/.venv' };
    const mcp = installedVersion('mcp');
    return { version: core, detail: `agent-framework-openai ${installedVersion('agent-framework-openai') ?? '?'}, agent-framework-anthropic ${installedVersion('agent-framework-anthropic') ?? '?'}, mcp ${mcp ?? '?'}` };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = {
      ...process.env,
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
      PYTHONUTF8: '1',
      PYTHONUNBUFFERED: '1',
    };
    const r = await runCommand(venvPython, [resolve(hostDir, 'agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

// deepagents: create_deep_agent with MCP tools from deepagents-code's loader
// (FastMCP proxy router + langchain.mcp), model routed to the mock by base_url.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readdirSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/deepagents');
const python = resolve(hostDir, process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python');

function installed(name: string): string | undefined {
  const site = process.platform === 'win32' ? resolve(hostDir, '.venv/Lib/site-packages') : undefined;
  const dirs = site && existsSync(site) ? readdirSync(site) : [];
  const re = new RegExp(`^${name.replace(/-/g, '_')}-(.+)\\.dist-info$`);
  for (const d of dirs) {
    const m = d.match(re);
    if (m) return m[1];
  }
  return undefined;
}

const adapter: HostAdapter = {
  id: 'deepagents',
  title: 'deepagents',
  mockScript: 'mock-script.js',
  configs: [
    { name: 'default', description: 'create_deep_agent + deepagents-code MCP loader and mcp_tool_middleware, Chat Completions.', modelApi: 'chat' },
    { name: 'hooks', description: 'plus ServerHooksMiddleware with a PostToolUse hook returning the ToolMessage artifact as additionalContext.', modelApi: 'chat' },
    { name: 'interpreter', description: 'MCP tools reachable only through the QuickJS js_eval tool (programmatic tool calling).', modelApi: 'chat' },
  ],
  async version() {
    if (!existsSync(python)) return { missing: 'create probe/hosts/deepagents/.venv as requirements.txt says' };
    const code = installed('deepagents-code');
    const sdk = installed('deepagents');
    if (!code || !sdk) return { missing: 'deepagents-code is not installed in probe/hosts/deepagents/.venv' };
    return { version: `${sdk}+code-${code}` };
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
      DEEPAGENTS_HOME: ensureDir(resolve(ctx.tmpDir, 'home')),
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1',
      OPENAI_API_KEY: 'probe',
    };
    const r = await runCommand(python, ['-W', 'ignore', resolve(hostDir, 'agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

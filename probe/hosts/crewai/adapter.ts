// crewAI: an Agent in a one-task Crew, MCP tools from the native client
// (crewai.mcp) or from the vendored crewai-tools MCPServerAdapter, model routed
// to the mock through the native OpenAI provider. Runs agent.py with the venv
// in this directory (see requirements.txt).
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readdirSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/crewai');
const venv = resolve(hostDir, '.venv');
const python = process.platform === 'win32' ? resolve(venv, 'Scripts/python.exe') : resolve(venv, 'bin/python');

/** The installed version of a distribution, read from its dist-info directory name. */
function distVersion(name: string): string | undefined {
  const roots = [resolve(venv, 'Lib/site-packages'), ...(existsSync(resolve(venv, 'lib')) ? readdirSync(resolve(venv, 'lib')).map((d) => resolve(venv, 'lib', d, 'site-packages')) : [])];
  const re = new RegExp(`^${name.replace(/-/g, '[-_]')}-(.+)\\.dist-info$`, 'i');
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const entry of readdirSync(root)) {
      const m = entry.match(re);
      if (m) return m[1];
    }
  }
  return undefined;
}

const adapter: HostAdapter = {
  id: 'crewai',
  title: 'crewAI',
  mockScript: 'mock-script.js',
  configs: [
    { name: 'default', description: 'Agent(mcps=[MCPServerStdio|MCPServerHTTP]): the native crewai.mcp client, every block as text, str(result) when content is empty.', modelApi: 'chat' },
    { name: 'crewai-tools', description: 'crewai_tools.MCPServerAdapter over mcpadapt: first block as text, list repr of text blocks otherwise.', modelApi: 'chat' },
  ],
  async version() {
    if (!existsSync(python)) return { missing: 'create the venv: uv venv probe/hosts/crewai/.venv --python 3.12 && uv pip install -r probe/hosts/crewai/requirements.txt' };
    const crewai = distVersion('crewai');
    if (!crewai) return { missing: 'crewai is not installed in probe/hosts/crewai/.venv' };
    const mcp = distVersion('mcp');
    const tools = distVersion('crewai-tools');
    return { version: crewai, detail: `mcp ${mcp ?? '?'}, crewai-tools ${tools ?? 'absent'}, mcpadapt ${distVersion('mcpadapt') ?? 'absent'}` };
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
      // Keep crewAI off the network and out of the user's home: telemetry,
      // tracing and the first-run tracing prompt off, storage under a probe name.
      CREWAI_DISABLE_TELEMETRY: 'true',
      OTEL_SDK_DISABLED: 'true',
      CREWAI_TRACING_ENABLED: 'false',
      CREWAI_STORAGE_DIR: 'canimcp-probe-crewai',
      OPENAI_API_KEY: 'probe',
    };
    // -I ignores PYTHON* variables, so utf-8 and unbuffered output go on the command line.
    const r = await runCommand(python, ['-I', '-X', 'utf8', '-u', resolve(hostDir, 'agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

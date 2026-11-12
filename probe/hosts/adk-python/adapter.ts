// Google ADK (Python): an LlmAgent with McpToolset, run once through a Runner by agent.py in the pinned .venv.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/adk-python');
const python = process.env.PROBE_ADK_PYTHON ?? resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');

const adapter: HostAdapter = {
  id: 'adk-python',
  title: 'Google ADK (Python)',
  configs: [
    { name: 'default', description: 'Gemini model class, Gemini API generateContent: the FunctionResponse carries the whole result dict.', modelApi: 'gemini' },
    { name: 'anthropic', description: 'AnthropicLlm model class, Messages API: the content text when content is non-empty, else the JSON of the dict.', modelApi: 'anthropic' },
    { name: 'modern', description: 'Gemini plus ADK_ENABLE_MCP_MODERN_PROTOCOL=1: negotiate_auto, server/discover first.', modelApi: 'gemini' },
    { name: 'strict-errors', description: 'Gemini plus ADK_DISABLE_MCP_GRACEFUL_ERROR_HANDLING=1: SDK validation errors propagate instead of becoming {"error": ...}.', modelApi: 'gemini' },
  ],
  async version() {
    if (!existsSync(python)) return { missing: `${python} not found; run uv venv --python 3.13 .venv && uv pip install --python .venv/Scripts/python.exe -r requirements.txt in probe/hosts/adk-python` };
    const r = await runCommand(python, ['-c', 'import importlib.metadata as m; print(m.version("google-adk"), m.version("mcp"), m.version("anthropic"), m.version("google-genai"))'], { timeoutMs: 60000 });
    const [adk, mcp, anthropic, genai] = r.stdout.trim().split(/\s+/);
    if (!adk) return { missing: `could not read google-adk version: ${r.stderr.trim()}` };
    return { version: adk, detail: `PyPI google-adk ${adk} = tag v2.14.0 (93814c34), 54 commits below pin dd7161f; mcp ${mcp}, anthropic ${anthropic}, google-genai ${genai}` };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
      // Gemini API backend, never Vertex; the key is only checked for presence.
      GOOGLE_GENAI_USE_VERTEXAI: 'false',
      GOOGLE_API_KEY: 'probe',
      // The Anthropic SDK strips a trailing /v1 and adds /v1/messages itself.
      ANTHROPIC_API_KEY: 'probe',
      ANTHROPIC_BASE_URL: ctx.mockUrl,
    };
    delete env.GEMINI_API_KEY;
    delete env.GOOGLE_CLOUD_PROJECT;
    delete env.GOOGLE_CLOUD_LOCATION;
    if (ctx.config.name === 'modern') env.ADK_ENABLE_MCP_MODERN_PROTOCOL = '1';
    if (ctx.config.name === 'strict-errors') env.ADK_DISABLE_MCP_GRACEFUL_ERROR_HANDLING = '1';
    const r = await runCommand(python, [resolve(hostDir, 'agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

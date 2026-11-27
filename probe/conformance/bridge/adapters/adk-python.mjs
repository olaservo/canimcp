// Conformance-only configs for the adk-python adapter: `answer` runs
// probe/hosts/adk-python/agent.py with PROBE_ELICIT=accept, which passes McpToolset an
// elicitation_callback that accepts every request with empty content.
// `answer-modern` adds ADK_ENABLE_MCP_MODERN_PROTOCOL=1, as the `modern` config does.
// ADK calls session.call_tool without allow_input_required and exposes no option for it.
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/adk-python');
const python = process.env.PROBE_ADK_PYTHON ?? resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const { runCommand, ensureDir, findFinalText } = await import(pathToFileURL(resolve(here, '../../../dist/lib/hosts.js')).href);

export default {
  configs: [
    { name: 'answer', description: 'default plus McpToolset elicitation_callback accepting every request with empty content. ADK exposes no allow_input_required.', modelApi: 'gemini' },
    { name: 'answer-modern', description: 'answer plus ADK_ENABLE_MCP_MODERN_PROTOCOL=1, as in modern. ADK exposes no allow_input_required.', modelApi: 'gemini' },
  ],
  async run(ctx) {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = {
      ...process.env,
      PYTHONUNBUFFERED: '1',
      PYTHONIOENCODING: 'utf-8',
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
      PROBE_ELICIT: 'accept',
      GOOGLE_GENAI_USE_VERTEXAI: 'false',
      GOOGLE_API_KEY: 'probe',
      ANTHROPIC_API_KEY: 'probe',
      ANTHROPIC_BASE_URL: ctx.mockUrl,
    };
    delete env.GEMINI_API_KEY;
    delete env.GOOGLE_CLOUD_PROJECT;
    delete env.GOOGLE_CLOUD_LOCATION;
    if (ctx.config.name === 'answer-modern') env.ADK_ENABLE_MCP_MODERN_PROTOCOL = '1';
    const r = await runCommand(python, [resolve(hostDir, 'agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

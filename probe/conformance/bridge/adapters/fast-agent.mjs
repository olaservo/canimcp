// Conformance-only config for the fast-agent adapter: `answer` runs
// probe/hosts/fast-agent/conformance_agent.py, a FastAgent app whose agent has a
// decorator-supplied elicitation handler that accepts with empty content.
// The config file matches the adapter's default (generic provider, protocol_mode auto).
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/fast-agent');
const python = resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const { runCommand, ensureDir, slash, findFinalText } = await import(pathToFileURL(resolve(here, '../../../dist/lib/hosts.js')).href);
const y = (s) => JSON.stringify(s);

export default {
  configs: [{ name: 'answer', description: 'FastAgent app with elicitation_handler accepting every request with empty content; otherwise the default config.', modelApi: 'chat' }],
  async run(ctx) {
    const home = ensureDir(resolve(ctx.tmpDir, 'fast-agent-home'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const config = [
      `default_model: "generic.gpt-probe"`,
      'generic:',
      '  api_key: probe',
      `  base_url: ${y(`${ctx.mockUrl}/v1`)}`,
      'logger:',
      '  type: file',
      `  path: ${y(slash(resolve(ctx.runDir, 'client-log.jsonl')))}`,
      '  level: info',
      '  progress_display: false',
      '  show_chat: false',
      '  show_tools: false',
      '  enable_markup: false',
      'mcp:',
      '  defaults:',
      '    protocol_mode: auto',
      '  servers:',
      '    probe:',
      '      transport: http',
      `      url: ${y(ctx.serverUrl)}`,
      '      read_timeout_seconds: 60',
      '',
    ].join('\n');
    const configPath = resolve(ctx.tmpDir, 'fastagent.config.yaml');
    writeFileSync(configPath, config);
    writeFileSync(resolve(ctx.runDir, 'client-config.yaml'), config);
    const env = {
      ...process.env,
      NO_COLOR: '1',
      TERM: 'dumb',
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1',
      FAST_AGENT_HOME: slash(home),
      GENERIC_API_KEY: 'probe',
      GENERIC_BASE_URL: `${ctx.mockUrl}/v1`,
      PROBE_FA_CONFIG: slash(configPath),
      PROBE_FA_HOME: slash(home),
      PROBE_FA_WORKSPACE: slash(cwd),
      PROBE_PROMPT: ctx.prompt,
    };
    const r = await runCommand(python, [resolve(hostDir, 'conformance_agent.py')], { cwd, env, timeoutMs: ctx.timeoutMs });
    const stdout = r.stdout.replace(/\r/g, '');
    const stderr = r.stderr.replace(/\r/g, '');
    return { ...r, stdout, stderr, finalText: findFinalText(stdout) ?? findFinalText(stderr) };
  },
};

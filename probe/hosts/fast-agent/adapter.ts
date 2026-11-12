// fast-agent through `fast-agent go --message`, installed from PyPI into .venv at the pin.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/fast-agent');
const bin = process.env.PROBE_FAST_AGENT_BIN ?? resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts/fast-agent.exe' : 'bin/fast-agent');

function yamlString(s: string): string {
  return JSON.stringify(s);
}

const adapter: HostAdapter = {
  id: 'fast-agent',
  title: 'fast-agent',
  configs: [
    { name: 'default', description: 'generic provider (Chat Completions), protocol_mode auto: server/discover first, then initialize.', modelApi: 'chat' },
    { name: 'legacy', description: 'mcp.defaults.protocol_mode: legacy, the initialize handshake only.', modelApi: 'chat' },
    { name: 'modern', description: 'mcp.defaults.protocol_mode: modern, server/discover only, fails if the server declines.', modelApi: 'chat' },
    { name: 'ptc', description: 'ptc.enabled: true and --ptc: tools reached from model-written Python through exec_sandbox. Local POSIX only at this version.', modelApi: 'chat' },
    { name: 'anthropic', description: 'anthropic provider: the Messages API converter.', modelApi: 'anthropic' },
  ],
  async version() {
    if (!existsSync(bin)) return { missing: `${bin} not found; run uv venv .venv && uv pip install -r requirements.txt in probe/hosts/fast-agent` };
    const r = await runCommand(bin, ['--version'], { timeoutMs: 60000, env: { ...process.env, NO_COLOR: '1' } });
    const m = (r.stdout + r.stderr).match(/v?(\d+\.\d+\.\d+\S*)/);
    return { version: m ? m[1] : (r.stdout.trim() || r.stderr.trim()), detail: 'PyPI fast-agent-mcp, tag v0.10.53 = b8a36d2' };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const home = ensureDir(resolve(ctx.tmpDir, 'fast-agent-home'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    // fast-agent appends to its log file; a rerun into the same runDir starts clean.
    const logPath = resolve(ctx.runDir, 'client-log.jsonl');
    rmSync(logPath, { force: true });
    const protocolMode = ctx.config.name === 'legacy' ? 'legacy' : ctx.config.name === 'modern' ? 'modern' : 'auto';
    // The Anthropic path takes max_tokens from the model catalog, and an unknown name
    // leaves it unset ("AsyncMessages.stream() missing ... 'max_tokens'"), so that
    // config names a catalogued model. The mock answers any model name.
    const model = ctx.config.name === 'anthropic' ? 'anthropic.claude-sonnet-4-5' : 'generic.gpt-probe';
    const server =
      ctx.transport === 'http'
        ? [`      transport: http`, `      url: ${yamlString(ctx.serverUrl as string)}`]
        : [`      transport: stdio`, `      command: ${yamlString(ctx.serverCommand.command)}`, `      args: [${ctx.serverCommand.args.map(yamlString).join(', ')}]`];
    const config = [
      `default_model: ${yamlString(model)}`,
      'generic:',
      '  api_key: probe',
      `  base_url: ${yamlString(`${ctx.mockUrl}/v1`)}`,
      'anthropic:',
      '  api_key: probe',
      // The Anthropic client strips a trailing /v1 and the SDK adds /v1/messages.
      `  base_url: ${yamlString(ctx.mockUrl)}`,
      'logger:',
      '  type: file',
      `  path: ${yamlString(slash(logPath))}`,
      '  level: info',
      '  progress_display: false',
      '  show_chat: false',
      '  show_tools: false',
      '  enable_markup: false',
      ...(ctx.config.name === 'ptc' ? ['ptc:', '  enabled: true'] : []),
      'mcp:',
      '  defaults:',
      `    protocol_mode: ${protocolMode}`,
      '  servers:',
      '    probe:',
      ...server,
      '      read_timeout_seconds: 60',
      '',
    ].join('\n');
    const configPath = resolve(ctx.tmpDir, 'fastagent.config.yaml');
    writeFileSync(configPath, config);
    writeFileSync(resolve(ctx.runDir, 'client-config.yaml'), config);

    const args = [
      // Top-level flag: skips the PyPI update check, which a fresh home runs every time.
      '--no-update-check',
      'go',
      '--config-path', slash(configPath),
      '--home', slash(home),
      '--workspace', slash(cwd),
      '--servers', 'probe',
      '--model', model,
      '--no-shell',
      '--quiet',
      '--message', ctx.prompt,
    ];
    if (ctx.config.name === 'ptc') args.push('--ptc');
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      NO_COLOR: '1',
      TERM: 'dumb',
      COLUMNS: '200',
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1',
      FAST_AGENT_HOME: slash(home),
      GENERIC_API_KEY: 'probe',
      GENERIC_BASE_URL: `${ctx.mockUrl}/v1`,
      ANTHROPIC_API_KEY: 'probe',
      ANTHROPIC_BASE_URL: ctx.mockUrl,
    };
    const r = await runCommand(bin, args, { cwd, env, timeoutMs: ctx.timeoutMs });
    // Python writes CRLF on Windows; findFinalText stops at \n only.
    const stdout = r.stdout.replace(/\r/g, '');
    const stderr = r.stderr.replace(/\r/g, '');
    return { ...r, stdout, stderr, finalText: findFinalText(stdout) ?? findFinalText(stderr) };
  },
};

export default adapter;

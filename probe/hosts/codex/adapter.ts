// Codex CLI through `codex exec` with a custom model provider on the Responses API.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/codex');
// The npm package's launcher picks the platform binary. Running it through
// node keeps the prompt as one argument on Windows, which a shell would split.
const launcher = resolve(hostDir, 'node_modules/@openai/codex/bin/codex.js');
const bin = process.env.PROBE_CODEX_BIN ?? launcher;
const invoke = (args: string[]) => (bin === launcher ? { command: process.execPath, args: [launcher, ...args] } : { command: bin, args });

function tomlString(s: string): string {
  return JSON.stringify(s);
}

const adapter: HostAdapter = {
  id: 'codex',
  title: 'Codex CLI',
  mockScript: 'mock-script.js',
  configs: [
    { name: 'default', description: 'Stock settings: rmcp legacy mode, 2025-06-18 preferred.', modelApi: 'responses' },
    {
      name: 'mcp-2026-07-28',
      description:
        'features.mcp_2026_07_28 = true (also passed as --enable): discover-first, 2026-07-28 preferred. Observed to apply to Streamable HTTP servers only; stdio servers keep the 2025-06-18 handshake (connection_manager.rs stdio_protocol_mode), so run this config with --transport http.',
      modelApi: 'responses',
    },
    // No Chat Completions config: at 0.169.0-alpha.3 `wire_api = "chat"` fails config loading
    // ("no longer supported", openai/codex discussion 7782). Codex speaks the Responses API only.
  ],
  async version() {
    if (!existsSync(bin)) return { missing: `${bin} not found; run npm install in probe/hosts/codex` };
    const v = invoke(['--version']);
    const r = await runCommand(v.command, v.args, { timeoutMs: 30000 });
    const pkg = JSON.parse(readFileSync(resolve(hostDir, 'node_modules/@openai/codex/package.json'), 'utf8')) as { version: string };
    return { version: pkg.version, detail: r.stdout.trim() };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const home = ensureDir(resolve(ctx.tmpDir, 'codex-home'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const wireApi = ctx.config.name === 'chat-completions' ? 'chat' : 'responses';
    const server =
      ctx.transport === 'http'
        ? `url = ${tomlString(ctx.serverUrl as string)}`
        : `command = ${tomlString(ctx.serverCommand.command)}\nargs = [${ctx.serverCommand.args.map(tomlString).join(', ')}]`;
    const config = [
      'model = "gpt-probe"',
      'model_provider = "probe"',
      'approval_policy = "never"',
      'sandbox_mode = "danger-full-access"',
      '',
      '[model_providers.probe]',
      'name = "probe"',
      `base_url = ${tomlString(`${ctx.mockUrl}/v1`)}`,
      'env_key = "PROBE_API_KEY"',
      `wire_api = "${wireApi}"`,
      '',
      '[mcp_servers.probe]',
      server,
      'startup_timeout_sec = 60',
      'tool_timeout_sec = 60',
      '',
      ...(ctx.config.name === 'mcp-2026-07-28' ? ['[features]', 'mcp_2026_07_28 = true'] : []),
      '',
    ].join('\n');
    writeFileSync(resolve(home, 'config.toml'), config);
    writeFileSync(resolve(ctx.runDir, 'client-config.toml'), config);

    const enable = ctx.config.name === 'mcp-2026-07-28' ? ['--enable', 'mcp_2026_07_28'] : [];
    const cmd = invoke(['exec', ...enable, '--skip-git-repo-check', '--ephemeral', '--json', '--dangerously-bypass-approvals-and-sandbox', '-C', slash(cwd), ctx.prompt]);
    const r = await runCommand(cmd.command, cmd.args, {
      cwd,
      env: { ...process.env, CODEX_HOME: home, PROBE_API_KEY: 'probe', NO_COLOR: '1' },
      timeoutMs: ctx.timeoutMs,
    });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

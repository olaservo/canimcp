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
        'features.mcp_2026_07_28 = true (also passed as --enable): discover-first, 2026-07-28 preferred. On its own it applies to Streamable HTTP servers only; a stdio server keeps the 2025-06-18 handshake unless it also opts in (rmcp-client protocol_mode.rs stdio_mode), which is the next config.',
      modelApi: 'responses',
    },
    {
      name: 'mcp-2026-07-28-stdio-opt-in',
      description: 'The feature flag plus CODEX_MCP_PROTOCOL_VERSION = "2026-07-28" in the stdio server\'s env table. Stdio only; over HTTP it is the same as mcp-2026-07-28.',
      modelApi: 'responses',
    },
    {
      name: 'stdio-opt-in-no-flag',
      description: 'CODEX_MCP_PROTOCOL_VERSION = "2026-07-28" in the stdio server\'s env table with the feature flag off. Stdio only; over HTTP it is the same as default.',
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
    const flagOn = ctx.config.name === 'mcp-2026-07-28' || ctx.config.name === 'mcp-2026-07-28-stdio-opt-in';
    const stdioOptIn = ctx.transport === 'stdio' && (ctx.config.name === 'mcp-2026-07-28-stdio-opt-in' || ctx.config.name === 'stdio-opt-in-no-flag');
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
      ...(stdioOptIn ? ['[mcp_servers.probe.env]', 'CODEX_MCP_PROTOCOL_VERSION = "2026-07-28"', ''] : []),
      ...(flagOn ? ['[features]', 'mcp_2026_07_28 = true'] : []),
      '',
    ].join('\n');
    writeFileSync(resolve(home, 'config.toml'), config);
    writeFileSync(resolve(ctx.runDir, 'client-config.toml'), config);

    const enable = flagOn ? ['--enable', 'mcp_2026_07_28'] : [];
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

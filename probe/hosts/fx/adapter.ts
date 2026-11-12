// fx's native engine through `fx ask`, with a configured openai-chat-completions
// provider. fx runs on Linux and macOS only; on Windows run the runner from WSL.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, mkdirSync, mkdtempSync, chmodSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/fx');
const bin = process.env.PROBE_FX_BIN ?? resolve(hostDir, 'bin/fx');

const adapter: HostAdapter = {
  id: 'fx',
  title: 'fx (native engine)',
  platforms: ['linux', 'darwin'],
  mockScript: 'mock-script.js',
  configs: [{ name: 'default', description: 'fx ask --full-access on a configured Chat Completions provider; MCP tools are deferred until the model selects them.', modelApi: 'chat' }],
  async version() {
    if (!existsSync(bin)) return { missing: `${bin} not found; build fx at the pin with zig build and copy zig-out/bin/fx to probe/hosts/fx/bin` };
    const r = await runCommand(bin, ['--version'], { timeoutMs: 30000 });
    return { version: (r.stdout || r.stderr).trim().split('\n')[0], detail: 'built from source at eab1401' };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    // fx reads FX_HOME as the folder that stands in for ~/.fx (src/core/shared/profile_paths.zig),
    // and ignores settings there when the files are world-writable ("private_state_permissions_unsupported"
    // in fx status). A run directory on a WSL /mnt/c mount is, so the home goes on the native filesystem.
    const home = mkdtempSync(resolve(tmpdir(), 'canimcp-fx-'));
    const fxDir = ensureDir(resolve(home, '.fx'));
    chmodSync(fxDir, 0o700);
    // fx searches the cwd's ancestors for skill folders, so the cwd goes under the temp home too.
    const cwd = ensureDir(resolve(home, 'workspace'));
    mkdirSync(resolve(cwd, '.git'), { recursive: true });
    const settings = {
      providers: {
        probe: {
          protocol: 'openai-chat-completions',
          base_url: `${ctx.mockUrl.replace('127.0.0.1', 'localhost')}/v1`,
          auth: { type: 'none' },
          // Keyed by model id: configured_provider.zig's parse_metadata iterates an object and rejects unknown fields.
          model_metadata: { 'gpt-probe': { context_window: 128000, max_output_tokens: 8192, supports_tool_use: true, supports_vision: false } },
        },
      },
    };
    writeFileSync(resolve(fxDir, 'settings.json'), JSON.stringify(settings, null, 2), { mode: 0o600 });
    const server = ctx.transport === 'http' ? { url: ctx.serverUrl } : { command: ctx.serverCommand.command, args: ctx.serverCommand.args };
    const mcpConfig = { mcp: { probe: server } };
    writeFileSync(resolve(fxDir, 'mcp.json'), JSON.stringify(mcpConfig, null, 2), { mode: 0o600 });
    writeFileSync(resolve(ctx.runDir, 'client-config.json'), JSON.stringify({ settings, mcp: mcpConfig }, null, 2));

    const args = ['ask', '--provider', 'probe', '--model', 'gpt-probe', '--full-access', '--json', '--no-save', '--quiet', ctx.prompt];
    try {
      const r = await runCommand(bin, args, {
        cwd,
        env: { ...process.env, HOME: home, FX_HOME: fxDir, NO_COLOR: '1', FX_NO_UPDATE_CHECK: '1' },
        timeoutMs: ctx.timeoutMs,
      });
      return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  },
};

export default adapter;

// Conformance-only config for the fx adapter: `http` is the default config with
// `"type": "http"` on the server entry. fx 0.0.16 skips a url entry without it
// ("has a \"url\" but no \"type\""), and probe/hosts/fx/adapter.ts writes none,
// since the probe has only run fx over stdio.
import { resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { writeFileSync, mkdirSync, mkdtempSync, chmodSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const bin = process.env.PROBE_FX_BIN ?? resolve(here, '../../../hosts/fx/bin/fx');
const { runCommand, ensureDir, findFinalText } = await import(pathToFileURL(resolve(here, '../../../dist/lib/hosts.js')).href);

export default {
  configs: [{ name: 'http', description: 'fx ask --full-access on a configured Chat Completions provider, MCP server entry {type: http, url}.', modelApi: 'chat' }],
  async run(ctx) {
    const home = mkdtempSync(resolve(tmpdir(), 'canimcp-fx-'));
    const fxDir = ensureDir(resolve(home, '.fx'));
    chmodSync(fxDir, 0o700);
    const cwd = ensureDir(resolve(home, 'workspace'));
    mkdirSync(resolve(cwd, '.git'), { recursive: true });
    const settings = {
      providers: {
        probe: {
          protocol: 'openai-chat-completions',
          base_url: `${ctx.mockUrl.replace('127.0.0.1', 'localhost')}/v1`,
          auth: { type: 'none' },
          model_metadata: { 'gpt-probe': { context_window: 128000, max_output_tokens: 8192, supports_tool_use: true, supports_vision: false } },
        },
      },
    };
    writeFileSync(resolve(fxDir, 'settings.json'), JSON.stringify(settings, null, 2), { mode: 0o600 });
    const mcpConfig = { mcp: { probe: { type: 'http', url: ctx.serverUrl } } };
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

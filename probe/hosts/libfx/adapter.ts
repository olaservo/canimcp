// libfx's createMcpAdapter over the official TypeScript client, driven by
// createFxAgent on a custom Chat Completions provider. Needs the libfx package
// built from the pin and installed in this directory; Linux and macOS only.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/libfx');

const adapter: HostAdapter = {
  id: 'libfx',
  title: 'libfx (fx JavaScript adapter)',
  platforms: ['linux', 'darwin'],
  configs: [{ name: 'default', description: 'createMcpAdapter(client) tools on createFxAgent with a custom provider.', modelApi: 'chat' }],
  async version() {
    const p = resolve(hostDir, 'node_modules/libfx/package.json');
    if (!existsSync(p)) return { missing: 'build libfx from the pin (see hosts/libfx/README.md) and npm install it here' };
    const pkg = JSON.parse(readFileSync(p, 'utf8')) as { version: string; gitHead?: string };
    return { version: `${pkg.version}${pkg.gitHead ? '+' + pkg.gitHead.slice(0, 7) : ''}`, detail: 'built from source at eab1401' };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = {
      ...process.env,
      PROBE_MOCK_URL: ctx.mockUrl.replace('127.0.0.1', 'localhost'),
      PROBE_PROMPT: ctx.prompt,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
    };
    const r = await runCommand(process.execPath, [resolve(hostDir, 'agent.mjs')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

// Kilo Code's CLI (`kilo run`), a fork of opencode, with a custom
// OpenAI-compatible provider pointed at the mock and one MCP server.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/kilocode');
// The npm install puts each platform's binary in its own package. The adapter runs it directly, so it
// does not depend on @kilocode/cli's postinstall, which npm may skip. A source build in bin/ wins.
const exe = process.platform === 'win32' ? 'kilo.exe' : 'kilo';
const platform = process.platform === 'win32' ? 'windows' : process.platform;
const builtBin = resolve(hostDir, 'bin', exe);
const npmBins = [`cli-${platform}-${process.arch}`, `cli-${platform}-${process.arch}-baseline`].map((p) => resolve(hostDir, 'node_modules/@kilocode', p, 'bin', exe));
const bin = process.env.PROBE_KILOCODE_BIN ?? (existsSync(builtBin) ? builtBin : (npmBins.find((p) => existsSync(p)) ?? npmBins[0]!));
const fromSource = bin === builtBin;

const adapter: HostAdapter = {
  id: 'kilocode',
  title: 'Kilo Code',
  mockScript: 'mock-script.js',
  configs: [
    { name: 'default', kind: 'default', description: 'Stock settings: Code Mode off, so MCP tools are direct model tools named <server>_<tool>.', modelApi: 'chat' },
    { name: 'code-mode', kind: 'setting', description: 'experimental.code_mode = true: MCP tools are reached through the execute script tool, as in opencode\'s default.', modelApi: 'chat' },
  ],
  async version() {
    if (!existsSync(bin)) return { missing: `${bin} not found; run npm install in probe/hosts/kilocode` };
    const r = await runCommand(bin, ['--version'], { timeoutMs: 60000 });
    const printed = r.stdout.trim() || r.stderr.trim();
    if (fromSource) return { version: printed, detail: 'built from source' };
    const pkg = JSON.parse(readFileSync(resolve(hostDir, 'node_modules/@kilocode/cli/package.json'), 'utf8')) as { version: string };
    return { version: pkg.version, detail: `@kilocode/cli ${pkg.version} from npm (${bin.replace(/^.*node_modules[\\/]/, '')}), --version ${printed}` };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const home = ensureDir(resolve(ctx.tmpDir, 'home'));
    const xdg = {
      config: ensureDir(resolve(home, '.config')),
      data: ensureDir(resolve(home, '.local/share')),
      state: ensureDir(resolve(home, '.local/state')),
      cache: ensureDir(resolve(home, '.cache')),
    };
    const configDir = ensureDir(resolve(xdg.config, 'kilo'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));

    const server: Record<string, unknown> =
      ctx.transport === 'http'
        ? { type: 'remote', url: ctx.serverUrl }
        : { type: 'local', command: [ctx.serverCommand.command, ...ctx.serverCommand.args] };
    server.timeout = 60000;

    const config: Record<string, unknown> = {
      autoupdate: false,
      provider: {
        probe: {
          name: 'probe',
          npm: '@ai-sdk/openai-compatible',
          env: ['PROBE_API_KEY'],
          options: { baseURL: `${ctx.mockUrl}/v1`, apiKey: 'probe' },
          models: { 'gpt-probe': { name: 'gpt-probe', tool_call: true, attachment: true, limit: { context: 200000, output: 8192 }, modalities: { input: ['text', 'image'], output: ['text'] } } },
        },
      },
      model: 'probe/gpt-probe',
      mcp: { probe: server },
      ...(ctx.config.name === 'code-mode' ? { experimental: { code_mode: true } } : {}),
    };
    const configText = JSON.stringify(config, null, 2);
    const configPath = resolve(configDir, 'kilo.json');
    writeFileSync(configPath, configText);
    writeFileSync(resolve(ctx.runDir, 'client-config.json'), configText);

    const env: NodeJS.ProcessEnv = {};
    for (const [k, v] of Object.entries(process.env)) if (!k.startsWith('KILO_') && !k.startsWith('OPENCODE_') && !k.startsWith('XDG_')) env[k] = v;
    Object.assign(env, {
      // `kilo run` takes PWD ahead of the process cwd (packages/opencode/src/cli/cmd/run.ts at 3c7f2659).
      PWD: cwd,
      HOME: home,
      USERPROFILE: home,
      KILO_TEST_HOME: home,
      XDG_CONFIG_HOME: xdg.config,
      XDG_DATA_HOME: xdg.data,
      XDG_STATE_HOME: xdg.state,
      XDG_CACHE_HOME: xdg.cache,
      KILO_CONFIG: slash(configPath),
      KILO_DISABLE_AUTOUPDATE: '1',
      PROBE_API_KEY: 'probe',
      NO_COLOR: '1',
    });

    const args = ['run', '--print-logs', '--auto', '--title', 'probe', '--model', 'probe/gpt-probe', ctx.prompt];
    const r = await runCommand(bin, args, { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

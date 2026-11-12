// opencode 2.x through `opencode run --standalone`, with a custom
// OpenAI-compatible provider pointed at the mock and one MCP server.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/opencode');
// A source build at the research pin goes in bin/ (recipe in package.json) and wins over the npm
// install, whose postinstall copies the platform binary over node_modules/@opencode/cli/bin/opencode(.exe).
// Either way the adapter runs a native binary, which keeps the prompt as one argument.
const exe = process.platform === 'win32' ? 'opencode.exe' : 'opencode';
const builtBin = resolve(hostDir, 'bin', exe);
const npmBin = resolve(hostDir, 'node_modules/@opencode/cli/bin', exe);
const bin = process.env.PROBE_OPENCODE_BIN ?? (existsSync(builtBin) ? builtBin : npmBin);
const fromSource = bin === builtBin;

const adapter: HostAdapter = {
  id: 'opencode',
  title: 'opencode',
  mockScript: 'mock-script.js',
  configs: [
    { name: 'default', description: 'Stock settings: Code Mode on, so MCP tools are reached through the execute script tool; protocol legacy.', modelApi: 'chat' },
    { name: 'codemode-off', description: 'mcp.servers.probe.codemode = false: the server\'s tools are direct model tools.', modelApi: 'chat' },
    { name: 'execute-denied', description: 'permissions deny execute on *: Code Mode disabled for every server, MCP tools exposed directly.', modelApi: 'chat' },
    { name: 'protocol-2026-07-28', description: 'codemode = false plus mcp.servers.probe.protocol = "2026-07-28": direct tools over the discover-first revision.', modelApi: 'chat' },
  ],
  async version() {
    if (!existsSync(bin)) return { missing: `${bin} not found; build opencode at the pin into probe/hosts/opencode/bin (see package.json) or run npm install in probe/hosts/opencode` };
    const r = await runCommand(bin, ['--version'], { timeoutMs: 30000 });
    // `--version` prints `opencode v0.0.0-a98e3fa`; the run directory wants the bare version.
    if (fromSource) return { version: (r.stdout.trim() || r.stderr.trim()).replace(/^opencode\s+v?/, ''), detail: 'built from source at a98e3fa' };
    const pkg = JSON.parse(readFileSync(resolve(hostDir, 'node_modules/@opencode/cli/package.json'), 'utf8')) as { version: string };
    return { version: pkg.version, detail: r.stdout.trim() };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const home = ensureDir(resolve(ctx.tmpDir, 'home'));
    const xdg = {
      config: ensureDir(resolve(home, '.config')),
      data: ensureDir(resolve(home, '.local/share')),
      state: ensureDir(resolve(home, '.local/state')),
      cache: ensureDir(resolve(home, '.cache')),
    };
    const configDir = ensureDir(resolve(xdg.config, 'opencode'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));

    const direct = ctx.config.name === 'codemode-off' || ctx.config.name === 'protocol-2026-07-28';
    const server: Record<string, unknown> =
      ctx.transport === 'http'
        ? { type: 'remote', url: ctx.serverUrl }
        : { type: 'local', command: [ctx.serverCommand.command, ...ctx.serverCommand.args] };
    if (direct) server.codemode = false;
    if (ctx.config.name === 'protocol-2026-07-28') server.protocol = '2026-07-28';
    server.timeout = { startup: 60000, catalog: 60000, execution: 60000 };

    const config: Record<string, unknown> = {
      $schema: 'https://opencode.ai/config.json',
      providers: {
        probe: {
          name: 'probe',
          package: '@opencode/ai/providers/openai-compatible',
          env: ['PROBE_API_KEY'],
          settings: { baseURL: `${ctx.mockUrl}/v1`, apiKey: 'probe' },
          models: { 'gpt-probe': { name: 'gpt-probe', capabilities: { tools: true, input: ['text', 'image'], output: ['text'] } } },
        },
      },
      mcp: { servers: { probe: server } },
      ...(ctx.config.name === 'execute-denied' ? { permissions: [{ action: 'execute', resource: '*', effect: 'deny' }] } : {}),
    };
    const configText = JSON.stringify(config, null, 2);
    const configPath = resolve(configDir, 'opencode.json');
    writeFileSync(configPath, configText);
    writeFileSync(resolve(ctx.runDir, 'client-config.json'), configText);

    const env: NodeJS.ProcessEnv = {};
    for (const [k, v] of Object.entries(process.env)) if (!k.startsWith('OPENCODE_') && !k.startsWith('XDG_')) env[k] = v;
    Object.assign(env, {
      HOME: home,
      USERPROFILE: home,
      OPENCODE_TEST_HOME: home,
      XDG_CONFIG_HOME: xdg.config,
      XDG_DATA_HOME: xdg.data,
      XDG_STATE_HOME: xdg.state,
      XDG_CACHE_HOME: xdg.cache,
      OPENCODE_CONFIG: slash(configPath),
      PROBE_API_KEY: 'probe',
      NO_COLOR: '1',
    });

    const args = ['run', '--standalone', '--print-logs', '--auto', '--archived', '--title', 'probe', '--model', 'probe/gpt-probe', ctx.prompt];
    const r = await runCommand(bin, args, { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

// Cline CLI through `cline "<prompt>" --yolo --json`, the openai-compatible
// provider pointed at the mock, config under an isolated CLINE_DIR.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/cline');
// The npm wrapper `cline` resolves to @cline/cli-<platform>/bin/cline[.exe],
// a Bun-embedded binary. Spawning it directly keeps one process to kill.
const platformPkg = `@cline/cli-${process.platform === 'win32' ? 'windows' : process.platform}-${process.arch}`;
const platformBin = resolve(hostDir, 'node_modules', platformPkg, 'bin', process.platform === 'win32' ? 'cline.exe' : 'cline');
const bin = process.env.PROBE_CLINE_BIN ?? platformBin;

const adapter: HostAdapter = {
  id: 'cline',
  title: 'Cline CLI',
  mockScript: 'mock-script.js',
  configs: [
    {
      name: 'default',
      description:
        'openai-compatible provider, Chat Completions, --yolo --json, tools auto-approved. The note names no switch that changes which field the model gets (mcpApps is not settable from the CLI; the only per-server knob is timeout), so this is the only config. Transport is the dimension that matters: stdio is the hand-rolled 2024-11-05 client, http is the SDK client.',
      modelApi: 'chat',
    },
  ],
  async version() {
    if (!existsSync(bin)) return { missing: `${bin} not found; run npm install in probe/hosts/cline` };
    const pkg = JSON.parse(readFileSync(resolve(hostDir, 'node_modules/cline/package.json'), 'utf8')) as { version: string };
    const r = await runCommand(bin, ['--version'], { timeoutMs: 30000, env: { ...process.env, CLINE_NO_AUTO_UPDATE: '1' } });
    return { version: pkg.version, detail: (r.stdout.trim() || r.stderr.trim()).split('\n')[0] };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const home = ensureDir(resolve(ctx.tmpDir, 'home'));
    const clineDir = ensureDir(resolve(home, '.cline'));
    const settingsDir = ensureDir(resolve(clineDir, 'data', 'settings'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));

    // sdk/packages/core/src/types/provider-settings.ts StoredProviderSettingsSchema: version, modes and
    // updatedAt are required; a file that fails the parse is read as empty and the run goes to api.openai.com.
    const providers = {
      version: 1,
      lastUsedProvider: 'openai-compatible',
      modes: {},
      providers: {
        'openai-compatible': {
          settings: { provider: 'openai-compatible', apiKey: 'probe', model: 'gpt-probe', baseUrl: `${ctx.mockUrl}/v1` },
          updatedAt: new Date().toISOString(),
          tokenSource: 'manual',
        },
      },
    };
    // sdk/packages/core/src/extensions/mcp/config-loader.ts: data/settings/cline_mcp_settings.json,
    // nested form { transport: { type, ... } }.
    const transport =
      ctx.transport === 'http'
        ? { type: 'streamableHttp', url: ctx.serverUrl as string }
        : { type: 'stdio', command: ctx.serverCommand.command, args: ctx.serverCommand.args };
    const mcp = { mcpServers: { probe: { transport, timeout: 60 } } };
    writeFileSync(resolve(settingsDir, 'providers.json'), JSON.stringify(providers, null, 2));
    writeFileSync(resolve(settingsDir, 'cline_mcp_settings.json'), JSON.stringify(mcp, null, 2));
    writeFileSync(resolve(ctx.runDir, 'client-config.json'), JSON.stringify({ providers, mcp }, null, 2));

    const args = [
      ctx.prompt,
      '--yolo',
      '--json',
      '--auto-approve',
      'true',
      '-P',
      'openai-compatible',
      '-m',
      'gpt-probe',
      '--config',
      slash(clineDir),
      '--cwd',
      slash(cwd),
      '--retries',
      '2',
    ];
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      HOME: home,
      USERPROFILE: home,
      CLINE_DIR: clineDir,
      CLINE_NO_AUTO_UPDATE: '1',
      OPENAI_API_KEY: 'probe',
      NO_COLOR: '1',
    };
    // Global rules are also read from %OneDrive%\Documents\Cline\Rules (paths.ts
    // resolveRedirectedDocumentsPaths); drop the variables so the user's rules stay out of the prompt.
    for (const k of ['OneDrive', 'OneDriveConsumer', 'OneDriveCommercial']) delete env[k];
    const r = await runCommand(bin, args, { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

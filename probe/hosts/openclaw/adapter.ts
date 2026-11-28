// OpenClaw through `openclaw agent exec`, the embedded one-turn entry point that needs no
// Gateway or channel. A pinned config file supplies a custom openai-completions provider
// pointed at the mock and one server under mcp.servers, which the agent bundle MCP runtime
// (src/agents/agent-bundle-mcp-runtime.ts) connects for the run.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/openclaw');
// A source build at the pin: the whole checkout with its node_modules, as docker/Dockerfile copies it.
const installDir = process.env.PROBE_OPENCLAW_DIR ?? resolve(hostDir, 'bin/openclaw');
const entry = resolve(installDir, 'openclaw.mjs');

const adapter: HostAdapter = {
  id: 'openclaw',
  title: 'OpenClaw',
  mockScript: 'mock-script.js',
  configs: [
    {
      name: 'default', kind: 'default',
      description:
        'Stock settings: tools.toolSearch unset, so structured Tool Search is on and a small MCP inventory is declared directly or reached through dispatch_action. mcp.apps.enabled unset (false). Stdio server by command; for --transport http the entry sets transport: streamable-http, since a URL entry with no transport is legacy SSE, which the fixture server does not serve.',
      modelApi: 'chat',
    },
    {
      name: 'tool-search-off', kind: 'setting',
      description: 'tools.toolSearch: false: every tool schema, MCP tools included, is sent to the model directly.',
      modelApi: 'chat',
    },
    {
      name: 'apps-enabled', kind: 'setting',
      description: 'mcp.apps.enabled: true: the bundle declares form and url elicitation, the io.modelcontextprotocol/ui extension and openai/elicitation.',
      modelApi: 'chat',
    },
  ],
  async version() {
    if (!existsSync(entry)) return { missing: `${entry} not found; build OpenClaw at the pin (docker/Dockerfile, stage openclaw) or set PROBE_OPENCLAW_DIR` };
    const pkg = JSON.parse(readFileSync(resolve(installDir, 'package.json'), 'utf8')) as { version: string };
    const commitFile = resolve(installDir, '.canimcp-commit');
    const commit = existsSync(commitFile) ? readFileSync(commitFile, 'utf8').trim().slice(0, 8) : undefined;
    const r = await runCommand(process.execPath, [entry, '--version'], { timeoutMs: 60000, env: { ...process.env, NO_COLOR: '1' } });
    // package.json at the pin still says the last release, so the commit goes in the version.
    return { version: commit ? `${pkg.version}-${commit}` : pkg.version, detail: (r.stdout.trim() || r.stderr.trim()).split('\n')[0] };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const home = ensureDir(resolve(ctx.tmpDir, 'home'));
    const tmp = ensureDir(resolve(ctx.tmpDir, 'tmp'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));

    const server: Record<string, unknown> =
      ctx.transport === 'http'
        ? { url: ctx.serverUrl, transport: 'streamable-http' }
        : { command: ctx.serverCommand.command, args: ctx.serverCommand.args };
    server.connectionTimeoutMs = 60000;

    const config: Record<string, unknown> = {
      models: {
        providers: {
          probe: {
            baseUrl: `${ctx.mockUrl}/v1`,
            api: 'openai-completions',
            apiKey: 'probe',
            models: [
              {
                id: 'gpt-probe',
                name: 'gpt-probe',
                reasoning: false,
                input: ['text', 'image'],
                cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                contextWindow: 128000,
                maxTokens: 16384,
              },
            ],
          },
        },
      },
      mcp: {
        servers: { probe: server },
        ...(ctx.config.name === 'apps-enabled' ? { apps: { enabled: true } } : {}),
      },
      ...(ctx.config.name === 'tool-search-off' ? { tools: { toolSearch: false } } : {}),
    };
    const configText = JSON.stringify(config, null, 2);
    const configPath = resolve(ctx.tmpDir, 'openclaw.json');
    writeFileSync(configPath, configText);
    writeFileSync(resolve(ctx.runDir, 'client-config.json'), configText);

    const env: NodeJS.ProcessEnv = {};
    for (const [k, v] of Object.entries(process.env)) if (!k.startsWith('OPENCLAW_')) env[k] = v;
    Object.assign(env, {
      HOME: home,
      USERPROFILE: home,
      OPENCLAW_HOME: home,
      // agent exec makes its temporary state directory under os.tmpdir().
      TMPDIR: tmp,
      TMP: tmp,
      TEMP: tmp,
      NO_COLOR: '1',
    });

    const execTimeout = Math.max(10, Math.floor(ctx.timeoutMs / 1000) - 5);
    const args = [
      entry,
      'agent',
      'exec',
      '--config',
      slash(configPath),
      '--cwd',
      slash(cwd),
      '--model',
      'probe/gpt-probe',
      '--timeout',
      String(execTimeout),
      '--json',
      ctx.prompt,
    ];
    const r = await runCommand(process.execPath, args, { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

// pi (earendil-works/pi, formerly badlogic/pi-mono) through `pi --print` with a
// custom provider in models.json and the probe server in mcp.json.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/pi');
const pkgDir = resolve(hostDir, 'node_modules/@earendil-works/pi-coding-agent');
// The package's bin is a node script. Running it through node keeps the prompt
// as one argument on Windows, which the .cmd shim would split.
const cli = resolve(pkgDir, 'dist/bundle/cli.js');
const bin = process.env.PROBE_PI_BIN ?? cli;
const invoke = (args: string[]) => (bin === cli ? { command: process.execPath, args: [cli, ...args] } : { command: bin, args });

const adapter: HostAdapter = {
  id: 'pi',
  title: 'pi',
  mockScript: 'mock-script.js',
  configs: [
    {
      name: 'default',
      description:
        'exposure: direct on the server entry, so the model sees the tool like a built-in and the result goes through convertMcpResult. Chat Completions (openai-completions). The stock exposure at this version is codemode, which hides MCP tools from the model; see the codemode config.',
      modelApi: 'chat',
    },
    {
      name: 'codemode',
      description:
        'Stock mcp.json entry: exposure codemode, the default. The model gets only the codemode tool and the mock writes a script that awaits tools.mcp__probe__<tool>(args) and returns the value, so the record shows what a script receives.',
      modelApi: 'chat',
    },
    {
      name: 'deferred',
      description: 'exposure: deferred. The mock calls tool_search for the fixture tool, then the declared tool on the next request.',
      modelApi: 'chat',
    },
    {
      name: 'anthropic',
      description: 'exposure: direct with api anthropic-messages, for the note’s provider-specific empty-result placeholder.',
      modelApi: 'anthropic',
    },
  ],
  async version() {
    if (!existsSync(cli)) return { missing: `${cli} not found; run npm install in probe/hosts/pi` };
    const pkg = JSON.parse(readFileSync(resolve(pkgDir, 'package.json'), 'utf8')) as { version: string };
    const v = invoke(['--version']);
    const r = await runCommand(v.command, v.args, { timeoutMs: 30000, env: { ...process.env, PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1' } });
    return { version: pkg.version, detail: r.stdout.trim() };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const agentDir = ensureDir(resolve(ctx.tmpDir, 'pi-agent'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const anthropic = ctx.config.name === 'anthropic';

    const models = {
      providers: {
        probe: {
          name: 'probe',
          baseUrl: anthropic ? ctx.mockUrl : `${ctx.mockUrl}/v1`,
          api: anthropic ? 'anthropic-messages' : 'openai-completions',
          apiKey: 'probe',
          models: [{ id: 'gpt-probe', name: 'gpt-probe', input: ['text', 'image'], contextWindow: 128000, maxTokens: 16384 }],
        },
      },
    };

    const server: Record<string, unknown> =
      ctx.transport === 'http' ? { url: ctx.serverUrl } : { command: ctx.serverCommand.command, args: ctx.serverCommand.args };
    server.timeout = 60;
    if (ctx.config.name === 'deferred') server.exposure = 'deferred';
    else if (ctx.config.name !== 'codemode') server.exposure = 'direct';
    const mcp = { mcpServers: { probe: server } };

    // cacheWarming off: a warm-up request to the provider would count as a model turn.
    const settings = { quietStartup: true, cacheWarming: 'off', defaultProjectTrust: 'never' };

    writeFileSync(resolve(agentDir, 'models.json'), JSON.stringify(models, null, 2));
    writeFileSync(resolve(agentDir, 'mcp.json'), JSON.stringify(mcp, null, 2));
    writeFileSync(resolve(agentDir, 'settings.json'), JSON.stringify(settings, null, 2));
    writeFileSync(resolve(ctx.runDir, 'client-config.json'), JSON.stringify({ 'models.json': models, 'mcp.json': mcp, 'settings.json': settings }, null, 2));

    const cmd = invoke([
      '--print',
      '--no-session',
      '--no-skills',
      '--no-prompt-templates',
      '--no-context-files',
      '--no-approve',
      '--provider',
      'probe',
      '--model',
      'gpt-probe',
      '--',
      ctx.prompt,
    ]);
    const r = await runCommand(cmd.command, cmd.args, {
      cwd,
      env: { ...process.env, PI_CODING_AGENT_DIR: agentDir, PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1', PI_TELEMETRY: '0', NO_COLOR: '1' },
      timeoutMs: ctx.timeoutMs,
    });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

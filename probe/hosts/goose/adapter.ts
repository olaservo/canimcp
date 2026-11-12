// goose through `goose run --no-session`, built from source at the research pin.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/goose');
const bin = process.env.PROBE_GOOSE_BIN ?? resolve(hostDir, 'bin', process.platform === 'win32' ? 'goose.exe' : 'goose');

const adapter: HostAdapter = {
  id: 'goose',
  title: 'goose',
  configs: [
    { name: 'default', description: 'openai provider, Chat Completions, stock settings.', modelApi: 'chat' },
    { name: 'anthropic', description: 'anthropic provider: the Messages API formatter.', modelApi: 'anthropic' },
    { name: 'code-mode', description: 'The code_execution builtin on: MCP tools reached through the sandbox.', modelApi: 'chat' },
  ],
  async version() {
    if (!existsSync(bin)) return { missing: `${bin} not found; build goose-cli at the pin and copy the binary to probe/hosts/goose/bin` };
    const r = await runCommand(bin, ['--version'], { timeoutMs: 30000 });
    return { version: r.stdout.trim() || r.stderr.trim(), detail: 'built from source at 4facf56, one commit below the research pin 5bad61a; that commit touches only the live-voice provider' };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const root = ensureDir(resolve(ctx.tmpDir, 'goose-root'));
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      GOOSE_PATH_ROOT: root,
      GOOSE_MODEL: 'gpt-probe',
      GOOSE_DISABLE_KEYRING: '1',
      GOOSE_CLI_MIN_PRIORITY: '0.0',
      NO_COLOR: '1',
    };
    if (ctx.config.name === 'anthropic') {
      env.GOOSE_PROVIDER = 'anthropic';
      env.ANTHROPIC_API_KEY = 'probe';
      env.ANTHROPIC_HOST = ctx.mockUrl;
    } else {
      env.GOOSE_PROVIDER = 'openai';
      env.OPENAI_API_KEY = 'probe';
      env.OPENAI_BASE_URL = `${ctx.mockUrl}/v1`;
    }
    const args = ['run', '--no-session', '--no-profile', '--max-turns', '4', '-t', ctx.prompt];
    if (ctx.transport === 'http') {
      args.push('--with-streamable-http-extension', ctx.serverUrl as string);
    } else {
      args.push('--with-extension', `probe:${ctx.serverCommand.command} ${ctx.serverCommand.args.join(' ')}`);
    }
    if (ctx.config.name === 'code-mode') args.push('--with-builtin', 'code_execution');
    const r = await runCommand(bin, args, { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

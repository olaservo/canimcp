// eve: a defineMcpClientConnection on a dev-server agent, model routed to the
// mock through @ai-sdk/openai's Chat Completions model. Driven by agent.mjs,
// which writes the app, runs `eve dev --no-ui` and `eve remote connect --print`.
// MCP connections are HTTP-only in eve, so stdio runs fail before the client starts.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/eve');

const adapter: HostAdapter = {
  id: 'eve',
  transports: ['http'],
  title: 'eve',
  mockScript: 'mock-script.js',
  configs: [
    { name: 'default', description: 'defineMcpClientConnection with protocolVersionDiscovery on (server/discover first), tools reached through eve__tool, Chat Completions.', modelApi: 'chat' },
    { name: 'no-discovery', description: 'protocolVersionDiscovery: false on the connection: initialize handshake only.', modelApi: 'chat' },
  ],
  async version() {
    const p = resolve(hostDir, 'node_modules/eve/package.json');
    if (!existsSync(p)) return { missing: 'run npm install in probe/hosts/eve' };
    const pkg = JSON.parse(readFileSync(p, 'utf8')) as { version: string };
    return { version: pkg.version, detail: 'npm release eve@1.0.0-rc.6, 12 commits below the pin f50f672' };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const appDir = ensureDir(resolve(ctx.tmpDir, 'app'));
    const env = {
      ...process.env,
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
      PROBE_APP_DIR: appDir,
    };
    const r = await runCommand(process.execPath, [resolve(hostDir, 'agent.mjs')], { cwd: appDir, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

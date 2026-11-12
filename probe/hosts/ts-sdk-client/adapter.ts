// The official TypeScript SDK client as a probe target. There is no model:
// the adapter records what Client.callTool hands a host, which is the floor
// every TypeScript client built on the SDK starts from.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { runCommand, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));

const adapter: HostAdapter = {
  id: 'ts-sdk-client',
  title: 'TypeScript SDK client',
  configs: [
    { name: 'auto', description: 'Default version negotiation: server/discover first, initialize fallback.', modelApi: 'chat' },
    { name: 'legacy', description: 'versionNegotiation mode legacy: the initialize handshake only.', modelApi: 'chat' },
  ],
  async version() {
    const pkg = JSON.parse(readFileSync(resolve(here, '../../../node_modules/@modelcontextprotocol/client/package.json'), 'utf8')) as { version: string };
    return { version: pkg.version };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const script = resolve(here, 'call.js');
    const env = {
      ...process.env,
      PROBE_RUN_DIR: ctx.runDir,
      PROBE_TOOL: ctx.fixture.tool,
      PROBE_NEGOTIATION: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
    };
    const r = await runCommand(process.execPath, [script], { env, timeoutMs: ctx.timeoutMs, cwd: ctx.tmpDir });
    return { ...r, finalText: r.stdout.trim().split('\n').pop() };
  },
};

export default adapter;

// Mastra: an Agent with MCPClient tools, model routed to the mock by url.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { runCommand, ensureDir, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/mastra');

const adapter: HostAdapter = {
  id: 'mastra',
  title: 'Mastra',
  configs: [
    { name: 'default', description: 'Agent + MCPClient, onToolError throw, Chat Completions.', modelApi: 'chat' },
    { name: 'return-errors', description: 'onToolError: return, so isError results come back as the envelope.', modelApi: 'chat' },
    { name: 'legacy', description: 'protocolVersion: legacy on the server entry: initialize handshake only.', modelApi: 'chat' },
  ],
  async version() {
    const p = resolve(hostDir, 'node_modules/@mastra/mcp/package.json');
    if (!existsSync(p)) return { missing: 'run npm install --legacy-peer-deps in probe/hosts/mastra' };
    const mcp = JSON.parse(readFileSync(p, 'utf8')) as { version: string };
    const core = JSON.parse(readFileSync(resolve(hostDir, 'node_modules/@mastra/core/package.json'), 'utf8')) as { version: string };
    return { version: `mcp-${mcp.version}+core-${core.version}` };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    const env = {
      ...process.env,
      PROBE_MOCK_URL: ctx.mockUrl,
      PROBE_PROMPT: ctx.prompt,
      PROBE_CONFIG: ctx.config.name,
      PROBE_SERVER_URL: ctx.serverUrl ?? '',
      PROBE_SERVER_COMMAND: JSON.stringify(ctx.serverCommand),
    };
    const r = await runCommand(process.execPath, [resolve(hostDir, 'agent.mjs')], { cwd, env, timeoutMs: ctx.timeoutMs });
    return { ...r, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) };
  },
};

export default adapter;

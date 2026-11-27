// A conformance --command that runs a probe host adapter against the scenario
// server. The suite appends the server URL as the last argument.
//
//   npx conformance client --command "node bridge/host-bridge.mjs mastra" --scenario tools_call
//   node run.mjs --client mastra --command "node bridge/host-bridge.mjs mastra"
//
// It starts the probe's mock model with call-every-tool.mjs as its script, hands
// the adapter a RunContext whose serverUrl is the scenario server, runs the
// client once, and exits with the client's exit code. Uses the compiled probe
// (probe/dist), so run `npm run build` in probe/ first. Optional second
// argument: the adapter config name (default: the adapter's first config).
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import profiles from './profiles.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const probeDist = resolve(here, '../../dist');
const [adapterId, ...rest] = process.argv.slice(2);
const serverUrl = rest.pop();
const prof = profiles[adapterId] ?? {};
const configName = rest[0] ?? prof.config;
const scenario = process.env.MCP_CONFORMANCE_SCENARIO ?? 'unknown';
if (!adapterId || !serverUrl) {
  console.error('usage: node bridge/host-bridge.mjs <adapter> [config] <server-url>');
  process.exit(2);
}

const { freePort, startService, killTree } = await import(pathToFileURL(resolve(probeDist, 'lib/hosts.js')).href);
const base = (await import(pathToFileURL(resolve(probeDist, 'hosts', adapterId, 'adapter.js')).href)).default;
// bridge/adapters/<id>.mjs adds conformance-only configs (answer configs for elicitation).
const extraPath = resolve(here, 'adapters', `${adapterId}.mjs`);
const extra = existsSync(extraPath) ? (await import(pathToFileURL(extraPath).href)).default : undefined;
const adapter = extra
  ? { ...base, configs: [...base.configs, ...extra.configs], run: (ctx) => (extra.configs.includes(ctx.config) ? extra.run(ctx) : base.run(ctx)) }
  : base;

const config = configName ? adapter.configs.find((c) => c.name === configName) : adapter.configs[0];
if (!config) {
  console.error(`adapter ${adapterId} has no config ${configName}`);
  process.exit(2);
}
if (adapter.transports && !adapter.transports.includes('http')) {
  console.error(`adapter ${adapterId} has no Streamable HTTP client; conformance scenarios are HTTP only`);
  process.exit(2);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const tmpRoot = process.env.PROBE_TMP ?? resolve(here, '../results/bridge');
const runDir = resolve(tmpRoot, adapterId, `${scenario.replace(/\//g, '__')}-${stamp}`);
const tmpDir = resolve(runDir, 'tmp');
mkdirSync(tmpDir, { recursive: true });

process.env.CONF_PROFILE = JSON.stringify(prof.script ?? {});
const mockPort = await freePort();
const mockArgs = [resolve(probeDist, 'mock-model/server.js'), '--port', String(mockPort), '--capture', runDir, '--tool', 'probe', '--script', resolve(here, 'call-every-tool.mjs')];
const mock = await startService(process.execPath, mockArgs, /mock-model listening/, { logPath: resolve(runDir, 'mock-model.log') });

let exitCode = 1;
try {
  const timeoutMs = Number(process.env.BRIDGE_TIMEOUT_MS ?? prof.timeoutMs ?? 25000);
  const ctx = {
    fixture: { id: 'conformance', tool: 'probe', description: 'conformance scenario', result: {} },
    config,
    runDir,
    tmpDir,
    mockUrl: `http://127.0.0.1:${mockPort}`,
    serverCommand: { command: 'node', args: ['-e', 'process.exit(1)'] },
    serverUrl,
    transport: 'http',
    era: 'both',
    prompt: 'Call each of your tools once, filling in any required arguments, then reply with what they returned.',
    timeoutMs,
  };
  const r = await adapter.run(ctx);
  writeFileSync(resolve(runDir, 'client.stdout.txt'), r.stdout ?? '');
  writeFileSync(resolve(runDir, 'client.stderr.txt'), r.stderr ?? '');
  process.stdout.write(r.stdout ?? '');
  process.stderr.write(r.stderr ?? '');
  exitCode = r.timedOut ? 124 : (r.exitCode ?? 1);
} catch (e) {
  console.error(`BRIDGE_ERROR: ${e && e.stack ? e.stack : String(e)}`);
} finally {
  killTree(mock);
}
process.exit(exitCode);

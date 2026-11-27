// Runs every client scenario of the conformance suite against one client
// command, once per spec version the scenario applies to, and writes
// results/<client>/<runId>/runs.json. Extension scenarios have no spec
// version, so they run at 2025-11-25 and at 2026-07-28 with --force.
//
//   node run.mjs --client ts-sdk-client --command "node --import tsx everything-client/everythingClient.ts"
//   node run.mjs --client mastra --command "node bridge/mastra-bridge.mjs" --only tools_call,initialize
//
// Options: --only a,b  --versions 2025-11-25,2026-07-28  --concurrency 4  --timeout 30000
// The command runs with this folder as its working directory. The suite splits
// it on spaces and runs it through a shell, so no path in it may contain a space.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const confPkg = JSON.parse(readFileSync(resolve(here, 'node_modules/@modelcontextprotocol/conformance/package.json'), 'utf8'));
const confCli = resolve(here, 'node_modules/@modelcontextprotocol/conformance', confPkg.bin.conformance);

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const client = opt('client');
const command = opt('command');
if (!client || !command) {
  console.error('usage: node run.mjs --client <id> --command "<cmd>" [--only a,b] [--versions v1,v2] [--concurrency n] [--timeout ms]');
  process.exit(2);
}
const only = opt('only')?.split(',');
const versions = opt('versions')?.split(',');
const concurrency = Number(opt('concurrency', '4'));
const timeout = Number(opt('timeout', '30000'));
const EXTENSION_VERSIONS = ['2025-11-25', '2026-07-28'];

function run(cmd, argv, opts = {}) {
  return new Promise((res) => {
    const started = Date.now();
    const child = spawn(cmd, argv, { cwd: here, env: { ...process.env, ...opts.env }, windowsHide: true });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    const timer = setTimeout(() => child.kill(), opts.timeoutMs ?? 600000);
    child.on('close', (code) => {
      clearTimeout(timer);
      res({ code, stdout, stderr, durationMs: Date.now() - started });
    });
  });
}

// `conformance list --client` prints "  - name [tag,tag]".
async function listClientScenarios() {
  const r = await run(process.execPath, [confCli, 'list', '--client']);
  const out = [];
  for (const line of r.stdout.split('\n')) {
    const m = line.match(/^\s+-\s+(\S+)\s+\[([^\]]*)\]/);
    if (m) out.push({ scenario: m[1], tags: m[2].split(',').map((s) => s.trim()) });
  }
  return out;
}

function findFile(dir, name) {
  if (!existsSync(dir)) return undefined;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      const f = findFile(p, name);
      if (f) return f;
    } else if (e === name) return p;
  }
  return undefined;
}

const runId = new Date().toISOString().replace(/[:.]/g, '-');
const outRoot = resolve(here, 'results', client, runId);
mkdirSync(outRoot, { recursive: true });

const scenarios = (await listClientScenarios()).filter((s) => !only || only.includes(s.scenario));
const plan = [];
for (const s of scenarios) {
  const extension = s.tags.includes('extension');
  const vs = extension ? EXTENSION_VERSIONS : s.tags;
  for (const v of vs) {
    if (versions && !versions.includes(v)) continue;
    plan.push({ scenario: s.scenario, specVersion: v, extension, forced: extension, tags: s.tags });
  }
}
console.error(`${plan.length} runs (${scenarios.length} scenarios), concurrency ${concurrency}, results in ${outRoot}`);

const results = [];
let next = 0;
async function worker() {
  while (next < plan.length) {
    const item = plan[next++];
    const dir = join(outRoot, item.specVersion, item.scenario.replace(/\//g, '__'));
    mkdirSync(dir, { recursive: true });
    const argv = [confCli, 'client', '--command', command, '--scenario', item.scenario, '--spec-version', item.specVersion, '--timeout', String(timeout), '-o', dir];
    if (item.forced) argv.push('--force');
    const r = await run(process.execPath, argv, { timeoutMs: timeout + 60000 });
    writeFileSync(join(dir, 'cli.log'), `exit ${r.code}\n--- stdout\n${r.stdout}\n--- stderr\n${r.stderr}`);
    const checksPath = findFile(dir, 'checks.json');
    const checks = checksPath ? JSON.parse(readFileSync(checksPath, 'utf8')) : [];
    const skipped = /SKIPPED: scenario/.test(r.stdout);
    const clientExit = r.stderr.match(/Client exited with code (-?\d+)/);
    const clientTimedOut = /Client timed out after/.test(r.stderr);
    const count = (st) => checks.filter((c) => c.status === st).length;
    const rec = {
      ...item,
      cliExit: r.code,
      verdict: skipped ? 'skipped' : !checksPath ? 'error' : r.code === 0 ? 'pass' : 'fail',
      clientExitCode: clientExit ? Number(clientExit[1]) : 0,
      clientTimedOut,
      durationMs: r.durationMs,
      counts: { success: count('SUCCESS'), failure: count('FAILURE'), warning: count('WARNING'), info: count('INFO'), skipped: count('SKIPPED') },
      checks: checks.map((c) => ({
        id: c.id,
        status: c.status,
        ...(c.errorMessage ? { errorMessage: c.errorMessage } : {}),
        ...(c.specReferences ? { specReferences: c.specReferences } : {}),
      })),
      dir: dir.slice(here.length + 1).replace(/\\/g, '/'),
    };
    results.push(rec);
    console.error(`${rec.verdict.padEnd(7)} ${item.specVersion} ${item.scenario} (${rec.counts.success} ok, ${rec.counts.failure} fail, ${rec.counts.warning} warn)`);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

results.sort((a, b) => a.scenario.localeCompare(b.scenario) || a.specVersion.localeCompare(b.specVersion));
const meta = {
  client,
  command,
  suite: { package: confPkg.name, version: confPkg.version },
  runId,
  date: new Date().toISOString().slice(0, 10),
  platform: `${process.platform} node ${process.version}`,
  runs: results,
};
writeFileSync(join(outRoot, 'runs.json'), JSON.stringify(meta, null, 2));
console.error(`wrote ${join(outRoot, 'runs.json')}`);

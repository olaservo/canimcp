// The probe runner. Takes a client and a scenario set, runs each scenario
// against the mock model and the fixture server, and writes one record per
// (client, client version, scenario, protocol revision, config).
//
//   node dist/runner.js --client codex --set core
//   node dist/runner.js --client goose --scenarios tools.result.summary_and_data,tools.result.mirror --config anthropic
//   node dist/runner.js --client mastra --set tool-results --transport http --era modern
//
// Options: --mode sdk|mcpserver|raw|auto (default auto: raw only where
// registry/sdk-compat.json says the SDK changes the fixture), --era
// both|legacy|modern (default both: the server answers either era and the
// client chooses), --transport stdio|http (default stdio), --config <name>
// (default: every config the adapter declares), --out <dir> (default runs/),
// --timeout <ms> (default 120000).
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { fixtureById } from './fixtures/tool-results.js';
import { classify, verdict, type ToolResultObservation } from './classify/classify.js';
import { freePort, startService, killTree, ensureDir, slash, type HostAdapter, type Era, type ServerMode, type RunContext } from './lib/hosts.js';
import { arg, flag } from './lib/capture.js';
import { scratchRoot, operatorMarkers, findOperatorText } from './lib/operator-guard.js';

const here = dirname(fileURLToPath(import.meta.url));
const probeRoot = resolve(here, '..');
const repoRoot = resolve(probeRoot, '..');

interface Scenario {
  id: string;
  family: string;
  capability: string;
  fixture: string;
  appliesTo: string[];
  question: string;
}

interface ScenarioRegistry {
  scenarios: Scenario[];
  sets: Record<string, string[]>;
}

interface SdkCompatEntry {
  fixture: string;
  era: 'legacy' | 'modern';
  mode: ServerMode;
  sentUnchanged: boolean;
  error?: string;
}

const registry = JSON.parse(readFileSync(resolve(probeRoot, 'registry/scenarios.json'), 'utf8')) as ScenarioRegistry;
const sdkCompat: SdkCompatEntry[] = existsSync(resolve(probeRoot, 'registry/sdk-compat.json'))
  ? (JSON.parse(readFileSync(resolve(probeRoot, 'registry/sdk-compat.json'), 'utf8')) as { entries: SdkCompatEntry[] }).entries
  : [];

const clientId = arg('client');
const setName = arg('set', '');
const scenarioList = arg('scenarios', '');
const modeArg = arg('mode', 'auto') as ServerMode | 'auto';
const era = arg('era', 'both') as Era;
const transport = arg('transport', 'stdio') as 'stdio' | 'http';
const configFilter = arg('config', '');
const outRoot = resolve(probeRoot, arg('out', 'runs'));
const timeoutMs = Number(arg('timeout', '120000'));
const keepTmp = flag('keep-tmp');
const scratch = scratchRoot();
const markers = operatorMarkers();
const leaks: string[] = [];

const adapterPath = resolve(probeRoot, 'dist/hosts', clientId, 'adapter.js');
if (!existsSync(adapterPath)) {
  console.error(`no adapter at hosts/${clientId}/adapter.ts (looked for ${adapterPath}; run npm run build first)`);
  process.exit(2);
}
const adapter = ((await import(pathToFileURL(adapterPath).href)) as { default: HostAdapter }).default;

if (adapter.platforms && !adapter.platforms.includes(process.platform)) {
  console.error(`${adapter.id} runs on ${adapter.platforms.join(', ')}, not ${process.platform}. On Windows, run this from WSL.`);
  process.exit(2);
}

if (adapter.transports && !adapter.transports.includes(transport)) {
  console.error(`${adapter.id} has no ${transport} MCP client (adapter declares ${adapter.transports.join(', ')}); nothing to run.`);
  process.exit(2);
}

const versionInfo = await adapter.version();
if ('missing' in versionInfo) {
  console.error(`${adapter.id} is not installed: ${versionInfo.missing}`);
  process.exit(2);
}
const clientVersion = versionInfo.version;

const ids = scenarioList ? scenarioList.split(',') : registry.sets[setName || 'core'];
if (!ids) {
  console.error(`unknown set ${setName}; known: ${Object.keys(registry.sets).join(', ')}`);
  process.exit(2);
}
const scenarios = ids.map((id) => {
  const s = registry.scenarios.find((x) => x.id === id);
  if (!s) throw new Error(`unknown scenario ${id}`);
  return s;
});
const configs = adapter.configs.filter((c) => !configFilter || c.name === configFilter);
if (configs.length === 0) {
  console.error(`adapter ${adapter.id} has no config ${configFilter}; known: ${adapter.configs.map((c) => c.name).join(', ')}`);
  process.exit(2);
}

function pickMode(fixtureId: string): ServerMode {
  if (modeArg !== 'auto') return modeArg;
  const eras: Array<'legacy' | 'modern'> = era === 'both' ? ['legacy', 'modern'] : [era];
  const needsRaw = eras.some((e) => {
    const entry = sdkCompat.find((x) => x.fixture === fixtureId && x.era === e && x.mode === 'sdk');
    return entry ? !entry.sentUnchanged || entry.error !== undefined : fixtureById(fixtureId).expectRaw !== undefined;
  });
  return needsRaw ? 'raw' : 'sdk';
}

const today = new Date().toISOString().slice(0, 10);
const records: unknown[] = [];

for (const config of configs) {
  for (const scenario of scenarios) {
    const fixture = fixtureById(scenario.fixture);
    const mode = pickMode(fixture.id);
    const runDir = ensureDir(resolve(outRoot, `${adapter.id}@${clientVersion}`, config.name, `${era}-${transport}`, scenario.id));
    // Outside the operator's home, so a client searching upward for skills or instructions cannot reach theirs.
    const tmpDir = ensureDir(resolve(scratch, `${adapter.id}@${clientVersion}`, config.name, `${era}-${transport}`, scenario.id));
    for (const f of ['wire.jsonl', 'model.jsonl', 'record.json', 'client-stdout.txt', 'client-stderr.txt']) {
      if (existsSync(resolve(runDir, f))) rmSync(resolve(runDir, f));
    }
    process.stdout.write(`\n== ${adapter.id}@${clientVersion} ${config.name} ${scenario.id} (mode=${mode} era=${era} transport=${transport})\n`);

    const mockPort = await freePort();
    const mockArgs = [resolve(probeRoot, 'dist/mock-model/server.js'), '--port', String(mockPort), '--capture', runDir, '--tool', fixture.tool];
    if (adapter.mockScript) mockArgs.push('--script', resolve(probeRoot, 'dist/hosts', adapter.id, adapter.mockScript));
    const mock = await startService(process.execPath, mockArgs, /mock-model listening/, { logPath: resolve(runDir, 'mock-model.log') });

    const serverScript = resolve(probeRoot, 'dist/server/fixture-server.js');
    const serverArgsBase = ['--fixture', fixture.id, '--mode', mode, '--era', era, '--capture', slash(runDir)];
    let httpServer: Awaited<ReturnType<typeof startService>> | undefined;
    let serverUrl: string | undefined;
    if (transport === 'http') {
      const port = await freePort();
      httpServer = await startService(process.execPath, [serverScript, ...serverArgsBase, '--transport', 'http', '--port', String(port)], /fixture-server listening/, {
        logPath: resolve(runDir, 'fixture-server.log'),
      });
      serverUrl = `http://127.0.0.1:${port}/mcp`;
    }

    // Clients split a stdio command line on whitespace, so a Node path with a
    // space in it (C:\Program Files\nodejs) has to go through PATH instead.
    const nodeCommand = /\s/.test(process.execPath) ? 'node' : process.execPath;
    const ctx: RunContext = {
      fixture,
      config,
      runDir,
      tmpDir,
      mockUrl: `http://127.0.0.1:${mockPort}`,
      serverCommand: { command: nodeCommand, args: [slash(serverScript), ...serverArgsBase, '--transport', 'stdio'] },
      serverUrl,
      transport,
      era,
      prompt: `Call the tool ${fixture.tool} once. It takes no arguments. Then reply with what it returned.`,
      timeoutMs,
    };

    let result;
    try {
      result = await adapter.run(ctx);
    } finally {
      killTree(mock);
      if (httpServer) killTree(httpServer);
    }
    writeFileSync(resolve(runDir, 'client-stdout.txt'), result.stdout);
    writeFileSync(resolve(runDir, 'client-stderr.txt'), result.stderr);

    const observation: ToolResultObservation = classify(runDir, fixture.id, mode, result.finalText);
    const summary = verdict(observation);
    const at = observation.negotiatedRevision && !observation.negotiatedRevision.startsWith('requested:') ? observation.negotiatedRevision : undefined;
    const record = {
      client: adapter.id,
      capability: scenario.capability,
      scenario: scenario.id,
      evidence: {
        tier: 'verified',
        ...(at ? { at } : {}),
        source: 'canimcp-probe',
        date: today,
        scenario: scenario.id,
        clientVersion,
        config: config.name,
        artifact: relative(repoRoot, runDir).replace(/\\/g, '/'),
        note: summary,
        observation,
      },
      run: {
        exitCode: result.exitCode,
        timedOut: result.timedOut,
        durationMs: result.durationMs,
        transport,
        serverMode: mode,
        eraPolicy: era,
        modelApi: config.modelApi,
      },
    };
    writeFileSync(resolve(runDir, 'record.json'), JSON.stringify(record, null, 2));
    records.push(record);
    for (const { file, hits } of findOperatorText(runDir, markers)) leaks.push(`${relative(probeRoot, resolve(runDir, file))} (${hits} marker(s))`);
    process.stdout.write(`   ${summary}\n   exit=${result.exitCode} timedOut=${result.timedOut} ${result.durationMs}ms at=${at ?? '?'} offeredAs=${observation.offeredAs ?? '-'}\n`);
    // Helper processes (hermes gateway, eve dev) may hold files for a moment after the client exits.
    if (!keepTmp) rmSync(tmpDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  }
}

// Append to the per-client index so later collection does not need to walk the tree.
const indexPath = resolve(outRoot, `${adapter.id}@${clientVersion}`, 'index.json');
const existing: unknown[] = existsSync(indexPath) ? (JSON.parse(readFileSync(indexPath, 'utf8')) as unknown[]) : [];
const key = (r: unknown) => {
  const x = r as { scenario: string; evidence: { config: string }; run: { eraPolicy: string; transport: string } };
  return `${x.scenario}|${x.evidence.config}|${x.run.eraPolicy}|${x.run.transport}`;
};
const merged = new Map<string, unknown>();
for (const r of existing) merged.set(key(r), r);
for (const r of records) merged.set(key(r), r);
mkdirSync(dirname(indexPath), { recursive: true });
writeFileSync(indexPath, JSON.stringify([...merged.values()], null, 2));
process.stdout.write(`\nwrote ${records.length} records; index at ${relative(probeRoot, indexPath)}\n`);
if (leaks.length) {
  console.error(`\nOPERATOR TEXT IN CAPTURES: these files hold text from the operator's own skills, instructions or home path.\nDo not commit them. Isolate the client from the operator's machine and re-run.\n  ${leaks.join('\n  ')}`);
  process.exitCode = 1;
}

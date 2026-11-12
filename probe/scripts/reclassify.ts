// Recomputes record.json and the per-client index for every run under
// runs/ from the captures on disk, without rerunning any client. Use it
// after a classifier change.
//
//   node dist/scripts/reclassify.js [--runs runs]
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classify, verdict } from '../classify/classify.js';
import { arg } from '../lib/capture.js';

const here = dirname(fileURLToPath(import.meta.url));
const probeRoot = resolve(here, '../..');
const runsRoot = resolve(probeRoot, arg('runs', 'runs'));

function* recordFiles(dir: string): Generator<string> {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) yield* recordFiles(p);
    else if (d.name === 'record.json') yield p;
  }
}

const byIndex = new Map<string, Map<string, unknown>>();
let n = 0;
for (const file of recordFiles(runsRoot)) {
  const record = JSON.parse(readFileSync(file, 'utf8')) as {
    client: string;
    scenario: string;
    evidence: { config: string; observation: { fixture: string; serverMode: 'sdk' | 'mcpserver' | 'raw'; finalText?: string }; note: string; at?: string; artifact: string };
    run: { eraPolicy: string; transport: string };
  };
  const runDir = dirname(file);
  record.evidence.artifact = relative(resolve(probeRoot, '..'), runDir).replace(/\\/g, '/');
  const observation = classify(runDir, record.evidence.observation.fixture, record.evidence.observation.serverMode, record.evidence.observation.finalText);
  record.evidence.observation = observation as typeof record.evidence.observation;
  record.evidence.note = verdict(observation);
  const at = observation.negotiatedRevision && !observation.negotiatedRevision.startsWith('requested:') ? observation.negotiatedRevision : undefined;
  if (at) record.evidence.at = at;
  else delete record.evidence.at;
  writeFileSync(file, JSON.stringify(record, null, 2));
  n++;
  // runs/<client@version>/<config>/<era-transport>/<scenario>/record.json
  const clientDir = resolve(runDir, '../../..');
  const indexPath = join(clientDir, 'index.json');
  const map = byIndex.get(indexPath) ?? new Map<string, unknown>();
  map.set(`${record.scenario}|${record.evidence.config}|${record.run.eraPolicy}|${record.run.transport}`, record);
  byIndex.set(indexPath, map);
  console.log(`${record.client.padEnd(14)} ${record.evidence.config.padEnd(16)} ${record.scenario.padEnd(34)} ${record.evidence.note}`);
}
for (const [indexPath, map] of byIndex) {
  const existing: Array<{ scenario: string; evidence: { config: string }; run: { eraPolicy: string; transport: string } }> = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : [];
  for (const r of existing) {
    const k = `${r.scenario}|${r.evidence.config}|${r.run.eraPolicy}|${r.run.transport}`;
    if (!map.has(k)) map.set(k, r);
  }
  writeFileSync(indexPath, JSON.stringify([...map.values()], null, 2));
}
console.log(`reclassified ${n} records`);

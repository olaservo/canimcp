// Turns one run.mjs run into summary/<client>.json (per scenario and per
// capability) and ingest-preview/<client>.json, a verified-evidence overlay in
// the shape of data/verified/<client>.json, validated against the repo schemas.
//
//   node summarize.mjs --client ts-sdk-client --client-version 2.4.0 --config default \
//     --harness "everything-client: typescript-sdk 951fe56 test/conformance/src + canimcp.patch"
//
// Options: --run <runId> (default: the latest under results/<client>/), --registry-id <id>.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const client = opt('client');
if (!client) {
  console.error('usage: node summarize.mjs --client <id> [--run <runId>] [--client-version v] [--config name] [--harness text] [--registry-id id]');
  process.exit(2);
}
const runsDir = resolve(here, 'results', client);
const runId = opt('run') ?? readdirSync(runsDir).filter((d) => existsSync(join(runsDir, d, 'runs.json'))).sort().pop();
const raw = JSON.parse(readFileSync(join(runsDir, runId, 'runs.json'), 'utf8'));
const mapping = JSON.parse(readFileSync(resolve(here, 'mapping.json'), 'utf8'));
const clientVersion = opt('client-version', 'unknown');
const config = opt('config', 'default');
const harness = opt('harness');
const SUITE_COMMIT = 'f44482ba17df816d3176962a11cdf36aec9bda00';

const rules = mapping.checks.map((r) => ({ ...r, re: new RegExp(r.match) }));
function scenarioDefault(scenario) {
  return mapping.scenarios[scenario] ?? (scenario.startsWith('auth/') ? mapping.scenarios['auth/*'] : undefined) ?? null;
}
function capabilityFor(checkId, scenario) {
  const rule = rules.find((r) => r.re.test(checkId));
  return rule ? rule.capability : scenarioDefault(scenario);
}

// Status per (run, capability): checks that decide something are SUCCESS, FAILURE and WARNING.
// A run whose client exited non-zero after passing its checks is incomplete, unless the suite accepted the exit.
const rows = [];
const evidence = {};
const unmapped = new Set();
const noSignal = [];
for (const run of raw.runs) {
  const scored = run.checks.filter((c) => c.status === 'SUCCESS' || c.status === 'FAILURE' || c.status === 'WARNING');
  const byCap = {};
  for (const c of scored) {
    const cap = capabilityFor(c.id, run.scenario);
    if (cap === undefined || cap === null) {
      if (cap === undefined) unmapped.add(c.id);
      continue;
    }
    (byCap[cap] ??= []).push(c);
  }
  const row = {
    scenario: run.scenario,
    specVersion: run.specVersion,
    forced: run.forced,
    verdict: run.verdict,
    clientExitCode: run.clientExitCode,
    passed: scored.filter((c) => c.status === 'SUCCESS').length,
    failed: scored.filter((c) => c.status !== 'SUCCESS').length,
    failedChecks: scored.filter((c) => c.status !== 'SUCCESS').map((c) => c.id),
    capabilities: Object.keys(byCap),
  };
  rows.push(row);
  if (scored.length === 0) {
    noSignal.push(`${run.scenario}@${run.specVersion}`);
    continue;
  }
  for (const [cap, checks] of Object.entries(byCap)) {
    const ok = checks.filter((c) => c.status === 'SUCCESS').length;
    // Negative auth scenarios expect the client to abort; the suite then passes the run despite the exit code.
    const exitOk = run.cliExit === 0 || (run.clientExitCode === 0 && !run.clientTimedOut);
    const status = ok === checks.length && exitOk ? 'full' : ok > 0 ? 'partial' : undefined;
    const failedIds = checks.filter((c) => c.status !== 'SUCCESS').map((c) => c.id);
    const note =
      `conformance ${run.scenario} at ${run.specVersion}${run.forced ? ' (forced)' : ''}: ${ok}/${checks.length} checks pass` +
      (failedIds.length ? `; failed ${failedIds.join(', ')}` : '') +
      (exitOk ? '' : `; client exited ${run.clientTimedOut ? 'by timeout' : run.clientExitCode}`);
    (evidence[cap] ??= []).push({
      tier: 'verified',
      ...(status ? { status } : {}),
      at: run.specVersion,
      source: 'modelcontextprotocol/conformance',
      url: `https://github.com/modelcontextprotocol/conformance/tree/${SUITE_COMMIT}`,
      date: raw.date,
      scenario: `conformance/${run.scenario}`,
      clientVersion,
      config,
      artifact: `probe/conformance/${run.dir}`,
      note,
      run: {
        suite: raw.suite.package,
        suiteVersion: raw.suite.version,
        specVersion: run.specVersion,
        forced: run.forced,
        ...(harness ? { harness } : {}),
        platform: raw.platform,
        cliExit: run.cliExit,
        exitCode: run.clientExitCode,
        timedOut: run.clientTimedOut,
        durationMs: run.durationMs,
        checks: checks.map((c) => ({ id: c.id, status: c.status, ...(c.errorMessage ? { errorMessage: c.errorMessage } : {}) })),
      },
    });
  }
}

// Capability roll-up: per spec version, how many scenario runs passed every check of that capability.
const capabilities = {};
for (const [cap, evs] of Object.entries(evidence)) {
  const perVersion = {};
  for (const e of evs) {
    const v = (perVersion[e.at] ??= { full: 0, partial: 0, none: 0, scenarios: [] });
    v[e.status ?? 'none']++;
    v.scenarios.push(`${e.scenario.slice('conformance/'.length)}${e.status === 'full' ? '' : ` (${e.status ?? 'none'})`}`);
  }
  capabilities[cap] = { proposedId: cap in mapping.proposed, perVersion };
}

const summary = {
  $comment: 'Generated by probe/conformance/summarize.mjs from a run.mjs run. Raw checks are under results/, which is not committed.',
  client,
  clientVersion,
  config,
  ...(harness ? { harness } : {}),
  suite: { ...raw.suite, commit: SUITE_COMMIT },
  command: raw.command,
  runId,
  date: raw.date,
  platform: raw.platform,
  totals: {
    runs: rows.length,
    pass: rows.filter((r) => r.verdict === 'pass').length,
    fail: rows.filter((r) => r.verdict === 'fail').length,
    noSignal: noSignal.length,
  },
  scenarios: rows,
  capabilities,
  noSignal,
  unmappedChecks: [...unmapped],
};
mkdirSync(resolve(here, 'summary'), { recursive: true });
writeFileSync(resolve(here, 'summary', `${client}.json`), JSON.stringify(summary, null, 2) + '\n');

const overlay = {
  $comment: 'Preview of data/verified/<client>.json entries from a conformance run. Generated by probe/conformance/summarize.mjs; not merged.',
  client,
  registryId: opt('registry-id', client),
  versions: [clientVersion],
  capabilities: Object.fromEntries(Object.entries(evidence).map(([k, v]) => [k, { evidence: v }])),
};
mkdirSync(resolve(here, 'ingest-preview'), { recursive: true });
writeFileSync(resolve(here, 'ingest-preview', `${client}.json`), JSON.stringify(overlay, null, 2) + '\n');

// Validate the overlay with the repo's own schemas and ajv.
const require = createRequire(resolve(repoRoot, 'package.json'));
const Ajv2020 = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats').default ?? require('ajv-formats');
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(JSON.parse(readFileSync(resolve(repoRoot, 'schema/mcp-client-registry.schema.json'), 'utf8')));
const validate = ajv.compile(JSON.parse(readFileSync(resolve(repoRoot, 'schema/verified-evidence.schema.json'), 'utf8')));
const valid = validate(overlay);
console.error(`${client}: ${summary.totals.pass}/${summary.totals.runs} runs pass, ${Object.keys(evidence).length} capabilities, overlay ${valid ? 'valid' : 'INVALID'}`);
if (!valid) console.error(JSON.stringify(validate.errors.slice(0, 5), null, 2));
if (unmapped.size) console.error(`unmapped checks: ${[...unmapped].join(', ')}`);

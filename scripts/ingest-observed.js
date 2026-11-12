#!/usr/bin/env node
/**
 * Ingests the Hugging Face MCP client telemetry (evalstate/mcp-clients) as the
 * observed tier, into data/observed/hf-mcp-clients.json.
 *
 * The report gives one boolean per capability per client. pipeline.py sets it
 * when more than policy.capability_proportion_threshold of the client's
 * 2026-07-28 tool calls in the window declare the capability, or when the
 * initialize-era backfill (reports/dashboard-session-backfill-v1.json) or the
 * transport-metrics backfill (policy.capability_backfill_path) has it. Both
 * backfills are read here too, so each record says which path can have set it.
 *
 * Usage: node scripts/ingest-observed.js [--revision <sha>]
 * With no revision, resolves the dataset's current main.
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';

const REPO = 'evalstate/mcp-clients';
const SOURCE = 'evalstate/mcp-clients';
const REPORT = 'reports/dashboard-v1.json';
const SESSION_BACKFILL = 'reports/dashboard-session-backfill-v1.json';
const OUT = 'data/observed/hf-mcp-clients.json';
const REGISTRY = 'data/clients.json';
const MODERN = '2026-07-28';
const SMALL_SAMPLE = 0.05;

// Report feature -> capability id in data/spec-versions.json vocabulary.
const FEATURES = {
  elicitation: 'elicitation',
  elicitation_url: 'elicitation.url',
  mcp_apps: 'apps',
  tasks: 'tasks',
  skills: 'skills',
};
// Features whose flag comes from a successful call, not a declaration. A false
// flag says no call was seen, which is not a claim of no support.
const CALL_OBSERVED = new Set(['skills']);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function resolveRevision() {
  const i = process.argv.indexOf('--revision');
  if (i > 0) return process.argv[i + 1];
  return (await getJson(`https://huggingface.co/api/datasets/${REPO}`)).sha;
}

const fileUrl = (rev, path, kind = 'resolve') => `https://huggingface.co/datasets/${REPO}/${kind}/${rev}/${path}`;

/** Mirrors pipeline.py capability_backfill_support. */
function backfilled(capBackfill, clientId, start, end) {
  const out = new Set();
  for (const e of capBackfill?.evidence ?? []) {
    if (e.client_id !== clientId || !(e.feature in FEATURES)) continue;
    if ((e.daily ?? []).some((p) => p.date >= start && p.date <= end && Number(p.observed_successful_calls) > 0)) out.add(e.feature);
  }
  return out;
}

const pct = (x) => `${+(x * 100).toPrecision(2)}%`;

async function main() {
  const rev = await resolveRevision();
  const report = await getJson(fileUrl(rev, REPORT));
  const session = await getJson(fileUrl(rev, SESSION_BACKFILL)).catch(() => null);
  const capBackfill = report.policy.capability_backfill_path
    ? await getJson(fileUrl(rev, report.policy.capability_backfill_path)).catch(() => null)
    : null;

  const registry = JSON.parse(readFileSync(REGISTRY, 'utf8'));
  const registryIds = Object.keys(registry).filter((k) => !k.startsWith('$'));
  const { start, end } = report.window;
  const threshold = report.policy.capability_proportion_threshold;
  const historicalLimit = new Set(report.policy.historical_capability_limit ?? []);
  const historical = Object.fromEntries((session?.clients ?? []).map((c) => [c.id, c.capability_support ?? {}]));
  const hWin = session?.window;
  const date = report.generated_at.slice(0, 10);
  const url = fileUrl(rev, REPORT, 'blob');

  const clients = report.clients.map((c) => {
    const registryId = registryIds.find((id) => (registry[id].clientInfoNames ?? []).some((n) => c.source_names.includes(n))) ?? null;
    const last = c.traffic.at(-1);
    const modernShare = last?.rolling_30d_protocol_proportions?.[MODERN] ?? 0;
    const hasModern = c.traffic.some((t) => (t.daily_protocol_proportions?.[MODERN] ?? 0) > 0);
    const fromBackfill = backfilled(capBackfill, c.id, start, end);

    const capabilities = {};
    for (const [feature, capId] of Object.entries(FEATURES)) {
      const flag = c.capability_support_60d?.[feature];
      if (flag === undefined) continue;
      const hist = historicalLimit.has(feature) && historical[c.id]?.[feature] === true;
      const bf = fromBackfill.has(feature);
      const e = { tier: 'observed', source: SOURCE, url, date, window: `${start}/${end}` };
      const notes = [];

      if (flag) {
        e.status = 'full';
        if (!hist && !bf) {
          e.at = MODERN;
          notes.push(CALL_OBSERVED.has(feature)
            ? `Successful ${feature} calls seen in the window.`
            : `More than ${pct(threshold)} of this client's ${MODERN} tool calls in the window declared it.`);
        } else {
          const why = [];
          if (hist) why.push(`the initialize-era backfill (${hWin ? `${hWin.start}/${hWin.end}` : 'before the window'}) has it`);
          if (bf) why.push('the transport-metrics backfill saw successful calls in the window');
          notes.push(`Set because ${why.join(' and ')}, or because more than ${pct(threshold)} of ${MODERN} tool calls declared it; the report does not say which, so no revision is recorded.`);
        }
      } else {
        if (CALL_OBSERVED.has(feature)) continue;
        if (!hasModern) continue;
        e.status = 'unsupported';
        e.at = MODERN;
        notes.push(`At most ${pct(threshold)} of this client's ${MODERN} tool calls in the window declared it${historicalLimit.has(feature) ? ', and the initialize-era backfill does not have it' : ''}.`);
      }
      if (e.at === MODERN && modernShare < SMALL_SAMPLE) {
        notes.push(`${MODERN} is ${pct(modernShare)} of this client's tool calls over the 30 days to ${last.date}, so the sample is small.`);
      }
      e.note = notes.join(' ');
      capabilities[capId] = { evidence: [e] };
    }

    return {
      id: c.id,
      label: c.label,
      registryId,
      sourceNames: c.source_names,
      protocolMix30d: last?.rolling_30d_protocol_proportions ?? {},
      protocolMixDate: last?.date,
      capabilities,
    };
  });

  const out = {
    $comment: `Generated by scripts/ingest-observed.js from ${REPO} at ${rev}. Do not edit; rerun the script.`,
    source: SOURCE,
    url,
    revision: rev,
    generatedAt: report.generated_at,
    fetchedAt: new Date().toISOString().slice(0, 10),
    window: { start, end },
    coverage: report.coverage,
    policy: report.policy,
    ...(hWin ? { historicalWindow: { start: hWin.start, end: hWin.end } } : {}),
    clients,
  };
  mkdirSync('data/observed', { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`wrote ${OUT}: ${clients.length} clients at ${rev.slice(0, 8)}, ${clients.filter((c) => c.registryId).length} joined to the registry`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

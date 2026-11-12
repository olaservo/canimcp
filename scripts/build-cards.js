#!/usr/bin/env node
/**
 * Renders one Markdown card per client from data/clients.json, and the
 * cross-client tool result matrix from the probe overlay in data/verified/.
 *
 * Cards are generated, never hand-edited — a status that appears on a card
 * appears because it is in the registry, and the evidence behind it comes
 * along with it. Fix a card by fixing data/clients.json; fix a verified row
 * by rerunning the probe.
 *
 * Usage: node scripts/build-cards.js [--check]
 * --check exits non-zero if any output on disk differs from what it would
 * generate, so CI catches a registry edit that was not re-rendered.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const REGISTRY = 'data/clients.json';
const RESEARCH_DIR = 'research';
const VERIFIED_DIR = 'data/verified';
const OBSERVED_DIR = 'data/observed';
const SCENARIOS = 'probe/registry/scenarios.json';
const OUT_DIR = 'cards';
const MATRIX = 'tool-results.md';
const OBSERVED_PAGE = 'observed.md';
const SPEC = JSON.parse(readFileSync('data/spec-versions.json', 'utf8'));

// Order capabilities are presented in, matching $defs/Capabilities in the
// registry schema. A capability missing from an entry is reported as not
// recorded, which is not the same claim as unsupported.
const CAPABILITY_ORDER = [
  ['transports', 'Transports'],
  ['authentication', 'Authentication'],
  ['tools', 'Tools'],
  ['resources', 'Resources'],
  ['prompts', 'Prompts'],
  ['completions', 'Completions'],
  ['sampling', 'Sampling'],
  ['elicitation', 'Elicitation'],
  ['roots', 'Roots'],
  ['logging', 'Logging'],
  ['instructions', 'Instructions'],
  ['icons', 'Icons'],
  ['tasks', 'Tasks'],
  ['jsonSchema', 'JSON Schema'],
  ['extensions', 'Extensions'],
  ['bonusFeatures', 'Beyond the spec'],
];

const STATUS_MARK = {
  full: '●',
  partial: '◐',
  unsupported: '○',
  untested: '·',
};

const TIER_ORDER = ['read', 'verified', 'observed', 'declared'];

const LANGUAGE = {
  rust: 'Rust',
  typescript: 'TypeScript',
  python: 'Python',
  go: 'Go',
  java: 'Java',
  kotlin: 'Kotlin',
  csharp: 'C#',
  swift: 'Swift',
  ruby: 'Ruby',
  php: 'PHP',
};

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

/** True for the nested objects that are sub-capabilities rather than scalars. */
function isCapabilityNode(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Walks a capability value into flat rows. A capability is either a leaf with
 * its own status, or a container of named children (transports, extensions),
 * or both (tools with tools.listChanged, tools.result with its fields).
 */
function capabilityRows(key, label, value, depth = 0) {
  const rows = [];
  if (!isCapabilityNode(value)) return rows;

  const hasOwn = typeof value.status === 'string';
  rows.push({ label, depth, node: hasOwn ? value : null });

  for (const [childKey, child] of Object.entries(value)) {
    if (childKey === 'evidence' || childKey === 'research' || childKey === 'notes') continue;
    if (!isCapabilityNode(child) || typeof child.status !== 'string') continue;
    // A child with no evidence of its own rests on the parent's. Say so rather
    // than leaving the source column blank, which reads as unsourced.
    const inherited = !child.evidence?.length && value.evidence?.length ? value : null;
    rows.push({ label: childKey, depth: depth + 1, node: child, inherited });
    for (const grand of capabilityRows(childKey, childKey, child, depth + 1).slice(1)) {
      rows.push({ ...grand, inherited: grand.inherited ?? (!grand.node?.evidence?.length ? inherited ?? (child.evidence?.length ? child : null) : null) });
    }
  }
  return rows;
}

/** Distinct evidence tiers backing a capability, in a fixed order. */
function tiersOf(node) {
  if (!node?.evidence?.length) return [];
  const seen = new Set(node.evidence.map((e) => e.tier));
  return TIER_ORDER.filter((t) => seen.has(t));
}

/** Protocol revisions the evidence was gathered at. */
function revisionsOf(node) {
  if (!node?.evidence?.length) return [];
  return [...new Set(node.evidence.map((e) => e.at).filter(Boolean))].sort();
}

/**
 * Evidence that disagrees with the status the registry settled on. The
 * evidence model treats a disagreement as a finding, so it gets its own
 * section rather than being flattened away.
 */
function conflicts(entry) {
  const found = [];
  walk(entry, []);
  return found;

  function walk(node, path) {
    if (!isCapabilityNode(node)) return;
    if (typeof node.status === 'string' && Array.isArray(node.evidence)) {
      for (const e of node.evidence) {
        if (e.status && e.status !== node.status) {
          found.push({ path: path.join('.'), resolved: node.status, evidence: e });
        }
      }
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'evidence' || k === 'metadata') continue;
      if (isCapabilityNode(v)) walk(v, [...path, k]);
    }
  }
}

/** Every research id referenced anywhere in the entry, in first-seen order. */
function researchRefs(entry) {
  const out = [];
  walk(entry);
  return out;

  function walk(node) {
    if (Array.isArray(node)) {
      for (const v of node) walk(v);
      return;
    }
    if (!isCapabilityNode(node)) return;
    for (const [k, v] of Object.entries(node)) {
      if (k === 'research' && Array.isArray(v)) {
        for (const id of v) if (!out.includes(id)) out.push(id);
        continue;
      }
      walk(v);
    }
  }
}

/** Evidence records that point outside the repo (a note in another repo, a dashboard), in first-seen order. */
function externalPointers(entry) {
  const out = [];
  walk(entry, []);
  return out;

  function walk(node, path) {
    if (!isCapabilityNode(node)) return;
    if (Array.isArray(node.evidence)) {
      for (const e of node.evidence) if (e.url && e.tier === 'read') out.push({ path: path.join('.'), evidence: e });
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'evidence' || k === 'metadata') continue;
      if (isCapabilityNode(v)) walk(v, [...path, k]);
    }
  }
}

/** id -> {title, kind, summary} for every note on disk. */
function loadNotes() {
  const notes = {};
  if (!existsSync(RESEARCH_DIR)) return notes;
  for (const f of readdirSync(RESEARCH_DIR).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(join(RESEARCH_DIR, f), 'utf8');
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const field = (name) => {
      const m = fm[1].match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
      return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
    };
    notes[field('id') || f.replace(/\.md$/, '')] = {
      file: f,
      title: field('title'),
      kind: field('kind'),
      summary: field('summary'),
    };
  }
  return notes;
}

/** Every probe overlay under data/verified, plus a registryId index. */
function loadVerified() {
  const all = [];
  const byRegistryId = {};
  if (!existsSync(VERIFIED_DIR)) return { all, byRegistryId };
  for (const f of readdirSync(VERIFIED_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()) {
    const overlay = readJson(join(VERIFIED_DIR, f));
    overlay.file = f;
    all.push(overlay);
    if (overlay.registryId) byRegistryId[overlay.registryId] = overlay;
  }
  return { all, byRegistryId };
}

/** Every telemetry overlay under data/observed, plus a registryId index of {overlay, client}. */
function loadObserved() {
  const all = [];
  const byRegistryId = {};
  if (!existsSync(OBSERVED_DIR)) return { all, byRegistryId };
  for (const f of readdirSync(OBSERVED_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()) {
    const overlay = readJson(join(OBSERVED_DIR, f));
    overlay.file = f;
    all.push(overlay);
    for (const c of overlay.clients) if (c.registryId) (byRegistryId[c.registryId] ??= []).push({ overlay, client: c });
  }
  return { all, byRegistryId };
}

/** The registry node a capability id names, following extension aliases into `extensions`. */
function registryNode(entry, capabilityId) {
  const [root, ...rest] = capabilityId.split('.');
  const ext = Object.entries(SPEC.extensions?.known ?? {}).find(([, e]) => e.alias === root);
  let node = ext && !entry[root] ? entry.extensions?.[ext[0]] : entry[root];
  for (const k of rest) node = node?.[k];
  return isCapabilityNode(node) && typeof node.status === 'string' ? node : null;
}

function protocolMixCell(mix) {
  return Object.entries(mix ?? {})
    .filter(([, p]) => p > 0)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([v, p]) => `\`${v}\` ${p < 0.001 ? '<0.1' : +(p * 100).toFixed(1)}%`)
    .join(', ');
}

/** The observed section of a card: the protocol mix and one row per capability, with the registry's status beside it. */
function observedSection(entry, hits) {
  const L = [];
  L.push('## Observed in traffic');
  L.push('');
  for (const { overlay, client } of hits) {
    L.push(
      `From \`${overlay.source}\` at [\`${overlay.revision.slice(0, 8)}\`](${overlay.url}), report generated ${overlay.generatedAt.slice(0, 10)}, window ${overlay.window.start} to ${overlay.window.end}. Grouped as \`${client.id}\` from wire names ${client.sourceNames.map((n) => `\`${n}\``).join(', ')}. Tool calls by revision over the 30 days to ${client.protocolMixDate}: ${protocolMixCell(client.protocolMix30d) || 'none'}.`,
    );
    L.push('');
    L.push('| Capability | Observed | At | Registry | Note |');
    L.push('|---|---|---|---|---|');
    for (const [id, cap] of Object.entries(client.capabilities)) {
      for (const e of cap.evidence) {
        const reg = registryNode(entry, id);
        const differs = reg && e.status && reg.status !== e.status ? ' ≠' : '';
        L.push(`| ${id} | ${statusCell({ status: e.status })} | ${e.at ? `\`${e.at}\`` : '?'} | ${reg ? statusCell(reg) + differs : '— not recorded'} | ${escapeCell(e.note ?? '')} |`);
      }
    }
    L.push('');
    L.push(`\`≠\` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in \`${OBSERVED_DIR}/${overlay.file}\`.`);
    L.push('');
  }
  return L;
}

/** Cross-client view of every telemetry overlay. */
function renderObserved(overlays, registry) {
  const L = [];
  L.push('# Capabilities observed in traffic');
  L.push('');
  for (const o of overlays) {
    const ids = [...new Set(o.clients.flatMap((c) => Object.keys(c.capabilities)))];
    L.push(
      `Generated from \`${OBSERVED_DIR}/${o.file}\`: \`${o.source}\` at [\`${o.revision.slice(0, 8)}\`](${o.url}), report generated ${o.generatedAt.slice(0, 10)}, window ${o.window.start} to ${o.window.end}. ${o.clients.length} clients, ${o.clients.filter((c) => c.registryId).length} with a registry entry.`,
    );
    L.push('');
    L.push(
      `A flag is set when more than ${o.policy.capability_proportion_threshold * 100}% of a client's \`${o.policy.modern_protocol_version}\` tool calls in the window declare the capability, or when a backfill has it. The initialize-era backfill${o.historicalWindow ? ` (${o.historicalWindow.start} to ${o.historicalWindow.end})` : ''} can set ${o.policy.historical_capability_limit.join(', ')} for a client even though it lies outside the window. Where a backfill could have set a flag the At column is \`?\`, because the report does not say which path did. \`skills\` is set by a successful \`skills/list\` call, so an unset skills flag is not recorded as unsupported. A client with no \`${o.policy.modern_protocol_version}\` traffic in the window gets no record for an unset flag.`,
    );
    L.push('');
    const header = ['Client', 'Wire names', 'Tool calls by revision, 30d', ...ids];
    L.push(`| ${header.join(' | ')} |`);
    L.push(`|${header.map(() => '---').join('|')}|`);
    for (const c of o.clients) {
      const name = c.registryId && registry[c.registryId] ? `[${escapeCell(c.label)}](${c.registryId}.md)` : escapeCell(c.label);
      const cells = ids.map((id) => {
        const e = c.capabilities[id]?.evidence?.[0];
        return e ? `${STATUS_MARK[e.status] ?? ''} ${e.at ? '' : '?'}`.trim() : '';
      });
      L.push(`| ${name} | ${c.sourceNames.map((n) => `\`${escapeCell(n)}\``).join(', ')} | ${protocolMixCell(c.protocolMix30d)} | ${cells.join(' | ')} |`);
    }
    L.push('');
    L.push('`●` set, observed at `2026-07-28` · `● ?` set, revision unknown · `○` not set · blank: no record.');
    L.push('');
    L.push('## Policy');
    L.push('');
    L.push('The source\'s policy block, verbatim.');
    L.push('');
    L.push('```json');
    L.push(JSON.stringify(o.policy, null, 2));
    L.push('```');
    L.push('');
  }
  L.push('---');
  L.push('');
  L.push(`Generated from \`${OBSERVED_DIR}/*.json\` by \`scripts/build-cards.js\`. Rerun \`npm run ingest:observed\` and \`npm run build:cards\`, do not edit this file.`);
  L.push('');
  return L.join('\n');
}

/** The overlay flattened into evidence rows, each carrying its capability id. */
function verifiedRows(overlay) {
  const rows = [];
  for (const [capability, cap] of Object.entries(overlay.capabilities ?? {})) {
    for (const e of cap.evidence ?? []) rows.push({ capability, ...e });
  }
  return rows;
}

/** Scenario ids in presentation order: the tool-results set, then anything else the overlays mention. */
function scenarioOrder(rows) {
  const order = [];
  if (existsSync(SCENARIOS)) {
    const reg = readJson(SCENARIOS);
    for (const id of reg.sets?.['tool-results'] ?? []) order.push(id);
  }
  for (const r of rows) if (!order.includes(r.scenario)) order.push(r.scenario);
  return order;
}

/**
 * The clients-page glyph for one probe verdict. `[…]` content, `{…}`
 * structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder; `≡` is
 * the mirror fixture, where text and JSON are the same bytes and only the
 * count says anything. `∅` tool hidden from the model, `↛` offered but not
 * called, `✗` called but no result reached the model.
 */
function glyph(note) {
  if (!note) return '';
  if (note.startsWith('tool not offered')) return '∅';
  if (note.startsWith('tool offered but never called')) return '↛';
  if (note.startsWith('result never sent')) return '✗';
  let g;
  if (note.startsWith('⟨…⟩')) g = '⟨…⟩';
  else if (note.startsWith('[…] and {…}')) g = '[…]{…}';
  else if (note.startsWith('{…}')) g = '{…}';
  else if (note.startsWith('[…]')) g = '[…]';
  else if (note.startsWith('"…"')) g = '"…"';
  else if (note.startsWith('payload')) g = '≡';
  else if (note.startsWith('no marker')) g = '"…"';
  else return '?';
  const counts = [...note.matchAll(/(\d+)x/g)].map((m) => Number(m[1])).filter((n) => n > 1);
  if (counts.length) g += `×${Math.max(...counts)}`;
  if (note.includes('_meta reached')) g += '+_meta';
  return g;
}

function configOrder(a, b) {
  if (a === b) return 0;
  if (a === 'default') return -1;
  if (b === 'default') return 1;
  return a.localeCompare(b);
}

function runLabel(e) {
  const t = e.run?.transport ?? '';
  const era = e.run?.eraPolicy && e.run.eraPolicy !== 'both' ? ` ${e.run.eraPolicy}` : '';
  return `${t}${era}`;
}

/** Distinct (config, transport, era) row keys for an overlay, default config first. */
function rowKeys(rows) {
  const keys = new Map();
  for (const r of rows) {
    const k = `${r.config}|${runLabel(r)}`;
    if (!keys.has(k)) keys.set(k, { config: r.config, run: runLabel(r) });
  }
  return [...keys.values()].sort((a, b) => configOrder(a.config, b.config) || a.run.localeCompare(b.run));
}

function escapeCell(s) {
  return String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

/** The verified rows for one client as a Markdown table. */
function verifiedTable(rows, { withCapability }) {
  const L = [];
  L.push(`| Scenario | Config | Run | At | Version | Verdict |`);
  L.push('|---|---|---|---|---|---|');
  const sorted = [...rows].sort(
    (a, b) => a.capability.localeCompare(b.capability) || a.scenario.localeCompare(b.scenario) || configOrder(a.config, b.config) || runLabel(a).localeCompare(runLabel(b)),
  );
  let lastCap;
  for (const r of sorted) {
    if (withCapability && r.capability !== lastCap) {
      L.push(`| **${escapeCell(r.capability)}** | | | | | |`);
      lastCap = r.capability;
    }
    const scenario = r.scenario.replace(/^tools\.result\./, '');
    const artifact = r.artifact ? `[${escapeCell(scenario)}](../${r.artifact}/record.json)` : escapeCell(scenario);
    L.push(`| ${artifact} | ${escapeCell(r.config)} | ${escapeCell(runLabel(r))} | ${r.at ? `\`${r.at}\`` : '?'} | ${escapeCell(r.clientVersion)} | ${escapeCell(r.note)} |`);
  }
  return L;
}

/**
 * One-line summary of the SDK a client is built on. `declared` and `resolved`
 * are shown separately when they differ — a version requirement is not a
 * version, and only the resolved one describes what runs.
 */
function sdkCell(sdk) {
  if (!sdk) return '';
  const bits = [`\`${sdk.name}\`${sdk.resolved ? ` ${sdk.resolved}` : ''}`];
  if (sdk.declared && sdk.declared !== sdk.resolved) bits.push(`declares \`${sdk.declared}\``);
  if (sdk.language) bits.push(`${sdk.official ? 'official ' : ''}${LANGUAGE[sdk.language] ?? sdk.language} SDK`);
  bits.push(sdk.patched ? '**patched**' : 'unpatched');
  if (sdk.pinsProtocolVersion) bits.push(`pins \`${sdk.pinsProtocolVersion}\``);
  return bits.join(' · ');
}

function statusCell(node) {
  if (!node) return '';
  const mark = STATUS_MARK[node.status] ?? '';
  return `${mark} ${node.status}`;
}

/** A short human citation for one evidence record. */
function citation(e) {
  const bits = [e.source];
  if (e.commit) bits.push(`\`${e.commit}\``);
  if (e.path) bits.push(`\`${e.path}\``);
  if (e.scenario) bits.push(e.scenario);
  if (e.window) bits.push(e.window);
  return bits.filter(Boolean).join(' ');
}

function renderCard(id, entry, notes, verified, observed) {
  const m = entry.metadata ?? {};
  const src = m.source ?? {};
  const L = [];

  L.push(`# ${entry.title}`);
  L.push('');
  L.push(entry.description ?? '');
  L.push('');

  L.push('## At a glance');
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  const row = (k, v) => v && L.push(`| ${k} | ${escapeCell(v)} |`);
  row('Registry id', `\`${id}\``);
  row('Vendor', m.vendor);
  row('Category', entry.category);
  row('Platforms', (entry.platforms ?? []).join(', '));
  row('Licence', m.openSource === false ? `closed source${m.license ? ` (${m.license})` : ''}` : m.license);
  row('Source', m.sourceUrl ? `<${m.sourceUrl}>` : '');
  row('Home', entry.url ? `<${entry.url}>` : '');
  row(
    'Wire names',
    (entry.clientInfoNames ?? []).map((n) => `\`${n}\``).join(', ') || 'not recorded',
  );
  row('SDK', sdkCell(m.sdk));
  row('Prefers', entry.preferredProtocolVersion ? `\`${entry.preferredProtocolVersion}\`` : '');
  row('Speaks', (entry.protocolVersions ?? []).map((v) => `\`${v}\``).join(', '));
  row('Source last updated', src.commitDate ? src.commitDate.slice(0, 10) : '');
  row('Last read', src.checkedAt ?? m.lastVerified);
  if (verified) row('Probed', `${verified.versions.map((v) => `\`${v}\``).join(', ')} (see below)`);
  for (const { overlay, client } of observed ?? []) row('In traffic', `${overlay.source}, window ending ${overlay.window.end} (see below)`);
  L.push('');

  L.push('## Capabilities');
  L.push('');
  L.push('| Capability | Status | Known by | At |');
  L.push('|---|---|---|---|');
  for (const [key, label] of CAPABILITY_ORDER) {
    const value = entry[key];
    if (value === undefined) {
      L.push(`| ${label} | — not recorded | | |`);
      continue;
    }
    for (const r of capabilityRows(key, label, value)) {
      const indent = '&nbsp;&nbsp;'.repeat(r.depth);
      const name = r.depth ? `${indent}↳ ${escapeCell(r.label)}` : `**${escapeCell(r.label)}**`;
      const from = r.inherited ?? r.node;
      const suffix = r.inherited ? ' ⇧' : '';
      const tiers = tiersOf(from);
      L.push(
        `| ${name} | ${statusCell(r.node)} | ${tiers.length ? tiers.join(', ') + suffix : ''} | ${revisionsOf(from)
          .map((v) => `\`${v}\``)
          .join(', ')} |`,
      );
    }
  }
  L.push('');
  L.push('`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability\'s evidence');
  L.push('');
  L.push('Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.');
  L.push('');

  const notesRows = collectNotes(entry);
  if (notesRows.length) {
    L.push('## What the table flattens');
    L.push('');
    for (const n of notesRows) L.push(`- **${escapeCell(n.path)}** — ${n.text}`);
    L.push('');
  }

  if (verified) {
    const rows = verifiedRows(verified);
    L.push('## Verified by the probe');
    L.push('');
    L.push(
      `${rows.length} records from the live probe (\`probe/\`), client version${verified.versions.length > 1 ? 's' : ''} ${verified.versions
        .map((v) => `\`${v}\``)
        .join(', ')}. Each row is one run against the instrumented fixture server with the model mocked; the verdict says which fixture fields reached the model. Glyphs: \`[…]\` content, \`{…}\` structuredContent, \`⟨…⟩\` the whole envelope, \`"…"\` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: \`${VERIFIED_DIR}/${verified.file}\`.`,
    );
    L.push('');
    L.push(...verifiedTable(rows, { withCapability: true }));
    L.push('');
  }

  if (observed?.length) L.push(...observedSection(entry, observed));

  const conf = conflicts(entry);
  if (conf.length) {
    L.push('## Where the evidence disagrees');
    L.push('');
    for (const c of conf) {
      const e = c.evidence;
      L.push(
        `- **${escapeCell(c.path)}** — recorded as \`${c.resolved}\`, but ${e.tier}-tier evidence at \`${e.at ?? '?'}\` says \`${e.status}\`.`,
      );
      L.push(`  <br>${escapeCell(citation(e))} (${e.date})${e.note ? ` — ${escapeCell(e.note)}` : ''}`);
    }
    L.push('');
  }

  const refs = researchRefs(entry);
  const pointers = externalPointers(entry);
  if (refs.length || pointers.length) {
    L.push('## Research notes');
    L.push('');
    for (const ref of refs) {
      const n = notes[ref];
      if (!n) {
        L.push(`- \`${ref}\` — note missing`);
        continue;
      }
      L.push(`- [${escapeCell(n.title)}](../research/${n.file}) — *${n.kind}*. ${escapeCell(n.summary)}`);
    }
    for (const p of pointers) {
      const e = p.evidence;
      L.push(`- [${escapeCell(e.path ?? e.source)}](${e.url}) — *${escapeCell(p.path)}*, read ${e.date} at \`${e.commit ?? '?'}\` in ${escapeCell(e.source)}.${e.note ? ` ${escapeCell(e.note)}` : ''}`);
    }
    L.push('');
  }

  L.push('## Provenance');
  L.push('');
  if (src.checkedCommit) {
    L.push(
      `Read at \`${src.checkedCommit.slice(0, 8)}\` on ${src.checkedAt ?? m.lastVerified ?? 'an unrecorded date'}, from \`${src.ref ?? 'default branch'}\` of ${src.repo ?? m.sourceUrl ?? 'an unrecorded repo'}.` +
        (src.commitDate ? ` That commit was authored ${src.commitDate.slice(0, 10)}.` : ''),
    );
    L.push('');
    if (m.sdk?.notes) {
      L.push(`**SDK.** ${escapeCell(m.sdk.notes)}`);
      L.push('');
    }
    if (src.paths?.length) {
      L.push('Paths read:');
      L.push('');
      for (const p of src.paths) L.push(`- \`${p}\``);
      L.push('');
    }
    L.push(
      'Source is not vendored. Client source is read from the shared `_clients` checkout ' +
        `(see \`AGENTS.md\`); check out that commit there to reproduce any claim above.`,
    );
  } else {
    L.push('No source read is recorded for this client. Every claim above comes from another tier.');
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push(
    `Generated from \`${REGISTRY}\`${verified ? `, \`${VERIFIED_DIR}/${verified.file}\`` : ''}${(observed ?? []).map((o) => `, \`${OBSERVED_DIR}/${o.overlay.file}\``).join('')} by \`scripts/build-cards.js\`. Edit the registry, rerun the probe or the ingest, not this file.`,
  );
  L.push('');

  return L.join('\n');
}

/** The cross-client matrix: one row per probed client, config and run, one column per scenario. */
function renderMatrix(overlays, registry) {
  const L = [];
  const rowsByOverlay = overlays.map((o) => ({ overlay: o, rows: verifiedRows(o) }));
  const scenarios = scenarioOrder(rowsByOverlay.flatMap((x) => x.rows));
  const short = (id) => id.replace(/^tools\.result\./, '');
  const total = rowsByOverlay.reduce((n, x) => n + x.rows.length, 0);

  L.push('# Tool result handling, verified');
  L.push('');
  L.push(
    `What reached the model when each client called a fixture tool: ${total} probe records across ${overlays.length} clients, generated from \`${VERIFIED_DIR}/\` by \`scripts/build-cards.js\`. Each cell is one run of the live probe (\`probe/\`) against the instrumented fixture server with the model mocked, so the verdict is read off the request the client sent to the model, not inferred from source. Rerun the probe to change a cell.`,
  );
  L.push('');
  L.push('`[…]` content reached the model · `{…}` structuredContent reached it · `[…]{…}` both · `⟨…⟩` the whole CallToolResult (or a wrapper around it) · `"…"` a placeholder or error text and no fixture payload · `≡` the mirror fixture, text and JSON identical, with the count · `×n` the payload arrived n times · `+_meta` the result `_meta` reached the model · `∅` tool hidden from the model · `↛` offered but never called · `✗` called but no result reached the model · blank: not run.');
  L.push('');
  L.push('Columns are the probe scenarios (`probe/registry/scenarios.json`); drop the `tools.result.` prefix. Rows are client version, config and run (transport, and era policy when not both). The At column is the protocol revision seen on the wire.');
  L.push('');

  const header = ['Client', 'Config', 'Run', 'At', ...scenarios.map(short)];
  L.push(`| ${header.join(' | ')} |`);
  L.push(`|${header.map(() => '---').join('|')}|`);
  for (const { overlay, rows } of rowsByOverlay) {
    const title = overlay.registryId && registry[overlay.registryId] ? `[${escapeCell(overlay.title)}](${overlay.registryId}.md)` : escapeCell(overlay.title);
    for (const key of rowKeys(rows)) {
      const cells = scenarios.map((s) => {
        const hits = rows.filter((r) => r.scenario === s && r.config === key.config && runLabel(r) === key.run);
        if (!hits.length) return '';
        return hits.map((h) => glyph(h.note)).join(' / ');
      });
      const ats = [...new Set(rows.filter((r) => r.config === key.config && runLabel(r) === key.run).map((r) => r.at ?? '?'))].sort();
      const versions = [...new Set(rows.filter((r) => r.config === key.config && runLabel(r) === key.run).map((r) => r.clientVersion))];
      L.push(`| ${title} ${versions.map((v) => `\`${v}\``).join(', ')} | ${escapeCell(key.config)} | ${escapeCell(key.run)} | ${ats.map((a) => `\`${a}\``).join(', ')} | ${cells.join(' | ')} |`);
    }
  }
  L.push('');

  L.push('## Scenarios');
  L.push('');
  if (existsSync(SCENARIOS)) {
    const reg = readJson(SCENARIOS);
    L.push('| Scenario | Capability | Question |');
    L.push('|---|---|---|');
    for (const id of scenarios) {
      const s = reg.scenarios.find((x) => x.id === id);
      if (!s) continue;
      L.push(`| ${short(id)} | \`${s.capability}\` | ${escapeCell(s.question)} |`);
    }
    L.push('');
  }

  L.push('## Every record');
  L.push('');
  L.push('The full verdict line per run, with a link to the record and its captures.');
  L.push('');
  for (const { overlay, rows } of rowsByOverlay) {
    L.push(`### ${escapeCell(overlay.title)}`);
    L.push('');
    L.push(`${rows.length} records, version${overlay.versions.length > 1 ? 's' : ''} ${overlay.versions.map((v) => `\`${v}\``).join(', ')}${overlay.registryId ? `, registry entry [${overlay.registryId}](${overlay.registryId}.md)` : ', no registry entry yet'}. Overlay \`${VERIFIED_DIR}/${overlay.file}\`.`);
    L.push('');
    L.push(...verifiedTable(rows, { withCapability: false }));
    L.push('');
  }
  L.push('---');
  L.push('');
  L.push(`Generated from \`${VERIFIED_DIR}/*.json\` by \`scripts/build-cards.js\`. Rerun the probe and \`npm run build:cards\`, do not edit this file.`);
  L.push('');
  return L.join('\n');
}

/** Capability `notes` fields, which carry the detail a status cannot. */
function collectNotes(entry) {
  const out = [];
  walk(entry, []);
  return out;

  function walk(node, path) {
    if (!isCapabilityNode(node)) return;
    if (typeof node.notes === 'string' && path.length) {
      out.push({ path: path.join('.'), text: escapeCell(node.notes) });
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'evidence' || k === 'metadata') continue;
      if (isCapabilityNode(v)) walk(v, [...path, k]);
    }
  }
}

function main() {
  const check = process.argv.includes('--check');
  const registry = readJson(REGISTRY);
  const notes = loadNotes();
  const verified = loadVerified();
  const observed = loadObserved();

  mkdirSync(OUT_DIR, { recursive: true });

  const ids = Object.keys(registry).filter((k) => !k.startsWith('$'));
  let stale = 0;

  const outputs = ids.map((id) => [join(OUT_DIR, `${id}.md`), renderCard(id, registry[id], notes, verified.byRegistryId[id], observed.byRegistryId[id])]);
  if (verified.all.length) outputs.push([join(OUT_DIR, MATRIX), renderMatrix(verified.all, registry)]);
  if (observed.all.length) outputs.push([join(OUT_DIR, OBSERVED_PAGE), renderObserved(observed.all, registry)]);

  for (const [out, rendered] of outputs) {
    if (check) {
      // Compare on content, not line endings — git hands back CRLF on a
      // Windows checkout and every card would read as stale.
      const current = existsSync(out) ? readFileSync(out, 'utf8').replace(/\r\n/g, '\n') : null;
      if (current !== rendered) {
        stale++;
        console.log(`  STALE ${out}`);
      } else {
        console.log(`  ok    ${out}`);
      }
      continue;
    }
    writeFileSync(out, rendered);
    console.log(`  wrote ${out}`);
  }

  if (check && stale) {
    console.log(`\n${stale} file(s) out of date. Run \`npm run build:cards\`.`);
    process.exit(1);
  }
  console.log(check ? '\nall cards current.' : `\n${outputs.length} file(s) written.`);
}

main();

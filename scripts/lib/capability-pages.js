/**
 * Renders the capability index as Markdown: one page per capability and the
 * matrix across clients. Paths are site paths, so build-site.js can check them.
 */

import { KIND_MEANING } from './kinds.js';

const STATUS_MARK = { full: '●', partial: '◐', 'opt-in': '◇', unsupported: '○', untested: '·' };
const TIER_LETTER = { read: 'R', verified: 'V', observed: 'O', declared: 'D' };
const MODEL_API = { anthropic: 'Anthropic Messages', chat: 'Chat Completions', responses: 'Responses', gemini: 'Gemini' };
const IMAGE_OUTCOME = { 'image-part': 'image part', 'base64-text': 'base64 pasted into text', absent: 'dropped' };
const cellText = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
const code = (s) => `\`${s}\``;
const local = (url, origin) => (url.startsWith(origin) ? url.slice(origin.length) : url);

/** One evidence item as a sentence fragment with its source. */
function citation(e) {
  const where = [e.source && (e.url ? `[${e.source}](${e.url})` : e.source), e.commit && `at ${code(e.commit)}`, e.path && code(e.path)].filter(Boolean).join(' ');
  const head = [`*${e.tier}*`, e.at && `at ${code(e.at)}`, e.status && `says ${e.status}`].filter(Boolean).join(' ');
  return `${head}: ${where}${e.date ? `, ${e.date}` : ''}${e.note ? `. ${e.note}` : ''}`;
}

const pageOf = (cap) => `/capabilities/${cap.slug}`;
const link = (cap) => `[${code(cap.id)}](${pageOf(cap)})`;

/** The matrix page for one revision. The baseline's is /capabilities/. */
export const matrixUrl = (revision, views) => (revision === views[0] ? '/capabilities/' : `/capabilities/revision/${revision}`);

/** The line that switches the matrix between revisions. */
function revisionSwitch(current, views) {
  return `Protocol revision: ${views.map((v) => (v === current ? `**${v}**` : `[${v}](${matrixUrl(v, views)})`)).join(' · ')}`;
}

/** Cells of an older view that come from a byProtocolVersion record, keyed by revision. */
function recordCells(cap, at) {
  const out = {};
  for (const [rev, index] of Object.entries(at)) {
    const other = index.capabilities.find((c) => c.id === cap.id);
    const cells = Object.values(other?.subjects ?? {}).filter((s) => s.revisionRecord);
    if (cells.length) out[rev] = cells;
  }
  return out;
}

/** The page for one capability. */
export function capabilityPage(cap, index, { origin, noteTitles, views = [index.revision], at = {} }) {
  const subject = Object.fromEntries(index.subjects.map((s) => [s.id, s]));
  const byId = Object.fromEntries(index.capabilities.map((c) => [c.id, c]));
  const subjectLink = (id) => `[${subject[id].title}](${local(subject[id].page, origin)})`;
  const cells = Object.values(cap.subjects);
  const recorded = cells.filter((s) => s.status !== undefined);
  const probed = cells.filter((s) => s.verified);
  const seen = cells.filter((s) => s.observed);
  const life = cap.lifecycle;
  const L = [];

  L.push(`# ${code(cap.id)} support in MCP clients`, '');
  const intro = [
    `Which MCP clients support ${code(cap.id)}, and how each claim is known.`,
    life?.introducedIn ? `The protocol introduced it in ${code(life.introducedIn)}.` : 'It is not a protocol feature with its own lifecycle, so the registry tracks it on its own terms.',
    life?.deprecatedIn && `It was deprecated in ${code(life.deprecatedIn)}.`,
    life?.removedIn && `It was removed in ${code(life.removedIn)}.`,
  ].filter(Boolean).join(' ');
  L.push(intro, '');
  if (cap.parent || cap.children.length) {
    const rel = [cap.parent && `Part of ${link(byId[cap.parent])}.`, cap.children.length && `Has ${cap.children.map((c) => link(byId[c])).join(', ')}.`].filter(Boolean).join(' ');
    L.push(rel, '');
  }

  L.push('## Support', '');
  if (recorded.length) {
    L.push('| Client | Kind | Status | Known from | Revisions | Notes |', '|---|---|---|---|---|---|');
    for (const s of recorded) {
      const revisions = [...new Set([...(s.evidence ?? []), ...(s.inheritedEvidence ?? [])].map((e) => e.at).filter(Boolean))].sort().map(code).join(', ');
      const from = s.inheritsFrom ? `, through ${link(byId[s.inheritsFrom])}` : '';
      L.push(`| ${subjectLink(s.subject)}${subject[s.subject].revision < index.revision ? ' *' : ''} | ${subject[s.subject].kind} | ${STATUS_MARK[s.status] ?? ''} ${s.status} | ${s.tiers.length ? `${s.tiers.join(', ')}${from}` : 'no evidence recorded'} | ${revisions} | ${cellText(s.notes)} |`);
    }
    L.push('');
  } else {
    L.push('No registry entry records a status for it.', '');
  }
  if (cap.notRecorded.length) {
    L.push(`Not recorded for ${cap.notRecorded.map(subjectLink).join(', ')}. A missing record is not the same as unsupported.`, '');
  }
  const older = recorded.filter((s) => subject[s.subject].revision < index.revision);
  if (older.length) {
    const count = {};
    for (const s of older) count[subject[s.subject].revision] = (count[subject[s.subject].revision] ?? 0) + 1;
    const list = Object.entries(count).sort((a, b) => b[0].localeCompare(a[0])).map(([v, n]) => `${code(v)} for ${n} ${n === 1 ? 'client' : 'clients'}`).join(', ');
    L.push(`Rows describe each client on ${code(index.revision)}. A row marked * is for the newest revision the client speaks, because it cannot negotiate ${code(index.revision)}: ${list}.`, '');
  }
  L.push('Tiers are not ranked. `read` is a source read at a pinned commit, `verified` is a probe run, `observed` is telemetry, and `declared` is what the client or a curated list says. "Through" names the parent capability whose evidence a row rests on when it has none of its own.', '');

  if (views.length > 1) {
    const records = recordCells(cap, at);
    L.push('## By protocol revision', '');
    for (const rev of views.slice(1)) {
      const cells = records[rev] ?? [];
      const unsplit = recorded.filter((s) => !subject[s.subject].recordedPerRevision && subject[s.subject].protocolVersions.includes(rev));
      if (cells.length) {
        L.push(`On ${code(rev)} these clients record a different row. The other clients' rows above hold on ${code(rev)} as well.`, '');
        L.push(`| Client | On ${code(index.revision)} | On ${code(rev)} | Notes on ${code(rev)} |`, '|---|---|---|---|');
        for (const s of cells) {
          const base = cap.subjects[s.subject]?.status;
          L.push(`| ${subjectLink(s.subject)} | ${base ? `${STATUS_MARK[base] ?? ''} ${base}` : 'not recorded'} | ${STATUS_MARK[s.status] ?? ''} ${s.status} | ${cellText(s.notes)} |`);
        }
        L.push('');
      } else {
        L.push(`No client records a different row on ${code(rev)}, so the rows above hold there too.`, '');
      }
      if (unsplit.length) L.push(`${unsplit.map((s) => subjectLink(s.subject)).join(', ')} ${unsplit.length === 1 ? 'has' : 'have'} one set of rows for every revision ${unsplit.length === 1 ? 'it speaks' : 'they speak'}, not yet split by revision.`, '');
      L.push(`The [matrix on ${code(rev)}](${matrixUrl(rev, views)}) shows every capability on that revision.`, '');
    }
  }

  const disagreeing = cells.filter((s) => s.disagreements.length);
  if (disagreeing.length) {
    L.push('## Where the tiers disagree', '');
    for (const s of disagreeing) {
      for (const e of s.disagreements) L.push(`- ${subjectLink(s.subject)} is recorded as ${s.status}. ${citation(e)}`);
    }
    L.push('');
  }

  const configName = (r) => `${r.config ? code(r.config) : 'not recorded'}${r.configKind && r.configKind !== r.config ? ` (${r.configKind})` : ''}`;
  const probeRows = probed.flatMap((s) => s.verified.configs.filter((r) => r.source === 'probe').map((r) => ({ s, r })));
  const conformanceRows = probed.flatMap((s) => s.verified.configs.filter((r) => r.source === 'conformance').map((r) => ({ s, r })));
  const kindLegend = 'Each row is one client configuration. A name other than `default` is followed by its kind: `setting` for a switch the client documents, `harness` for probe-written code that uses an API the client leaves to the application, such as an elicitation callback. A `harness` row says what an application built on the client can do. A configuration named `default` with a kind after it is not the client\'s stock setup.';
  if (probeRows.length) {
    // A protocol.* scenario is classified from the wire, and its records are listed on the client's page.
    const wire = cap.id.startsWith('protocol.');
    L.push('## Probe results', '', `The probe ran each client against a fixture server and recorded what the client sent to ${wire ? 'the server' : 'its model'}.`, '', kindLegend, '');
    L.push(`| Client | Kind | Configuration | Versions | Runs | Revisions | ${wire ? 'What the client sent' : 'What reached the model'} |`, '|---|---|---|---|---|---|---|');
    for (const { s, r } of probeRows) {
      const verdicts = r.verdicts.slice(0, 3).map((x) => `${cellText(x.verdict)} (${x.count})`).join('; ') + (r.verdicts.length > 3 ? `; ${r.verdicts.length - 3} more` : '');
      L.push(`| [${subject[s.subject].title}](${local(wire ? subject[s.subject].page : s.verified.records, origin)}) | ${subject[s.subject].kind} | ${configName(r)} | ${r.clientVersions.map(code).join(', ')} | ${r.runs} | ${r.revisions.map(code).join(', ')} | ${verdicts} |`);
    }
    L.push('', 'The number after each verdict is how many runs ended that way. Each client name links to its full records.', '');
  }
  if (conformanceRows.length) {
    L.push('## Conformance suite results', '', 'The [MCP conformance suite](https://github.com/modelcontextprotocol/conformance) ran its client scenarios for this capability against each client, through the probe\'s adapter and mock model. A scenario counts as full when every check passed and the client exited cleanly, partial when some checks passed and one failed, and failed when no check passed. "Absence only" means the only checks that passed are ones a client that ignores the feature also passes.', '', ...(probeRows.length ? [] : [kindLegend, '']));
    L.push('| Client | Kind | Configuration | Version | Revision | Scenarios | Checks passed |', '|---|---|---|---|---|---|---|');
    for (const { s, r } of conformanceRows) {
      for (const [rev, n] of Object.entries(r.byRevision).sort(([a], [b]) => a.localeCompare(b))) {
        const scenarios = [n.full && `${n.full} full`, n.partial && `${n.partial} partial`, n.absenceOnly && `${n.absenceOnly} absence only`, n.failed && `${n.failed} failed`].filter(Boolean).join(', ');
        L.push(`| ${subjectLink(s.subject)} | ${subject[s.subject].kind} | ${configName(r)} | ${r.clientVersions.map(code).join(', ')} | ${code(rev)} | ${scenarios} | ${n.checksPassed} of ${n.checks} |`);
      }
    }
    L.push('', 'The checks behind each row, with their messages, are in the client\'s record file under `/data/verified/`.', '');
  }

  const withImage = probed.filter((s) => s.verified.image);
  if (withImage.length) {
    const total = { 'image-part': 0, 'base64-text': 0, absent: 0 };
    for (const s of withImage) for (const r of s.verified.image) total[r.outcome] = (total[r.outcome] ?? 0) + r.runs;
    L.push('## Whether the image reached the model', '');
    L.push(`The image scenario returns a text block and a PNG. A client can hand the image to the model as an image part of the provider's API, paste its base64 data into text, or drop it. Across ${Object.values(total).reduce((a, b) => a + b, 0)} runs the image arrived as an image part in ${total['image-part']}, as base64 text in ${total['base64-text']}, and not at all in ${total.absent}. The outcome depends on the model API as well as the client, so each row is one client on one API.`, '');
    L.push('| Client | Kind | Model API | Outcome | Runs | Configurations |', '|---|---|---|---|---|---|');
    for (const s of withImage) {
      for (const r of s.verified.image) {
        L.push(`| [${subject[s.subject].title}](${local(s.verified.records, origin)}) | ${subject[s.subject].kind} | ${MODEL_API[r.api] ?? 'none: the SDK hands the result to its host'} | ${MODEL_API[r.api] ? IMAGE_OUTCOME[r.outcome] ?? r.outcome : r.outcome === 'absent' ? 'missing from the result' : 'present in the result, as base64'} | ${r.runs} | ${r.configs.map(code).join(', ')} |`);
      }
    }
    L.push('', 'One 1×1 PNG is the only image tested. Audio, embedded resources, resource links, other image formats and large images have no scenario yet, and what a client shows the user is outside what the probe can see.', '');
  }

  if (seen.length) {
    L.push('## Observed in traffic', '', '| Client | Says | Revision | Basis |', '|---|---|---|---|');
    for (const s of seen) {
      for (const e of s.observed) L.push(`| ${subjectLink(s.subject)} | ${e.status ?? ''} | ${e.at ? code(e.at) : 'not recorded'} | ${cellText(e.note)} |`);
    }
    L.push('', 'From the telemetry feed on [Capabilities observed in traffic](/observed).', '');
  }

  const cited = recorded.filter((s) => s.evidence?.length);
  const citedOlder = Object.entries(recordCells(cap, at)).flatMap(([rev, cells]) => cells.filter((s) => s.evidence?.length).map((s) => [rev, s]));
  if (cited.length || citedOlder.length) {
    L.push('## Evidence', '');
    for (const s of cited) {
      L.push(`${subjectLink(s.subject)}:`, '', ...s.evidence.map((e) => `- ${citation(e)}`), '');
    }
    for (const [rev, s] of citedOlder) {
      L.push(`${subjectLink(s.subject)} on ${code(rev)}:`, '', ...s.evidence.map((e) => `- ${citation(e)}`), '');
    }
  }

  if (life) {
    L.push('## Lifecycle', '');
    const rows = [
      life.introducedIn && [life.introducedIn, 'Introduced.'],
      ...Object.entries(life.changes ?? {}),
      life.deprecatedIn && [life.deprecatedIn, `Deprecated.${life.earliestRemoval ? ` Earliest removal ${life.earliestRemoval}.` : ''}`],
      life.removedIn && [life.removedIn, 'Removed.'],
    ].filter(Boolean).sort((a, b) => a[0].localeCompare(b[0]));
    L.push('| Revision | Change |', '|---|---|', ...rows.map(([v, text]) => `| ${code(v)} | ${cellText(text)} |`), '');
    for (const k of ['notes', 'migration']) if (life[k]) L.push(`${life[k]}`, '');
    if (life.sep) L.push(`${life.sep}.`, '');
  }

  if (cap.research.length) {
    L.push('## Research notes', '', ...cap.research.map((id) => `- [${noteTitles[id] ?? id}](/research/${id})`), '');
  }

  const kinds = [...new Set(cells.map((s) => subject[s.subject].kind))].filter((k) => k !== 'host');
  if (kinds.length) L.push('## Kinds', '', ...kinds.map((k) => `- ${k}: ${KIND_MEANING[k]}`), '');

  L.push('## Data', '', `This page as JSON: [${code(`/data/capabilities/${cap.slug}.json`)}](/data/capabilities/${cap.slug}.json). All capabilities: [${code('/data/capabilities/index.json')}](/data/capabilities/index.json), and the [matrix](/capabilities/).`, '');
  return L.join('\n');
}

/** The matrix: capabilities down, registry entries across. */
export function matrixPage(index, { origin, views = [index.revision], omitted = [] }) {
  const columns = index.subjects.filter((s) => s.registry);
  const others = index.subjects.filter((s) => !s.registry);
  const baseline = index.revision === views[0];
  const older = columns.filter((s) => s.revision < index.revision);
  const unsplit = columns.filter((s) => !s.recordedPerRevision);
  const L = [];
  L.push(baseline ? '# Capabilities' : `# Capabilities on ${index.revision}`, '');
  L.push(`Which MCP clients support what${baseline ? '' : ` when the server's newest revision is ${code(index.revision)}`}. ${index.capabilities.length} capabilities down, the ${columns.length} clients with a registry entry across. Each capability links to a page with the evidence behind every cell.`, '');
  if (views.length > 1) L.push(revisionSwitch(index.revision, views), '');
  const marks = [
    `A client negotiates the newest revision it speaks at or below the server's. A column marked * negotiates an older one than ${code(index.revision)} and shows that revision: ${older.length ? older.map((s) => `${cellText(s.title)} (${code(s.revision)})`).join(', ') : 'none'}.`,
    !baseline && "A cell marked † comes from the client's record for this revision. Every other cell is the same as on the baseline.",
    unsplit.length && `${unsplit.map((s) => cellText(s.title)).join(', ')} ${unsplit.length === 1 ? 'has' : 'have'} one set of rows for every revision, not yet split.`,
    omitted.length && `${omitted.map((s) => cellText(s.title)).join(', ')} ${omitted.length === 1 ? 'speaks' : 'speak'} no revision at or below ${code(index.revision)} and ${omitted.length === 1 ? 'is' : 'are'} left out.`,
  ].filter(Boolean).join(' ');
  L.push(marks, '');
  L.push('A cell is the status the registry records, then the tiers it is known from: **R** read, **V** verified, **O** observed, **D** declared. ● full, ◐ partial, ◇ opt-in, ○ unsupported, · untested. An empty cell means nothing is recorded, which is not the same as unsupported.', '');
  L.push(`| Capability | Since | ${columns.map((s) => `[${cellText(s.title)}](${local(s.page, origin)})${s.revision < index.revision ? ' *' : ''}`).join(' | ')} |`);
  L.push(`|---|---|${columns.map(() => '---').join('|')}|`);
  for (const cap of index.capabilities) {
    const row = columns.map((s) => {
      const c = cap.subjects[s.id];
      if (!c) return '';
      return `${STATUS_MARK[c.status] ?? ''} ${c.tiers.map((t) => TIER_LETTER[t]).join('')}${c.revisionRecord ? ' †' : ''}`.trim();
    });
    L.push(`| ${link(cap)} | ${cap.lifecycle?.introducedIn ? code(cap.lifecycle.introducedIn) : ''} | ${row.join(' | ')} |`);
  }
  L.push('');
  if (others.length && baseline) {
    L.push('## Evidence without a registry entry', '');
    L.push('These have probe records or telemetry and no researched entry yet, so they are not columns above. They appear on the page of each capability they have evidence for.', '');
    L.push('| Project | Kind | Capabilities with evidence |', '|---|---|---|');
    for (const s of others) {
      const caps = index.capabilities.filter((c) => c.subjects[s.id]);
      L.push(`| [${cellText(s.title)}](${local(s.page, origin)}) | ${s.kind} | ${caps.map(link).join(', ')} |`);
    }
    L.push('');
  }
  L.push('## Data', '', `[${code('/data/capabilities/index.json')}](/data/capabilities/index.json) has this matrix as JSON${views.length > 1 ? ", with each older revision's statuses under `byRevision`" : ''}, and ${code('/data/capabilities/<slug>.json')} has one capability with its evidence. The MCP server's ${code('find_capability_support')} tool returns the same record.`, '');
  return L.join('\n');
}

/** The matrix as JSON, for /data/capabilities/index.json. */
export function indexJson(index, { origin, views = [index.revision], at = {} }) {
  return {
    baseline: index.revision,
    revisions: views,
    subjects: index.subjects,
    capabilities: index.capabilities.map((cap) => ({
      id: cap.id,
      slug: cap.slug,
      introducedIn: cap.lifecycle?.introducedIn ?? null,
      page: `${origin}${pageOf(cap)}`,
      data: `${origin}/data/capabilities/${cap.slug}.json`,
      statuses: Object.fromEntries(Object.values(cap.subjects).filter((s) => s.status !== undefined).map((s) => [s.subject, s.status])),
      tiers: Object.fromEntries(Object.values(cap.subjects).map((s) => [s.subject, s.tiers])),
      ...(views.length > 1 ? {
        byRevision: Object.fromEntries(views.slice(1).map((rev) => {
          const other = at[rev].capabilities.find((c) => c.id === cap.id);
          const cells = Object.values(other?.subjects ?? {}).filter((s) => s.status !== undefined);
          return [rev, {
            statuses: Object.fromEntries(cells.map((s) => [s.subject, s.status])),
            fromRecord: cells.filter((s) => s.revisionRecord).map((s) => s.subject),
          }];
        })),
      } : {}),
    })),
  };
}

/** One capability as JSON, for /data/capabilities/<slug>.json. */
export function capabilityJson(cap, index, { origin, at = {} }) {
  const subject = Object.fromEntries(index.subjects.map((s) => [s.id, s]));
  return {
    capability: cap.id,
    slug: cap.slug,
    page: `${origin}${pageOf(cap)}`,
    lifecycle: cap.lifecycle,
    parent: cap.parent,
    children: cap.children,
    // inheritsFrom names the parent whose evidence a client's row rests on. That evidence is on the parent's record.
    clients: Object.values(cap.subjects).map(({ subject: id, inheritedEvidence, ...rest }) => ({ id, title: subject[id].title, kind: subject[id].kind, page: subject[id].page, ...rest })),
    notRecorded: cap.notRecorded,
    research: cap.research,
    // Rows from a client's byProtocolVersion record for an older revision. Every other client's row holds on that revision too.
    byRevision: Object.fromEntries(Object.entries(recordCells(cap, at)).map(([rev, cells]) => [rev, cells.map(({ subject: id, inheritedEvidence, ...rest }) => ({ id, title: subject[id].title, kind: subject[id].kind, page: subject[id].page, ...rest }))])),
  };
}

/**
 * Renders the capability index as Markdown: one page per capability and the
 * matrix across clients. Paths are site paths, so build-site.js can check them.
 */

import { KIND_MEANING } from './kinds.js';

const STATUS_MARK = { full: '●', partial: '◐', unsupported: '○', untested: '·' };
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

/** The page for one capability. */
export function capabilityPage(cap, index, { origin, noteTitles }) {
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
      L.push(`| ${subjectLink(s.subject)} | ${subject[s.subject].kind} | ${STATUS_MARK[s.status] ?? ''} ${s.status} | ${s.tiers.length ? `${s.tiers.join(', ')}${from}` : 'no evidence recorded'} | ${revisions} | ${cellText(s.notes)} |`);
    }
    L.push('');
  } else {
    L.push('No registry entry records a status for it.', '');
  }
  if (cap.notRecorded.length) {
    L.push(`Not recorded for ${cap.notRecorded.map(subjectLink).join(', ')}. A missing record is not the same as unsupported.`, '');
  }
  L.push('Tiers are not ranked. `read` is a source read at a pinned commit, `verified` is a probe run, `observed` is telemetry, and `declared` is what the client or a curated list says. "Through" names the parent capability whose evidence a row rests on when it has none of its own.', '');

  const disagreeing = cells.filter((s) => s.disagreements.length);
  if (disagreeing.length) {
    L.push('## Where the tiers disagree', '');
    for (const s of disagreeing) {
      for (const e of s.disagreements) L.push(`- ${subjectLink(s.subject)} is recorded as ${s.status}. ${citation(e)}`);
    }
    L.push('');
  }

  if (probed.length) {
    // A protocol.* scenario is classified from the wire, and its records are listed on the client's page.
    const wire = cap.id.startsWith('protocol.');
    L.push('## Probe results', '', `The probe ran each client against a fixture server and recorded what the client sent to ${wire ? 'the server' : 'its model'}.`, '');
    L.push(`| Client | Kind | Versions | Runs | Revisions | ${wire ? 'What the client sent' : 'What reached the model'} |`, '|---|---|---|---|---|---|');
    for (const s of probed) {
      const v = s.verified;
      const verdicts = v.verdicts.slice(0, 4).map((x) => `${cellText(x.verdict)} (${x.count})`).join('; ') + (v.verdicts.length > 4 ? `; ${v.verdicts.length - 4} more` : '');
      L.push(`| [${subject[s.subject].title}](${local(wire ? subject[s.subject].page : v.records, origin)}) | ${subject[s.subject].kind} | ${v.clientVersions.map(code).join(', ')} | ${v.runs} | ${v.revisions.map(code).join(', ')} | ${verdicts} |`);
    }
    L.push('', 'The number after each verdict is how many runs ended that way. Each client name links to its full records.', '');
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
  if (cited.length) {
    L.push('## Evidence', '');
    for (const s of cited) {
      L.push(`${subjectLink(s.subject)}:`, '', ...s.evidence.map((e) => `- ${citation(e)}`), '');
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
export function matrixPage(index, { origin }) {
  const columns = index.subjects.filter((s) => s.registry);
  const others = index.subjects.filter((s) => !s.registry);
  const L = [];
  L.push('# Capabilities', '');
  L.push(`Which MCP clients support what. ${index.capabilities.length} capabilities down, the ${columns.length} clients with a registry entry across. Each capability links to a page with the evidence behind every cell.`, '');
  L.push('A cell is the status the registry records, then the tiers it is known from: **R** read, **V** verified, **O** observed, **D** declared. ● full, ◐ partial, ○ unsupported, · untested. An empty cell means nothing is recorded, which is not the same as unsupported.', '');
  L.push(`| Capability | Since | ${columns.map((s) => `[${cellText(s.title)}](${local(s.page, origin)})`).join(' | ')} |`);
  L.push(`|---|---|${columns.map(() => '---').join('|')}|`);
  for (const cap of index.capabilities) {
    const row = columns.map((s) => {
      const c = cap.subjects[s.id];
      if (!c) return '';
      return `${STATUS_MARK[c.status] ?? ''} ${c.tiers.map((t) => TIER_LETTER[t]).join('')}`.trim();
    });
    L.push(`| ${link(cap)} | ${cap.lifecycle?.introducedIn ? code(cap.lifecycle.introducedIn) : ''} | ${row.join(' | ')} |`);
  }
  L.push('');
  if (others.length) {
    L.push('## Evidence without a registry entry', '');
    L.push('These have probe records or telemetry and no researched entry yet, so they are not columns above. They appear on the page of each capability they have evidence for.', '');
    L.push('| Project | Kind | Capabilities with evidence |', '|---|---|---|');
    for (const s of others) {
      const caps = index.capabilities.filter((c) => c.subjects[s.id]);
      L.push(`| [${cellText(s.title)}](${local(s.page, origin)}) | ${s.kind} | ${caps.map(link).join(', ')} |`);
    }
    L.push('');
  }
  L.push('## Data', '', `[${code('/data/capabilities/index.json')}](/data/capabilities/index.json) has this matrix as JSON, and ${code('/data/capabilities/<slug>.json')} has one capability with its evidence. The MCP server's ${code('find_capability_support')} tool returns the same record.`, '');
  return L.join('\n');
}

/** The matrix as JSON, for /data/capabilities/index.json. */
export function indexJson(index, { origin }) {
  return {
    subjects: index.subjects,
    capabilities: index.capabilities.map((cap) => ({
      id: cap.id,
      slug: cap.slug,
      introducedIn: cap.lifecycle?.introducedIn ?? null,
      page: `${origin}${pageOf(cap)}`,
      data: `${origin}/data/capabilities/${cap.slug}.json`,
      statuses: Object.fromEntries(Object.values(cap.subjects).filter((s) => s.status !== undefined).map((s) => [s.subject, s.status])),
      tiers: Object.fromEntries(Object.values(cap.subjects).map((s) => [s.subject, s.tiers])),
    })),
  };
}

/** One capability as JSON, for /data/capabilities/<slug>.json. */
export function capabilityJson(cap, index, { origin }) {
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
  };
}

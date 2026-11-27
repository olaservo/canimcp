/**
 * Joins the four evidence sources by capability id: the registry entries, the
 * probe's verified overlays, the telemetry overlays and the lifecycle in
 * spec-versions.json. The site's capability pages, the JSON under
 * /data/capabilities and the MCP server's capability tools all read this.
 */

import { capabilityNodes, entryAt, extensionAliases, newestRevision, ownFields, recordedPerRevision } from './capabilities.js';
import { kindOf } from './kinds.js';

const TIER_ORDER = ['read', 'verified', 'observed', 'declared'];

export const capabilitySlug = (id) => id.replace(/[./]/g, '-');

/** Distinct values in first-seen order, without empties. */
const distinct = (list) => [...new Set(list.filter((v) => v !== undefined && v !== null && v !== ''))];

/**
 * @param {object} o
 * @param {[string, object][]} o.clients registry entries as [id, entry]
 * @param {object} o.spec spec-versions.json
 * @param {object[]} o.verified the overlays under data/verified
 * @param {object[]} o.observed the overlays under data/observed
 * @param {Record<string, object>} o.probeClients probe/registry/clients.json, for the kind and repo of a probed project with no entry
 * @param {Record<string, object>} [o.probeSdks] probe/registry/sdks.json, for an SDK whose own client is probed
 * @param {{id:string, fm:object}[]} o.notes research notes with their frontmatter
 * @param {string} o.origin
 * @param {string[]} [o.seed] capability ids to include even when no entry records them at this revision
 * @param {string} [o.revision] read each registry entry as a server whose newest revision is this one sees it (entryAt). Without it, the top level.
 */
export function buildCapabilityIndex({ clients, spec, verified, observed, probeClients, probeSdks = {}, notes, origin, revision, seed = [] }) {
  const baseline = spec.protocolVersions.find((v) => v.status === 'current').version;
  const aliases = extensionAliases(spec);
  const subjects = new Map();
  const capabilities = new Map();

  // A protocol.<key> id is a key of spec.protocol, which holds the lifecycle of protocol-wide features.
  const lifecycle = (id) => spec.capabilities[id] ?? (id.startsWith('protocol.') ? spec.protocol?.[id.slice('protocol.'.length)] : undefined) ?? null;
  const capability = (id) => {
    if (!capabilities.has(id)) capabilities.set(id, { id, slug: capabilitySlug(id), lifecycle: lifecycle(id), subjects: {} });
    return capabilities.get(id);
  };
  const cell = (capId, subjectId) => (capability(capId).subjects[subjectId] ??= { subject: subjectId });

  for (const id of [...Object.keys(spec.capabilities), ...seed]) capability(id);

  for (const [id, raw] of clients) {
    const at = revision ? entryAt(raw, revision) : { entry: raw, revision: newestRevision(raw), override: null };
    if (!at) continue;
    const { entry } = at;
    // Capabilities whose row comes from the entry's byProtocolVersion record for the negotiated revision.
    const fromRecord = new Set(at.override ? capabilityNodes(at.override, aliases).map((n) => n.id) : []);
    subjects.set(id, {
      id, title: entry.title, kind: kindOf(entry), registry: true, page: `${origin}/clients/${id}`,
      protocolVersions: raw.protocolVersions ?? [], revision: at.revision, recordedPerRevision: recordedPerRevision(raw, baseline),
    });
    const nodes = capabilityNodes(entry, aliases);
    const withEvidence = new Map(nodes.filter((n) => n.node.evidence?.length).map((n) => [n.id, n.node.evidence]));
    for (const { id: capId, node } of nodes) {
      const { status, notes: nodeNotes, evidence = [], research = [], ...rest } = ownFields(node);
      // A capability with no evidence of its own rests on its nearest parent's.
      let inheritsFrom = null;
      for (let p = capId; !evidence.length && p.includes('.') && !inheritsFrom;) {
        p = p.slice(0, p.lastIndexOf('.'));
        if (withEvidence.has(p)) inheritsFrom = p;
      }
      Object.assign(cell(capId, id), {
        status, ...(nodeNotes ? { notes: nodeNotes } : {}), evidence, research,
        ...(inheritsFrom ? { inheritsFrom, inheritedEvidence: withEvidence.get(inheritsFrom) } : {}),
        ...(fromRecord.has(capId) ? { revisionRecord: at.revision } : {}),
        ...(Object.keys(rest).length ? { fields: rest } : {}),
      });
    }
  }

  for (const overlay of verified) {
    const id = overlay.registryId ?? overlay.client;
    if (!subjects.has(id)) {
      if (clients.some(([k]) => k === id)) throw new Error(`data/verified/${overlay.client}.json: probe id collides with a registry id`);
      // An SDK's own client is probed too. It is the floor every client on that SDK starts from.
      const sdk = Object.values(probeSdks).find((s) => s.clientProbe === `hosts/${overlay.client}`);
      const probe = probeClients[overlay.client] ?? (sdk ? { kind: 'sdk', repo: sdk.repo } : {});
      subjects.set(id, {
        id, title: sdk ? `${sdk.title} client` : overlay.title, kind: probe.kind ?? 'host', registry: false,
        page: `${origin}/tool-results/${overlay.client}`, ...(probe.repo ? { repo: probe.repo } : {}),
      });
    }
    for (const [capId, cap] of Object.entries(overlay.capabilities)) {
      const runs = cap.evidence ?? [];
      if (!runs.length) continue;
      const verdicts = new Map();
      for (const e of runs) verdicts.set(e.note ?? '(no verdict)', (verdicts.get(e.note ?? '(no verdict)') ?? 0) + 1);
      // The image scenario records how the image reached the model. It varies by model API as well as by client.
      const image = new Map();
      for (const e of runs) {
        const o = e.observation;
        if (!o?.image) continue;
        const key = `${o.api ?? ''}|${o.image}`;
        const row = image.get(key) ?? { api: o.api ?? null, outcome: o.image, runs: 0, configs: [] };
        row.runs += 1;
        if (e.config && !row.configs.includes(e.config)) row.configs.push(e.config);
        image.set(key, row);
      }
      cell(capId, id).verified = {
        ...(image.size ? { image: [...image.values()].sort((a, b) => String(a.api).localeCompare(String(b.api)) || a.outcome.localeCompare(b.outcome)) } : {}),
        probeId: overlay.client,
        runs: runs.length,
        clientVersions: distinct(runs.map((e) => e.clientVersion)),
        revisions: distinct(runs.map((e) => e.at)).sort(),
        scenarios: distinct(runs.map((e) => e.scenario)),
        latest: runs.map((e) => e.date).filter(Boolean).sort().pop() ?? null,
        verdicts: [...verdicts].map(([verdict, count]) => ({ verdict, count })).sort((a, b) => b.count - a.count),
        records: `${origin}/tool-results/${overlay.client}`,
        data: `${origin}/data/verified/${overlay.client}.json`,
      };
    }
  }

  for (const overlay of observed) {
    for (const c of overlay.clients) {
      const id = c.registryId ?? c.id;
      if (!subjects.has(id)) subjects.set(id, { id, title: c.label ?? c.id, kind: 'host', registry: false, page: `${origin}/observed` });
      for (const [capId, cap] of Object.entries(c.capabilities ?? {})) {
        if (cap.evidence?.length) cell(capId, id).observed = cap.evidence;
      }
    }
  }

  const under = (a, b) => a === b || a.startsWith(`${b}.`);
  const out = [];
  for (const cap of capabilities.values()) {
    for (const s of Object.values(cap.subjects)) {
      s.tiers = TIER_ORDER.filter((t) => [...(s.evidence ?? []), ...(s.inheritedEvidence ?? [])].some((e) => e.tier === t)
        || (t === 'verified' && s.verified) || (t === 'observed' && s.observed));
      // An evidence item that names its own status and differs from the registry's.
      s.disagreements = [...(s.evidence ?? []), ...(s.observed ?? [])].filter((e) => s.status && e.status && e.status !== s.status);
    }
    cap.notRecorded = [...subjects.values()].filter((s) => s.registry && cap.subjects[s.id]?.status === undefined).map((s) => s.id);
    cap.research = notes.filter((n) => (n.fm.capabilities ?? []).some((c) => under(c, cap.id) || under(cap.id, c))).map((n) => n.id);
    const parts = cap.id.split('.');
    cap.parent = parts.length > 1 && capabilities.has(parts.slice(0, -1).join('.')) ? parts.slice(0, -1).join('.') : null;
    out.push(cap);
  }
  for (const cap of out) cap.children = out.filter((c) => c.parent === cap.id).map((c) => c.id);

  // Roots in the lifecycle's order, then what the registry tracks beyond the protocol. A capability sorts before its children.
  const roots = distinct(Object.keys(spec.capabilities).map((id) => id.split('.')[0]));
  const rank = (id) => {
    const i = roots.indexOf(id.split('.')[0]);
    return i === -1 ? roots.length : i;
  };
  out.sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));
  return { revision: revision ?? baseline, subjects: [...subjects.values()], capabilities: out };
}

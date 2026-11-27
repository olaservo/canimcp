// A read-only MCP server over the registry, at /mcp. Stateless: the SDK builds
// a fresh server per request and serves 2026-07-28 and the 2025 revisions.
// The data is the static JSON the site already publishes, read through ASSETS.
// The skills under skills/ are served with the SDK's skills extension.

import { McpServer, SUPPORTED_PROTOCOL_VERSIONS, createMcpHandler } from '@modelcontextprotocol/server';
import { SkillsExtension, memorySkillFiles } from '@modelcontextprotocol/server/ext/skills';
import * as z from 'zod';
import pkg from '../package.json';
import {
  capabilityNodes, effectiveRevision, entryAt, extensionAliases, ownFields, recordedPerRevision, revisionViews,
} from '../scripts/lib/capabilities.js';
import { SERVER, TOOLS } from './mcp-tools.js';

const ORIGIN = 'https://canimcp.io';
const REPO = 'https://github.com/olaservo/canimcp';
const CARD_TYPE = 'application/mcp-server-card+json';
const ICONS = [{ src: `${ORIGIN}${SERVER.icon.path}`, mimeType: SERVER.icon.mimeType, sizes: SERVER.icon.sizes }];
const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const HOUR = { ttlMs: 3_600_000, cacheScope: 'public' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Expose-Headers': '*',
};

// --- data -------------------------------------------------------------------

// Parsed files, kept for the life of the isolate. A deploy starts a new one.
const files = new Map();

function reader(assets) {
  return async (path, as = 'json') => {
    if (files.has(path)) return files.get(path);
    const res = await assets.fetch(new Request(`https://assets.invalid${path}`));
    const value = res.status === 200 ? await res[as]() : null;
    files.set(path, value);
    return value;
  };
}

const clientEntries = (registry) => Object.entries(registry).filter(([id]) => !id.startsWith('$'));
const under = (id, prefix) => id === prefix || id.startsWith(`${prefix}.`);

// --- results ----------------------------------------------------------------

// The same JSON goes in both fields, for clients that pass only one to the model.
const ok = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }], structuredContent: data });
const fail = (text) => ({ content: [{ type: 'text', text }], isError: true });

const str = z.string();
const nullable = (s) => s.nullable();
const loose = (shape) => z.looseObject(shape);
const capabilityShape = { status: str, notes: str.optional(), evidence: z.array(loose({ tier: str })).optional(), research: z.array(str).optional() };
const revisionArg = str.regex(/^\d{4}-\d{2}-\d{2}$/).optional()
  .describe('Protocol revision the server offers as its newest. Example: 2025-11-25. Each client answers on the newest revision it speaks at or below it. Leave it out for the baseline, the current revision.');

// --- server -----------------------------------------------------------------

function buildServer(read) {
  const server = new McpServer(
    { name: SERVER.name, title: SERVER.title, version: pkg.version, websiteUrl: ORIGIN, icons: ICONS },
    {
      instructions: SERVER.instructions,
      // The tools and skills are fixed per deploy, so nothing is ever announced as changed.
      capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
      cacheHints: { 'tools/list': HOUR, 'server/discover': HOUR },
    },
  );
  const tool = (name, config, handler) => {
    const { title, description } = TOOLS.find((t) => t.name === name);
    server.registerTool(name, { title, description, annotations: READ_ONLY, ...config }, handler);
  };

  const load = async () => {
    const [registry, spec] = await Promise.all([read('/data/clients.json'), read('/data/spec-versions.json')]);
    const clients = clientEntries(registry);
    return { clients, spec, aliases: extensionAliases(spec), views: revisionViews(clients, spec) };
  };
  const knownRevision = (spec, revision) => spec.protocolVersions.some((v) => v.version === revision && v.status !== 'draft');
  const badRevision = (spec, revision) => fail(`"${revision}" is not a protocol revision. Revisions: ${spec.protocolVersions.filter((v) => v.status !== 'draft').map((v) => v.version).join(', ')}.`);

  tool('list_clients', {
    inputSchema: z.object({}),
    outputSchema: z.object({
      clients: z.array(z.object({
        id: str, title: str, description: str, vendor: nullable(str), category: nullable(str),
        protocolVersions: z.array(str), preferredProtocolVersion: nullable(str), clientInfoNames: z.array(str),
        revisionRecords: z.array(str).describe('Older revisions with their own records, where some rows differ. get_client and find_capability_support take one as revision.'),
        recordedPerRevision: z.boolean().describe('False when one set of rows stands for every revision the client speaks, not yet split by revision.'),
        lastVerified: nullable(str), page: str,
      })),
    }),
  }, async () => {
    const { clients, views } = await load();
    return ok({
      clients: clients.map(([id, c]) => ({
        id, title: c.title, description: c.description, vendor: c.metadata?.vendor ?? null, category: c.category ?? null,
        protocolVersions: c.protocolVersions ?? [], preferredProtocolVersion: c.preferredProtocolVersion ?? null,
        clientInfoNames: c.clientInfoNames ?? [], revisionRecords: Object.keys(c.byProtocolVersion ?? {}).sort().reverse(),
        recordedPerRevision: recordedPerRevision(c, views[0]), lastVerified: c.metadata?.lastVerified ?? null, page: `${ORIGIN}/clients/${id}`,
      })),
    });
  });

  tool('get_client', {
    inputSchema: z.object({
      id: str.describe('Registry id of the client, from list_clients. Example: goose'),
      capability: str.optional().describe('Capability id to narrow to, with everything beneath it. Example: elicitation, or tools.result'),
      revision: revisionArg,
    }),
    outputSchema: z.object({
      id: str, title: str, page: str,
      revision: z.object({
        requested: str, negotiated: str,
        fromRecord: z.array(str).describe('Capability ids whose row comes from the client\'s record for the negotiated revision. Every other row is the same as on the baseline.'),
        recordedPerRevision: z.boolean().describe('False when one set of rows stands for every revision the client speaks, so the rows were not checked revision by revision.'),
      }).optional().describe('Present when a revision was given.'),
      entry: z.record(str, z.unknown()).optional().describe('The whole registry entry. Present when no capability was given.'),
      capabilities: z.array(loose({ id: str, ...capabilityShape })).optional().describe('The capability asked for and those beneath it.'),
    }),
  }, async ({ id, capability, revision }) => {
    const { clients, aliases, spec, views } = await load();
    const raw = clients.find(([k]) => k === id)?.[1];
    if (!raw) return fail(`No client with id "${id}". Known ids: ${clients.map(([k]) => k).join(', ')}.`);
    let entry = raw;
    let head = { id, title: raw.title, page: `${ORIGIN}/clients/${id}` };
    if (revision) {
      if (!knownRevision(spec, revision)) return badRevision(spec, revision);
      const at = entryAt(raw, revision);
      if (!at) return fail(`${raw.title} speaks no revision at or below ${revision}. It speaks ${(raw.protocolVersions ?? []).join(', ')}.`);
      entry = at.entry;
      head = {
        ...head,
        revision: {
          requested: revision, negotiated: at.revision,
          fromRecord: at.override ? capabilityNodes(at.override, aliases).map((n) => n.id) : [],
          recordedPerRevision: recordedPerRevision(raw, views[0]),
        },
      };
    }
    if (!capability) return ok({ ...head, entry });
    const nodes = capabilityNodes(entry, aliases);
    const hits = nodes.filter((n) => under(n.id, capability));
    if (!hits.length) return fail(`${entry.title} has no record for "${capability}". That is not the same as unsupported. It has: ${nodes.map((n) => n.id).join(', ')}.`);
    return ok({ ...head, capabilities: hits.map((n) => ({ id: n.id, ...ownFields(n.node) })) });
  });

  tool('list_capabilities', {
    inputSchema: z.object({ revision: revisionArg }),
    outputSchema: z.object({
      revision: str.describe('The revision the counts are for.'),
      clientCount: z.number().describe('How many clients with a registry entry speak a revision at or below it.'),
      capabilities: z.array(z.object({
        id: str,
        introducedIn: nullable(str).describe('The protocol revision that introduced it, or null when it is not a protocol feature.'),
        statuses: z.record(str, z.number()).describe('How many clients record each status. Clients with no record are not counted.'),
        page: str,
      })),
    }),
  }, async ({ revision }) => {
    const [index, spec] = await Promise.all([read('/data/capabilities/index.json'), read('/data/spec-versions.json')]);
    const rev = revision ?? index.baseline;
    if (!knownRevision(spec, rev)) return badRevision(spec, rev);
    const speaks = new Set(index.subjects.filter((s) => s.registry && effectiveRevision(s, rev)).map((s) => s.id));
    return ok({
      revision: rev,
      clientCount: speaks.size,
      capabilities: index.capabilities.map((c) => {
        const counts = {};
        const statuses = c.byRevision?.[rev]?.statuses ?? c.statuses;
        for (const [client, status] of Object.entries(statuses)) if (speaks.has(client)) counts[status] = (counts[status] ?? 0) + 1;
        return { id: c.id, introducedIn: c.introducedIn, statuses: counts, page: c.page };
      }),
    });
  });

  tool('find_capability_support', {
    inputSchema: z.object({
      capability: str.describe('Capability id, from list_capabilities. Example: elicitation.url'),
      revision: revisionArg,
    }),
    outputSchema: z.object({
      capability: str,
      revision: str.describe('The revision the registry rows are for.'),
      page: str,
      lifecycle: nullable(z.record(str, z.unknown())).describe('When the protocol introduced, changed, deprecated or removed it. Null when it is not a protocol feature.'),
      clients: z.array(loose({
        id: str, title: str, kind: str, page: str,
        status: str.optional().describe('The registry\'s status. Absent when the client has probe records or telemetry and no registry record.'),
        revision: str.optional().describe('The revision this client negotiates, the newest it speaks at or below the one asked for. Absent for clients with no registry entry.'),
        revisionRecord: str.optional().describe('Present when the row comes from the client\'s record for that revision and differs from the baseline.'),
        tiers: z.array(str).describe('The evidence tiers behind this client\'s row.'),
        verified: z.record(str, z.unknown()).optional().describe('A summary of the probe\'s runs: versions, revisions, and each verdict with its count. `configs` breaks them down by client configuration and its kind (default, setting, harness), with conformance check counts per revision.'),
        observed: z.array(loose({ tier: str })).optional().describe('What telemetry saw.'),
        disagreements: z.array(loose({ tier: str })).describe('Evidence whose own status differs from the registry\'s.'),
      })),
      notRecorded: z.array(str).describe('Registry clients whose entry says nothing about it. Not the same as unsupported.'),
      research: z.array(str).describe('Ids of research notes about it, for get_research_note.'),
    }),
  }, async ({ capability, revision }) => {
    const [index, spec] = await Promise.all([read('/data/capabilities/index.json'), read('/data/spec-versions.json')]);
    const rev = revision ?? index.baseline;
    if (!knownRevision(spec, rev)) return badRevision(spec, rev);
    const hit = index.capabilities.find((c) => c.id === capability);
    if (!hit) return fail(`No capability with id "${capability}". Call list_capabilities for the ids.`);
    const record = await read(`/data/capabilities/${hit.slug}.json`);
    const subjects = Object.fromEntries(index.subjects.map((s) => [s.id, s]));
    const negotiated = (id) => (subjects[id]?.registry ? effectiveRevision(subjects[id], rev) : undefined);
    // Registry rows from the client's record for this revision replace its baseline row. A client that speaks nothing at or below it drops out.
    const replaced = Object.fromEntries((record.byRevision?.[rev] ?? []).map((c) => [c.id, c]));
    const rows = record.clients.filter((c) => negotiated(c.id) !== null).map((c) => {
      const r = replaced[c.id];
      const base = r ? { ...c, status: r.status, notes: r.notes, evidence: r.evidence, research: r.research, tiers: r.tiers, revisionRecord: r.revisionRecord } : c;
      return negotiated(c.id) ? { ...base, revision: negotiated(c.id) } : base;
    });
    for (const r of Object.values(replaced)) if (!rows.some((c) => c.id === r.id)) rows.push({ ...r, revision: negotiated(r.id) });
    return ok({
      capability: record.capability, revision: rev, page: record.page, lifecycle: record.lifecycle, clients: rows,
      notRecorded: record.notRecorded.filter((id) => negotiated(id) && !replaced[id]), research: record.research,
    });
  });

  tool('get_probe_results', {
    inputSchema: z.object({
      client: str.describe('Probe id or registry id of the client. Example: codex, or openai-codex'),
      capability: str.optional().describe('Capability id to narrow to. Example: tools.result.structuredContent'),
      configKind: z.enum(['default', 'setting', 'harness']).optional().describe('Only runs with this kind of configuration: default for stock settings, setting for a documented switch, harness for probe-written code that uses an API the client leaves to the application.'),
      config: str.optional().describe('Only runs with this configuration name. Example: default'),
      revision: str.optional().describe('Only runs at this protocol revision. Example: 2026-07-28'),
      source: z.enum(['probe', 'conformance']).optional().describe('probe for the canimcp probe scenarios, conformance for the MCP conformance suite.'),
    }),
    outputSchema: z.object({
      client: str, registryId: nullable(str), title: str, versions: z.array(str), page: nullable(str),
      results: z.array(z.object({
        capability: str, scenario: nullable(str), clientVersion: nullable(str),
        config: nullable(str).describe('The model API or client configuration the run used.'),
        configKind: nullable(str).describe('default, setting or harness.'),
        source: str.describe('probe or conformance.'),
        status: nullable(str).describe('Conformance only: full when every check passed, partial when one failed, null when no check that needs the feature passed.'),
        checks: nullable(z.object({ passed: z.number(), total: z.number() })).describe('Conformance only: the scenario\'s checks for this capability.'),
        revision: nullable(str).describe('The protocol revision negotiated.'),
        date: nullable(str),
        verdict: nullable(str).describe('What reached the model, in one line.'),
        modelApi: nullable(str).describe('The model API the client was talking to: anthropic, chat, responses or gemini. Null when the run had no model call.'),
        image: nullable(str).describe('The image scenario only: image-part when the image reached the model as an image, base64-text when its data was pasted into text, absent when it was dropped. Null for other scenarios.'),
        captures: nullable(str).describe('The run\'s captures in the repository.'),
      })),
    }),
  }, async ({ client, capability, configKind, config, revision, source }) => {
    const index = await read('/data/verified/index.json');
    const row = index.find((v) => v.client === client) ?? index.find((v) => v.registryId === client);
    if (!row) return fail(`No probe records for "${client}". Probe ids: ${index.map((v) => v.client).join(', ')}.`);
    const overlay = await read(`/data/verified/${row.client}.json`);
    const results = [];
    for (const [id, cap] of Object.entries(overlay.capabilities)) {
      if (capability && !under(id, capability)) continue;
      for (const e of cap.evidence ?? []) {
        const from = e.source === 'modelcontextprotocol/conformance' ? 'conformance' : 'probe';
        if ((configKind && e.configKind !== configKind) || (config && e.config !== config) || (revision && e.at !== revision) || (source && from !== source)) continue;
        const checks = e.run?.checks;
        results.push({
          capability: id, scenario: e.scenario ?? null, clientVersion: e.clientVersion ?? null, config: e.config ?? null,
          configKind: e.configKind ?? null, source: from, status: from === 'conformance' ? e.status ?? null : null,
          checks: from === 'conformance' && checks ? { passed: checks.filter((c) => c.status === 'SUCCESS').length, total: checks.length } : null,
          revision: e.at ?? null, date: e.date ?? null, verdict: e.note ?? null,
          modelApi: e.observation?.api ?? null, image: e.observation?.image ?? null,
          captures: e.artifact ? `${REPO}/tree/main/${e.artifact}` : null,
        });
      }
    }
    if (capability && !results.length && !(configKind || config || revision || source)) return fail(`No probe records for "${capability}" on ${row.title}. It has: ${Object.keys(overlay.capabilities).join(', ')}.`);
    return ok({ client: row.client, registryId: row.registryId, title: row.title, versions: row.versions, page: row.page ?? null, results });
  });

  tool('search_research_notes', {
    inputSchema: z.object({
      query: str.optional().describe('Keywords matched against note ids, titles and summaries. Example: session recovery'),
      client: str.optional().describe('Registry id of a client, to list only its notes. Example: opencode'),
      capability: str.optional().describe('Capability id, to list only notes about it. Example: roots.listChanged'),
    }),
    outputSchema: z.object({
      notes: z.array(z.object({
        id: str, title: str, kind: str, status: str, summary: str, clients: z.array(str), capabilities: z.array(str),
        lastVerified: nullable(str), page: str,
      })),
    }),
  }, async ({ query, client, capability }) => {
    const index = await read('/data/research/index.json');
    const words = (query ?? '').toLowerCase().split(/[^a-z0-9./_-]+/).filter((w) => w.length > 1);
    const scored = [];
    for (const n of index) {
      if (client && !n.clients.includes(client)) continue;
      if (capability && !n.capabilities.some((c) => under(c, capability) || under(capability, c))) continue;
      const text = { title: n.title.toLowerCase(), id: n.id, summary: n.summary.toLowerCase() };
      const score = words.reduce((s, w) => s + (text.title.includes(w) ? 3 : 0) + (text.id.includes(w) ? 2 : 0) + (text.summary.includes(w) ? 1 : 0), 0);
      if (words.length && !score) continue;
      scored.push({ score, note: n });
    }
    scored.sort((a, b) => b.score - a.score);
    return ok({
      notes: scored.map(({ note: n }) => ({
        id: n.id, title: n.title, kind: n.kind, status: n.status, summary: n.summary, clients: n.clients,
        capabilities: n.capabilities, lastVerified: n.lastVerified, page: n.page,
      })),
    });
  });

  tool('get_research_note', {
    inputSchema: z.object({
      id: str.regex(/^[a-z0-9-]+$/).describe('Note id, from search_research_notes. Example: fast-agent-never-sends-roots-list-changed'),
    }),
  }, async ({ id }) => {
    const index = await read('/data/research/index.json');
    if (!index.some((n) => n.id === id)) return fail(`No research note with id "${id}". Call search_research_notes for the ids.`);
    return { content: [{ type: 'text', text: await read(`/research/${id}.md`, 'text') }] };
  });

  return server;
}

// --- HTTP -------------------------------------------------------------------

/** The server card of the MCP server card extension, served at /mcp/server-card. */
async function serverCard(request) {
  const body = `${JSON.stringify({
    $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
    name: SERVER.name,
    version: pkg.version,
    title: SERVER.title,
    description: SERVER.description,
    websiteUrl: ORIGIN,
    icons: ICONS,
    repository: { source: 'github', url: REPO },
    remotes: [{
      type: 'streamable-http',
      url: `${ORIGIN}${SERVER.path}`,
      supportedProtocolVersions: [...SERVER.modernVersions, ...SUPPORTED_PROTOCOL_VERSIONS],
    }],
  }, null, 2)}\n`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  const etag = `"${[...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('')}"`;
  const headers = { ...CORS, 'Content-Type': CARD_TYPE, 'Cache-Control': 'public, max-age=3600', ETag: etag };
  if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });
  return new Response(request.method === 'HEAD' ? null : body, { headers });
}

let read;
let handler;
// The skills catalog (SEP-2640), built once per isolate from the bundle the site build writes.
let skills;

async function serverWithSkills() {
  skills ??= await SkillsExtension.load(memorySkillFiles(await read(SERVER.skillsBundle)), { cacheHint: HOUR });
  const server = buildServer(read);
  skills.attach(server);
  return server;
}

/** Serves /mcp and /mcp/server-card. */
export async function handleMcp(request, env, url) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (url.pathname === SERVER.cardPath) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405, headers: { ...CORS, Allow: 'GET, HEAD, OPTIONS' } });
    return serverCard(request);
  }
  read = reader(env.ASSETS);
  handler ??= createMcpHandler(serverWithSkills);
  const response = await handler.fetch(request);
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

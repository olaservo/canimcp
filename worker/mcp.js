// A read-only MCP server over the registry, at /mcp. Stateless: the SDK builds
// a fresh server per request and serves 2026-07-28 and the 2025 revisions.
// The data is the static JSON the site already publishes, read through ASSETS.
// The skills under skills/ are served with the SDK's skills extension.

import { McpServer, SUPPORTED_PROTOCOL_VERSIONS, createMcpHandler } from '@modelcontextprotocol/server';
import { SkillsExtension, memorySkillFiles } from '@modelcontextprotocol/server/ext/skills';
import * as z from 'zod';
import pkg from '../package.json';
import { capabilityNodes, extensionAliases, ownFields } from '../scripts/lib/capabilities.js';
import { SERVER, TOOLS } from './mcp-tools.js';

const ORIGIN = 'https://canimcp.io';
const REPO = 'https://github.com/olaservo/canimcp';
const CARD_TYPE = 'application/mcp-server-card+json';
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

// --- server -----------------------------------------------------------------

function buildServer(read) {
  const server = new McpServer(
    { name: SERVER.name, title: SERVER.title, version: pkg.version, websiteUrl: ORIGIN },
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
    return { clients: clientEntries(registry), spec, aliases: extensionAliases(spec) };
  };

  tool('list_clients', {
    inputSchema: z.object({}),
    outputSchema: z.object({
      clients: z.array(z.object({
        id: str, title: str, description: str, vendor: nullable(str), category: nullable(str),
        protocolVersions: z.array(str), preferredProtocolVersion: nullable(str), clientInfoNames: z.array(str),
        lastVerified: nullable(str), page: str,
      })),
    }),
  }, async () => {
    const { clients } = await load();
    return ok({
      clients: clients.map(([id, c]) => ({
        id, title: c.title, description: c.description, vendor: c.metadata?.vendor ?? null, category: c.category ?? null,
        protocolVersions: c.protocolVersions ?? [], preferredProtocolVersion: c.preferredProtocolVersion ?? null,
        clientInfoNames: c.clientInfoNames ?? [], lastVerified: c.metadata?.lastVerified ?? null, page: `${ORIGIN}/clients/${id}`,
      })),
    });
  });

  tool('get_client', {
    inputSchema: z.object({
      id: str.describe('Registry id of the client, from list_clients. Example: goose'),
      capability: str.optional().describe('Capability id to narrow to, with everything beneath it. Example: elicitation, or tools.result'),
    }),
    outputSchema: z.object({
      id: str, title: str, page: str,
      entry: z.record(str, z.unknown()).optional().describe('The whole registry entry. Present when no capability was given.'),
      capabilities: z.array(loose({ id: str, ...capabilityShape })).optional().describe('The capability asked for and those beneath it.'),
    }),
  }, async ({ id, capability }) => {
    const { clients, aliases } = await load();
    const entry = clients.find(([k]) => k === id)?.[1];
    if (!entry) return fail(`No client with id "${id}". Known ids: ${clients.map(([k]) => k).join(', ')}.`);
    const head = { id, title: entry.title, page: `${ORIGIN}/clients/${id}` };
    if (!capability) return ok({ ...head, entry });
    const nodes = capabilityNodes(entry, aliases);
    const hits = nodes.filter((n) => under(n.id, capability));
    if (!hits.length) return fail(`${entry.title} has no record for "${capability}". That is not the same as unsupported. It has: ${nodes.map((n) => n.id).join(', ')}.`);
    return ok({ ...head, capabilities: hits.map((n) => ({ id: n.id, ...ownFields(n.node) })) });
  });

  tool('list_capabilities', {
    inputSchema: z.object({}),
    outputSchema: z.object({
      clientCount: z.number(),
      capabilities: z.array(z.object({
        id: str,
        introducedIn: nullable(str).describe('The protocol revision that introduced it, or null when it is not a protocol feature.'),
        statuses: z.record(str, z.number()).describe('How many clients record each status. Clients with no record are not counted.'),
      })),
    }),
  }, async () => {
    const { clients, spec, aliases } = await load();
    const statuses = new Map(Object.keys(spec.capabilities).map((id) => [id, {}]));
    for (const [, entry] of clients) {
      for (const { id, node } of capabilityNodes(entry, aliases)) {
        const counts = statuses.get(id) ?? {};
        counts[node.status] = (counts[node.status] ?? 0) + 1;
        statuses.set(id, counts);
      }
    }
    return ok({
      clientCount: clients.length,
      capabilities: [...statuses].map(([id, counts]) => ({ id, introducedIn: spec.capabilities[id]?.introducedIn ?? null, statuses: counts })),
    });
  });

  tool('find_capability_support', {
    inputSchema: z.object({
      capability: str.describe('Capability id, from list_capabilities. Example: elicitation.url'),
    }),
    outputSchema: z.object({
      capability: str,
      lifecycle: nullable(z.record(str, z.unknown())).describe('When the protocol introduced, changed, deprecated or removed it. Null when it is not a protocol feature.'),
      clients: z.array(loose({ id: str, title: str, page: str, ...capabilityShape })),
      notRecorded: z.array(str).describe('Clients whose entry says nothing about it. Not the same as unsupported.'),
    }),
  }, async ({ capability }) => {
    const { clients, spec, aliases } = await load();
    const found = [];
    const notRecorded = [];
    for (const [id, entry] of clients) {
      const hit = capabilityNodes(entry, aliases).find((n) => n.id === capability);
      if (hit) found.push({ id, title: entry.title, page: `${ORIGIN}/clients/${id}`, ...ownFields(hit.node) });
      else notRecorded.push(id);
    }
    const lifecycle = spec.capabilities[capability] ?? null;
    if (!found.length && !lifecycle) return fail(`No capability with id "${capability}". Call list_capabilities for the ids.`);
    return ok({ capability, lifecycle, clients: found, notRecorded });
  });

  tool('get_probe_results', {
    inputSchema: z.object({
      client: str.describe('Probe id or registry id of the client. Example: codex, or openai-codex'),
      capability: str.optional().describe('Capability id to narrow to. Example: tools.result.structuredContent'),
    }),
    outputSchema: z.object({
      client: str, registryId: nullable(str), title: str, versions: z.array(str), page: nullable(str),
      results: z.array(z.object({
        capability: str, scenario: nullable(str), clientVersion: nullable(str),
        config: nullable(str).describe('The model API or client configuration the run used.'),
        revision: nullable(str).describe('The protocol revision negotiated.'),
        date: nullable(str),
        verdict: nullable(str).describe('What reached the model, in one line.'),
        captures: nullable(str).describe('The run\'s captures in the repository.'),
      })),
    }),
  }, async ({ client, capability }) => {
    const index = await read('/data/verified/index.json');
    const row = index.find((v) => v.client === client) ?? index.find((v) => v.registryId === client);
    if (!row) return fail(`No probe records for "${client}". Probe ids: ${index.map((v) => v.client).join(', ')}.`);
    const overlay = await read(`/data/verified/${row.client}.json`);
    const results = [];
    for (const [id, cap] of Object.entries(overlay.capabilities)) {
      if (capability && !under(id, capability)) continue;
      for (const e of cap.evidence ?? []) {
        results.push({
          capability: id, scenario: e.scenario ?? null, clientVersion: e.clientVersion ?? null, config: e.config ?? null,
          revision: e.at ?? null, date: e.date ?? null, verdict: e.note ?? null,
          captures: e.artifact ? `${REPO}/tree/main/${e.artifact}` : null,
        });
      }
    }
    if (capability && !results.length) return fail(`No probe records for "${capability}" on ${row.title}. It has: ${Object.keys(overlay.capabilities).join(', ')}.`);
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

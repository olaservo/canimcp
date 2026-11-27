/**
 * Describes the static JSON under /data as an API. One list of operations
 * yields the OpenAPI document, the RFC 9727 API catalog, the ARD catalog and
 * the Markdown for the /api page. The MCP server's entry in the catalog and
 * its section of the page come from worker/mcp-tools.js.
 */

import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/server';
import { SERVER, TOOLS } from '../../worker/mcp-tools.js';

export const OPENAPI_TYPE = 'application/vnd.oai.openapi+json;version=3.1';
export const API_CATALOG_TYPE = 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

/**
 * @param {object} o
 * @param {string} o.origin
 * @param {string} o.repo
 * @param {string} o.version
 * @param {string} o.tagline
 * @param {{id:string,title:string}[]} o.clients registry entries
 * @param {{client:string,title:string}[]} o.verified clients with probe records
 * @param {{name:string,description:string,uri:string,url:string}[]} o.skills the Agent Skills under skills/
 */
export function buildApiFiles({ origin, repo, version, tagline, clients, verified, skills, capabilitySlugs }) {
  const schema = (name) => ({ $ref: `${origin}/schemas/${name}` });
  const uri = { type: 'string', format: 'uri' };
  const str = { type: 'string' };
  const object = { type: 'object', additionalProperties: true };

  const pathParam = (name, description, values) => ({
    name, in: 'path', required: true, description, schema: { type: 'string', enum: values }, example: values[0],
  });

  const operations = [
    {
      id: 'listClients',
      path: '/data/clients/index.json',
      tag: 'registry',
      summary: 'List the clients in the registry',
      description: 'Every client with a researched registry entry: its id, title, one-paragraph description, and the URLs of its JSON entry and its page. Start here to find a client id.',
      returns: 'The id, title and description of every client in the registry',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'title', 'description', 'data', 'page'],
          properties: {
            id: { ...str, description: 'Registry id, used in /data/clients/{id}.json.' },
            title: str,
            description: str,
            data: { ...uri, description: 'The client\'s registry entry as JSON.' },
            page: { ...uri, description: 'The client\'s page. Append .md for Markdown.' },
          },
        },
      },
    },
    {
      id: 'getClient',
      path: '/data/clients/{id}.json',
      tag: 'registry',
      summary: 'Get one client\'s registry entry',
      description: 'One client\'s capabilities. Each capability carries a status and an evidence list, and each evidence item has a tier (declared, verified, observed or read) and the protocol revision it applies to.',
      returns: 'One client\'s capabilities with the evidence for each',
      parameters: [pathParam('id', 'Registry id of the client, from listClients.', clients.map((c) => c.id))],
      schema: {
        type: 'object',
        required: ['id', 'schema', 'entry'],
        properties: {
          id: str,
          schema: { ...uri, description: 'The JSON Schema definition that `entry` follows.' },
          entry: schema('client-registry.json#/$defs/ClientEntry'),
        },
      },
    },
    {
      id: 'getRegistry',
      path: '/data/clients.json',
      tag: 'registry',
      summary: 'Get the whole registry',
      description: 'Every client entry in one object keyed by registry id. About 200 KB. Use getClient when one client is enough.',
      returns: 'Every client entry in one file, keyed by id',
      schema: schema('client-registry.json'),
    },
    {
      id: 'getSpecVersions',
      path: '/data/spec-versions.json',
      tag: 'registry',
      summary: 'Get the capability lifecycle across protocol revisions',
      description: 'For each MCP capability and protocol-level feature, the revision that introduced it and the revisions that changed, deprecated or removed it. This describes the protocol and is the same for every client.',
      returns: 'When each capability was introduced, changed, deprecated or removed',
      schema: {
        type: 'object',
        required: ['protocolVersions', 'capabilities'],
        properties: {
          title: str,
          description: str,
          lastUpdated: { type: 'string', format: 'date' },
          capabilityIdScheme: str,
          sources: { type: 'array', items: uri },
          protocolVersions: {
            type: 'array',
            items: { type: 'object', required: ['version', 'status'], properties: { version: str, status: str, label: str } },
          },
          lifecycleStates: { type: 'object', additionalProperties: str },
          capabilities: { ...object, description: 'Keyed by capability id.' },
          protocol: object,
          jsonSchemaDialect: object,
          extensions: object,
          bonusFeatures: object,
        },
      },
    },
    {
      id: 'listVerifiedClients',
      path: '/data/verified/index.json',
      tag: 'evidence',
      summary: 'List the clients the probe has run',
      description: 'Every client with probe records, including clients that have no registry entry. `registryId` is null for those.',
      returns: 'The clients that have probe records, and the versions run',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['client', 'registryId', 'title', 'versions', 'data'],
          properties: {
            client: { ...str, description: 'Probe id, used in /data/verified/{client}.json.' },
            registryId: { type: ['string', 'null'], description: 'The client\'s registry id, or null when it has no registry entry.' },
            title: str,
            versions: { type: 'array', items: str, description: 'Client versions the probe ran.' },
            data: uri,
            page: uri,
          },
        },
      },
    },
    {
      id: 'getVerifiedRecords',
      path: '/data/verified/{client}.json',
      tag: 'evidence',
      summary: 'Get the probe\'s records for one client',
      description: 'Verified-tier evidence keyed by capability id. Each record names the scenario, the client version, the protocol revision, and what the client sent to the model. Files run from 40 KB to 450 KB.',
      returns: 'What the probe recorded for one client, keyed by capability',
      parameters: [pathParam('client', 'Probe id of the client, from listVerifiedClients.', verified.map((v) => v.client))],
      schema: schema('verified-evidence.json'),
    },
    {
      id: 'getObservedTelemetry',
      path: '/data/observed/hf-mcp-clients.json',
      tag: 'evidence',
      summary: 'Get the observed-tier telemetry',
      description: 'Capabilities clients declared in real traffic, by client name and protocol revision, derived from the Hugging Face dataset evalstate/mcp-clients at the revision recorded in the file. The `policy` block states the rules behind every flag.',
      returns: 'Capabilities seen in real traffic, by client and revision',
      schema: schema('observed-evidence.json'),
    },
    {
      id: 'listCapabilities',
      path: '/data/capabilities/index.json',
      tag: 'capabilities',
      summary: 'Get the capability matrix',
      description: 'Every capability with the status each client records for it and the evidence tiers behind each cell, on the baseline revision. `byRevision` has the statuses on each older revision that some client has its own records for. `subjects` lists the clients, including those that have probe records or telemetry and no registry entry. Start here to find a capability slug.',
      returns: 'Every capability, with each client\'s status and evidence tiers',
      schema: {
        type: 'object',
        required: ['baseline', 'revisions', 'subjects', 'capabilities'],
        properties: {
          baseline: { ...str, description: 'The protocol revision `statuses` describes: the current one.' },
          revisions: { type: 'array', items: str, description: 'The baseline, then each older revision with per-revision records, newest first.' },
          subjects: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'title', 'kind', 'registry', 'page'],
              properties: {
                id: str,
                title: str,
                kind: { ...str, enum: ['host', 'framework', 'adapter', 'sdk'] },
                registry: { type: 'boolean', description: 'True when the client has a researched registry entry.' },
                page: uri,
                repo: uri,
                protocolVersions: { type: 'array', items: str, description: 'Registry clients only. The revisions the client speaks.' },
                revision: { ...str, description: 'Registry clients only. The revision its rows describe on the baseline: the baseline, or the newest it speaks when it cannot negotiate the baseline.' },
                recordedPerRevision: { type: 'boolean', description: 'Registry clients only. False when one set of rows stands for every revision it speaks.' },
              },
            },
          },
          capabilities: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'slug', 'introducedIn', 'page', 'data', 'statuses', 'tiers'],
              properties: {
                id: { ...str, description: 'Capability id, a dotted path such as elicitation.url.' },
                slug: { ...str, description: 'The id with dots and slashes as hyphens, used in /data/capabilities/{slug}.json.' },
                introducedIn: { type: ['string', 'null'], description: 'The protocol revision that introduced it, or null when it is not a protocol feature.' },
                page: uri,
                data: uri,
                statuses: { type: 'object', additionalProperties: str, description: 'Client id to status. A client with no status recorded is absent.' },
                tiers: { type: 'object', additionalProperties: { type: 'array', items: str }, description: 'Client id to the evidence tiers behind it.' },
                byRevision: {
                  type: 'object',
                  description: 'Keyed by older revision. A client negotiates the newest revision it speaks at or below that one.',
                  additionalProperties: {
                    type: 'object',
                    properties: {
                      statuses: { type: 'object', additionalProperties: str, description: 'Client id to status on that revision.' },
                      fromRecord: { type: 'array', items: str, description: 'Clients whose status comes from their own record for that revision.' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: 'getCapability',
      path: '/data/capabilities/{slug}.json',
      tag: 'capabilities',
      summary: 'Get one capability across clients',
      description: 'Answers "which clients support X". For one capability: each client\'s status, notes and evidence from the registry, a summary of the probe\'s runs, what telemetry observed, where the tiers disagree, the clients with no record, the protocol lifecycle and the research notes about it.',
      returns: 'One capability with every client\'s status and evidence',
      parameters: [pathParam('slug', 'Capability slug, from listCapabilities.', capabilitySlugs)],
      schema: {
        type: 'object',
        required: ['capability', 'slug', 'page', 'lifecycle', 'clients', 'notRecorded', 'research'],
        properties: {
          capability: str,
          slug: str,
          page: uri,
          lifecycle: { type: ['object', 'null'], additionalProperties: true },
          parent: { type: ['string', 'null'] },
          children: { type: 'array', items: str },
          clients: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'title', 'kind', 'page', 'tiers', 'disagreements'],
              properties: {
                id: str,
                title: str,
                kind: str,
                page: uri,
                status: { ...str, description: 'The registry\'s status. Absent when the client has evidence and no registry record.' },
                notes: str,
                evidence: { type: 'array', items: object, description: 'Evidence items from the registry entry.' },
                research: { type: 'array', items: str },
                verified: { ...object, description: 'A summary of the probe\'s runs: versions, revisions and each verdict with its count.' },
                observed: { type: 'array', items: object, description: 'Evidence items from telemetry.' },
                tiers: { type: 'array', items: str },
                disagreements: { type: 'array', items: object, description: 'Evidence items whose own status differs from the registry\'s.' },
              },
            },
          },
          notRecorded: { type: 'array', items: str, description: 'Registry clients with no record. Not the same as unsupported.' },
          research: { type: 'array', items: str, description: 'Research note ids.' },
          byRevision: { type: 'object', additionalProperties: { type: 'array', items: object }, description: 'Keyed by older revision: the rows that come from a client\'s own record for that revision, shaped like `clients`. Every other client\'s row holds on that revision too.' },
        },
      },
    },
    {
      id: 'listResearchNotes',
      path: '/data/research/index.json',
      tag: 'research',
      summary: 'List the research notes',
      description: 'Every research note with its kind, status, one-paragraph summary, and the clients and capabilities it covers. The note itself is Markdown at the `markdown` URL.',
      returns: 'The id, title and summary of every research note',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'title', 'kind', 'status', 'summary', 'clients', 'capabilities', 'page', 'markdown'],
          properties: {
            id: str,
            title: str,
            kind: { ...str, description: 'nuance, gap, misconception, idiosyncrasy or in-flight.' },
            status: str,
            summary: str,
            clients: { type: 'array', items: str, description: 'Registry ids.' },
            capabilities: { type: 'array', items: str, description: 'Capability ids.' },
            specVersions: { type: 'array', items: str },
            lastVerified: { type: ['string', 'null'] },
            page: uri,
            markdown: { ...uri, description: 'The note as Markdown.' },
          },
        },
      },
    },
  ];

  const notFound = { $ref: '#/components/responses/NotFound' };
  const paths = {};
  for (const op of operations) {
    paths[op.path] = {
      get: {
        operationId: op.id,
        tags: [op.tag],
        summary: op.summary,
        description: op.description,
        ...(op.parameters ? { parameters: op.parameters } : {}),
        responses: {
          200: { description: op.returns, content: { 'application/json': { schema: op.schema } } },
          ...(op.parameters ? { 404: notFound } : {}),
          default: { $ref: '#/components/responses/Problem' },
        },
      },
    };
  }

  const problemExample = {
    type: 'about:blank',
    title: 'Not Found',
    status: 404,
    code: 'not_found',
    detail: `No file at /data/clients/nope.json. ${origin}/openapi.json lists the paths that exist.`,
    instance: '/data/clients/nope.json',
  };

  const versioning = 'The paths are unversioned. `info.version` in the OpenAPI document changes when a path or a response shape does. Each data file names its JSON Schema in `$schema`, and the schemas are served at their `$id`. New fields can appear at any time. There is no deprecation schedule: a removed or renamed field is a change to the schema and is in the repository history.';

  const openapi = {
    openapi: '3.1.0',
    info: {
      title: 'canimcp data API',
      version,
      summary: 'MCP client capabilities with the evidence for each claim, as static JSON.',
      description: `${tagline}\n\nEvery operation is a GET that returns a static JSON file. Nothing needs authentication or an API key, and every response allows cross-origin requests.\n\n${versioning}`,
      contact: { name: 'canimcp', url: `${repo}/issues` },
      license: { name: 'CC BY 4.0', identifier: 'CC-BY-4.0' },
    },
    externalDocs: { description: 'Data API', url: `${origin}/api` },
    servers: [{ url: origin }],
    security: [],
    tags: [
      { name: 'registry', description: 'Client entries and the capability lifecycle.' },
      { name: 'evidence', description: 'The probe\'s records and the telemetry feed.' },
      { name: 'capabilities', description: 'The four evidence sources joined by capability.' },
      { name: 'research', description: 'Notes on behaviour a status cannot express.' },
    ],
    paths,
    components: {
      responses: {
        NotFound: {
          description: 'No file at this path.',
          content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem' }, example: problemExample } },
        },
        Problem: {
          description: 'Any other error. A method other than GET, HEAD or OPTIONS returns 405.',
          content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem' } } },
        },
      },
      schemas: {
        Problem: {
          type: 'object',
          description: 'An RFC 9457 problem document.',
          required: ['type', 'title', 'status', 'code'],
          properties: {
            type: { ...str, description: 'Always about:blank.' },
            title: str,
            status: { type: 'integer' },
            code: { ...str, description: 'Machine-readable error code.', enum: ['not_found', 'method_not_allowed'] },
            detail: str,
            instance: { ...str, description: 'The path requested.' },
          },
        },
      },
    },
  };

  const desc = { href: `${origin}/openapi.json`, type: OPENAPI_TYPE, title: 'canimcp data API, OpenAPI 3.1' };
  const apiCatalog = {
    linkset: [{
      anchor: `${origin}/`,
      item: [desc],
      'service-desc': [desc],
      'service-doc': [{ href: `${origin}/api`, type: 'text/html', title: 'Data API' }],
      'service-meta': [{ href: `${origin}/llms.txt`, type: 'text/plain', title: 'llms.txt' }],
    }],
  };

  const host = new URL(origin).hostname;
  const mcpUrl = `${origin}${SERVER.path}`;
  const mcpVersions = [...SERVER.modernVersions, ...SUPPORTED_PROTOCOL_VERSIONS];
  const ard = {
    specVersion: '1.0',
    host: { displayName: 'canimcp', documentationUrl: `${origin}/about` },
    entries: [{
      identifier: `urn:air:${host}:mcp:registry`,
      displayName: 'canimcp MCP server',
      type: 'application/mcp-server-card+json',
      url: `${origin}${SERVER.cardPath}`,
      description: SERVER.description,
      version,
      tags: ['mcp', 'model-context-protocol', 'mcp-clients', 'capabilities', 'mcp-server'],
      capabilities: TOOLS.map((t) => t.name),
      representativeQueries: [
        'which MCP clients support elicitation',
        'does this MCP client pass structuredContent to the model',
        'what does the probe show for this client\'s tool results',
        'are there known gaps in this client\'s MCP support',
      ],
    }, {
      identifier: `urn:air:${host}:api:registry`,
      displayName: 'canimcp data API',
      type: OPENAPI_TYPE,
      url: `${origin}/openapi.json`,
      description: 'Read-only JSON over a registry of MCP clients: what each client supports, the evidence for each claim, and the protocol revision it applies to. No authentication.',
      version,
      tags: ['mcp', 'model-context-protocol', 'mcp-clients', 'capabilities', 'openapi'],
      capabilities: operations.map((op) => op.id),
      representativeQueries: [
        'which MCP clients support elicitation',
        'does this MCP client pass structuredContent to the model',
        'which protocol revision does an MCP client negotiate',
        'when was an MCP capability deprecated',
      ],
    }, ...skills.map((s) => ({
      identifier: `urn:air:${host}:skill:${s.name}`,
      displayName: s.name,
      type: 'application/agent-skills+md',
      url: s.url,
      description: s.description,
      tags: ['agent-skills', 'mcp', 'mcp-clients'],
    }))],
  };

  const example = (path) => `curl ${origin}${path}`;
  const firstId = clients[0].id;
  const docsMd = `# Data API

The registry is published as static JSON. Every endpoint is a \`GET\` on \`${origin}\`, needs no authentication or API key, and allows cross-origin requests. The OpenAPI 3.1 description is at [\`/openapi.json\`](/openapi.json).

## Endpoints

| Operation | Request | Returns |
|---|---|---|
${operations.map((op) => `| \`${op.id}\` | \`GET ${op.path}\` | ${op.returns} |`).join('\n')}

Client ids for \`getClient\` come from \`listClients\`. Probe ids for \`getVerifiedRecords\` come from \`listVerifiedClients\`, and differ from registry ids for some clients.

## Examples

\`\`\`sh
${example('/data/clients/index.json')}
${example(`/data/clients/${firstId}.json`)}
${example('/data/verified/index.json')}
\`\`\`

A client entry holds one object per capability. Each has a \`status\` and an \`evidence\` list, and each evidence item has a \`tier\` and the protocol revision it applies to. The shape is in [\`/schemas/client-registry.json\`](/schemas/client-registry.json).

## Errors

Errors are \`application/problem+json\` documents ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)) with a machine-readable \`code\`.

- \`404\`, \`not_found\`: a path under \`/data\`, \`/schemas\`, \`/api\` or \`/.well-known\` with no file, or any path ending in \`.json\`. Any other missing path returns the same for a request whose \`Accept\` header ranks JSON at or above HTML.
- \`405\`, \`method_not_allowed\`: any method other than \`GET\`, \`HEAD\` or \`OPTIONS\`, on any path except \`/mcp\`.

\`\`\`json
${JSON.stringify(problemExample, null, 2)}
\`\`\`

## Versioning

${versioning}

## MCP server

The same data is served over the Model Context Protocol at \`${mcpUrl}\`, by Streamable HTTP with no authentication. The server is stateless and read-only. It answers protocol revisions ${mcpVersions.map((v) => `\`${v}\``).join(', ')}.

| Tool | What it does |
|---|---|
${TOOLS.map((t) => `| \`${t.name}\` | ${t.description.replace(/\|/g, '\\|')} |`).join('\n')}

Each tool returns JSON in \`structuredContent\` and the same JSON as text in \`content\`. \`get_research_note\` returns Markdown. The server card is at [\`${SERVER.cardPath}\`](${SERVER.cardPath}).

## Skills

The MCP server serves [Agent Skills](https://agentskills.io/) with the skills extension, \`io.modelcontextprotocol/skills\` ([SEP-2640](https://modelcontextprotocol.io/seps/2640-skills-extension)). A client lists them with \`skills/list\` and reads each file with \`resources/read\`. The same files are published over HTTP, indexed at [\`/.well-known/agent-skills/index.json\`](/.well-known/agent-skills/index.json), and the digests match.

| Skill | Over MCP | Over HTTP |
|---|---|---|
${skills.map((s) => `| \`${s.name}\` | \`${s.uri}\` | [SKILL.md](${s.url.slice(origin.length)}) |`).join('\n')}

${skills.map((s) => `\`${s.name}\`: ${s.description}`).join('\n\n')}

## Discovery

- [\`/openapi.json\`](/openapi.json): the OpenAPI 3.1 description.
- [\`/.well-known/api-catalog\`](/.well-known/api-catalog): the API catalog ([RFC 9727](https://www.rfc-editor.org/rfc/rfc9727)).
- [\`/.well-known/ard.json\`](/.well-known/ard.json): the [Agentic Resource Discovery](https://agenticresourcediscovery.org/) catalog, listing the MCP server, the API and the skills. The same document is at \`/.well-known/ai-catalog.json\`.
- [\`/.well-known/agent-skills/index.json\`](/.well-known/agent-skills/index.json): the Agent Skills discovery index.
- [\`/llms.txt\`](/llms.txt): every page and data file.

## Licence

The data is licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Telemetry under \`/data/observed\` follows the terms of the dataset it is derived from. [About](/about) covers where the data comes from and how to report a correction.
`;

  return { operations, openapi, apiCatalog, ard, docsMd, mcpUrl };
}

/** Problems with the generated files, as strings. `exists` answers whether a site path was built. */
export function checkApiFiles({ origin, openapi, apiCatalog, ard }, exists) {
  const problems = [];
  const ids = new Set();
  for (const [path, item] of Object.entries(openapi.paths)) {
    const op = item.get;
    if (!op.operationId || ids.has(op.operationId)) problems.push(`openapi.json: ${path} needs a unique operationId`);
    ids.add(op.operationId);
    if (!op.description) problems.push(`openapi.json: ${path} has no description`);
    if (!op.responses[200]?.content?.['application/json']?.schema) problems.push(`openapi.json: ${path} has no response schema`);

    // Expand each path parameter over its enum and check the file was built.
    let concrete = [path];
    for (const p of op.parameters || []) {
      concrete = concrete.flatMap((c) => p.schema.enum.map((v) => c.replace(`{${p.name}}`, v)));
    }
    for (const c of concrete) {
      if (c.includes('{')) problems.push(`openapi.json: ${path} has an undeclared path parameter`);
      else if (!exists(c)) problems.push(`openapi.json: ${c} is described but was not built`);
    }
  }

  const local = (href, label) => {
    if (href.startsWith(origin) && !exists(href.slice(origin.length))) problems.push(`${label}: link to ${href} does not resolve`);
  };
  for (const ctx of apiCatalog.linkset) {
    for (const [rel, targets] of Object.entries(ctx)) {
      if (Array.isArray(targets)) for (const t of targets) local(t.href, `api-catalog ${rel}`);
    }
  }

  // The required terms of an ARD v0.91 entry.
  const host = new URL(origin).hostname;
  for (const e of ard.entries) {
    const label = `ard.json: ${e.identifier || '(no identifier)'}`;
    if (!/^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$/.test(e.identifier || '')) problems.push(`${label}: identifier is not a urn:air URN`);
    else if (e.identifier.split(':')[2] !== host) problems.push(`${label}: identifier is not anchored to ${host}`);
    if (!e.displayName || !e.type) problems.push(`${label}: needs displayName and type`);
    if (Boolean(e.url) === Boolean(e.data)) problems.push(`${label}: needs exactly one of url and data`);
    if (e.url) local(e.url, label);
  }
  if (SERVER.description.length > 100) problems.push(`mcp-tools.js: the server description is ${SERVER.description.length} characters, and the server card allows 100`);
  return problems;
}

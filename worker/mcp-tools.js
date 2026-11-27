// The MCP server's identity and tool descriptions, as plain data. The Worker
// attaches schemas and handlers in mcp.js, and the site build reads the same
// text for the /api page and the catalogs.

export const SERVER = {
  // Reverse-DNS, as the server card requires. serverInfo uses the same name.
  name: 'io.canimcp/registry',
  title: 'canimcp',
  // The server card schema caps this at 100 characters.
  description: 'Which MCP clients support what, with the evidence for each claim. Read-only, no authentication.',
  path: '/mcp',
  cardPath: '/mcp/server-card',
  icon: { path: '/icon.svg', mimeType: 'image/svg+xml', sizes: ['any'] },
  modernVersions: ['2026-07-28'],
  // Every file under skills/, keyed by path, written by the site build.
  skillsBundle: '/data/skills.json',
  instructions: `canimcp records which MCP clients support which capabilities and how each claim is known. Every claim carries evidence with a tier (declared, verified, observed or read) and the protocol revision it applies to. Tiers are not ranked and can disagree. A capability missing from a client's entry is not recorded, which is a different claim from unsupported.

The findings are provisional. canimcp is in active development, and statuses, notes and probe results may be incomplete or wrong. Say so when you pass one on, and point to the cited source.

Rows describe each client on the current revision, 2026-07-28, or on the newest revision it speaks when it cannot negotiate that one. get_client, find_capability_support and list_capabilities take a revision, such as 2025-11-25, and answer as a server offering that revision as its newest would see each client: the client negotiates the newest revision it speaks at or below it, and its record for that revision replaces the rows that differ. A client marked recordedPerRevision false has one set of rows for every revision it speaks.

Start with list_clients for client ids or list_capabilities for capability ids. find_capability_support compares one capability across clients. get_client returns one client's entry. get_probe_results returns what a client sent to its model when it called a fixture tool. search_research_notes and get_research_note cover behaviour a status cannot express. Every tool is read-only, and results link to the page on https://canimcp.io they came from.

The skill at skill://check-mcp-client-support/SKILL.md explains how to answer a client-support question with these tools and how to read the evidence.`,
};

export const TOOLS = [
  {
    name: 'list_clients',
    title: 'List clients',
    description: 'Lists every MCP client in the registry with its id, vendor, category, the protocol revisions it speaks and the one it prefers. Call this first to get the client ids the other tools take.',
  },
  {
    name: 'get_client',
    title: 'Get one client',
    description: 'Returns the registry entry for one MCP client: each capability with its status, notes, evidence and research note ids, plus the SDK and the commit the source was read at. Pass `capability` to get only that capability and the ones beneath it. Pass `revision` to get the entry as a server offering that protocol revision sees it.',
  },
  {
    name: 'list_capabilities',
    title: 'List capabilities',
    description: 'Lists every capability id the registry tracks, such as elicitation.url or tools.result.structuredContent, with the protocol revision that introduced it and a count of clients at each status. Pass `revision` for the counts on an older protocol revision. Call this to find the id that find_capability_support takes.',
  },
  {
    name: 'find_capability_support',
    title: 'Compare one capability across clients',
    description: 'Answers "which clients support X". For one capability id, returns each client\'s status with its notes and evidence, a summary of the probe\'s runs, what telemetry observed, where the tiers disagree, the clients that have no record for it, and the capability\'s lifecycle across protocol revisions. Pass `revision` for each client\'s row on that protocol revision.',
  },
  {
    name: 'get_probe_results',
    title: 'Get probe results for a client',
    description: 'Returns verified-tier results from the canimcp probe for one client: for each tool-result scenario, what reached the model, with the client version, model API, protocol revision and a link to the captures. For the image scenario it also says whether the image arrived as an image, as base64 text, or not at all. Covers clients that have no registry entry. Pass `capability` to narrow the results.',
  },
  {
    name: 'search_research_notes',
    title: 'Search research notes',
    description: 'Finds research notes on MCP client behaviour that a support status cannot express: gaps, misconceptions, idiosyncrasies and in-flight changes. Filters by keyword, client id and capability id, and returns each note\'s id, title and summary. With no arguments it lists every note.',
  },
  {
    name: 'get_research_note',
    title: 'Read a research note',
    description: 'Returns the full Markdown of one research note by id, including the sources it cites with repository, commit and path. Get ids from search_research_notes or from the `research` lists in a client entry.',
  },
];

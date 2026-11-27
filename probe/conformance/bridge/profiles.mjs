// Per-adapter settings for conformance runs through host-bridge.mjs.
// config: the adapter config to use when the command names none.
// timeoutMs: the bridge's client timeout (BRIDGE_TIMEOUT_MS overrides it).
// script: the call-every-tool.mjs profile (see that file), passed as CONF_PROFILE.
// Conformance-only configs (elicitation answers) live in bridge/adapters/<id>.mjs.
const PY = 80000;

export default {
  'adk-python': { timeoutMs: PY, script: { mcp: 'all' } },
  'agent-framework': { timeoutMs: PY, script: { mcp: 'all' } },
  strands: { timeoutMs: PY, script: { mcp: 'all' } },
  crewai: { timeoutMs: PY, script: { mcp: 'all' } },
  deepagents: { timeoutMs: PY },
  'fast-agent': { timeoutMs: PY },
  // The default config defers MCP tools behind tool_search; with it off the model sees them directly.
  'hermes-agent': { config: 'tool-search-off', timeoutMs: PY },
  // cline --yolo loops on a plain text reply until submit_and_exit is called.
  cline: { script: { finish: 'submit_and_exit' } },
  eve: { timeoutMs: 60000, script: { route: 'eve' } },
  pi: {},
  mastra: {},
  libfx: {},
  // fx 0.0.16 defers MCP tools behind capability_search and mcp_select_tool. Runs from WSL.
  fx: { timeoutMs: 60000, script: { route: 'fx-select' } },
  // codex, goose and opencode run in the Docker image (compose service `conformance`).
  // codex can start its first turn before MCP tools are listed.
  codex: { timeoutMs: 60000, script: { warmup: ['list_mcp_resources', 'list_mcp_resource_templates'] } },
  // goose names a --with-streamable-http-extension server after its URL (localhost_<port>_mcp).
  goose: { timeoutMs: 60000, script: { mcpMatch: '^localhost_\\d+' } },
  // The default config puts MCP tools behind Code Mode's execute tool; with it off the model sees them directly.
  opencode: { config: 'codemode-off', timeoutMs: 60000 },
};

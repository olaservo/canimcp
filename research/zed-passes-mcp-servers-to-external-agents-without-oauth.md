---
id: zed-passes-mcp-servers-to-external-agents-without-oauth
title: Zed hands its MCP server list to external ACP agents, and OAuth sessions stay behind
kind: nuance
summary: Zed sends its configured MCP servers to an external ACP agent as stdio commands and HTTP URLs with static headers. The agent connects with its own MCP client, and Zed's OAuth tokens and timeouts are not passed.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - authentication.oauth
clients:
  - zed
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/zed-industries/zed
    title: crates/agent_servers/src/acp/v2.rs, building SessionContext.mcp_servers
    commit: 961ac220
    path: crates/agent_servers/src/acp/v2.rs:AcpV2Connection.session_context
    date: 2026-11-27
  - url: https://github.com/zed-industries/zed
    title: crates/agent_servers/src/acp/v1.rs, mcp_servers_for_project
    commit: 961ac220
    path: crates/agent_servers/src/acp/v1.rs:mcp_servers_for_project
    date: 2026-11-27
  - url: https://github.com/zed-industries/zed
    title: crates/agent_servers/src/acp.rs, mcp_configurations_for_project
    commit: 961ac220
    path: crates/agent_servers/src/acp.rs:mcp_configurations_for_project
    date: 2026-11-27
  - url: https://github.com/zed-industries/zed
    title: crates/project/src/context_server_store.rs, OAuth session in the keychain
    commit: 961ac220
    path: crates/project/src/context_server_store.rs:ContextServerStore.create_context_server
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - zed-hand-writes-its-mcp-client-and-answers-no-server-requests
---

# Zed hands its MCP server list to external ACP agents, and OAuth sessions stay behind

Zed has two kinds of agent. The built-in Zed agent uses Zed's own MCP client in `crates/context_server`, and the `zed` entry's rows describe that client. External agents run as separate processes that speak ACP, and Zed does not proxy MCP for them.

For an ACP session, Zed converts each configured context server into an ACP `McpServer` entry and sends the list in the new-session or load-session request. A stdio or extension server becomes `McpServer::Stdio` with its command path, args and env. A url server becomes `McpServer::Http` with its URL and the static `headers` map. The v2 connection includes each kind only when the agent advertises the matching `mcp.stdio` or `mcp.http` capability, and it requires an absolute command path. The v1 path sends both kinds unconditionally.

The external agent then connects to those servers with its own MCP client. Its wire name, declared capabilities, protocol revision and tool result handling are that agent's, and Zed sees only the ACP tool call updates the agent reports.

Some of what Zed's own client uses does not travel. The OAuth session Zed keeps in the system keychain is not added to the HTTP headers, so a server that Zed reached through OAuth arrives at the agent with no credentials from Zed. The per-server `timeout` and the `oauth` client settings are dropped. In a remote project, a stdio server is sent only when it is marked `remote: true`.

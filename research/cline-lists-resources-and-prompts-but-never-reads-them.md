---
id: cline-lists-resources-and-prompts-but-never-reads-them
title: Cline lists resources and prompts into a UI tab and gives the model no way to fetch either
kind: idiosyncrasy
summary: The VS Code extension calls resources/list, resources/templates/list and prompts/list on every connect and shows the results in the server panel. Nothing calls prompts/get, and resources/read serves only the off-by-default MCP Apps runtime, so the model cannot fetch either.
capabilities:
  - resources
  - prompts
clients:
  - cline
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/cline/cline
    title: apps/vscode/src/services/mcp/McpHub.ts, fetchResourcesList and fetchPromptsList
    commit: 20b04272
    path: apps/vscode/src/services/mcp/McpHub.ts:918-1010
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: apps/vscode/src/shared/tools.ts, ClineDefaultTool
    commit: 20b04272
    path: apps/vscode/src/shared/tools.ts:20
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: ServerRow.tsx, Resources and Prompts panel tabs
    commit: 20b04272
    path: apps/vscode/webview-ui/src/components/mcp/configuration/tabs/installed/server-row/ServerRow.tsx:323-386
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/tools.ts, createMcpTools
    commit: 20b04272
    path: sdk/packages/core/src/extensions/mcp/tools.ts:17-49
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: apps/vscode/src/services/mcp/McpHub.ts, readResource
    commit: 20b04272
    path: apps/vscode/src/services/mcp/McpHub.ts:1748-1769
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/session-apps.ts, MCP Apps readResource
    commit: 20b04272
    path: sdk/packages/core/src/extensions/mcp/session-apps.ts:88-102
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - model-initiated-resource-read
  - utilized-capability-declarations
---

# Cline lists resources and prompts into a UI tab and gives the model no way to fetch either

`McpHub.fetchServerCapabilities` runs four list calls on every connect: `tools/list`, `resources/list`, `resources/templates/list` and `prompts/list`. Each is gated on the server having declared the capability, each treats a `MethodNotFound` as an authoritatively empty list rather than a failure, and each result is cached on the connection.

Three of those four go nowhere. `prompts/get` does not appear in the repository. Neither does `getPrompt` or `GetPromptResult`. `resources/read` was added on 2026-10-19 for MCP Apps and takes no URI from the lists. The lists reach exactly one consumer: two tabs in the server configuration panel, which render a count and then the URIs, names and descriptions as text.

What the model gets is tools alone. `createVscodeExtraTools` passes `McpHub`'s server list to the shared `createMcpTools`, which reads `provider.listTools(serverName)` and returns one flat agent tool per MCP tool. Nothing else on the connection is offered to it.

## access_mcp_resource is a dead enum entry

The tool id survives:

```ts
export enum ClineDefaultTool {
	…
	MCP_USE = "use_mcp_tool",
	MCP_ACCESS = "access_mcp_resource",
	…
}
```

`MCP_ACCESS` has no registration, no handler and no executor. The only other reference is a webview branch that would render the tool call if one ever arrived. Cline's own history is the explanation — `access_mcp_resource` was a real tool before the agent loop moved onto `@cline/core` — but at this commit the model cannot emit it and nothing would run it if it did.

## resources/read exists for MCP Apps only

Commit `731f4846` added `readResource` to `McpHub` and to both `@cline/core` clients. In `@cline/core` the only caller is the MCP Apps runtime, which rejects any URI that is not `ui://` and exists only when the session config sets `mcpApps: true`. No app in the repository sets it. The caller is the host, through `readMcpAppResource`, not the model. In the extension `McpHub.readResource` is reached only from `McpHubToolProvider.readResource`, which nothing calls.

## Why it matters for the matrix

A boolean matrix would give Cline `resources: yes`, and the apify entry does exactly that. So would reading the wire: Cline calls `resources/list`, so it looks like a client that consumes resources. A server author choosing between exposing data as a resource and exposing it as a `read_*` tool would make the wrong call on either signal.

This is also the sharpest case yet of the gap [[utilized-capability-declarations]] describes. Cline consumes nothing it lists, and there is no field in the handshake that could say so — the client capability object it sends is empty, and `resources` was never a client capability to declare in the first place.

Codex and opencode both solved the same problem by exposing built-in tools, three in Codex and two in opencode, that read resources on the model's behalf, described in [[model-initiated-resource-read]]. Cline lists the same data and stops.

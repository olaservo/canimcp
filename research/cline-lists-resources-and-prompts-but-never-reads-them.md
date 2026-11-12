---
id: cline-lists-resources-and-prompts-but-never-reads-them
title: Cline lists resources and prompts into a UI tab and has no way to fetch either
kind: idiosyncrasy
summary: The VS Code extension calls resources/list, resources/templates/list and prompts/list on every connect and renders the results in the server configuration panel. There is no resources/read and no prompts/get anywhere in the repository, so nothing can act on what was listed.
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
    commit: 110138b5
    path: apps/vscode/src/services/mcp/McpHub.ts:915-1007
    date: 2026-08-25
  - url: https://github.com/cline/cline
    title: apps/vscode/src/shared/tools.ts, ClineDefaultTool
    commit: 110138b5
    path: apps/vscode/src/shared/tools.ts:20
    date: 2026-08-25
  - url: https://github.com/cline/cline
    title: ServerRow.tsx, Resources and Prompts panel tabs
    commit: 110138b5
    path: apps/vscode/webview-ui/src/components/mcp/configuration/tabs/installed/server-row/ServerRow.tsx:323-386
    date: 2026-08-25
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/tools.ts, createMcpTools
    commit: 110138b5
    path: sdk/packages/core/src/extensions/mcp/tools.ts:16-47
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - model-initiated-resource-read
  - utilized-capability-declarations
---

# Cline lists resources and prompts into a UI tab and has no way to fetch either

`McpHub.fetchServerCapabilities` runs four list calls on every connect: `tools/list`, `resources/list`, `resources/templates/list` and `prompts/list`. Each is gated on the server having declared the capability, each treats a `MethodNotFound` as an authoritatively empty list rather than a failure, and each result is cached on the connection.

Three of those four go nowhere. `resources/read` does not appear in the repository. Neither does `prompts/get`, `readResource`, `getPrompt`, `ReadResourceResult` or `GetPromptResult`. The lists reach exactly one consumer: two tabs in the server configuration panel, which render a count and then the URIs, names and descriptions as text.

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

## Why it matters for the matrix

A boolean matrix would give Cline `resources: yes`, and the apify entry does exactly that. So would reading the wire: Cline calls `resources/list`, so it looks like a client that consumes resources. A server author choosing between exposing data as a resource and exposing it as a `read_*` tool would make the wrong call on either signal.

This is also the sharpest case yet of the gap [[utilized-capability-declarations]] describes. Cline consumes nothing it lists, and there is no field in the handshake that could say so — the client capability object it sends is empty, and `resources` was never a client capability to declare in the first place.

Codex and opencode both solved the same problem by exposing three built-in tools that read resources on the model's behalf, described in [[model-initiated-resource-read]]. Cline lists the same data and stops.

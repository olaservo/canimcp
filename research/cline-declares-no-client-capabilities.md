---
id: cline-declares-no-client-capabilities
title: Cline declares an empty capability object on both surfaces
kind: idiosyncrasy
summary: Both of Cline's MCP implementations send `capabilities: {}` in initialize by default. No roots, no sampling, no elicitation, no tasks — and none of the four are implemented anywhere, so the declaration is accurate.
capabilities:
  - roots
  - sampling
  - elicitation
  - tasks
  - extensions
clients:
  - cline
specVersions:
  - 2024-11-05
  - 2025-11-25
sources:
  - url: https://github.com/cline/cline
    title: apps/vscode/src/services/mcp/McpHub.ts, new Client
    commit: 20b04272
    path: apps/vscode/src/services/mcp/McpHub.ts:467-475
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/client.ts, initializeParams
    commit: 20b04272
    path: sdk/packages/core/src/extensions/mcp/client.ts:266-270
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/apps.ts, createMcpAppsClientCapabilities
    commit: 20b04272
    path: sdk/packages/core/src/extensions/mcp/apps.ts:16-24
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/runtime/orchestration/runtime-builder.ts, mcpApps default
    commit: 20b04272
    path: sdk/packages/core/src/runtime/orchestration/runtime-builder.ts:409
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - opencode-declares-only-roots
  - utilized-capability-declarations
---

# Cline declares an empty capability object on both surfaces

The extension:

```ts
const client = new Client(
	{ name: "Cline", version: this.clientVersion },
	{ capabilities: {} },
)
```

The CLI:

```ts
const initializeParams = {
	protocolVersion: MCP_PROTOCOL_VERSION,
	capabilities: this.mcpApps ? createMcpAppsClientCapabilities() : {},
	clientInfo: { name: "@cline/core", version: "0.0.0" },
};
```

`mcpApps` is false unless the session config sets `mcpApps: true`, and no app in the repository sets it. With it on, `@cline/core` declares `extensions: { "io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] } }` on stdio and URL servers. The extension's `McpHub` never declares it.

Neither is a placeholder. `ElicitRequestSchema`, `CreateMessageRequestSchema` and `ListRootsRequestSchema` appear nowhere in the repository, and no handler is registered for any of them after connect. A server asking Cline for a root, a sample or an elicitation would be asking a client that has no code to answer.

## Where this sits against the other reads

Four clients read so far, four different relationships between what is declared and what is implemented:

| Client | Declares | Implements |
|---|---|---|
| goose | roots and form elicitation | roots, form and URL elicitation |
| Codex CLI | elicitation only | elicitation |
| opencode | roots and elicitation (form, url) | roots, elicitation |
| Cline | nothing | nothing |

Cline and opencode are the two accurate ones. opencode's accuracy comes from declaring two capabilities it genuinely serves; Cline's comes from having none to declare.

## The CLI reports version 0.0.0

`clientInfo.version` is hardcoded to `"0.0.0"` in the stdio client, and the URL client falls back to the same string because nothing passes `clientVersion` into `createDefaultMcpServerClientFactory`. `@cline/core`'s own package version is 0.2.0 at this commit and never reaches the wire.

The extension does send a real version, `ExtensionRegistryInfo.version`, 4.1.26 at this commit. So a server sniffing `clientInfo` can tell which Cline release it is talking to when the traffic comes from VS Code, and cannot when it comes from the CLI. Any observed-tier feed keyed on client version will show one Cline pinned at 0.0.0 forever.

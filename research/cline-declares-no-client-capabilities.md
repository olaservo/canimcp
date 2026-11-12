---
id: cline-declares-no-client-capabilities
title: Cline declares an empty capability object on both surfaces
kind: idiosyncrasy
summary: Both of Cline's MCP implementations send `capabilities: {}` in initialize. No roots, no sampling, no elicitation, no tasks — and none of the four are implemented anywhere, so the declaration is accurate.
capabilities:
  - roots
  - sampling
  - elicitation
  - tasks
clients:
  - cline
specVersions:
  - 2024-11-05
  - 2025-11-25
sources:
  - url: https://github.com/cline/cline
    title: apps/vscode/src/services/mcp/McpHub.ts, new Client
    commit: 110138b5
    path: apps/vscode/src/services/mcp/McpHub.ts:464-472
    date: 2026-08-25
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/client.ts, initializeParams
    commit: 110138b5
    path: sdk/packages/core/src/extensions/mcp/client.ts:209-213
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
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
	capabilities: {},
	clientInfo: { name: "@cline/core", version: "0.0.0" },
};
```

Neither is a placeholder. `ElicitRequestSchema`, `CreateMessageRequestSchema` and `ListRootsRequestSchema` appear nowhere in the repository, and no handler is registered for any of them after connect. A server asking Cline for a root, a sample or an elicitation would be asking a client that has no code to answer.

## Where this sits against the other reads

Four clients read so far, four different relationships between what is declared and what is implemented:

| Client | Declares | Implements |
|---|---|---|
| goose | less than it implements | elicitation, and sends a roots notification it never declared |
| Codex CLI | elicitation only | elicitation |
| opencode | roots only | roots |
| Cline | nothing | nothing |

Cline and opencode are the two accurate ones. opencode's accuracy comes from declaring one capability it genuinely serves; Cline's comes from having none to declare.

## The CLI reports version 0.0.0

`clientInfo.version` is hardcoded to `"0.0.0"` in the stdio client, and the URL client falls back to the same string because nothing passes `clientVersion` into `createDefaultMcpServerClientFactory`. `@cline/core`'s own package version is 0.0.79 at this commit and never reaches the wire.

The extension does send a real version, `ExtensionRegistryInfo.version`, 4.1.15 at this commit. So a server sniffing `clientInfo` can tell which Cline release it is talking to when the traffic comes from VS Code, and cannot when it comes from the CLI. Any observed-tier feed keyed on client version will show one Cline pinned at 0.0.0 forever.

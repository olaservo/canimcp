---
id: cline-hand-rolls-stdio-in-its-cli
title: Cline's CLI speaks stdio through a hand-written client fixed at 2024-11-05
kind: idiosyncrasy
summary: Three of Cline's four MCP paths use the official TypeScript SDK and negotiate 2025-11-25. The fourth, stdio in @cline/core, is a hand-written JSON-RPC client that sends 2024-11-05, ignores the version it gets back, and falls back to LSP-style Content-Length framing.
capabilities:
  - transports.stdio
clients:
  - cline
specVersions:
  - 2024-11-05
  - 2025-11-25
sources:
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/client.ts, StdioMcpClient
    commit: 20b04272
    path: sdk/packages/core/src/extensions/mcp/client.ts:57,72,213-299
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/client.ts, SdkUrlMcpClient
    commit: 20b04272
    path: sdk/packages/core/src/extensions/mcp/client.ts:765-1040
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: apps/vscode/src/services/mcp/McpHub.ts, connectToServer
    commit: 20b04272
    path: apps/vscode/src/services/mcp/McpHub.ts:467-496
    date: 2026-11-20
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/runtime/orchestration/runtime-builder.ts, Agent Plugin MCP servers
    commit: 20b04272
    path: sdk/packages/core/src/runtime/orchestration/runtime-builder.ts:230-243,615-629
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - cline-declares-no-client-capabilities
  - opencode-patches-its-sdk-for-session-recovery
---

# Cline's CLI speaks stdio through a hand-written client fixed at 2024-11-05

Cline has four MCP paths, split by surface and by transport:

| Surface | Transport | Implementation | Version sent |
|---|---|---|---|
| VS Code extension | stdio | SDK `StdioClientTransport` | 2025-11-25 |
| VS Code extension | SSE, Streamable HTTP | SDK transports | 2025-11-25 |
| CLI, `@cline/core` | SSE, Streamable HTTP | SDK transports | 2025-11-25 |
| CLI, `@cline/core` | stdio | hand-written | 2024-11-05 |

`createDefaultMcpServerClientFactory` picks between the two by transport type: a stdio registration gets `StdioMcpClient`, everything else gets `SdkUrlMcpClient`, which wraps the SDK's `Client`.

The extension reaches the `@cline/core` rows too. It loads settings-file servers through `McpHub` and sets `disableMcpSettingsTools`, but MCP servers declared by an installed Agent Plugin are registered by `@cline/core`'s runtime builder on every surface. In VS Code such a stdio server gets the hand-written client.

`StdioMcpClient` is a complete JSON-RPC implementation of its own — request ids, a pending map, timeouts, abort signals, stderr capture — and it hardcodes the revision:

```ts
const MCP_PROTOCOL_VERSION = "2024-11-05";
```

It supports four methods: `initialize`, `tools/list`, `tools/call` and `resources/read`. No notifications are handled, in either direction, past the `notifications/initialized` it sends after connecting.

## It does not negotiate

`connect()` awaits the `initialize` response and discards it. The result's `protocolVersion` is never read and never compared. A server that answers `2025-11-25` is treated exactly like one that answers `2024-11-05`, and the CLI proceeds either way.

## Content-Length framing is not part of the transport

If `initialize` fails on the first attempt, the client kills the process, respawns it, and retries with LSP-style framing:

```
Content-Length: 142\r\n\r\n{"jsonrpc":"2.0",...}
```

MCP's stdio transport defines newline-delimited JSON only. Cline probes it as a fallback because the failure it is guarding against is a silent server, not a wrong-framing server: the two attempts get 10 seconds each by default, and the combined error message names both when they fail differently.

A server that accepted Content-Length framing would work against Cline's CLI and against nothing else.

## Why it matters for the matrix

A version-shaped question about Cline has no single answer, and neither surface nor transport alone decides it. `preferredProtocolVersion` records 2025-11-25 because that is what three of the four paths send, but a server that only ever sees stdio traffic from the CLI will only ever see 2024-11-05 — from a client whose extension, on the same machine, reading the same settings file, is speaking a revision three releases newer.

It also settles the question the opencode read raised. Cline is on `@modelcontextprotocol/sdk`, as opencode was at the time, and Cline does not patch it: `patchedDependencies` covers `@opentui-ui/dialog`, `ollama-ai-provider-v2` and `@shadcn/react` and nothing else. Where opencode changed the SDK's behaviour and kept using it, Cline left the SDK alone and wrote around it.

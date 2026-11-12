---
id: cline-defaults-a-url-server-to-sse
title: A Cline server configured by URL alone gets SSE, not Streamable HTTP
kind: idiosyncrasy
summary: Both surfaces resolve a URL-based server with no explicit type to SSE. The extension's schema says why in a comment - reordering the union would break configs written before Streamable HTTP existed - so the transport deprecated in 2025-03-26 stays the default.
capabilities:
  - transports.sse
  - transports.streamableHttp
clients:
  - cline
specVersions:
  - 2025-03-26
  - 2025-11-25
sources:
  - url: https://github.com/cline/cline
    title: apps/vscode/src/services/mcp/schemas.ts, createServerTypeSchema
    commit: 110138b5
    path: apps/vscode/src/services/mcp/schemas.ts:116-162
    date: 2026-08-25
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/config-loader.ts, URL server transform
    commit: 110138b5
    path: sdk/packages/core/src/extensions/mcp/config-loader.ts:170-205
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - cline-rewrites-mcp-remote-proxy-configs
---

# A Cline server configured by URL alone gets SSE, not Streamable HTTP

```json
{ "mcpServers": { "example": { "url": "https://example.com/mcp" } } }
```

That connects over SSE on both surfaces. The extension's zod union tries the SSE arm before the Streamable HTTP arm and both accept a bare `url`, so the first one wins; the CLI's config loader reaches the same result explicitly, `value.type ?? mapLegacyTransportType(value.transportType) ?? "sse"`, twice.

The extension's schema states the reason inline: users have MCP servers configured without a type from before Streamable HTTP existed, and reordering the union would silently switch those connections. Both surfaces are consistent about it, and neither probes — the resolved type is used as-is, with no fallback to the other transport if the connection fails.

## What it costs

SSE was deprecated in `2025-03-26` and the extension negotiates `2025-11-25`. A server that supports both will be reached over the older transport unless the user knows to write `"type": "streamableHttp"`, and nothing in the connection failure path or the UI suggests that they should.

The `mcp-remote` rewrite described in [[cline-rewrites-mcp-remote-proxy-configs]] cuts the other way: a stdio config wrapping `npx mcp-remote <url>` becomes a native **Streamable HTTP** transport. So on the CLI, a URL reached through the legacy proxy shape gets the newer transport and a URL written directly gets the older one.

## Compared to opencode

opencode takes a URL with no transport field too, and resolves it the opposite way: Streamable HTTP first, SSE only as a fallback when the connection fails. Same configuration, same ambiguity, opposite default — and opencode's fallback means a server that speaks only one of them still connects, where Cline's does not.

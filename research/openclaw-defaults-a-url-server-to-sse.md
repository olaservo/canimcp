---
id: openclaw-defaults-a-url-server-to-sse
title: An OpenClaw server configured by URL alone gets SSE, not Streamable HTTP
kind: idiosyncrasy
summary: OpenClaw only builds a Streamable HTTP transport when the config names it explicitly. With no `type` or `transport` field the resolver falls through to SSE, the transport deprecated in 2025-03-26. Cline does the same thing for a different stated reason.
capabilities:
  - transports.sse
  - transports.streamableHttp
clients:
  - openclaw
  - cline
specVersions:
  - 2025-03-26
  - 2025-11-25
sources:
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-transport-config.ts, resolveMcpTransportConfig fallthrough
    commit: b607eb7b
    path: src/agents/mcp-transport-config.ts:resolveMcpTransportConfig
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-transport.ts, transport factory
    commit: b607eb7b
    path: src/agents/mcp-transport.ts:resolveMcpTransport
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/config/mcp-config-normalize.ts, transport field and type aliases
    commit: b607eb7b
    path: src/config/mcp-config-normalize.ts:CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT,resolveConfiguredMcpTransport,canonicalizeConfiguredMcpServer
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: docs/cli/mcp/transports.md, "when omitted, OpenClaw uses sse"
    commit: b607eb7b
    path: docs/cli/mcp/transports.md:Streamable HTTP transport
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - cline-defaults-a-url-server-to-sse
---

# An OpenClaw server configured by URL alone gets SSE, not Streamable HTTP

The resolver checks stdio first. If the server is not stdio, it reads an effective transport name from the config's `transport` field, which config normalization fills from a `type` alias (`http` or `streamable-http`) when `transport` is absent. Streamable HTTP is chosen only by `effectiveTransport === "streamable-http" ? "streamable-http" : "sse"`. When no transport was named, that test fails and the resolver builds an SSE transport. SSE is therefore the default for a URL-only server. A transport name that is neither `sse` nor `streamable-http` skips the server with a warning.

This is the second client entry with an SSE default for a bare URL, and the two arrived by different routes. Cline's extension schema orders a union with SSE first and carries a comment saying why: reordering it would break configs written before Streamable HTTP existed. OpenClaw's is structural — the modern transport is behind a name check and the deprecated one is the fallthrough — with no comment defending it.

The practical consequence is the same either way. An operator who pastes a URL into config and assumes the current transport gets the one deprecated in `2025-03-26`, and nothing in either client says so at connect time.

Recorded as an idiosyncrasy on both clients rather than a gap. The spec does not tell a client how to guess a transport from a bare URL, which is arguably the thing worth fixing.

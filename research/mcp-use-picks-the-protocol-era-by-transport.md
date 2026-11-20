---
id: mcp-use-picks-the-protocol-era-by-transport
title: mcp-use probes 2026-07-28 over HTTP and stays on the handshake over stdio
kind: idiosyncrasy
summary: The TypeScript MCPClient sets the SDK's auto negotiation on HTTP servers, so they get server/discover at 2026-07-28 first, and keeps the SDK's legacy default on stdio, so a local server gets initialize at 2025-11-25. One client, one config file, two eras.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - tools.listChanged
  - elicitation
clients:
  - mcp-use
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/mcp-use/mcp-use
    title: HttpConnector defaults and client options
    commit: 8ff4b865
    path: libraries/typescript/packages/client/src/transport/http.ts:81-93,268-278,416-464
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: StdioConnector defaults and client options
    commit: 8ff4b865
    path: libraries/typescript/packages/client/src/transport/stdio.ts:35-42,91-96,128-176
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: Default clientInfo and normalizeClientInfo
    commit: 8ff4b865
    path: libraries/typescript/packages/client/src/core/config.ts:281-311
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: MCPClient passes the normalized clientInfo to each connector
    commit: 8ff4b865
    path: libraries/typescript/packages/client/src/core/node.ts:492-536
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: The CLI's deploy check builds its own SDK client named manufact-cli
    commit: 8ff4b865
    path: libraries/typescript/packages/cli/src/cloud/deploy/external-url.ts:50-58
    date: 2026-11-20
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1
    title: "@modelcontextprotocol/client 2.3.1, resolveVersionNegotiation and the auto-opened subscriptions/listen stream"
    path: dist/index.mjs:2559-2585,3425-3452
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - mcp-use-python-binding-runs-on-the-1x-sdk
  - fast-agent-leads-with-the-modern-discover-probe
  - hermes-leads-with-the-legacy-handshake
---

# mcp-use probes 2026-07-28 over HTTP and stays on the handshake over stdio

At `8ff4b865`, `@mcp-use/client` 2.4.6 runs on `@modelcontextprotocol/client` 2.3.1. That SDK's `DEFAULT_VERSION_NEGOTIATION_MODE` is `legacy`. mcp-use overrides it per transport.

| | HTTP server entry | stdio server entry |
|---|---|---|
| `protocolNegotiation` default | `auto` | `legacy` |
| First request | `server/discover` at `2026-07-28` | `initialize` at `2025-11-25` |
| Fallback | `initialize` when the server does not answer discover as a modern server | none needed |
| List-changed delivery | a `subscriptions/listen` stream the SDK opens at connect, when the server advertises `listChanged` | notifications pushed on the session |
| Elicitation and sampling | `input_required` rounds answered by the registered handlers | server-initiated requests |

The stdio choice is documented in the source: the SDK advises against probing for spawn-per-invocation tools, because a legacy server that never answers an unknown pre-`initialize` request stalls the probe. The HTTP comment says auto negotiates "the most capable protocol available". Either default can be changed per server entry with `protocolNegotiation`, including `{ pin: "2026-07-28" }`.

The capability object is the same on both paths: `roots` with `listChanged`, plus `sampling` and `elicitation` only when callbacks are passed. On a modern connection it travels in each request's `_meta` envelope with `clientInfo`.

## Wire names

A default `MCPClient` sends `clientInfo.name` `mcp-use`, with the package version, a title, a description, an icon and `websiteUrl`. `normalizeClientInfo` replaces any configured value that lacks `name` or `version` with that default. An application that constructs `HttpConnector` or `StdioConnector` directly and passes no `clientInfo` sends `http-connector` or `stdio-connector`, version `1.0.0`. Other packages in the repository set their own names, for example `manufact-cli` in the CLI's deploy check.

## What this means for the registry

The entry's `preferredProtocolVersion` is `2026-07-28` because that is what a default HTTP connection leads with. A default stdio connection to the same client never sends discover. A telemetry row for `mcp-use` at `2025-11-25` can be a stdio server, an HTTP server that fell back, or the Python binding, which cannot reach `2026-07-28` at all.

## Not checked

Nothing was run. The table was read from the connectors and the SDK's `dist/index.mjs`. The browser `MCPClient` builds the same `HttpConnector` and was not read beyond that.

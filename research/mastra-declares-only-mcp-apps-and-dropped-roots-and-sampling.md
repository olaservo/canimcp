---
id: mastra-declares-only-mcp-apps-and-dropped-roots-and-sampling
title: A default Mastra MCPClient declares the MCP Apps extension and nothing else
kind: idiosyncrasy
summary: At bb984550 MCPClient declares `io.modelcontextprotocol/ui` on every connection and has no renderer of its own. Roots, sampling, the HTTP+SSE fallback and `logging/setLevel` were removed in the 2.0.0 rebuild, on legacy connections too.
capabilities:
  - roots
  - sampling
  - elicitation
  - extensions
  - transports.sse
  - logging
clients:
  - mastra
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/client.ts, the capability object and the only request handler
    commit: 29e1c78d
    path: packages/mcp/src/client/client.ts:InternalMastraMCPClient
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/types.ts, MCPClientCapabilities
    commit: 29e1c78d
    path: packages/mcp/src/client/types.ts:MCPClientCapabilities
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/client.ts, negotiationMode and the transport choice
    commit: 29e1c78d
    path: packages/mcp/src/client/client.ts:negotiationMode,InternalMastraMCPClient.connectHttp,InternalMastraMCPClient.connect
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/configuration.ts, isModelVisible
    commit: 29e1c78d
    path: packages/mcp/src/client/configuration.ts:isModelVisible,modelVisibleTools
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/CHANGELOG.md, the 2.0.0 entry
    commit: 29e1c78d
    path: packages/mcp/CHANGELOG.md:2.0.0
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0
    title: "@modelcontextprotocol/client 2.4.0, dist/public-CvV4ZHkX.mjs, Client class comment and DEFAULT_VERSION_NEGOTIATION_MODE"
    path: dist/public-CvV4ZHkX.mjs
    date: 2026-11-16
status: current
lastVerified: 2026-11-27
related:
  - openclaw-declares-nothing-unless-mcp-apps-is-on
  - cline-declares-no-client-capabilities
  - opencode-declares-only-roots
  - fast-agent-leads-with-the-modern-discover-probe
  - utilized-capability-declarations
---

# A default Mastra MCPClient declares the MCP Apps extension and nothing else

The constructor builds the capability object from the server entry. `elicitation` is present only when the entry has an `inputRequests` handler. `extensions` always holds `io.modelcontextprotocol/ui: {}`, plus `io.modelcontextprotocol/tasks: {}` when the entry sets `tasks`. With neither option set the object is `{"extensions":{"io.modelcontextprotocol/ui":{}}}`, which is what the probe captured from `@mastra/mcp` 2.9.0-alpha.1 on both the `server/discover` path and the legacy `initialize`.

## The MCP Apps declaration has no off switch

The `ui` key is written after the application's own `capabilities.extensions`, so an application cannot remove it. `@mastra/mcp` does not render anything. What it does with the extension is keep tool and result `_meta`, stamp `ui.serverId` beside `ui.resourceUri`, and withhold tools whose `_meta.ui.visibility` lacks `model` from `listTools()`. The renderer is Studio, in `packages/playground-ui`. An application that uses `Agent` and `MCPClient` without Studio declares the extension to every server and has nothing that displays a `ui://` resource. OpenClaw makes the same declaration only when `mcp.apps.enabled` is set, which defaults to off.

## Roots and sampling are gone on every revision

`MCPClientCapabilities` is `Pick<ClientCapabilities, 'elicitation' | 'extensions'>`, and its comment says the deprecated roots and sampling capabilities are not supported. The only request handler the client registers is `elicitation/create`. The 2.0.0 changelog entry (mastra-ai/mastra#23876) lists `roots`, `sampling`, `logging/setLevel`, `resources/subscribe`, the `elicitation` actions and `registerClient` as removed. 1.x had a `roots` option with `setRoots()` and `sendRootsListChanged()`.

The SDK at 2.4.0 still carries the `roots/list` and `sampling/createMessage` handler surfaces. Its class comment marks them deprecated as of 2026-07-28 under SEP-2577 and says they stay functional for the deprecation window. Mastra removed them for every connection, so a 2025-11-25 server reached through the fallback handshake also sees a client with no roots and no sampling.

## What changed with the era

`negotiationMode` maps an entry with no `protocolVersion` to the SDK's `auto` mode. The SDK's own default is `legacy`, so probing `server/discover` first is Mastra's decision. The fallback is the `initialize` handshake at the SDK's `LATEST_PROTOCOL_VERSION`, 2025-11-25.

On a legacy connection three things differ. `resources.subscribe()` throws, because it needs `subscriptions/listen` and `resources/subscribe` is never sent. `logging/setLevel` is never sent, though the `notifications/message` handler is still registered. List-changed handlers run on the server's unprompted notifications with no stream opened.

A `url` entry builds `StreamableHTTPClientTransport` and nothing else. The HTTP+SSE fallback that 1.x ran after a failed Streamable HTTP connect was removed in the same release, and the SDK's `SSEClientTransport` is not imported.

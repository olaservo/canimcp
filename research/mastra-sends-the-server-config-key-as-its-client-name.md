---
id: mastra-sends-the-server-config-key-as-its-client-name
title: Mastra's MCPClient tells each server the name the application gave that server
kind: idiosyncrasy
summary: At bb984550 MCPClient sends the key of the `servers` map as `clientInfo.name` and `1.0.0` as the version unless the application sets `clientInfo`. The probe's server, configured as `probe`, saw a client called `probe`. No default value identifies Mastra.
capabilities:
  - clientInfoNames
clients:
  - mastra
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/client.ts, InternalMastraMCPClient constructor
    commit: ad1a04ff
    path: packages/mcp/src/client/client.ts:InternalMastraMCPClient
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/configuration.ts, MCPClientOptions.clientInfo and getOrCreateClient
    commit: ad1a04ff
    path: packages/mcp/src/client/configuration.ts:MCPClientOptions,MCPClient.getOrCreateClient
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/types.ts, MCPClientInfo and the per-server override
    commit: ad1a04ff
    path: packages/mcp/src/client/types.ts:MCPClientInfo,BaseServerOptions
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: mastracode/sdk/src/mcp/manager.ts, Mastra Code's MCPClient construction
    commit: ad1a04ff
    path: mastracode/sdk/src/mcp/manager.ts:connectAndCollectTools
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/editor/src/namespaces/mcp.ts, toMCPClientOptions
    commit: ad1a04ff
    path: packages/editor/src/namespaces/mcp.ts:toMCPClientOptions
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/connect/src/multi-connection.ts, one MCPClient per connection
    commit: ad1a04ff
    path: packages/connect/src/multi-connection.ts:buildMcpMultiConnectionTools
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: client-sdks/react/src/hooks/mcps/use-try-connect-mcp.ts, the one fixed name
    commit: ad1a04ff
    path: client-sdks/react/src/hooks/mcps/use-try-connect-mcp.ts:connectAndListTools
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - hermes-goes-on-the-wire-as-mcp
  - goose-client-name-varies-by-surface
  - mastra-studio-previews-servers-with-a-hand-written-initialize
  - strands-sends-the-server-config-key-as-client-name
---

# Mastra's MCPClient tells each server the name the application gave that server

`MCPClient` creates one `InternalMastraMCPClient` per entry in its `servers` map and passes the entry's key as `name`. The constructor hands the SDK `{ name: clientInfo?.name ?? name, version: clientInfo?.version ?? version }`, with `version` defaulting to `'1.0.0'`. With no `clientInfo` option the server's own config key is what goes on the wire.

The probe's adapter configures its fixture under the key `probe` and sets no `clientInfo`. Its capture of `@mastra/mcp` 2.9.0-alpha.1 shows `{"name":"probe","version":"1.0.0"}` in `_meta["io.modelcontextprotocol/clientInfo"]` on `server/discover` and on every later request, and the same object in `initialize.params.clientInfo` on the legacy run. The constructor code is the same at `bb984550`.

A server configured as `github` is told the client is called `github`. Two servers under one `MCPClient` see two different client names. Nothing in the default value names Mastra or its version, so a feed that joins on `clientInfo.name` cannot count Mastra traffic.

The application can set a name. `MCPClientOptions.clientInfo` sets a default for every server, and a server entry's `clientInfo` overrides it field by field. The option arrived with mastra-ai/mastra#26328.

The three in-repo consumers of `MCPClient` that were read do not set it. Mastra Code passes `id`, `servers` and `timeout`. The editor's `toMCPClientOptions` returns `id` and `servers`. `@mastra/connect` builds one client per connection with the integration id as the server key. Each of them is on the wire under its server keys.

The registry's `clientInfoNames` for Mastra holds `mastra-playground`, which is the literal Studio's connection preview sends from a separate hand-written client. `MCPClient` itself contributes no fixed name.

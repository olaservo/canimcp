---
id: mastra-studio-previews-servers-with-a-hand-written-initialize
title: Mastra Studio previews a server's tools with a hand-written 2025-03-26 handshake
kind: idiosyncrasy
summary: At bb984550 the Mastra monorepo has two MCP clients. Agents use MCPClient on SDK 2.4.0, which leads with 2026-07-28. Studio's form for creating an MCP client uses a hand-written fetch client that sends `initialize` at 2025-03-26 as `mastra-playground`.
capabilities:
  - clientInfoNames
  - transports.streamableHttp
  - tools
clients:
  - mastra
specVersions:
  - 2025-03-26
  - 2026-07-28
sources:
  - url: https://github.com/mastra-ai/mastra
    title: client-sdks/react/src/hooks/mcps/use-try-connect-mcp.ts, connectAndListTools
    commit: 0a31d4d0
    path: client-sdks/react/src/hooks/mcps/use-try-connect-mcp.ts
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/playground mcp-client-create-content.tsx, the form that calls it
    commit: 0a31d4d0
    path: packages/playground/src/domains/mcps/components/mcp-client-create/mcp-client-create-content.tsx:MCPClientCreateContent
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/client.ts, the SDK-based client
    commit: 0a31d4d0
    path: packages/mcp/src/client/client.ts:negotiationMode,InternalMastraMCPClient
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/editor/src/namespaces/agent.ts, stored MCP clients resolved through MCPClient
    commit: 0a31d4d0
    path: packages/editor/src/namespaces/agent.ts:resolveStoredMCPTools
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: mastracode/sdk/src/mcp/manager.ts, Mastra Code's MCPClient
    commit: 0a31d4d0
    path: mastracode/sdk/src/mcp/manager.ts:connectAndCollectTools
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - cline-hand-rolls-stdio-in-its-cli
  - mastra-sends-the-server-config-key-as-its-client-name
---

# Mastra Studio previews a server's tools with a hand-written 2025-03-26 handshake

A search of the monorepo at `bb984550` for the SDK import and for a hand-written `initialize` finds two MCP clients.

The first is `MCPClient` in `packages/mcp`, built on `@modelcontextprotocol/client` 2.4.0. Everything that runs tools goes through it: an application's `Agent`, Mastra Code (`mastracode/sdk/src/mcp/manager.ts`), the editor when it resolves a stored MCP client, `@mastra/connect`, and the `mastra-mcp generate` CLI. The registry entry describes this client.

The second is `connectAndListTools` in `client-sdks/react/src/hooks/mcps/use-try-connect-mcp.ts`, exported as the `useTryConnectMcp` hook. Studio's form for creating a stored MCP client calls it to show which tools a URL offers. It runs in the browser and uses `fetch` directly:

1. POST `initialize` with `protocolVersion: '2025-03-26'`, `capabilities: {}` and `clientInfo: { name: 'mastra-playground', version: '1.0.0' }`.
2. POST `notifications/initialized`, carrying `Mcp-Session-Id` when the server returned one.
3. POST `tools/list` with no params, and return `result.tools`.

Nothing picks between the two at run time. The form uses the hand-written client, and everything else uses `MCPClient`.

## Where the preview and the runtime client differ

The preview offers 2025-03-26 and does not read the version in the server's answer. `MCPClient` probes `server/discover` at 2026-07-28 and falls back to `initialize` at 2025-11-25. A server that serves only 2026-07-28 is reachable by `MCPClient` and is sent an `initialize` it does not serve by the preview. What Studio shows in that case was not tested.

The preview sends no `MCP-Protocol-Version` header on the requests after `initialize`. It reads one page of `tools/list` and ignores `nextCursor`, where the SDK walks every page. It takes the first `data:` line of an SSE response as the answer. It does not close the session it opened.

It speaks Streamable HTTP only, so a stdio server has no preview.

Every request copies the headers configured on the Mastra API client (`client.options.headers`) and sets `credentials: 'include'`. Those headers go to whatever URL was typed into the form.

The editor's later tool resolution for the same stored client goes through `MCPClient.listTools()`, so the tool list the form previewed and the list an agent gets come from two different clients.

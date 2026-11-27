---
id: eve-defers-every-mcp-tool-and-reads-one-page
title: eve offers MCP tools only through eve__search and eve__tool, and reads one page of tools/list
kind: idiosyncrasy
summary: No MCP tool is in the model's tool list. The model searches a catalog with eve__search and calls a result with eve__tool. eve calls tools/list with no cursor, so a tool past the server's first page cannot be found or called.
capabilities:
  - tools
  - tools.listChanged
  - instructions
clients:
  - eve
specVersions:
  - 2026-07-28
  - 2025-11-25
sources:
  - url: https://github.com/vercel/eve
    title: packages/eve/src/execution/catalog/connection-entry.ts, connectionEntry, the call path and checkCall
    commit: 4545806d
    path: packages/eve/src/execution/catalog/connection-entry.ts
    date: 2026-11-26
  - url: https://github.com/vercel/eve
    title: packages/eve/src/execution/catalog/catalog-tools.ts, catalogTools and the eve__tool route
    commit: 4545806d
    path: packages/eve/src/execution/catalog/catalog-tools.ts:catalogTools,callRoute
    date: 2026-11-26
  - url: https://github.com/vercel/eve
    title: packages/eve/src/execution/catalog/search.ts, eve__search and its result shape
    commit: 4545806d
    path: packages/eve/src/execution/catalog/search.ts
    date: 2026-11-26
  - url: https://github.com/vercel/eve
    title: packages/eve/src/runtime/connections/mcp-client.ts, #fetchToolsInner
    commit: 4545806d
    path: packages/eve/src/runtime/connections/mcp-client.ts:McpConnectionClient.fetchToolsInner
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99
    title: "@ai-sdk/mcp 2.0.99, listTools, tools() and the notification branch of onmessage"
    path: dist/index.js
    date: 2026-11-16
  - url: https://github.com/vercel/eve
    title: packages/eve/src/execution/catalog/connection-auth.ts, the listing deadline and the tool filter
    commit: 4545806d
    path: packages/eve/src/execution/catalog/connection-auth.ts
    date: 2026-11-26
  - url: https://github.com/vercel/eve
    title: packages/eve/src/context/providers/connection.ts, the registry that takes pooled clients
    commit: 4545806d
    path: packages/eve/src/context/providers/connection.ts:connectionProvider
    date: 2026-11-27
status: current
lastVerified: 2026-11-26
related:
  - codex-reads-one-page-of-tools
  - eve-patches-ai-sdk-mcp-at-build-time
---

# eve offers MCP tools only through eve__search and eve__tool, and reads one page of tools/list

A connection's tools are catalog entries. `connectionEntry` marks each one `deferred: true` with an empty description. When the agent has a connection, `catalogTools` adds two fixed tools to the step: `eve__search` and `eve__tool`. `eve__search` takes a query and returns 10 results by default and 50 at most. Each result has the name `<connection>__<tool>`, the server's description, and a signature rendered from `inputSchema` and `outputSchema`. `eve__tool({ name, input })` runs one. The header comment of `search.ts` gives the reason: the search tool's definition is fixed for each eve version, so the catalog can change without changing the model's tool list.

For a server author this moves where the tool text is read. The model reads a tool's description and schema as text inside a tool result, after it chose to search. Before that it sees the connection's authored `description`. The server's `instructions` are not read. The tool `title` is not copied into the metadata that eve builds, which holds `name`, `description`, `inputSchema`, `outputSchema` and `annotations`.

`#fetchToolsInner` calls `client.listTools()` with no arguments and builds the tool set from that one result. The SDK's `listTools` sends one `tools/list` and returns `nextCursor` with the page. The SDK's `tools()` method follows the cursor, and eve does not call it. The only reader of `nextCursor` under `packages/eve/src/runtime/connections` is the events catalog. A tool on a later page is absent from `eve__search`, and `eve__tool` rejects its name as unknown, because a call is checked against the same listing.

The listing is cached on the client. Clients come from a pool keyed by connection, session, turn and auth (`McpClientPool`): the steps of one turn share a client, and a client idle for 60 seconds is closed. A new turn, an idle close, a transport failure or an expired session builds a new client, which lists again. A changed tool list reaches eve that way. A `notifications/tools/list_changed` has no effect. The SDK passes any notification to `onUncaughtError` as an unsupported message, and eve does not set that callback. On `2026-07-28` the client opens no stream that could carry one.

Listing has a 10 second deadline per connection, and a call has a 5 minute deadline. Inputs are validated against `inputSchema` before approval and again before the call.

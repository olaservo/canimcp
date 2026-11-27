---
id: eve-goes-on-the-wire-as-ai-sdk-mcp-client
title: eve sends the AI SDK's default client name, and says eve only in a dev reachability probe
kind: idiosyncrasy
summary: At 0940c042 eve passes no client name to @ai-sdk/mcp, so every connection identifies as ai-sdk-mcp-client 1.0.0. The name eve appears only in a bare initialize that the dev TUI posts to catalog servers every 60 seconds.
capabilities:
  - clientInfoNames
clients:
  - eve
specVersions:
  - 2026-07-28
  - 2025-11-25
  - 2025-03-26
sources:
  - url: https://github.com/vercel/eve
    title: packages/eve/src/runtime/connections/mcp-client.ts, the createMCPClient calls
    commit: 4545806d
    path: packages/eve/src/runtime/connections/mcp-client.ts:McpConnectionClient.createClient
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: packages/eve/src/runtime/connections/events/actions.ts, the second client for experimental.events
    commit: 4545806d
    path: packages/eve/src/runtime/subscriptions/actions.ts:ConnectionEventActions.withClient
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99
    title: "@ai-sdk/mcp 2.0.99, CLIENT_VERSION, the clientName default and the per-request clientInfo"
    path: dist/index.js
    date: 2026-11-16
  - url: https://github.com/vercel/eve
    title: packages/eve/src/public/definitions/connections/mcp.ts, McpClientConnectionDefinition
    commit: 4545806d
    path: packages/eve/src/public/definitions/connections/mcp.ts:McpClientConnectionDefinition
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: packages/eve/src/cli/dev/tui/mcp-connection-status.ts, probeMcpConnection and its tracker
    commit: 4545806d
    path: packages/eve/src/cli/dev/tui/mcp-connection-status.ts:DEFAULT_PROBE_INTERVAL_MS,probeMcpConnection,createMcpConnectionStatusTracker
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: packages/eve/src/cli/dev/tui/tui.ts and runner.ts, where the probe is wired in for a local target
    commit: 4545806d
    path: packages/eve/src/cli/dev/tui/tui.ts:runDevelopmentTui
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: packages/eve/src/setup/scaffold/connections/catalog.ts, CONNECTION_CATALOG
    commit: 4545806d
    path: packages/eve/src/setup/scaffold/connections/catalog.ts:CONNECTION_CATALOG
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: apps/templates/personal-agent-template, a hand-written client in a template web app
    commit: 4545806d
    path: apps/templates/personal-agent-template/apps/web/server/utils/linear-mcp.ts:fetchLinearIssuesViaMcp
    date: 2026-11-27
status: current
lastVerified: 2026-11-16
related:
  - hermes-goes-on-the-wire-as-mcp
  - eve-patches-ai-sdk-mcp-at-build-time
---

# eve sends the AI SDK's default client name, and says eve only in a dev reachability probe

`McpConnectionClient` creates its client with `createMCPClient({ protocolVersionDiscovery, transport })` and passes no `name`, `clientName` or `version`. `@ai-sdk/mcp` 2.0.99 defaults those to `ai-sdk-mcp-client` and the constant `CLIENT_VERSION = "1.0.0"`. On `2026-07-28` the pair travels in `_meta["io.modelcontextprotocol/clientInfo"]` on every request. On the handshake path it is the `clientInfo` of `initialize`. The second client that eve opens for `experimental.events` is built the same way.

The version string is the SDK's constant and changes with neither eve's releases nor the SDK's. eve's `package.json` is at `1.0.0` at this commit, and the probe captured the same `1.0.0` from eve `1.0.0-rc.6`. The SDK version reaches the server in the HTTP `User-Agent`, as `ai-sdk/2.0.99` followed by the runtime. A feed that joins on `clientInfo.name` counts eve together with every other application that calls `createMCPClient` with its defaults.

An application cannot change the name. `McpClientConnectionDefinition` has no field for a client name or for capabilities.

The name `eve` is sent by different code. `probeMcpConnection` in the dev TUI posts one `initialize` request with `protocolVersion` and the `MCP-Protocol-Version` header both set to `2025-03-26`, empty capabilities, and `clientInfo` of `{ name: "eve", version: "connection-probe" }`. It treats any 2xx, 401 or 403 status as reachable and does not read the body. It sends no `notifications/initialized` and no `DELETE`. The tracker runs it against every scaffoldable entry of the built-in connection catalog that has an MCP URL, once when the TUI starts and then every 60 seconds, when the TUI targets a local app. The catalog entries are hosted servers such as `mcp.linear.app` and `mcp.notion.com`. The tracker does not check whether the app has a connection to them.

One more hand-written client is in the repo, outside the eve package. `apps/templates/personal-agent-template/apps/web/server/utils/linear-mcp.ts` sends `initialize` at `2024-11-05` as `{ name: "v", version: "1.0.0" }`. It is application code in a template.

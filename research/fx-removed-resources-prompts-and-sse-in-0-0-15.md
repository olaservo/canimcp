---
id: fx-removed-resources-prompts-and-sse-in-0-0-15
title: fx removed resources, prompts and HTTP+SSE in 0.0.15
kind: idiosyncrasy
summary: fx 0.0.15 dropped MCP resources, prompts and the HTTP+SSE transport. At c3dc80c4 its engine sends `server/discover`, `initialize`, `tools/list`, `tools/call` and `subscriptions/listen`, and no other request.
capabilities:
  - resources
  - prompts
  - transports.sse
  - completions
  - logging
clients:
  - fx
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/vercel-labs/fx
    title: CHANGELOG.md, 0.0.15 breaking changes
    commit: fd39d643
    path: CHANGELOG.md:Breaking Changes
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: CHANGELOG.md, 0.0.8 entries on resources and prompts
    commit: fd39d643
    path: CHANGELOG.md:New Features,Security
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/mcp/server.zig, the What union and onMessage
    commit: fd39d643
    path: src/mcp/server.zig:What,onMessage
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/mcp/server.zig, answerServerRequest
    commit: fd39d643
    path: src/mcp/server.zig:Server
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/core/mcp_host/config.zig, the Held reasons and heldFor
    commit: fd39d643
    path: src/core/mcp_host/config.zig:Held,heldFor
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/core/mcp_host/runtime.zig, the message for a held SSE server
    commit: fd39d643
    path: src/core/mcp_host/runtime.zig:heldReason
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/mcp/mcp.zig, the module root
    commit: fd39d643
    path: src/mcp/mcp.zig
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - cline-lists-resources-and-prompts-but-never-reads-them
  - model-initiated-resource-read
---

# fx removed resources, prompts and HTTP+SSE in 0.0.15

fx had resources and prompts once. The 0.0.8 changelog says "/mcp now opens a terminal browser for servers, tools, resources, prompts, authentication, and project trust" and "MCP resources and prompts enter the composer only after an explicit Insert action."

The 0.0.15 changelog lists three removals under Breaking Changes:

- "MCP resources and prompts are no longer supported, and the `resource` and `prompt` commands have been removed."
- "Legacy SSE MCP connections are no longer supported. Use a stdio or Streamable HTTP connection instead."
- "`FX_MCP_ENGINE` has been removed."

The source at `c3dc80c4` matches. `src/mcp/mcp.zig` opens with "MCPv2 module root". In `src/mcp/server.zig` a request is one of five kinds, `discover`, `initialize`, `list`, `call` and `listen`, which go out as `server/discover`, `initialize`, `tools/list`, `tools/call` and `subscriptions/listen`. A search of `src/` for `resources/`, `prompts/`, `completion/`, `logging/` and `tasks/` method names finds none outside the list-changed notice parser and the tests.

Incoming traffic is as narrow. The notification handler acts on `notifications/cancelled`, subscription notices, `notifications/elicitation/complete`, `notifications/tools/list_changed` and `notifications/progress`. A `notifications/message` has no branch. A 2025 server's request is answered when it is `ping` or `elicitation/create`, and gets `-32601` otherwise.

The config parser still reads `"type": "sse"`. The host holds such a server back, and the status text says "HTTP+SSE servers are not supported".

Two things follow for a server author. A server that keeps its useful context in resources or prompts gives fx nothing, and there is no model-facing resource tool to fall back on. A server reachable only over HTTP+SSE cannot be used from fx 0.0.15 or later.

The 0.0.15 changelog gives no reason for the removals, and no issue or pull request was searched for one.

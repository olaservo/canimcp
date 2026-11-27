---
id: openclaw-looks-for-events-under-the-pre-extension-key
title: OpenClaw looks for MCP Events support under capabilities.events, a key the Final extension does not use
kind: idiosyncrasy
summary: OpenClaw follows OpenAI's MCP Events profile and requires capabilities.events in server/discover. SEP-3415 puts it under capabilities.extensions["io.modelcontextprotocol/events"], so OpenClaw refuses a server that follows only SEP-3415.
capabilities:
  - extensions
  - events
  - events.webhook
clients:
  - openclaw
  - chatgpt
specVersions:
  - 2026-07-28
tracking:
  state: accepted
  seps:
    - 3415
sources:
  - url: https://github.com/openclaw/openclaw
    title: extensions/mcp-events/src/service.ts, McpEventsService.createBinding, the server/discover check
    commit: 89425fd7
    path: extensions/mcp-events/src/service.ts:McpEventsService.createBinding
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/gateway/server-methods/mcp-events.ts, the same check before the event catalog
    commit: 89425fd7
    path: src/gateway/server-methods/mcp-events.ts:mcpEventsHandlers
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: extensions/mcp-events/src/protocol.ts, MCP_EVENTS_PROFILE
    commit: 89425fd7
    path: extensions/mcp-events/src/protocol.ts:MCP_EVENTS_PROFILE
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: extensions/mcp-events/README.md, the server requirement and the protocol reference
    commit: 89425fd7
    path: extensions/mcp-events/README.md
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-event-request.ts, requestMcpEvent and the per-request _meta
    commit: 89425fd7
    path: src/agents/mcp-event-request.ts:requestMcpEvent
    date: 2026-11-27
  - url: https://developers.openai.com/plugins/build/mcp-events
    title: OpenAI, MCP Events, the server/discover example with capabilities.events
    date: 2026-11-27
  - url: https://github.com/modelcontextprotocol/experimental-ext-triggers-events/blob/main/docs/design-sketch-proposal.md
    title: experimental-ext-triggers-events, design sketch, Capability Declaration
    date: 2026-11-27
  - url: https://modelcontextprotocol.io/seps/3415-events-extension
    title: SEP-3415, Events extension, capability negotiation
    date: 2026-11-27
  - url: https://modelcontextprotocol.io/extensions/events/overview
    title: MCP Events overview, Advertise support and Declare support
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - openclaw-declares-nothing-unless-mcp-apps-is-on
---

# OpenClaw looks for MCP Events support under capabilities.events, a key the Final extension does not use

Read at openclaw/openclaw 89425fd7.

OpenClaw's bundled `mcp-events` plugin sends `server/discover` before it lists or subscribes. `McpEventsService.createBinding` accepts the server only when `supportedVersions` includes `2026-07-28` and `capabilities` has an own property `events`. The `mcp.events.list` gateway method behind the `mcp_events` tool runs the same check. A server that fails it gets "Configured MCP server does not advertise MCP 2.0 events" on a binding, and a generic "MCP event catalog unavailable" from the tool.

The plugin names its protocol `openai-webhook-2026-07-28` (`MCP_EVENTS_PROFILE`), and its README links OpenAI's MCP Events page as the protocol reference. That page shows a `server/discover` result with `"capabilities": {"tools": {}, "events": {}}`. It says ChatGPT supports webhook delivery and callback verification from the draft MCP Events specification, and links the design sketch in `experimental-ext-triggers-events`. The sketch's Capability Declaration section also uses `capabilities.events`.

SEP-3415 is Final and moved the declaration. A server advertises `io.modelcontextprotocol/events` under `capabilities.extensions` in its `server/discover` result. The overview page shows `{"capabilities": {"extensions": {"io.modelcontextprotocol/events": {"listChanged": true}}}}`. A client may declare the same identifier under `extensions` in `io.modelcontextprotocol/clientCapabilities`. `requestMcpEvent` sends that object empty.

A server that follows only SEP-3415 is refused by OpenClaw before `events/list`. A server that wants OpenClaw and SEP-3415 clients has to declare both keys. OpenClaw does not read the extension key anywhere under `extensions/mcp-events` or `src/agents`.

OpenAI's page documents ChatGPT as a client of the same profile. No ChatGPT source was read for this note.

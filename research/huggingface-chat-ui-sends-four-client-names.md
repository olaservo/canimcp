---
id: huggingface-chat-ui-sends-four-client-names
title: Hugging Face Chat UI sends a different client name for each kind of connection
kind: idiosyncrasy
summary: Chat UI introduces itself as chat-ui-mcp for chat, chat-ui-intern for ML Intern, chat-ui-health-check for the add-server check and chat-ui-mcp-probe for OAuth discovery. Only the first two declare elicitation, and only the last is a hand-written initialize.
capabilities:
  - elicitation
  - authentication.oauth
clients:
  - huggingface-chat-ui
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/client.ts, CLIENT_INFO and createMcpClient
    commit: 7fc0f672
    path: src/lib/server/mcp/client.ts:CLIENT_INFO,createMcpClient,mcpClientCapabilities
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/clientPool.ts, keyOf
    commit: 7fc0f672
    path: src/lib/server/mcp/clientPool.ts:keyOf
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/oauth/discover.ts, probeBody and probeMcpServer
    commit: 7fc0f672
    path: src/lib/server/mcp/oauth/discover.ts:probeBody,probeMcpServer
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/routes/api/mcp/health/+server.ts, POST
    commit: 7fc0f672
    path: src/routes/api/mcp/health/+server.ts:POST
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/textGeneration/mcp/runMcpFlow.ts, runMcpFlow
    commit: 7fc0f672
    path: src/lib/server/textGeneration/mcp/runMcpFlow.ts:runMcpFlow
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: scripts/probe-model.ts, hubTools
    commit: 7fc0f672
    path: scripts/probe-model.ts:hubTools
    date: 2026-11-27
  - url: https://huggingface.co/datasets/evalstate/mcp-clients/blob/904917c5574ca3c830de12131ed318dec05ea179/reports/dashboard-v1.json
    title: HF MCP client telemetry, huggingface-chatui row
    date: 2026-11-26
status: current
lastVerified: 2026-11-27
related:
  - goose-client-name-varies-by-surface
  - utilized-capability-declarations
---

# Hugging Face Chat UI sends a different client name for each kind of connection

At `7fc0f672` every SDK client in Chat UI is built by `createMcpClient`, which takes a kind and looks up the name in `CLIENT_INFO`:

```ts
session: { name: "chat-ui-mcp", version: "0.1.0", elicits: true },
intern: { name: "chat-ui-intern", version: "0.1.0", elicits: true },
health: { name: "chat-ui-health-check", version: "1.0.0", elicits: false },
```

`chat-ui-mcp` is ordinary chat, and the client that lists tools for a turn. `chat-ui-intern` is used for tool calls in ML Assistant conversations and for the ML Intern file reads. That mode is compiled in only when the build sets `ML_ASSISTANT_MODE=true`, so a default self-hosted build never sends this name. `chat-ui-health-check` is the check a user runs when adding a server. It connects, lists tools and closes.

The comment on `CLIENT_INFO` says `chat-ui-intern` exists because a server operator asked to see ML Intern traffic apart from chat. The pool key includes the kind, since the name is sent once per connection and a pooled connection opened under one name must not be handed to a caller meant to be the other.

The capability object follows the kind. Session and intern connections declare `elicitation: { form: {}, url: {} }` unless `MCP_DISABLE_ELICITATION=true`. Health-check connections declare `{}`, because no conversation is behind them to answer a prompt.

## A fourth name, outside the SDK

When a user adds a server, OAuth discovery starts with a POST that Chat UI writes by hand: an `initialize` at the SDK's `LATEST_PROTOCOL_VERSION`, 2025-11-25, with `clientInfo` `chat-ui-mcp-probe` and empty capabilities. Its only use is the status code and the `WWW-Authenticate` header. A server that answers it with 200 has seen an `initialize` that is never followed by `notifications/initialized`. This happens even when the server would negotiate 2026-07-28 with the real client.

The repo also has `scripts/probe-model.ts`, a developer script that sends its own `initialize` at 2025-03-26 as `probe-model` to list the Hub tools. It is not part of the app.

## What the telemetry joins

The HF feed at `904917c5` has one row for this client, joined on `chat-ui-mcp`. Tool calls made as `chat-ui-intern` would not reach that row. Health-check and discovery traffic makes no tool calls, so it does not count toward a tool-call row in any case.

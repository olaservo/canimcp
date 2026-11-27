---
id: huggingface-chat-ui-parks-modern-elicitations-in-its-database
title: Hugging Face Chat UI answers 2026-07-28 elicitations after the tool call has returned
kind: nuance
summary: On 2026-07-28 Chat UI stores an input_required prompt in MongoDB, ends the turn, and re-sends the call with the answer when the user replies. On a 2025-era connection the prompt is answered inside the open call, or declined when it cannot be tied to one conversation.
capabilities:
  - elicitation
  - elicitation.form
  - elicitation.url
  - sampling
clients:
  - huggingface-chat-ui
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/client.ts, createMcpClient
    commit: 7fc0f672
    path: src/lib/server/mcp/client.ts:createMcpClient
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/httpClient.ts, callMcpTool
    commit: 7fc0f672
    path: src/lib/server/mcp/httpClient.ts:callMcpTool
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/elicitation.ts, openDurableElicitation, handleElicitationRequest and routeTo
    commit: 7fc0f672
    path: src/lib/server/mcp/elicitation.ts:openDurableElicitation,handleElicitationRequest,routeTo
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/resumeElicitation.ts, resumeParkedToolCall
    commit: 7fc0f672
    path: src/lib/server/mcp/resumeElicitation.ts:resumeParkedToolCall
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/clientPool.ts, getAttributableClient
    commit: 7fc0f672
    path: src/lib/server/mcp/clientPool.ts:getAttributableClient
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/elicitationConfig.ts, getElicitationTimeoutMs
    commit: 7fc0f672
    path: src/lib/server/mcp/elicitationConfig.ts:getElicitationTimeoutMs
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
---

# Hugging Face Chat UI answers 2026-07-28 elicitations after the tool call has returned

At `7fc0f672` Chat UI declares form and URL elicitation, and what it does with a prompt depends on the era the connection negotiated.

## 2026-07-28: the call ends and is re-sent later

The client is built with `inputRequired: { autoFulfill: false }` and every `callTool` passes `allowInputRequired: true`. So when a server answers a call with `input_required`, the SDK hands that result back without calling the elicitation handler. `callMcpTool` returns it as `inputRequired`, and `openDurableElicitation` writes the question to the `mcpElicitations` collection with the tool name, arguments, the `inputRequests` key and the server's `requestState`, and shows the form in the conversation.

Nothing waits on the server. When the user answers, `resumeParkedToolCall` takes the stored row and calls the tool again with `inputResponses` and `requestState`, on whatever process and pooled connection is handling the request. The prompt stays answerable for `MCP_ELICITATION_TIMEOUT_MS`, one hour by default, and on this path that is the only bound.

Chat UI accepts exactly one entry in `inputRequests` per round, and only `elicitation/create`. A round asking two questions, or asking for `sampling/createMessage` or `roots/list`, is not opened, and the tool call ends with an error.

## 2025-era: the call stays open

On a handshake connection the server sends `elicitation/create` down the connection while `tools/call` is open, and MCP does not say which call it belongs to. Chat UI tracks which calls are in flight on each client. A call that may be elicited gets a connection keyed to its conversation on a 2025-era server, so every call on that connection belongs to one conversation. If calls from two conversations are still on one connection, the request is declined with `cancel`. The call's inactivity deadline pauses while the user answers. The server's own timeout on its request keeps running, and the `.env` comment notes that it usually ends the wait first, 60 seconds by SDK default.

A server that wants a reliable answer from a person who takes several minutes gets one only on 2026-07-28.

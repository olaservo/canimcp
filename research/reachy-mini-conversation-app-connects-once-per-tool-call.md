---
id: reachy-mini-conversation-app-connects-once-per-tool-call
title: The Reachy Mini conversation app opens a new MCP connection for every tool call
kind: idiosyncrasy
summary: Each list and each tools/call builds a new httpx2 client, transport and SDK Client, so every call pays a server/discover probe, the SDK lists tools after it, no Mcp-Param headers are sent, and a call that fails for any reason but a timeout is sent twice.
capabilities:
  - tools
  - tools.listChanged
  - tools.result.outputSchema
  - transports.streamableHttp
clients:
  - reachy-mini-conversation-app
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/pollen-robotics/reachy_mini_conversation_app
    title: src/reachy_mini_conversation_app/mcp_client.py, RemoteMcpToolClient and _connected_client
    commit: 622a3a67
    path: src/reachy_mini_conversation_app/mcp_client.py:292-381
    date: 2026-11-26
  - url: https://github.com/pollen-robotics/reachy_mini_conversation_app
    title: src/reachy_mini_conversation_app/tools/core_tools.py, RemoteMcpTool.__call__ retry
    commit: 622a3a67
    path: src/reachy_mini_conversation_app/tools/core_tools.py:96,125-140
    date: 2026-11-26
  - url: https://pypi.org/project/mcp/2.2.0/
    title: mcp 2.2.0, mcp/client/_probe.py, negotiate_auto
    path: mcp/client/_probe.py:52-113
    date: 2026-11-26
  - url: https://pypi.org/project/mcp/2.2.0/
    title: mcp 2.2.0, mcp/client/session.py, call_tool, validate_tool_result and _absorb_tool_listing
    path: mcp/client/session.py:1065-1131,1291-1309
    date: 2026-11-26
  - url: https://pypi.org/project/mcp/2.2.0/
    title: mcp 2.2.0, mcp/client/streamable_http.py, terminate_on_close
    path: mcp/client/streamable_http.py:681-686,755
    date: 2026-11-26
status: current
lastVerified: 2026-11-26
related:
  - crewai-opens-a-new-mcp-session-for-every-tool-call
  - reachy-mini-conversation-app-reaches-only-gradio-spaces
---

# The Reachy Mini conversation app opens a new MCP connection for every tool call

At `622a3a67`, `RemoteMcpToolClient._connected_client` builds a new `httpx2.AsyncClient`, a new `streamable_http_client` and a new `mcp.Client` each time it is entered, and closes all three on exit. `list_tool_specs` and `call_tool` each enter it once. `Client` is built from the transport alone, so `mode` is the SDK default `auto`.

## What a server sees for one model tool call

This order is read from the code and mcp 2.2.0. No probe run has captured it.

1. `server/discover` at `2026-07-28`. A server that answers with a modern version gets the rest of the exchange in the per-request `_meta` envelope. Any other answer leads to `initialize` offering `2025-11-25`, then `notifications/initialized`.
2. `tools/call`.
3. `tools/list`, one page with no cursor, when the result is not an error. `ClientSession.call_tool` validates `structuredContent` against the tool's `outputSchema` and lists tools first when the session has no cached schema. A per-call session never has one. A tool that is not on the first page is logged and left unvalidated.
4. A DELETE when the transport closes, if a handshake-era server issued a session id. `streamable_http_client` defaults to `terminate_on_close=True`.

## What follows from it

- On a `2026-07-28` connection the SDK mirrors arguments annotated with `x-mcp-header` into `Mcp-Param-*` request headers only for tools listed earlier on the same session. `tools/call` is the first request after discover, so those headers are never sent.
- No session is open between calls and `Client` gets no `message_handler`, so `notifications/tools/list_changed` has nothing to arrive on. The model's tool list comes from `installed_tool_spaces.json`, written when a person installs or refreshes a Space.
- `RemoteMcpTool.__call__` sends the call again after 0.25 s when it raises `McpToolInvocationError`. `call_tool` wraps every exception that is not a timeout in that class, including the SDK's `RuntimeError` for `structuredContent` that fails `outputSchema`. The server has run the tool by then, so a non-idempotent tool runs twice before the model sees the error. Timeouts are not retried.
- The SDK's response cache is on by default, and it lives inside each `Client`, so nothing is reused from one call to the next.

crewAI's native route has the same shape on mcp 1.30.0 ([[crewai-opens-a-new-mcp-session-for-every-tool-call]]). This client adds the discover probe in front of each call because it runs on the 2.x SDK in `auto` mode.

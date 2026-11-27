---
id: crewai-opens-a-new-mcp-session-for-every-tool-call
title: crewAI opens a new MCP session for every tool call
kind: idiosyncrasy
summary: On the native mcps route crewAI connects once to list tools, disconnects, then builds a new client, transport and handshake for each tool call. A stdio server is started again for every call, and no session stays open to receive a notification.
capabilities:
  - tools
  - tools.listChanged
  - tools.result.outputSchema
  - transports.stdio
  - transports.streamableHttp
  - logging
clients:
  - crewai
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/tools/mcp_native_tool.py, MCPNativeTool
    commit: 77237aec
    path: lib/crewai/src/crewai/tools/mcp_native_tool.py:MCPNativeTool,MCPNativeTool._run_async
    date: 2026-11-27
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/mcp/tool_resolver.py, _resolve_native and its client factory
    commit: 77237aec
    path: lib/crewai/src/crewai/mcp/tool_resolver.py:MCPToolResolver._resolve_native,MCPToolResolver._client_factory
    date: 2026-11-27
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/mcp/client.py, timeouts, the tool list cache and _retry_operation
    commit: 77237aec
    path: lib/crewai/src/crewai/mcp/client.py:MCPClient.connect,MCPClient.list_tools,MCPClient._retry_operation
    date: 2026-11-27
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/mcp/transports/http.py, terminate_on_close
    commit: 77237aec
    path: lib/crewai/src/crewai/mcp/transports/http.py:HTTPTransport.connect
    date: 2026-11-27
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/agent/core.py, get_mcp_tools builds a new resolver each time
    commit: 758b2c1d
    path: lib/crewai/src/crewai/agent/core.py:Agent.get_mcp_tools,Agent._prepare_kickoff
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/crew.py, MCP tools injected per task
    commit: 758b2c1d
    path: lib/crewai/src/crewai/crew.py:Crew._prepare_tools,Crew._inject_mcp_tools
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, ClientSession.call_tool and _validate_tool_result
    path: mcp/client/session.py
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, streamable_http_client session termination
    path: mcp/client/streamable_http.py
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - crewai-reaches-mcp-through-four-entry-points
---

# crewAI opens a new MCP session for every tool call

At `758b2c1d`, `MCPToolResolver._resolve_native` builds a discovery `MCPClient`, connects, calls `list_tools`, and disconnects. It keeps no client. Each `MCPNativeTool` it returns holds a `client_factory` closure that builds a new transport and a new `MCPClient`.

`MCPNativeTool._run_async` calls the factory, connects, calls the tool, and disconnects in `finally`. The class docstring gives the reason: parallel calls that shared connection state caused anyio cancel-scope errors.

## What a server sees

The probe's stdio capture of 1.15.37 for one agent turn that calls one tool (`probe/runs/crewai@1.15.37/default/both-stdio/tools.result.summary_and_data/wire.jsonl`) has this order:

1. `initialize`, `notifications/initialized` and `tools/list` on the discovery session.
2. `initialize`, `notifications/initialized` and `tools/call` on a second session.
3. `tools/list` on the second session.

The last request is the SDK's. `ClientSession.call_tool` validates `structuredContent` against the tool's `outputSchema` when the result is not an error, and a session that has not listed tools lists them first. A per-call session never has. The HTTP capture has the same order.

## What follows from it

Each point is read from the code at `758b2c1d`.

- A stdio server is one process for discovery and one more for each call. State held in the server process does not carry from one call to the next.
- A Streamable HTTP server that issues session ids sees one session per call. `HTTPTransport` passes `terminate_on_close=True`, so the SDK sends a DELETE as each one closes.
- No session is open between calls, and `ClientSession` gets no `message_handler` or `logging_callback`. `notifications/tools/list_changed`, log messages and progress have nothing to arrive on.
- `get_mcp_tools` builds a new resolver each time it runs, so the tool list is read again when a crew prepares the next task or an agent kicks off again. `cache_tools_list=True` keeps the first list for five minutes in a module-level dict.
- `MCPClient._retry_operation` sends a failed or timed-out `tools/call` again on the same per-call session, up to three attempts with a one and then two second wait. The execution timeout is 30 seconds.

## The other routes

The `https://` string route has the same shape. `_discover_mcp_tools` opens one session to list tools and `MCPToolWrapper._execute_tool` opens one per call. The adapter route differs: mcpadapt keeps one session per server open on a background thread until `MCPServerAdapter.stop()`. [[crewai-reaches-mcp-through-four-entry-points]] compares the routes.

---
id: adk-python-declares-no-client-capabilities-by-default
title: ADK Python declares no client capabilities unless the application passes callbacks
kind: nuance
summary: A default McpToolset sends an empty capability object. Passing sampling_callback or elicitation_callback makes the SDK declare them. There is no roots or logging parameter, and on 2026-07-28 an input_required tool result raises before any callback runs.
capabilities:
  - sampling
  - elicitation
  - elicitation.form
  - elicitation.url
  - roots
  - logging
clients:
  - adk-python
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/google/adk-python
    title: src/google/adk/tools/mcp_tool/session_context.py, the ClientSession construction
    commit: c6586f19
    path: src/google/adk/tools/mcp_tool/session_context.py:452-481
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: src/google/adk/tools/mcp_tool/mcp_toolset.py, the McpToolset constructor and McpToolsetConfig
    commit: c6586f19
    path: src/google/adk/tools/mcp_tool/mcp_toolset.py:151-182,247-281,735-760
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: src/google/adk/agents/mcp_instruction_provider.py, a session manager with no callbacks
    commit: c6586f19
    path: src/google/adk/agents/mcp_instruction_provider.py:47-50
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: src/google/adk/tools/mcp_tool/mcp_tool.py, the tools/call request and the error boundary
    commit: c6586f19
    path: src/google/adk/tools/mcp_tool/mcp_tool.py:653-662,756-760,815-820
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/2.3.0/
    title: mcp 2.3.0, _build_capabilities, call_tool and the input_required driver
    path: mcp/client/session.py:614-649,1062,1104-1106, mcp/client/_input_required.py:1-10
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - utilized-capability-declarations
  - cline-declares-no-client-capabilities
  - fast-agent-declares-capabilities-per-server
  - adk-python-modern-protocol-needs-sdk-2-and-a-flag
---

# ADK Python declares no client capabilities unless the application passes callbacks

Read at `c6586f19`. SDK behaviour is from the `mcp` 2.3.0 wheel.

## The default

The Python SDK derives the client capability object from the callbacks given to `ClientSession`. ADK builds its `ClientSession` in one place, `SessionContext._run`. It passes `sampling_callback`, `sampling_capabilities`, `elicitation_callback` and `message_handler` through from the application, and all four default to `None` on `McpToolset`. It always passes `client_info`, which is `google-adk` and the ADK version. It never passes `list_roots_callback` or `logging_callback`.

A default construction therefore sends `"capabilities": {}`. The probe's `initialize` capture at 2.14.0 shows the same.

| Capability | Default | What the application can change |
|---|---|---|
| `sampling` | not declared | Pass `sampling_callback`. The SDK then declares `sampling`, using `sampling_capabilities` as the value when it is given. |
| `elicitation` | not declared | Pass `elicitation_callback`. The SDK then declares `form` and `url` together. |
| `roots` | not declared | Nothing. `McpToolset` has no parameter for a roots callback. |
| logging | no client capability exists | Pass `message_handler` to receive `notifications/message` with every other notification. ADK never calls `logging/setLevel`. |

ADK ships no implementation of either callback. The handler, and for sampling the model behind it, are the application's code. No file under `src/` outside the three MCP client modules mentions `sampling_callback` or `elicitation_callback`.

Two construction routes cannot carry a callback at all. `McpInstructionProvider` builds its own `MCPSessionManager` with only the connection params and an error stream. `McpToolset.from_config`, used for agent config files, reads `McpToolsetConfig`, which has no callback field.

## On a 2026-07-28 connection

This section was read from source and not run.

With `ADK_ENABLE_MCP_MODERN_PROTOCOL` set on SDK 2.x, the capability object travels in the `_meta` of every request. It is built by the same function, so an application callback is still advertised.

At `2026-07-28` a server asks for sampling, elicitation or roots by returning an `InputRequiredResult` from `tools/call`. `McpTool._call_tool_on_session` calls `session.call_tool(name, arguments=..., progress_callback=..., meta=...)` and does not pass `allow_input_required`. In `mcp` 2.3.0 that makes `call_tool` raise `RuntimeError` when the server returns an `InputRequiredResult`. The loop that answers the embedded requests from the callbacks and retries is built by the SDK's high-level `Client`, and ADK uses `ClientSession` directly.

`McpTool.run_async` catches the error under its default graceful-error setting and returns `{"error": "Unexpected error during MCP tool execution: ..."}` to the model. The application callback is not called. A comment in `_run_async_impl` beside the `resultType` handling says that acting on `input_required` "is a feature, not compatibility".

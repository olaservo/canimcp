---
id: crewai-reaches-mcp-through-four-entry-points
title: crewAI reaches MCP servers through four entry points on three client code paths
kind: idiosyncrasy
summary: An agent's mcps list sends config objects and AMP slugs to crewAI's MCPClient and https:// strings to a separate wrapper, and crewai-tools adds MCPServerAdapter on mcpadapt. All four build an mcp 1.30.0 ClientSession and send clientInfo mcp 0.1.0.
capabilities:
  - clientInfoNames
  - transports.sse
  - transports.streamableHttp
  - authentication.header
  - tools
  - tools.result.isError
clients:
  - crewai
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/mcp/tool_resolver.py, MCPToolResolver.resolve and the three resolvers
    commit: 758b2c1d
    path: lib/crewai/src/crewai/mcp/tool_resolver.py:81-101,121-232,234-296,335-357,507-526,659-689
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/mcp/client.py, MCPClient.connect
    commit: 758b2c1d
    path: lib/crewai/src/crewai/mcp/client.py:187-207
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/tools/mcp_tool_wrapper.py, MCPToolWrapper
    commit: 758b2c1d
    path: lib/crewai/src/crewai/tools/mcp_tool_wrapper.py:52,79-84,165-184
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/utilities/string_utils.py, sanitize_tool_name
    commit: 758b2c1d
    path: lib/crewai/src/crewai/utilities/string_utils.py:14-16,26-60
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/agents/agent_builder/base_agent.py, validate_mcps
    commit: 758b2c1d
    path: lib/crewai/src/crewai/agents/agent_builder/base_agent.py:178-180,562-595
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/project/crew_base.py, get_mcp_tools on a CrewBase class
    commit: 758b2c1d
    path: lib/crewai/src/crewai/project/crew_base.py:159-166,311-334
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai-tools/src/crewai_tools/adapters/mcp_adapter.py, CrewAIToolAdapter and MCPServerAdapter
    commit: 758b2c1d
    path: lib/crewai-tools/src/crewai_tools/adapters/mcp_adapter.py:26-89,136-198
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: merge_agent_handler_tool.py, hand-written tools/list and tools/call
    commit: 758b2c1d
    path: lib/crewai-tools/src/crewai_tools/tools/merge_agent_handler_tool/merge_agent_handler_tool.py:73-125,187
    date: 2026-11-16
  - url: https://pypi.org/project/mcpadapt/0.1.20/
    title: mcpadapt 0.1.20, mcpadapt/core.py, mcptools and MCPAdapt
    path: mcpadapt/core.py:24-28,105-138,226-246,263-290
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, DEFAULT_CLIENT_INFO and the client_info fallback
    path: mcp/client/session.py:19,144
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - crewai-opens-a-new-mcp-session-for-every-tool-call
  - crewai-caps-the-sdk-below-mcp-2
  - hermes-goes-on-the-wire-as-mcp
---

# crewAI reaches MCP servers through four entry points on three client code paths

At `758b2c1d` (1.15.41) an application can hand crewAI an MCP server in four ways. Three go through the `mcps` field on an agent and one through crewai-tools.

| Entry point | Client code | Transports | Headers | Session | Name sent on `tools/call` | `isError` |
|---|---|---|---|---|---|---|
| `MCPServerStdio`, `MCPServerHTTP` or `MCPServerSSE` in `mcps` | `crewai.mcp.MCPClient` | stdio, Streamable HTTP, SSE | from the config | new per call | the server's name | read, becomes a `ToolFailure` |
| an `https://` string in `mcps` | `_discover_mcp_tools` and `MCPToolWrapper` | Streamable HTTP | none | new per call | the sanitized name | not read |
| a slug such as `notion` in `mcps` | config fetched from the CrewAI+ API, then `MCPClient` | Streamable HTTP or SSE | from the fetched config | new per call | the server's name | read |
| `MCPServerAdapter` in crewai-tools | `mcpadapt.core.MCPAdapt` | stdio, SSE, Streamable HTTP, WebSocket | keyword arguments in the params dict | one, kept open on a background thread | the server's name | not read |

The registry rows describe the first one. The probe's `default` configuration ran it, and its `crewai-tools` configuration ran the fourth.

## How mcps is routed

`MCPToolResolver.resolve` picks among the first three by type. A string that starts with `https://` goes to `_resolve_external`. Any other string is parsed as an AMP reference, with an optional `crewai-amp:` prefix and an optional `#tool` suffix. A config object goes to `_resolve_native`. The field validator on `BaseAgent.mcps` accepts a string only when it is an `https://` URL or matches the slug pattern, so `http://localhost:8000/mcp` as a string raises `Invalid MCP reference` and a plain-http server needs `MCPServerHTTP`.

## The https:// string route

This route is a separate implementation of discovery and calling. `_discover_mcp_tools` keys each tool by `sanitize_tool_name(tool.name)`. `MCPToolWrapper` stores that key as `_original_tool_name`, and `_execute_tool` passes it to `session.call_tool`. `sanitize_tool_name` splits camelCase, lowercases, and replaces every run of characters outside `a-zA-Z0-9` with an underscore. From the code, a server tool named `getWeather` or `get-weather` is called as `get_weather`. I did not run this against a server. The native route keeps the server's name in `original_name` and sends that.

The same route calls `streamablehttp_client(server_url)` with no headers, so it reaches only servers that need no credentials. It returns connection and execution errors to the model as ordinary strings, and it never reads `isError`.

## The slug route

`_fetch_amp_mcp_configs` imports `get_platform_integration_token` from `crewai_tools`, which reads `CREWAI_ENTERPRISE_ACTION_AUTH_TOKEN` or `CREWAI_PLATFORM_INTEGRATION_TOKEN`, and calls `PlusAPI.get_mcp_configs` with the slugs. Any failure there, a missing crewai-tools install included, returns an empty map, and each slug then produces an `MCPConfigFetchFailedEvent`. A returned config becomes `MCPServerSSE` when its `type` is `sse` and `MCPServerHTTP` otherwise, and from there it is the native route.

## The adapter route

`MCPServerAdapter` hands the connection to mcpadapt, which `uv.lock` resolves to 0.1.19 below Python 3.12 and 0.1.20 from 3.12. The two versions have the same `core.py`. crewAI supplies only `CrewAIToolAdapter`, which turns each listed tool into a `BaseTool`. `MCPAdapt` runs an event loop on a daemon thread, opens one `ClientSession` per server, and keeps it open until `stop()`. A params dict with no `transport` key connects over SSE, and `streamable-http` and `ws` are the other accepted values.

crewAI's own package reaches this route too. A `@CrewBase` class with an `mcp_server_params` attribute gets a `get_mcp_tools()` method that imports `MCPServerAdapter` from `crewai_tools` and builds one.

## One name on the wire

Every route constructs the SDK's `ClientSession` with no `client_info`: `MCPClient.connect`, `_discover_mcp_tools`, `MCPToolWrapper._execute_tool` and mcpadapt's `mcptools`. mcp 1.30.0 falls back to `Implementation(name="mcp", version="0.1.0")`. The probe recorded that name on both configurations of 1.15.37, with `capabilities: {}`. A server cannot tell crewAI from any other caller that leaves the SDK default in place. [[hermes-goes-on-the-wire-as-mcp]] records the same for older Hermes builds.

## A fifth caller that is not an MCP client

`MergeAgentHandlerTool` in crewai-tools posts hand-written JSON-RPC `tools/list` and `tools/call` frames to the Merge Agent Handler service with a bearer token and an `Mcp-Session-Id` header it fills in itself. It sends no `initialize` and no protocol version, and it talks to one vendor's endpoint. The registry rows do not describe it.

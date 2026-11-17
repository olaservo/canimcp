---
id: crewai-caps-the-sdk-below-mcp-2
title: crewAI requires mcp below 2, so no install of it can speak 2026-07-28
kind: gap
summary: crewAI and crewai-tools require mcp>=1.30.0,<2 and lock 1.30.0, the newest 1.x release, which proposes 2025-11-25. Three call sites import an SDK function that mcp 2.3.0 no longer has, and mcpadapt 0.1.20 imports two.
capabilities:
  - transports.streamableHttp
clients:
  - crewai
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/pyproject.toml, the base dependency on mcp
    commit: 758b2c1d
    path: lib/crewai/pyproject.toml:46,98-99
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai-tools/pyproject.toml, the mcp extra
    commit: 758b2c1d
    path: lib/crewai-tools/pyproject.toml:118-121
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: uv.lock, mcp 1.30.0 and mcpadapt 0.1.19 and 0.1.20
    commit: 758b2c1d
    path: uv.lock:4767-4768,4798-4799,4825-4826
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: pyproject.toml, [tool.uv] overrides and the litellm comment
    commit: 758b2c1d
    path: pyproject.toml:312-317,326-375
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/mcp/transports/http.py, the streamablehttp_client import
    commit: 758b2c1d
    path: lib/crewai/src/crewai/mcp/transports/http.py:122-127
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/mcp/tool_resolver.py, the same import on the https string route
    commit: 758b2c1d
    path: lib/crewai/src/crewai/mcp/tool_resolver.py:661-662
    date: 2026-11-16
  - url: https://github.com/crewAIInc/crewAI
    title: lib/crewai/src/crewai/tools/mcp_tool_wrapper.py, the same import in MCPToolWrapper
    commit: 758b2c1d
    path: lib/crewai/src/crewai/tools/mcp_tool_wrapper.py:165-166
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, LATEST_PROTOCOL_VERSION, SUPPORTED_PROTOCOL_VERSIONS and the deprecated streamablehttp_client alias
    path: mcp/types.py:27
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/2.3.0/
    title: mcp 2.3.0, mcp/client/streamable_http.py defines only streamable_http_client, and mcp/client has no websocket module
    path: mcp/client/streamable_http.py:713
    date: 2026-11-16
  - url: https://pypi.org/project/mcpadapt/0.1.20/
    title: mcpadapt 0.1.20, module-level SDK imports and the mcp requirement
    path: mcpadapt/core.py:16-21
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - crewai-reaches-mcp-through-four-entry-points
---

# crewAI requires mcp below 2, so no install of it can speak 2026-07-28

## The requirement

At `758b2c1d` (1.15.41), `lib/crewai/pyproject.toml` lists `"mcp>=1.30.0,<2"` as a base dependency. The `mcp` extra of `lib/crewai-tools/pyproject.toml` repeats it next to `"mcpadapt>=0.1.9"`. `uv.lock` resolves `mcp` to 1.30.0. On 2026-11-16 PyPI lists 1.30.0, released 2026-09-07, as the newest 1.x release and 2.3.0 as the newest overall. An August scan recorded crewAI-tools on `mcp>=1.6.0`. The requirement at this commit is the one above.

The SDK is not patched. The root `[tool.uv]` block has a long `override-dependencies` list with no `mcp` entry, `[tool.uv.sources]` names only workspace members, and the repository has no patches directory and no vendored copy.

## What that fixes

crewAI names no protocol revision. Every route calls `ClientSession.initialize()`, and mcp 1.30.0 sends `LATEST_PROTOCOL_VERSION`, which is `2025-11-25`. It accepts `2024-11-05`, `2025-03-26`, `2025-06-18` and `2025-11-25` in the reply and raises on anything else. No flag, extra or environment variable in crewAI selects another SDK line, so `2026-07-28` is unreachable from any install that satisfies the requirement.

## What lifting the cap would touch

`HTTPTransport.connect`, `MCPToolResolver._discover_mcp_tools` and `MCPToolWrapper._execute_tool` each import `streamablehttp_client` from `mcp.client.streamable_http`. In 1.30.0 that function is a deprecated wrapper around `streamable_http_client`. The 2.3.0 wheel defines only `streamable_http_client`. `HTTPTransport.connect` catches the `ImportError` and reports `MCP library not available. Please install with: pip install mcp`, so from the code a forced mcp 2.x install would fail with that message. I did not run it.

The adapter route has the same dependency one level down. mcpadapt 0.1.20 imports `streamablehttp_client` and `mcp.client.websocket.websocket_client` when `mcpadapt.core` loads, and the 2.3.0 wheel has neither. mcpadapt's own requirement is `mcp[ws]>=1.10.1` with no upper bound. 0.1.20, released 2025-10-24, is its newest release.

## One pin the cap already explains

A comment in the root `pyproject.toml` says litellm 1.106.x "imports mcp.types.CacheableResult, which no released mcp 1.x has, so its tool calls fail". The `litellm` extra is held at `>=1.105.3,<1.105.4`.

## Not checked

I did not find an upstream issue or branch that tracks a move to mcp 2.x. One search of crewAIInc/crewAI issues for "mcp 2.0 SDK upgrade" returned nothing, which does not show that none exists.

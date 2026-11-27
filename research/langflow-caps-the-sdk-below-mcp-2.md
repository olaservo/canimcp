---
id: langflow-caps-the-sdk-below-mcp-2
title: Langflow requires mcp below 2 for its client and pins the servers it launches below 2 as well
kind: gap
summary: lfx and langflow-base require mcp>=1.30.0,<2.0.0 and lock 1.30.0, which proposes 2025-11-25, so 2026-07-28 is unreachable. Langflow also injects --with mcp~=1.28 into every uvx server it launches, because mcp-proxy and mcp-composer fail to import under the 2.0 SDK.
capabilities:
  - transports.stdio
  - transports.streamableHttp
clients:
  - langflow
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/pyproject.toml, the mcp requirement of lfx
    commit: 21381e5b
    path: src/lfx/pyproject.toml
    date: 2026-11-20
  - url: https://github.com/langflow-ai/langflow
    title: src/backend/base/pyproject.toml, the mcp requirement of langflow-base and its mcp extra
    commit: 21381e5b
    path: src/backend/base/pyproject.toml
    date: 2026-11-20
  - url: https://github.com/langflow-ai/langflow
    title: uv.lock, mcp 1.30.0
    commit: 21381e5b
    path: uv.lock
    date: 2026-11-20
  - url: https://github.com/langflow-ai/langflow
    title: pyproject.toml, [tool.uv] constraint and override lists with no mcp entry
    commit: 21381e5b
    path: pyproject.toml
    date: 2026-11-20
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/base/mcp/uvx.py, the injected SDK constraint and its reason
    commit: 6c9aea6f
    path: src/lfx/src/lfx/base/mcp/uvx.py:DEFAULT_MCP_SDK_CONSTRAINT,mcp_sdk_constraint_args
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/services/settings/groups/mcp.py, LANGFLOW_MCP_SDK_CONSTRAINT
    commit: 6c9aea6f
    path: src/lfx/src/lfx/services/settings/groups/mcp.py:McpSettings
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/backend/base/langflow/api/utils/mcp/config_utils.py, the uvx mcp-proxy entry written for each user's starter project
    commit: 6c9aea6f
    path: src/backend/base/langflow/api/utils/mcp/config_utils.py:auto_configure_starter_projects_mcp
    date: 2026-11-27
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, LATEST_PROTOCOL_VERSION and SUPPORTED_PROTOCOL_VERSIONS
    path: mcp/types.py
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - langflow-speaks-mcp-through-its-own-sdk-wrapper
  - crewai-caps-the-sdk-below-mcp-2
---

# Langflow requires mcp below 2 for its client and pins the servers it launches below 2 as well

## The client's requirement

At `21381e5b` (Langflow 1.13.3), `src/lfx/pyproject.toml` and `src/backend/base/pyproject.toml` both list `mcp>=1.30.0,<2.0.0` as a base dependency, and the `mcp` extra of langflow-base repeats it. `uv.lock` resolves `mcp` to 1.30.0. The SDK is not patched: the root `[tool.uv]` block has `constraint-dependencies` and `override-dependencies` lists with no `mcp` entry, `[tool.uv.sources]` names only workspace members, and the repository has no patch files or vendored copy of the SDK.

Langflow names no protocol revision. A `git grep` of the non-test client code finds no `LATEST_PROTOCOL_VERSION`, `protocolVersion`, `2026-07-28` or `server/discover`. Every session calls `ClientSession.initialize()`, and mcp 1.30.0 proposes `2025-11-25` and accepts `2024-11-05`, `2025-03-26`, `2025-06-18` and `2025-11-25` in the reply. No setting selects another SDK line, so `2026-07-28` is unreachable from an install that satisfies the requirement.

## The servers it launches

`lfx.base.mcp.uvx` adds a second pin that applies to servers, not to the client. When Langflow itself launches a server through `uvx`, such as `mcp-proxy` for a project's own MCP server or `mcp-composer`, it splices `--with mcp~=1.28` into the argv. The module's docstring gives the reason: `uvx` builds a fresh environment, those packages declare an unbounded `mcp>=1.x`, and the 2.0 SDK "removed `request_ctx` and renamed `McpError`, so those packages fail at import". The constraint is the setting `mcp_sdk_constraint`, env var `LANGFLOW_MCP_SDK_CONSTRAINT`, and an empty value turns the injection off. The setting's description says to do that "once upstream supports the 2.x SDK".

The arguments are spliced in where Langflow writes a server entry itself: the per-project `uvx mcp-proxy --transport streamablehttp <url>` entries that `add_projects_to_mcp_servers` (default on) adds to each user's MCP server list, the project MCP routes, and the MCP Composer service. A user who selects one of those project entries in the MCP Tools component gets a Langflow client on mcp 1.30.0 talking over stdio to `mcp-proxy` on an SDK in `~=1.28`, which talks over Streamable HTTP to Langflow's own server. A stdio server a user registers by hand with `uvx` does not get the flag.

## Not checked

I did not find an upstream issue or branch that tracks a move to mcp 2.x, and I did not search for one.

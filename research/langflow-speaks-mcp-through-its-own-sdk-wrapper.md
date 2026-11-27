---
id: langflow-speaks-mcp-through-its-own-sdk-wrapper
title: Langflow's MCP client is its own wrapper on the mcp SDK, and langchain-mcp-adapters is an unused extra
kind: misconception
summary: Langflow lists langchain-mcp-adapters as an optional extra, and no Langflow code imports it. Every MCP server connection goes through lfx.base.mcp.util, which builds a bare SDK ClientSession, so the wire name is the SDK placeholder mcp and no client capability is declared.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - sampling
  - elicitation
  - roots
clients:
  - langflow
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/langflow-ai/langflow
    title: src/backend/base/pyproject.toml, the mcp base dependency and the langchain-mcp-adapters extra
    commit: 2b6faa1c
    path: src/backend/base/pyproject.toml
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/pyproject.toml, the mcp base dependency of lfx
    commit: 2b6faa1c
    path: src/lfx/pyproject.toml
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/base/mcp/util.py, ClientSession construction on the stdio, Streamable HTTP and SSE paths
    commit: 2b6faa1c
    path: src/lfx/src/lfx/base/mcp/util.py:MCPSessionManager.session_task
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/backend/base/langflow/api/utils/mcp/discovery.py, the server-list check uses the same two client classes
    commit: 2b6faa1c
    path: src/backend/base/langflow/api/utils/mcp/discovery.py:discovery_clients
    date: 2026-11-27
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, DEFAULT_CLIENT_INFO and the capability object built in initialize
    path: mcp/client/session.py
    date: 2026-11-20
status: current
lastVerified: 2026-11-27
related:
  - langflow-caps-the-sdk-below-mcp-2
---

# Langflow's MCP client is its own wrapper on the mcp SDK, and langchain-mcp-adapters is an unused extra

## What the manifests suggest

At `21381e5b` (Langflow 1.13.3), `src/backend/base/pyproject.toml` declares `mcp>=1.30.0,<2.0.0` as a base dependency and, separately, an optional extra `langchain-mcp-adapters = ["langchain-mcp-adapters>=0.1.14,<0.2.0"]`. `uv.lock` resolves the adapter to 0.1.14. A reader of the manifests could take Langflow for a LangChain host that reaches MCP through the adapter, as the batch plan did on 2026-11-09.

## What the code does

No file in the repository imports `langchain_mcp_adapters`. A `git grep` for `langchain_mcp` and `langchain-mcp` outside `uv.lock` finds only the extra's line in `pyproject.toml`. The lockfile also pulls the adapter in as a dependency of the third-party `cuga` package, which Langflow's CUGA agent component imports. Langflow's own code in that component does not open MCP sessions. I did not read inside the `cuga` package.

Every MCP server connection goes through `MCPStdioClient` and `MCPStreamableHttpClient` in `src/lfx/src/lfx/base/mcp/util.py`. Three call sites use them: the MCP Tools component, the preset components that bundles ship (`lfx.base.mcp.preset`, used by the IBM watsonx.data and Confluent bundles), and the `GET /api/v2/mcp/servers?action_count=true` check that counts each registered server's tools. Both classes hand their sessions to one `MCPSessionManager`, which constructs `ClientSession(read, write)` with no other argument on the stdio path, the Streamable HTTP path and the SSE path.

## What follows on the wire

With no `client_info`, mcp 1.30.0 sends `Implementation(name="mcp", version="0.1.0")`. With no sampling, elicitation or list-roots callback, the capability object it builds has none of the three, and the experimental task handlers build none either. Langflow therefore goes on the wire as `mcp` with empty client capabilities, the same as every other bare caller of the Python SDK. A telemetry row under `mcp` cannot be attributed to Langflow.

The tools are LangChain `StructuredTool` objects that Langflow builds itself from `tools/list`. The adapter's tool conversion, its result conversion and its session handling play no part.

## Not checked

I did not check whether any starter project or template flow installs the `langchain-mcp-adapters` extra, or whether the Langflow Desktop build includes it. Neither changes the route, since nothing imports it.

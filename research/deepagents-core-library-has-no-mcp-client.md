---
id: deepagents-core-library-has-no-mcp-client
title: The deepagents library has no MCP client; deepagents-code and Talon bring their own, on FastMCP
kind: misconception
summary: The deepagents library has no MCP code or dependency. Sibling packages do. deepagents-code and deepagents-talon use FastMCP with langchain.mcp, and the evals harness uses langchain.mcp's MCPAdapter. langchain-mcp-adapters left in deepagents-code 0.1.71.
capabilities:
  - tools
  - transports.stdio
  - transports.streamableHttp
clients:
  - deepagents
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/langchain-ai/deepagents
    title: libs/deepagents/pyproject.toml, the core library's dependencies
    commit: 621147a5
    path: libs/deepagents/pyproject.toml
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/deepagents_code/mcp_tools.py, module docstring and _mount_backends
    commit: 621147a5
    path: libs/code/deepagents_code/mcp_tools.py:_mount_backends
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/pyproject.toml and uv.lock, fastmcp, mcp and langchain
    commit: 621147a5
    path: libs/code/pyproject.toml
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/CHANGELOG.md, the 0.1.71 entry
    commit: 621147a5
    path: libs/code/CHANGELOG.md:[0.1.71](https://github.com/langchain-ai/deepagents/compare/deepagents-code==0.1.70...deepagents-code==0.1.71) (2026-09-18)
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/talon/deepagents_talon/mcp.py, load_mcp_tools
    commit: 621147a5
    path: libs/talon/deepagents_talon/mcp.py:load_mcp_tools
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/evals/deepagents_harbor/langgraph_project/langgraph_agent.py, _mcp_tools, make_bare_graph and make_tau3_graph
    commit: 621147a5
    path: libs/evals/deepagents_harbor/langgraph_project/langgraph_agent.py:make_bare_graph,_mcp_tools,make_tau3_graph
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/acp/deepagents_acp/server.py, _session_mcp_servers
    commit: 621147a5
    path: libs/acp/deepagents_acp/server.py:AgentServerACP.__init__,AgentServerACP.new_session,AgentServerACP.load_session
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/THREAT_MODEL.md, two lines that still name langchain_mcp_adapters
    commit: 621147a5
    path: libs/code/THREAT_MODEL.md:TB4: MCP Config → Process / Network,T10: MCP Stdio Env Dict Forwarded Without Filtering
    date: 2026-11-27
  - url: https://github.com/langchain-ai/langchain
    title: langchain 1.5.2 wheel, langchain/mcp/adapter.py, MCPAdapter.__init__
    path: langchain/mcp/adapter.py
    date: 2026-11-26
status: current
lastVerified: 2026-11-27
related:
  - deepagents-code-declares-capabilities-it-cannot-serve
  - deepagents-code-inherits-the-handshake-era-from-fastmcps-proxy-client
---

# The deepagents library has no MCP client; deepagents-code and Talon bring their own, on FastMCP

Read at langchain-ai/deepagents 87f6080d (2026-11-26). Dependency behaviour is from the PyPI wheels at the versions `libs/code/uv.lock` resolves: langchain 1.5.2, fastmcp-slim 4.1.2, mcp 2.3.0 and mcp-types 2.3.0. The sha256 of each downloaded wheel matches the lockfile.

## The library

`libs/deepagents` is the package `pip install deepagents` installs. Its dependencies are langchain, langchain-core, two provider packages, langgraph, langsmith, packaging and wcmatch. Its lockfile holds no `fastmcp` and no `mcp`. The only mentions of MCP in its source are two lines of documentation in `middleware/skills.py` about generated tool names. `create_deep_agent` takes LangChain tools, and the README line is "bring your own functions or any MCP server".

langchain 1.5.2 ships a `langchain.mcp` module, so the files are on disk after a default install. Importing it fails without FastMCP: `adapter.py` wraps the `fastmcp` import and raises "Please install FastMCP to use `MCPAdapter`". FastMCP comes from langchain's `mcp` extra, which the library does not request. An application that wants MCP tools in a deep agent picks and installs its own route.

## The packages that do speak MCP

| Package | Version | MCP client | Tool conversion | Connect mode |
|---|---|---|---|---|
| `deepagents` | 0.7.42 | none | none | none |
| `deepagents-code` (`dcode`) | 0.2.15 | one FastMCP `StatefulProxyClient` per server, mounted on an in-process FastMCP router | `langchain.mcp.as_langchain_tool` on the router client | `legacy` |
| `deepagents-talon` | 0.1.2 | FastMCP `Client`, built by `MCPAdapter` | `MCPAdapter.list_tools` | `auto` |
| `deepagents-evals` (Harbor tau3 and bare graphs) | 0.0.1 | FastMCP `Client`, built by `MCPAdapter` from a one-server config dict, remote transports only | `MCPAdapter.list_tools` | `auto` |
| `deepagents-acp` | 0.1.0 | none | none | none |

`deepagents-acp` accepts the `mcp_servers` an ACP client passes to `new_session` and `load_session`, stores them in `_session_mcp_servers`, and reads them nowhere else in `server.py`. It connects to none of them.

deepagents-code resolves fastmcp 4.1.2 and mcp 2.3.0. Talon declares `fastmcp>=4.2.3` and `mcp>=2.3.0` and resolves fastmcp 4.2.3 and mcp 2.3.0. The evals harness resolves fastmcp 4.2.2 and mcp 2.3.0. Talon's README calls it experimental and alpha.

None of the three routes passes `client_info`. FastMCP forwards `None` to the SDK, and the SDK sends its placeholder `{"name": "mcp", "version": "0.1.0"}`. The canimcp probe captured that value from deepagents-code 0.2.5 on all 68 runs. The string `deepagents-code` appears in two other places: as the name of the in-process router, which never reaches a server, and as `client_name` in OAuth dynamic registration.

## What deepagents-code owns

The module docstring of `mcp_tools.py` states the split: connection management is FastMCP's, turning tools into LangChain tools is `langchain.mcp`'s, and deepagents-code keeps config discovery and merging, `${VAR}` expansion, project server approval and per-server status for the TUI. It also owns OAuth login and token storage (`mcp_auth.py`, `mcp_providers/`), the reconnect middleware on each mounted proxy (`mcp_proxy.py`), and the timeout and argument cleanup around each call (`mcp_middleware.py`).

## Where langchain-mcp-adapters went

An August 2026 scan found deepagents on `langchain-mcp-adapters>=0.3.0`. The deepagents-code changelog records the move under 0.1.71, dated 2026-09-18: "Moved MCP support onto FastMCP and `langchain.mcp`" (#5922). At 87f6080d the package is in no `pyproject.toml` and no `uv.lock` in the repository. Three references remain: a comment in `mcp_tools.py` about the `streamable_http` alias, and two lines in `libs/code/THREAT_MODEL.md` that still describe stdio servers as started through `langchain_mcp_adapters`.

The tool result rule did not change with the move. The docstring of `langchain/mcp/tools.py` says results follow `langchain-mcp-adapters`, so a call reaches a model in the same shape either way.

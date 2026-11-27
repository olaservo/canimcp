---
id: deepagents-code-declares-capabilities-it-cannot-serve
title: deepagents-code declares sampling, elicitation and roots to every server and answers none of them
kind: idiosyncrasy
summary: deepagents-code declares sampling, form and URL elicitation, and roots with listChanged to every server, because FastMCP's ProxyClient installs forwarding handlers by default. Nothing behind them answers, so each request gets a JSON-RPC error.
capabilities:
  - sampling
  - sampling.tools
  - elicitation
  - elicitation.form
  - elicitation.url
  - roots
  - roots.listChanged
clients:
  - deepagents
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/deepagents_code/mcp_tools.py, _mount_backends
    commit: 87f6080d
    path: libs/code/deepagents_code/mcp_tools.py:1968-1977,1996-2002
    date: 2026-11-26
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/deepagents_code/mcp_tools.py, _build_mcp_tool
    commit: 87f6080d
    path: libs/code/deepagents_code/mcp_tools.py:1531-1536
    date: 2026-11-26
  - url: https://github.com/langchain-ai/deepagents
    title: libs/talon/deepagents_talon/mcp.py, MCPAdapter and _cancel_mcp_elicitation
    commit: 87f6080d
    path: libs/talon/deepagents_talon/mcp.py:425-428,559-574
    date: 2026-11-26
  - url: https://github.com/PrefectHQ/fastmcp
    title: fastmcp-slim 4.1.2 wheel, fastmcp/server/providers/proxy.py, the default proxy handlers and ProxyClient.__init__
    path: fastmcp/server/providers/proxy.py:1516-1611,1742-1757
    date: 2026-11-26
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.3.0 wheel, mcp/client/session.py, _build_capabilities
    path: mcp/client/session.py:614-649
    date: 2026-11-26
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.3.0 wheel, mcp/shared/exceptions.py, NoBackChannelError
    path: mcp/shared/exceptions.py:55-71
    date: 2026-11-26
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.3.0 wheel, mcp/shared/transport_context.py, can_send_request
    path: mcp/shared/transport_context.py:25-37
    date: 2026-11-26
  - url: https://github.com/langchain-ai/langchain
    title: langchain 1.5.2 wheel, langchain/mcp/elicitation.py, the sentinel handler and _drives_interrupts
    path: langchain/mcp/elicitation.py:227-262
    date: 2026-11-26
status: current
lastVerified: 2026-11-26
related:
  - utilized-capability-declarations
  - deepagents-core-library-has-no-mcp-client
  - deepagents-code-inherits-the-handshake-era-from-fastmcps-proxy-client
  - fast-agent-never-sends-roots-list-changed
  - hermes-declares-url-elicitation-it-declines
---

# deepagents-code declares sampling, elicitation and roots to every server and answers none of them

Read at langchain-ai/deepagents 87f6080d, with fastmcp-slim 4.1.2, mcp 2.3.0 and langchain 1.5.2 from the PyPI wheels.

## What a server sees

The `initialize` request from deepagents-code carries these capabilities:

```json
{"sampling": {}, "elicitation": {"form": {}, "url": {}}, "roots": {"listChanged": true}}
```

The canimcp probe captured exactly this from deepagents-code 0.2.5 on all 68 runs, over stdio and streamable HTTP.

## Where the declaration comes from

deepagents-code does not ask for any of it. `_mount_backends` builds each per-server client as `StatefulProxyClient(transport=transport, log_handler=...)`. `StatefulProxyClient` is FastMCP's client for the back side of a proxy. `ProxyClient.__init__` fills in a handler for `roots`, `sampling_handler`, `elicitation_handler`, `log_handler` and `progress_handler` whenever the caller left that argument out. deepagents-code passes only `log_handler`, so it gets FastMCP's forwarding handlers for roots, sampling and elicitation.

The mcp SDK then derives the capability object from which callbacks are set. A sampling callback gives `sampling`. An elicitation callback gives `elicitation` with both `form` and `url`. A roots callback gives `roots` with `listChanged: true`.

## Why nothing answers

A forwarding handler relays the server's request to whoever is connected to the front of the proxy. In deepagents-code the front is an in-process FastMCP router, and its one client is `FastMCPClient(router)`, built with no sampling handler, no elicitation handler and no roots. `langchain.mcp.as_langchain_tool` is handed that client as it is. deepagents-code never uses `MCPAdapter`, so the client is not armed for interrupt-driven elicitation either.

I ran a stdio FastMCP server whose tools send `sampling/createMessage`, `elicitation/create` and `roots/list` back to the client, loaded through `_load_tools_from_config` from deepagents-code 0.2.5 with fastmcp 4.1.2, mcp 2.2.0 and langchain 1.4.9, the versions in the probe's environment. `mcp_tools.py`, `mcp_proxy.py`, `mcp_middleware.py` and `mcp_auth.py` in that release are identical to 95a2d9a6, line endings aside, and `_mount_backends` is unchanged at 87f6080d. Each request came back to the server as a JSON-RPC error with this message, for the method in question:

```
Cannot send 'elicitation/create': this transport context has no back-channel for server-initiated requests.
```

The text is the SDK's `NoBackChannelError`. In the same run the router client reported `protocol_version` `2026-07-28`: `FastMCPClient(router)` uses FastMCP's default `auto` mode and negotiates the modern era with the in-process router. The SDK documents that any `2026-07-28` connection refuses server-initiated requests, so the relay fails on the router session before the missing handlers are reached.

The server receives the error as the response to its own request. What happens to the tool call after that is up to the server.

## What would change it

`ProxyClient` installs a default only when the keyword is absent. Passing `roots=None`, `sampling_handler=None` and `elicitation_handler=None` to `StatefulProxyClient` leaves all three callbacks unset, and the SDK then declares none of the three. I read this from the constructor and did not run it.

## Talon differs

deepagents-talon builds its clients through `langchain.mcp`'s `MCPAdapter`, which sets a sentinel elicitation handler on each client. That declares `elicitation` with `form` and `url`, and neither sampling nor roots. On a `2026-07-28` connection `langchain.mcp` turns a server's `InputRequiredResult` into a LangGraph interrupt, and Talon resumes every such interrupt with `cancel` for each request. The function's docstring says this holds until Talon provides an elicitation UI. On a handshake connection the sentinel handler raises `NotImplementedError`. I read the Talon path and did not run it.

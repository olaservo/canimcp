---
id: deepagents-code-inherits-the-handshake-era-from-fastmcps-proxy-client
title: deepagents-code offers servers 2025-11-25 because FastMCP's proxy client defaults to the handshake
kind: idiosyncrasy
summary: deepagents-code names no protocol revision. Its per-server client is FastMCP's ProxyClient, which defaults to the initialize handshake, so servers are offered 2025-11-25. dcode mcp login and deepagents-talon use a plain FastMCP Client, which probes server/discover first.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - transports.sse
clients:
  - deepagents
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/deepagents_code/mcp_tools.py, _mount_backends
    commit: c84eb7f1
    path: libs/code/deepagents_code/mcp_tools.py:connect,_mount_backends
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/code/deepagents_code/mcp_auth.py, _drive_handshake
    commit: c84eb7f1
    path: libs/code/deepagents_code/mcp_auth.py:_drive_handshake
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/talon/deepagents_talon/mcp.py, load_mcp_tools
    commit: c84eb7f1
    path: libs/talon/deepagents_talon/mcp.py:load_mcp_tools
    date: 2026-11-27
  - url: https://github.com/langchain-ai/deepagents
    title: libs/talon/deepagents_talon/mcp_auth.py, _request_json
    commit: c84eb7f1
    path: libs/talon/deepagents_talon/mcp_auth.py:_request_json
    date: 2026-11-27
  - url: https://github.com/PrefectHQ/fastmcp
    title: fastmcp-slim 4.1.2 wheel, fastmcp/server/providers/proxy.py, ProxyClient.__init__ and _create_client_factory
    path: fastmcp/server/providers/proxy.py
    date: 2026-11-26
  - url: https://github.com/PrefectHQ/fastmcp
    title: fastmcp-slim 4.1.2 wheel, fastmcp/client/client.py, the mode argument and _negotiate
    path: fastmcp/client/client.py
    date: 2026-11-26
  - url: https://github.com/PrefectHQ/fastmcp
    title: fastmcp-slim 4.1.2 wheel, fastmcp/client/transports/sse.py, legacy_only
    path: fastmcp/client/transports/sse.py
    date: 2026-11-26
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.3.0 wheel, mcp/client/session.py, initialize
    path: mcp/client/session.py
    date: 2026-11-26
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.3.0 wheel, mcp/client/_probe.py, negotiate_auto
    path: mcp/client/_probe.py
    date: 2026-11-26
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp-types 2.3.0 wheel, mcp_types/version.py
    path: mcp_types/version.py
    date: 2026-11-26
  - url: https://github.com/langchain-ai/langchain
    title: langchain 1.5.2 wheel, langchain/mcp/adapter.py, MCPAdapter.__init__
    path: langchain/mcp/adapter.py
    date: 2026-11-26
status: current
lastVerified: 2026-11-27
related:
  - deepagents-core-library-has-no-mcp-client
  - deepagents-code-declares-capabilities-it-cannot-serve
  - hermes-leads-with-the-legacy-handshake
  - fast-agent-leads-with-the-modern-discover-probe
---

# deepagents-code offers servers 2025-11-25 because FastMCP's proxy client defaults to the handshake

Read at langchain-ai/deepagents 87f6080d, with fastmcp-slim 4.1.2, mcp 2.3.0, mcp-types 2.3.0 and langchain 1.5.2 from the PyPI wheels. Talon resolves fastmcp-slim 4.2.3, whose `Client` also defaults to `auto`.

## Three layers, and none of them is deepagents

No protocol revision string appears in deepagents-code's MCP modules, and no `mode` argument is passed to any FastMCP client. The revision a server is offered is decided in two other packages.

| Decision | Made by | Where |
|---|---|---|
| Handshake era or `server/discover` | FastMCP | `ProxyClient.__init__` runs `kwargs.setdefault("mode", "legacy")` |
| Which handshake revision to offer | mcp SDK | `ClientSession.initialize` sends `LATEST_HANDSHAKE_VERSION`, which is `2025-11-25` |
| Which reply to accept | mcp SDK | any member of `HANDSHAKE_PROTOCOL_VERSIONS`, `2024-11-05` to `2025-11-25` |

FastMCP's plain `Client` defaults to `mode="auto"`, which probes `server/discover` at `2026-07-28` and falls back to `initialize`. `ProxyClient` overrides that default, and its comment gives the reason: a proxy session can only be one era, and the handshake era keeps server-initiated sampling, elicitation and roots forwarding. deepagents-code uses `StatefulProxyClient`, a `ProxyClient` subclass, for every server, so every server gets `initialize` at `2025-11-25`.

FastMCP can also mirror the front connection's era onto the backend for each request. That applies when `create_proxy` is given a target that is not a `Client`. deepagents-code passes an already connected client, and `_create_client_factory` then reuses that session for every request.

## 2026-07-28 is not reachable on the tool path

There is no config key, environment variable or flag in deepagents-code that sets the mode. A server that speaks only `2026-07-28` cannot be used for tools at 87f6080d.

The canimcp probe ran deepagents-code 0.2.5 against a fixture server that offers both eras. All 68 captures start with `initialize` at `2025-11-25`, none contains `server/discover`, and on HTTP the later requests carry `MCP-Protocol-Version: 2025-11-25`.

## The modern era does appear in three places

The in-process leg. The tools call through `FastMCPClient(router)`, a plain client in `auto` mode connected to a FastMCP router in the same process. On deepagents-code 0.2.5 with fastmcp 4.1.2 and mcp 2.2.0 that client reported `protocol_version` `2026-07-28`. Nothing on this leg reaches a server. It does decide what happens to a server's sampling, elicitation and roots requests, described in [[deepagents-code-declares-capabilities-it-cannot-serve]].

`dcode mcp login`. `_drive_handshake` opens a one-shot session with `Client(transport)`, a plain client, to make the OAuth provider run. In `auto` mode over streamable HTTP that session sends `server/discover` before any `initialize`. FastMCP marks its SSE transport `legacy_only`, so an SSE server gets `initialize` directly. The same deepagents-code install can therefore send a server a `server/discover` probe at login and an `initialize` at tool load. I read this path and did not run it.

deepagents-talon. Talon loads tools with `MCPAdapter(connection)`, and `MCPAdapter` builds a plain `FastMCPClient`. Talon passes no mode, so its clients probe `server/discover` first on stdio and streamable HTTP. Talon's own OAuth metadata requests send `MCP-Protocol-Version` set to the SDK's `LATEST_PROTOCOL_VERSION`, which is `2026-07-28` in mcp 2.3.0. That import is the only revision constant named in non-test MCP client code under `libs/`. I read this path and did not run it.

## Reading the registry entry

The deepagents entry lists the four handshake revisions and prefers `2025-11-25`, because that is what the deepagents-code tool path does. `metadata.sdk.pinsProtocolVersion` is set: the revision is inherited, and a FastMCP release that changed the `ProxyClient` default, or an mcp SDK release with a newer `LATEST_HANDSHAKE_VERSION`, would change what deepagents-code offers without a change in this repository.

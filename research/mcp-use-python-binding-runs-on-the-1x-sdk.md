---
id: mcp-use-python-binding-runs-on-the-1x-sdk
title: The mcp-use Python binding is capped below mcp 2 and has a WebSocket connector that skips the handshake
kind: idiosyncrasy
summary: mcp-use 1.7.1 for Python declares mcp>=1.24.0,<2.0.0, so it speaks the initialize handshake up to 2025-11-25 only. Its lists stop at the first page, HTTP falls back to SSE, and its WebSocket connector is hand-written and sends initialize with no protocol version or clientInfo.
capabilities:
  - transports.sse
  - transports.streamableHttp
  - tools
  - authentication.oauth
clients:
  - mcp-use
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/mcp-use/mcp-use
    title: libraries/python/pyproject.toml, the mcp requirement
    commit: 8ff4b865
    path: libraries/python/pyproject.toml:3,23
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: Python BaseConnector, clientInfo, roots and the list methods
    commit: 8ff4b865
    path: libraries/python/mcp_use/client/connectors/base.py:106-136,481-546
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: Python HttpConnector, default OAuth and the SSE fallback
    commit: 8ff4b865
    path: libraries/python/mcp_use/client/connectors/http.py:84-159,161-322
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: Python connector factory, auth defaults to an empty dict
    commit: 8ff4b865
    path: libraries/python/mcp_use/client/config.py:107-140
    date: 2026-11-20
  - url: https://github.com/mcp-use/mcp-use
    title: Python WebSocketConnector, the hand-written request path
    commit: 8ff4b865
    path: libraries/python/mcp_use/client/connectors/websocket.py:181-223
    date: 2026-11-20
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, LATEST_PROTOCOL_VERSION and the supported list
    path: mcp/types.py:27
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - mcp-use-picks-the-protocol-era-by-transport
  - strands-python-speaks-two-sdk-majors
---

# The mcp-use Python binding is capped below mcp 2 and has a WebSocket connector that skips the handshake

The `mcp-use` package on PyPI is at 1.7.1, the same version as `libraries/python/pyproject.toml` at `8ff4b865`. It requires `mcp>=1.24.0,<2.0.0` and commits no lockfile. On 2026-11-20 the newest release in range is `mcp` 1.30.0, while the newest `mcp` on PyPI is 2.3.0. `mcp` 1.30.0 sets `LATEST_PROTOCOL_VERSION` to `2025-11-25`, so the Python binding speaks the `initialize` handshake only and cannot reach `2026-07-28`. The TypeScript binding in the same repository runs on the v2 SDK and probes `2026-07-28` first over HTTP.

## Where the bindings differ

| | TypeScript (`@mcp-use/client` 2.4.6) | Python (`mcp-use` 1.7.1) |
|---|---|---|
| SDK | `@modelcontextprotocol/client` 2.3.1, pinned | `mcp` 1.x, a range |
| Revisions | `2024-11-05` to `2026-07-28` | `2024-11-05` to `2025-11-25` |
| `clientInfo` | `mcp-use`, package version, title, description, icon, `websiteUrl` | `mcp-use`, package version, `websiteUrl` |
| HTTP | streamable HTTP only | streamable HTTP, then SSE on any failure |
| WebSocket | none | hand-written connector |
| List calls | SDK walks every page | first page only |
| OAuth default | SDK flow, loopback port 33418, tokens under `~/.mcp-use/oauth` | mcp-use's own flow on authlib, port 8080, tokens under `~/.mcp_use/tokens` |
| Agent | native provider loop | LangChain |

Both declare `roots` with `listChanged` on every connection and add `sampling` and `elicitation` only when a callback is passed. Both agents expose tools, resources and prompts to the model as tools.

## Lists stop at the first page

`BaseConnector.list_tools`, `list_resources` and `list_prompts` each call the SDK method once with no cursor and return that page. A server that paginates shows the agent only its first page.

## OAuth is attempted by default

The connector factory passes `auth=server_config.get("auth", {})`. `HttpConnector` treats any dict as an OAuth configuration, so a server entry with no `auth` key still gets an `OAuth` helper. If discovery finds no OAuth metadata the helper is dropped and the connection proceeds without auth. If it finds metadata, the browser flow runs on `localhost:8080`.

## The WebSocket connector

A `ws_url` entry builds `WebSocketConnector`, which does not use the SDK's `ClientSession`. It sends each request as `{"id", "method", "params"}` with no `"jsonrpc": "2.0"` member. `initialize` goes out with empty params: no `protocolVersion`, no `capabilities`, no `clientInfo`. No `notifications/initialized` follows, and only `tools/list` is called afterwards. A spec-conformant server can reject that request. WebSocket is not an MCP transport in any revision.

## Not checked

Nothing was run. Releases of `mcp` from 1.24.0 to 1.29.1 were not read. The Python `MCPAgent` was read only for which lists it converts. The Python package's own `server` module was not read.

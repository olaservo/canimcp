---
id: warp-preflights-http-servers-outside-the-sdk
title: Warp picks the HTTP transport and protocol era with its own request before rmcp connects
kind: idiosyncrasy
summary: For a URL server Warp POSTs a hand-built server/discover, then initialize if the server looks legacy, from its own reqwest client. The answer picks Streamable HTTP, SSE or OAuth and fixes the era. rmcp then connects again, so a legacy server gets two initialize requests.
capabilities:
  - transports.streamableHttp
  - transports.sse
  - authentication.oauth
clients:
  - warp
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/warpdotdev/warp
    title: crates/mcp/src/runtime.rs, determine_transport
    commit: 1c7fda11
    path: crates/mcp/src/runtime.rs:determine_transport,unexpected_error
    date: 2026-11-27
  - url: https://github.com/warpdotdev/warp
    title: crates/mcp/src/runtime.rs, negotiate_protocol and send_preflight_request
    commit: 1c7fda11
    path: crates/mcp/src/runtime.rs:negotiate_protocol,send_preflight_request
    date: 2026-11-27
  - url: https://github.com/warpdotdev/warp
    title: crates/mcp/src/runtime.rs, the connections opened after the preflight
    commit: 1c7fda11
    path: crates/mcp/src/runtime.rs:spawn_server,serve_streamable_http
    date: 2026-11-27
  - url: https://github.com/warpdotdev/warp
    title: crates/mcp/src/sse_transport/mod.rs, the copied SSE client
    commit: 1c7fda11
    path: crates/mcp/src/sse_transport/mod.rs
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - warp-declares-no-client-capabilities
---

# Warp picks the HTTP transport and protocol era with its own request before rmcp connects

Read at `f8223cef` (2026-11-20) against rmcp 3.5.0.

## The preflight

Warp's config has two transport types: a command, and a URL. Every URL server goes through `determine_transport`, which calls `negotiate_protocol` before rmcp sees the server.

`negotiate_protocol` builds a JSON-RPC message with id 0 and POSTs it from a fresh reqwest client with a 10-second timeout. The first attempt is `server/discover` at `ProtocolVersion::LATEST` (`2026-07-28` in rmcp 3.5.0), with `MCP-Protocol-Version` and `Mcp-Method: server/discover` headers and the client info in `_meta`. A legacy signal switches to `initialize` at `LATEST_WITH_INITIALIZE` (`2025-11-25`) without those headers. An `UNSUPPORTED_PROTOCOL_VERSION` error retries with the next version both sides list. A Python server's 400 `Bad Request: Unsupported protocol version` is recognised as a legacy signal even though its id is `"server-error"`. The response body is capped at 1 MiB, and SSE responses are read until the first response or error.

The status decides the transport:

- 200: Streamable HTTP, with the negotiated version and era.
- 404 or 405 on both attempts: the legacy HTTP+SSE transport.
- 401: OAuth, unless the challenge has no `resource_metadata` parameter and the config set an `Authorization`, `X-Api-Key` or `Api-Key` header. In that case Warp reports the credential as rejected and does not start OAuth. After OAuth the preflight runs again with the token.

## The connection after it

rmcp then opens a new connection on the chosen transport. On Streamable HTTP it runs `Discover` with the one version the preflight chose, or `Initialize` with that version. On SSE it always runs `initialize` at `2025-11-25`.

The preflight reads only the status, the `WWW-Authenticate` values and the body. It does not read `Mcp-Session-Id` and sends no `notifications/initialized` or `DELETE`. A server that takes the legacy path therefore receives one `initialize` from the preflight, which it may hold as an open session, and a second from rmcp.

## Why it matters for a read

This is a second `initialize` implementation beside rmcp's, so the request a legacy HTTP server sees first is Warp's and not the SDK's. Its body comes from the same `make_client_info()`, so the client info and empty capabilities match.

The SSE transport is Warp's copy of the SSE client rmcp removed, kept in `crates/mcp/src/sse_transport` under the Apache-2.0 notice. rmcp itself is not patched.

Stdio servers skip the preflight. They use rmcp's `ClientLifecycleMode::Auto` with every known version, newest first, and `2025-11-25` as the legacy fallback. rmcp's own documentation for `Auto` says it falls back when the server reports it is legacy or does not answer within 10 seconds.

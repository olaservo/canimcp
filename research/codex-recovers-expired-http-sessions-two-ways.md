---
id: codex-recovers-expired-http-sessions-two-ways
title: Codex replays a request after a session 404, and fails in-flight calls after a reply 404
kind: nuance
summary: After a 404 on a request in a Streamable HTTP session, Codex re-initializes and sends the request again, tool calls included. Since 358e3dd0, a 404 on a reply to a server request closes the session and fails its in-flight calls with no replay.
capabilities:
  - transports.streamableHttp
  - bonusFeatures.sessionRecovery
clients:
  - openai-codex
specVersions:
  - 2025-06-18
  - 2025-11-25
sources:
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/http_client_adapter.rs, SessionExpired404
    commit: 18c09f20
    path: codex-rs/rmcp-client/src/http_client_adapter.rs:StreamableHttpClientAdapterError,StreamableHttpClientAdapter.post_message_inner
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/rmcp_client.rs, the operation wrapper and session recovery
    commit: 18c09f20
    path: codex-rs/rmcp-client/src/rmcp_client.rs:RmcpClient.run_service_operation_with_pause_state,RmcpClient.reinitialize_after_session_expiry_inner,RmcpClient.is_session_expired_404,InitializeMode
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/session_expiry_transport.rs, SessionExpiryTransport
    commit: 18c09f20
    path: codex-rs/rmcp-client/src/session_expiry_transport.rs:SessionExpiryTransport,send,serve_http_transport
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/recovery_handshake_cleanup.rs, RecoveryHandshakeCleanup
    commit: 18c09f20
    path: codex-rs/rmcp-client/src/recovery_handshake_cleanup.rs:RecoveryHandshakeCleanup
    date: 2026-11-27
  - url: https://github.com/openai/codex/pull/63782
    title: Recover when an MCP reply hits an expired HTTP session (#63782)
    commit: 358e3dd0
    date: 2026-11-27
  - url: https://github.com/openai/codex/pull/64011
    title: Clean up abandoned MCP sessions during HTTP recovery (#64011)
    commit: 3d5a786a
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - openclaw-recovers-expired-http-sessions-without-patching-the-sdk
  - opencode-patches-its-sdk-for-session-recovery
  - codex-defaults-to-2025-06-18
---

# Codex replays a request after a session 404, and fails in-flight calls after a reply 404

Codex's HTTP adapter raises `SessionExpired404` when a POST that carried an `Mcp-Session-Id` gets HTTP 404. That covers Codex's own requests and its replies to server requests, such as the answer to an elicitation. A 2026-07-28 connection has no session id, so this applies to the handshake era, which is Codex's default mode.

## A request that gets a 404

`run_service_operation_with_pause_state` wraps every request Codex sends: `tools/list`, `tools/call`, the resource methods and custom requests. When the request fails with `SessionExpired404`, it calls `reinitialize_after_session_expiry`, which opens a new transport and runs `initialize` with the usual startup retries. It then runs the same operation once on the new session. A `tools/call` that got a 404 is therefore sent a second time. This path is older than `358e3dd0`.

## A reply that gets a 404

rmcp logs a failed reply to a server request and fails no client request, as the comment in `session_expiry_transport.rs` says. Before `358e3dd0` (openai/codex#63782, 2026-11-25), a tool call waiting on an elicitation whose answer got a 404 stayed pending.

`SessionExpiryTransport.send` now checks each outgoing response or error message. A `SessionExpired404` on one marks the session expired and cancels its service. The calls in flight on that session fail and are not sent again.

The next operation finds the session expired and re-initializes in `ExpiredReplyRecovery` mode. The handshake counts against that operation's timeout. If the new session also answers 404 during the operation, Codex expires it and returns the error without a second reconnect.

`3d5a786a` (openai/codex#64011, the same day) added `RecoveryHandshakeCleanup`. In `ExpiredReplyRecovery` mode, a session id the server assigns during a handshake that then fails or is cancelled gets a `DELETE`, so the abandoned session does not hold a slot on the server.

`358e3dd0` first shipped in `rust-v0.174.0-alpha.6` and `3d5a786a` in `rust-v0.174.0-alpha.7`. The newest stable tag at `57b493a6`, `rust-v0.172.0`, has neither.

## Compared with other clients

On the request path Codex replays any request, tool calls included, as opencode and pi do. OpenClaw recycles the session and never replays. Hermes replays only a tool annotated `readOnlyHint: true`.

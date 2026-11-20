---
id: zed-hand-writes-its-mcp-client-and-answers-no-server-requests
title: Zed hand-writes its MCP client, declares no capabilities and never answers a server request
kind: idiosyncrasy
summary: At ad1058d7 Zed's MCP client is its own Rust code with no SDK. It sends clientInfo Zed 0.1.0 and an empty capabilities object, and its request handler table is never filled, so ping, roots/list and every other server-to-client request gets no response.
capabilities:
  - roots
  - sampling
  - elicitation
  - logging
  - transports.streamableHttp
clients:
  - zed
specVersions:
  - 2024-11-05
  - 2025-03-26
  - 2025-06-18
  - 2025-11-25
sources:
  - url: https://github.com/zed-industries/zed
    title: crates/context_server/src/protocol.rs, ModelContextProtocol::initialize
    commit: ad1058d7
    path: crates/context_server/src/protocol.rs:28-78
    date: 2026-11-20
  - url: https://github.com/zed-industries/zed
    title: crates/context_server/src/context_server.rs, clientInfo
    commit: ad1058d7
    path: crates/context_server/src/context_server.rs:152-161
    date: 2026-11-20
  - url: https://github.com/zed-industries/zed
    title: crates/context_server/src/client.rs, request handler table and handle_input
    commit: ad1058d7
    path: crates/context_server/src/client.rs:216,280-320
    date: 2026-11-20
  - url: https://github.com/zed-industries/zed
    title: crates/context_server/src/transport/http.rs, POST-only transport
    commit: ad1058d7
    path: crates/context_server/src/transport/http.rs:106-139
    date: 2026-11-20
  - url: https://github.com/zed-industries/zed
    title: crates/context_server/Cargo.toml, dependencies
    commit: ad1058d7
    path: crates/context_server/Cargo.toml:18-43
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - zed-passes-mcp-servers-to-external-agents-without-oauth
---

# Zed hand-writes its MCP client, declares no capabilities and never answers a server request

Zed calls MCP servers context servers. The `context_server` crate implements JSON-RPC, the lifecycle, stdio, Streamable HTTP and OAuth with serde and Zed's own HTTP client. `Cargo.lock` at `ad1058d7` has no `rmcp` or other MCP crate, and the workspace `[patch.crates-io]` section patches nothing MCP-related. This is the only MCP client in the repo. The ACP external agents use their own clients (see [[zed-passes-mcp-servers-to-external-agents-without-oauth]]).

The handshake is fixed. `initialize` sends `LATEST_PROTOCOL_VERSION`, `2025-11-25`, and accepts `2025-11-25`, `2025-06-18`, `2025-03-26` or `2024-11-05` back. Any other version fails the connection. There is no `2026-07-28` code and no `server/discover` path. `clientInfo` is `{"name": "Zed", "version": "0.1.0"}`. The version comes from `env!("CARGO_PKG_VERSION")` inside the `context_server` crate, whose own version is `0.1.0`, so it does not change with Zed releases (Zed itself is 1.31.0 at this commit).

`ClientCapabilities` is built with `experimental`, `sampling` and `roots` all `None`, and the struct has no field for elicitation, tasks or extensions. The wire value is `"capabilities": {}`.

`Client::new` creates a request handler map and nothing ever inserts into it. `handle_input` parses an incoming request, looks up a handler by method, and does nothing when there is none: no result and no `-32601` error. A server's `ping`, `roots/list`, `sampling/createMessage` or `elicitation/create` waits until the server's own timeout. The client also subscribes to only one notification, `notifications/tools/list_changed`, so `notifications/message`, `notifications/prompts/list_changed` and `notifications/resources/list_changed` are dropped.

On HTTP, every message is a POST, and responses arrive as JSON or as an SSE stream on that POST. Zed never opens the optional GET stream, so a server can reach Zed only while a POST response stream is open. A `tools/list_changed` sent outside a request does not reach a Zed HTTP client.

The crate also contains an MCP server half in `listener.rs`. At this commit nothing outside the crate constructs it.

---
id: codex-defaults-to-2025-06-18
title: Codex proposes 2025-06-18 and accepts whatever version the server returns
kind: idiosyncrasy
summary: Codex's initialize names 2025-06-18 and the reply's version is not checked, so a server that answers 2025-11-25 still gets a session. From 0.173.0-alpha.1 a default install first sends server/discover at 2026-07-28 to a local stdio server. Over HTTP that needs a flag.
capabilities: []
clients:
  - openai-codex
specVersions:
  - 2025-06-18
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/protocol_mode.rs
    commit: bee5dc55
    path: codex-rs/rmcp-client/src/protocol_mode.rs
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/features/src/lib.rs, the mcp_2026_07_28, mcp_connection_sharing, codex_apps_mcp_2026_07_28 and use_xaa feature records
    commit: bee5dc55
    path: codex-rs/features/src/lib.rs:FEATURES
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/rmcp_client.rs, mcp_initialize_request_params
    commit: bee5dc55
    path: codex-rs/codex-mcp/src/rmcp_client.rs:mcp_initialize_request_params
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/core/src/config/mod.rs, discover_local_stdio and mcp_protocol_mode
    commit: bee5dc55
    path: codex-rs/core/src/config/mod.rs:Config.to_mcp_config_with_loaded_plugins,Config.mcp_protocol_mode
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/connection_manager.rs, per-connection mode selection
    commit: bee5dc55
    path: codex-rs/codex-mcp/src/connection_manager.rs:McpConnectionSet
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/server.rs, can_discover_local_stdio and stdio_protocol_mode
    commit: bee5dc55
    path: codex-rs/codex-mcp/src/server.rs:EffectiveMcpServer
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/rmcp_client.rs, the stdio opt-in variable, the modern-session check and the discovery handshake
    commit: bee5dc55
    path: codex-rs/rmcp-client/src/rmcp_client.rs:RmcpClient.new_stdio_client_with_protocol_mode,RmcpClient.read_resource,RmcpClient.connect_pending_transport
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/stdio_handshake.rs, when a failed discovery restarts the server in Legacy
    commit: bee5dc55
    path: codex-rs/rmcp-client/src/stdio_handshake.rs
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/local_stdio_transport.rs, handle_reply and the empty discovery reply
    commit: bee5dc55
    path: codex-rs/rmcp-client/src/local_stdio_transport.rs:Discovery.handle_reply
    date: 2026-11-27
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/stdio_server_launcher.rs, the Windows fallback to Legacy without a job object
    commit: bee5dc55
    path: codex-rs/rmcp-client/src/stdio_server_launcher.rs:LocalStdioServerLauncher.launch_server
    date: 2026-11-27
  - url: https://github.com/modelcontextprotocol/rust-sdk
    title: rmcp at the revision Codex pins, the Auto lifecycle and the legacy initialize handshake
    commit: b11a40d8
    path: crates/rmcp/src/service/client.rs
    date: 2026-11-26
  - url: https://github.com/openai/codex/pull/62552
    title: Enable MCP connection sharing by default
    commit: ac784eb1
    date: 2026-11-19
  - url: https://github.com/openai/codex/pull/34747
    title: Register the MCP 2026-07-28 feature flag
    date: 2026-07-22
  - url: https://github.com/openai/codex/pull/35724
    title: Add MCP 2026-07-28 discovery support
    date: 2026-07-28
status: current
lastVerified: 2026-11-27
related:
  - codex-reads-one-page-of-tools
---

# Codex proposes 2025-06-18 and accepts whatever version the server returns

Codex picks an MCP compatibility policy for each connection. The default is `Legacy`:

```rust
pub enum McpProtocolMode {
    /// Preserve the existing MCP initialization and OAuth behavior.
    #[default]
    Legacy,
    /// Allow the MCP 2026-07-28 discovery and request lifecycle.
    V20260728,
    /// Probe an eligible local stdio server even when its launch config omits a version.
    DiscoverLocalStdio,
}
```

`Legacy` maps to `ProtocolVersion::V_2025_06_18` and `ClientLifecycleMode::Initialize`. The other two map to `ClientLifecycleMode::Auto` with `preferred_versions: [V_2026_07_28]` and `legacy_version: Some(V_2025_06_18)`.

The initialize params pin the version:

```rust
InitializeRequestParams::new(
    capabilities,
    Implementation::new("codex-mcp-client", env!("CARGO_PKG_VERSION")).with_title("Codex"),
)
.with_protocol_version(ProtocolVersion::V_2025_06_18)
```

## What Codex proposes and what it accepts

Codex proposes two versions, `2025-06-18` and `2026-07-28`. No non-test Codex code names `2025-11-25`.

The reply is a separate matter. rmcp's legacy handshake stores the version from the `initialize` result as the session's version and sends `notifications/initialized`. It does not compare that version with the one it proposed. Its only test is whether the version is older than `2026-07-28`.

The probe's `protocol.initializeHandshake.*` scenarios reproduce this. The fixture server puts a fixed version in the `initialize` result and the mock model then asks for one tool call. On Codex CLI 0.169.0-alpha.3 with default settings, 2026-11-15, the result was the same over stdio and Streamable HTTP:

| Scenario | Server's reply to `initialize` at `2025-06-18` | What Codex sent next | `MCP-Protocol-Version` on later HTTP requests |
|---|---|---|---|
| `echo` | `2025-06-18` | `notifications/initialized`, `tools/list`, `tools/call` | `2025-06-18` |
| `reply_2025_11_25` | `2025-11-25` | `notifications/initialized`, `tools/list`, `tools/call` | `2025-11-25` |
| `reply_2024_11_05` | `2024-11-05` | `notifications/initialized`, `tools/list`, `tools/call` | `2024-11-05` |
| `reply_2026_07_28` | `2026-07-28` | `notifications/initialized`, then `tools/list` and `tools/call` carrying `_meta` `io.modelcontextprotocol/protocolVersion: 2026-07-28` | `2026-07-28` |

A session at `2025-11-25` is possible when a server declines to echo `2025-06-18`. Codex has no branch on that version, and on such a session it sent the same messages it sends at `2025-06-18`. Accepting the reply is not evidence that Codex implements anything `2025-11-25` added.

## 2026-07-28 is behind a flag, and stdio needs a second opt-in

`mcp_protocol_mode()` returns `V20260728` only when the `mcp_2026_07_28` feature is enabled:

```rust
FeatureSpec {
    id: Feature::Mcp20260728,
    key: "mcp_2026_07_28",
    stage: Stage::UnderDevelopment,
    default_enabled: false,
},
```

The record is the same at `rust-v0.169.0-alpha.10` and `rust-v0.171.0-alpha.6`. The pull request that added the mode describes it as preserving the legacy lifecycle by default.

For a Streamable HTTP server the flag is enough. A stdio server must also carry `CODEX_MCP_PROTOCOL_VERSION=2026-07-28` in its configured `env`. Without it `stdio_mode` returns `Legacy`. When the mode is not `Legacy`, Codex removes the variable from the server's environment before launch.

Probe records for the `echo` scenario on 0.169.0-alpha.3, where the server accepts either lifecycle:

| Transport | Probe config | Flag | `env` marker | First message from Codex | Session |
|---|---|---|---|---|---|
| stdio | `default` | off | absent | `initialize` at `2025-06-18` | `2025-06-18` |
| stdio | `mcp-2026-07-28` | on | absent | `initialize` at `2025-06-18` | `2025-06-18` |
| stdio | `stdio-opt-in-no-flag` | off | set | `initialize` at `2025-06-18` | `2025-06-18` |
| stdio | `mcp-2026-07-28-stdio-opt-in` | on | set | `server/discover` with `_meta` version `2026-07-28` | `2026-07-28`, no `initialize` sent |
| HTTP | `default` | off | n/a | `initialize` at `2025-06-18` | `2025-06-18` |
| HTTP | `mcp-2026-07-28` | on | n/a | `server/discover` with `_meta` version `2026-07-28` | `2026-07-28`, no `initialize` sent |

What happens when the server refuses `server/discover` depends on the error and the transport:

| Transport | Server's answer to `server/discover` | What Codex did |
|---|---|---|
| stdio | `-32601` Method not found | sent `initialize` at `2025-06-18` and carried on |
| HTTP | `-32601` Method not found | sent `initialize` at `2025-06-18` and carried on |
| HTTP | `-32022` Unsupported protocol version, listing only handshake-era versions | sent `initialize` at `2025-06-18` and carried on |
| stdio | `-32022` Unsupported protocol version, listing only handshake-era versions | sent nothing further; the server's tool was never called |

The `-32601` rows are the `protocol.serverDiscover.method_not_found` scenario. The `-32022` rows are `echo` run with `--era legacy`.

The same commands were run on 0.174.0-alpha.7 on 2026-11-26, a Linux build in the probe's Docker image. On stdio, `default` and `stdio-opt-in-no-flag` now send `server/discover` at `2026-07-28` first, and so do the four `reply_*` scenarios, which therefore no longer reach the `initialize` reply on stdio. HTTP `default` still sends `initialize` at `2025-06-18` and accepts each reply as the table above shows. The refusal rows are unchanged. The 0.169.0-alpha.3 records were removed from `probe/runs` that day and remain in the repo's history.

Three more settings reach the modern lifecycle. None was run for this note. `codex_apps_mcp_2026_07_28` and `use_xaa` are `UnderDevelopment` and off by default. `mcp_connection_sharing` was too at `03cb3294`, and is `Stable` and on by default from `ac784eb1`.

- `mcp_connection_sharing` puts an eligible local stdio server in `DiscoverLocalStdio`, which probes `server/discover` without the `env` marker.
- `codex_apps_mcp_2026_07_28` switches the host-owned Codex Apps server on its own.
- `use_xaa` with enterprise-managed auth forces `V20260728` for that server.

A Streamable HTTP server's registration can also carry its own mode, added for hosted Apps contributions in openai/codex#46019.

Codex's own modern request paths need both conditions: a mode other than `Legacy`, and a negotiated version equal to `2026-07-28`.

## Connection sharing is on by default from 0.173.0-alpha.1

`ac784eb1` (openai/codex#62552, 2026-11-19) marks `mcp_connection_sharing` `Stable` with `default_enabled: true`. `rust-v0.173.0-alpha.1` contains it, and so does every later alpha tag up to `rust-v0.174.0-alpha.7`. No stable tag contains it. `rust-v0.172.0`, the newest stable tag in the clone at `475e13ab`, has the flag off.

With the flag on, a stdio server gets `DiscoverLocalStdio` when it runs in the local environment, is not the reserved `codex_apps` server, has no ChatGPT runtime auth provider and does not use enterprise-managed auth. No `env` marker and no `mcp_2026_07_28` flag is needed. Streamable HTTP servers are not affected and stay on `Legacy`.

Read from source at `475e13ab`. The probe run of 2026-11-26 shows the first two and the Method not found case of the third on the wire:

- The first message to such a server is `server/discover` with `_meta` version `2026-07-28`.
- A `DiscoverResult` that lists `2026-07-28` gives a `2026-07-28` session with no `initialize`.
- A Method not found error, or an empty `{}` result, is followed by `initialize` at `2025-06-18` on the same pipe.
- With no reply, rmcp's `Auto` lifecycle sends `initialize` at `2025-06-18` after 10 seconds, under the default 30-second startup timeout.
- When that `initialize` is rejected or the pipe closes, or the server's Unsupported protocol version error lists only handshake-era versions, Codex stops the process, starts it again and sends `initialize` first.
- On Windows, a server that could not be placed in a job object is launched in `Legacy`.

## Reproducing

```
cd probe
npm install && npm run build
node dist/runner.js --client codex --set negotiation --config default --transport stdio
node dist/runner.js --client codex --set negotiation --config default --transport http
```

Those two commands cover the first table. `probe/README.md` lists the commands for the flag and opt-in rows. Each run writes `wire.jsonl` and `record.json` under `probe/runs/codex@<version>/<config>/<era>-<transport>/<scenario>/`, and the Codex card lists the records.

## Why this matters for a matrix

`preferredProtocolVersion` is `2025-06-18` because that is what a server met from a default install at `03cb3294`. From `ac784eb1` that holds for Streamable HTTP, and a local stdio server meets `server/discover` at `2026-07-28` first. `2026-07-28` is in `protocolVersions` because configuration turns it on and the probe has recorded it on the wire. `2025-11-25` is left out: Codex never proposes it and does nothing specific to it.

For a server author, answering `2025-06-18` to Codex's `initialize` is the conforming reply when the server supports that version. A server that answers with another handshake-era version still gets a Codex session.

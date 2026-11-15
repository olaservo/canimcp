---
id: codex-defaults-to-2025-06-18
title: Codex proposes 2025-06-18 and accepts whatever version the server returns
kind: idiosyncrasy
summary: A default Codex install sends initialize at 2025-06-18 and does not check the version in the reply, so a server that answers 2025-11-25 still gets a session. Codex does nothing specific to 2025-11-25. 2026-07-28 is behind an under-development flag that is off by default.
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
    commit: 03cb3294
    path: codex-rs/rmcp-client/src/protocol_mode.rs:7-54
    date: 2026-11-15
  - url: https://github.com/openai/codex
    title: codex-rs/features/src/lib.rs, the mcp_2026_07_28, mcp_connection_sharing, codex_apps_mcp_2026_07_28 and use_xaa feature records
    commit: 03cb3294
    path: codex-rs/features/src/lib.rs:1763-1768, 1775-1780, 1805-1810, 1817-1822
    date: 2026-11-15
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/rmcp_client.rs, mcp_initialize_request_params
    commit: 03cb3294
    path: codex-rs/codex-mcp/src/rmcp_client.rs:1370-1401
    date: 2026-11-15
  - url: https://github.com/openai/codex
    title: codex-rs/core/src/config/mod.rs, mcp_protocol_mode
    commit: 03cb3294
    path: codex-rs/core/src/config/mod.rs:2117-2123
    date: 2026-11-15
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/connection_manager.rs, per-connection mode selection
    commit: 03cb3294
    path: codex-rs/codex-mcp/src/connection_manager.rs:560-580, 686-692
    date: 2026-11-15
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/rmcp_client.rs, the stdio opt-in variable and the modern-session check
    commit: 03cb3294
    path: codex-rs/rmcp-client/src/rmcp_client.rs:522-528, 931-948
    date: 2026-11-15
  - url: https://github.com/modelcontextprotocol/rust-sdk
    title: rmcp at the revision Codex pins, the legacy initialize handshake
    commit: 98a54789
    path: crates/rmcp/src/service/client.rs:921-935
    date: 2026-11-15
  - url: https://github.com/openai/codex/pull/34747
    title: Register the MCP 2026-07-28 feature flag
    date: 2026-07-22
  - url: https://github.com/openai/codex/pull/35724
    title: Add MCP 2026-07-28 discovery support
    date: 2026-07-28
status: current
lastVerified: 2026-11-15
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

Three more settings reach the modern lifecycle. All three are `UnderDevelopment` and off by default, and none was run for this note.

- `mcp_connection_sharing` puts an eligible local stdio server in `DiscoverLocalStdio`, which probes `server/discover` without the `env` marker.
- `codex_apps_mcp_2026_07_28` switches the host-owned Codex Apps server on its own.
- `use_xaa` with enterprise-managed auth forces `V20260728` for that server.

A Streamable HTTP server's registration can also carry its own mode, added for hosted Apps contributions in openai/codex#46019.

Codex's own modern request paths need both conditions: a mode other than `Legacy`, and a negotiated version equal to `2026-07-28`.

## Reproducing

```
cd probe
npm install && npm run build
node dist/runner.js --client codex --set negotiation --config default --transport stdio
node dist/runner.js --client codex --set negotiation --config default --transport http
```

Those two commands cover the first table. `probe/README.md` lists the commands for the flag and opt-in rows. Each run writes `wire.jsonl` and `record.json` under `probe/runs/codex@<version>/<config>/<era>-<transport>/<scenario>/`, and the Codex card lists the records.

## Why this matters for a matrix

`preferredProtocolVersion` is `2025-06-18` because that is what a server meets from a default install. `2026-07-28` is in `protocolVersions` because configuration turns it on and the probe has recorded it on the wire. `2025-11-25` is left out: Codex never proposes it and does nothing specific to it.

For a server author, answering `2025-06-18` to Codex's `initialize` is the conforming reply when the server supports that version. A server that answers with another handshake-era version still gets a Codex session.

---
id: codex-defaults-to-2025-06-18
title: Codex ships preferring 2025-06-18 and has never spoken 2025-11-25
kind: idiosyncrasy
summary: Codex's default protocol mode pins initialize to 2025-06-18. The alternative mode goes straight to 2026-07-28 and sits behind an under-development feature flag that is off by default, so 2025-11-25 is not a version Codex ever offers.
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
    commit: b705b6b0
    path: codex-rs/rmcp-client/src/protocol_mode.rs:19-33
    date: 2026-08-24
  - url: https://github.com/openai/codex
    title: codex-rs/features/src/lib.rs, the mcp_2026_07_28 feature record
    commit: b705b6b0
    path: codex-rs/features/src/lib.rs:1170-1175
    date: 2026-08-24
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/rmcp_client.rs, initialize params
    commit: b705b6b0
    path: codex-rs/codex-mcp/src/rmcp_client.rs:1006-1029
    date: 2026-08-24
status: current
lastVerified: 2026-08-24
related:
  - codex-reads-one-page-of-tools
---

# Codex ships preferring 2025-06-18 and has never spoken 2025-11-25

A Codex session picks one of two MCP compatibility policies at creation and keeps it for the session. The default is `Legacy`:

```rust
pub enum McpProtocolMode {
    /// Preserve the existing MCP initialization and OAuth behavior.
    #[default]
    Legacy,
    /// Allow the MCP 2026-07-28 discovery and request lifecycle.
    V20260728,
}
```

`Legacy` maps to `ProtocolVersion::V_2025_06_18` and `ClientLifecycleMode::Initialize`. `V20260728` maps to `ClientLifecycleMode::Auto` with `preferred_versions: [V_2026_07_28]` and `legacy_version: Some(V_2025_06_18)`.

The initialize params agree, pinning the version rather than taking the SDK's latest:

```rust
InitializeRequestParams::new(
    capabilities,
    Implementation::new("codex-mcp-client", env!("CARGO_PKG_VERSION")).with_title("Codex"),
)
.with_protocol_version(ProtocolVersion::V_2025_06_18)
```

`2025-11-25` appears in neither arm. Whichever mode a session runs in, its fallback is `2025-06-18` and its ceiling is either `2025-06-18` or `2026-07-28`. There is no configuration that makes Codex offer `2025-11-25`.

## The newer mode is not shipped on

`V20260728` is selected only when the `mcp_2026_07_28` feature is enabled:

```rust
FeatureSpec {
    id: Feature::Mcp20260728,
    key: "mcp_2026_07_28",
    stage: Stage::UnderDevelopment,
    default_enabled: false,
},
```

`UnderDevelopment` is Codex's pre-experimental stage — the flag has no announcement and no user-facing name. So a default install negotiates `2025-06-18`, two revisions behind.

The mode also decides behaviour beyond version negotiation. `tools/list` pagination and per-request `_meta` placement both branch on it, and the `_meta` branch additionally requires the negotiated version to actually be `2026-07-28`, not just the mode to be requested.

## Why this matters for a matrix

An entry that records only "supports 2026-07-28" would be true of the source and false of every shipped install. `preferredProtocolVersion` here is `2025-06-18` deliberately: it is what a server will see. `2026-07-28` is in `protocolVersions` because the code path exists and can be turned on.

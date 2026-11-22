---
id: warp-sends-its-app-id-as-client-name
title: Warp's clientInfo.name is the app id, which differs by release channel and operating system
kind: idiosyncrasy
summary: Warp sends ChannelState::app_id() as clientInfo.name. On macOS that is the bundle identifier, dev.warp.Warp-Stable for the stable app. Linux and Windows take it from a build-time channel config whose generator is not in the repo. Open-source builds send dev.warp.WarpOss.
capabilities: []
clients:
  - warp
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/warpdotdev/warp
    title: crates/mcp/src/runtime.rs, make_client_info and the User-Agent
    commit: f8223cef
    path: crates/mcp/src/runtime.rs:180-185,905-918
    date: 2026-11-21
  - url: https://github.com/warpdotdev/warp
    title: crates/warp_core/src/channel/state.rs, ChannelState::new and app_id_from_bundle
    commit: f8223cef
    path: crates/warp_core/src/channel/state.rs:64-73,454-478
    date: 2026-11-21
  - url: https://github.com/warpdotdev/warp
    title: script/macos/bundle, bundle id per channel
    commit: f8223cef
    path: script/macos/bundle:392-432
    date: 2026-11-21
  - url: https://github.com/warpdotdev/warp
    title: crates/warp_channel_config/src/lib.rs, embedded channel config
    commit: f8223cef
    path: crates/warp_channel_config/src/lib.rs:32-54
    date: 2026-11-21
  - url: https://github.com/warpdotdev/warp
    title: app/src/bin/oss.rs, the open-source channel config
    commit: f8223cef
    path: app/src/bin/oss.rs:10-23
    date: 2026-11-21
  - url: https://github.com/warpdotdev/warp
    title: script/linux/bundle, bundle id per channel
    commit: f8223cef
    path: script/linux/bundle:225,283
    date: 2026-11-21
status: current
lastVerified: 2026-11-21
---

# Warp's clientInfo.name is the app id, which differs by release channel and operating system

Read at `f8223cef` (2026-11-20).

`make_client_info()` builds `Implementation::new(ChannelState::app_id().to_string(), app_version)`. The version is the `GIT_RELEASE_TAG` the build was made with, or an empty string. The name comes from the channel config, so it varies with the build.

On macOS, `ChannelState::new` replaces the configured id with the running bundle's `CFBundleIdentifier`. `script/macos/bundle` sets that per channel: `dev.warp.Warp-Stable`, `dev.warp.Warp-Preview`, `dev.warp.Warp-Dev`, `dev.warp.Warp-Local`, `dev.warp.WarpOss`.

On Linux and Windows the id comes from `<channel>_config.json`, embedded at build time from the output of `warp-channel-config`. That generator is internal to Warp and not in the repository, so the stable value is not readable from source. The Linux and Windows bundle scripts name the stable package `dev.warp.Warp`, and the Linux data directory logic maps the application name `Warp` to `warp-terminal`, so `dev.warp.Warp` is the likely value. It was not confirmed.

Builds from the open-source binaries hard-code `dev.warp.WarpOss`. The open-source TUI hard-codes `dev.warp.WarpTui`.

So one product reaches servers under at least three names, and a telemetry join on `clientInfo.name` needs all of them. Over HTTP every request also carries a fixed `User-Agent: Warp-MCP-Client/1.0 (+https://www.warp.dev)`, which Warp says matches the one its own server sends for managed MCP. Dynamic Client Registration sends `client_name: "Warp"`.

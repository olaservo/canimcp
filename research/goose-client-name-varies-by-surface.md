---
id: goose-client-name-varies-by-surface
title: goose never sends the client name every registry lists it under
kind: idiosyncrasy
summary: goose sends clientInfo.name as goose-desktop or goose-cli, not goose, and an embedder can override it entirely. The two surfaces also differ on MCP Apps support.
capabilities:
  - extensions
clients:
  - goose
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/agents/agent.rs
    commit: "c5e5929a"
    path: crates/goose/src/agents/agent.rs:412-431
    date: 2026-08-23
  - url: https://github.com/apify/mcp-client-capabilities
    title: mcp-clients.json, goose record
    commit: "4406120"
    date: 2026-08-23
status: current
lastVerified: 2026-08-23
related:
  - utilized-capability-declarations
---

# goose never sends the client name every registry lists it under

The apify registry keys its goose record on `goose`. The wire name goose actually sends is `goose-desktop` or `goose-cli`.

It comes from `GoosePlatform::to_string()`, whose `Display` impl writes exactly those two strings, and `client_name` falls back to it when nothing overrides:

```rust
let client_name = explicit_mcp_host_info
    .as_ref()
    .and_then(|host_info| host_info.client_name.clone())
    .unwrap_or_else(|| goose_platform.to_string());
```

A server keying on `clientInfo.name == "goose"` matches nothing. Since name sniffing is the only mechanism available for adapting to a client — see [[utilized-capability-declarations]] — a registry record under an unsendable key is inert.

## It is not one client

The two surfaces differ on what they declare. MCP Apps is on for Desktop and off for CLI:

```rust
.unwrap_or_else(|| match config.goose_platform {
    GoosePlatform::GooseDesktop => true,
    GoosePlatform::GooseCli => false,
})
```

That value decides whether `io.modelcontextprotocol/ui` appears in the declared extensions at all, advertised with `mimeTypes: ["text/html;profile=mcp-app"]`. So a server offering an MCP App gets it rendered under Desktop and ignored under CLI, from the same version of the same project.

Any matrix with one goose row is averaging two clients.

## Both are overridable

An embedder passing `GooseMcpHostInfo` can set `client_name` to anything, and if it sets `explicit_extensions` its own extension map replaces the surface default. The client version is separately overridable through the `GOOSE_MCP_CLIENT_VERSION` environment variable.

So goose is a client whose identity is configuration. Telemetry keyed on `clientInfo.name` will undercount it by whatever share of traffic runs embedded under another name, and there is no way to detect that from the server side.

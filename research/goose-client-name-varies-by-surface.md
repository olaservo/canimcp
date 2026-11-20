---
id: goose-client-name-varies-by-surface
title: goose never sends the client name every registry lists it under
kind: idiosyncrasy
summary: goose sends clientInfo.name as goose-app, goose-desktop or goose-cli, not goose, and an embedder can override it entirely. The two surfaces also differ on MCP Apps support.
capabilities:
  - extensions
clients:
  - goose
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/agents/extension_manager/mod.rs, client_context
    commit: "ea5dded7"
    path: crates/goose/src/agents/extension_manager/mod.rs:95-117
    date: 2026-11-20
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/agents/services.rs, GoosePlatform and its Display impl
    commit: "ea5dded7"
    path: crates/goose/src/agents/services.rs:261-274
    date: 2026-11-20
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/acp/server.rs, the ACP client's clientInfo becomes GooseMcpHostInfo
    commit: "ea5dded7"
    path: crates/goose/src/acp/server.rs:494-514,1089-1103
    date: 2026-11-20
  - url: https://github.com/aaif-goose/goose
    title: ui/desktop/src/acp/acpConnection.ts, the desktop app's ACP initialize
    commit: "ea5dded7"
    path: ui/desktop/src/acp/acpConnection.ts:142-159
    date: 2026-11-20
  - url: https://github.com/aaif-goose/goose
    title: crates/oi-kit-agent/src/mcp/client.rs, resolved_extensions and resolved_client_info
    commit: "ea5dded7"
    path: crates/oi-kit-agent/src/mcp/client.rs:306-335
    date: 2026-11-20
  - url: https://github.com/apify/mcp-client-capabilities
    title: mcp-clients.json, goose record
    commit: "4406120"
    date: 2026-08-23
status: current
lastVerified: 2026-11-20
related:
  - utilized-capability-declarations
---

# goose never sends the client name every registry lists it under

The apify registry keys its goose record on `goose`. The wire name goose actually sends is `goose-app`, `goose-desktop` or `goose-cli`.

The last two come from `GoosePlatform::to_string()`, whose `Display` impl writes exactly those two strings, and `client_context` falls back to it when nothing overrides:

```rust
let name = host_info
    .as_ref()
    .and_then(|host_info| host_info.client_name.clone())
    .unwrap_or_else(|| platform.to_string());
```

At `ea5dded7` the desktop app is an ACP client of `goose serve --platform desktop`. Its ACP `initialize` carries `clientInfo.name` from its `package.json`, which is `goose-app`, and goose copies that into `client_name` for the sessions the app attaches to. `goose-desktop` is the fallback for a session on that server with no ACP client attached.

A server keying on `clientInfo.name == "goose"` matches nothing. Since name sniffing is the only mechanism available for adapting to a client — see [[utilized-capability-declarations]] — a registry record under an unsendable key is inert.

## It is not one client

The two surfaces differ on what they declare. MCP Apps is on for Desktop and off for CLI:

```rust
.unwrap_or(matches!(platform, GoosePlatform::GooseDesktop));
```

That value decides whether `io.modelcontextprotocol/ui` appears in the declared extensions at all, advertised with `mimeTypes: ["text/html;profile=mcp-app"]`. So a server offering an MCP App gets it rendered under Desktop and ignored under CLI, from the same version of the same project.

Any matrix with one goose row is averaging two clients.

## Both are overridable

An embedder passing `GooseMcpHostInfo` can set `client_name` to anything, and if it sets `explicit_extensions` its own extension map replaces the surface default. The client version is separately overridable through the `GOOSE_MCP_CLIENT_VERSION` environment variable.

So goose is a client whose identity is configuration. Telemetry keyed on `clientInfo.name` will undercount it by whatever share of traffic runs embedded under another name, and there is no way to detect that from the server side.

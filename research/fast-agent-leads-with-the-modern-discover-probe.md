---
id: fast-agent-leads-with-the-modern-discover-probe
title: fast-agent opens every connection with a 2026-07-28 discover probe
kind: idiosyncrasy
summary: A default fast-agent install sends `server/discover` at `2026-07-28` as the first request on every transport, and falls back to the `initialize` handshake only when that fails. It is the first client read here that leads with the stateless era rather than the handshake.
capabilities: []
clients:
  - fast-agent
specVersions:
  - 2026-07-28
  - 2025-11-25
sources:
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/config.py, MCPServerSettings.protocol_mode
    commit: 1b58e686
    path: src/fast_agent/config.py:602
    date: 2026-08-25
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/client_connection.py, sdk_connect_mode
    commit: 1b58e686
    path: src/fast_agent/mcp/client_connection.py:62-64,108-120
    date: 2026-08-25
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.0.0, mcp/client/_probe.py, negotiate_auto
    path: mcp/client/_probe.py:52-114
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - fast-agent-subscribes-only-on-the-modern-path
  - codex-defaults-to-2025-06-18
---

# fast-agent opens every connection with a 2026-07-28 discover probe

`protocol_mode` defaults to `auto`, both globally and per server. `auto` is passed straight through to the SDK's `Client(mode=...)`, and the SDK's `negotiate_auto` sends `server/discover` proposing `2026-07-28` before anything else. Only when that probe fails does `initialize` follow.

So a server that has never seen a 2026-era client will now see one. The probe is not conditional on transport: stdio servers get it too.

## What the probe does with a refusal

`negotiate_auto` is a denylist, not an allowlist. Every `MCPError` falls back to `initialize` except one case: `-32022 UNSUPPORTED_PROTOCOL_VERSION` whose `supported` list names modern versions and no handshake version. A `-32601 METHOD_NOT_FOUND` — what a pre-2026 server returns — falls back silently.

Two further cases also fall back rather than fail:

- A `DiscoverResult` that parses but advertises no modern version in `supportedVersions`. The SDK comment names the go-sdk's stateful streamable default as the server that does this.
- A `DiscoverResult` that does not parse at all.

A `-32022` from the *fallback* `initialize` triggers one re-probe instead of an error, on the reasoning that a client-side probe timeout can leave a slow server already locked to the modern era.

Non-`MCPError` exceptions — network failures, cancellation — propagate. An outage is never read as an era verdict.

## The three modes

| `protocol_mode` | First request | Fallback |
|---|---|---|
| `auto` (default) | `server/discover` at `2026-07-28` | `initialize` at `2025-11-25` |
| `modern` | `server/discover` at `2026-07-28` | none — the connection fails |
| `legacy` | `initialize` at `2025-11-25` | none |

`modern` is fast-agent's own subclass, `_ForcedModernClient`, which enters the client context only after a successful discover so a failed negotiation unwinds the transport cleanly. It is rejected in config validation when combined with the SSE transport.

`legacy` offers `LATEST_HANDSHAKE_VERSION`, which is `2025-11-25` in mcp-types 2.0.0. fast-agent never names a revision of its own; both ends of the range come from the SDK's version registry.

## Why this matters for a support matrix

Every other client read so far has one negotiated revision, and recording it as `preferredProtocolVersion` describes what a server sees. fast-agent has two, and which one a given server sees is decided by the server. The top-level capability rows here describe the modern path; `byProtocolVersion["2025-11-25"]` records what differs when the fallback fires.

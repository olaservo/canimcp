---
id: hermes-leads-with-the-legacy-handshake
title: Hermes reverses its SDK's auto mode and tries initialize before server/discover
kind: nuance
summary: On the same mcp Python SDK as fast-agent, Hermes inverts the default. Its `protocol: auto` sends the legacy `initialize` handshake first and probes `server/discover` only when a server rejects it as modern-only. The stated reason: almost every server today is handshake-era.
capabilities:
  - protocolVersions
clients:
  - hermes-agent
  - fast-agent
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_transport.py, _negotiate_session and _complete_handshake_at_offered_version
    commit: 9dcf7714
    path: tools/mcp_tool_transport.py:188-252
    date: 2026-11-09
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_errors.py, the fallback signals
    commit: 9dcf7714
    path: tools/mcp_tool_errors.py:30-42
    date: 2026-11-09
  - url: https://pypi.org/project/mcp-types/2.3.0/
    title: mcp 2.3.0, ClientSession.discover and the handshake/modern version split
    path: mcp/client/session.py:651-673, mcp_types/version.py:24-59
    date: 2026-11-09
status: current
lastVerified: 2026-11-09
related:
  - fast-agent-leads-with-the-modern-discover-probe
---

# Hermes reverses its SDK's auto mode and tries initialize before server/discover

`mcp` 2.0.0 and 2.3.0 split the released revisions into two eras. `HANDSHAKE_PROTOCOL_VERSIONS` ends at `2025-11-25` and is reachable through `ClientSession.initialize()`; `MODERN_PROTOCOL_VERSIONS` holds `2026-07-28` alone and is reachable through `ClientSession.discover()`. The SDK's own auto mode probes the modern path first.

Hermes has a per-server `protocol` config key with three settings. `legacy` (alias `handshake`) is handshake-only. `stateless` (aliases `modern` and `2026-07-28`) probes `server/discover` first and retries once with the handshake if that fails. Unknown values warn and are treated as `auto`. `auto` is the default, and it runs the handshake first, falling back to `discover` only when the failure is one of two specific signals: `UnsupportedProtocolVersion` (-32022) or a missing `initialize` method (-32601). The docstring states the reasoning directly — nearly every configured or catalog server today speaks the handshake era, so initialize-first means zero extra round-trips and zero behaviour change for all of them, while stateless-only servers still connect through the fallback.

This is the mirror image of fast-agent, which reads as the other client on this SDK and leads with `discover`. Same library, opposite default, and both defensible: fast-agent optimises for the era it expects servers to move to, Hermes for the era they are in. A support matrix that records only "supports 2026-07-28" hides the difference, which is what `preferredProtocolVersion` exists to carry.

The fallback also checks `hasattr(session, "discover")` before using it, so a Hermes running against an older mcp 1.x install degrades to handshake-only rather than raising. A timeout never falls back.

Since `a24c12d1` Hermes also handles a server that answers `initialize` with 200 but names `2026-07-28`, and has no `server/discover` either. The SDK rejects that reply as an unsupported version. Hermes then sends a second `initialize` itself at `LATEST_HANDSHAKE_VERSION`, adopts the result pinned to `2025-11-25`, and sends `notifications/initialized` (#113359).

Both result types expose `.capabilities`, so everything downstream of the negotiation — the tools gate, the resource and prompt utility-tool selection, the config probe — works on either era without branching.

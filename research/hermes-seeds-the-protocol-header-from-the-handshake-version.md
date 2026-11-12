---
id: hermes-seeds-the-protocol-header-from-the-handshake-version
title: Hermes seeds MCP-Protocol-Version from the handshake era, not the newest revision
kind: nuance
summary: On HTTP, Hermes defaults `MCP-Protocol-Version` to the SDK's `LATEST_HANDSHAKE_VERSION` rather than `LATEST_PROTOCOL_VERSION`. The header has to agree with the body, and the body on that path is still an `initialize` handshake.
capabilities:
  - transports.streamableHttp
  - protocolVersions
clients:
  - hermes-agent
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_transport.py, HTTP header seeding
    commit: 9dcf7714
    path: tools/mcp_tool_transport.py:612-620
    date: 2026-11-09
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool.py, LATEST_HANDSHAKE_VERSION fallback constant
    commit: 9dcf7714
    path: tools/mcp_tool.py:79-84,166-170
    date: 2026-11-09
status: current
lastVerified: 2026-11-09
related:
  - hermes-leads-with-the-legacy-handshake
---

# Hermes seeds MCP-Protocol-Version from the handshake era, not the newest revision

The HTTP path sets a default `MCP-Protocol-Version` request header when the config does not already carry one, matching the key case-insensitively so a user's own casing survives. The value is the SDK's `LATEST_HANDSHAKE_VERSION`, which mcp 2.0.0 and 2.3.0 both resolve to `2025-11-25`, not `LATEST_PROTOCOL_VERSION`, which resolves to `2026-07-28`.

The comment in place gives the failure it prevents. Hermes connects over HTTP through `ClientSession.initialize()`, whose body advertises `LATEST_HANDSHAKE_VERSION`. A header naming `2026-07-28` puts the request on the server's per-request-envelope handling, which then rejects the handshake body for missing the `params._meta` keys that era requires. The header and the body have to name the same era.

Hermes also carries its own fallback constant for SDK builds that do not export the newer names. `LATEST_PROTOCOL_VERSION` falls back to `2025-03-26` — the revision that introduced Streamable HTTP, so it stays valid for the transport regardless — and `LATEST_HANDSHAKE_VERSION` falls back to whatever `LATEST_PROTOCOL_VERSION` resolved to, on the reasoning that an SDK predating the split makes no distinction between the two.

This is the concrete cost of the era split for anyone writing an HTTP client: two constants that used to be one, and a header that silently selects which of a server's two request ladders handles the call.

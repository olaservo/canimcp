---
id: hermes-goes-on-the-wire-as-mcp
title: Hermes never set clientInfo, so servers saw the SDK's placeholder name
kind: gap
summary: At `a24c12d1` Hermes passed no `client_info`, so handshakes carried the SDK placeholder `mcp` 0.1.0. At `9dcf7714` it sends `hermes-agent` with its base version, as the probe saw on the wire. Older builds still send `mcp`.
capabilities:
  - clientInfoNames
clients:
  - hermes-agent
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool.py, ClientSession construction on the stdio and HTTP paths
    commit: a24c12d1
    path: tools/mcp_tool.py:3260-3266,3342-3344,3725,3796,3844
    date: 2026-08-27
  - url: https://pypi.org/project/mcp/2.0.0/
    title: mcp 2.0.0, DEFAULT_CLIENT_INFO and the client_info fallback
    path: mcp/client/session.py:66,381,391
    date: 2026-08-27
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_transport.py, _session_kwargs now passes client_info
    commit: 9dcf7714
    path: tools/mcp_tool_transport.py:171-186
    date: 2026-11-09
  - url: https://github.com/NousResearch/hermes-agent
    title: hermes_platform/resolver/app.py, desktop-app liveness probe
    commit: 9dcf7714
    path: hermes_platform/resolver/app.py:405-415
    date: 2026-11-09
status: stale
lastVerified: 2026-11-09
related:
  - goose-client-name-varies-by-surface
  - codex-prefers-a-chatgpt-hosted-client-identifier
---

# Hermes never set clientInfo, so servers saw the SDK's placeholder name

## Update, 2026-11-09

At `9dcf7714`, `_session_kwargs` passes `client_info=Implementation(name="hermes-agent", version=get_version_info().base_version)` on every configurable session, with the comment "Servers key logs/behaviour on clientInfo; the SDK default is "mcp"/"0.1.0"". The probe run against build `0.23.0+689.ga9ff979` recorded `"clientInfo":{"name":"hermes-agent","version":"0.23.0"}`. The note below describes `a24c12d1` and is kept for older builds, which still send `mcp`.

Hermes now puts three names on the wire. `hermes-agent` is the real session. `hermes-probe` is the non-MCP-endpoint preflight frame described below, unchanged. `hermes` with version `probe` is a new hand-written `initialize` at `2025-06-18` that checks whether a declared desktop app's loopback MCP endpoint is answering. The internal `cua-driver` computer-use session is still constructed bare and sends `mcp`, but it talks only to a binary Hermes ships.

## At a24c12d1

`ClientSession.__init__` takes an optional `client_info` and falls back to `DEFAULT_CLIENT_INFO`, which mcp 2.0.0 defines as `Implementation(name="mcp", version="0.1.0")`. Hermes builds its session kwargs from the sampling handler, the elicitation handler, a message handler and a logging callback. `client_info` is not among them at any of the four construction sites, so the fallback applies on every connection, on both transports.

The name is not merely generic — it is the SDK's own placeholder, shared with every Python client that also declines to set it. A server writing per-client compatibility shims, or rate-limiting by caller, has nothing to key on. `2026-07-28`'s per-request `_meta` envelope carries the same value, so the modern path does not fix it either.

This has a direct consequence for the observed tier. The Hugging Face client telemetry feed identifies callers by the name in `clientInfo`, so Hermes traffic either never appears or appears aggregated under `mcp` alongside unrelated clients. Any observed-tier row attributed to `mcp` cannot be attributed to a client at all.

There is one place Hermes does name itself. When a configured URL answers with a content type that is not an MCP media type, it POSTs a hand-written minimal `initialize` frame at `2025-03-26` with `clientInfo.name` of `hermes-probe` to decide whether the endpoint speaks MCP before reporting a `NonMcpEndpointError`. That frame is a diagnostic and never carries a real session, so `hermes-probe` is the only recognisable name Hermes puts on the wire and it appears only on endpoints that failed a content-type check.

Recorded as a gap rather than an idiosyncrasy: the SDK provides the field, Hermes has a name, and nothing in the code suggests the omission was decided.

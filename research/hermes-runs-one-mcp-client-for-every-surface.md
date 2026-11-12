---
id: hermes-runs-one-mcp-client-for-every-surface
title: Hermes runs one MCP client across every surface, and a second one it does not expose
kind: nuance
summary: CLI, desktop, gateway, TUI gateway, ACP adapter, cron and web all use the same `tools/mcp_tool*` client. No TypeScript SDK, and no hand-rolled client that carries a session. The one other `ClientSession` is internal, drives a computer-use server, and declares nothing.
capabilities:
  - protocolVersions
  - sampling
  - elicitation
clients:
  - hermes-agent
  - cline
  - openclaw
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/NousResearch/hermes-agent
    title: importers of tools/mcp_tool across cli, gateway, tui_gateway, acp_adapter, cron and web
    commit: a24c12d1
    path: cli.py, gateway/session.py, tui_gateway/server.py, acp_adapter/server.py, cron/scheduler.py, hermes_cli/web_server.py
    date: 2026-08-27
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/computer_use/cua_backend.py, the internal cua-driver session
    commit: a24c12d1
    path: tools/computer_use/cua_backend.py:1730-1800
    date: 2026-08-27
  - url: https://github.com/NousResearch/hermes-agent
    title: importers of tools/mcp_tool across gateway, tui_gateway, acp_adapter, cron, hermes_cli and model_tools
    commit: 9dcf7714
    path: model_tools.py, gateway/session.py, tui_gateway/agent_factory.py, acp_adapter/server.py, cron/scheduler.py, hermes_cli/cli_info_mixin.py, hermes_cli/web_routers/mcp.py
    date: 2026-11-09
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/computer_use/cua_backend_session.py, the internal cua-driver session
    commit: 9dcf7714
    path: tools/computer_use/cua_backend_session.py:211-235
    date: 2026-11-09
  - url: https://github.com/NousResearch/hermes-agent
    title: hermes_platform/resolver/app.py, desktop-app liveness probe
    commit: 9dcf7714
    path: hermes_platform/resolver/app.py:405-440
    date: 2026-11-09
status: current
lastVerified: 2026-11-09
related:
  - cline-hand-rolls-stdio-in-its-cli
  - goose-client-name-varies-by-surface
---

# Hermes runs one MCP client across every surface, and a second one it does not expose

Cline's read established that finding a client's MCP client is not enough — its behaviour splits four ways, by surface and again by transport, with the CLI's stdio path hand-written and four revisions behind the rest. goose's splits by surface on the client name. Hermes is the counter-case, and checking cost the same work.

Every user-facing surface uses the client in `tools/mcp_tool.py`, which at `9dcf7714` is split across about 25 `tools/mcp_tool_*` modules: the interactive CLI, the Electron desktop app's backend (Tauri at `a24c12d1`), the gateway, the TUI gateway, the ACP adapter, the cron scheduler and the web server. No `package.json` in the repo depends on `@modelcontextprotocol/sdk`, and a search for a hand-rolled `initialize` frame in the TypeScript and TSX sources returns nothing, so the desktop app has no client of its own and drives the Python one. Capability answers therefore hold for the whole product, which has not been true of any other multi-surface client read here.

The hand-written `initialize` frames in the repo are not clients. When a configured URL answers with a non-MCP content type, Hermes POSTs a minimal frame at `2025-03-26` naming itself `hermes-probe` to decide whether the endpoint speaks MCP at all before raising `NonMcpEndpointError`. At `9dcf7714` there is a second one: the platform resolver POSTs `initialize` at `2025-06-18` as `hermes` to a declared desktop app's loopback endpoint and reads only the HTTP status to decide whether the app is answering. Neither carries a session.

There is a genuine second `ClientSession`, in the computer-use backend. It spawns the `cua-driver` binary over stdio and talks to its MCP server, which makes Hermes an MCP client to a component it ships rather than to anything a user configures. That session, now in `tools/computer_use/cua_backend_session.py`, is constructed bare — no sampling callback, no elicitation callback, no `client_info` — and calls `session.initialize()` directly instead of going through `_negotiate_session`, so it declares no capabilities and has no `server/discover` fallback. It is not reachable from `mcp_servers` config and does not appear in the tool registry, so the registry entry describes the configurable path only.

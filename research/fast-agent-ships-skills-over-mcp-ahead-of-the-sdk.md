---
id: fast-agent-ships-skills-over-mcp-ahead-of-the-sdk
title: fast-agent implements SEP-2640 skills over MCP with wire types it defines itself
kind: in-flight
summary: fast-agent calls `skills/list`, `skills/get` and `resources/directory/read` against servers declaring the `io.modelcontextprotocol/skills` extension, verifying every resource against a SHA-256 digest. The Python SDK has none of these types, so fast-agent declares them itself.
capabilities: []
clients:
  - fast-agent
specVersions:
  - 2026-07-28
tracking:
  state: proposed
  seps:
    - 2640
sources:
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/skills_extension.py, provisional wire models
    commit: 1b58e686
    path: src/fast_agent/mcp/skills_extension.py:1-91
    date: 2026-08-25
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/skills/mcp_registry.py, scan_mcp_skill_registry and the install limits
    commit: 1b58e686
    path: src/fast_agent/skills/mcp_registry.py:67-171,290-296,445-465
    date: 2026-08-25
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/client_connection.py, list_skills / get_skill / read_directory
    commit: 1b58e686
    path: src/fast_agent/mcp/client_connection.py:286-303
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - fast-agent-leads-with-the-modern-discover-probe
---

# fast-agent implements SEP-2640 skills over MCP with wire types it defines itself

Three methods are sent that no released revision defines:

| Method | Purpose |
|---|---|
| `skills/list` | paginated skill entries, each a URI plus frontmatter plus an optional resource manifest |
| `skills/get` | one skill entry by URI |
| `resources/directory/read` | list a directory's resources, optional per the extension settings |

The request and result models live in `src/fast_agent/mcp/skills_extension.py`, whose docstring says why: "The pinned MCP SDK does not yet provide Skills Extension request/result types." They are pinned to SEP-2640 draft `d7490ecd`. The requests go out through `client.session.send_request`, bypassing the SDK's typed verbs entirely.

Support is detected from the server's `io.modelcontextprotocol/skills` extension entry rather than from a capability flag, and `resources/directory/read` is only sent when that entry carries `directoryRead: true`.

## The install path is content-addressed

Every entry in a skill's resource manifest must carry a `sha256:` digest matching `^sha256:[0-9a-f]{64}$`, and the downloaded bytes are hashed and compared before anything is written. A skill's own identity is a digest over its canonicalized manifest.

The scan is bounded in five directions: 1,000 list pages, 10,000 entries, 256 KiB for a SKILL.md, 10 MiB for one resource, 50 MiB for one skill, 200 MiB for one server. Resource paths are checked for encoded separators, Windows-reserved names and invalid characters before they reach the filesystem.

That is a meaningful amount of policy for a draft, and it is the sort of thing a spec text does not carry. A server publishing skills to fast-agent today is publishing against these limits whether or not SEP-2640 ever names any.

## Why this one is worth tracking

fast-agent is the reference implementation for a proposal its own maintainer is working on, which makes it the place where SEP-2640 wire decisions get made in practice before they are written down. The pinned draft hash in the module docstring is the thing to diff on a refresh: a change there means the proposal moved.

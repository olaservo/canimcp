---
id: pi-dropped-no-mcp-and-shipped-its-own-client
title: pi's README said No MCP until September 2026, and pi now ships its own MCP client, on by default
kind: misconception
summary: pi's README said "No MCP" through 466db0fe. A docs refresh removed the line on 2026-09-22, and 8562bcf6 added a hand-written client as a built-in extension on 2026-09-29, released as 0.99.0. At 07ece436 it is on by default and the README does not mention MCP.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - roots
clients:
  - pi
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/earendil-works/pi/tree/466db0fecdc20996a553116984d18c0d362b035a
    title: packages/coding-agent/README.md, the Philosophy section the day before the refresh
    commit: 466db0fe
    path: packages/coding-agent/README.md
    date: 2026-11-16
  - url: https://github.com/earendil-works/pi/commit/25cc5c7bf4cbc76b2e134c729eb8d57d521ed749
    title: docs(coding-agent) refresh documentation (#9898), which cut the README from 756 lines to 70
    commit: 25cc5c7b
    date: 2026-11-16
  - url: https://github.com/earendil-works/pi/commit/8562bcf66a8eeefdf75ddd231ca9d7aa7d64f86e
    title: feat(coding-agent) codemode and MCP, which added packages/mcp, the mcp extension and docs/mcp.md
    commit: 8562bcf6
    date: 2026-11-16
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/index.ts, the built-in extension list
    commit: 5c0917b7
    path: packages/coding-agent/src/extensions/index.ts:builtInExtensions
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/mcp/index.ts, session_start and the deferred runtime load
    commit: 5c0917b7
    path: packages/coding-agent/src/extensions/mcp/index.ts:createMcpExtension
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/mcp/runtime.ts, the McpClient options
    commit: 5c0917b7
    path: packages/coding-agent/src/extensions/mcp/runtime.ts:McpServerConnection.connectOnce
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/mcp/package.json, the runtime dependencies
    commit: 5c0917b7
    path: packages/mcp/package.json
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/mcp/README.md, the no-SDK statement and the OAuth attribution
    commit: 5c0917b7
    path: packages/mcp/README.md:@earendil-works/pi-mcp,Sign-in in two halves
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/README.md, the feature sentence at HEAD
    commit: 5c0917b7
    path: packages/coding-agent/README.md:Pi
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/docs/mcp.md, replacing or disabling the built-in support
    commit: 5c0917b7
    path: packages/coding-agent/docs/mcp.md:Extensions and SDK
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: apps/p2/plugins/mcp/instances.ts, the second McpClient construction
    commit: 5c0917b7
    path: apps/p2/plugins/mcp/instances.ts:Connection.initialize
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: apps/p2/plugins/mcp/server.ts, clientInfo for p2
    commit: 5c0917b7
    path: apps/p2/plugins/mcp/server.ts:clientInfo
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - pi-keeps-mcp-tools-out-of-the-models-tool-list
  - pi-runs-the-official-conformance-suite-in-ci
  - cline-hand-rolls-stdio-in-its-cli
---

# pi's README said No MCP until September 2026, and pi now ships its own MCP client, on by default

In August 2026 this registry had pi down as a client with no MCP support. The README's Philosophy section at `466db0fe` (2026-09-21) still opened with "**No MCP.** Build CLI tools with READMEs (see Skills), or build an extension that adds MCP support", with a link to a post titled "What if you don't need MCP". The same README listed "MCP server integration" among the things an extension could add.

The position changed in two commits a week apart. `25cc5c7b` on 2026-09-22, "docs(coding-agent): refresh documentation (#9898)", cut the README from 756 lines to 70, and the Philosophy section went with it. `8562bcf6` on 2026-09-29, "feat(coding-agent): codemode and MCP", added `packages/mcp`, `packages/coding-agent/src/extensions/mcp/` and `docs/mcp.md` in one commit, and v0.99.0 was tagged the same day. The commit message says the core gets general mechanisms only, and that codemode, tool_search and MCP are built-in extensions other extensions can replace.

What the code does at `07ece436`, 281 commits past v1.5.2:

- The client is `@earendil-works/pi-mcp`, a workspace package published at the coding agent's version. It is hand-written: its one runtime dependency is `cross-spawn`, and its README says it "does not depend on the official MCP SDK". The OAuth files carry a notice that they are adapted from typescript-sdk v1.29.0 `src/client/auth.ts`.
- It is part of a default install. `mcp` is one of four entries in `builtInExtensions`, and the coding agent pins pi-mcp at an exact version. With no enabled server the extension registers `/mcp` and stops. The module that holds the client is imported one event-loop turn after `session_start`, and only when a server is enabled.
- It goes on the wire as `pi` with the coding agent's version, asks for `2025-11-25`, and declares `roots: {}` and nothing else.
- `--no-mcp`, `-builtin:mcp` in the `extensions` setting, or an installed extension that registers `/mcp` turns the built-in support off. The docs name `pi-mcp-adapter` as such an extension. Sessions created through the SDK do not load built-in extensions.
- The coding agent's README does not mention MCP. Its feature sentence reads "skips features like sub-agents and plan mode". MCP is documented in `docs/mcp.md`.

The probe ran pi 1.5.0 on 2026-11-08 and captured the same `initialize` on stdio and HTTP: `2025-11-25`, `{"roots":{}}`, `clientInfo.name` of `pi`.

## A second host in the same repo

`apps/p2` is a self-hosted server UI. It is marked private, and its README calls it a prototype that will be gone soon. It builds the same `McpClient` and names itself `p2` with that app's version. It declares roots only when the server entry has some, and it calls `tools/list` without looking at the server's capabilities. It is not published, so `p2` is not in the entry's `clientInfoNames`. `packages/agent/examples/mcp-codemode` is an example that connects as `pi-agent-example`.

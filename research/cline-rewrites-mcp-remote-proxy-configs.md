---
id: cline-rewrites-mcp-remote-proxy-configs
title: Cline's CLI rewrites `npx mcp-remote <url>` into a native Streamable HTTP transport
kind: idiosyncrasy
summary: A stdio config of exactly `npx [-y] mcp-remote <url>`, with no env and no other arguments, is replaced by a streamableHttp transport before any process is spawned. The extension does not do this, so one settings file describes two different connections.
capabilities:
  - transports.stdio
  - transports.streamableHttp
clients:
  - cline
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/remote-proxy.ts
    commit: 110138b5
    path: sdk/packages/core/src/extensions/mcp/remote-proxy.ts:19-62
    date: 2026-08-25
  - url: https://github.com/cline/cline
    title: sdk/packages/core/src/extensions/mcp/config-loader.ts, resolveNativeMcpTransport call
    commit: 110138b5
    path: sdk/packages/core/src/extensions/mcp/config-loader.ts:756
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - cline-defaults-a-url-server-to-sse
  - cline-hand-rolls-stdio-in-its-cli
---

# Cline's CLI rewrites `npx mcp-remote <url>` into a native Streamable HTTP transport

`resolveNativeMcpTransport` runs on every stdio registration the CLI loads. It matches one exact shape and rejects everything else:

- the executable, after stripping directories and a `.cmd`/`.exe` suffix, is `npx`
- no `env` entries
- optional `-y` or `--yes` flags, then `mcp-remote` or `mcp-remote@<version>`
- exactly one argument after that, parsing as an `http:` or `https:` URL

A match returns `{ type: "streamableHttp", url }`. Anything else — a flag `mcp-remote` understands, a proxy invoked some other way, an `env` entry — is left as stdio and spawned.

The comment gives the reason: Cline has a native Streamable HTTP transport, so running the proxy would duplicate OAuth handling and let a child process open a browser as a side effect of merely enabling the server.

## The two surfaces disagree

`resolveNativeMcpTransport` lives in `@cline/core` and is called from its config loader and its install path. `McpHub` validates the settings file against its own schema in `apps/vscode/src/services/mcp/schemas.ts`, which has no equivalent. The extension spawns the proxy.

The settings file is shared — one file at `~/.cline/data/settings/cline_mcp_settings.json`, read by the extension, the CLI and the JetBrains plugin. So a marketplace entry written in the proxy shape produces a subprocess speaking stdio in VS Code and a direct HTTPS connection from the CLI, from the same lines of JSON.

## Why it matters for the matrix

The transport a client uses is normally the transport its config names. Here it is not, and the substitution is silent: nothing in the CLI's output says the proxy was skipped.

It also breaks a shortcut worth naming. `npx mcp-remote` in a config file has been a reliable signal that a client is stdio-only and needs a bridge to reach remote servers. For Cline's CLI it means the opposite — the config predates the native transport, and the client is rewriting around it.

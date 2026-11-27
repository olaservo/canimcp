---
id: opencode-wraps-the-sdks-discover-fallback
title: opencode sends initialize to servers the SDK's discover probe gives up on
kind: nuance
summary: opencode leads with server/discover through the TypeScript SDK's auto mode, capped at 5 s. It respawns a stdio server that exits on the probe, and over HTTP it reopens with initialize after a probe timeout or a 5xx, where SDK 2.4.0 alone fails the connect.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - bonusFeatures.protocolEraForcing
clients:
  - opencode
specVersions:
  - 2026-07-28
  - 2025-11-25
sources:
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/mcp/client.ts, connect, the stdio respawn and negotiate
    commit: 740bd1d7
    path: packages/core/src/mcp/client.ts:connect
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/mcp/client.ts, negotiation and the probe cap
    commit: 740bd1d7
    path: packages/core/src/mcp/client.ts:negotiation,PROBE_TIMEOUT,DEFAULT_STARTUP_TIMEOUT
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/mcp/stdio.ts, the pid and stderr accessors
    commit: 740bd1d7
    path: packages/core/src/mcp/stdio.ts:make
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode/commit/70e8a0f6f3
    title: fix(core) fall back to legacy when the MCP probe gets an HTTP 5xx (#66588)
    commit: 70e8a0f6
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0
    title: "@modelcontextprotocol/client 2.4.0, classifyProbeOutcome, classifyHttpError, negotiateEra, detectProbeTransportKind and readStdioServerParams"
    path: dist/public-CvV4ZHkX.mjs
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - ts-sdk-client-default-construction-speaks-2025-only
  - fast-agent-leads-with-the-modern-discover-probe
  - fx-probes-server-discover-before-initialize
---

# opencode sends initialize to servers the SDK's discover probe gives up on

`connect` sets an unset `protocol` to `auto` for stdio and remote servers, and to `legacy` for an attached socket connection. `negotiation` turns `auto` into the SDK's `{ mode: "auto" }` with a probe timeout of 5 s or the startup timeout, whichever is less. The startup timeout defaults to 30 s. `protocol: "legacy"` sends `initialize` with no probe, and a revision pins it.

## What SDK 2.4.0 does with a failed probe

In auto mode the SDK sends `server/discover` at 2026-07-28 and classifies the outcome in `classifyProbeOutcome`. A JSON-RPC error reply, such as `-32601`, is a legacy verdict on every transport, and the SDK sends `initialize` in place. The other outcomes depend on the transport. On stdio, a timeout or a closed connection is a legacy verdict. On HTTP, a timeout is a `RequestTimeout` error and a 5xx answer is an `EraNegotiationFailed` error, and the connect fails.

On stdio the SDK guards against servers that exit on any request before `initialize`. With its own `StdioClientTransport` it probes on a disposable sibling process and spawns the session process after the era is known. With any other stdio transport it probes in place, and a close during the probe throws `EraNegotiationFailed`.

## stdio

opencode spawns servers with its own transport, `McpStdio.make`, so they run in the location's execution environment. The transport exposes `pid` and `stderr` because `detectProbeTransportKind` recognises stdio by those two properties. It has no `_serverParams`, so `readStdioServerParams` returns nothing and the SDK probes in place.

`connect` catches a `ConnectionClosed` or `EraNegotiationFailed` error from an auto stdio connect and spawns the server again with `legacy`. The comment names Python SDK 1.3 as a server that exits on the probe. A server that answers or ignores the probe is spawned once, and one that exits on it is spawned twice. The respawn is skipped when the connection declares no roots, which is the pooled shared connection. The pool gives a server that negotiated legacy its own private connection.

## Streamable HTTP

`negotiate` catches a `RequestTimeout` or a 5xx `EraNegotiationFailed` from an auto connect. If the startup deadline has not passed, it opens a new transport and sends `initialize` with the time that is left. The comment names Spring AI as a server that answers `server/discover` with a 500. The 5xx case landed in `70e8a0f6`. `retrying` wraps the whole attempt and retries a transient failure twice, 250 ms and 1 s apart, inside the same deadline.

## What a server sees

A server that takes longer than 5 s to answer `server/discover` is sent `initialize` at 2025-11-25 on both transports, over a new HTTP connection or in place on stdio. That includes a slow 2026-07-28 server, which then connects only if it also accepts `initialize`.

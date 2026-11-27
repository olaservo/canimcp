---
id: fx-probes-server-discover-before-initialize
title: fx sends server/discover at 2026-07-28 before it tries initialize
kind: idiosyncrasy
summary: fx's hand-written Zig client opens every server with `server/discover` at `2026-07-28` and falls back to `initialize` at `2025-11-25` on a non-modern answer or after 10 seconds. The handshake also accepts `2025-06-18` and `2025-03-26`, and refuses `2024-11-05`.
capabilities:
  - transports.stdio
  - transports.streamableHttp
clients:
  - fx
  - fast-agent
specVersions:
  - 2025-03-26
  - 2025-06-18
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/vercel-labs/fx
    title: src/mcp/core/era.zig, Config, Detector.step and the classify functions
    commit: b4502b01
    path: src/mcp/core/era.zig
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/mcp/server.zig, the request headers for a probe
    commit: b4502b01
    path: src/mcp/server.zig:sendAttempt
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/mcp/server.zig, sendLegacy
    commit: b4502b01
    path: src/mcp/server.zig:Server
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/core/mcp_host/runtime.zig, the engine options fx passes
    commit: b4502b01
    path: src/core/mcp_host/runtime.zig:start
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: tests/e2e/conformance/README.md, the pinned conformance baseline
    commit: b4502b01
    path: tests/e2e/conformance/README.md:MCP conformance baseline
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: tests/e2e/conformance/expected-failures.yml
    commit: b4502b01
    path: tests/e2e/conformance/expected-failures.yml
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - fast-agent-leads-with-the-modern-discover-probe
  - hermes-leads-with-the-legacy-handshake
---

# fx sends server/discover at 2026-07-28 before it tries initialize

fx names its protocol revisions in its own source. `Config` in `src/mcp/core/era.zig` at `c3dc80c4` sets `preferred` to `2026-07-28` and `legacy` to `2025-11-25`, `2025-06-18` and `2025-03-26`, with a 10 second probe timeout. fx passes the engine a client name, a version and a capability object and leaves this config at its default, so no setting or environment variable changes the order. The changelog lists `FX_MCP_ENGINE` as removed in 0.0.15.

The first message to every server is `server/discover` carrying the three `io.modelcontextprotocol/` keys in `_meta`. What happens next depends on the answer:

| Answer to the probe | fx does |
|---|---|
| A result with `supportedVersions` that lists `2026-07-28` | Runs on `2026-07-28` |
| A result listing only a 2025 revision fx has | Sends `initialize` |
| `-32022` with a `supported` list | Probes again with a listed version, or sends `initialize` if only a 2025 one is listed |
| `-32020` or `-32021` | Fails. It does not fall back |
| Any other error, a result without `supportedVersions`, or 10 seconds of silence | Sends `initialize` |
| HTTP 404 with `-32601` | Treats the server as modern without discovery and runs on `2026-07-28` |

`initialize` offers `2025-11-25`. A result naming any of the three 2025 revisions is accepted. A result naming anything else fails the connection with `unsupported_version`, and that includes `2024-11-05`. An `initialize` error that names a modern code or a preferred version sends one more probe. Once a process or connection is on one era fx does not switch it: a `-32022` on a later request can move between modern versions only. On stdio each new server process is probed again.

On HTTP the probe goes out with `MCP-Protocol-Version: 2026-07-28` and `Mcp-Method: server/discover`. The `initialize` POST that follows a fallback goes through `sendLegacy`, which sets the header from the legacy list, so the header and the body agree on the era in both cases.

The probe's capture for fx 0.0.16 shows the same opening: `server/discover` with `protocolVersion` `2026-07-28`, `clientCapabilities` `{}` and `clientInfo` `{"name":"fx","version":"0.0.16"}`, then `subscriptions/listen`, then `tools/list`.

fast-agent is the other client read here that leads with the probe. fast-agent gets its revisions from the Python SDK and exposes a `protocol_mode` switch. fx has neither an SDK nor a switch.

The repo carries the official client conformance suite as a baseline. `tests/e2e/conformance` pins `@modelcontextprotocol/conformance` 0.2.0-alpha.10 at protocol version `2026-07-28`, and `expected-failures.yml` lists no expected failures at `c3dc80c4`. The suite was not run for this read.

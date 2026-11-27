---
id: eve-patches-ai-sdk-mcp-at-build-time
title: eve bundles @ai-sdk/mcp into its package and rewrites three parts of it during the build
kind: idiosyncrasy
summary: "@ai-sdk/mcp is a devDependency that eve compiles into its own package. Three rolldown plugins replace exact snippets of the SDK's dist. They add a fallback to initialize on -32022, keep one GET stream per session, and put a 5 second limit on the session DELETE."
capabilities:
  - transports.streamableHttp
clients:
  - eve
specVersions:
  - 2026-07-28
  - 2025-11-25
sources:
  - url: https://github.com/vercel/eve
    title: packages/eve/scripts/vendor-compiled/@ai-sdk/mcp.mjs, the three patch plugins and the vendor config
    commit: 4545806d
    path: packages/eve/scripts/vendor-compiled/@ai-sdk/mcp.mjs:patchMcpSourcePlugin,supportedProtocolVersionFallback,singleInboundSseStream
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: packages/eve/package.json, dependencies and the devDependency on the SDK
    commit: 4545806d
    path: packages/eve/package.json
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: pnpm-workspace.yaml, the catalog range and the only patchedDependencies entry
    commit: 4545806d
    path: pnpm-workspace.yaml
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: pnpm-lock.yaml, the resolved SDK version
    commit: 4545806d
    path: pnpm-lock.yaml
    date: 2026-11-27
  - url: https://github.com/vercel/eve
    title: packages/eve/scripts/vendor-compiled.mjs, the bundling entry point
    commit: 4545806d
    path: packages/eve/scripts/vendor-compiled.mjs
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99
    title: "@ai-sdk/mcp 2.0.99, protocol constants, init, tryProtocolDiscovery and the HTTP transport"
    path: dist/index.js
    date: 2026-11-16
  - url: https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99
    title: "@ai-sdk/mcp CHANGELOG.md, the 2.0.86 entry on unsupported-version discovery errors"
    path: CHANGELOG.md
    date: 2026-11-16
  - url: https://github.com/vercel/eve
    title: packages/eve/src/context/providers/connection.ts, clients closed at the end of each step
    commit: 4545806d
    path: packages/eve/src/context/providers/connection.ts:connectionProvider
    date: 2026-11-27
status: current
lastVerified: 2026-11-16
related:
  - eve-goes-on-the-wire-as-ai-sdk-mcp-client
  - opencode-patches-its-sdk-for-session-recovery
---

# eve bundles @ai-sdk/mcp into its package and rewrites three parts of it during the build

`@ai-sdk/mcp` is listed under `devDependencies` of `packages/eve` as `catalog:`. `pnpm-workspace.yaml` sets that to `^2.0.99` and `pnpm-lock.yaml` resolves it to `2.0.99`. The package's `dependencies` are `nitro`, `rolldown` and `undici`. `scripts/vendor-compiled.mjs` bundles the SDK's main entry into `.generated/compiled/@ai-sdk/mcp/index.js`, which ships as `dist/src/compiled/@ai-sdk/mcp/index.js` and is imported as `#compiled/@ai-sdk/mcp/index.js`. The published package does not depend on `@ai-sdk/mcp`.

The usual places to look for a patch show nothing. `patches/` holds one file, for `@vercel/geistdocs`, and it is the only `patchedDependencies` entry. The patches are three rolldown transform plugins in `packages/eve/scripts/vendor-compiled/@ai-sdk/mcp.mjs`. Each replaces exact source snippets of `@ai-sdk/mcp/dist/index.js` and throws when a snippet is missing, so an SDK bump that changes the patched code fails the build.

- `supported-protocol-version-fallback`. The SDK throws when `server/discover` is answered with `-32022` and the error lists a handshake-era version. Its message tells the caller to set `protocolVersionDiscovery: false`, and the 2.0.86 changelog entry describes that release as "avoiding automatic legacy fallback". eve's patch picks the newest listed version the client supports and returns to the `initialize` path. It also makes `initialize` send that version, where the SDK always sends `2025-11-25`.
- `single-inbound-sse-stream`. The comment says one connect could send up to three standalone GET requests on a handshake-era session, and cites eve issue 4379. The patch makes `inboundSseConnection` a slot that is taken when a GET starts, and opens the stream only once a session id exists.
- `bounded-session-termination`. The SDK's `close()` sends the session `DELETE` with no signal. The patch gives it a 5 second deadline. eve awaits `close()` at the end of every step.

The protocol default is the SDK's. `protocolVersionDiscovery` defaults to `true` in the SDK constructor and eve forwards the connection's value unchanged. An HTTP connection starts with `server/discover` at `2026-07-28`, with no timeout. A JSON-RPC error other than `-32020`, `-32021` and `-32022`, or an HTTP error status other than 401, leads to `initialize`. A 401 goes to eve's sign-in flow. A network failure fails the connection. The SSE fallback transport has no discovery support and always uses `initialize`.

The bundle in the probe's install of eve `1.0.0-rc.6` contains the three patched snippets over SDK 2.0.73. The probe's capture from that build shows `server/discover` first by default and `initialize` at `2025-11-25` with `protocolVersionDiscovery: false`, which is what this read finds for 2.0.99.

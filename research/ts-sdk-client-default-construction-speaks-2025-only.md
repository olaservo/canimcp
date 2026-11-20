---
id: ts-sdk-client-default-construction-speaks-2025-only
title: A default TypeScript SDK Client runs the 2025 handshake and never probes server/discover
kind: idiosyncrasy
summary: In @modelcontextprotocol/client 2.4.0 and at 5ee54ee3, versionNegotiation defaults to legacy, so new Client(info) sends initialize at 2025-11-25 and declares {}. Reaching 2026-07-28 takes mode auto or a pin, and on stdio auto spawns the server a second time for the probe.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - bonusFeatures.protocolEraForcing
clients:
  - ts-sdk-client
  - mastra
  - libfx
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/modelcontextprotocol/typescript-sdk
    title: packages/client/src/client/versionNegotiation.ts, the three modes and DEFAULT_VERSION_NEGOTIATION_MODE
    commit: 5ee54ee3
    path: packages/client/src/client/versionNegotiation.ts:67-112
    date: 2026-11-20
  - url: https://github.com/modelcontextprotocol/typescript-sdk
    title: packages/client/src/client/versionNegotiation.ts, resolveVersionNegotiation and the probe request
    commit: 5ee54ee3
    path: packages/client/src/client/versionNegotiation.ts:132-154,355-376
    date: 2026-11-20
  - url: https://github.com/modelcontextprotocol/typescript-sdk
    title: packages/client/src/client/versionNegotiation.ts, negotiateStdioViaSibling
    commit: 5ee54ee3
    path: packages/client/src/client/versionNegotiation.ts:601-664
    date: 2026-11-20
  - url: https://github.com/modelcontextprotocol/typescript-sdk
    title: packages/client/src/client/client.ts, connect, the legacy handshake and the negotiated connect
    commit: 5ee54ee3
    path: packages/client/src/client/client.ts:1040-1053,1093-1158,1166-1244
    date: 2026-11-20
  - url: https://github.com/modelcontextprotocol/typescript-sdk
    title: packages/core/src/constants.ts, LATEST_PROTOCOL_VERSION and SUPPORTED_PROTOCOL_VERSIONS
    commit: 5ee54ee3
    path: packages/core/src/constants.ts:1-3
    date: 2026-11-20
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0
    title: "@modelcontextprotocol/client 2.4.0, dist/public-CvV4ZHkX.mjs, DEFAULT_VERSION_NEGOTIATION_MODE"
    path: dist/public-CvV4ZHkX.mjs:2180
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - ts-sdk-client-probe-auto-config-ran-legacy
  - mastra-declares-only-mcp-apps-and-dropped-roots-and-sampling
  - fast-agent-leads-with-the-modern-discover-probe
---

# A default TypeScript SDK Client runs the 2025 handshake and never probes server/discover

`ClientOptions.versionNegotiation` is documented as opt-in, and `DEFAULT_VERSION_NEGOTIATION_MODE` is `'legacy'` in both the 2.4.0 tarball and HEAD at 5ee54ee3. A client built with `new Client({ name, version })` and no options sends `initialize` with `protocolVersion` 2025-11-25, `capabilities: {}` and the application's `clientInfo`. It accepts 2025-11-25, 2025-06-18, 2025-03-26, 2024-11-05 and 2024-10-07 in the reply. No `server/discover` is sent, no 2026 header is set, and `MCP-Protocol-Version` is set from the reply after the handshake.

The SDK has no default `clientInfo`. The constructor takes it as a required argument, so the wire name is whatever the application passes.

## The three modes

- `legacy`: the plain handshake above.
- `auto`: sends `server/discover` at 2026-07-28, the only entry in `SUPPORTED_MODERN_PROTOCOL_VERSIONS`, with the protocol version, client info and capabilities in the `_meta` envelope. Definitive modern evidence selects 2026-07-28. Anything else falls back to the same `initialize` the legacy mode sends. A probe timeout falls back on stdio and is a typed connect error on HTTP. One `-32022` reply gets one corrective retry at the version the server names.
- `{ pin: '2026-07-28' }`: discover only, no fallback. Pinning a 2025 revision throws at connect.

So the SDK leads with 2025-11-25 by default and with 2026-07-28 in `auto`. A client on this SDK that leads with discover made that choice itself. Mastra passes `auto`.

## The stdio probe spawns the server twice

In `auto` mode on the base `StdioClientTransport`, the probe runs on a sibling process spawned from the same command, args and env, with its stderr discarded. That sibling is reaped, and the session process is spawned after the era is known. Every `auto` connect to a stdio server therefore starts the server twice. The comment gives the reason: servers built on SDKs that exit on any request before `initialize` would otherwise lose their one process. A subclass of `StdioClientTransport` probes in place, and there a close during the probe is a connect error.

## After 2.4.0

The eight commits on `main` after the 2.4.0 tag do not touch the negotiation default. The comment beside the constant says changing it is a one-line flip.

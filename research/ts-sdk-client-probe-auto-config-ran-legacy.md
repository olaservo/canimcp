---
id: ts-sdk-client-probe-auto-config-ran-legacy
title: The probe's ts-sdk-client auto config ran the SDK's legacy default
kind: misconception
summary: probe/hosts/ts-sdk-client labels its auto config as server/discover first, but call.ts passes no versionNegotiation for it, so the SDK's legacy default ran. Both configs captured initialize at 2025-11-25 and no record exercises auto mode.
capabilities:
  - bonusFeatures.protocolEraForcing
clients:
  - ts-sdk-client
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/modelcontextprotocol/typescript-sdk
    title: packages/client/src/client/versionNegotiation.ts, DEFAULT_VERSION_NEGOTIATION_MODE
    commit: 5ee54ee3
    path: packages/client/src/client/versionNegotiation.ts:108-112
    date: 2026-11-20
  - url: https://github.com/modelcontextprotocol/typescript-sdk
    title: packages/client/src/client/versionNegotiation.ts, resolveVersionNegotiation
    commit: 5ee54ee3
    path: packages/client/src/client/versionNegotiation.ts:132-139
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - ts-sdk-client-default-construction-speaks-2025-only
---

# The probe's ts-sdk-client auto config ran the SDK's legacy default

`probe/hosts/ts-sdk-client/adapter.ts` declares two configs. `auto` is described as "Default version negotiation: server/discover first, initialize fallback". `legacy` is described as the initialize handshake only.

`call.ts` builds the client with `negotiation === 'legacy' ? { versionNegotiation: { mode: 'legacy' } } : undefined`. For `auto` it passes no options. With no `versionNegotiation`, `resolveVersionNegotiation` returns the default mode, which is `legacy`. Both configs therefore ran the same connect.

The run directories under `probe/runs/ts-sdk-client@2.4.0/` agree. In `auto/both-stdio/tools.result.mirror/wire.jsonl` and the `legacy` counterpart, the first message is `initialize` with `protocolVersion` 2025-11-25, `capabilities: {}` and `clientInfo.name` `canimcp-probe-ts-sdk-client`, and there is no `server/discover`. `host-result.json` reports `negotiatedVersion` 2025-11-25 for `auto`. Every record in `data/verified/ts-sdk-client.json` has `at` 2025-11-25.

The `auto` records are valid as a second run of the default construction. They are not evidence about `auto` mode. Two fixes would make the labels true: describe the existing config as the default (legacy) and add a config that passes `{ versionNegotiation: { mode: 'auto' } }`, which over stdio also exercises the sibling-process probe.

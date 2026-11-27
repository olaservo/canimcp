---
id: huggingface-chat-ui-cannot-ping-a-modern-pooled-connection
title: Hugging Face Chat UI replaces a 2026-07-28 pooled connection whenever it has been idle 30 seconds
kind: idiosyncrasy
summary: The connection pool pings a client idle more than 30 seconds before reusing it. ping does not exist in 2026-07-28, so on a modern connection SDK 2.0.0 refuses it locally, the pool treats the client as stale, and a new connection with a new server/discover takes its place.
capabilities:
  - transports.streamableHttp
clients:
  - huggingface-chat-ui
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/clientPool.ts, getClient
    commit: 7fc0f672
    path: src/lib/server/mcp/clientPool.ts:getClient
    date: 2026-11-27
  - url: https://github.com/huggingface/chat-ui
    title: src/lib/server/mcp/client.ts, createMcpClient
    commit: 7fc0f672
    path: src/lib/server/mcp/client.ts:createMcpClient
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0
    title: "@modelcontextprotocol/client 2.0.0, dist/src-D_zzAWoS.mjs, the 2026-07-28 request registry and Protocol._assertOutboundRequestInEra"
    path: dist/src-D_zzAWoS.mjs:Protocol._assertOutboundRequestInEra
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0
    title: "@modelcontextprotocol/client 2.0.0, dist/index.mjs, Client.ping"
    path: dist/index.mjs:Client.ping
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
---

# Hugging Face Chat UI replaces a 2026-07-28 pooled connection whenever it has been idle 30 seconds

At `7fc0f672`, `getClient` in `clientPool.ts` hands back a pooled client as it is if it was used in the last 30 seconds. After that it calls `client.ping()` with a five-second timeout first, because proxies drop idle connections. If the ping throws, the client is evicted and a new one is connected.

Chat UI builds every client with `versionNegotiation: { mode: "auto" }`, so against a server that answers `server/discover` the connection is on 2026-07-28. That revision removed `ping`. In `@modelcontextprotocol/client` 2.0.0 the 2026-07-28 request registry lists `tools/call`, `tools/list`, the prompt, resource and completion methods, `server/discover` and `subscriptions/listen`, and no `ping`. `Protocol.request` checks the method against the negotiated era before anything is sent and throws `MethodNotSupportedByProtocolVersion`. `Client.ping` is a plain `request({ method: "ping" })`, so it throws too.

`getClient` catches that like any failed ping. The pooled client is evicted and closed, and a new client runs the `server/discover` probe again. On a modern server the pool only saves a connection when the next call comes within 30 seconds of the last one. Nothing fails from the user's side, since a 2026-07-28 connection holds no session to lose and the new probe is one extra request.

On a 2025-era connection the ping is sent and answered, and the pool behaves as its comments describe, closing a client after 10 idle minutes.

This was read from source and from the published SDK. No run confirmed it, and Chat UI's pool tests mock the SDK client.

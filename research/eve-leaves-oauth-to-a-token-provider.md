---
id: eve-leaves-oauth-to-a-token-provider
title: eve sends a bearer from a token provider and runs none of the MCP authorization flow itself
kind: nuance
summary: A connection's auth is a token provider. eve passes no authProvider to @ai-sdk/mcp, so metadata discovery, registration and PKCE never run in eve. It connects anonymously and asks for sign-in on a 401 or on an error result with _meta mcp/www_authenticate.
capabilities:
  - authentication.oauth
  - authentication.oauth.dynamicRegistration
  - authentication.oauth.clientIdMetadataDocument
  - authentication.oauth.protectedResourceMetadata
  - authentication.header
clients:
  - eve
specVersions:
  - 2026-07-28
  - 2025-11-25
sources:
  - url: https://github.com/vercel/eve
    title: packages/eve/src/runtime/connections/mcp-client.ts, 401 handling, #createClient, #authorizedFetch and the result challenge
    commit: 0940c042
    path: packages/eve/src/runtime/connections/mcp-client.ts
    date: 2026-11-16
  - url: https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99
    title: "@ai-sdk/mcp 2.0.99, the OAuth client and authorizeOnce, which needs an authProvider"
    path: dist/index.js
    date: 2026-11-16
  - url: https://github.com/vercel/eve
    title: packages/eve/src/shared/connection-types.ts, the two AuthorizationDefinition shapes
    commit: 0940c042
    path: packages/eve/src/shared/connection-types.ts
    date: 2026-11-16
  - url: https://github.com/vercel/eve
    title: docs/connections/mcp.mdx, Vercel Connect and when eve asks for sign-in
    commit: 4545806d
    path: docs/connections/mcp.mdx:Use Vercel Connect for OAuth,When eve asks for sign-in
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@vercel/connect/v/2.9.2
    title: "@vercel/connect 2.9.2, the token and authorize endpoints"
    path: dist/token.js
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - eve-defers-every-mcp-tool-and-reads-one-page
---

# eve sends a bearer from a token provider and runs none of the MCP authorization flow itself

`@ai-sdk/mcp` 2.0.99 has an OAuth client. It reads `resource_metadata` from `WWW-Authenticate`, fetches protected resource metadata and authorization server metadata, registers a client, and uses PKCE. All of it is driven by an `authProvider` on the transport. eve's `#createClient` passes `fetch`, `headers`, `type` and `url`, and no `authProvider`, so none of that code runs. eve's own fetch wrapper checks the status of a 401 and cancels the body. It does not read `WWW-Authenticate`.

The connection's `auth` is a token provider. With `getToken` alone, eve calls it and sends `Authorization: Bearer <token>`. With `startAuthorization` and `completeAuthorization` as well, eve runs an interactive sign-in: it suspends the turn on a webhook it owns and resumes when the provider completes. The documented provider is `connect()` from `@vercel/connect/eve`. `@vercel/connect` 2.9.2 requests tokens from Vercel Connect's API at `/v1/connect/token/<connector>`. Which OAuth features Vercel Connect uses towards the server's authorization server was not read.

Sign-in is lazy. When `getToken` throws `ConnectionAuthorizationRequiredError`, eve connects with no `Authorization` header and lists tools. Sign-in starts on an HTTP 401, or when a `tools/call` returns `isError: true` with a non-empty `_meta["mcp/www_authenticate"]`. The source comment names that key as the OpenAI Apps SDK convention. On a 401 to a request that carried a token, eve evicts the token, asks the provider again and retries once before it asks the user. A 403 is passed through.

eve's docs state what follows for servers. A server that leaves protected tools out of an anonymous `tools/list` never triggers sign-in, because the model cannot find those tools.

Headers are resolved for every request. A `headers` map can hold static values, promises or callbacks that receive the session context. An `Authorization` key in `headers` is rejected when `auth` is also set.

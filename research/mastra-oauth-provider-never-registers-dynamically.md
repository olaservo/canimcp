---
id: mastra-oauth-provider-never-registers-dynamically
title: Mastra's OAuth provider takes a pre-registered client or a CIMD URL and never registers dynamically
kind: idiosyncrasy
summary: At bb984550 MCPOAuthClientProvider requires `clientInformation` or `clientMetadataUrl` and has no `saveClientInformation`. It always returns client information, so SDK 2.4.0 skips both dynamic registration and its `client_id_metadata_document_supported` check.
capabilities:
  - authentication.oauth
  - authentication.oauth.dynamicRegistration
  - authentication.oauth.clientIdMetadataDocument
  - authentication.oauth.issuerIdentification
clients:
  - mastra
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/oauth-provider.ts, header comment, constructor and clientInformation()
    commit: 79768b13
    path: packages/mcp/src/client/oauth-provider.ts:MCPOAuthClientProvider,MCPOAuthClientProvider.clientInformation
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/configuration.ts, authenticate() and runAuthorizationFlow
    commit: 79768b13
    path: packages/mcp/src/client/configuration.ts:MCPClient.authenticate,MCPClient.runAuthorizationFlow
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/src/client/client.ts, finishAuth
    commit: 79768b13
    path: packages/mcp/src/client/client.ts:InternalMastraMCPClient.finishAuth
    date: 2026-11-27
  - url: https://github.com/mastra-ai/mastra
    title: packages/mcp/CHANGELOG.md, 2.0.0 OAuth change and the 1.0.0 provider description
    commit: bb984550
    path: packages/mcp/CHANGELOG.md:Major Changes,Minor Changes
    date: 2026-11-16
  - url: https://github.com/mastra-ai/mastra
    title: mastracode/sdk/src/mcp/manager.ts, Mastra Code's provider construction
    commit: 79768b13
    path: mastracode/sdk/src/mcp/manager.ts:createOAuthProvider
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0
    title: "@modelcontextprotocol/client 2.4.0, dist/public-CvV4ZHkX.mjs, client identity branch of auth()"
    path: dist/public-CvV4ZHkX.mjs
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - kilocode-adds-cimd-and-pre-connect-token-refresh
  - codex-prefers-a-chatgpt-hosted-client-identifier
---

# Mastra's OAuth provider takes a pre-registered client or a CIMD URL and never registers dynamically

`MCPOAuthClientProvider` is the OAuth provider `@mastra/mcp` ships. Its constructor throws unless exactly one of `clientInformation` and `clientMetadataUrl` is passed, and the error text says dynamic client registration is not supported. The class has no `saveClientInformation` method. The 1.0.0 changelog described the provider as supporting RFC 7591 registration; the 2.0.0 entry says it "never registers dynamically" and lists `registerClient` and `OAuthClientRegistrationError` as removed.

## How that meets the SDK

`clientInformation()` returns the pre-registered information, or `{ client_id: clientMetadataUrl }`. It never returns `undefined`.

In SDK 2.4.0, `auth()` asks the provider for client information first. Only when it gets none does it look at `metadata.client_id_metadata_document_supported`, use the CIMD URL when that is `true`, and otherwise call `registerClient()`. Because Mastra's provider always answers, that branch does not run. The CIMD URL is sent as `client_id` to any authorization server, including one that has not advertised CIMD support. What such a server answers was not tested.

A server that offers only dynamic registration cannot be reached with the shipped provider unless a client is registered with it out of band. `HttpServerDefinition.authProvider` accepts any SDK `OAuthClientProvider`, so an application can pass its own provider with `saveClientInformation` and get the SDK's registration path. `MCPClient.authenticate()` only runs for an `MCPOAuthClientProvider`.

## The rest of the flow

`authenticate(serverName)` requires an `http:` loopback redirect URL. It pins a state value, binds a callback server on the redirect port or one of the next sequential ports, and points the provider at the URL that bound. It then connects, waits for the callback when the SDK throws `UnauthorizedError`, and calls `finishAuth(code, iss)`. The RFC 9207 `iss` from the callback goes to the SDK for validation before the code is exchanged. Tokens are stored under a key that includes the issuer. The default store is in memory.

Mastra Code uses the same provider. Without a configured `oauth.clientId` it passes a hosted Client ID Metadata Document URL as the client identity, and it stores tokens in a file per server.

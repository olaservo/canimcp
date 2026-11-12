---
id: kilocode-adds-cimd-and-pre-connect-token-refresh
title: Kilo Code adds CIMD and a pre-connect token refresh to opencode's OAuth path
kind: nuance
summary: Kilo offers a hosted client metadata document as its OAuth client id when no client is configured, ahead of DCR. It refreshes an expired stored token before connecting, because some servers answer an expired token with 403 and SDK 1.32.1 only retries 401.
capabilities:
  - authentication.oauth
  - authentication.oauth.clientIdMetadataDocument
  - authentication.oauth.dynamicRegistration
clients:
  - kilocode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/Kilo-Org/kilocode
    title: packages/opencode/src/mcp/oauth-provider.ts, clientMetadataUrl and clientMetadata
    commit: 278edf3a
    path: packages/opencode/src/mcp/oauth-provider.ts:56-83
    date: 2026-11-10
  - url: https://github.com/Kilo-Org/kilocode
    title: packages/opencode/src/kilocode/mcp/refresh.ts
    commit: 278edf3a
    path: packages/opencode/src/kilocode/mcp/refresh.ts:6-18
    date: 2026-11-10
  - url: https://github.com/Kilo-Org/kilocode
    title: packages/opencode/src/mcp/index.ts, connectRemote
    commit: 278edf3a
    path: packages/opencode/src/mcp/index.ts:349-366
    date: 2026-11-10
  - url: https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.1
    title: "@modelcontextprotocol/sdk 1.32.1, dist/esm/client/auth.js"
    path: dist/esm/client/auth.js:302-309
    date: 2026-11-10
status: current
lastVerified: 2026-11-10
related:
  - kilocode-runs-opencodes-mcp-client-behind-every-surface
---

# Kilo Code adds CIMD and a pre-connect token refresh to opencode's OAuth path

opencode at `7cde8329` registered OAuth clients by DCR or a configured `clientId`, with no CIMD. Kilo's `McpOAuthProvider` adds a `clientMetadataUrl` getter returning `https://kilo.ai/docs/oauth/kilo/client.json`. The getter returns nothing when a `clientId` or `clientSecret` is configured, or when the redirect URI is not the default `http://127.0.0.1:<port>/<callback path>`, because the hosted document describes a public client with that callback. SDK 1.32.1 uses the URL as the `client_id` when the authorization server advertises support for URL-based client ids, and falls back to DCR otherwise. Codex is the other client read here with CIMD, and it also prefers CIMD to DCR.

The refresh covers a server behaviour the SDK does not handle. Some servers reject an expired access token with 403. The SDK retries only a 401 as an auth failure, so an expired token that could be refreshed is reported as `needs_auth` and the user is sent through sign-in again. Before connecting, Kilo refreshes a stored token that has expired or has less than 30 seconds left. The refresh is bounded by the connect timeout and goes to the authorization server the credentials are bound to, not one rediscovered from the resource URL. It is single-flight per server URL because several directory instances share one credential file and refresh tokens rotate. A fetch wrapper ties any automatic invalidation to the credential that was rejected, so a late failure cannot wipe a newer rotated token.

The patch Kilo applies to SDK 1.32.1 also changes scope selection: it appends `offline_access` when the authorization server lists it and the client metadata includes the `refresh_token` grant.

---
id: n8n-does-mcp-oauth-in-its-credential-layer
title: n8n does MCP OAuth in its credential layer, and CIMD is off until an environment variable turns it on
kind: nuance
summary: At 84decbe0 the MCP nodes never pass an SDK auth provider. OAuth discovery, DCR and CIMD run when a user connects an MCP OAuth2 credential in the editor, and the node only sends the bearer token. CIMD needs N8N_OAUTH_CIMD_ENABLED, which defaults to false.
capabilities:
  - authentication.oauth
  - authentication.oauth.clientIdMetadataDocument
  - authentication.oauth.dynamicRegistration
  - authentication.oauth.protectedResourceMetadata
clients:
  - n8n
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/n8n-io/n8n
    title: McpOAuth2Api credential, useDynamicClientRegistration default true
    commit: 467bcd35
    path: packages/@n8n/nodes-langchain/credentials/McpOAuth2Api.credentials.ts:McpOAuth2Api
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: oauth.service.ts, protected resource discovery and resource resolution
    commit: 467bcd35
    path: packages/cli/src/oauth/oauth.service.ts:OauthService.discoverAndResolveResource
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: oauth.service.ts, registerClient (AS metadata, CIMD, DCR)
    commit: 467bcd35
    path: packages/cli/src/oauth/oauth.service.ts:OauthService
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: auth.config.ts, N8N_OAUTH_CIMD_ENABLED
    commit: 467bcd35
    path: packages/@n8n/config/src/configs/auth.config.ts:AuthConfig
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: shared/utils.ts, auth headers and the 401 refresh
    commit: 467bcd35
    path: packages/@n8n/nodes-langchain/nodes/mcp/shared/utils.ts
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: pkce-challenge patch
    commit: 467bcd35
    path: patches/pkce-challenge@5.0.0.patch
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - n8n-sends-the-node-type-as-client-name
---

# n8n does MCP OAuth in its credential layer, and CIMD is off until an environment variable turns it on

The MCP nodes construct `StreamableHTTPClientTransport` and `SSEClientTransport` with a custom `fetch` and no `authProvider`. The SDK's OAuth code never runs. Authentication is whatever n8n credential the node uses: Bearer, Header, Multiple Headers, a generic OAuth2 credential, or the MCP OAuth2 credential.

The MCP OAuth2 credential extends n8n's generic OAuth2 credential. When the user clicks connect in the editor, `oauth.service.ts` in the `cli` package does the work:

- Reads protected resource metadata from the credential's server URL, path-inserted first, then the root. It does not read a `WWW-Authenticate` challenge from the MCP server.
- Reads authorization server metadata from RFC 8414 and OIDC well-known URLs in order, and rejects a document whose `issuer` does not match.
- Prefers the protected resource's scopes, adding `offline_access` when the server supports it.
- Uses CIMD when `N8N_OAUTH_CIMD_ENABLED` is true, the server advertises `client_id_metadata_document_supported`, S256 PKCE and public clients, and the metadata URL is HTTPS with a path. The default is false, so a default install registers by DCR with `client_name: n8n`.
- Sends `resource` on the authorization and token requests and checks `iss` on the callback.

At run time the node reads the stored token. A 401 on any MCP request calls n8n's token refresh and retries once. A failed refresh surfaces as an auth error on the node. Nothing starts a new authorization from inside a workflow run.

The pnpm workspace patches `pkce-challenge` 5.0.0, a dependency of the SDK, to drop `~` from the verifier alphabet. n8n's own OAuth service imports that package. The MCP nodes do not reach the SDK's auth module, so the patch does not change SDK behaviour on the MCP path, and `metadata.sdk.patched` is false.

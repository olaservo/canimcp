---
id: pi-uses-a-per-server-client-id-document-without-iss
title: pi signs in with a Client ID Metadata Document on pi.dev, and switches to a per-server document when the authorization server sends no iss
kind: idiosyncrasy
summary: Since 1.5.0 pi prefers its Client ID Metadata Document on pi.dev over dynamic registration. When the authorization server does not advertise the RFC 9207 iss parameter, pi uses a document and a callback path derived from the MCP server URL.
capabilities:
  - authentication.oauth.clientIdMetadataDocument
  - authentication.oauth.dynamicRegistration
  - authentication.oauth.issuerIdentification
clients:
  - pi
  - openai-codex
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/earendil-works/pi
    title: packages/mcp/src/oauth/client-settings.ts, offersClientMetadataDocument, clientMetadataDocument and callbackId
    commit: 5c0917b7
    path: packages/mcp/src/oauth/client-settings.ts
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/mcp/src/oauth/flow.ts, runFlow, where a stored client wins and the iss parameter is checked
    commit: 5c0917b7
    path: packages/mcp/src/oauth/flow.ts:runFlow
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/mcp/oauth.ts, pi's documents and the rebranded-build rule
    commit: 5c0917b7
    path: packages/coding-agent/src/extensions/mcp/oauth.ts
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/core/mcp-servers.ts, isClientMetadataDocumentCallback
    commit: 5c0917b7
    path: packages/coding-agent/src/core/mcp-servers.ts:isClientMetadataDocumentCallback
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/mcp/src/oauth/loopback.ts, the extra callback path the loopback server listens on
    commit: 5c0917b7
    path: packages/mcp/src/oauth/loopback.ts:listenForLoopbackSignIn
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/docs/mcp.md, Authenticate with OAuth
    commit: 5c0917b7
    path: packages/coding-agent/docs/mcp.md:Authenticate with OAuth
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi/commit/908aa7b74baa7502321293797313f64c6fec22ee
    title: feat(coding-agent) prefer the client ID metadata document for MCP OAuth, first released in v1.5.0
    commit: 908aa7b7
    date: 2026-11-16
  - url: https://pi.dev/oauth/client.json
    title: pi's Client ID Metadata Document as served on 2026-11-16
    date: 2026-11-16
status: current
lastVerified: 2026-11-27
related:
  - codex-prefers-a-chatgpt-hosted-client-identifier
  - kilocode-adds-cimd-and-pre-connect-token-refresh
  - pi-runs-the-official-conformance-suite-in-ci
---

# pi signs in with a Client ID Metadata Document on pi.dev, and switches to a per-server document when the authorization server sends no iss

pi picks how to identify itself to an authorization server in this order:

1. A `clientId` in the server's `oauth` block, with an optional `clientSecret`.
2. A client it registered earlier, kept in `mcp-auth.json` while its redirect URI still matches and until the user signs out.
3. Its Client ID Metadata Document, when the authorization server's metadata has `client_id_metadata_document_supported` and lists `none` in `token_endpoint_auth_methods_supported`.
4. Dynamic client registration, with `client_name` `pi`.

Step 3 is skipped in the default `auto` mode when the entry sets `oauth.clientName`, or when the callback is not `/callback` on `localhost` or `127.0.0.1`, because pi's documents list only those redirect URIs. `oauth.clientRegistration` forces the choice: `dcr` always registers, and `cimd` fails the sign-in when the server does not support documents for public clients. A document used as the client is not written to the store.

## Two documents

When the authorization server advertises `authorization_response_iss_parameter_supported`, the client id is `https://pi.dev/oauth/client.json` and the redirect URI is the loopback one, `http://127.0.0.1:<port>/callback`. At the code exchange pi compares the `iss` parameter of the response with the metadata issuer and refuses a mismatch.

When the server does not advertise it, pi uses `https://pi.dev/oauth/<id>/client.json` with the redirect URI `http://127.0.0.1:<port>/callback/<id>`. The id is the first nine bytes of the SHA-256 of the MCP server URL without its fragment, in base64url, which is twelve characters. The loopback server listens on both paths and rejects a response that arrives on a path other than the one the pending sign-in expects. The source comment cites RFC 9700 section 4.4.2.2 and says the id is computed the way Codex computes its own.

`https://pi.dev/oauth/client.json` answered 200 on 2026-11-16 with `token_endpoint_auth_method` `none` and the redirect URIs `http://127.0.0.1/callback` and `http://localhost/callback`. A per-server document was not fetched.

## History and limits

The document was opt-in from v1.0.1 (`1499466d`, 2026-10-02) and became the preferred method in v1.5.0 (`908aa7b7`, 2026-10-30). A build whose app name is not `pi` registers dynamically in `auto` mode, so a rebranded build does not present pi's documents.

pi's conformance baseline lists `auth/basic-cimd` as failing the `cimd-client-id-used` check. The suite expects its own document URL, and pi sends the pi.dev one.

The registry records Codex as preferring a document under chatgpt.com, keyed by a callback id or shared when the server advertises `authorization_response_iss_parameter_supported`, and Kilo Code as offering one document URL for every server.

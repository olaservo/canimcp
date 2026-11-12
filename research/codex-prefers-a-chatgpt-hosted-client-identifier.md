---
id: codex-prefers-a-chatgpt-hosted-client-identifier
title: Codex takes CIMD over DCR, with a client identifier hosted on chatgpt.com
kind: idiosyncrasy
summary: When an authorization server advertises client_id_metadata_document_supported and accepts public clients, Codex registers with an HTTPS client identifier under chatgpt.com keyed by the ephemeral loopback callback id, and only falls back to Dynamic Client Registration otherwise.
capabilities:
  - authentication.oauth.clientIdMetadataDocument
  - authentication.oauth.dynamicRegistration
clients:
  - openai-codex
specVersions:
  - 2025-11-25
  - 2026-07-28
tracking:
  state: proposed
  seps:
    - 991
  lastActivity: 2026-08-24
sources:
  - url: https://github.com/openai/codex
    title: codex-rs/rmcp-client/src/oauth_client_registration.rs
    commit: b705b6b0
    path: codex-rs/rmcp-client/src/oauth_client_registration.rs:32-110
    date: 2026-08-24
  - url: https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/
    title: OAuth Client ID Metadata Document (IETF Internet-Draft)
    date: 2026-08-24
  - url: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration
    title: 2026-07-28 authorization, client registration
    date: 2026-08-24
status: current
lastVerified: 2026-08-24
---

# Codex takes CIMD over DCR, with a client identifier hosted on chatgpt.com

Client ID Metadata Documents replace registration with resolution: instead of calling a registration endpoint to be issued a `client_id`, the client presents an HTTPS URL as its `client_id` and the authorization server fetches the metadata from it. `2026-07-28` puts CIMD above DCR in its client-registration order, and Codex implements that order.

The choice is made per login, from the authorization server's own metadata:

```rust
let offer_cimd = match client_registration {
    McpOAuthClientRegistration::Auto => {
        cimd_advertised && native_redirect_supported && public_client_auth_supported
    }
    ...
};
```

`Auto` is the default. All three conditions must hold: the server advertises `client_id_metadata_document_supported`, it lists `none` in `token_endpoint_auth_methods_supported`, and the redirect URI is a loopback callback Codex itself constructed. Otherwise rmcp falls through to DCR.

The registration modes are also selectable directly — `Cimd` requires it and fails loudly if the server does not advertise it, `Dcr` skips the check.

## The identifier is a ChatGPT URL

```rust
request = request.with_client_metadata_url(format!(
    "https://chatgpt.com/oauth/codex/{callback_id}/client.json"
));
```

The `callback_id` is the same value the loopback redirect path is keyed on, so the metadata document is per-login rather than a single static Codex client identity. The authorization server therefore resolves a `chatgpt.com` URL during an MCP login against an unrelated server, and what it reads there is served by OpenAI.

The native redirect check is strict about that binding: the URI must be `http` on `127.0.0.1` or `localhost`, on a real port, with path exactly `/callback/{callback_id}`, and no query, fragment, username or password.

## What it means for a server operator

An authorization server that advertises CIMD and public-client auth will see Codex arrive with an HTTPS `client_id` and no registration call. One that does not advertise it sees ordinary DCR. Both paths are live in the same binary, and which one a given operator sees depends on their own metadata, not on anything Codex is configured with.

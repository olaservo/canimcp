---
id: opencode-patches-its-sdk-for-session-recovery
title: opencode ships a patched MCP SDK that recovers an expired HTTP session
kind: idiosyncrasy
summary: opencode applies a bun patch to @modelcontextprotocol/sdk 1.29.0 that clears the session and retries once when a request carrying a session id gets a 404. Stock 1.29.0 has no recovery path, so opencode's Streamable HTTP behaviour is not the SDK's.
capabilities:
  - transports.streamableHttp
clients:
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/anomalyco/opencode
    title: patches/@modelcontextprotocol%2Fsdk@1.29.0.patch
    commit: 7cde8329
    path: patches/@modelcontextprotocol%2Fsdk@1.29.0.patch
    date: 2026-08-24
  - url: https://github.com/anomalyco/opencode
    title: bun.lock, the patch registration
    commit: 7cde8329
    path: bun.lock:1070
    date: 2026-08-24
  - url: https://github.com/anomalyco/opencode
    title: packages/opencode/test/fixture/mcp-session-recovery.ts
    commit: 7cde8329
    path: packages/opencode/test/fixture/mcp-session-recovery.ts
    date: 2026-08-24
status: current
lastVerified: 2026-08-24
---

# opencode ships a patched MCP SDK that recovers an expired HTTP session

opencode pins `@modelcontextprotocol/sdk` at an exact `1.29.0` and then patches it. `bun.lock` registers the patch, so it applies on every install rather than being a local experiment.

The patch touches four runtime files — `client/index.js`, `client/streamableHttp.js`, `client/auth.js` and `shared/protocol.js` — not only type declarations. Reading the SDK to learn what opencode does on the wire gives the wrong answer.

## What it changes

The main addition is session recovery. In stock 1.29.0 a `404` from the server is an error, and a client holding a session the server has forgotten stays broken until something restarts it. The patched transport treats a `404` on a request that carried an `mcp-session-id` as a signal to recover: it clears the session id, awaits `onsessionexpired`, and retries the request once, with `isSessionRetry` preventing a loop.

Three smaller changes come with it:

- A JSON-RPC *error* response arriving over SSE now counts as a response. Stock only counted results, so an error left the transport believing the request was unanswered and eligible for a reconnect.
- A returned `mcp-session-id` is only stored if the request that produced it was for the current session, so a late reply from a superseded session cannot overwrite a newer id.
- `Protocol` passes an `isRequestActive` callback down into `transport.send`, letting the retry path drop work for a request that has since been cancelled.

## Why this is worth recording

The evidence model treats a `read` claim as pinned to a commit, and here the commit alone is not enough — the behaviour lives in a patch against a dependency, and neither the client source nor the published SDK describes what runs.

It also cuts against the assumption that clients on the official SDK behave alike. opencode, Cline and fast-agent are all on the TypeScript SDK, and a finding that holds for one because the SDK does it may not hold for another that patched it. Any claim about SDK-derived behaviour has to check for a `patches/` entry first.

The upstream gap is real: session expiry is a normal event for a long-lived HTTP client, and a client that cannot recover from one has to be restarted. Whether stock SDK behaviour should change is a question for the SDK repo, not this registry, but opencode having to carry a patch is evidence that it should be asked.

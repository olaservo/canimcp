---
id: opencode-declares-only-roots
title: opencode declares roots and nothing else, with sampling, elicitation and tasks commented out
kind: idiosyncrasy
summary: The client capability object lists sampling, elicitation and tasks, each commented out above a link to the issue tracking it. Only roots is live, so a server that offers any of the other three never gets asked.
capabilities:
  - sampling
  - elicitation
  - tasks
  - roots
clients:
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/anomalyco/opencode
    title: packages/opencode/src/mcp/index.ts, CLIENT_OPTIONS
    commit: 7cde8329
    path: packages/opencode/src/mcp/index.ts:39-50
    date: 2026-08-24
  - url: https://github.com/anomalyco/opencode
    title: packages/opencode/src/mcp/index.ts, createClient
    commit: 7cde8329
    path: packages/opencode/src/mcp/index.ts:76-80
    date: 2026-08-24
status: current
lastVerified: 2026-08-24
related:
  - utilized-capability-declarations
---

# opencode declares roots and nothing else, with sampling, elicitation and tasks commented out

opencode's declaration is one live key surrounded by three dead ones, each commented out above a link to its issue:

```ts
capabilities: {
  // https://github.com/anomalyco/opencode/issues/11948
  // sampling: {},
  // https://github.com/anomalyco/opencode/issues/23066
  // elicitation: {},
  // https://github.com/anomalyco/opencode/issues/2308
  roots: {},
  // https://github.com/anomalyco/opencode/issues/28567
  // tasks: {},
}
```

The commented keys are not stubs waiting on a handler. No `ElicitRequestSchema` or `CreateMessageRequestSchema` handler exists anywhere in the client, so uncommenting a line would declare a capability opencode cannot answer. The comments mark intent, not readiness.

This makes opencode the cleanest case yet of a client whose declaration is accurate. goose declares less than it implements and Codex declares only elicitation while implementing much more. opencode declares exactly one thing and implements exactly that one thing.

## What roots amounts to

The handler returns a single root and never changes it:

```ts
client.setRequestHandler(ListRootsRequestSchema, () =>
  Promise.resolve({ roots: [{ uri: pathToFileURL(directory).href }] }),
)
```

`directory` is captured when the client is created. The capability is declared as a bare `roots: {}` with no `listChanged`, and nothing in the client sends `notifications/roots/list_changed`. A server can ask for the roots and will get the same answer every time.

That is the opposite failure mode to goose, which sends the notification without declaring the capability and keeps sending it at a revision where the notification no longer exists.

## Why it matters for the matrix

A declared-tier reading of opencode gives roots and nothing else, and for once that is very nearly the whole truth — the gap being that the client does consume tools, resources, prompts, logging and instructions, none of which are client capabilities to declare. The four client-side capabilities are where a declaration can be wrong, and opencode's is right.

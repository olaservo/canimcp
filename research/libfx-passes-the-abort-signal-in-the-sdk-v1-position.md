---
id: libfx-passes-the-abort-signal-in-the-sdk-v1-position
title: libfx passes the turn's abort signal where only the v1 TypeScript SDK reads it
kind: gap
summary: libfx calls `client.callTool(params, undefined, { signal })`, the TypeScript SDK v1 signature. `@modelcontextprotocol/client` 2.4.0 declares `callTool(params, options)`, so a v2 client does not receive the signal. Read from source and both packages. No cancellation was run.
capabilities:
  - tools
clients:
  - libfx
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/vercel-labs/fx
    title: sdk/mcp.js, the execute function of an adapted tool
    commit: c3dc80c4
    path: sdk/mcp.js:78-83
    date: 2026-11-16
  - url: https://github.com/vercel-labs/fx
    title: sdk/types/mcp.d.ts, McpClient.callTool
    commit: c3dc80c4
    path: sdk/types/mcp.d.ts:4-13
    date: 2026-11-16
  - url: https://github.com/vercel-labs/fx
    title: sdk/tests/test-mcp-adapter.mjs, the test client's callTool
    commit: c3dc80c4
    path: sdk/tests/test-mcp-adapter.mjs:52-57
    date: 2026-11-16
  - url: https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.2
    title: "@modelcontextprotocol/sdk 1.32.2, Client.callTool"
    path: dist/esm/client/index.js:479
    date: 2026-11-16
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0
    title: "@modelcontextprotocol/client 2.4.0, Client.callTool"
    path: dist/public-CvV4ZHkX.mjs:3866
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - libfx-has-no-mcp-client-of-its-own
---

# libfx passes the turn's abort signal where only the v1 TypeScript SDK reads it

Each tool that `createMcpAdapter` returns runs this call at `c3dc80c4`:

```js
const send = () => client.callTool({ name: tool.name, arguments: input, ...(correlationId === undefined ? {} : { _meta: { "libfx/correlationId": correlationId } }) }, undefined, { signal });
```

The second argument is `undefined` and the third carries the turn's `AbortSignal`. `sdk/types/mcp.d.ts` declares the same shape, `callTool(params, resultSchema?, options?: { signal?: AbortSignal })`, and says the interface follows "the MCP TypeScript SDK v1 signatures". The repo's adapter test asserts both positions: `resultSchema` is `undefined` and `options.signal` is an `AbortSignal`.

The two published TypeScript clients differ here:

| Package | `callTool` | Where libfx's `{ signal }` lands |
|---|---|---|
| `@modelcontextprotocol/sdk` 1.32.2 | `callTool(params, resultSchema = CallToolResultSchema, options)` | `options` |
| `@modelcontextprotocol/client` 2.4.0 | `callTool(params, options)` | A third argument the method does not declare |

With the v2 client, `options` is `undefined`. The function body in 2.4.0 takes everything from `options`, `options?.signal` and `options?.timeout` included, and does not read a third argument. So the signal does not reach the request, and aborting a libfx turn would not make that client send `notifications/cancelled` for a tool call in flight.

This was read, not run. The probe drove libfx with `@modelcontextprotocol/client` 2.4.0 and its tool-result scenarios ran to completion, so listing and calling tools work against v2. `listTools(params)`, `getServerVersion()`, `readResource(params)` and `getPrompt(params)` take the arguments libfx passes in the same positions in both packages. No probe scenario cancels a call.

An application on the v2 client can close the gap by passing an object whose `callTool` forwards the third argument as the second.

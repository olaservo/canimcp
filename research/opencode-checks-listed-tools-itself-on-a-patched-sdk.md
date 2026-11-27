---
id: opencode-checks-listed-tools-itself-on-a-patched-sdk
title: opencode patches SDK 2.4.0 to leave tools/list unchecked and checks each tool itself
kind: idiosyncrasy
summary: opencode applies a bun patch to @modelcontextprotocol/client 2.4.0. The patch stops the SDK validating listed tools, so opencode checks each one and skips only the malformed ones. Session recovery on a 404 is in opencode's own code.
capabilities:
  - tools
  - transports.streamableHttp
clients:
  - opencode
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/anomalyco/opencode
    title: patches/@modelcontextprotocol%2Fclient@2.4.0.patch
    commit: 740bd1d7
    path: patches/@modelcontextprotocol%2Fclient@2.4.0.patch
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: package.json and bun.lock, the patch registration
    commit: 740bd1d7
    path: package.json
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: script/upgrade-mcp-sdk.ts, the list of edits and the PR behind each
    commit: 740bd1d7
    path: script/upgrade-mcp-sdk.ts:edits
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/mcp/client.ts, tools
    commit: 740bd1d7
    path: packages/core/src/mcp/client.ts:connect
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/mcp/client.ts, failure
    commit: 740bd1d7
    path: packages/core/src/mcp/client.ts:connect
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/mcp/connection.ts, recover and recovering
    commit: 740bd1d7
    path: packages/core/src/mcp/connection.ts:make
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - opencode-patches-its-sdk-for-session-recovery
  - opencode-retries-tools-list-without-output-schema
---

# opencode patches SDK 2.4.0 to leave tools/list unchecked and checks each tool itself

opencode pins `@modelcontextprotocol/client`, `core` and `server` at an exact `2.4.0`. `package.json` and `bun.lock` register a patch against the client package only. `script/upgrade-mcp-sdk.ts` rebuilds the patch for each SDK release and names the opencode PR behind each edit.

## What the patch changes

- The `tools/list` result schema becomes `tools: z.array(z.unknown())` in the legacy codec and in both 2026-07-28 result shapes. The SDK returns listed tools without validating them.
- `outputSchema` is accepted when its root is not `type: "object"`.
- The `x-mcp-header` scan tolerates a listed tool that is not an object.
- An input-required request passes its own options to the handler as `mcpReq.origin`. opencode uses this to route an elicitation to the caller that started the request.
- OAuth metadata discovery URLs no longer carry the server URL's query string.
- A login that asks for `offline_access` no longer adds `prompt=consent`.
- `RequestOptions` gains `onRequestId`, and a `timeout` of `Infinity` disables the request timer.
- `events/poll`, `events/stream`, `events/subscribe` and `events/unsubscribe` send `Mcp-Name` from `params.name`.

## Listed tools are checked in opencode

`McpClient.connect` calls `listTools` with `cacheMode: "bypass"` and checks each returned tool. A tool is skipped with a warning when it is not an object, has no non-empty string `name`, or has an `inputSchema` that is not an object or has a `type` other than `"object"`. Fields of the wrong type on a kept tool are dropped. One malformed tool costs that tool, and the rest of the list survives with their `outputSchema` intact.

`callTool` passes its own copy of the tool definition with `outputSchema` removed. The SDK then skips its output validation, so a result that breaks the server's own schema does not fail the call.

## Session recovery moved out of the patch

The 1.29.0 patch recovered an expired session inside the transport. The 2.4.0 patch has no such edit. `failure` in `client.ts` maps an `SdkHttpError` to `SessionExpiredError` when the transport holds a session id and the status is 404, or 400 with the body `Bad Request: Server not initialized`. `McpConnection.recovering` then stops the connection, starts a new one and runs the request once more. Tool calls, prompt gets, resource reads and resource listing go through it. A list-changed refresh that sees the expiry reconnects without a retry.

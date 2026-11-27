---
id: openclaw-recovers-expired-http-sessions-without-patching-the-sdk
title: OpenClaw handles the expired Streamable HTTP session in its own code
kind: nuance
summary: A stateful server signals an expired session with HTTP 404, and the stock SDK surfaces it as a terminal error. opencode now recovers in its own code. OpenClaw detects the same condition in its own lifecycle code, on both surfaces, and refuses to replay the failed call.
capabilities:
  - transports.streamableHttp
clients:
  - openclaw
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-client-lifecycle.ts, isMcpHttpSessionExpired
    commit: 2237f16b
    path: src/agents/mcp-client-lifecycle.ts:isMcpHttpSessionExpired
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/agents/agent-bundle-mcp-runtime.ts, session recycling
    commit: 2237f16b
    path: src/agents/agent-bundle-mcp-runtime.ts:createServerMcpRuntime
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/node-host/mcp.ts, same check on the node host surface
    commit: 2237f16b
    path: src/node-host/mcp.ts:callMcpTool
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-http-transport.ts, SSE POST 404 raised as McpSseSessionExpiredError
    commit: 2237f16b
    path: src/agents/mcp-http-transport.ts:OpenClawSSEClientTransport.fetch
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: pnpm-workspace.yaml, patchedDependencies has no @modelcontextprotocol entry
    commit: 2237f16b
    path: pnpm-workspace.yaml
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - opencode-patches-its-sdk-for-session-recovery
---

# OpenClaw handles the expired Streamable HTTP session in its own code

The detection is a five-part predicate over the SDK's own error type:

```ts
return (
  session.transportType === "streamable-http" &&
  session.transport instanceof OpenClawStreamableHTTPClientTransport &&
  session.transport.sessionId !== undefined &&
  error instanceof SdkHttpError &&
  error.status === 404
);
```

The comment above the call site states the rule the recovery follows: reinitialize a fresh client, and never replay a possibly mutating call. So the session is recycled and the in-flight tool call still fails. The same function is imported and used by the node host at `src/node-host/mcp.ts:566`, so both surfaces behave the same way.

The same function now covers legacy SSE. OpenClaw's SSE transport wrapper turns a 404 on a message POST into its own `McpSseSessionExpiredError`, and the predicate treats that as an expired session too.

What makes this worth recording is the comparison. opencode carried a bun patch against SDK 1.29.0 adding session recovery inside the transport; at `b5e0abd7` it is on `@modelcontextprotocol/client` 2.4.0 and recovers in its own connection code. OpenClaw reaches the same requirement and solves it outside the SDK, without patching: `patches/` holds 16 patches and `patchedDependencies` lists 16 packages, and none of them is an `@modelcontextprotocol` package.

Two independent clients on the same official TypeScript SDK both found stock 404 handling insufficient and each built a workaround. That is better evidence for the upstream report than opencode alone, and it also shows the workaround does not require a patch — which is the argument for the SDK carrying it.

The two workarounds are not equivalent. opencode reconnects and runs the request once more, so a call can survive. OpenClaw's recycles the session and lets the call fail, deliberately, because it will not replay a request that may have mutated state. A server author cannot assume either behaviour.

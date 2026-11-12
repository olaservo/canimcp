---
id: openclaw-recovers-expired-http-sessions-without-patching-the-sdk
title: OpenClaw handles the expired Streamable HTTP session in its own code
kind: nuance
summary: A stateful server signals an expired session with HTTP 404, and the stock SDK surfaces it as a terminal error. opencode patches the SDK to recover. OpenClaw detects the same condition in its own lifecycle code, on both surfaces, and refuses to replay the failed call.
capabilities:
  - transports.streamableHttp
clients:
  - openclaw
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-client-lifecycle.ts, isStatefulMcpHttpSessionExpired
    commit: a2d54319
    path: src/agents/mcp-client-lifecycle.ts:19-30
    date: 2026-08-26
  - url: https://github.com/openclaw/openclaw
    title: src/agents/agent-bundle-mcp-runtime.ts, session recycling
    commit: a2d54319
    path: src/agents/agent-bundle-mcp-runtime.ts:489-516
    date: 2026-08-26
  - url: https://github.com/openclaw/openclaw
    title: src/node-host/mcp.ts, same check on the node host surface
    commit: a2d54319
    path: src/node-host/mcp.ts:592
    date: 2026-08-26
status: current
lastVerified: 2026-08-26
related:
  - opencode-patches-its-sdk-for-session-recovery
---

# OpenClaw handles the expired Streamable HTTP session in its own code

The detection is a four-part predicate over the SDK's own error type:

```ts
return (
  session.transportType === "streamable-http" &&
  session.transport instanceof OpenClawStreamableHTTPClientTransport &&
  session.transport.sessionId !== undefined &&
  error instanceof StreamableHTTPError &&
  error.code === 404
);
```

The comment above the call site states the rule the recovery follows: reinitialize a fresh client, and never replay a possibly mutating call. So the session is recycled and the in-flight tool call still fails. The same function is imported and used by the node host at `src/node-host/mcp.ts:592`, so both surfaces behave the same way.

What makes this worth recording is the comparison. opencode carries a bun patch against SDK 1.29.0 adding session recovery inside the transport. OpenClaw reaches the same requirement and solves it outside the SDK, without patching: `patches/` is empty and there is no `patchedDependencies` block.

Two independent clients on the same official TypeScript SDK both found stock 404 handling insufficient and each built a workaround. That is better evidence for the upstream report than opencode alone, and it also shows the workaround does not require a patch — which is the argument for the SDK carrying it.

The two workarounds are not equivalent. opencode's patch recovers inside the transport, so a call can survive. OpenClaw's recycles the session and lets the call fail, deliberately, because it will not replay a request that may have mutated state. A server author cannot assume either behaviour.

---
id: openclaw-declares-nothing-unless-mcp-apps-is-on
title: A default OpenClaw install declares no client capabilities at all
kind: idiosyncrasy
summary: OpenClaw's client capabilities are elicitation and an MCP Apps UI extension, both built behind `mcp.apps.enabled`, which defaults to off. A default install sends an empty capability object. The node host declares elicitation under the same flag and nothing without it.
capabilities:
  - roots
  - sampling
  - elicitation
  - extensions
clients:
  - openclaw
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-metadata.ts, buildMcpClientCapabilities
    commit: 3e7c305f
    path: src/agents/mcp-metadata.ts:MCP_APPS_CLIENT_EXTENSION,MCP_APP_RESOURCE_MIME_TYPE,buildMcpClientCapabilities
    date: 2026-11-20
  - url: https://github.com/openclaw/openclaw
    title: src/agents/agent-bundle-mcp-runtime.ts, mcpAppsEnabled
    commit: 3e7c305f
    path: src/agents/agent-bundle-mcp-runtime.ts:createServerMcpRuntime
    date: 2026-11-20
  - url: https://github.com/openclaw/openclaw
    title: src/agents/agent-bundle-mcp-runtime.ts, bundle client construction
    commit: 3e7c305f
    path: src/agents/agent-bundle-mcp-runtime.ts:inFlight
    date: 2026-11-20
  - url: https://github.com/openclaw/openclaw
    title: src/node-host/mcp.ts, node host client construction
    commit: c44c610d
    path: src/node-host/mcp.ts:connectionAdmission
    date: 2026-11-27
  - url: https://github.com/openclaw/openclaw
    title: src/node-host/runtime.ts, elicitationClient passed only when mcp.apps.enabled
    commit: 3e7c305f
    path: src/node-host/runtime.ts:start
    date: 2026-11-20
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-client-elicitation.runtime.ts, bindMcpClientElicitation
    commit: 3e7c305f
    path: src/agents/mcp-client-elicitation.runtime.ts:bindMcpClientElicitation
    date: 2026-11-20
  - url: https://github.com/openclaw/openclaw
    title: src/agents/native-mcp-runtime-client.ts, roots, elicitation and sampling handlers for a borrowed capability context
    commit: 3e7c305f
    path: src/agents/native-mcp-runtime-client.ts:createNativeMcpClientBridge
    date: 2026-11-20
status: current
lastVerified: 2026-11-20
related:
  - cline-declares-no-client-capabilities
  - opencode-declares-only-roots
  - utilized-capability-declarations
---

# A default OpenClaw install declares no client capabilities at all

The whole capability object is one ternary:

```ts
export function buildMcpClientCapabilities(mcpAppsEnabled: boolean): ClientCapabilities {
  return mcpAppsEnabled
    ? {
        elicitation: { form: {}, url: {} },
        extensions: {
          "openai/elicitation": { form: {} },
          [MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] },
        },
      }
    : {};
}
```

`MCP_APPS_CLIENT_EXTENSION` is `io.modelcontextprotocol/ui` and the mime type is `text/html;profile=mcp-app` (`mcp-metadata.ts:8-9`). The flag behind it is `mcp.apps.enabled === true`, read once per runtime at `agent-bundle-mcp-runtime.ts:90`, so a server sees the extension only when an operator has turned MCP Apps on in config. Since the August read the same flag also turns on elicitation: form and URL modes, plus an `openai/elicitation` extension.

The node host is a second MCP client surface and does not use this function. Its `new Client(...)` passes `jsonSchemaValidator` and a `listChanged` hook, and a `capabilities` key only when `mcp.apps.enabled` is true. With the flag on it declares `elicitation: { form: {}, url: {} }` and forwards each request to the Gateway. With the flag off it declares nothing.

Neither surface implements roots or sampling for a configured server. Elicitation is implemented on both, behind the flag: `bindMcpClientElicitation` registers `elicitation/create` and `openai/elicitation/create` handlers, and it is called only when `mcp.apps.enabled` is true. `native-mcp-runtime-client.ts` also registers `roots/list`, `elicitation/create` and `sampling/createMessage` handlers for a capability context supplied by a caller, added on 2026-10-19 as preparation. At `3e7c305f` nothing outside tests and one perf script acquires that view, so no server sees those declarations. As with Cline, the empty declaration is accurate rather than an oversight.

This is the second client entry where the recorded default differs from what the client can be configured to send, and the reason to ask what a default install declares rather than what the code can produce.

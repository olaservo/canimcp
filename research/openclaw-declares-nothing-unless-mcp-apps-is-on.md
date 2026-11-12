---
id: openclaw-declares-nothing-unless-mcp-apps-is-on
title: A default OpenClaw install declares no client capabilities at all
kind: idiosyncrasy
summary: OpenClaw's only client capability is an MCP Apps UI extension, and it is built behind `mcp.apps.enabled`, which defaults to off. A default install sends an empty capability object. The node host surface passes no capabilities under any setting.
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
    title: src/agents/agent-bundle-mcp-runtime.ts, buildMcpClientCapabilities
    commit: a2d54319
    path: src/agents/agent-bundle-mcp-runtime.ts:219-231
    date: 2026-08-26
  - url: https://github.com/openclaw/openclaw
    title: src/agents/agent-bundle-mcp-runtime.ts, mcpAppsEnabled
    commit: a2d54319
    path: src/agents/agent-bundle-mcp-runtime.ts:294
    date: 2026-08-26
  - url: https://github.com/openclaw/openclaw
    title: src/node-host/mcp.ts, node host client construction
    commit: a2d54319
    path: src/node-host/mcp.ts:276-288
    date: 2026-08-26
status: current
lastVerified: 2026-08-26
related:
  - cline-declares-no-client-capabilities
  - opencode-declares-only-roots
  - utilized-capability-declarations
---

# A default OpenClaw install declares no client capabilities at all

The whole capability object is one ternary:

```ts
function buildMcpClientCapabilities(mcpAppsEnabled: boolean): ClientCapabilities {
  return mcpAppsEnabled
    ? {
        extensions: {
          [MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] },
        },
      }
    : {};
}
```

`MCP_APPS_CLIENT_EXTENSION` is `io.modelcontextprotocol/ui` and the mime type is `text/html;profile=mcp-app` (`agent-bundle-mcp-runtime.ts:93-94`). The flag behind it is `mcp.apps.enabled === true`, read once per runtime at `agent-bundle-mcp-runtime.ts:294`, so a server sees the extension only when an operator has turned MCP Apps on in config.

The node host is a second MCP client surface and does not use this function. Its `new Client(...)` passes `jsonSchemaValidator` and a `listChanged` hook and no `capabilities` key at all, so it declares nothing regardless of config.

Neither surface implements roots, sampling or elicitation. There is no `setRequestHandler` call against a client anywhere in `src/agents` or `src/node-host`, so no `ListRootsRequestSchema`, `CreateMessageRequestSchema` or `ElicitRequestSchema` handler exists. As with Cline, the empty declaration is accurate rather than an oversight.

This is the second client entry where the recorded default differs from what the client can be configured to send, and the reason to ask what a default install declares rather than what the code can produce.

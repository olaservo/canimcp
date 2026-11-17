---
id: agent-framework-declares-sampling-it-declines-by-default
title: Agent Framework's Python binding declares sampling on every connection and refuses it by default
kind: nuance
summary: MCPTool always hands the SDK a sampling callback, so every connection declares sampling. With no chat client the callback answers -32603. With a chat client and no approval callback it answers -32600. The probe saw sampling declared at 1.25.0.
capabilities:
  - sampling
  - sampling.tools
  - sampling.context
clients:
  - agent-framework
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_mcp.py, the Client construction
    commit: "10801303"
    path: python/packages/core/agent_framework/_mcp.py:2653-2667
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_mcp.py, sampling_callback and the approval gate
    commit: "10801303"
    path: python/packages/core/agent_framework/_mcp.py:2818-2849,2916-2953
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_mcp.py, default caps and the deprecation message
    commit: "10801303"
    path: python/packages/core/agent_framework/_mcp.py:817-830
    date: 2026-11-16
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.3.0 wheel, mcp/client/session.py, _build_capabilities
    path: mcp/client/session.py:629-633
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - hermes-declares-url-elicitation-it-declines
  - fast-agent-declares-capabilities-per-server
  - utilized-capability-declarations
  - agent-framework-python-and-dotnet-are-two-mcp-clients
---

# Agent Framework's Python binding declares sampling on every connection and refuses it by default

mcp 2.3.0 declares `sampling` whenever the callback passed to `Client` is not the SDK's own default. `MCPTool` passes `sampling_callback=self.sampling_callback` on every construction, with no condition. `sampling_capabilities` is set to `SamplingCapability(tools=SamplingToolsCapability())` only when the tool was given a chat client.

| Construction | Declared | Answer to `sampling/createMessage` |
|---|---|---|
| default, no `client` | `sampling: {}` | `-32603`, "No chat client available. Please set a chat client." |
| `client` set, no `sampling_approval_callback` | `sampling: {tools: {}}` | `-32600`, "Sampling request denied. MCP sampling is disabled by default for untrusted servers" |
| `client` and an approving callback | `sampling: {tools: {}}` | the chat client's reply |

The probe's wire capture at 1.25.0 shows `clientCapabilities: {"sampling":{}}` in the `_meta` of every request, from an agent built with no sampling options. The source at `10801303`, version 1.26.0, reads the same.

The refusal is deliberate. The comment above the defaults says MCP servers are untrusted third parties, and the callback docstring calls forwarding server-controlled prompts to the chat client a confused-deputy risk. The approval gate denies when no callback is configured. An approved request has `maxTokens` capped at 4096, and a session accepts 25 requests before answering `-32600` "Sampling rate limit exceeded". The counter resets on reconnect.

A server that reads the declaration and sends a sampling request to a default construction gets an error each time. The declaration cannot be turned off through `MCPTool`. A caller who needs a connection without it has to build the `Client` and pass it as `mcp_client`. Sampling options set on the tool are then ignored, with a logged warning.

When a request is served, `includeContext` and `modelPreferences` are not read. `systemPrompt`, `temperature`, `stopSequences`, `tools` and `toolChoice.mode` are passed to the chat client. The tools are schema-only functions, and a tool call from the model comes back as `CreateMessageResultWithTools` with `stopReason: "toolUse"`.

The framework marks the callback deprecated, with a message that MCP sampling is deprecated as of `2026-07-28` and that servers should call model provider APIs directly.

The .NET clients the framework builds register no `SamplingHandler`, and C# SDK 2.2.0 declares sampling only when one is set.

## Not checked

The probe sent no sampling request, so the error replies are read from source and not observed. How mcp 2.3.0 routes a `2026-07-28` input request for sampling to the same callback was not read.

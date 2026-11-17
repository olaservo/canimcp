---
id: agent-framework-python-and-dotnet-are-two-mcp-clients
title: Agent Framework's Python and .NET bindings are two different MCP clients
kind: nuance
summary: The Python binding wraps the Python SDK in its own MCPTool class and declares sampling. The .NET binding has no client class. The application builds an McpClient on C# SDK 2.2.0 and the framework wraps its tools. Tasks, skills and the wire name differ.
capabilities:
  - transports.stdio
  - transports.sse
  - sampling
  - roots.listChanged
  - tasks
clients:
  - agent-framework
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_mcp.py, MCPTool._connect_on_owner
    commit: "10801303"
    path: python/packages/core/agent_framework/_mcp.py:2653-2667
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/pyproject.toml and python/uv.lock, the Python SDK requirement and its resolution
    commit: "10801303"
    path: python/packages/core/pyproject.toml:35-38
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: dotnet/Directory.Packages.props, the C# SDK pins
    commit: "10801303"
    path: dotnet/Directory.Packages.props:5-6,128-129
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: DefaultMcpToolHandler.CreateClientAsync, one of two McpClient constructions in dotnet/src
    commit: "10801303"
    path: dotnet/src/Microsoft.Agents.AI.Workflows.Declarative.Mcp/DefaultMcpToolHandler.cs:209-245
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: FoundryToolboxService.OpenToolboxAsync, the other McpClient construction
    commit: "10801303"
    path: dotnet/src/Microsoft.Agents.AI.Foundry.Hosting/FoundryToolboxService.cs:279-295,339-363
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: McpClientTaskExtensions.ListAgentToolsWithTasksAsync
    commit: "10801303"
    path: dotnet/src/Microsoft.Agents.AI.Mcp/McpClientTaskExtensions.cs:39-42,130-136
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: agent_framework_claude/_agent.py, mcp_servers passed to the Claude Agent SDK
    commit: "10801303"
    path: python/packages/claude/agent_framework_claude/_agent.py:613-617
    date: 2026-11-16
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.3.0 wheel, mcp/client/session.py, DEFAULT_CLIENT_INFO and _build_capabilities
    path: mcp/client/session.py:67,614-648
    date: 2026-11-16
  - url: https://github.com/modelcontextprotocol/csharp-sdk
    title: tag v2.2.0, McpClientImpl, handler-driven capabilities, protocol default and client info
    commit: 6fa38259
    path: src/ModelContextProtocol.Core/Client/McpClientImpl.cs:15-19,94-161,294-303,424-428
    date: 2026-11-16
  - url: https://github.com/modelcontextprotocol/csharp-sdk
    title: tag v2.2.0, StreamableHttpClientSessionTransport, the 404 path
    commit: 6fa38259
    path: src/ModelContextProtocol.Core/Client/StreamableHttpClientSessionTransport.cs:173-180,677-693
    date: 2026-11-16
  - url: https://github.com/modelcontextprotocol/csharp-sdk
    title: tag v2.2.0, RootsCapability.ListChanged
    commit: 6fa38259
    path: src/ModelContextProtocol.Core/Protocol/RootsCapability.cs:35-36
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - agent-framework-declares-sampling-it-declines-by-default
  - agent-framework-bindings-read-skills-over-mcp-two-ways
  - agent-framework-offers-mcp-prompts-to-the-model-as-tools
  - fast-agent-never-sends-roots-list-changed
  - openclaw-recovers-expired-http-sessions-without-patching-the-sdk
---

# Agent Framework's Python and .NET bindings are two different MCP clients

One repository holds both bindings, read at `10801303`. The registry entry's rows describe the Python binding, which is the one the probe ran.

The Python binding has a client class. `MCPTool` in `python/packages/core/agent_framework/_mcp.py` constructs the Python SDK's `Client`, owns the connection, lists tools and prompts, and reconnects. `MCPStdioTool` and `MCPStreamableHTTPTool` are its transports. A search of `python/packages`, tests and samples excluded, for a hand-written `initialize`, `"jsonrpc"` or `protocolVersion` finds nothing outside that file, so it is the only MCP client in the Python tree. `FoundryToolbox` and the declarative workflow handler are a subclass and a caller of it. Two other routes involve no Agent Framework MCP client. `get_mcp_tool` on the OpenAI, Anthropic, Foundry and Gemini chat clients declares a provider-hosted MCP tool. The `agent-framework-claude` and `agent-framework-github-copilot` packages pass an `mcp_servers` option through to the Claude Agent SDK and the GitHub Copilot SDK, which connect to those servers themselves. Neither runtime was read.

The .NET binding has no client class. The application calls `McpClient.CreateAsync` from the C# SDK and passes the resulting `McpClientTool` objects to an agent as `AIFunction` tools. Framework code under `dotnet/src` references the SDK from three projects: `Microsoft.Agents.AI.Mcp` (task-aware tool wrappers and a skills source, both taking the application's client), `Microsoft.Agents.AI.Workflows.Declarative.Mcp` and `Microsoft.Agents.AI.Foundry.Hosting`. The last two build an `McpClient` themselves, per invocation and per response.

| | Python | .NET |
|---|---|---|
| SDK | `mcp>=2.2.0,<3`, resolved 2.3.0 in `uv.lock` | `ModelContextProtocol` 2.2.0, pinned centrally, no lockfile |
| Who builds the client | the framework | the application, except the declarative handler and the Foundry toolbox |
| `clientInfo.name` | `mcp`, the SDK placeholder | the entry assembly's name, or the agent name from the Foundry toolbox |
| Declared by a default construction | `sampling` | nothing, from the two clients the framework builds |
| Transports the framework builds | stdio, Streamable HTTP | Streamable HTTP only |
| Tasks | none, and task-required tools are skipped | opt-in wrapper over `ModelContextProtocol.Extensions.Tasks` 2.2.0 |
| Prompts | listed and offered to the model as tools | not used |
| Expired HTTP session | reconnect and retry the tool call once | no recovery code |

Both SDKs lead with `2026-07-28` and fall back to the `initialize` handshake, and neither binding overrides that. Tool-result handling also differs between the bindings. That read lives in `olaservo/structured-content-research`, in `notes/agent-framework-tool-result-handling.md`.

## Three C# SDK answers at 2.2.0

This is the first registry read that touches the C# SDK. The clone at `_clients/sdk/csharp-sdk` sits on the default branch at `64cfd66`, past `v2.3.0`. `McpClientImpl.cs`, `McpClientOptions.cs` and `StreamableHttpClientSessionTransport.cs` changed after `v2.2.0`, so the client files were read from the `v2.2.0` tag (`6fa38259`) on GitHub. `RootsCapability.cs`, `AssemblyNameHelper.cs` and `McpProtocolVersions.cs` are unchanged between the tag and the clone.

How `roots.listChanged` gets declared. The SDK builds its capability object from the handlers the application registers. A `RootsHandler` makes it run `_options.Capabilities.Roots ??= new()`, which is an empty `roots` object. `RootsCapability.ListChanged` is a nullable bool with no default, and the SDK never sets it. The flag goes on the wire only when the application writes it into `McpClientOptions.Capabilities` itself. The Python SDK does the opposite and sets `listChanged: true` for any roots callback. No file in `dotnet/src` registers a `RootsHandler` or sets the flag.

What happens on an expired HTTP session. When a request that carried an `Mcp-Session-Id` gets HTTP 404, the transport calls `SetSessionExpired`. That stores a `ClientTransportClosedException` whose message says to create a new client session or call `ResumeSessionAsync`, cancels the connection token and marks the transport disconnected. The SDK does not re-initialize. Agent Framework's .NET code has no handling for that exception. The declarative handler and the Foundry toolbox are not exposed to it for long, because each of their clients lives for one invocation or one response.

Who picks the protocol revision. The SDK does. A null `McpClientOptions.ProtocolVersion` makes `ConnectAsync` send `server/discover` at `2026-07-28`, and on failure fall back to `initialize` at the newest handshake version the server listed, or `2025-11-25`. The one assignment in `dotnet/src` is in `DefaultMcpToolHandler`, which passes its own `ProtocolVersion` property, default null.

## Not checked

The .NET binding was not probed. `ModelContextProtocol.Extensions.Tasks` was not read at 2.2.0, so what `CallToolAsTaskAsync` declares on the wire is not recorded. The C# SDK's `ListToolsAsync` pagination and its OAuth support were not read.

---
id: vscode-has-one-mcp-client-and-agent-sessions-bring-their-own
title: VS Code has one hand-written MCP client, and agent-host sessions use the embedded agent's client instead
kind: nuance
summary: At 8e900494 VS Code's hand-written MCP client serves Copilot Chat, which is vendored at extensions/copilot with no client of its own. Copilot CLI sessions use VS Code's gateway. Agent-host sessions hand server configs to the Claude, Codex or Copilot runtime's own client.
capabilities:
  - transports.stdio
  - transports.streamableHttp
clients:
  - vscode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/microsoft/vscode
    title: mcpServerRequestHandler.ts, the initialize request
    commit: e8b6d8b5
    path: src/vs/workbench/contrib/mcp/common/mcpServerRequestHandler.ts:McpServerRequestHandler.create
    date: 2026-11-27
  - url: https://github.com/microsoft/vscode
    title: Copilot Chat's GitHub MCP server definition provider
    commit: e8b6d8b5
    path: extensions/copilot/src/extension/githubMcp/vscode-node/githubMcp.contribution.ts:GitHubMcpContrib._registerGitHubMcpDefinitionProvider
    date: 2026-11-27
  - url: https://github.com/microsoft/vscode
    title: Copilot CLI session MCP config through the gateway
    commit: e8b6d8b5
    path: extensions/copilot/src/extension/chatSessions/copilotcli/node/mcpHandler.ts:CopilotCLIMCPHandler
    date: 2026-11-27
  - url: https://github.com/microsoft/vscode
    title: Agent host Claude session, external MCP servers passed to the SDK
    commit: e8b6d8b5
    path: src/vs/platform/agentHost/node/claude/claudeAgentSession.ts:ClaudeAgentSession._buildStartupToolWiring,ClaudeAgentSession
    date: 2026-11-27
  - url: https://github.com/microsoft/vscode
    title: Agent host Codex session, mcp_servers in thread/start config
    commit: e8b6d8b5
    path: src/vs/platform/agentHost/node/codex/codexAgent.ts
    date: 2026-11-27
status: current
lastVerified: 2026-11-20
related:
  - vscode-omits-the-protocol-version-header
---

# VS Code has one hand-written MCP client, and agent-host sessions use the embedded agent's client instead

VS Code uses no MCP SDK for its client. `McpServerRequestHandler` in `src/vs/workbench/contrib/mcp/common/` sends `initialize` over the generic `JsonRpcProtocol`, with types from a generated copy of the spec schema in `src/vs/platform/mcp/common/modelContextProtocol.ts`. Transports live in the extension host: `extHostMcpNode.ts` for stdio and `extHostMcp.ts` for Streamable HTTP and legacy SSE. The wire name is `productService.nameLong`, so it is `Visual Studio Code`, `Visual Studio Code - Insiders` or `Code - OSS` depending on the build.

`@modelcontextprotocol/sdk` appears twice in the tree and neither copy is on the client path. The root devDependency (1.29.0) serves the agent host's Claude integration. Copilot Chat's devDependency (1.30.0) serves the in-process MCP server it runs for the Copilot CLI.

Copilot Chat is vendored in this repo at `extensions/copilot` (0.76.0 at this commit). It has no MCP client. It registers a definition provider for the GitHub MCP server through `lm.registerMcpServerDefinitionProvider`, and VS Code's client connects to it. It reads MCP tools through the language model tool API and renders their results.

Copilot CLI sessions started from Copilot Chat get their server list from `startMcpGateway` when `chat.cli.mcp.enabled` is on, which is the default. The gateway serves each VS Code server at a local HTTP address. The CLI's client talks to the gateway, and VS Code's client talks to the real server, so the server sees VS Code's `initialize`. With the setting off, the CLI gets only the built-in GitHub server config and connects to it with its own client.

The agent host (`src/vs/platform/agentHost/`) is a separate process that runs Claude Agent SDK, Codex app-server and Copilot SDK sessions. For those sessions it builds an `mcpServers` or `mcp_servers` config from discovered definitions and plugins and passes it to the runtime. The runtime's own MCP client connects, so a server sees that agent's `clientInfo` and capabilities, not VS Code's. This read did not check when the agent host is on by default or read those runtimes' clients. The VS Code entry's rows describe the workbench client only.

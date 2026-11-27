---
id: n8n-sends-the-node-type-as-client-name
title: n8n sends the workflow node's type as clientInfo.name, and has a second MCP client with its own name
kind: idiosyncrasy
summary: At 84decbe0 n8n's MCP nodes send the node type as clientInfo.name and the node's typeVersion as version, so one instance sends several names, one per registry server. A second client in @n8n/agents sends `@n8n/agents` 0.1.0. The seed name `n8n-mcp-client` is not in the source.
capabilities:
  - transports.stdio
  - transports.sse
  - tools
clients:
  - n8n
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/n8n-io/n8n
    title: shared/utils.ts, connectMcpClientForCredential passes node.type and node.typeVersion
    commit: 467bcd35
    path: packages/@n8n/nodes-langchain/nodes/mcp/shared/utils.ts:connectMcpClientForCredential
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: shared/utils.ts, the Client constructor
    commit: 467bcd35
    path: packages/@n8n/nodes-langchain/nodes/mcp/shared/utils.ts:connectMcpClient
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: McpRegistryClientTool, registry nodes saved as @n8n/mcp-registry.<slug>
    commit: 467bcd35
    path: packages/@n8n/nodes-langchain/nodes/mcp/McpRegistryClientTool/McpRegistryClientTool.node.ts:McpRegistryClientTool
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: microsoft-utils.ts, the Agent 365 trigger connects with its own name
    commit: 467bcd35
    path: packages/@n8n/nodes-langchain/nodes/vendors/Microsoft/microsoft-utils.ts:getMicrosoftMcpTools
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: "@n8n/agents McpConnection"
    commit: 467bcd35
    path: packages/@n8n/agents/src/runtime/mcp/mcp-connection.ts:McpConnection,McpConnection.listTools
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: Agents module builds an @n8n/agents McpClient per JSON-config server
    commit: 467bcd35
    path: packages/cli/src/modules/agents/json-config/mcp-client-factory.ts:buildMcpClientForServer
    date: 2026-11-27
  - url: https://github.com/n8n-io/n8n
    title: Instance AI reads name=url pairs from N8N_INSTANCE_AI_MCP_SERVERS
    commit: 467bcd35
    path: packages/cli/src/modules/instance-ai/turn-setup/assistant-agent.factory.ts:AssistantAgentFactory
    date: 2026-11-27
status: current
lastVerified: 2026-11-20
---

# n8n sends the workflow node's type as clientInfo.name, and has a second MCP client with its own name

The workflow MCP nodes share one connect function, `connectMcpClientForCredential`. It builds the SDK `Client` with `name: node.type` and `version: node.typeVersion.toString()`. What a server sees therefore depends on which node connected:

- MCP Client Tool (the AI Agent toolkit): `@n8n/n8n-nodes-langchain.mcpClientTool`, version `1`, `1.1`, `1.2`, `1.3` or `1.4`.
- MCP Client (standalone node): `@n8n/n8n-nodes-langchain.mcpClient`, version `1` or `1.1`.
- MCP registry nodes: `@n8n/mcp-registry.<slug>`, one name per registry server (for example `@n8n/mcp-registry.github` in the tests), version `1` or `1.1`.
- The Microsoft Agent 365 trigger: `Microsoft-Agent-365`, version `1`.

The version is the node's type version, not the n8n release. A telemetry feed that joins on name sees an open set of `@n8n/mcp-registry.` names. The registry entry lists the fixed names only.

A second MCP client lives in `@n8n/agents`, the code-first agent runtime. The Agents module builds one per JSON-config server, and Instance AI builds them from `N8N_INSTANCE_AI_MCP_SERVERS` and the MCP registry. It sends `@n8n/agents` with version `0.1.0`, on the same SDK 1.32.0, also with `capabilities: {}`. It differs from the node path in three ways: it reads only the first `tools/list` page, it falls back from Streamable HTTP to SSE on a 404 or 405 when no transport is configured, and it has a stdio path for a config with a `command`. No n8n surface traced at this commit supplies a command: the Agent JSON schema and the Instance AI variable carry URLs.

The Apify seed list has an entry named `n8n-mcp-client` with stdio support. That string does not appear in `packages/` at this commit, and the n8n nodes have no stdio transport. It may name a community node or an older release. I did not trace which.

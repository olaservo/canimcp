---
id: agent-framework-bindings-read-skills-over-mcp-two-ways
title: Agent Framework's two bindings load skills from an MCP server by different routes
kind: idiosyncrasy
summary: Python reads the skill://index.json resource and never calls skills/list. .NET requires the server to declare io.modelcontextprotocol/skills and sends skills/list and skills/get with its own result types. A server offering only one route yields no skills on the other binding.
capabilities:
  - resources
clients:
  - agent-framework
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_skills.py, MCPSkillsSource
    commit: "10801303"
    path: python/packages/core/agent_framework/_skills.py
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_skills.py, _try_read_index
    commit: "10801303"
    path: python/packages/core/agent_framework/_skills.py
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: AgentMcpSkillsSource.GetSkillsAsync, the extension gate
    commit: "10801303"
    path: dotnet/src/Microsoft.Agents.AI.Mcp/Skills/AgentMcpSkillsSource.cs
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: McpSkillsCatalog, skills/get and skills/list through SendRequestAsync
    commit: "10801303"
    path: dotnet/src/Microsoft.Agents.AI.Mcp/Skills/McpSkillsCatalog.cs
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: AgentMcpSkill, resources/read for skill files
    commit: "10801303"
    path: dotnet/src/Microsoft.Agents.AI.Mcp/Skills/AgentMcpSkill.cs
    date: 2026-11-16
  - url: https://github.com/microsoft/agent-framework
    title: dotnet/Directory.Packages.props, the two ModelContextProtocol packages referenced
    commit: "10801303"
    path: dotnet/Directory.Packages.props
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - fast-agent-ships-skills-over-mcp-ahead-of-the-sdk
  - agent-framework-python-and-dotnet-are-two-mcp-clients
---

# Agent Framework's two bindings load skills from an MCP server by different routes

Both bindings can load Agent Skills from an MCP server, read at `10801303`. Both are opt-in, and both borrow a client the application built. They do not speak the same protocol to the server.

## Python: a well-known resource

`MCPSkillsSource` is marked experimental. Its docstring says discovery follows "the SEP-2640 recommended approach". It sends `resources/read` for `skill://index.json` and parses the JSON it gets back. Each index entry is handled by its `type`:

- `skill-md`: a skill is created from the entry's name, description and url. The `SKILL.md` body is fetched with `resources/read` when it is needed.
- `archive`: the url is a ZIP resource. It is downloaded and unpacked in memory. A non-null `digest` must be `sha256:` plus 64 hex characters and is checked before extraction. The defaults allow 20 files, 1 MB compressed and 1 MB uncompressed. Scripts in an archive are exposed as read-only resources and never as runnable.
- Any other type, `mcp-resource-template` for one, is skipped.

A missing, empty or unparseable index gives an empty skill list, and any other read error is raised. The source does not call `skills/list` or `skills/get`, does not look at the server's `extensions` capability, and declares nothing to the server.

## .NET: the extension methods

`AgentMcpSkillsSource` checks `ServerCapabilities.Extensions` for the key `io.modelcontextprotocol/skills` and returns an empty list without sending anything when it is absent. When it is present, `McpSkillsCatalog` sends `skills/list` through `McpClient.SendRequestAsync`, following cursors and rejecting a repeated one. It refreshes one skill with `skills/get`. It requires `resultType` to be `complete` on both, requires every `skills/list` page to carry the same `cacheScope`, and uses each response's TTL to decide when to fetch again. Skill files are read with `resources/read`.

The request and result types are the framework's own (`McpSkillsListResult`, `McpSkillsGetResult` and others in the same folder). `dotnet/Directory.Packages.props` references `ModelContextProtocol` and `ModelContextProtocol.Extensions.Tasks` only. The C# SDK tree at tag `v2.2.0` has no skills project. Its default branch at `64cfd66` has a `ModelContextProtocol.Extensions.Skills` project, which the framework does not reference.

## What a server author sees

A server that publishes only `skill://index.json` gives the Python binding its skills and the .NET binding none, because the .NET source stops at the extension check. A server that implements only `skills/list` behind the extension capability gives the .NET binding its skills and the Python binding none, because the index resource is not found and the source returns an empty list. fast-agent, the other registry client with skills over MCP, takes the `skills/list` route.

Neither binding puts the skills extension in its own client capabilities. In both, the client belongs to the application.

## Not checked

Which draft of SEP-2640 each binding tracks was not established. The .NET source names the extension id and not the SEP. No skills server was run against either binding.

---
id: agent-framework-offers-mcp-prompts-to-the-model-as-tools
title: Agent Framework's Python binding offers every MCP prompt to the model as a tool
kind: idiosyncrasy
summary: The Python binding turns each prompts/list entry into a function in the same list as the server's tools. The model calls it, the framework sends prompts/get, and the messages come back as one tool-result string with roles dropped. load_prompts defaults to true.
capabilities:
  - prompts
  - prompts.listChanged
  - tools
clients:
  - agent-framework
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_mcp.py, _load_prompts_snapshot
    commit: f8ade3e9
    path: python/packages/core/agent_framework/_mcp.py
    date: 2026-11-27
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_mcp.py, _parse_prompt_result_from_mcp
    commit: f8ade3e9
    path: python/packages/core/agent_framework/_mcp.py
    date: 2026-11-27
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_mcp.py, functions and _filtered_functions
    commit: f8ade3e9
    path: python/packages/core/agent_framework/_mcp.py
    date: 2026-11-27
  - url: https://github.com/microsoft/agent-framework
    title: python/packages/core/agent_framework/_agents.py, MCP functions added to a run
    commit: f8ade3e9
    path: python/packages/core/agent_framework/_agents.py
    date: 2026-11-27
status: current
lastVerified: 2026-11-16
related:
  - cline-lists-resources-and-prompts-but-never-reads-them
  - opencode-drops-non-text-prompt-content
  - fast-agent-resources-need-a-user-to-ask
  - agent-framework-python-and-dotnet-are-two-mcp-clients
---

# Agent Framework's Python binding offers every MCP prompt to the model as a tool

The MCP specification describes prompts as user-controlled: templates a person picks, which enter the conversation as messages. The Python binding of Agent Framework, read at `10801303`, gives them to the model.

`MCPTool` takes `load_prompts: bool = True`. When the server declares the prompts capability, connect calls `prompts/list`, following cursors up to 100 pages and 1,000 prompts. Each prompt becomes a `FunctionTool` whose name is the normalised prompt name, whose description is the prompt's description, and whose input schema is an object with one string property per prompt argument. It is appended to `self._functions`, the same list that holds the server's tools. `Agent` adds `mcp_server.functions` to each run, so the model sees prompts and tools side by side with nothing marking which is which.

When the model calls one, the framework sends `prompts/get` with the arguments and passes the result through `_parse_prompt_result_from_mcp`. Text content is kept as it is. Image, audio and blob content become JSON objects holding the base64 data. A resource link becomes its JSON dump. One part is returned alone, and several parts are returned as a JSON array of strings. `message.role` is not read. The string goes back to the model as the tool result.

What follows from sharing the function list:

- Prompts and tools share one namespace. A prompt whose local name matches an existing function is skipped.
- `allowed_tools` filters prompts too, since `_filtered_functions` walks the whole list. A prompt not named in a non-empty `allowed_tools` is hidden.
- `approval_mode` applies to prompts, and a callable `approval_mode` receives `mcp.types.Prompt` objects as well as tools.
- With `use_progressive_disclosure` on, prompts are loadable and unloadable like tools.
- `notifications/prompts/list_changed`, or the `2026-07-28` listen event, reloads them. A prompt function is rebuilt when its description or parameters changed.

`load_prompts=False` turns all of this off. The framework's own declarative workflow handler constructs its tool that way.

Nothing in the binding inserts a prompt's messages into the conversation as user or assistant messages, and nothing offers a prompt to a person. `MCPTool.get_prompt` is public, so application code can fetch one and use the string itself.

The .NET binding does not call `prompts/list` or `prompts/get` anywhere under `dotnet/src`.

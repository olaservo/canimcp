---
id: adk-python-loads-resources-by-name
title: ADK Python's resource tool is opt-in and takes resource names, never URIs
kind: idiosyncrasy
summary: With use_mcp_resources=True, McpToolset adds one tool, load_mcp_resource. The model passes resource names, ADK maps each name to a URI through resources/list, and the contents are appended to the next model request as user turns. The default is off.
capabilities:
  - resources
clients:
  - adk-python
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/google/adk-python
    title: src/google/adk/tools/load_mcp_resource_tool.py, LoadMcpResourceTool
    commit: c6586f19
    path: src/google/adk/tools/load_mcp_resource_tool.py:39-183
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: src/google/adk/tools/mcp_tool/mcp_toolset.py, use_mcp_resources and the three resource methods
    commit: c6586f19
    path: src/google/adk/tools/mcp_tool/mcp_toolset.py:175,223-226,569-626
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - model-initiated-resource-read
  - hermes-names-its-resource-tools-a-fifth-way
  - openclaw-names-its-resource-tools-a-fourth-way
---

# ADK Python's resource tool is opt-in and takes resource names, never URIs

Read at `c6586f19`.

`McpToolset(use_mcp_resources=True)` appends one tool, `load_mcp_resource`, after the server's own tools. The parameter defaults to `False`, and with the default ADK itself sends no `resources/*` request for that toolset. The constructor docstring says `tool_filter` does not apply to this tool.

## The mechanism

1. Before each model request, `LoadMcpResourceTool.process_llm_request` calls `resources/list` and adds the JSON array of resource names to the instructions, with a sentence telling the model to call `load_mcp_resource` before answering questions about them.
2. The tool takes one argument, `resource_names`, an array of strings. Its result is a status stub: the names, and the text "resource contents temporarily inserted and removed. to access these resources, call load_mcp_resource tool again."
3. When the next model request is built, the same hook finds that function response as the last content, calls `McpToolset.read_resource` for each name, and appends one `user` turn per content item: a text part "Resource <name> is:" followed by the text, or by the decoded blob with its MIME type.

`read_resource` resolves a name through `get_resource_info`, which calls `resources/list` again and returns the first resource whose `name` matches. It then calls `resources/read` with that resource's `uri`.

## What follows from the code

- The model never sees a URI. It sees names in the instructions and passes names back.
- Two resources with the same name cannot both be read. The first match is returned.
- `list_resources` sends no cursor, so a resource on a later page is neither listed to the model nor found by name.
- `resources/templates/list` is never called. A templated resource cannot be read.
- Reading one resource costs a `resources/list` and a `resources/read`, and every model request adds one more `resources/list`.
- The contents are appended to the outgoing request only. The status text tells the model to call the tool again when it needs them later.
- A failure to list or read is logged as a warning and the request goes ahead without the content.

## Against the other reads

Codex, opencode and Kilo Code are recorded in this registry with three host tools named `list_mcp_resources`, `list_mcp_resource_templates` and `read_mcp_resource`. [[model-initiated-resource-read]] describes the proposal those tools anticipate, which is a way for the model to read a resource by URI. ADK has one tool, under a different name, and it takes names. Its own result carries a status stub, and the contents arrive as separate user turns on the next request.

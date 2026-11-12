---
id: hermes-names-its-resource-tools-a-fifth-way
title: Hermes gives the model resources and prompts under a fifth set of tool names
kind: nuance
summary: Hermes materializes per-server `list_resources`, `read_resource`, `list_prompts` and `get_prompt` tools under an `mcp__<server>__` prefix. The model can read a resource, but the names match neither Codex and opencode's convention nor OpenClaw's.
capabilities:
  - resources
  - prompts
clients:
  - hermes-agent
  - openclaw
  - openai-codex
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_schema.py, utility tool schemas and mcp_prefixed_tool_name
    commit: 9dcf7714
    path: tools/mcp_tool_schema.py:147-183,240-253,319-335
    date: 2026-11-09
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_registration.py, utility selection and the capability gate
    commit: 9dcf7714
    path: tools/mcp_tool_registration.py:185-212
    date: 2026-11-09
status: current
lastVerified: 2026-11-09
related:
  - openclaw-names-its-resource-tools-a-fourth-way
  - model-initiated-resource-read
  - cline-lists-resources-and-prompts-but-never-reads-them
---

# Hermes gives the model resources and prompts under a fifth set of tool names

Every MCP tool Hermes registers is named `mcp__<server>__<tool>`, both components sanitized. The four resource and prompt operations are registered the same way, so a server called `github` yields `mcp__github__list_resources`, `mcp__github__read_resource`, `mcp__github__list_prompts` and `mcp__github__get_prompt`.

That is a third set of names for the same operations, and a fifth position on the question across the clients read so far. Codex and opencode converged on flat, server-agnostic `list_mcp_resources` / `read_mcp_resource`. OpenClaw materializes per-server `resources_list`, `resources_read`, `prompts_list`, `prompts_get`. Hermes is per-server like OpenClaw but keeps the spec's own method names in MCP's word order, prefixed. Cline lists resources into a UI tab with no read path, and fast-agent routes them through user-typed `@server:uri` mentions. A model that learned one set of names does not carry it to the next client.

Two things distinguish the Hermes version from the others. The utility tools are gated on what the server actually advertised: `_select_utility_schemas` reads `initialize_result.capabilities` and registers the resource pair only when the server declared `resources`, the prompt pair only when it declared `prompts`. A comment records that the previous gate — an `hasattr` check on the session — never filtered anything, because `ClientSession` defines all four methods on the class regardless. Cline is the counter-case for why the gate matters, listing resources into a UI tab with no way to fetch one.

They are also user-suppressible. Per-server config keys `tools.resources` and `tools.prompts` both default to true and turn the corresponding pair off. If a server's own tool normalises to the same name as a utility, the utility is dropped and the server's tool kept.

Like Codex, opencode and OpenClaw, Hermes ships this without anything in the spec to point at. PR #2527's mechanism-agnostic SHOULD would cover all of them. Ratifying any one client's names now strands the others.

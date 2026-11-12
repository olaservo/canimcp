---
id: fast-agent-resources-need-a-user-to-ask
title: fast-agent reads resources and prompts, but only a person can trigger either
kind: nuance
summary: fast-agent calls `resources/read` and `prompts/get` properly, and gives the model no way to call either. Resources arrive as `@server:uri` mentions a user typed; prompts arrive through `/prompt` or the agent API. Three clients, three different answers to the same SHOULD.
capabilities:
  - resources
  - prompts
clients:
  - fast-agent
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/ui/prompt/resource_mentions.py, resolve_mentions
    commit: 1b58e686
    path: src/fast_agent/ui/prompt/resource_mentions.py:250-278
    date: 2026-08-25
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/agents/mcp_agent.py, get_resource and apply_prompt
    commit: 1b58e686
    path: src/fast_agent/agents/mcp_agent.py:1810-1811,1847-1865
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - model-initiated-resource-read
  - cline-lists-resources-and-prompts-but-never-reads-them
  - codex-reads-one-page-of-tools
---

# fast-agent reads resources and prompts, but only a person can trigger either

Both verbs are fully implemented. `resources/read` runs through `MCPClientConnection.read_resource`, which also sanitizes `file://` URIs out of anything a remote server returns. `prompts/get` runs through `get_prompt` and lands as persistent conversation messages via `apply_prompt_template`.

Neither is reachable by the model. The entry points are:

| Path | Trigger |
|---|---|
| `@server:uri` in the user's input | a person typing |
| `/prompt` in the interactive shell | a person typing |
| `agent.get_resource(...)` / `agent.apply_prompt(...)` | application code |

There is no `read_mcp_resource` tool, no built-in tool of any name that takes a resource URI, and nothing that surfaces the resource list into the model's context as something it could ask for.

## Three clients, three answers

The SHOULD in PR #2527 asks that a client give the model *some* mechanism to read a resource by URI. The reads so far disagree about what to do with it:

| Client | Lists resources | Reads them | Model can trigger a read |
|---|---|---|---|
| Codex CLI | yes | yes | yes, via `read_mcp_resource` |
| opencode | yes | yes | yes, via `read_mcp_resource` |
| fast-agent | yes | yes | no |
| Cline | yes (extension only) | no | no |

fast-agent is the interesting case for the PR, because it is not an oversight. Cline's gap looks like a dropped feature — a dead tool id, a UI tab with nothing behind it. fast-agent's is a design: the mention syntax, the completer that offers resource URIs, and the `@`-expansion into `EmbeddedResource` blocks are all built out. It decided the user picks the context.

So the SHOULD is not free. Ratifying it asks fast-agent to add a surface it deliberately does not have, which is a stronger objection than "nobody has got round to it" and worth putting on the PR alongside the naming point.

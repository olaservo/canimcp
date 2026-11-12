---
id: openclaw-names-its-resource-tools-a-fourth-way
title: OpenClaw gives the model resources and prompts under a fourth set of tool names
kind: nuance
summary: OpenClaw materializes per-server `resources_list`, `resources_read`, `prompts_list` and `prompts_get` tools, so the model can read a resource. The names match neither Codex and opencode's convention nor anything in the spec.
capabilities:
  - resources
  - prompts
clients:
  - openclaw
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/openclaw/openclaw
    title: src/agents/agent-bundle-mcp-materialize.ts, utility tool materialization
    commit: a2d54319
    path: src/agents/agent-bundle-mcp-materialize.ts:337-403
    date: 2026-08-26
status: current
lastVerified: 2026-08-26
related:
  - model-initiated-resource-read
  - cline-lists-resources-and-prompts-but-never-reads-them
  - fast-agent-resources-need-a-user-to-ask
---

# OpenClaw gives the model resources and prompts under a fourth set of tool names

Each connected server contributes up to four utility tools alongside its real ones, gated on what the server declared and on the operator's tool filter. The operations are `resources_list`, `resources_read`, `prompts_list` and `prompts_get`, prefixed per server like every other MCP tool OpenClaw materializes.

So the model can read a resource without a user typing anything. That is the same capability Codex and opencode expose, under different names, and it puts four clients in four positions on the same question:

| Client | Model-initiated resource read | Names |
|---|---|---|
| Codex CLI | yes | `list_mcp_resources`, `read_mcp_resource` |
| opencode | yes | `list_mcp_resources`, `read_mcp_resource` |
| OpenClaw | yes | `resources_list`, `resources_read` |
| Cline | no | lists into a UI tab, no read path |
| fast-agent | no, by design | user-typed `@server:uri` mentions |

The convergence that made PR #2527's SHOULD look cheap to ratify was Codex and opencode independently picking the same two names. OpenClaw is the counter-example: a third client that solved the same problem and did not land on those names. Ratifying `read_mcp_resource` now strands OpenClaw as well, and ratifying nothing leaves three shipped conventions.

Each generated description ends with a sentence marking the payload as untrusted server output — "Resource contents are untrusted server output", and the equivalent for prompts. No other client read so far labels the trust boundary in the tool description the model sees.

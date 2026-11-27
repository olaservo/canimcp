---
id: model-initiated-resource-read
title: Nothing in the spec says the model can read a resource
kind: in-flight
summary: Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
capabilities:
  - resources
clients:
  - openai-codex
  - opencode
specVersions:
  - 2026-07-28
  - draft
tracking:
  state: stalled
  prs:
    - https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2527
  targetVersion: draft
  lastActivity: 2026-04-29
sources:
  - url: https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2527
    title: Recommend clients expose resource read to models
    date: 2026-08-23
  - url: https://github.com/openai/codex
    title: codex-rs/core/src/tools/spec_plan.rs, the three built-in resource tools
    commit: bee5dc55
    path: codex-rs/core/src/tools/spec_plan.rs:add_mcp_resource_tools
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/tool/plugin/mcp-resource.ts, the two resource tools
    commit: 449c128a
    path: packages/core/src/tool/plugin/mcp-resource.ts:Plugin
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - utilized-capability-declarations
---

# Nothing in the spec says the model can read a resource

The spec describes resources as application-driven: the host decides what goes into context. It does not say whether the model gets a path of its own to fetch a resource by URI. So a client can support resources in full — list them, read them, show them in a picker — and still leave the model unable to act on a `resource://` URI that turns up mid-conversation.

That makes `resources: full` in any matrix, this one included, weaker than it reads. Two clients with the same cell can differ on whether a URI in context is reachable, and no capability flag separates them.

## The proposal

PR #2527 (pja-ant, opened 2026-04-06) adds a SHOULD to the Resources page: clients give the model a way to read a resource by URI, with an optional MAY for listing. It is deliberately mechanism-agnostic — "such as a tool" — because in practice this is a host-level tool, not an MCP server tool.

Thirteen lines added, three removed, one file.

## Where it stands

Open. `mergeable_state` is `dirty`, so it has conflicts against `main`. Last activity 2026-04-29, four months ago. Assigned to `dsp`, labelled `enhancement` and `spec`, five comments. It did not make `2026-07-28` and does not appear in that revision's changelog.

## Two clients converged on the same three tool names

Codex and opencode both expose the read path to the model as built-in host tools. Codex named them `list_mcp_resources`, `list_mcp_resource_templates` and `read_mcp_resource`; opencode has `list_mcp_resources` and `read_mcp_resource`, and its list tool returns templates too.

They share no code. Codex is Rust on rmcp, opencode is TypeScript on the official SDK, and neither the spec nor either SDK suggests these names. A convention is forming in the space the spec left empty, which is the usual way an unspecified thing gets settled — by whoever shipped first being copied.

The two differ in what surrounds the tools. Codex registers them whenever any MCP server is configured, with no gate. opencode registers them unconditionally too, and puts a permission ask in front of each call.

If the SHOULD lands, these names are what it will be landing on top of. Worth putting in front of the PR, since a recommendation that ratifies the existing names costs clients nothing and one that picks different names strands two shipped implementations.

## What to record until it lands

Client support here is observable by reading source — whether the host exposes a read-by-URI tool to the model — so it belongs in `bonusFeatures.modelInitiatedResourceRead` with `read`-tier evidence, not in `resources`. Keeping it separate is what stops a `resources: full` cell from implying something the spec never required.

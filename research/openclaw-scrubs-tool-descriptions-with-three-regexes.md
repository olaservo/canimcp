---
id: openclaw-scrubs-tool-descriptions-with-three-regexes
title: OpenClaw scrubs MCP tool descriptions for prompt injection, and one of its three rules does nothing
kind: nuance
summary: Server-supplied tool descriptions pass a sanitizer before reaching the model on both surfaces. It redacts two fixed phrasings of "ignore previous instructions" and truncates at 1,200 characters. Its third rule rewrites "system prompt" to itself, changing only whitespace.
capabilities:
  - tools
clients:
  - openclaw
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/openclaw/openclaw
    title: src/agents/mcp-metadata.ts, sanitizeMcpMetadataText
    commit: a2d54319
    path: src/agents/mcp-metadata.ts:1-25
    date: 2026-08-26
  - url: https://github.com/openclaw/openclaw
    title: src/agents/agent-bundle-mcp-runtime.ts, applied to tool.description
    commit: a2d54319
    path: src/agents/agent-bundle-mcp-runtime.ts:831
    date: 2026-08-26
  - url: https://github.com/openclaw/openclaw
    title: src/node-host/mcp.ts, applied on the node host surface
    commit: a2d54319
    path: src/node-host/mcp.ts:204-205
    date: 2026-08-26
status: current
lastVerified: 2026-08-26
related:
  - openclaw-names-its-resource-tools-a-fourth-way
---

# OpenClaw scrubs MCP tool descriptions for prompt injection, and one of its three rules does nothing

`sanitizeMcpMetadataText` is a 25-line function applied to `tool.description` as tools are materialized, on the agent surface and the node host both. It does three replacements and a truncation:

- `ignore (all) (previous|prior|above) instructions` becomes `[redacted MCP metadata instruction]`, case-insensitive.
- `disregard (all) (previous|prior|above) instructions` becomes the same marker.
- `system prompt` is replaced with the literal string `system prompt`.
- Anything over 1,200 characters is truncated with an ellipsis.

The third rule is a no-op on content. Its regex allows any run of whitespace between the two words, so the only thing it changes is casing and spacing — `System  Prompt` becomes `system prompt` and nothing is redacted. Either it was meant to redact and does not, or it was meant to normalize and reads like a redaction next to the two rules above it.

The first two rules are exact-phrase matches, so any rephrasing walks past them. That is not a criticism of the intent so much as a limit worth recording: this is a marker for the obvious string, not a defence.

What the sanitizer covers is also narrower than it looks. It is applied to tool descriptions. Resource contents, prompt contents and tool names on the agent surface do not pass through it — the node host runs tool names through it, the agent bundle does not.

Recorded because it is the only client read so far that scrubs server metadata before showing it to a model at all. OpenClaw pairs it with two other trust boundaries: generated resource and prompt tools carry an explicit untrusted-output sentence in their descriptions, and under Tool Search no MCP tool name or description is copied into the system prompt in any mode.

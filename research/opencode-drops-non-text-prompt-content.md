---
id: opencode-drops-non-text-prompt-content
title: opencode drops the media and binary parts of an MCP prompt, and fills arguments positionally
kind: nuance
summary: Server prompts become slash commands, but a prompt message carrying an image, audio or a binary resource maps to an empty string and is joined into the template. Embedded text resources are kept. Named arguments are filled positionally, so argument order decides the result.
capabilities:
  - prompts
clients:
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/plugin/command.ts, MCP prompts registered as commands
    commit: 5d1f7884
    path: packages/core/src/plugin/command.ts:Plugin,promptMessageText
    date: 2026-11-27
  - url: https://github.com/anomalyco/opencode
    title: packages/core/src/mcp/client.ts, prompts listing
    commit: 5d1f7884
    path: packages/core/src/mcp/client.ts:connect
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
---

# opencode drops the media and binary parts of an MCP prompt, and fills arguments positionally

opencode surfaces prompts well at the listing level. `prompts/list` is fully paginated, gated on the server declaring `prompts`, and every prompt becomes a slash command carrying the server's description.

The loss is in the template. A prompt's messages are flattened by taking the text of each and joining them:

```ts
.map((message) => promptMessageText(message.content))
.join("\n")
.trim()
```

Text content and embedded text resources are kept. A message whose content is an image, audio, a resource link or a binary embedded resource contributes an empty string. It is not skipped and not reported — it becomes a blank line in the middle of the template. A prompt built around a diagram or an attached PDF arrives as its surrounding prose with a hole where the content was, and nothing distinguishes that from a prompt the server wrote with a blank line in it.

Prompt content has allowed image and resource parts since `2024-11-05`, so this is not a new part of the spec that clients have yet to catch up with.

## Arguments are positional

Arguments are filled by index rather than by name. Each declared argument gets the word at the same position in the text typed after the command, in declaration order. A missing required argument stops the command with a usage line that lists the arguments by name. An optional argument with no word is left out of the request. The usage line is the only place the names appear, so invoking a prompt means knowing what the server put first.

This is fine for a one-argument prompt and gets worse as arguments accumulate, particularly where several are optional — there is no way to supply the third without supplying the first two.

## Why it is a nuance and not a gap

Nothing here is a spec violation. A client may render a prompt however it likes, and reducing prompts to a text template is a defensible fit for a terminal agent. But a matrix cell reading "prompts: yes" carries the implication that a server's prompts arrive intact, and for any prompt that is not pure text they do not.

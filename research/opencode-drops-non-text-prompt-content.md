---
id: opencode-drops-non-text-prompt-content
title: opencode keeps only the text parts of an MCP prompt, and fills arguments positionally
kind: nuance
summary: Server prompts become slash commands, but a prompt message carrying an image or an embedded resource maps to an empty string and is joined into the template. Named arguments are also replaced positionally, so argument order decides the result.
capabilities:
  - prompts
clients:
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/anomalyco/opencode
    title: packages/opencode/src/command/index.ts, MCP prompts registered as commands
    commit: 7cde8329
    path: packages/opencode/src/command/index.ts:105-131
    date: 2026-08-24
  - url: https://github.com/anomalyco/opencode
    title: packages/opencode/src/mcp/catalog.ts, prompts pagination
    commit: 7cde8329
    path: packages/opencode/src/mcp/catalog.ts:117-124
    date: 2026-08-24
status: current
lastVerified: 2026-08-24
---

# opencode keeps only the text parts of an MCP prompt, and fills arguments positionally

opencode surfaces prompts well at the listing level. `prompts/list` is fully paginated, gated on the server declaring `prompts`, and every prompt becomes a slash command carrying the server's description.

The loss is in the template. A prompt's messages are flattened by taking the text of each and joining them:

```ts
.map((message) => (message.content.type === "text" ? message.content.text : ""))
.join("\n")
```

A message whose content is an image or an embedded resource contributes an empty string. It is not skipped and not reported — it becomes a blank line in the middle of the template. A prompt built around a diagram or an attached document arrives as its surrounding prose with a hole where the content was, and nothing distinguishes that from a prompt the server wrote with a blank line in it.

Prompt content has allowed image and resource parts since `2024-11-05`, so this is not a new part of the spec that clients have yet to catch up with.

## Arguments are positional

Arguments are filled by index rather than by name:

```ts
Object.fromEntries(prompt.arguments.map((argument, i) => [argument.name, `$${i + 1}`]))
```

Each declared argument gets the placeholder `$1`, `$2` and so on in declaration order, and the command's hints are the same list. The names the server declared are used as keys but never shown to the user, so invoking a prompt means knowing what the server put first.

This is fine for a one-argument prompt and gets worse as arguments accumulate, particularly where several are optional — there is no way to supply the third without supplying the first two.

## Why it is a nuance and not a gap

Nothing here is a spec violation. A client may render a prompt however it likes, and reducing prompts to a text template is a defensible fit for a terminal agent. But a matrix cell reading "prompts: yes" carries the implication that a server's prompts arrive intact, and for any prompt that is not pure text they do not.

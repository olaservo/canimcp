---
id: codex-reads-one-page-of-tools
title: Codex discards the tools/list cursor unless the 2026-07-28 mode is on
kind: idiosyncrasy
summary: The paginator that collects a server's tool catalog is fed a nextCursor of None whenever Codex is in its default protocol mode, so it stops after the first page. No warning is emitted and the truncated catalog looks complete.
capabilities:
  - tools
clients:
  - openai-codex
specVersions:
  - 2025-06-18
sources:
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/rmcp_client.rs, list_tools_for_client_uncached
    commit: b705b6b0
    path: codex-rs/codex-mcp/src/rmcp_client.rs:618-651
    date: 2026-08-24
  - url: https://github.com/openai/codex
    title: codex-rs/codex-mcp/src/pagination.rs
    commit: b705b6b0
    path: codex-rs/codex-mcp/src/pagination.rs:27-79
    date: 2026-08-24
status: current
lastVerified: 2026-08-24
related:
  - codex-defaults-to-2025-06-18
---

# Codex discards the tools/list cursor unless the 2026-07-28 mode is on

Codex has a careful paginator. `collect_paginated_with_limit` caps pages at 100 and items at 2,048, rejects a cursor over 64 KB, detects a repeated cursor, and puts a 30-second timeout over the whole loop. It stops when a page returns no `nextCursor`.

The tool-catalog caller nulls the cursor before the paginator sees it:

```rust
let next_cursor = match protocol_mode {
    McpProtocolMode::Legacy => None,
    McpProtocolMode::V20260728 => response.next_cursor,
};
Ok((response.tools, next_cursor))
```

`Legacy` is the default mode and the only one a shipped install uses, since `mcp_2026_07_28` is off by default. So the loop exits after page one and Codex holds whatever subset of the tool list the server chose to put there.

Nothing distinguishes that from a complete catalog. There is no warning, no truncation marker on the returned `Vec<ToolInfo>`, and no error — the paginator's own limits all return `Err`, but this path never reaches them.

## Server-side consequence

A server that paginates `tools/list` at all loses tools to Codex, and the loss is silent on both ends. The size of the first page is the server's choice, so the same server can look complete to Codex or badly truncated depending on a number the server picked for unrelated reasons.

Pagination has been in `tools/list` since `2024-11-05`. It is not a `2026-07-28` feature, and the mode gate reads as caution about the newer lifecycle applied to a call that predates it.

## Resources are not affected

`list_mcp_resources` and `list_mcp_resource_templates` are exposed to the model as tools and hand the model a `next_cursor`, taking a `cursor` back on the next call. That path does not consult the protocol mode, so resource listing pages correctly in both modes — driven by the model rather than by a loop.

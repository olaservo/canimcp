---
id: goose-reads-one-page-of-prompts-and-resources
title: goose follows the tools/list cursor but reads one page of prompts and of resources
kind: idiosyncrasy
summary: goose pages tools/list to the end, but sends prompts/list and resources/list once with no cursor. A prompt, ui:// app or resource past the first page never reaches the user or the model, and prompt and resource list_changed are ignored.
capabilities:
  - prompts
  - prompts.listChanged
  - resources
  - resources.listChanged
  - bonusFeatures.modelInitiatedResourceRead
  - extensions
clients:
  - goose
specVersions:
  - 2026-07-28
  - 2025-11-25
sources:
  - url: https://github.com/aaif-goose/goose
    title: crates/oi-kit-agent/src/mcp/lease.rs, the prompt and resource listings
    commit: c546eaa1
    path: crates/oi-kit-agent/src/mcp/lease.rs:ExtensionLease.list_prompts_from_extension,ExtensionLease.list_prompts,ExtensionLease.ui_resources,ExtensionLease.list_resources_result_from_extension
    date: 2026-11-27
  - url: https://github.com/aaif-goose/goose
    title: crates/oi-kit-agent/src/mcp/mod.rs, the tools/list loop
    commit: c546eaa1
    path: crates/oi-kit-agent/src/mcp/mod.rs:Extension.fetch_public_tools
    date: 2026-11-27
  - url: https://github.com/aaif-goose/goose
    title: crates/oi-kit-agent/src/mcp/client.rs, the ClientHandler implementation
    commit: c546eaa1
    path: crates/oi-kit-agent/src/mcp/client.rs:GooseClient.on_tool_list_changed
    date: 2026-11-27
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/agents/platform_extensions/ext_manager.rs, the list_resources and read_resource tools
    commit: c546eaa1
    path: crates/goose/src/agents/platform_extensions/ext_manager.rs:ListResourcesParams,ReadResourceParams,ExtensionManagerClient.get_tools
    date: 2026-11-27
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/agents/tool_snapshot.rs, what the resource tools return
    commit: c546eaa1
    path: crates/goose/src/agents/tool_snapshot.rs:ToolSnapshot.list_resources,ToolSnapshot.read_resource_tool,ToolSnapshot.ui_resources
    date: 2026-11-27
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/agents/state_machine/ops_mcp_prompts.rs, the prompt commands
    commit: c546eaa1
    path: crates/goose/src/agents/state_machine/ops_mcp_prompts.rs
    date: 2026-11-27
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/goose_apps/app.rs, fetch_mcp_apps
    commit: c546eaa1
    path: crates/goose/src/goose_apps/app.rs:fetch_mcp_apps
    date: 2026-11-27
  - url: https://crates.io/crates/rmcp/3.11.0
    title: rmcp 3.11.0, ClientHandler default on_prompt_list_changed and on_resource_list_changed
    path: src/handler/client.rs
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - codex-reads-one-page-of-tools
  - eve-defers-every-mcp-tool-and-reads-one-page
  - model-initiated-resource-read
---

# goose follows the tools/list cursor but reads one page of prompts and of resources

`Extension.fetch_public_tools` loops on `tools/list` until a page comes back with no `nextCursor`. The prompt and resource listings have no loop. Each one passes `None` as the cursor and keeps only the items of the first reply.

## Prompts

`ExtensionLease.list_prompts_from_extension` sends `prompts/list` with no cursor and returns `result.prompts`. `ExtensionLease.list_prompts` runs it for every running extension. Every prompt surface goes through that one call: the `/prompts` and `/prompt` commands in `ops_mcp_prompts.rs`, and the CLI session's prompt list, prompt info, prompt get and completion cache. `/prompt <name>` looks the name up in that listing before it sends `prompts/get`, so a prompt on a later page is reported as not found.

## Resources

`ExtensionLease.ui_resources` sends one `resources/list` per extension and keeps the entries whose URI starts with `ui://`. `fetch_mcp_apps` reads each of those and offers the HTML as an app. A `ui://` resource past the first page is not offered.

The model reaches resources through two tools on the built-in `extensionmanager` extension, `list_resources` and `read_resource`. They are left out of the tool list when no extension advertises resources. `list_resources` takes one optional argument, `extension_name`, and has no cursor argument. It calls `ExtensionLease.list_resources_result_from_extension`, which sends `resources/list` with no cursor. The tool returns a text block per extension with one line per resource, `<extension> - <name>, uri: (<uri>)`, and the reply's `nextCursor` is not shown. The model cannot ask for a second page. `read_resource` returns the text contents of the read, each prefixed with the URI. Blob contents are dropped.

## List-changed notifications

`GooseClient` overrides `on_tool_list_changed` and no other list-changed callback. rmcp 3.11.0, the version goose's lockfile resolves, implements `on_prompt_list_changed` and `on_resource_list_changed` as no-ops, and `on_resource_updated` is not overridden either. goose does not cache prompt or resource listings, so the next command or tool call lists again and sees a changed list. The CLI's prompt-name completion cache is the exception: it is filled after extensions load and on extension or provider changes, and a `notifications/prompts/list_changed` does not refresh it.

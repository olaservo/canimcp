# goose

Open-source agent from Block, shipping as a desktop app and a CLI from one Rust codebase. Uses rmcp as its MCP client, resolved to 3.11.0.

## At a glance

| | |
|---|---|
| Registry id | `goose` |
| Vendor | Block |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/aaif-goose/goose> |
| Home | <https://block.github.io/goose> |
| Wire names | `goose-app`, `goose-desktop`, `goose-cli` |
| SDK | `rmcp` 3.11.0 · declares `3.9.0` · official Rust SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28` and every older revision it speaks, not yet split by revision |
| Source last updated | 2026-11-26 |
| Last read | 2026-11-27 |
| Probed | `1.61.0` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| Authentication | — not recorded | | |
| **Tools** | ● full | read, declared | `2025-03-26`, `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ● full | read ⇧ | `2026-07-28` |
| **Resources** | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read ⇧ | `2026-07-28` |
| **Prompts** | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| Completions | — not recorded | | |
| **Sampling** | ○ unsupported | read, declared | `2025-03-26`, `2026-07-28` |
| **Elicitation** | ● full | read, declared | `2025-03-26`, `2026-07-28` |
| &nbsp;&nbsp;↳ form | ● full | read, declared ⇧ | `2025-03-26`, `2026-07-28` |
| &nbsp;&nbsp;↳ url | ● full | read, declared ⇧ | `2025-03-26`, `2026-07-28` |
| **Roots** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ● full | read | `2026-07-28` |
| **Instructions** | ● full | read | `2026-07-28` |
| Icons | — not recorded | | |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ list | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ cancel | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ◐ partial | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **tools.listChanged** — on_tool_list_changed bumps a version counter that the tools cache is checked against, so a changed tool list is picked up mid-session.
- **tools.result** — content only. Code mode also reads content text only.
- **tools.result.content** — Every content block reaches the model, filtered by audience annotation. When nothing non-empty is left the placeholder text (empty result) is sent instead.
- **tools.result.structuredContent** — No provider formatter names structuredContent, so it never reaches the model. The ACP surface and the desktop app receive it for MCP Apps.
- **tools.result.audience** — filter_for_audience drops blocks whose annotations.audience excludes the assistant before the provider sees them.
- **sampling** — Removed in 7b68b47ff (2026-09-22, #12193). GooseClient has no create_message and declares no sampling capability, so rmcp 3.11.0's default handler answers method not found.
- **elicitation** — Resolves a session id and a tool-call request id from the request context and returns INTERNAL_ERROR if either is missing, so elicitation only works inside a tool call. Hard 300-second timeout. Declared as {"form": {}}.
- **elicitation.url** — URL mode is flattened into the same prompt path as form mode, passed as {"url": url} rather than a requested schema. Handled but not declared: the elicitation capability names form only.
- **roots** — list_roots returns one root derived from the working directory the client was connected with. Marked #[expect(deprecated)] at the declaration site — roots is deprecated as of 2026-07-28 (SEP-2577). Declared as roots: {} with no listChanged.
- **roots.listChanged** — Not declared and never sent. The notify_roots_list_changed call was removed in 5bd5e548e (2026-10-05, #12161), and each MCP client keeps the working directory it was connected with.
- **logging** — on_logging_message fans notifications out to subscribers. Marked #[expect(deprecated)] — logging is deprecated as of 2026-07-28 (SEP-2577).
- **instructions** — Server instructions are carried through into the system prompt as a per-extension block.
- **extensions.io.modelcontextprotocol/ui** — Declared by goose Desktop, not by goose CLI. Advertised with mimeTypes ["text/html;profile=mcp-app"]. An embedder passing explicit host extensions overrides the default either way.
- **extensions.io.modelcontextprotocol/tasks** — Not declared and not implemented. rmcp 3.11.0 implements the SEP-2663 client side (call_tool_once, get_task, update_task, cancel_task and ClientCapabilitiesBuilder::enable_tasks), and goose uses none of it. The client capabilities are built with roots, the extensions map and elicitation, and the extensions map holds only io.modelcontextprotocol/ui. On 2026-07-28 goose sends tools/call through rmcp's call_tool, which returns UnexpectedResponse for a task result. On 2025-11-25 goose sends a plain CallToolRequest, and rmcp 3.11.0 has no task-augmented request form.
- **extensions.io.modelcontextprotocol/tasks.list** — No tasks/list. rmcp 3.11.0 does not define it.
- **extensions.io.modelcontextprotocol/tasks.cancel** — goose never calls rmcp's cancel_task.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. rmcp 3.11.0 has list_skills and get_skill, and goose calls neither. goose's own skills come from SKILL.md files under ~/.agents/skills, installed plugins and the project's .agents/skills, through a single SkillSource implementation that does not read MCP servers.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. goose sends no events/list, events/poll, events/stream or events/subscribe, and rmcp 3.11.0 defines none of these methods.
- **prompts** — goose lists prompts with prompts/list and no cursor, so only the first page is read. Prompts are offered as commands, listed afresh on each command, and the CLI caches prompt names for completion.
- **prompts.listChanged** — Not handled. The CLI's prompt-name completion cache is not refreshed by a notification.
- **resources** — resources/list is sent with no cursor, so only the first page is read, for the model-facing tools and for MCP Apps ui:// resources alike. The model reaches resources through two tools, list_resources and read_resource, offered only when some extension has resources. list_resources takes only an extension name, and read_resource returns text contents only.
- **resources.listChanged** — Not handled; resources are listed afresh when asked.
- **resources.subscribe** — Nothing sends resources/subscribe or handles notifications/resources/updated.
- **bonusFeatures.modelInitiatedResourceRead** — Two tools, list_resources and read_resource, offered only when some extension has resources. The list is one page per extension and the read returns text contents only.

## Verified by the probe

112 records from the live probe (`probe/`), client version `1.61.0`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/goose.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/goose@1.61.0/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [app_only](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [app_only](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.app_only/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [app_only](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [app_only](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.app_only/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [app_only](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.app_only/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| **protocol.initializeHandshake** | | | | | |
| [protocol.initializeHandshake.echo](../probe/runs/goose@1.61.0/default/both-http/protocol.initializeHandshake.echo/record.json) | default | http | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/goose@1.61.0/default/both-stdio/protocol.initializeHandshake.echo/record.json) | default | stdio | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/goose@1.61.0/default/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | http | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/goose@1.61.0/default/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | stdio | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/goose@1.61.0/default/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | http | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/goose@1.61.0/default/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | stdio | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/goose@1.61.0/default/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | http | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/goose@1.61.0/default/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | stdio | `2026-07-28` | 1.61.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| **protocol.serverDiscover** | | | | | |
| [protocol.serverDiscover.method_not_found](../probe/runs/goose@1.61.0/default/both-http/protocol.serverDiscover.method_not_found/record.json) | default | http | `2025-11-25` | 1.61.0 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/goose@1.61.0/default/both-stdio/protocol.serverDiscover.method_not_found/record.json) | default | stdio | `2025-11-25` | 1.61.0 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/goose@1.61.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.meta_only/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.meta_only/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [meta_only](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.meta_only/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [with_meta](../probe/runs/goose@1.61.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.with_meta/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.with_meta/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [with_meta](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.with_meta/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/goose@1.61.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.audience_user/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.audience_user/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [audience_user](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.audience_user/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/goose@1.61.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [empty_object](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [empty_object](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.empty_object/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [empty_object](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [empty_object](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.empty_object/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [empty_object](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.empty_object/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [large](../probe/runs/goose@1.61.0/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [large](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [large](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.large/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [large](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [large](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.large/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [large](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.large/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [no_content_key](../probe/runs/goose@1.61.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [no_content_key](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [no_content_key](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.no_content_key/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [no_content_key](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [no_content_key](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.no_content_key/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [no_content_key](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.no_content_key/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/goose@1.61.0/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.is_error/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.is_error/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [is_error](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.is_error/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/goose@1.61.0/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.with_image/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.with_image/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [with_image](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.with_image/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/goose@1.61.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.schema_match/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.schema_match/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [schema_match](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.schema_match/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [schema_mismatch](../probe/runs/goose@1.61.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.schema_mismatch/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.schema_mismatch/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [schema_mismatch](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.schema_mismatch/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/goose@1.61.0/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.61.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 1.61.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.mirror/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.mirror/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [mirror](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.mirror/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [sc_empty](../probe/runs/goose@1.61.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.sc_empty/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.sc_empty/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [sc_empty](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.sc_empty/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [sc_null](../probe/runs/goose@1.61.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.sc_null/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.sc_null/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [sc_null](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.sc_null/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [sc_string](../probe/runs/goose@1.61.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.sc_string/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.sc_string/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [sc_string](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.sc_string/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [structured_only](../probe/runs/goose@1.61.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.structured_only/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.structured_only/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [structured_only](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.structured_only/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [summary_and_data](../probe/runs/goose@1.61.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.61.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.61.0/anthropic/both-http/tools.result.summary_and_data/record.json) | anthropic | http | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.61.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 1.61.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.61.0/code-mode/both-http/tools.result.summary_and_data/record.json) | code-mode | http | `2026-07-28` | 1.61.0 | tool not offered to the model |
| [summary_and_data](../probe/runs/goose@1.61.0/code-mode/both-stdio/tools.result.summary_and_data/record.json) | code-mode | stdio | `2026-07-28` | 1.61.0 | tool not offered to the model |

## Where the evidence disagrees

- **elicitation** — recorded as `full`, but declared-tier evidence at `2025-03-26` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — No elicitation key on the goose record. Form and URL mode are implemented, and form is declared.

## Research notes

- [goose only answers elicitation raised inside a tool call](../research/goose-elicitation-needs-tool-call-context.md) — *nuance*. create_elicitation resolves a session id and a tool-call request id from the request context and errors if either is missing, so an elicitation raised outside a tool call fails rather than prompting.
- [goose emits a roots notification that 2026-07-28 removed, and rmcp does not stop it](../research/goose-sends-removed-roots-notification.md) — *idiosyncrasy*. notify_roots_list_changed fires on every working-directory change with no version check, goose prefers 2026-07-28 where the notification no longer exists, and rmcp 3.1.4 gates nothing on the outbound notification path.
- [goose never sends the client name every registry lists it under](../research/goose-client-name-varies-by-surface.md) — *idiosyncrasy*. goose sends clientInfo.name as goose-app, goose-desktop or goose-cli, not goose, and an embedder can override it entirely. The two surfaces also differ on MCP Apps support.
- [goose follows the tools/list cursor but reads one page of prompts and of resources](../research/goose-reads-one-page-of-prompts-and-resources.md) — *idiosyncrasy*. goose pages tools/list to the end, but sends prompts/list and resources/list once with no cursor. A prompt, ui:// app or resource past the first page never reaches the user or the model, and prompt and resource list_changed are ignored.
- [notes/goose-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/goose-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the goose source at 5bad61a.

## Provenance

Read at `c546eaa1` on 2026-11-27, from `main` of https://github.com/aaif-goose/goose.git. That commit was authored 2026-11-26.

**SDK.** The workspace declares rmcp "3.9.0" as a caret requirement and the lockfile resolves it to 3.11.0, so behavioural claims cite 3.11.0. The lockfile holds one copy of rmcp. [patch.crates-io] exists but covers only cudaforge, not rmcp. goose names ProtocolVersion::V_2026_07_28 and V_2025_11_25 itself rather than inheriting a version from rmcp, and names V_2025_11_25 as the legacy fallback.

Paths read:

- `crates/oi-kit-agent/src/mcp/client.rs`
- `crates/oi-kit-agent/src/mcp/mod.rs`
- `crates/oi-kit-agent/src/mcp/lease.rs`
- `crates/oi-kit-agent/src/mcp/stdio.rs`
- `crates/oi-kit-agent/src/mcp/streamable_http.rs`
- `crates/goose/src/agents/extension_manager/mod.rs`
- `crates/goose/src/agents/services.rs`
- `crates/goose/src/acp/server.rs`
- `Cargo.toml`
- `Cargo.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/goose.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

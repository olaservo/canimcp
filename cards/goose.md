# goose

Open-source agent from Block, shipping as a desktop app and a CLI from one Rust codebase. Uses rmcp as its MCP client, resolved to 3.1.4.

## At a glance

| | |
|---|---|
| Registry id | `goose` |
| Vendor | Block |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/aaif-goose/goose> |
| Home | <https://block.github.io/goose> |
| Wire names | `goose-desktop`, `goose-cli` |
| SDK | `rmcp` 3.1.4 · declares `3.0.0` · official Rust SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-08-23 |
| Last read | 2026-08-23 |
| Probed | `1.58.0` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| Authentication | — not recorded | | |
| **Tools** | ● full | declared | `2025-03-26` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ● full | read ⇧ | `2026-07-28` |
| Resources | — not recorded | | |
| Prompts | — not recorded | | |
| Completions | — not recorded | | |
| **Sampling** | ● full | read, declared | `2025-03-26`, `2026-07-28` |
| **Elicitation** | ● full | read, declared | `2025-03-26`, `2026-07-28` |
| &nbsp;&nbsp;↳ form | ● full | read, declared ⇧ | `2025-03-26`, `2026-07-28` |
| &nbsp;&nbsp;↳ url | ● full | read, declared ⇧ | `2025-03-26`, `2026-07-28` |
| **Roots** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read ⇧ | `2026-07-28` |
| **Logging** | ● full | read | `2026-07-28` |
| **Instructions** | ● full | read | `2026-07-28` |
| Icons | — not recorded | | |
| Tasks | — not recorded | | |
| JSON Schema | — not recorded | | |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read | `2026-07-28` |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **tools.listChanged** — on_tool_list_changed invalidates the tools cache and bumps a version counter, so a changed tool list is picked up mid-session.
- **tools.result** — content only. Code mode also reads content text only.
- **tools.result.content** — Every content block reaches the model, filtered by audience annotation. When nothing non-empty is left the placeholder text (empty result) is sent instead.
- **tools.result.structuredContent** — No provider formatter names structuredContent, so it never reaches the model. The ACP surface and the desktop app receive it for MCP Apps.
- **tools.result.audience** — filter_for_audience drops blocks whose annotations.audience excludes the assistant before the provider sees them.
- **sampling** — create_message is implemented and marked #[expect(deprecated)] — sampling is deprecated as of 2026-07-28 (SEP-2577), the revision goose prefers.
- **elicitation** — Resolves a session id and a tool-call request id from the request context and returns INTERNAL_ERROR if either is missing, so elicitation only works inside a tool call. Hard 300-second timeout.
- **elicitation.url** — URL mode is flattened into the same prompt path as form mode, passed as {"url": url} rather than a requested schema.
- **roots** — list_roots returns roots derived from the working directory. Marked #[expect(deprecated)] at the declaration site — roots is deprecated as of 2026-07-28 (SEP-2577).
- **roots.listChanged** — Sent on working-directory change with no protocol-version gate, including when 2026-07-28 is negotiated, where the notification no longer exists. rmcp 3.1.4 does not filter it, so it reaches the wire.
- **logging** — on_logging_message fans notifications out to subscribers. Marked #[expect(deprecated)] — logging is deprecated as of 2026-07-28 (SEP-2577).
- **instructions** — Server instructions are carried through into the system prompt as a per-extension block.
- **extensions.io.modelcontextprotocol/ui** — Declared by goose Desktop, not by goose CLI. Advertised with mimeTypes ["text/html;profile=mcp-app"]. An embedder passing explicit host extensions overrides the default either way.

## Verified by the probe

39 records from the live probe (`probe/`), client version `1.58.0`. Each row is one run against the instrumented fixture server with the model mocked; the verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/goose.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| [app_only](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.58.0/code-mode/both-stdio/tools.result.meta_only/record.json) | code-mode | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| [with_meta](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.58.0/code-mode/both-stdio/tools.result.with_meta/record.json) | code-mode | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "The tool call returned the following error:\n-32603: -32603: Unexpected response " |
| [empty_object](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "Error: -32603: -32603: Unexpected response type" |
| [large](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [large](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [no_content_key](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as blocks) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/goose@1.58.0/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.58.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 1.58.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | payload once (as json) |
| [sc_empty](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [structured_only](../probe/runs/goose@1.58.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [summary_and_data](../probe/runs/goose@1.58.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |

## Where the evidence disagrees

- **sampling** — recorded as `full`, but declared-tier evidence at `2025-03-26` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — No sampling key on the goose record.
- **elicitation** — recorded as `full`, but declared-tier evidence at `2025-03-26` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — No elicitation key on the goose record. Both form and URL mode are implemented.

## Research notes

- [goose only answers elicitation raised inside a tool call](../research/goose-elicitation-needs-tool-call-context.md) — *nuance*. create_elicitation resolves a session id and a tool-call request id from the request context and errors if either is missing, so an elicitation raised outside a tool call fails rather than prompting.
- [goose emits a roots notification that 2026-07-28 removed, and rmcp does not stop it](../research/goose-sends-removed-roots-notification.md) — *idiosyncrasy*. notify_roots_list_changed fires on every working-directory change with no version check, goose prefers 2026-07-28 where the notification no longer exists, and rmcp 3.1.4 gates nothing on the outbound notification path.
- [goose never sends the client name every registry lists it under](../research/goose-client-name-varies-by-surface.md) — *idiosyncrasy*. goose sends clientInfo.name as goose-desktop or goose-cli, not goose, and an embedder can override it entirely. The two surfaces also differ on MCP Apps support.
- [notes/goose-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/goose-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the goose source at 5bad61a.

## Provenance

Read at `c5e5929a` on 2026-08-23, from `main` of https://github.com/aaif-goose/goose.git. That commit was authored 2026-08-23.

**SDK.** The workspace declares rmcp "3.0.0" as a caret requirement and the lockfile resolves it to 3.1.4, so behavioural claims cite 3.1.4. The lockfile also holds rmcp 1.8.0, pulled in by the pctx_code_execution_runtime, pctx_config and pctx_registry crates; that copy is unrelated to goose's own MCP client. [patch.crates-io] exists but covers agent-client-protocol, v8 and cudaforge, not rmcp. goose names ProtocolVersion::V_2026_07_28 itself rather than inheriting a version from rmcp, using rmcp's ProtocolVersion::LATEST only as the legacy fallback.

Paths read:

- `crates/goose/src/agents/mcp_client.rs`
- `crates/goose/src/agents/extension_manager.rs`
- `crates/goose/src/agents/agent.rs`

Source is not vendored. Client source is read from the shared `_clients` checkout (see `AGENTS.md`); check out that commit there to reproduce any claim above.

---

Generated from `data/clients.json`, `data/verified/goose.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

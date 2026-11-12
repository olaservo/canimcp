# Codex CLI

OpenAI's coding agent, shipping as a CLI and an app-server. Rust, using rmcp 3.1.3 as its MCP client through a codex-rmcp-client wrapper crate. Codex also runs as an MCP server, which is a separate code path and not described here.

## At a glance

| | |
|---|---|
| Registry id | `openai-codex` |
| Vendor | OpenAI |
| Category | cli |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/openai/codex> |
| Home | <https://openai.com/codex> |
| Wire names | `codex-mcp-client` |
| SDK | `rmcp` 3.1.3 · declares `=3.1.3` · official Rust SDK · unpatched |
| Prefers | `2025-06-18` |
| Speaks | `2025-06-18`, `2026-07-28` |
| Source last updated | 2026-08-24 |
| Last read | 2026-08-24 |
| Probed | `0.169.0-alpha.3` (see below) |
| In traffic | evalstate/mcp-clients, window ending 2026-11-08 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-06-18` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2025-06-18` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read, declared | `2025-06-18` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-06-18` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-06-18` |
| **Tools** | ● full | read, declared | `2025-06-18` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2025-06-18` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-06-18` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2025-06-18` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ◐ partial | read ⇧ | `2025-06-18` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2025-06-18` |
| **Resources** | ● full | read | `2025-06-18` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read ⇧ | `2025-06-18` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read ⇧ | `2025-06-18` |
| **Prompts** | ○ unsupported | read | `2025-06-18` |
| **Completions** | ○ unsupported | read | `2025-06-18` |
| **Sampling** | ○ unsupported | read | `2025-06-18` |
| **Elicitation** | ● full | read, declared | `2025-06-18` |
| &nbsp;&nbsp;↳ form | ● full | read, declared ⇧ | `2025-06-18` |
| &nbsp;&nbsp;↳ url | ● full | read, declared ⇧ | `2025-06-18` |
| **Roots** | ○ unsupported | read | `2025-06-18` |
| **Logging** | ◐ partial | read | `2026-07-28` |
| **Instructions** | ● full | read | `2025-06-18` |
| **Icons** | ◐ partial | read | `2025-06-18` |
| **Tasks** | ○ unsupported | read | `2026-07-28` |
| JSON Schema | — not recorded | | |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ openai/form | ◐ partial | read | `2025-06-18` |
| &nbsp;&nbsp;↳ openai/standard-form-input | ◐ partial | read | `2025-06-18` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read | `2025-06-18` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2025-06-18` |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — Three stdio paths: a local child process, an in-process transport, and an executor process transport for sandboxed and remote environments.
- **transports.sse** — rmcp is built without transport-sse-client. Only transport-child-process, transport-async-rw and the streamable HTTP client and server are enabled.
- **transports.streamableHttp** — Carries OAuth, a bearer token, or neither, with session-expiry retry on 404 and a configurable redirect policy.
- **authentication.oauth** — Prefers CIMD over DCR when the authorization server advertises it, using a ChatGPT-hosted client identifier. PKCE and the token exchange are rmcp's AuthorizationManager and were not read at this commit.
- **authentication.header** — Per-server http_headers, env_http_headers, bearer_token_env_var, and an http_headers_helper command whose stdout supplies headers.
- **tools** — In the shipped default mode nextCursor from tools/list is discarded, so only the first page of a server's tool catalog is read.
- **tools.listChanged** — The notification is received and written to the tracing log. Nothing re-lists, so a tool added mid-session is not picked up.
- **tools.result** — structuredContent replaces content. Every payload is prefixed with a Wall time header.
- **tools.result.structuredContent** — Serialized compact JSON of structuredContent is the whole tool output whenever it is non-null, including {}.
- **tools.result.content** — Dropped whenever structuredContent is non-null. Reaches the model only when structuredContent is absent or null, or when a block carries the private _meta key codex/encryptedContent.
- **tools.result.audience** — convert_mcp_content_to_items reads text, data, mimeType and _meta only, so annotations.audience is not read on the model path.
- **resources** — list, templates and read are all implemented, and all three are exposed to the model as built-in tools rather than through a host-side picker.
- **resources.listChanged** — Received and logged only, like tools/list_changed.
- **resources.subscribe** — No resources/subscribe call. resources/updated notifications are logged if they arrive.
- **prompts** — No prompts/list or prompts/get on the client path. The handlers by those names live in codex-rs/mcp-server, where Codex is the server.
- **sampling** — Not in the declared capabilities and no create_message handler. The word appears in the codebase only for Codex's own model calls.
- **elicitation** — The only capability Codex declares by default. Form and URL modes are added when the auth_elicitation feature is on, which is stable and default-enabled; without it an empty elicitation object is declared.
- **roots** — Not in the declared capabilities and no list_roots handler, so a server cannot learn the working directory this way. ready_selected_capability_roots in the same crates is a Codex-internal concept, unrelated to MCP roots.
- **logging** — notifications/message is mapped onto tracing levels and written to Codex's own log, not shown in the UI. logging/setLevel is never sent, and neither is the io.modelcontextprotocol/logLevel _meta key that replaces it, so on a 2026-07-28 session a conforming server sends nothing and the handler is unreachable.
- **instructions** — Server instructions are read from the initialize result and attached to each of that server's tools when the catalog is built.
- **icons** — Server icons are parsed from the initialize result and carried into McpServerInfo. No rendering path was found in the crates read, and tool-level icons are not handled.
- **tasks** — No tasks/* calls at this commit.
- **extensions.openai/form** — A vendor elicitation extension. An openai/form request carries message and requestedSchema and is routed into the same elicitation path as elicitation/create. Declared only when the app-server host asks for it, or when the legacy form-elicitation flag is set.
- **extensions.openai/standard-form-input** — Client-only extension, never projected to downstream servers.
- **extensions.io.modelcontextprotocol/ui** — Forwarded to servers only when the app-server host declares it. Codex keeps just the three extension namespaces it knows and drops anything else the host declares.
- **bonusFeatures.modelInitiatedResourceRead** — list_mcp_resources, list_mcp_resource_templates and read_mcp_resource are registered as built-in tools whenever any MCP server is configured, with no feature gate. Pagination cursors are passed to and from the model.

## Verified by the probe

38 records from the live probe (`probe/`), client version `0.169.0-alpha.3`. Each row is one run against the instrumented fixture server with the model mocked; the verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/codex.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.app_only/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | tool not offered to the model |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-http/tools.result.meta_only/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.169.0-alpha.3 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-http/tools.result.with_meta/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.audience_user/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0053 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.empty_object/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0042 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [large](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.large/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.is_error/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.with_image/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.schema_match/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/codex@0.169.0-alpha.3/default/both-http/tools.result.mirror/record.json) | default | http | `2025-06-18` | 0.169.0-alpha.3 | payload once (as json) |
| [mirror](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | payload once (as json) |
| [mirror](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.mirror/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | payload once (as json) |
| [sc_empty](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "Wall time: 0.0133 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "Wall time: 0.0117 seconds\nOutput:\n{}" |
| [sc_null](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.sc_null/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | […] content only (1x, as text) |
| [sc_string](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.sc_string/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/codex@0.169.0-alpha.3/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.structured_only/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-http/tools.result.summary_and_data/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |

## Observed in traffic

From `evalstate/mcp-clients` at [`c30d6f28`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/c30d6f2859b699fe9f36e674e4722bfd2d8a1258/reports/dashboard-v1.json), report generated 2026-11-09, window 2026-09-10 to 2026-11-08. Grouped as `codex-cli` from wire names `codex-mcp-client`. Tool calls by revision over the 30 days to 2026-11-08: `2026-07-28` <0.1%, `2025-06-18` 100%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| apps | ● full | `2026-07-28` | ◐ partial ≠ | More than 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 0.011% of this client's tool calls over the 30 days to 2026-11-08, so the sample is small. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 0.011% of this client's tool calls over the 30 days to 2026-11-08, so the sample is small. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Where the evidence disagrees

- **transports.streamableHttp** — recorded as `full`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — Records stdio only. Streamable HTTP with OAuth is a large part of the client crate.

## Research notes

- [Codex takes CIMD over DCR, with a client identifier hosted on chatgpt.com](../research/codex-prefers-a-chatgpt-hosted-client-identifier.md) — *idiosyncrasy*. When an authorization server advertises client_id_metadata_document_supported and accepts public clients, Codex registers with an HTTPS client identifier under chatgpt.com keyed by the ephemeral loopback callback id, and only falls back to Dynamic Client Registration otherwise.
- [Codex discards the tools/list cursor unless the 2026-07-28 mode is on](../research/codex-reads-one-page-of-tools.md) — *idiosyncrasy*. The paginator that collects a server's tool catalog is fed a nextCursor of None whenever Codex is in its default protocol mode, so it stops after the first page. No warning is emitted and the truncated catalog looks complete.
- [goose emits a roots notification that 2026-07-28 removed, and rmcp does not stop it](../research/goose-sends-removed-roots-notification.md) — *idiosyncrasy*. notify_roots_list_changed fires on every working-directory change with no version check, goose prefers 2026-07-28 where the notification no longer exists, and rmcp 3.1.4 gates nothing on the outbound notification path.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [Codex ships preferring 2025-06-18 and has never spoken 2025-11-25](../research/codex-defaults-to-2025-06-18.md) — *idiosyncrasy*. Codex's default protocol mode pins initialize to 2025-06-18. The alternative mode goes straight to 2026-07-28 and sits behind an under-development feature flag that is off by default, so 2025-11-25 is not a version Codex ever offers.
- [notes/codex-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/codex-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Codex CLI source at 748ab55.

## Provenance

Read at `b705b6b0` on 2026-08-24, from `main` of https://github.com/openai/codex.git. That commit was authored 2026-08-24.

**SDK.** Pinned exactly with '=', so the declared requirement and the resolved version agree. codex-rs/patches/ holds twenty-odd build-toolchain patches (v8, llvm, windows link flags) and none touch rmcp, and the [patch.crates-io] rmcp override is commented out as a local-debug escape hatch. Codex selects 2025-06-18 through its own protocol mode rather than inheriting a version from rmcp.

Paths read:

- `codex-rs/rmcp-client/src`
- `codex-rs/codex-mcp/src`
- `codex-rs/core/src/tools/handlers/mcp_resource`
- `codex-rs/core/src/config/mod.rs`
- `codex-rs/features/src/lib.rs`

Source is not vendored. Client source is read from the shared `_clients` checkout (see `AGENTS.md`); check out that commit there to reproduce any claim above.

---

Generated from `data/clients.json`, `data/verified/codex.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

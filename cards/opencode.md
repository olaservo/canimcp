# opencode

Open-source terminal coding agent, TypeScript on the official MCP TypeScript SDK. Ships a patched copy of SDK 1.29.0, so its transport behaviour is not stock.

## At a glance

| | |
|---|---|
| Registry id | `opencode` |
| Vendor | Anomaly |
| Category | cli |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/anomalyco/opencode> |
| Home | <https://opencode.ai> |
| Wire names | `opencode` |
| SDK | `@modelcontextprotocol/sdk` 1.29.0 · official TypeScript SDK · **patched** · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Source last updated | 2026-08-24 |
| Last read | 2026-08-24 |
| Probed | `0.0.0-a98e3fa`, `2.2.6` (see below) |
| In traffic | evalstate/mcp-clients, window ending 2026-11-08 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2025-11-25` |
| **Resources** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| **Roots** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
| **Logging** | ◐ partial | read | `2025-11-25` |
| **Instructions** | ● full | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| **Tasks** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
| Extensions | — not recorded | | |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ patchedSdkSessionRecovery | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.sse** — Tried as a fallback when Streamable HTTP fails to connect, against the same URL. A remote server is configured by URL alone, with no transport field to choose between them.
- **transports.streamableHttp** — Tried first for every remote server.
- **authentication.oauth** — Dynamic Client Registration is the default path; a clientId can be pinned in config instead. token_endpoint_auth_method is none unless a clientSecret is configured. The callback is a loopback server on port 19876 by default.
- **authentication.header** — A headers map on a remote server is passed through as requestInit headers on both transports.
- **tools** — tools/list is only called when the server declares a tools capability. Fully paginated, with a duplicate-cursor guard and a 1000-page cap. A tool result carrying only structuredContent is stringified into a text block before it reaches the model.
- **tools.listChanged** — Re-lists the catalog and publishes a ToolsChanged event, so a changed catalog is picked up mid-session. The handler is registered only when the server declared tools.
- **tools.result** — Code Mode is the default route: MCP tools are reachable only through the execute script tool, scripts receive structuredContent, and the model sees the script return value. The direct path applies with codemode: false.
- **tools.result.content** — On the direct path (codemode: false, or execute wholly denied) the content blocks reach the model; media blocks become data URIs or saved-file notes.
- **tools.result.structuredContent** — On the direct path it fills in as one text block of JSON.stringify(structuredContent) only when content is empty, and is otherwise held in a tool output field that is not persisted. On the default Code Mode route scripts receive it directly.
- **resources** — Exposed to the model as three built-in tools rather than a host-side picker, each behind a permission ask. Registered only when some connected server declares resources. A user can also attach a resource to a message directly.
- **resources.listChanged** — No resources/list_changed handler is registered.
- **resources.subscribe** — No resources/subscribe call and no resources/updated handler.
- **prompts** — Every server prompt becomes a slash command. Only text content survives: a prompt message carrying an image or an embedded resource maps to an empty string and is joined into the template. Arguments are filled positionally as $1, $2 regardless of their names.
- **prompts.listChanged** — No prompts/list_changed handler is registered.
- **completions** — No completion/complete call at this commit.
- **sampling** — Present in the capability object but commented out, against issue 11948. The client never declares it, so a server cannot ask.
- **elicitation** — Commented out against issue 23066.
- **roots** — The only capability opencode declares. list_roots returns exactly one root, the file URL of the instance directory.
- **roots.listChanged** — Declared as a bare roots:{} with no listChanged, and nothing sends notifications/roots/list_changed. The single root is fixed at client creation.
- **logging** — Receives notifications/message and routes them to the server log. Never calls logging/setLevel, so the level is whatever the server defaults to.
- **instructions** — Server instructions are trimmed and carried per server.
- **icons** — No icon handling anywhere in the client.
- **tasks** — Commented out against issue 28567, though SDK 1.29.0 carries an experimental tasks client.
- **bonusFeatures.modelInitiatedResourceRead** — list_mcp_resources, list_mcp_resource_templates and read_mcp_resource - the same three tool names Codex uses, arrived at independently on a different SDK and language. Each is permission-gated; blobs are capped at 10MB.
- **bonusFeatures.patchedSdkSessionRecovery** — opencode patches SDK 1.29.0 so a 404 on a request carrying a session id clears the session, fires onsessionexpired and retries once. Stock 1.29.0 has no recovery path. The patch also treats a JSON-RPC error over SSE as a response, and stops a stale session id from overwriting a newer one.

## Verified by the probe

170 records from the live probe (`probe/`), client versions `0.0.0-a98e3fa`, `2.2.6`. Each row is one run against the instrumented fixture server with the model mocked; the verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/opencode.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@2.2.6/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.app_only/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.app_only/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.app_only/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.app_only/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.app_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.app_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.meta_only/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.meta_only/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.meta_only/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.meta_only/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.meta_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.meta_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.with_meta/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.with_meta/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.with_meta/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.with_meta/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.with_meta/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.with_meta/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@2.2.6/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.audience_user/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.audience_user/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.audience_user/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.audience_user/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.audience_user/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.audience_user/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.empty_object/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.empty_object/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.empty_object/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.empty_object/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.empty_object/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [empty_object](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.empty_object/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.large/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.large/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.large/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.large/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.large/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.large/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.no_content_key/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.no_content_key/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.no_content_key/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.no_content_key/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [no_content_key](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@2.2.6/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.is_error/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.is_error/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.is_error/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.is_error/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.is_error/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.is_error/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@2.2.6/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.with_image/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.with_image/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.with_image/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.with_image/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.with_image/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.with_image/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@2.2.6/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.schema_match/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.schema_match/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.schema_match/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.schema_match/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.schema_match/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.schema_match/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_schema_mismatch\" on server \"probe\" failed: Structured content do" |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_schema_mismatch\" on server \"probe\" failed: Structured content do" |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.schema_mismatch/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.schema_mismatch/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_schema_mismatch\\\" " |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.schema_mismatch/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.schema_mismatch/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_schema_mismatch\\\" " |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_schema_mismatch\\\" " |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.mirror/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.mirror/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.mirror/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.mirror/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.mirror/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.mirror/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | payload once (as json) |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@2.2.6/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.sc_empty/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.sc_empty/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.sc_empty/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.sc_empty/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@2.2.6/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.sc_null/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.sc_null/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.sc_null/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.sc_null/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.sc_null/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.sc_null/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@2.2.6/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.sc_string/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.sc_string/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.sc_string/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.sc_string/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.sc_string/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.sc_string/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.structured_only/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.structured_only/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.structured_only/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.structured_only/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.structured_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.structured_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@2.2.6/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.summary_and_data/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.summary_and_data/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.summary_and_data/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.summary_and_data/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |

## Observed in traffic

From `evalstate/mcp-clients` at [`c30d6f28`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/c30d6f2859b699fe9f36e674e4722bfd2d8a1258/reports/dashboard-v1.json), report generated 2026-11-09, window 2026-09-10 to 2026-11-08. Grouped as `opencode` from wire names `opencode`. Tool calls by revision over the 30 days to 2026-11-08: `2026-07-28` <0.1%, `2025-11-25` 99.9%, `2025-03-26` <0.1%, `2024-11-05` <0.1%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | `2026-07-28` | ○ unsupported ≠ | More than 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 0.044% of this client's tool calls over the 30 days to 2026-11-08, so the sample is small. |
| elicitation.url | ● full | `2026-07-28` | — not recorded | More than 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 0.044% of this client's tool calls over the 30 days to 2026-11-08, so the sample is small. |
| apps | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. 2026-07-28 is 0.044% of this client's tool calls over the 30 days to 2026-11-08, so the sample is small. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 0.044% of this client's tool calls over the 30 days to 2026-11-08, so the sample is small. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Where the evidence disagrees

- **transports.sse** — recorded as `full`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — Records stdio only, at 2025-06-18, on platform "web". opencode is a terminal agent on the three desktop platforms and negotiates 2025-11-25, and every remote server it connects to uses Streamable HTTP or SSE.
- **transports.streamableHttp** — recorded as `full`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — Records stdio only, at 2025-06-18, on platform "web". opencode is a terminal agent on the three desktop platforms and negotiates 2025-11-25, and every remote server it connects to uses Streamable HTTP or SSE.

## Research notes

- [opencode retries tools/list with outputSchema stripped when the SDK rejects one](../research/opencode-retries-tools-list-without-output-schema.md) — *idiosyncrasy*. If the SDK's validation of a tools/list result fails in a way that looks schema-related, opencode re-requests the page against a result schema with outputSchema omitted. The match is a regex over the error message, so the fallback both misses and over-fires.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [opencode keeps only the text parts of an MCP prompt, and fills arguments positionally](../research/opencode-drops-non-text-prompt-content.md) — *nuance*. Server prompts become slash commands, but a prompt message carrying an image or an embedded resource maps to an empty string and is joined into the template. Named arguments are also replaced positionally, so argument order decides the result.
- [opencode declares roots and nothing else, with sampling, elicitation and tasks commented out](../research/opencode-declares-only-roots.md) — *idiosyncrasy*. The client capability object lists sampling, elicitation and tasks, each commented out above a link to the issue tracking it. Only roots is live, so a server that offers any of the other three never gets asked.
- [opencode ships a patched MCP SDK that recovers an expired HTTP session](../research/opencode-patches-its-sdk-for-session-recovery.md) — *idiosyncrasy*. opencode applies a bun patch to @modelcontextprotocol/sdk 1.29.0 that clears the session and retries once when a request carrying a session id gets a 404. Stock 1.29.0 has no recovery path, so opencode's Streamable HTTP behaviour is not the SDK's.
- [notes/opencode-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/opencode-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the opencode source at a98e3fa.

## Provenance

Read at `7cde8329` on 2026-08-24, from `dev` of https://github.com/anomalyco/opencode.git. That commit was authored 2026-08-24.

**SDK.** Pinned exactly, then patched. bun.lock registers a patch against the resolved package that changes four runtime files - client/index.js, client/streamableHttp.js, client/auth.js and shared/protocol.js - so the published 1.29.0 does not describe what runs. The SDK is also where opencode's protocol version comes from: 1.29.0 pins LATEST_PROTOCOL_VERSION at 2025-11-25 and lists support back to 2024-10-07, a revision this registry does not track because it was never published.

Paths read:

- `packages/opencode/src/mcp/index.ts`
- `packages/opencode/src/mcp/catalog.ts`
- `packages/opencode/src/mcp/oauth-provider.ts`
- `packages/opencode/src/session/tools.ts`
- `packages/opencode/src/command/index.ts`
- `packages/core/src/v1/config/mcp.ts`
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch`

Source is not vendored. Client source is read from the shared `_clients` checkout (see `AGENTS.md`); check out that commit there to reproduce any claim above.

---

Generated from `data/clients.json`, `data/verified/opencode.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

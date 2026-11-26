# Codex CLI

OpenAI's coding agent, shipping as a CLI and an app-server. Rust, using rmcp 3.6.0 as its MCP client through a codex-rmcp-client wrapper crate. Codex also runs as an MCP server, which is a separate code path and not described here.

## At a glance

| | |
|---|---|
| Registry id | `openai-codex` |
| Vendor | OpenAI |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | cli |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/openai/codex> |
| Home | <https://openai.com/codex> |
| Wire names | `codex-mcp-client` |
| SDK | `rmcp` 3.6.0 · declares `=3.6.0 (git rev b11a40d8)` · official Rust SDK · unpatched |
| Prefers | `2025-06-18` |
| Speaks | `2025-06-18`, `2026-07-28` |
| Source last updated | 2026-11-20 |
| Last read | 2026-11-20 |
| Probed | `0.174.0-alpha.7` (see below) |
| In traffic | evalstate/mcp-clients, window ending 2026-11-08 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-06-18`, `2026-07-28` |
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
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2025-06-18` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-06-18` |
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
| &nbsp;&nbsp;↳ openai/elicitation | ◐ partial | read | `2025-06-18` |
| &nbsp;&nbsp;↳ openai/standard-form-input | ◐ partial | read | `2025-06-18` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read | `2025-06-18` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2025-06-18` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — Three stdio paths: a local child process, an in-process transport, and an executor process transport for sandboxed and remote environments. From ac784eb1 (in 0.173.0-alpha.1) a default install probes an eligible local stdio server with server/discover at 2026-07-28 first and falls back to initialize at 2025-06-18.
- **transports.sse** — rmcp 3.6.0 has no standalone SSE client feature. Codex enables transport-child-process, transport-async-rw and the streamable HTTP client and server, and its config has only stdio and streamable HTTP transports.
- **transports.streamableHttp** — Carries OAuth, a bearer token, or neither, with session-expiry retry on 404 and a configurable redirect policy.
- **authentication.oauth** — Prefers CIMD over DCR when the authorization server advertises it, using a ChatGPT-hosted client identifier. When the server also advertises authorization_response_iss_parameter_supported and names an issuer, the identifier is one shared document, https://chatgpt.com/oauth/codex/client.json. A per-server oauth.client_id and client_secret can be configured instead. PKCE and the token exchange are rmcp's AuthorizationManager and were not read at this commit.
- **authentication.header** — Per-server http_headers, env_http_headers, bearer_token_env_var, and an http_headers_helper command whose stdout supplies headers.
- **tools** — tools/list is paginated to the end in every protocol mode, capped at 100 pages and 2,048 tools per server. Before cc31e374 (first stable release 0.162.0) the default mode discarded nextCursor and read one page.
- **tools.listChanged** — The notification is received, written to the tracing log and counted per connection. A default install does not re-list, so a tool added mid-session is not picked up. The mcp_tool_list_changed flag, under development and off, re-lists after a notification.
- **tools.result** — structuredContent replaces content. Every payload is prefixed with a Wall time header.
- **tools.result.structuredContent** — Serialized compact JSON of structuredContent is the whole tool output whenever it is non-null, including {}.
- **tools.result.content** — Dropped whenever structuredContent is non-null. Reaches the model only when structuredContent is absent or null, or when a block carries the private _meta key codex/encryptedContent.
- **tools.result.audience** — convert_mcp_content_to_items reads text, data, mimeType and _meta only, so annotations.audience is not read on the model path.
- **resources** — list, templates and read are all implemented, and all three are exposed to the model as built-in tools rather than through a host-side picker.
- **resources.listChanged** — Received and logged only, like tools/list_changed.
- **resources.subscribe** — No resources/subscribe call. resources/updated notifications are logged if they arrive.
- **prompts** — No prompts/list or prompts/get on the client path. The handlers by those names live in codex-rs/mcp-server, where Codex is the server.
- **sampling** — Not in the declared capabilities and no create_message handler. The word appears in the codebase only for Codex's own model calls.
- **elicitation** — The only standard capability Codex declares by default. Form and URL modes are added when the auth_elicitation feature is on, which is stable and default-enabled; without it an empty elicitation object is declared. On stdio connections Codex also declares the vendor keys experimental["codex/auth-change"] and, for a pooled local stdio connection, extensions["codex/connection-lease"].
- **roots** — Not in the declared capabilities and no list_roots handler, so a server cannot learn the working directory this way. ready_selected_capability_roots in the same crates is a Codex-internal concept, unrelated to MCP roots.
- **logging** — notifications/message is mapped onto tracing levels and written to Codex's own log, not shown in the UI. logging/setLevel is never sent, and neither is the io.modelcontextprotocol/logLevel _meta key that replaces it, so on a 2026-07-28 session a conforming server sends nothing and the handler is unreachable.
- **instructions** — Server instructions are read from the initialize result and attached to each of that server's tools when the catalog is built.
- **icons** — Server icons are parsed from the initialize result and carried into McpServerInfo. No rendering path was found in the crates read, and tool-level icons are not handled.
- **tasks** — No tasks/* calls at this commit.
- **extensions.openai/form** — A vendor elicitation extension. An openai/form request carries message and requestedSchema and is routed into the same elicitation path as elicitation/create. Declared only when the app-server host asks for it, or when the legacy form-elicitation flag is set.
- **extensions.openai/elicitation** — A vendor elicitation extension. Method openai/elicitation/create with form and userVerification modes. Declared only when the app-server host declares it; the TUI and codex exec declare none of the four extensions. userVerification is stripped for every server except the host-owned Apps server.
- **extensions.openai/standard-form-input** — Client-only extension, never projected to downstream servers.
- **extensions.io.modelcontextprotocol/ui** — Forwarded to servers only when the app-server host declares it. Codex keeps just the four extension namespaces it knows and drops anything else the host declares.
- **bonusFeatures.modelInitiatedResourceRead** — list_mcp_resources, list_mcp_resource_templates and read_mcp_resource are registered as built-in tools whenever any MCP server is configured, with no feature gate. Pagination cursors are passed to and from the model.

## Verified by the probe

154 records from the live probe (`probe/`), client version `0.174.0-alpha.7`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/codex.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.app_only/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.app_only/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.app_only/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.app_only/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.app_only/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.app_only/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.app_only/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | tool not offered to the model |
| **protocol.initializeHandshake** | | | | | |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/default/both-http/protocol.initializeHandshake.echo/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | initialize at 2025-06-18 → 2025-06-18; client continued at 2025-06-18 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/protocol.initializeHandshake.echo/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/protocol.initializeHandshake.echo/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/legacy-http/protocol.initializeHandshake.echo/record.json) | mcp-2026-07-28 | http legacy | `2025-06-18` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → error -32022; then initialize at 2025-06-18 → 2025-06-18; client continued at 2025-06-18 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/protocol.initializeHandshake.echo/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/protocol.initializeHandshake.echo/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/legacy-stdio/protocol.initializeHandshake.echo/record.json) | mcp-2026-07-28-stdio-opt-in | stdio legacy | ? | 0.174.0-alpha.7 | server/discover at 2026-07-28 → error -32022; client sent nothing further |
| [protocol.initializeHandshake.echo](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/protocol.initializeHandshake.echo/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/codex@0.174.0-alpha.7/default/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | http | `2024-11-05` | 0.174.0-alpha.7 | initialize at 2025-06-18 → 2024-11-05; client continued at 2024-11-05 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/codex@0.174.0-alpha.7/default/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | http | `2025-11-25` | 0.174.0-alpha.7 | initialize at 2025-06-18 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/codex@0.174.0-alpha.7/default/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | http | `2026-07-28` | 0.174.0-alpha.7 | initialize at 2025-06-18 → 2026-07-28; client continued at 2026-07-28 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| **protocol.serverDiscover** | | | | | |
| [protocol.serverDiscover.method_not_found](../probe/runs/codex@0.174.0-alpha.7/default/both-http/protocol.serverDiscover.method_not_found/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | initialize at 2025-06-18 → 2025-06-18; client continued at 2025-06-18 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/protocol.serverDiscover.method_not_found/record.json) | default | stdio | `2025-06-18` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-06-18 → 2025-06-18; client continued at 2025-06-18 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/protocol.serverDiscover.method_not_found/record.json) | mcp-2026-07-28 | http | `2025-06-18` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-06-18 → 2025-06-18; client continued at 2025-06-18 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/protocol.serverDiscover.method_not_found/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2025-06-18` | 0.174.0-alpha.7 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-06-18 → 2025-06-18; client continued at 2025-06-18 (notifications/initialized, tools/list, tools/call) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.meta_only/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.meta_only/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.meta_only/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.meta_only/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.meta_only/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.meta_only/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.with_meta/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.with_meta/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.with_meta/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.with_meta/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.with_meta/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.with_meta/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.audience_user/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.audience_user/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.audience_user/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.audience_user/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.audience_user/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.audience_user/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0442 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0249 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.empty_object/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0306 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.empty_object/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0262 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.empty_object/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0354 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.empty_object/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0211 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.empty_object/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0322 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.empty_object/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0269 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [large](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.large/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.large/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.large/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.large/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.large/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.large/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.large/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.no_content_key/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.no_content_key/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.no_content_key/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.no_content_key/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.no_content_key/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.is_error/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.is_error/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.is_error/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.is_error/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.is_error/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.is_error/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.is_error/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.with_image/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.with_image/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.with_image/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.with_image/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.with_image/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.with_image/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.with_image/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.schema_match/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.schema_match/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.schema_match/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.schema_match/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.schema_match/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.schema_match/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.schema_mismatch/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.schema_mismatch/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.schema_mismatch/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.schema_mismatch/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.schema_mismatch/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.mirror/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | payload once (as json) |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | payload once (as json) |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.mirror/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | payload once (as json) |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.mirror/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | payload once (as json) |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.mirror/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | payload once (as json) |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.mirror/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | payload once (as json) |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.mirror/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | payload once (as json) |
| [mirror](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.mirror/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | payload once (as json) |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0578 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0257 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.sc_empty/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0327 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0239 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.sc_empty/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0338 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.sc_empty/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0306 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.sc_empty/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0299 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.sc_empty/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | "…" no marker reached the model; payload: "Wall time: 0.0255 seconds\nOutput:\n{}" |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.sc_null/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.sc_null/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.sc_null/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.sc_null/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.sc_null/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.sc_null/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | […] content only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.sc_string/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.sc_string/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.sc_string/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.sc_string/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.sc_string/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.sc_string/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.structured_only/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.structured_only/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.structured_only/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.structured_only/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.structured_only/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.structured_only/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-http/tools.result.summary_and_data/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | mcp-2026-07-28 | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-http/tools.result.summary_and_data/record.json) | mcp-2026-07-28-stdio-opt-in | http | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/mcp-2026-07-28-stdio-opt-in/both-stdio/tools.result.summary_and_data/record.json) | mcp-2026-07-28-stdio-opt-in | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-http/tools.result.summary_and_data/record.json) | stdio-opt-in-no-flag | http | `2025-06-18` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.174.0-alpha.7/stdio-opt-in-no-flag/both-stdio/tools.result.summary_and_data/record.json) | stdio-opt-in-no-flag | stdio | `2026-07-28` | 0.174.0-alpha.7 | {…} structuredContent only (1x, as json) |

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

- [Codex proposes 2025-06-18 and accepts whatever version the server returns](../research/codex-defaults-to-2025-06-18.md) — *idiosyncrasy*. Codex's initialize names 2025-06-18 and the reply's version is not checked, so a server that answers 2025-11-25 still gets a session. From 0.173.0-alpha.1 a default install first sends server/discover at 2026-07-28 to a local stdio server. Over HTTP that needs a flag.
- [Codex takes CIMD over DCR, with a client identifier hosted on chatgpt.com](../research/codex-prefers-a-chatgpt-hosted-client-identifier.md) — *idiosyncrasy*. When an authorization server advertises client_id_metadata_document_supported and accepts public clients, Codex registers with an HTTPS client identifier under chatgpt.com, shared or keyed by a per-server callback id, and only falls back to Dynamic Client Registration otherwise.
- [goose emits a roots notification that 2026-07-28 removed, and rmcp does not stop it](../research/goose-sends-removed-roots-notification.md) — *idiosyncrasy*. notify_roots_list_changed fires on every working-directory change with no version check, goose prefers 2026-07-28 where the notification no longer exists, and rmcp 3.1.4 gates nothing on the outbound notification path.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [notes/codex-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/codex-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Codex CLI source at 748ab55.

## Provenance

Read at `2fb728da` on 2026-11-20, from `main` of https://github.com/openai/codex.git. That commit was authored 2026-11-20.

**SDK.** A git dependency on upstream modelcontextprotocol/rust-sdk at rev b11a40d8, three commits after the rmcp-v3.6.0 tag, with version pinned '=3.6.0'. The lockfile resolves the same rev. patches/ at the repo root holds 32 build-toolchain and native-dependency patches and none touch rmcp, and the [patch.crates-io] rmcp override is commented out as a local-debug escape hatch. Codex selects its protocol version through its own protocol mode and does not inherit one from rmcp.

Paths read:

- `codex-rs/rmcp-client/src`
- `codex-rs/codex-mcp/src`
- `codex-rs/core/src/tools/handlers/mcp_resource`
- `codex-rs/core/src/config/mod.rs`
- `codex-rs/features/src/lib.rs`
- `codex-rs/core/src/tools/spec_plan.rs`
- `codex-rs/config/src/mcp_types.rs`
- `codex-rs/protocol/src/mcp.rs`
- `codex-rs/Cargo.toml`
- `codex-rs/Cargo.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/codex.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

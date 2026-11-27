# opencode

Open-source terminal coding agent, TypeScript on the official MCP TypeScript SDK. Ships a patched copy of @modelcontextprotocol/client 2.4.0 and its own stdio transport, so its behaviour is not stock.

## At a glance

| | |
|---|---|
| Registry id | `opencode` |
| Vendor | Anomaly |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | cli |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/anomalyco/opencode> |
| Home | <https://opencode.ai> |
| Wire names | `opencode` |
| SDK | `@modelcontextprotocol/client` 2.4.0 · official TypeScript SDK · **patched** · pins `2026-07-28` |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-11-26 |
| Last read | 2026-11-26 |
| Probed | `0.0.0-82d8fc5` (see below) |
| In traffic | evalstate/mcp-clients, window ending 2026-11-25 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2025-11-25` |
| **Resources** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ● full | read ⇧ | `2026-07-28` |
| **Roots** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2025-11-25` |
| **Instructions** | ● full | read | `2025-11-25`, `2026-07-28` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sessionRecovery | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — opencode does not use the SDK's StdioClientTransport. It has its own stdio transport that spawns the server through the location's execution environment and hands it to the SDK Client. Frames are newline-delimited JSON with a 16 MiB cap on a single line. By default the SDK sends server/discover at 2026-07-28 on the same pipe, with a probe timeout of the lesser of 5 s and the startup timeout. A JSON-RPC error such as -32601, or a timeout, falls back to initialize at 2025-11-25 in place. A server that exits on the probe is respawned for a plain initialize.
- **transports.sse** — No SSE transport. A remote server is always opened with StreamableHTTPClientTransport, and nothing imports SSEClientTransport. At 7cde8329 SSE was tried as a fallback when Streamable HTTP failed to connect.
- **transports.streamableHttp** — The only remote transport. By default the configured URL is dialled with ?codemode=false appended, and retried once without it when the server answers 400 or 404. A transient connect failure (408, 429, 5xx other than 501, or a network error) is retried twice within the startup timeout. On close the client sends a DELETE for a session on the handshake era. By default the first request is server/discover at 2026-07-28. A JSON-RPC error answer falls back to initialize in place. A probe timeout or a 5xx answer reopens the transport for initialize within the startup deadline.
- **authentication.oauth** — A configured client_id wins. Otherwise opencode uses a Client ID Metadata Document at https://opencode.ai/oauth/opencode/client.json when the authorization server advertises client_id_metadata_document_supported and the none token auth method and no redirect_uri is configured, and falls back to Dynamic Client Registration. token_endpoint_auth_method is none unless a client_secret is configured, then client_secret_post. The callback is a loopback server on 127.0.0.1 at callback_port, else the redirect_uri port, else an ephemeral port. A connection never starts a login; it refreshes a stored token 30 seconds before expiry or after a 401. oauth: false turns OAuth off for a server.
- **authentication.header** — A headers map on a remote server is passed through as requestInit headers on the Streamable HTTP transport. The OAuth challenge probe sends them too.
- **tools** — tools/list is only called when the server declares a tools capability. Pagination is the SDK's: listTools walks every page with a 64-page cap and stops on a repeated cursor with identical items. The SDK is patched to leave listed tools unvalidated; opencode checks each one and skips a tool with no name or a non-object inputSchema. A tools/call carries _meta["ai.opencode/sessionID"] and a progress token. A transient list failure is retried twice. A tool result carrying only structuredContent is stringified into a text block before it reaches the model.
- **tools.listChanged** — Re-lists the catalog and publishes mcp.tools.changed, so a changed catalog is picked up mid-session. The notification arrives over the subscriptions/listen stream, which the SDK opens itself when the server declared tools.listChanged.
- **tools.result** — Code Mode is the default route: MCP tools are reachable only through the execute script tool, scripts receive structuredContent, and the model sees the script return value. The direct path applies with codemode: false.
- **tools.result.content** — On the direct path (codemode: false, or execute wholly denied) the content blocks reach the model; media blocks become data URIs or saved-file notes.
- **tools.result.structuredContent** — On the direct path it fills in as one text block of JSON.stringify(structuredContent) only when content is empty, and is otherwise held in a tool output field that is not persisted. On the default Code Mode route scripts receive it directly.
- **resources** — Exposed to the model as two built-in tools rather than a host-side picker, each behind a permission ask. The tools are registered whether or not any server declares resources. resources/list and resources/templates/list are sent only to a server that declared resources.
- **resources.listChanged** — A handler is registered through the SDK's listChanged option and republished as an mcp.resources.changed bus event. Nothing in core consumes the event, and opencode keeps no resource cache, so the model's list tool reads live on each call.
- **resources.subscribe** — No resources/subscribe call and no resources/updated handler.
- **prompts** — Every server prompt becomes a slash command named <server>:<prompt>. Only text content survives: a prompt message carrying an image or an embedded resource maps to an empty string and is joined into the text. Arguments are filled positionally: the words typed after the command are assigned to the declared arguments in order, regardless of their names.
- **prompts.listChanged** — The SDK handler re-lists prompts and publishes mcp.prompts.changed, and the command plugin reloads the slash commands.
- **completions** — No completion/complete call at this commit.
- **sampling** — Not declared, and no sampling/createMessage handler is registered. The commented-out key from the old client is gone.
- **elicitation** — Declared as elicitation: { form: {}, url: {} } on every connection; no flag gates it. A server asks in the result of the request that needs it, and the patched SDK routes the request to the handler that request brought. Form mode renders the requested schema as a form and returns accept with the answers or cancel. A schema with no properties is accepted with empty content without asking. decline is never returned.
- **elicitation.url** — Shows the URL as an external field and returns accept or cancel. There is no elicitationId and no notifications/elicitation/complete on this revision, so the form settles when the user confirms and the SDK retries the call.
- **roots** — roots is still declared and roots/list still answered, but 2026-07-28 deprecates roots and a server on that revision cannot request them.
- **roots.listChanged** — Declared as a bare roots:{} with no listChanged, and nothing sends notifications/roots/list_changed. The single root is fixed at client creation.
- **logging** — No notifications/message handler is registered and logging/setLevel is never called. Server stderr on stdio goes to the debug log, which is not MCP logging. At 7cde8329 the client received notifications/message and routed it to the server log.
- **instructions** — Server instructions are trimmed and carried per server, then rendered into an <mcp_instructions> block. A server's instructions are included only when the session can reach at least one of its tools. With the mcp_skills flag, which is off in release builds, a server that lists any non-dynamic skill has its instructions left out.
- **icons** — No icon handling. The tool type opencode keeps from tools/list drops icons.
- **bonusFeatures.modelInitiatedResourceRead** — Two tools, list_mcp_resources and read_mcp_resource, registered in the opencode namespace, so the effective names are opencode_list_mcp_resources and opencode_read_mcp_resource. The list tool returns resources and templates together, for one server or all. Each call is permission-gated. Image and PDF blobs are passed to the model as files.
- **bonusFeatures.sessionRecovery** — A 404, or a 400 with body "Bad Request: Server not initialized", on a connection that holds an Mcp-Session-Id is mapped to SessionExpiredError. opencode then reconnects and runs the request once more. This is opencode's own code; the SDK patch no longer contains it. Tool calls, prompt gets, resource reads and resource listing recover this way. At 7cde8329 the recovery was a patch to SDK 1.29.0, recorded here as patchedSdkSessionRecovery. It applies to the handshake era only: a 2026-07-28 connection carries no session id.
- **extensions.io.modelcontextprotocol/events** — Declared on every connection in both eras; the mcp_events flag is gone. Event methods are used only after negotiating 2026-07-28 with a server that advertises the extension. An automation can take an MCP event as its trigger, and the model gets opencode_list_mcp_events to find one. Both are registered unconditionally.
- **extensions.io.modelcontextprotocol/events.push** — events/stream with a resumable cursor. Event types are validated per type, x-mcp-header values are sent as Mcp-Param-* headers, and a heartbeat watchdog fails the stream after three missed heartbeats. The event list is kept current over subscriptions/listen.
- **extensions.io.modelcontextprotocol/events.poll** — No events/poll call. An event type that does not offer push is rejected, and the list tool leaves such types out.
- **extensions.io.modelcontextprotocol/events.webhook** — No events/subscribe call.
- **extensions.io.modelcontextprotocol/skills** — Declared only with the mcp_skills flag, which defaults on in local and dev builds and off in releases. For a server that advertises resources it uses the SDK's SkillsClient and registers each skill as <server>:<skill>.
- **extensions.io.modelcontextprotocol/tasks** — Not declared, and nothing in the client calls a tasks method. The commented-out key from the old client is gone.
- **byProtocolVersion.2025-11-25.roots** — Declared beside elicitation. roots/list returns exactly one root, the file URL of the location directory. A pooled connection shared across directories declares no roots and leaves roots/list unanswered.
- **byProtocolVersion.2025-11-25.elicitation** — The server sends elicitation/create as its own request.
- **byProtocolVersion.2025-11-25.elicitation.url** — notifications/elicitation/complete settles the form, matched by elicitationId.
- **byProtocolVersion.2025-11-25.tools.listChanged** — The server sends the notification unprompted. The SDK registers the handler only when the server declared tools.listChanged.

## Verified by the probe

146 records from the live probe (`probe/`), client version `0.0.0-82d8fc5`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/opencode.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.app_only/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.app_only/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.app_only/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.app_only/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.app_only/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.app_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| **protocol.initializeHandshake** | | | | | |
| [protocol.initializeHandshake.echo](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/protocol.initializeHandshake.echo/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/protocol.initializeHandshake.echo/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| **protocol.serverDiscover** | | | | | |
| [protocol.serverDiscover.method_not_found](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/protocol.serverDiscover.method_not_found/record.json) | default | http | `2025-11-25` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/protocol.serverDiscover.method_not_found/record.json) | default | stdio | `2025-11-25` | 0.0.0-82d8fc5 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.meta_only/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.meta_only/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.meta_only/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.meta_only/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.meta_only/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.meta_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.with_meta/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.with_meta/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.with_meta/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.with_meta/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.with_meta/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.with_meta/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.audience_user/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.audience_user/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.audience_user/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.audience_user/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.audience_user/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.audience_user/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "MCP tool \"probe_empty_object\" on server \"probe\" failed: Invalid result for tools" |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "MCP tool \"probe_empty_object\" on server \"probe\" failed: Invalid result for tools" |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.empty_object/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.empty_object/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.empty_object/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.empty_object/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.empty_object/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [empty_object](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.empty_object/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.large/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.large/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.large/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.large/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.large/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.large/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "MCP tool \"probe_no_content_key\" on server \"probe\" failed: Invalid result for too" |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "MCP tool \"probe_no_content_key\" on server \"probe\" failed: Invalid result for too" |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.no_content_key/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.no_content_key/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.no_content_key/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.no_content_key/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.no_content_key/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [no_content_key](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.is_error/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.is_error/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.is_error/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.is_error/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.is_error/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.is_error/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.with_image/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.with_image/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.with_image/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.with_image/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.with_image/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.with_image/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.schema_match/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.schema_match/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.schema_match/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.schema_match/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.schema_match/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.schema_match/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.schema_mismatch/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.schema_mismatch/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.schema_mismatch/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.schema_mismatch/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.schema_mismatch/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.mirror/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.mirror/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.mirror/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.mirror/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.mirror/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.mirror/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | payload once (as json) |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.sc_empty/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.sc_empty/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.sc_empty/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.sc_empty/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.sc_empty/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | "…" no marker reached the model; payload: "null" |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | "…" no marker reached the model; payload: "null" |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.sc_null/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.sc_null/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.sc_null/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.sc_null/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.sc_null/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.sc_null/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.sc_string/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.sc_string/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.sc_string/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.sc_string/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.sc_string/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.sc_string/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.structured_only/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.structured_only/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.structured_only/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.structured_only/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.structured_only/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.structured_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 0.0.0-82d8fc5 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-http/tools.result.summary_and_data/record.json) | codemode-off | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/codemode-off/both-stdio/tools.result.summary_and_data/record.json) | codemode-off | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-http/tools.result.summary_and_data/record.json) | execute-denied | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/execute-denied/both-stdio/tools.result.summary_and_data/record.json) | execute-denied | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-http/tools.result.summary_and_data/record.json) | protocol-2026-07-28 | http | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-82d8fc5/protocol-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-82d8fc5 | […] content only (1x, as text) |

## Observed in traffic

From `evalstate/mcp-clients` at [`904917c5`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/904917c5574ca3c830de12131ed318dec05ea179/reports/dashboard-v1.json), report generated 2026-11-26, window 2026-09-27 to 2026-11-25. Grouped as `opencode` from wire names `opencode`. Tool calls by revision over the 30 days to 2026-11-25: `2026-07-28` 2.5%, `2025-11-25` 97.5%, `2025-06-18` <0.1%, `2025-03-26` <0.1%, `2024-11-05` <0.1%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | `2026-07-28` | ● full | More than 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 2.5% of this client's tool calls over the 30 days to 2026-11-25, so the sample is small. |
| elicitation.url | ● full | `2026-07-28` | ● full | More than 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 2.5% of this client's tool calls over the 30 days to 2026-11-25, so the sample is small. |
| apps | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. 2026-07-28 is 2.5% of this client's tool calls over the 30 days to 2026-11-25, so the sample is small. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 2.5% of this client's tool calls over the 30 days to 2026-11-25, so the sample is small. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Where the evidence disagrees

- **transports.streamableHttp** — recorded as `full`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — Records stdio only, at 2025-06-18, on platform "web". opencode is a terminal agent on the three desktop platforms and negotiates 2025-11-25, and every remote server it connects to uses Streamable HTTP.

## Research notes

- [opencode patches SDK 2.4.0 to leave tools/list unchecked and checks each tool itself](../research/opencode-checks-listed-tools-itself-on-a-patched-sdk.md) — *idiosyncrasy*. opencode applies a bun patch to @modelcontextprotocol/client 2.4.0. The patch stops the SDK validating listed tools, so opencode checks each one and skips only the malformed ones. Session recovery on a 404 is in opencode's own code.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [opencode keeps only the text parts of an MCP prompt, and fills arguments positionally](../research/opencode-drops-non-text-prompt-content.md) — *nuance*. Server prompts become slash commands, but a prompt message carrying an image or an embedded resource maps to an empty string and is joined into the template. Named arguments are also replaced positionally, so argument order decides the result.
- [opencode ships a patched MCP SDK that recovers an expired HTTP session](../research/opencode-patches-its-sdk-for-session-recovery.md) — *idiosyncrasy*. opencode applies a bun patch to @modelcontextprotocol/sdk 1.29.0 that clears the session and retries once when a request carrying a session id gets a 404. Stock 1.29.0 has no recovery path, so opencode's Streamable HTTP behaviour is not the SDK's.
- [notes/opencode-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/opencode-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the opencode source at a98e3fa.

## Provenance

Read at `82d8fc5b` on 2026-11-26, from `dev` of https://github.com/anomalyco/opencode.git. That commit was authored 2026-11-26.

**SDK.** Pinned exactly, then patched. package.json and bun.lock register a patch against @modelcontextprotocol/client 2.4.0 only; core and server 2.4.0 are stock. The patch leaves tools/list results unvalidated so opencode can check each tool itself, relaxes outputSchema, passes an input-required request's options to the elicitation handler, drops the query from OAuth metadata discovery URLs, removes the forced prompt=consent for offline_access, and adds Mcp-Name for the draft events methods. The handshake revision is the SDK's: core 2.4.0 pins LATEST_PROTOCOL_VERSION at 2025-11-25 and lists support back to 2024-10-07. The SDK's default negotiation mode is legacy. opencode sets an unset protocol to auto for stdio and remote servers, so it sends server/discover at 2026-07-28 first and falls back to initialize at 2025-11-25. protocol: "legacy" or an attached socket connection skips the probe.

Paths read:

- `packages/core/src/mcp/client.ts`
- `packages/core/src/mcp/index.ts`
- `packages/core/src/mcp/connection.ts`
- `packages/core/src/mcp/pool.ts`
- `packages/core/src/mcp/oauth.ts`
- `packages/core/src/mcp/stdio.ts`
- `packages/core/src/mcp/socket-client.ts`
- `packages/core/src/mcp/instructions.ts`
- `packages/core/src/tool/mcp.ts`
- `packages/core/src/tool/plugin/mcp-resource.ts`
- `packages/core/src/plugin/command.ts`
- `packages/schema/src/mcp.ts`
- `packages/schema/src/config/flag.ts`
- `packages/core/package.json`
- `bun.lock`
- `patches/@modelcontextprotocol%2Fclient@2.4.0.patch`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/opencode.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

# pi

TypeScript coding agent CLI from Earendil Works, formerly badlogic/pi-mono. Its README said "No MCP" until September 2026. Since 0.99.0 it ships its own hand-written MCP client, @earendil-works/pi-mcp, as a built-in extension that is on by default and loads when a server is configured. By default MCP tools are not declared to the model: scripts the model writes for the codemode tool call them.

## At a glance

| | |
|---|---|
| Registry id | `pi` |
| Vendor | Earendil Works |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | cli |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/earendil-works/pi> |
| Home | <https://pi.dev> |
| Wire names | `pi` |
| SDK | `none` · unpatched |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Source last updated | 2026-11-16 |
| Last read | 2026-11-16 |
| Probed | `1.5.0` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2025-11-25` |
| **Resources** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read | `2025-11-25` |
| **Roots** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Logging** | ◐ partial | read | `2025-11-25` |
| **Instructions** | ◐ partial | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| **Tasks** | ○ unsupported | read | `2025-11-25` |
| **JSON Schema** |  |  |  |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ codeModeToolExposure | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ deferredToolLoading | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sessionRecovery | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ projectConfigTrustGate | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ replaceableBuiltInClient | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ conformanceSuiteInCi | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — A command entry is spawned through cross-spawn with the parent environment plus the entry's env, in its own process group on POSIX. env values may reference ${NAME} or run a command with !cmd. stderr is piped, and its last 2000 characters are shown when a connect fails or the connection drops. Close ends stdin, sends SIGTERM to the group after 500 ms and SIGKILL 2 s later; on Windows it runs taskkill /T /F. A dropped connection reconnects on the next call.
- **transports.sse** — An entry with type sse is rejected when the config is validated, with a message that points at the Streamable HTTP URL. A url entry always uses Streamable HTTP, and there is no fallback to HTTP+SSE. The pi-mcp README lists legacy HTTP+SSE as outside the initial core.
- **transports.streamableHttp** — The only remote transport. A response may be JSON or SSE. After notifications/initialized the client opens the GET stream and treats 405 as no stream. A dropped GET stream, or a response stream that carried event ids, is resumed with Last-Event-ID under exponential backoff, five attempts by default. MCP-Protocol-Version carries the negotiated version on every request after initialize, and Mcp-Session-Id is echoed. Close sends DELETE with a one second limit. A connect is retried twice after a network error or a 408, 429 or 5xx other than 501.
- **authentication.oauth** — Applies to a url server with no Authorization header and no auth block. A connection never opens a browser: it sends the stored access token, refreshes it 30 s before expiry or after a 401, and otherwise marks the server as needing sign-in until the user runs /mcp or pi mcp login. A 403 with insufficient_scope also asks for sign-in, with the challenged scopes added to the granted ones. Without a clientId pi offers its Client ID Metadata Document on pi.dev when the authorization server advertises client_id_metadata_document_supported and the none token auth method, and registers dynamically otherwise. The callback is a loopback server on 127.0.0.1, or a redirect URL the user pastes. Tokens are stored in mcp-auth.json in the agent directory, keyed by server name and URL, and refreshes are serialized across pi processes with a lock file. The flow code is adapted from typescript-sdk v1.29.0 src/client/auth.ts.
- **authentication.header** — A headers map is sent on every POST, GET and DELETE. Values may reference ${NAME} or run a command with !cmd. pi mcp add --bearer-token-env-var writes an Authorization: Bearer ${NAME} header. An Authorization header turns OAuth off for that server. An auth block with a provider name sends the current token of that pi /login provider as the bearer token; it is refused in project mcp.json files and needs https or a loopback host.
- **tools** — tools/list is called only when the server declares the tools capability. Every page is followed, with a duplicate-cursor guard and a cap of 1000 pages. Tools are registered as mcp__<server>__<tool>, with characters outside letters, digits and _ replaced by _ and a hash suffix past 64 characters or on a collision. The default exposure is codemode, so the model gets no declaration for an MCP tool. tools/call carries a progress token, a progress notification resets the per-request timeout of 60 s, and an abort or timeout sends notifications/cancelled. The four annotation hints are passed to permission extensions.
- **tools.listChanged** — A listener added after connect calls tools/list again. New tools are registered. Tools the server dropped are re-registered as hidden, because pi cannot unregister a tool. The listener is added whether or not the server declared tools.listChanged.
- **tools.result** — On the default codemode route the model never receives the result: a script gets the whole CallToolResult without _meta, uncut, and only what the script returns reaches the model. With exposure direct, or deferred once tool_search has loaded the tool, content reaches the model and structuredContent fills in only when content is empty.
- **tools.result.content** — On the direct and deferred routes text and image blocks reach the model. Text past 20 KB is cut in the middle and the full text is saved to a temp file named in the result. An empty content array with no structuredContent sends nothing from the adapter, and the provider layer supplies its own placeholder.
- **tools.result.structuredContent** — Reaches the model only when content is empty or absent, as one text block of pretty-printed JSON. Codemode scripts always receive it.
- **tools.result.outputSchema** — structuredContent is never validated against outputSchema. The schema is wrapped into the result type that codemode declarations show to scripts.
- **tools.result.audience** — annotations.audience is in the types and nothing reads it. A block addressed to the user reaches the model like any other.
- **tools.result.isError** — The content text carries the error. An isError result with no text gets the line "MCP tool <server>/<tool> returned an error". In a codemode script an isError result resolves and does not throw.
- **tools.result.media** — Images pass through as images. Audio becomes a text line saying it was omitted. A resource_link becomes a text line that names read_mcp_resource. Embedded text resources become text, and other blobs are saved to a temp file. A content array holding only non-text blocks counts as non-empty, so structuredContent is not used for it.
- **tools.result._meta** — Result _meta is not read on the model path and is removed before a script sees the result.
- **resources** — Reached through three tools, list_mcp_resources, list_mcp_resource_templates and read_mcp_resource, registered when a connected server declares the resources capability. Nothing is listed at connect. With a server argument a list call returns one page and hands nextCursor to the caller; without one it follows every page of every server. Resources with ui:// URIs or the mcp-app profile, _meta and icons are left out of listings. Text and images reach the model, text-like blobs are decoded, and other blobs are saved to a temp file. A server that answers resources/templates/list with method not found is treated as having no templates. No command or mention syntax for a person to attach a resource was found.
- **resources.listChanged** — No listener for notifications/resources/list_changed. The connection listens for notifications/message and notifications/tools/list_changed only.
- **resources.subscribe** — No resources/subscribe request and no listener for notifications/resources/updated.
- **prompts** — No prompts/list or prompts/get request in pi-mcp or in the extension. McpClient has helpers for ping, tools and resources only.
- **prompts.listChanged** — No listener for notifications/prompts/list_changed.
- **completions** — No completion/complete request.
- **sampling** — Not declared. The client registers handlers for ping and roots/list only, so sampling/createMessage is answered with -32601 Method not found. The pi-mcp README lists sampling as outside the initial core.
- **elicitation** — Not declared, and no handler: elicitation/create is answered with -32601 Method not found. pi's conformance README lists the elicitation scenario as a known failure with the reason that pi does not support elicitation.
- **elicitation.form** — No elicitation capability is declared and no elicitation/create handler is registered.
- **elicitation.url** — Same as form: nothing is declared and the request is answered with -32601.
- **roots** — The only capability the coding agent declares, as roots: {}. roots/list returns one root, the file URL of the session working directory, named after its last path segment.
- **roots.listChanged** — listChanged is not declared and nothing sends notifications/roots/list_changed. The root is fixed when the connection opens.
- **logging** — notifications/message is appended to mcp.log in the agent directory, one line per message with time, server, level and logger, and the file rotates to mcp.log.1 past 5 MB. Nothing is shown in the session. logging/setLevel is never sent.
- **instructions** — One line reaches the prompt. For a server with codemode or deferred tools, the first line of its instructions is the server's summary in the mcp_servers section of the system prompt, cut to 250 characters, and only when the entry has no description of its own. The full text is not placed in the prompt: codemode scripts read it with describeNamespace(), and tool_search ranks tools by it. A server whose tools are all direct is not listed in that section.
- **icons** — No icon is rendered. The Tool type has no icons field, and resource listings drop icons before the model sees them.
- **tasks** — No tasks capability and no tasks request. execution.taskSupport is in the Tool type and nothing reads it, so a tool that requires task augmentation is called with a plain tools/call. The pi-mcp README lists tasks as outside the initial core.
- **jsonSchema** — inputSchema goes to the provider with type defaulted to object and an empty properties added when missing; other keywords are kept. Tool arguments are validated before the call by pi's own validator, @earendil-works/pi-schema, which implements drafts 2020-12 and 7 and is called without a draft option, so 2020-12 applies. A $ref that names nothing rejects only the value at its place. Whether a $schema keyword changes the draft was not read. outputSchema is never used to validate a result.
- **extensions.io.modelcontextprotocol/ui** — No extensions or experimental capability is declared. Resources with ui:// URIs or the mcp-app profile are filtered out of resource listings because pi does not render them. _meta.ui is not read, so a tool marked app-only is registered like any other.
- **bonusFeatures.modelInitiatedResourceRead** — The same three tool names as Codex and opencode, on purpose: the source says models trained on those tools use them unchanged. The tools take the widest exposure among the servers with resources, so on a default install a codemode script calls them and the model has no declaration for them. A resource_link block in a tool result names read_mcp_resource and the server.
- **bonusFeatures.codeModeToolExposure** — The default exposure. An MCP tool is callable as tools.mcp__<server>__<tool>() from JavaScript the model writes for the codemode tool. Scripts find tools with searchTools(), describeTool(), describeNamespace() and ALL_TOOLS. The codemode tool is activated when an enabled server has codemode tools, unless autoEnableCodemode is false. Other exposures are deferred, direct and hidden, set per server or per tool.
- **bonusFeatures.deferredToolLoading** — Opt-in with exposure deferred on a server or a tool. The tools are not declared until the tool_search tool, a BM25 ranker over tool and namespace text, loads matches for the next model call. Loaded tools are then called directly. The default route is codemode, not this one.
- **bonusFeatures.sessionRecovery** — A 404 on a request that carried a session id raises McpSessionExpiredError. The connection opens a new session and retries the request once, tool calls included, on the reasoning that the server did not run it. Listing and reading resources are also retried once after a 408, 429 or 5xx; tool calls are not.
- **bonusFeatures.projectConfigTrustGate** — The project file .pi/mcp.json is read only after the project is trusted. A project entry without command, url or type may override enabled, exposure and toolExposure of a global server and nothing else. A project entry cannot use auth.provider.
- **bonusFeatures.replaceableBuiltInClient** — MCP is a built-in extension marked replaceable. An installed extension that registers /mcp takes over and the built-in one does not load. --no-mcp turns it off for one run, and -builtin:mcp in the extensions setting turns it off for good. Extensions add servers for a session with pi.registerMcpServer(). SDK sessions do not load built-in extensions.
- **bonusFeatures.conformanceSuiteInCi** — CI runs the client scenarios of @modelcontextprotocol/conformance 0.2.0-alpha.11 against pi's HTTP connection and sign-in code at three revisions and compares every check with a committed baseline.

## Verified by the probe

85 records from the live probe (`probe/`), client version `1.5.0`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/pi.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/pi@1.5.0/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.app_only/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.app_only/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/pi@1.5.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.meta_only/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.meta_only/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.with_meta/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.with_meta/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/pi@1.5.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.audience_user/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.audience_user/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/pi@1.5.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "(no tool output)" |
| [empty_object](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "(no tool output)" |
| [empty_object](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "" |
| [empty_object](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.empty_object/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 0x, structuredContent 0x) |
| [empty_object](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.empty_object/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "[\"Loaded 1 tool. They are available from your next call:\\n- mcp__probe__probe_em" |
| [large](../probe/runs/pi@1.5.0/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.large/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.large/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/pi@1.5.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.no_content_key/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [no_content_key](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.no_content_key/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/pi@1.5.0/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.is_error/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.is_error/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/pi@1.5.0/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.with_image/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.with_image/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/pi@1.5.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.schema_match/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.schema_match/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.schema_mismatch/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.schema_mismatch/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/pi@1.5.0/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 1.5.0 | payload once (as json) |
| [mirror](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 1.5.0 | payload once (as json) |
| [mirror](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | payload once (as json) |
| [mirror](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.mirror/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.mirror/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | payload once (as json) |
| [sc_empty](../probe/runs/pi@1.5.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.sc_empty/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.sc_empty/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.sc_null/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.sc_null/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.sc_string/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [sc_string](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.sc_string/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [structured_only](../probe/runs/pi@1.5.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.structured_only/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.structured_only/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/pi@1.5.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.summary_and_data/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.summary_and_data/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |

## Research notes

- [pi signs in with a Client ID Metadata Document on pi.dev, and switches to a per-server document when the authorization server sends no iss](../research/pi-uses-a-per-server-client-id-document-without-iss.md) — *idiosyncrasy*. Since 1.5.0 pi prefers its Client ID Metadata Document on pi.dev over dynamic registration. When the authorization server does not advertise the RFC 9207 iss parameter, pi uses a document and a callback path derived from the MCP server URL.
- [pi does not declare MCP tools to the model by default](../research/pi-keeps-mcp-tools-out-of-the-models-tool-list.md) — *idiosyncrasy*. pi's default exposure for an MCP server is codemode. The model gets no declaration for the server's tools, only a codemode tool and one line per server in the system prompt, and reaches the tools from scripts it writes. deferred, direct and hidden are set per server or per tool.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [pi runs the official client conformance suite in CI against a committed baseline](../research/pi-runs-the-official-conformance-suite-in-ci.md) — *nuance*. pi's CI runs the client scenarios of @modelcontextprotocol/conformance 0.2.0-alpha.11 at three revisions and compares each check with baseline.json. Three scenarios are baselined as failing, stdio is not exercised, and 2026-07-28 is left out as not implemented.
- [pi's README said No MCP until September 2026, and pi now ships its own MCP client, on by default](../research/pi-dropped-no-mcp-and-shipped-its-own-client.md) — *misconception*. pi's README said "No MCP" through 466db0fe. A docs refresh removed the line on 2026-09-22, and 8562bcf6 added a hand-written client as a built-in extension on 2026-09-29, released as 0.99.0. At 07ece436 it is on by default and the README does not mention MCP.
- [notes/pi-mono-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/pi-mono-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the pi source at 8636e21.

## Provenance

Read at `07ece436` on 2026-11-16, from `main` of https://github.com/earendil-works/pi.git. That commit was authored 2026-11-16.

**SDK.** Hand-written client, published as @earendil-works/pi-mcp (1.5.2 at this commit, declared 1.5.2). pi's own client, a workspace package in the same repo, published to npm at the version of the coding agent. It is hand-written and has one runtime dependency, cross-spawn; nothing in the repo imports an official MCP SDK. The only @modelcontextprotocol/sdk string in package-lock.json is an optional peer of @google/genai, and the lockfile has no entry that installs it. Only the OAuth code is derived: flow.ts and discovery.ts are adapted from typescript-sdk v1.29.0 src/client/auth.ts, with the licence in THIRD_PARTY_NOTICES. The lockfile resolves the package as a link to packages/mcp. No patches directory, patch-package or patchedDependencies; the one npm override is protobufjs. pinsProtocolVersion is left unset because LATEST_PROTOCOL_VERSION is pi's own constant. The coding agent never passes the protocolVersion option, and the option is typed to the four supported revisions.

Paths read:

- `packages/mcp/src/client.ts`
- `packages/mcp/src/protocol/types.ts`
- `packages/mcp/src/config.ts`
- `packages/mcp/src/naming.ts`
- `packages/mcp/src/transports/`
- `packages/mcp/src/oauth/`
- `packages/mcp/package.json`
- `packages/coding-agent/src/extensions/mcp/`
- `packages/coding-agent/src/extensions/index.ts`
- `packages/coding-agent/src/extensions/codemode/`
- `packages/coding-agent/src/extensions/tool-search/`
- `packages/coding-agent/src/core/mcp-servers.ts`
- `packages/coding-agent/package.json`
- `packages/coding-agent/docs/mcp.md`
- `packages/coding-agent/test/mcp-conformance/`
- `apps/p2/plugins/mcp/`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/pi.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

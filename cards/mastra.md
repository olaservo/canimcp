# Mastra

TypeScript agent framework. Its MCP client is the @mastra/mcp package: MCPClient wraps @modelcontextprotocol/client 2.4.0 and turns each server's tools into Mastra tools for an Agent. It probes server/discover first and falls back to the initialize handshake. A default construction declares only the MCP Apps extension and sends the server's config key as clientInfo.name, so MCPClient has no fixed wire name; mastra-playground is what Studio's connection preview sends. Roots, sampling, the HTTP+SSE transport and dynamic client registration were removed in the 2.0.0 rebuild.

## At a glance

| | |
|---|---|
| Registry id | `mastra` |
| Vendor | Mastra |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/mastra-ai/mastra> |
| Home | <https://mastra.ai/> |
| Wire names | `mastra-playground` |
| SDK | `@modelcontextprotocol/client` 2.4.0 · official TypeScript SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28`. What differs on `2025-11-25` is listed under "On 2025-11-25" below |
| Source last updated | 2026-11-16 |
| Last read | 2026-11-16 |
| Probed | `mcp-2.9.0-alpha.1+core-1.83.0-alpha.1` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ◐ partial | read ⇧ | `2026-07-28` |
| **Resources** | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ◇ opt-in | read | `2026-07-28` |
| **Prompts** | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ○ unsupported | read, declared | `2026-07-28` |
| &nbsp;&nbsp;↳ tools | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ◇ opt-in | read, declared | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ◇ opt-in | read | `2026-07-28` |
| **Roots** | ○ unsupported | read, declared | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ● full | read | `2026-07-28` |
| **Instructions** | ◇ opt-in | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read, declared | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ list | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ cancel | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ◇ opt-in | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ◇ opt-in | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ◇ opt-in | read ⇧ | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ protocolEraForcing | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ toolAnnotationPolicies | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ hostAllowlist | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ traceContextPropagation | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ cachedToolDefinitions | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## On 2025-11-25

When a server's newest revision is `2025-11-25`, Mastra negotiates it and these rows differ from the table above. Every other row holds on `2025-11-25` too.

| Capability | Status | Known by | At |
|---|---|---|---|
| **Tools** |  |  |  |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2025-11-25` |
| **Resources** | ◇ opt-in |  |  |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Logging** | ◐ partial | read, declared | `2025-11-25` |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |

- **tools.listChanged** — No stream is opened. The server pushes the notification unprompted and the handler the application registered runs.
- **resources** — The list and read calls are the same.
- **resources.subscribe** — resources/subscribe is never sent. subscribeResource() needs the subscriptions/listen stream and throws an error naming the negotiated revision.
- **logging** — logging/setLevel is never sent, so the server decides the level. The notifications/message handler is registered all the same, and the logLevel _meta key is still attached to each request.
- **extensions.io.modelcontextprotocol/tasks** — Only the SEP-2663 extension form is implemented: a result with resultType task. The 2025-11-25 task-augmented request form is not sent.

## What the table flattens

- **transports.stdio** — Used when the server entry has a command. The SDK's StdioClientTransport, with args, cwd and a stderr mode from the entry. The child environment is the SDK's default whitelist plus the entry's env, and inheritDefaultEnv: false drops the whitelist. Exit, SIGTERM and SIGHUP hooks disconnect the child unless registerProcessHooks is false.
- **transports.sse** — No HTTP+SSE client transport at this commit. A url entry always builds StreamableHTTPClientTransport and there is no fallback. The 2.0.0 changelog entry records the removal; 1.x fell back to HTTP+SSE when Streamable HTTP failed.
- **transports.streamableHttp** — Used when the entry has a url. The connect phase times out after 3000 ms unless connectTimeout is set. A custom fetch receives the request context as a third argument. allowedHosts restricts every request and redirect hop to listed hosts. After a transport failure during a tool call the client reconnects once, and resends the call only when the request was never sent or the tool is annotated readOnlyHint or idempotentHint.
- **authentication.oauth** — Opt-in: a url entry takes an authProvider, any SDK OAuthClientProvider. With none, a 401 fails the connect. The shipped MCPOAuthClientProvider takes either pre-registered client information or a Client ID Metadata Document URL. It has no saveClientInformation, so the SDK cannot register dynamically through it, and it returns the CIMD URL as client_id without the SDK's check of client_id_metadata_document_supported. MCPClient.authenticate() runs the code flow on a loopback callback server and passes the RFC 9207 iss to the SDK for validation. Tokens are keyed by issuer and held in memory unless a storage is passed. PKCE, resource indicators and metadata discovery are the SDK's.
- **authentication.header** — requestInit.headers on a url entry is passed to the transport for every request. A custom fetch can set headers per request from the caller's request context.
- **tools** — listTools() returns every server's tools keyed serverName_toolName for an Agent's tools, and listToolsets() groups them by server for per-call toolsets. tools/list is sent without a cursor and the SDK walks every page. A tool whose input schema is malformed or over the complexity limits is dropped with a warning. Tools whose _meta.ui.visibility lacks model are withheld. Two server and tool pairs that produce the same key overwrite each other with a warning. requireToolApproval gates calls, and its function form receives the server's tool annotations.
- **tools.listChanged** — Nothing is registered by default. mcp.tools.onListChanged(server, handler) sets a handler and opens the subscriptions/listen stream with toolsListChanged. The handler is the application's, and nothing refreshes the tools an Agent already holds.
- **tools.result** — The tool's declared outputSchema picks the field. With one, the text of content goes to the model and structuredContent is the fallback when content has no text. Without one, structuredContent replaces content when present, and a result with no structuredContent goes to the model as the whole envelope in JSON. On 2026-07-28 the SDK rejects a result with no content key and the model sees the validation error.
- **tools.result.content** — Text blocks and embedded resource text reach the model, joined by newlines, when the tool declares an outputSchema, or inside the envelope JSON when structuredContent is absent. Without an outputSchema and with structuredContent present, content is dropped. Nothing stands in for an empty array.
- **tools.result.structuredContent** — Reaches the model as JSON when the tool declares no outputSchema, or declares one and content has no text. With an outputSchema and text in content, the text is sent and the structured value is not.
- **tools.result.outputSchema** — Validated. For live tools the SDK rejects a missing or mismatching structuredContent and the model sees the SDK error text. For tools rebuilt from cached definitions Mastra validates with the same validator and returns a validation error object as the result. The schema is not sent to the model.
- **tools.result.audience** — annotations.audience is not read. Blocks are selected by type only.
- **tools.result.isError** — By default the joined content text becomes a thrown error whose message the model sees, 'MCP tool execution failed' when there is no text, and structuredContent goes to the error details only. With onToolError: 'return' the whole envelope is returned, both fields included.
- **tools.result.media** — Image and audio blocks become media parts only on the envelope route: a result without structuredContent from a tool without an outputSchema. On the structured routes no media reaches the model.
- **tools.result._meta** — Result _meta reaches the model only inside the envelope JSON, when structuredContent is absent. On the structured route it is kept on a non-enumerable symbol for MCP Apps hosts. No result _meta key changes the route.
- **resources** — Application API only. mcp.resources.list(), templates() and read() send resources/list, resources/templates/list and resources/read, and the SDK walks every page of the two lists. Nothing in the Agent or @mastra/core calls them, so a resource reaches a model or a person only through application code. A server that answers method-not-found yields an empty list. MCPClientServerProxy exposes list and read to Studio.
- **resources.listChanged** — Nothing is registered by default. mcp.resources.onListChanged(server, handler) sets the application's handler and adds resourcesListChanged to the subscriptions/listen filter.
- **resources.subscribe** — Application API only. mcp.resources.subscribe(server, uri) adds the URI to the one subscriptions/listen stream the client keeps per server, and onUpdated registers the handler for notifications/resources/updated. A URI the server leaves out of the honoured filter is an error. The stream is reopened after a reconnect.
- **prompts** — Application API only. mcp.prompts.list() and get() send prompts/list and prompts/get, and the SDK walks every page of the list. Nothing applies a prompt to a conversation; the application decides what to do with the returned messages.
- **prompts.listChanged** — Nothing is registered by default. mcp.prompts.onListChanged(server, handler) sets the application's handler and adds promptsListChanged to the subscriptions/listen filter.
- **completions** — completion/complete is never sent. The requests the client makes are for tools, resources, prompts, MCP Events and tasks.
- **sampling** — Not declared, and no sampling/createMessage handler is registered. MCPClientCapabilities admits only elicitation and extensions, and its comment calls sampling deprecated and unsupported. 1.x had it; the 2.0.0 changelog lists it as removed.
- **sampling.tools** — Sampling is not implemented.
- **sampling.context** — Sampling is not implemented.
- **elicitation** — Declared only when the server entry has an inputRequests handler, and then as {form: {}} unless capabilities.elicitation says otherwise. Setting capabilities.elicitation without a handler throws at construction. The handler is registered for elicitation/create on the SDK client, which also uses it to answer the input requests embedded in a 2026-07-28 input_required result before retrying the call. Without a handler an input_required result is an error. Mastra renders nothing itself.
- **elicitation.form** — The application's handler receives the server's key, the params and an abort signal, and returns accept, decline or cancel.
- **elicitation.url** — Declared only when the application sets capabilities.elicitation with a url member alongside the handler. The SDK rejects a url-mode request otherwise.
- **roots** — Not declared, and no roots/list handler is registered. The roots option, setRoots() and sendRootsListChanged() of 1.x are gone; the 2.0.0 changelog lists roots as removed.
- **roots.listChanged** — Roots are not implemented, so the notification is never sent.
- **logging** — On by default. Every request carries the io.modelcontextprotocol/logLevel _meta key, info unless serverLogLevel says otherwise, which is how a 2026-07-28 server is asked for logs. A notifications/message is written to the Mastra logger at a mapped level and passed to the entry's logger callback. enableServerLogs: false removes the key and the handler.
- **instructions** — Read on connect and returned by getServerInstructions(). They are added to the agent's system prompt, under a heading naming the server, only when the entry sets forwardInstructions: true, and are cut to 512 characters unless instructionsMaxLength says otherwise.
- **icons** — Not rendered or validated by @mastra/mcp. getServerInfo() returns the server's Implementation as sent, icons and websiteUrl included, and its comment says the URLs are not validated. Tool icons are not copied into the Mastra tool or the serialisable definition.
- **jsonSchema** — A tool schema with no $schema is treated as 2020-12. Draft-07 is accepted as is. A 2019-09 schema is converted to 2020-12 when that can be done faithfully, and passed through unchanged when not. An input schema over 128 levels or 10,000 nodes, or one that fails a draft-07-based meta-schema check, drops the tool from the list. Output is validated by the SDK's Ajv validator unless the entry passes a jsonSchemaValidator. Which keywords the validators honour was not read.
- **extensions.io.modelcontextprotocol/ui** — Declared with an empty settings object on every connection, with no option to leave it out. @mastra/mcp renders nothing. It keeps tool and result _meta, stamps ui.serverId next to ui.resourceUri, and withholds tools whose _meta.ui.visibility lacks model. The renderer is Studio (packages/playground-ui), which an application built on Agent and MCPClient alone does not have.
- **extensions.io.modelcontextprotocol/events** — Application API for the draft MCP Events extension (SEP-3415). mcp.events.list() sends events/list, and subscribe() delivers occurrences by webhook (events/subscribe) when the client has a webhook option, else push (events/stream), else poll (events/poll), from the modes the event advertises. Nothing is declared in the client capabilities; the client reads the server's io.modelcontextprotocol/events entry. createMCPEventsTools gives a model mcp_events_list, mcp_events_subscribe and mcp_events_unsubscribe.
- **extensions.io.modelcontextprotocol/events.webhook** — Chosen when the client has a webhook option and the event offers webhook.
- **extensions.io.modelcontextprotocol/events.push** — events/stream, chosen when there is no webhook option and the event offers push.
- **extensions.io.modelcontextprotocol/events.poll** — events/poll, the fallback when the event offers neither of the others.
- **extensions.io.modelcontextprotocol/tasks** — Off by default. tasks: true on a server entry declares the io.modelcontextprotocol/tasks extension (SEP-2663). A tools/call answered with resultType task is polled with tasks/get until it ends, and the final CallToolResult becomes the tool result. An input_required task is answered through inputRequests with tasks/update, or suspends the tool call when there is no handler. Aborting the call or reaching maxWaitMs sends tasks/cancel. mcp.tasks exposes get, update and cancel. The SDK rejects a task result, so Mastra rewrites it on the transport before the SDK parses it. The extension is declared with an empty settings object.
- **extensions.io.modelcontextprotocol/tasks.list** — tasks/list is not sent. The methods used are tasks/get, tasks/update and tasks/cancel.
- **extensions.io.modelcontextprotocol/tasks.cancel** — Sent on abort, at maxWaitMs, and through mcp.tasks.cancel(). Only with tasks enabled on the entry.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. The client capabilities declare io.modelcontextprotocol/ui, the tasks extension when tasks is set, and whatever the application passes in capabilities.extensions. @mastra/mcp sends no skills/list, skills/get or resources/directory/read and does not use the SDK's SkillsClient, which @modelcontextprotocol/client 2.4.0 ships as the separate ext/skills entry point. Agent.listSkills and getSkill read Mastra's own workspace and agent skills, not MCP servers.
- **bonusFeatures.modelInitiatedResourceRead** — No tool gives the model resources/read. The only model-facing tools @mastra/mcp builds are the server's own tools and the optional MCP Events tools.
- **bonusFeatures.protocolEraForcing** — protocolVersion on a server entry takes '2026-07-28', which pins that revision with no fallback, or 'legacy', which runs the initialize handshake with no probe. Omitted, the client probes and falls back. getServerProtocolVersions() reports what was negotiated. A successful verdict is reused on reconnect and dropped after a failed connect.
- **bonusFeatures.toolAnnotationPolicies** — The function form of requireToolApproval receives the server's tool annotations, placed so a caller cannot override them. After a transport failure in mid-call, a tool annotated readOnlyHint or idempotentHint is called again; any other tool fails with MCP_CLIENT_TOOL_CALL_OUTCOME_UNKNOWN and is not resent.
- **bonusFeatures.hostAllowlist** — allowedHosts on a url entry limits the connect, every POST, OAuth requests routed through the transport fetch and every redirect hop to listed hosts. With the default fetch a disallowed hop is blocked before it is sent; with a custom fetch it is checked from the response URL afterwards.
- **bonusFeatures.traceContextPropagation** — Each request's _meta carries W3C traceparent, tracestate and baggage, taken from the entry's traceContext provider or from the span making the request.
- **bonusFeatures.cachedToolDefinitions** — listToolDefinitions() returns the tools/list entries as plain JSON with the server name, version and instructions. toolsFromDefinitions() rebuilds executable tools from it without connecting; each connects on its first call.

## Verified by the probe

29 records from the live probe (`probe/`), client version `mcp-2.9.0-alpha.1+core-1.83.0-alpha.1`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/mastra.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | tool not offered to the model |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.meta_only/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.meta_only/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.with_meta/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.with_meta/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"array\",\n    \"code\": \"inval" |
| [large](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"array\",\n    \"code\": \"inval" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | […] content only (1x, as text) |
| [is_error](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.is_error/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" client error text, no fixture field: "Structured content does not match the tool's output schema: data must have requi" |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | payload once (as json) |
| [mirror](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | payload once (as json) |
| [mirror](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.mirror/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | payload once (as json) |
| [sc_empty](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" no marker reached the model; payload: "null" |
| [sc_string](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.structured_only/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.summary_and_data/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |

## Where the evidence disagrees

- **elicitation** — recorded as `opt-in`, but declared-tier evidence at `2026-07-28` says `unsupported`.
  <br>canimcp-probe (2026-11-08) — The clientCapabilities sent with server/discover and every later request were {"extensions":{"io.modelcontextprotocol/ui":{}}} (wire.jsonl). The probe ran @mastra/mcp 2.9.0-alpha.1; the capability code is the same at bb984550. The probe passes no inputRequests handler.
- **extensions.io.modelcontextprotocol/ui** — recorded as `partial`, but declared-tier evidence at `2026-07-28` says `full`.
  <br>canimcp-probe (2026-11-08) — The clientCapabilities sent with server/discover and every later request were {"extensions":{"io.modelcontextprotocol/ui":{}}} (wire.jsonl). The probe ran @mastra/mcp 2.9.0-alpha.1; the capability code is the same at bb984550.

## Research notes

- [A default Mastra MCPClient declares the MCP Apps extension and nothing else](../research/mastra-declares-only-mcp-apps-and-dropped-roots-and-sampling.md) — *idiosyncrasy*. At bb984550 MCPClient declares `io.modelcontextprotocol/ui` on every connection and has no renderer of its own. Roots, sampling, the HTTP+SSE fallback and `logging/setLevel` were removed in the 2.0.0 rebuild, on legacy connections too.
- [Mastra's OAuth provider takes a pre-registered client or a CIMD URL and never registers dynamically](../research/mastra-oauth-provider-never-registers-dynamically.md) — *idiosyncrasy*. At bb984550 MCPOAuthClientProvider requires `clientInformation` or `clientMetadataUrl` and has no `saveClientInformation`. It always returns client information, so SDK 2.4.0 skips both dynamic registration and its `client_id_metadata_document_supported` check.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [Mastra's MCPClient tells each server the name the application gave that server](../research/mastra-sends-the-server-config-key-as-its-client-name.md) — *idiosyncrasy*. At bb984550 MCPClient sends the key of the `servers` map as `clientInfo.name` and `1.0.0` as the version unless the application sets `clientInfo`. The probe's server, configured as `probe`, saw a client called `probe`. No default value identifies Mastra.
- [Mastra Studio previews a server's tools with a hand-written 2025-03-26 handshake](../research/mastra-studio-previews-servers-with-a-hand-written-initialize.md) — *idiosyncrasy*. At bb984550 the Mastra monorepo has two MCP clients. Agents use MCPClient on SDK 2.4.0, which leads with 2026-07-28. Studio's form for creating an MCP client uses a hand-written fetch client that sends `initialize` at 2025-03-26 as `mastra-playground`.
- [dist/public-CvV4ZHkX.mjs:731-765](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0) — *authentication.oauth*, read 2026-11-16 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.4.0, read from the npm tarball. auth() asks the provider for client information first. The CIMD capability check and registerClient() run only when the provider returns none.
- [dist/public-CvV4ZHkX.mjs:347,959,1086-1100,1210-1223,1258](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0) — *authentication.oauth*, read 2026-11-16 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.4.0, read from the npm tarball. Issuer validation, protected-resource metadata, OpenID configuration discovery, the S256 challenge and the resource parameter on the authorize and token requests.
- [dist/public-CvV4ZHkX.mjs:3405-3440,3957-3972](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0) — *tools*, read 2026-11-16 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.4.0, read from the npm tarball. listTools() without a cursor calls _listAllPages, which follows nextCursor until it is absent or a page repeats.
- [notes/mastra-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/mastra-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Mastra source at 7277766d.
- [dist/public-CvV4ZHkX.mjs:3346-3357,3371-3382](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0) — *resources*, read 2026-11-16 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.4.0, read from the npm tarball. listResources() and listResourceTemplates() without a cursor aggregate every page.
- [dist/public-CvV4ZHkX.mjs:2820-2835](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0) — *elicitation*, read 2026-11-16 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.4.0, read from the npm tarball. An input_required result is fulfilled through the registered handlers and the request is retried.
- [dist/public-CvV4ZHkX.mjs:2612-2623,2887-2889](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0) — *elicitation.url*, read 2026-11-16 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.4.0, read from the npm tarball. getSupportedElicitationModes and the per-mode rejection.

## Provenance

Read at `bb984550` on 2026-11-16, from `main` of https://github.com/mastra-ai/mastra.git. That commit was authored 2026-11-16.

**SDK.** packages/mcp pins @modelcontextprotocol/client, core and server at exactly 2.4.0 and node at 2.1.2, and pnpm-lock.yaml resolves each to that version. The lockfile also holds client and core 2.3.1, for the published @mastra/mcp 1.18.0 used in compatibility tests and as the peer of ext-apps 2.0.4, and @modelcontextprotocol/sdk 1.32.1 and 1.32.2 for packages/mcp-registry-registry, packages/playground-ui and third-party SDKs. None of those is the MCP client. Unpatched: patchedDependencies in pnpm-workspace.yaml lists nine packages and patches/ holds twelve files, none for an @modelcontextprotocol package. The workspace overrides raise older @modelcontextprotocol ranges to fixed releases and do not reach 2.4.0. @mastra/mcp is its own package: @mastra/core depends on @modelcontextprotocol/server for types and not on the client. The SDK's default negotiation mode is legacy and Mastra passes auto, so leading with server/discover is Mastra's choice, and 2026-07-28 is named in Mastra's own source as the pin value. The fallback handshake offers the SDK's LATEST_PROTOCOL_VERSION, 2025-11-25, and accepts back to 2024-10-07, a revision this registry does not track. pinsProtocolVersion is left unset for that reason.

Paths read:

- `packages/mcp/src/client/client.ts`
- `packages/mcp/src/client/configuration.ts`
- `packages/mcp/src/client/types.ts`
- `packages/mcp/src/client/oauth-provider.ts`
- `packages/mcp/src/client/oauth-callback-server.ts`
- `packages/mcp/src/client/url-policy.ts`
- `packages/mcp/src/client/server-proxy.ts`
- `packages/mcp/src/client/actions/`
- `packages/mcp/src/client/tasks/`
- `packages/mcp/src/client/events/`
- `packages/mcp/src/shared/`
- `packages/mcp/src/integrations/`
- `packages/mcp/package.json`
- `packages/mcp/CHANGELOG.md`
- `packages/core/src/agent/mcp-guidance.ts`
- `client-sdks/react/src/hooks/mcps/use-try-connect-mcp.ts`
- `mastracode/sdk/src/mcp/manager.ts`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/mastra.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

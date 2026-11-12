# fast-agent

Python framework and CLI for building and running agents, from the maintainer of the SEP-2640 skills proposal and the HF client telemetry feed. The first client read here that leads with the 2026-07-28 stateless era: it probes server/discover before falling back to the initialize handshake, and behaves differently on each.

## At a glance

| | |
|---|---|
| Registry id | `fast-agent` |
| Vendor | Shaun Smith (llmindset) |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/evalstate/fast-agent> |
| Home | <https://fast-agent.ai/> |
| Wire names | `fast-agent-mcp` |
| SDK | `mcp` 2.0.0 · declares `==2.0.0` · official Python SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-08-23 |
| Last read | 2026-08-25 |
| Probed | `0.10.53` (see below) |
| In traffic | evalstate/mcp-clients, window ending 2026-11-08 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ● full | read ⇧ | `2026-07-28` |
| **Resources** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ● full | read | `2026-07-28` |
| **Prompts** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| **Completions** | ◐ partial | read | `2026-07-28` |
| **Sampling** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ tools | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ● full | read | `2026-07-28` |
| **Roots** | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ● full | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **Tasks** | ○ unsupported | read | `2026-07-28` |
| JSON Schema | — not recorded | | |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ● full | read | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ protocolEraForcing | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ transportDiagnostics | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ remoteFileUriSanitization | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ providerManagedMcp | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — The SDK's stdio_client, wrapped in a tracking layer that records every frame on the transport timeline. Child environment is built from the SDK's default environment plus the server entry's env and cwd. Server stderr is routed line by line into fast-agent's logger.
- **transports.sse** — Reached only by setting transport: sse explicitly. A url with no transport resolves to http, not sse, so the deprecated transport is never the accidental default. Rejected in config validation when combined with protocol_mode: modern, since discover has no SSE path.
- **transports.streamableHttp** — The default for any url server. fast-agent supplies its own httpx client so it can hang request and response hooks off it, which is where the transport timeline, the 401 escalation signal and the discover-response accounting come from. Redirects are followed. Timeouts fall back to the SDK defaults unless configured.
- **authentication.oauth** — Escalated rather than assumed: a remote server is tried unauthenticated first, and OAuth is only enabled on a second attempt after a 401. auth.oauth: true forces it, auth.oauth: false and a configured Authorization header both suppress it. Tokens persist in the OS keyring under service fast-agent-mcp, with an in-memory fallback and a printed warning when no keyring backend is available. The callback is a local loopback server, with a paste fallback.
- **authentication.header** — A headers map on a remote server is passed through on both HTTP transports. An Authorization or X-HF-Authorization header suppresses the OAuth escalation entirely. auth.forward: huggingface injects the local HF token as a header for Hugging Face endpoints and disables OAuth for that server.
- **tools** — One page of tools/list, no cursor, on both eras — the SDK accepts a cursor and the aggregator never passes one. Tools are flattened into <server>__<tool>, truncated to 64 characters. When a server does not declare a tools capability fast-agent calls tools/list anyway and treats a method-not-found as the answer, so an undeclared-but-present tool list is still found.
- **tools.listChanged** — Modern: requested through the subscriptions/listen filter when the server advertises it. Legacy: the ToolListChangedNotification handler refreshes that server's tools. The only notification wired up on the handshake path.
- **tools.result** — structuredContent replaces content. The ACP channel receives content blocks only; tools with app-only visibility are hidden from the model.
- **tools.result.structuredContent** — Compact, key-sorted JSON of structuredContent replaces every text block whenever the field is present, {} and [] included.
- **tools.result.content** — Text blocks reach the model only when structuredContent is absent. Non-text blocks always stay.
- **tools.result.media** — Image, resource and resource-link blocks stay next to the JSON; audio is dropped or rendered as an unsupported-content note depending on the provider converter.
- **resources** — resources/list, resources/templates/list and resources/read are all called. A resource reaches the model as an @server:uri mention a person typed, expanded into EmbeddedResource blocks before the turn — there is no tool the model can call to read one. Anything a remote server returns carrying a file:// URI is rewritten before it reaches the conversation.
- **resources.listChanged** — Modern only, through the subscriptions/listen filter. On the handshake path the notification is received and dropped.
- **resources.subscribe** — Expressed as resource URIs in the subscriptions/listen filter, gated on the server advertising resources.subscribe. resources/subscribe is never called, so there is no subscription at all on a handshake-era connection. Changing the watched set closes and reopens the stream.
- **prompts** — prompts/list and prompts/get are both called, with a per-server prompt cache and a search across servers when a prompt is named without one. A fetched prompt is applied as persistent conversation messages. Triggered by /prompt or the agent API, never by the model.
- **prompts.listChanged** — Modern only, same as resources. Dropped on the handshake path.
- **completions** — completion/complete is called for one thing: filling a resource template argument in the interactive completer. Prompt-argument completion is not wired up, and a failure returns an empty completion rather than surfacing.
- **sampling** — Declared and served by default: auto_sampling is on, so a server gets a sampling capability unless the config turns it off. The model is the server entry's sampling.model, else the agent's model, else the global default; with none of those the request fails with an internal error rather than falling back. A failure is returned as ErrorData, so a sampling problem does not break the connection.
- **sampling.tools** — Tools in the request are passed to the LLM, and a tool call comes back as CreateMessageResultWithTools with stopReason "toolUse". The server executes and follows up.
- **sampling.context** — includeContext is not read anywhere; the sampling converter ignores it.
- **elicitation** — Declared and served by default. Three modes — forms (the default), auto-cancel, and none — resolvable globally, per server, or per agent through a decorator. The forms handler renders a schema-driven prompt in the terminal.
- **elicitation.url** — ElicitRequestURLParams is handled as a distinct branch: the URL is shown inline and queued for attachment to the originating request's result, so a URL elicitation raised mid-tool-call is reported against that call. A -32042 URL_ELICITATION_REQUIRED error is decorated with the same display payload.
- **roots** — Declared only for a server whose config entry lists roots, and served correctly when it is: roots/list returns the configured file:// URIs, with an optional alias so the URI presented to the server differs from the local path. The roots are read once from config and never change.
- **roots.listChanged** — The SDK declares roots.listChanged: true whenever a roots callback exists, with no way to opt out. Nothing in fast-agent sends notifications/roots/list_changed. The declaration is inaccurate and not fast-agent's to fix.
- **logging** — logging/setLevel is never called and no handler renders a notifications/message. On the handshake path a log notification reaches the generic server-notification callback, which is only ever assigned in a unit test.
- **instructions** — The server's instructions string is read and injected into the system prompt through a {{serverInstructions}} resolver, re-resolved when servers are attached or detached. Suppressible per server with include_instructions: false, and the UI reports both whether a server sent instructions and whether they are enabled.
- **icons** — No icon handling anywhere in the MCP client.
- **tasks** — No tasks/* call of any kind. The server's tasks capability is readable through server_supports_feature, which nothing calls with "tasks" — the enum member is the only trace.
- **extensions.io.modelcontextprotocol/skills** — SEP-2640 draft d7490ecd, implemented against locally-declared wire models because the Python SDK carries none. skills/list, skills/get, and resources/directory/read when the server's extension settings say directoryRead: true. Skill resources are verified against SHA-256 digests before install, under six size and count limits fast-agent chose itself.
- **bonusFeatures.modelInitiatedResourceRead** — By design rather than omission. Resources are reachable to a person through @server:uri mentions with URI completion, and to application code through the agent API. The model gets no mechanism.
- **bonusFeatures.protocolEraForcing** — protocol_mode: auto \| modern \| legacy, global or per server, also settable per connection from the CLI. modern subclasses the SDK client so a failed discover unwinds the transport instead of silently falling back. The negotiated era and how it was reached are shown in /mcp.
- **bonusFeatures.transportDiagnostics** — Every frame is attributed to a channel — stdio, GET, POST (JSON), POST (SSE), listen, resumption — and rendered as a bucketed timeline in /mcp. The channel for a POST is decided from the response content type and the request method, so a subscriptions/listen stream is separated from ordinary SSE traffic. Discovery responses are accounted separately so a probe rejection is not counted as a transport error.
- **bonusFeatures.remoteFileUriSanitization** — A tool result, prompt result or resource read from a remote server that carries a file:// URI is rewritten before it reaches the conversation: a ResourceLink becomes a text block saying the attachment was blocked, and an embedded resource keeps its content under a sanitized URI.
- **bonusFeatures.providerManagedMcp** — A server entry can set management: provider, which hands the server URL or connector id to the model provider (OpenAI Responses) instead of connecting to it. fast-agent then speaks no MCP to that server at all, and the settings that only make sense for a local connection are rejected in validation.
- **byProtocolVersion.2025-11-25.resources** — Same read path. The watching stops working.
- **byProtocolVersion.2025-11-25.resources.listChanged** — The notification arrives and is dropped: the handler forwards everything except progress and tools/list_changed to a callback that is never assigned outside a test.
- **byProtocolVersion.2025-11-25.resources.subscribe** — resources/subscribe is never called. The subscription loop is gated on a DiscoverResult being present.
- **byProtocolVersion.2025-11-25.prompts.listChanged** — Dropped with the rest.
- **byProtocolVersion.2025-11-25.bonusFeatures.healthPing** — A ping loop runs on the handshake path only, every 30 seconds by default, treating the connection as failed after three consecutive misses. ping was removed in 2026-07-28 and the SDK deprecates the method outside legacy mode, so a modern connection has no health signal of its own.
- **byProtocolVersion.2025-11-25.bonusFeatures.sessionRecovery** — A -32600 "Session terminated" on a handshake-era connection is turned into a typed error and, with reconnect_on_disconnect left on, the operation is replayed against a fresh connection. The check explicitly excludes modern connections, which carry no session to lose.

## Verified by the probe

85 records from the live probe (`probe/`), client version `0.10.53`. Each row is one run against the instrumented fixture server with the model mocked; the verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/fast-agent.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.app_only/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.app_only/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.meta_only/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.meta_only/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.with_meta/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.with_meta/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.audience_user/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.audience_user/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 2 validation errors " |
| [empty_object](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 2 validation errors " |
| [empty_object](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "[{\"type\":\"text\",\"text\":\"Failed to call_tool 'probe_empty_object' on server 'prob" |
| [empty_object](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.empty_object/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 1 validation error f" |
| [empty_object](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.empty_object/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 2 validation errors " |
| [large](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.large/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.large/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [no_content_key](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 2 validation error" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 2 validation error" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "[{\"type\":\"text\",\"text\":\"Failed to call_tool 'probe_no_content_key' on server 'pr" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.no_content_key/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 1 validation error" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.no_content_key/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 2 validation error" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.is_error/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.is_error/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as blocks) |
| [with_image](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.with_image/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.with_image/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.schema_match/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.schema_match/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "[{\"type\":\"text\",\"text\":\"Failed to call_tool 'probe_schema_mismatch' on server 'p" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.schema_mismatch/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.schema_mismatch/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.mirror/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.mirror/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | payload once (as json) |
| [sc_empty](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"{}\"}]" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.sc_empty/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.sc_empty/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.sc_null/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.sc_null/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.sc_string/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_sc_string' on server 'probe': 1 validation error for " |
| [sc_string](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.sc_string/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.structured_only/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.structured_only/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.summary_and_data/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |

## Observed in traffic

From `evalstate/mcp-clients` at [`c30d6f28`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/c30d6f2859b699fe9f36e674e4722bfd2d8a1258/reports/dashboard-v1.json), report generated 2026-11-09, window 2026-09-10 to 2026-11-08. Grouped as `fast-agent` from wire names `fast-agent-mcp`. Tool calls by revision over the 30 days to 2026-11-06: `2026-07-28` 100%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| apps | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Research notes

- [fast-agent opens every connection with a 2026-07-28 discover probe](../research/fast-agent-leads-with-the-modern-discover-probe.md) — *idiosyncrasy*. A default fast-agent install sends `server/discover` at `2026-07-28` as the first request on every transport, and falls back to the `initialize` handshake only when that fails. It is the first client read here that leads with the stateless era rather than the handshake.
- [fast-agent watches server state through subscriptions/listen, and only there](../research/fast-agent-subscribes-only-on-the-modern-path.md) — *nuance*. On a 2026-07-28 connection fast-agent opens a `subscriptions/listen` stream and refreshes its whole cached view on any event. On the fallback handshake path it acts on `tools/list_changed` and drops the prompts and resources equivalents.
- [fast-agent reads resources and prompts, but only a person can trigger either](../research/fast-agent-resources-need-a-user-to-ask.md) — *nuance*. fast-agent calls `resources/read` and `prompts/get` properly, and gives the model no way to call either. Resources arrive as `@server:uri` mentions a user typed; prompts arrive through `/prompt` or the agent API. Three clients, three different answers to the same SHOULD.
- [fast-agent's capability declaration varies from server to server](../research/fast-agent-declares-capabilities-per-server.md) — *idiosyncrasy*. fast-agent builds its client capability object per connection, from that server's config. Sampling and elicitation are on by default, roots only when the server entry lists them. Two servers in one config file can see two different clients.
- [fast-agent declares roots.listChanged and never sends the notification](../research/fast-agent-never-sends-roots-list-changed.md) — *gap*. The Python SDK sets `roots.listChanged: true` whenever a client passes a roots callback, with no way to opt out. fast-agent's roots come from static config, so it never sends the notification. Two SDKs, three clients, same gap.
- [fast-agent implements SEP-2640 skills over MCP with wire types it defines itself](../research/fast-agent-ships-skills-over-mcp-ahead-of-the-sdk.md) — *in-flight*. fast-agent calls `skills/list`, `skills/get` and `resources/directory/read` against servers declaring the `io.modelcontextprotocol/skills` extension, verifying every resource against a SHA-256 digest. The Python SDK has none of these types, so fast-agent declares them itself.
- [notes/fast-agent-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/fast-agent-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the fast-agent source at d89956d.

## Provenance

Read at `1b58e686` on 2026-08-25, from `main` of https://github.com/evalstate/fast-agent.git. That commit was authored 2026-08-23.

**SDK.** The first Python-SDK read in the registry, and the first client on an SDK that speaks 2026-07-28. Both mcp and its split-out mcp-types are pinned to exactly 2.0.0 in pyproject.toml and resolve there in uv.lock; there is no [tool.uv] override and no vendored fork. src/fast_agent/patch/ is a Python port of codex apply_patch, not an SDK patch. The version range is entirely the SDK's — fast-agent names no revision of its own and picks an era instead, so pinsProtocolVersion would misstate what is happening: the SDK pins both ends of the range, and fast-agent chooses which end to try first.

Paths read:

- `src/fast_agent/mcp/client_connection.py`
- `src/fast_agent/mcp/client_callback_runtime.py`
- `src/fast_agent/mcp/client_gateway.py`
- `src/fast_agent/mcp/mcp_connection_manager.py`
- `src/fast_agent/mcp/mcp_aggregator.py`
- `src/fast_agent/mcp/oauth_client.py`
- `src/fast_agent/mcp/sampling.py`
- `src/fast_agent/mcp/elicitation_factory.py`
- `src/fast_agent/mcp/elicitation_handlers.py`
- `src/fast_agent/mcp/skills_extension.py`
- `src/fast_agent/mcp/common.py`
- `src/fast_agent/skills/mcp_registry.py`
- `src/fast_agent/ui/prompt/resource_mentions.py`
- `src/fast_agent/agents/mcp_agent.py`
- `src/fast_agent/core/instruction_refresh.py`
- `src/fast_agent/config.py`
- `src/fast_agent/utils/transports.py`
- `pyproject.toml`
- `uv.lock`

Source is not vendored. Client source is read from the shared `_clients` checkout (see `AGENTS.md`); check out that commit there to reproduce any claim above.

---

Generated from `data/clients.json`, `data/verified/fast-agent.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

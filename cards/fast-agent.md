# fast-agent

Python framework and CLI for building and running agents, from the maintainer of the SEP-2640 skills proposal and the HF client telemetry feed. The first client read here that leads with the 2026-07-28 stateless era: it probes server/discover before falling back to the initialize handshake, and behaves differently on each.

## At a glance

| | |
|---|---|
| Registry id | `fast-agent` |
| Vendor | Shaun Smith (llmindset) |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/evalstate/fast-agent> |
| Home | <https://fast-agent.ai/> |
| Wire names | `fast-agent-mcp` |
| SDK | `mcp` 2.3.0 · declares `==2.3.0` · official Python SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28`. What differs on `2025-11-25` is listed under "On 2025-11-25" below |
| Source last updated | 2026-11-19 |
| Last read | 2026-11-20 |
| Probed | `0.10.53` (see below) |
| In traffic | evalstate/mcp-clients, window ending 2026-11-25 (see below) |

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
| **Roots** | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ● full | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ protocolEraForcing | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ transportDiagnostics | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ remoteFileUriSanitization | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ providerManagedMcp | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## On 2025-11-25

When a server's newest revision is `2025-11-25`, fast-agent negotiates it and these rows differ from the table above. Every other row holds on `2025-11-25` too.

| Capability | Status | Known by | At |
|---|---|---|---|
| **Resources** | ● full |  |  |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ● full |  |  |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ healthPing | ● full | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ sessionRecovery | ● full | read | `2025-11-25` |

- **resources** — Same read path. The watching stops working.
- **resources.listChanged** — The notification arrives and is dropped: the handler forwards everything except progress and tools/list_changed to a callback that is never assigned outside a test.
- **resources.subscribe** — resources/subscribe is never called. The subscription loop is gated on a DiscoverResult being present.
- **prompts.listChanged** — Dropped with the rest.
- **bonusFeatures.healthPing** — A ping loop runs on the handshake path only, every 30 seconds by default, treating the connection as failed after three consecutive misses. ping was removed in 2026-07-28 and the SDK deprecates the method outside legacy mode, so a modern connection has no health signal of its own.
- **bonusFeatures.sessionRecovery** — A -32600 "Session terminated" on a handshake-era connection is turned into a typed error and, with reconnect_on_disconnect left on, the operation is replayed against a fresh connection. The check explicitly excludes modern connections, which carry no session to lose.

## What the table flattens

- **transports.stdio** — The SDK's stdio_client, wrapped in a tracking layer that records every frame on the transport timeline. Child environment is built from the SDK's default environment plus the server entry's env and cwd. Server stderr is routed line by line into fast-agent's logger.
- **transports.sse** — Reached only by setting transport: sse explicitly. A url with no transport resolves to http, not sse, so the deprecated transport is never the accidental default. Rejected in config validation when combined with protocol_mode: modern, since discover has no SSE path.
- **transports.streamableHttp** — The default for any url server. fast-agent supplies its own httpx client so it can hang request and response hooks off it, which is where the transport timeline, the 401 escalation signal and the discover-response accounting come from. Redirects are followed only within the endpoint's origin, and that is the SDK's doing: mcp 2.3.0 sends each request with redirect following off and follows a same-origin redirect itself, and fast-agent no longer sets follow_redirects. Timeouts fall back to the SDK defaults unless configured.
- **authentication.oauth** — Escalated rather than assumed: a remote server is tried unauthenticated first, and OAuth is only enabled on a second attempt after a 401. auth.oauth: true forces it, auth.oauth: false and a configured Authorization header both suppress it. Tokens persist in the OS keyring under service fast-agent-mcp, with an in-memory fallback and a printed warning when no keyring backend is available. The callback is a local loopback server, with a paste fallback.
- **authentication.header** — A headers map on a remote server is passed through on both HTTP transports. An Authorization or X-HF-Authorization header suppresses the OAuth escalation entirely. auth.forward: huggingface injects the local HF token as a header for Hugging Face endpoints and disables OAuth for that server.
- **tools** — One page of tools/list, no cursor, on both eras — the SDK accepts a cursor and the aggregator never passes one. Tools are flattened into <server>__<tool>, truncated to 64 characters. When a server does not declare a tools capability fast-agent calls tools/list anyway and treats a method-not-found as the answer, so an undeclared-but-present tool list is still found.
- **tools.listChanged** — Modern: requested through the subscriptions/listen filter when the server advertises it. Legacy: the ToolListChangedNotification handler refreshes that server's tools. The only notification wired up on the handshake path.
- **tools.result** — structuredContent replaces content. The ACP channel receives content blocks only; tools with app-only visibility are hidden from the model.
- **tools.result.structuredContent** — Compact, key-sorted JSON of structuredContent replaces every text block whenever the field is present, {} and [] included.
- **tools.result.content** — Text blocks reach the model only when structuredContent is absent. Non-text blocks always stay.
- **tools.result.media** — Image, resource and resource-link blocks stay next to the JSON; audio is dropped or rendered as an unsupported-content note depending on the provider converter.
- **resources** — resources/list, resources/templates/list and resources/read are all called. A resource reaches the model as an @server:uri mention a person typed, expanded into EmbeddedResource blocks before the turn. A default agent has no tool the model can call to read one; an agent with harness_tools: true gets a get_resource tool. Anything a remote server returns carrying a file:// URI is rewritten before it reaches the conversation.
- **resources.listChanged** — Modern only, through the subscriptions/listen filter. On the handshake path the notification is received and dropped.
- **resources.subscribe** — Expressed as resource URIs in the subscriptions/listen filter, gated on the server advertising resources.subscribe. resources/subscribe is never called, so there is no subscription at all on a handshake-era connection. Changing the watched set closes and reopens the stream.
- **prompts** — prompts/list and prompts/get are both called, with a per-server prompt cache and a search across servers when a prompt is named without one. A fetched prompt is applied as persistent conversation messages. Triggered by /prompt or the agent API, never by the model.
- **prompts.listChanged** — Modern only, same as resources. Dropped on the handshake path.
- **completions** — completion/complete is called for one thing: filling a resource template argument in the interactive completer. Prompt-argument completion is not wired up, and a failure returns an empty completion rather than surfacing.
- **sampling** — Declared and served by default: auto_sampling is on, so a server gets a sampling capability unless the config turns it off. The model is the server entry's sampling.model, else the agent's model, else the global default; with none of those the request fails with an internal error rather than falling back. A failure is returned as ErrorData, so a sampling problem does not break the connection.
- **sampling.tools** — Tools in the request are passed to the LLM, and a tool call comes back as CreateMessageResultWithTools with stopReason "toolUse". The server executes and follows up.
- **sampling.context** — includeContext is not read anywhere; the sampling converter ignores it.
- **elicitation** — Declared and served by default. Three modes — forms (the default), auto-cancel, and none — resolvable globally, per server, or per agent through a decorator. The forms handler renders a schema-driven prompt in the terminal.
- **elicitation.url** — ElicitRequestURLParams is handled as a distinct branch: the URL is shown inline and queued for attachment to a request's result. On a 2026-07-28 connection the elicitation is dispatched inside the originating request's task and is attached to that request. On a handshake connection it arrives on the receive loop, cannot be correlated, and is attached to the next request on that connection that completes. A -32042 URL_ELICITATION_REQUIRED error is decorated with the same display payload.
- **roots** — Declared only for a server whose config entry lists roots, and served correctly when it is: roots/list returns the configured file:// URIs, with an optional alias so the URI presented to the server differs from the local path. The roots are read once from config and never change.
- **roots.listChanged** — The SDK declares roots.listChanged: true whenever a roots callback exists, with no way to opt out. Nothing in fast-agent sends notifications/roots/list_changed. The declaration is inaccurate and not fast-agent's to fix.
- **logging** — logging/setLevel is never called and no handler renders a notifications/message. On the handshake path a log notification reaches the generic server-notification callback, which is only ever assigned in a unit test.
- **instructions** — The server's instructions string is read and injected into the system prompt through a {{serverInstructions}} resolver, re-resolved when servers are attached or detached. Suppressible per server with include_instructions: false, and the UI reports both whether a server sent instructions and whether they are enabled.
- **icons** — No icon handling anywhere in the MCP client.
- **extensions.io.modelcontextprotocol/skills** — SEP-2640, now Final, implemented against locally-declared wire models because the Python SDK (mcp 2.3.0) carries none. The models followed draft d7490ecd in August and follow the stable Skills extension now. skills/list, skills/get, and resources/directory/read when the server's extension settings say directoryRead: true. A skill's resources are a manifest of uri, digest and size, or the string dynamic; a dynamic skill is listed and cannot be installed. Skill resources are verified against their size and SHA-256 digest before install, under size and count limits fast-agent chose itself.
- **extensions.io.modelcontextprotocol/tasks** — No tasks/* call of any kind. The server's tasks capability is readable through server_supports_feature, which nothing calls with "tasks" — the enum member is the only trace.
- **extensions.io.modelcontextprotocol/ui** — Not declared and not rendered. The SDK Client is constructed without extensions=, and the docs say the terminal client does not advertise the MCP Apps extension because it does not execute app HTML or provide the browser bridge. Discovery reads _meta.ui.resourceUri (and the older flat ui/resourceUri key) on each tool, lists and reads the ui:// resource, and checks for text/html;profile=mcp-app, recording warnings for missing or mismatched resources. Tools whose visibility is exactly ["app"] are left out of the model's tool list. Linked tools are labelled (MCP Apps) in tool summaries and /mcp shows a Ui marker. A tool result is shown as ordinary terminal output with the linked resource URI noted.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. No events/list, events/poll, events/stream or events/subscribe call exists in the repo, and the SDK Client is constructed without extensions=. mcp 2.3.0 has no events client to turn on.
- **extensions.io.modelcontextprotocol/events.poll** — events/poll is never sent.
- **extensions.io.modelcontextprotocol/events.push** — events/stream is never opened and no notifications/events/* handler exists.
- **extensions.io.modelcontextprotocol/events.webhook** — events/subscribe is never sent.
- **bonusFeatures.modelInitiatedResourceRead** — Off by default. Resources are reachable to a person through @server:uri mentions with URI completion, and to application code through the agent API. An agent configured with harness_tools: true (false by default) also gets a get_resource tool that takes a URI and an optional server name and reads an attached MCP resource, checked against the agent's resources filter. A default agent gives the model no mechanism.
- **bonusFeatures.protocolEraForcing** — protocol_mode: auto \| modern \| legacy, global or per server, also settable per connection from the CLI. modern subclasses the SDK client so a failed discover unwinds the transport instead of silently falling back. The negotiated era and how it was reached are shown in /mcp.
- **bonusFeatures.transportDiagnostics** — Every frame is attributed to a channel — stdio, GET, POST (JSON), POST (SSE), listen, resumption — and rendered as a bucketed timeline in /mcp. The channel for a POST is decided from the response content type and the request method, so a subscriptions/listen stream is separated from ordinary SSE traffic. Discovery responses are accounted separately so a probe rejection is not counted as a transport error.
- **bonusFeatures.remoteFileUriSanitization** — A tool result, prompt result or resource read from a remote server that carries a file:// URI is rewritten before it reaches the conversation: a ResourceLink becomes a text block saying the attachment was blocked, and an embedded resource keeps its content under a sanitized URI.
- **bonusFeatures.providerManagedMcp** — A server entry can set management: provider, which hands the server URL or connector id to the model provider (OpenAI Responses) instead of connecting to it. fast-agent then speaks no MCP to that server at all, and the settings that only make sense for a local connection are rejected in validation.

## Verified by the probe

115 records from the live probe (`probe/`), client version `0.10.53`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/fast-agent.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.app_only/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.app_only/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| **protocol.initializeHandshake** | | | | | |
| [protocol.initializeHandshake.echo](../probe/runs/fast-agent@0.10.53/default/both-http/protocol.initializeHandshake.echo/record.json) | default | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/fast-agent@0.10.53/default/both-stdio/protocol.initializeHandshake.echo/record.json) | default | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/fast-agent@0.10.53/legacy/both-http/protocol.initializeHandshake.echo/record.json) | legacy | http | `2025-11-25` | 0.10.53 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/protocol.initializeHandshake.echo/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/fast-agent@0.10.53/modern/both-http/protocol.initializeHandshake.echo/record.json) | modern | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/fast-agent@0.10.53/modern/both-stdio/protocol.initializeHandshake.echo/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/fast-agent@0.10.53/default/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/fast-agent@0.10.53/default/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | default | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/fast-agent@0.10.53/legacy/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | legacy | http | `2024-11-05` | 0.10.53 | initialize at 2025-11-25 → 2024-11-05; client continued at 2024-11-05 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | legacy | stdio | `2024-11-05` | 0.10.53 | initialize at 2025-11-25 → 2024-11-05; client continued at 2024-11-05 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/fast-agent@0.10.53/modern/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | modern | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/fast-agent@0.10.53/modern/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/fast-agent@0.10.53/default/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/fast-agent@0.10.53/default/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | default | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/fast-agent@0.10.53/legacy/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | legacy | http | `2025-11-25` | 0.10.53 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/fast-agent@0.10.53/modern/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | modern | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/fast-agent@0.10.53/modern/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/fast-agent@0.10.53/default/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/fast-agent@0.10.53/default/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | default | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/fast-agent@0.10.53/legacy/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | legacy | http | `2026-07-28` | 0.10.53 | initialize at 2025-11-25 → 2026-07-28; client sent nothing further |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | legacy | stdio | `2026-07-28` | 0.10.53 | initialize at 2025-11-25 → 2026-07-28; client sent nothing further |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/fast-agent@0.10.53/modern/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | modern | http | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/fast-agent@0.10.53/modern/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| **protocol.serverDiscover** | | | | | |
| [protocol.serverDiscover.method_not_found](../probe/runs/fast-agent@0.10.53/default/both-http/protocol.serverDiscover.method_not_found/record.json) | default | http | `2025-11-25` | 0.10.53 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/fast-agent@0.10.53/default/both-stdio/protocol.serverDiscover.method_not_found/record.json) | default | stdio | `2025-11-25` | 0.10.53 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/fast-agent@0.10.53/legacy/both-http/protocol.serverDiscover.method_not_found/record.json) | legacy | http | `2025-11-25` | 0.10.53 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/protocol.serverDiscover.method_not_found/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/fast-agent@0.10.53/modern/both-http/protocol.serverDiscover.method_not_found/record.json) | modern | http | ? | 0.10.53 | server/discover at 2026-07-28 → error -32601; client sent nothing further |
| [protocol.serverDiscover.method_not_found](../probe/runs/fast-agent@0.10.53/modern/both-stdio/protocol.serverDiscover.method_not_found/record.json) | modern | stdio | ? | 0.10.53 | server/discover at 2026-07-28 → error -32601; client sent nothing further |
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

From `evalstate/mcp-clients` at [`904917c5`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/904917c5574ca3c830de12131ed318dec05ea179/reports/dashboard-v1.json), report generated 2026-11-26, window 2026-09-27 to 2026-11-25. Grouped as `fast-agent` from wire names `fast-agent-mcp`. Tool calls by revision over the 30 days to 2026-11-25: `2026-07-28` 100%, `2025-11-25` <0.1%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| apps | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Research notes

- [fast-agent opens every connection with a 2026-07-28 discover probe](../research/fast-agent-leads-with-the-modern-discover-probe.md) — *idiosyncrasy*. A default fast-agent install sends `server/discover` at `2026-07-28` as the first request on every transport, and falls back to the `initialize` handshake only when that fails. It is the first client read here that leads with the stateless era rather than the handshake.
- [fast-agent watches server state through subscriptions/listen, and only there](../research/fast-agent-subscribes-only-on-the-modern-path.md) — *nuance*. On a 2026-07-28 connection fast-agent opens a `subscriptions/listen` stream and refreshes its whole cached view on any event. On the fallback handshake path it acts on `tools/list_changed` and drops the prompts and resources equivalents.
- [fast-agent reads resources and prompts, but only a person can trigger either](../research/fast-agent-resources-need-a-user-to-ask.md) — *nuance*. fast-agent calls `resources/read` and `prompts/get` properly. By default the model can call neither. Resources arrive as `@server:uri` mentions a user typed; prompts arrive through `/prompt` or the agent API. Three clients, three different answers to the same SHOULD.
- [fast-agent's capability declaration varies from server to server](../research/fast-agent-declares-capabilities-per-server.md) — *idiosyncrasy*. fast-agent builds its client capability object per connection, from that server's config. Sampling and elicitation are on by default, roots only when the server entry lists them. Two servers in one config file can see two different clients.
- [fast-agent declares roots.listChanged and never sends the notification](../research/fast-agent-never-sends-roots-list-changed.md) — *gap*. The Python SDK sets `roots.listChanged: true` whenever a client passes a roots callback, with no way to opt out. fast-agent's roots come from static config, so it never sends the notification. Two SDKs, three clients, same gap.
- [fast-agent implements SEP-2640 skills over MCP with wire types it defines itself](../research/fast-agent-ships-skills-over-mcp-ahead-of-the-sdk.md) — *in-flight*. fast-agent calls `skills/list`, `skills/get` and `resources/directory/read` against servers declaring the `io.modelcontextprotocol/skills` extension, verifying every resource against a SHA-256 digest. The Python SDK has none of these types, so fast-agent declares them itself.
- [notes/fast-agent-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/fast-agent-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the fast-agent source at d89956d.
- [mcp/server/apps.py:1-11,43,77](https://pypi.org/project/mcp/2.3.0/) — *extensions.io.modelcontextprotocol/ui*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0 ships MCP Apps as a server-side Extension only. The client side has the generic Client(extensions=[...]) and advertise() from SEP-2133 and no Apps host.
- [mcp/client/client.py:356-361](https://pypi.org/project/mcp/2.3.0/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0 and mcp-types 2.3.0 contain no events/* method or Events extension, only the generic extensions= field.

## Provenance

Read at `288b5339` on 2026-11-20, from `main` of https://github.com/evalstate/fast-agent.git. That commit was authored 2026-11-19.

**SDK.** The first Python-SDK read in the registry, and the first client on an SDK that speaks 2026-07-28. Both mcp and its split-out mcp-types are pinned to exactly 2.3.0 in pyproject.toml and resolve there in uv.lock; there is no [tool.uv] override and no vendored fork. src/fast_agent/patch/ is a Python port of codex apply_patch, not an SDK patch. The version range is entirely the SDK's — fast-agent names no revision of its own and picks an era instead, so pinsProtocolVersion would misstate what is happening: the SDK pins both ends of the range, and fast-agent chooses which end to try first.

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
- `src/fast_agent/core/harness_tools.py`
- `pyproject.toml`
- `uv.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/fast-agent.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

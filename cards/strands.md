# Strands Agents

Open source agent SDK from AWS with a Python binding (strands-agents) and a TypeScript binding (@strands-agents/sdk) in one repository. Each binding has its own MCP client class on the official SDK for its language, and both probe server/discover at 2026-07-28 before falling back to initialize. The rows describe a default construction of the Python binding on mcp 2.3.0, the one the probe ran. Row notes say where the TypeScript binding differs.

## At a glance

| | |
|---|---|
| Registry id | `strands` |
| Vendor | Amazon Web Services |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/strands-agents/harness-sdk> |
| Home | <https://strandsagents.com/> |
| Wire names | `mcp`, `strands-agents-ts-sdk` |
| SDK | `mcp` · declares `>=1.23.0,<2.4` · official Python SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-11-16 |
| Last read | 2026-11-16 |
| Probed | `1.64.0+mcp-2.3.0` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2026-07-28` |
| **Resources** | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2026-07-28` |
| **Prompts** | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ○ unsupported | read, declared | `2026-07-28` |
| **Elicitation** | ◇ opt-in | read, declared | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ◇ opt-in | read | `2026-07-28` |
| **Roots** | ○ unsupported | read, declared | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ◇ opt-in | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ list | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ cancel | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/oauth-client-credentials | ◐ partial | read | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sessionRecovery | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ callCancellation | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ traceContextPropagation | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ mcpRouterTool | ◇ opt-in | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — The application passes a transport factory, usually the SDK's stdio_client. MCPClient.load_servers builds one from a command entry, with ${VAR} interpolation and ~ expansion on command and cwd. TypeScript: StdioClientTransport, passed in or built by loadServers, in Node only. Under the auto negotiation that binding sets, the SDK probes server/discover on a second, disposable process started from the same command before it starts the session process.
- **transports.sse** — Reached by passing the SDK's sse_client as the transport factory, or by transport: "sse" on a load_servers entry. A url entry with no transport resolves to streamable-http. The auth key is rejected for SSE. TypeScript: the same rule in loadServers, with SSEClientTransport.
- **transports.streamableHttp** — MCPClient(url=...) builds the transport, and a url entry in load_servers defaults to it. On mcp 2.x Strands creates the SDK's HTTP client itself with the headers and auth and closes it with the transport. On mcp 1.x it calls streamablehttp_client. The url must be http or https. The probe ran this transport at 2026-07-28.
- **authentication.oauth** — Built in for the client_credentials grant only. The auth option takes a client id, a client secret and optional scopes, and Strands builds the SDK's ClientCredentialsOAuthProvider with in-memory token storage. The repo has no browser flow, callback server or token persistence. An application that wants the authorization code flow passes its own httpx.Auth as auth_provider, which Strands adapts to httpx2 on mcp 2.x. Strands passes no issuer to the provider, which mcp 2.3.0 documents as deprecated. Streamable HTTP only. TypeScript: the same two options, auth and authProvider.
- **authentication.header** — headers on MCPClient(url=...) and on a load_servers entry are sent on every request, for streamable HTTP and SSE. Values in a config entry take ${VAR} and ${env:VAR} interpolation, and an unset variable fails that server.
- **tools** — tools/list is paged to the end with no page cap, and is called without checking the server's tools capability. Tools keep their server names unless prefix is set, which gives <prefix>_<tool>. allowed and rejected filters take strings, regexes or callables. Two servers with a same-named tool fail registration unless a prefix separates them. outputSchema and annotations are copied onto the tool spec. TypeScript: the SDK aggregates pages with a cap of 64, and a prefixed name over 64 characters fails listing.
- **tools.listChanged** — Off unless the application registers on_tools_changed. With it, the client re-lists every page after a 0.3 second debounce, replaces its cached list and calls the callback. The agent's registry was filled once at construction, so the callback has to update it. At 2026-07-28 the client opens a subscriptions/listen stream at start, and only when the callback is already registered. TypeScript: on by default. The Agent sets onToolsChanged on every McpClient and swaps the refreshed tools into its registry.
- **tools.result** — content only. structuredContent and result _meta stay on the MCPToolResult for hooks and direct callers and are never sent to the model. The research note covers the Python binding.
- **tools.result.content** — Text blocks, embedded text resources and images reach the model. Audio and resource-link blocks are dropped. Empty content reaches the model as an empty result. A result with no content key fails SDK validation and the model sees the validation error.
- **tools.result.structuredContent** — Stored on the result under structuredContent whenever it is not null, and no provider converter reads it. With empty content and structuredContent present the model gets an empty result.
- **tools.result.outputSchema** — Validated by the SDK inside call_tool, not by Strands. A mismatch or a missing structuredContent becomes a tool error whose text is "Tool execution failed:" plus the SDK message. A task result fetched after polling is not validated.
- **tools.result.audience** — annotations are not read. A text block marked for the user reaches the model.
- **tools.result.isError** — The result status becomes error and the mapped content blocks carry the text.
- **tools.result.media** — JPEG, PNG, GIF and WebP images become image blocks. Any other image MIME type fails the whole call with a tool error. Audio and resource links are dropped.
- **tools.result._meta** — Copied to metadata on the result. Nothing sends it to the model or reads it to choose a route.
- **resources** — list_resources_sync, list_resource_templates_sync and read_resource_sync call the server and return the SDK's result models, one page per call. Nothing in the agent loop calls them, so a resource reaches the model only when application code puts it there. At 2026-07-28 a read that returns InputRequiredResult is retried through the elicitation callback. TypeScript: listResources, listResourceTemplates and readResource, aggregating pages when no token is given.
- **resources.listChanged** — The session message handler acts on tools list-changed only. A resources list-changed notification falls through it.
- **resources.subscribe** — No resources/subscribe call. The one subscriptions/listen stream Strands opens asks for tools list-changed only.
- **prompts** — list_prompts_sync and get_prompt_sync call the server and return the SDK's result models. Nothing in the agent loop calls them or turns a prompt into messages, so prompts are for application code. At 2026-07-28 a get that returns InputRequiredResult is retried through the elicitation callback. TypeScript: listPrompts and getPrompt, the same way.
- **prompts.listChanged** — Not handled. The message handler acts on tools list-changed only.
- **completions** — Neither binding calls completion/complete. The client's request methods are the tool, prompt, resource and task calls.
- **sampling** — ClientSession is built with no sampling callback and MCPClient has no parameter for one, so the capability is not declared and the SDK answers a request with an error. TypeScript: the capability object has no sampling key, and a task input request for sampling throws CapabilityNotSupported.
- **elicitation** — Not declared by default. Passing elicitation_callback to MCPClient declares it and routes requests to the callback. Strands ships no callback and no UI for one. At 2026-07-28 a tools/call, prompts/get or resources/read that returns InputRequiredResult is retried by Strands' own loop, up to 10 rounds, answering each embedded request through the same callback. load_servers has no key for a callback.
- **elicitation.form** — Served by the application's callback when one is passed.
- **elicitation.url** — The SDK declares url together with form whenever a callback is present, so the application's callback has to handle both. A -32042 error on a tool call becomes a tool error whose text carries the elicitation data, so the model receives the URL. TypeScript does the same.
- **roots** — No list_roots callback is passed and MCPClient has no parameter for one, so roots is not declared. TypeScript: no roots key, and a task input request for roots/list throws CapabilityNotSupported.
- **roots.listChanged** — Never sent. The capability is not declared.
- **logging** — No logging callback is passed, so the SDK's default discards notifications/message. logging/setLevel is never called and no log level is set for the per-request envelope. TypeScript differs: a notifications/message handler is always registered, and by default it writes each message to the Strands logger at a mapped level. logHandler replaces it. Neither binding sets a level.
- **instructions** — The instructions string from negotiation is stored on MCPClient.server_instructions. Nothing in the agent reads it, so it reaches the model only when the application copies it into a prompt. TypeScript: the serverInstructions getter, also unread by the agent.
- **icons** — The tool spec is built from name, description, inputSchema, outputSchema and annotations. No code in either binding's MCP client reads icons or websiteUrl.
- **extensions.io.modelcontextprotocol/oauth-client-credentials** — The client_credentials grant with a client secret, through the SDK's provider. Nothing is declared in capabilities.extensions for it. The SDK's private_key_jwt provider is not wired to the auth option, and an application would pass it as auth_provider.
- **extensions.io.modelcontextprotocol/ui** — No code in either binding reads _meta.ui, and the extension is not declared. A tool whose visibility leaves out the model is listed for the model like any other.
- **extensions.io.modelcontextprotocol/tasks** — Opt-in through tasks_config, and experimental in the docstrings. On mcp 2.x Strands declares the io.modelcontextprotocol/tasks extension. When the server advertises it and the connection negotiated 2026-07-28, a task handle returned by tools/call is completed for the caller: Strands polls tasks/get, answers input requests with tasks/update and sends tasks/cancel on timeout or cancellation. The overall wait defaults to 5 minutes. Manual submit, get, update and cancel methods exist. Declared in capabilities.extensions only when tasks_config is set and the wire speaks 2026-07-28. Strands defines the SEP-2663 result models itself and sends tasks/get, tasks/update and tasks/cancel through the session's send_request. TypeScript uses @modelcontextprotocol/ext-tasks 0.2.2 and sends task traffic as raw JSON-RPC through its own TaskTransport, because the SDK client does not expose extension methods.
- **extensions.io.modelcontextprotocol/tasks.list** — No tasks/list call on either SDK line.
- **extensions.io.modelcontextprotocol/tasks.cancel** — tasks/cancel is sent when a task-backed call times out or is cancelled, and by cancel_task_sync. Needs tasks_config.
- **bonusFeatures.modelInitiatedResourceRead** — The model gets no tool for resources/read. Resources are reachable through read_resource_sync from application code only, and the opt-in mcp_router tool has no resource command.
- **bonusFeatures.sessionRecovery** — auto_reconnect, off by default and not in a release tag yet: it landed after python/v1.65.0. A tool call that finds the session dropped or terminated stops the client, starts it again with up to four attempts inside one startup_timeout, and re-sends the call once. The docstring warns that a call that already reached the server may run twice. TypeScript has connect(true) and no automatic retry.
- **bonusFeatures.callCancellation** — The agent's cancel signal is passed to every MCP tool call. Setting it cancels the in-flight request and returns an error result marked cancelled. On mcp 1.x Strands sends notifications/cancelled itself with the request id it captured. On 2.x the SDK dispatcher sends it. For a task-backed call it sends tasks/cancel.
- **bonusFeatures.traceContextPropagation** — The active OpenTelemetry context is injected into params._meta of every tools/call, merged over the client-level or per-call meta. A comment there says the mcp 2.x dispatcher then overwrites traceparent with its own span. TypeScript differs: when a span is active it adds a _meta key inside the tool's arguments object, unless disableMcpInstrumentation is set.
- **bonusFeatures.mcpRouterTool** — An opt-in vended tool, make_mcp_router, lets the model connect to servers on a developer-set allowlist at run time and list and call their tools, up to 10 connections per agent. It builds each connection with MCPClient.load_servers. Both bindings have it.
- **byProtocolVersion.2025-11-25.tools.listChanged** — Still opt-in through on_tools_changed. The server pushes the notification without a subscription, so a callback set after start() also works. This is the path after a failed discover probe, and the only path on an mcp 1.x install.
- **byProtocolVersion.2025-11-25.extensions.io.modelcontextprotocol/tasks** — On mcp 2.x a 2025-11-25 server's tasks capability is not used: support is read from capabilities.extensions only, and the lifecycle methods raise unless the connection negotiated 2026-07-28. On an mcp 1.x install the legacy flow runs through session.experimental, for tools whose taskSupport is optional or required: call_tool_as_task, poll_task, then get_task_result. TypeScript runs the legacy flow on the 2.x SDK with raw tools/call, tasks/get and tasks/result requests. The extension itself is not declared on this revision: its result claim is active at 2026-07-28 only, so the SDK leaves it out of the initialize capabilities.

## Verified by the probe

68 records from the live probe (`probe/`), client version `1.64.0+mcp-2.3.0`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/strands.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.app_only/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.meta_only/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.with_meta/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.audience_user/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "[{\"text\":\"Tool execution failed: 2 validation errors for union[CallToolResult,fu" |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.empty_object/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.large/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "[{\"text\":\"Tool execution failed: 2 validation errors for union[CallToolResult,fu" |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.no_content_key/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.is_error/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.with_image/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as blocks) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.schema_match/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: Invalid structured content returned by tool probe_schema_" |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: Invalid structured content returned by tool probe_schema_" |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "[{\"text\":\"Tool execution failed: Invalid structured content returned by tool pro" |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.schema_mismatch/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: Invalid structured content returned by tool probe_schema_" |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.mirror/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.sc_empty/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.sc_null/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.sc_string/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "" |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "" |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "[]" |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.structured_only/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "" |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.summary_and_data/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |

## Where the evidence disagrees

- **elicitation** — recorded as `opt-in`, but declared-tier evidence at `2026-07-28` says `unsupported`.
  <br>canimcp-probe (2026-11-08) — The server/discover request and every later request carried io.modelcontextprotocol/clientCapabilities {} and clientInfo {"name":"mcp","version":"0.1.0"} (wire.jsonl). The server answered discover, so no initialize was sent.

## Research notes

- [Strands ships two MCP clients, and a server sees a different client from each](../research/strands-python-and-typescript-clients-differ.md) — *idiosyncrasy*. The Python and TypeScript bindings each wrap their language's official SDK and both probe server/discover first. They differ in wire name, tool list refresh, server logs, legacy tasks, and where trace context goes on a tool call.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [One Strands Python release runs on mcp 1.x or 2.x, and the installed major decides the protocol](../research/strands-python-speaks-two-sdk-majors.md) — *nuance*. strands-agents declares mcp>=1.23.0,<2.4 and commits no lockfile. A fresh install gets mcp 2.3.0 and probes 2026-07-28 first. An environment that holds mcp below 2 runs the same release on the initialize handshake at 2025-11-25.
- [Strands tells a server its own config key as the client name, or the SDK placeholder](../research/strands-sends-the-server-config-key-as-client-name.md) — *idiosyncrasy*. A Python MCPClient built directly sends clientInfo.name "mcp", the SDK placeholder. One built by load_servers sends the server's config key, so an entry named github sees a client called github. TypeScript defaults to strands-agents-ts-sdk.
- [dist/index.mjs:2886-2925,3400-3404](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1) — *transports.stdio*, read 2026-11-16 at `?` in @modelcontextprotocol/client. negotiateStdioViaSibling: the discover probe runs on a sibling process built from the same parameters, and the session transport starts once the era is known.
- [mcp/client/auth/extensions/client_credentials.py:67-167](https://pypi.org/project/mcp/2.3.0/) — *authentication.oauth*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. The provider sets client_info directly and skips dynamic registration. Omitting issuer is deprecated and whichever authorization server discovery yields is used. The resource parameter is added to the token request.
- [mcp/client/auth/oauth2.py:218-232,646-662](https://pypi.org/project/mcp/2.3.0/) — *authentication.oauth*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. Protected resource metadata discovery and the resource-parameter rule are in the base provider flow.
- [dist/index.mjs:3026,3151,3778-3800](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1) — *tools*, read 2026-11-16 at `?` in @modelcontextprotocol/client. DEFAULT_LIST_MAX_PAGES = 64 and the page walk that throws past it.
- [notes/strands-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/strands-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Strands source at 46cbb8c.
- [mcp/client/session.py:249-256,629-633](https://pypi.org/project/mcp/2.3.0/) — *sampling*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. sampling is declared only when a sampling callback was passed.
- [mcp/client/session.py:634-638](https://pypi.org/project/mcp/2.3.0/) — *elicitation.url*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. form and url are declared together.
- [mcp/client/session.py:639-646](https://pypi.org/project/mcp/2.3.0/) — *roots*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. roots is declared only when a list_roots callback was passed.
- [mcp/client/session.py:278-281,1483-1485](https://pypi.org/project/mcp/2.3.0/) — *logging*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. The default logging callback is a no-op.
- [mcp/client/session.py:614-628](https://pypi.org/project/mcp/2.3.0/) — *extensions.io.modelcontextprotocol/tasks*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. An extension whose result claims are all inactive at the wire version is left out of the capability object.
- [mcp/client/session.py:614-628,651-664](https://pypi.org/project/mcp/2.3.0/) — *byProtocolVersion.2025-11-25.extensions.io.modelcontextprotocol/tasks*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. initialize builds capabilities for LATEST_HANDSHAKE_VERSION, where no claim is active.

## Provenance

Read at `d982a0d4` on 2026-11-16, from `main` of https://github.com/strands-agents/harness-sdk.git. That commit was authored 2026-11-16.

**SDK.** This block is the Python binding. mcp is a base dependency of strands-agents, declared as a range across two majors, and no Python lockfile is committed, so there is no resolved version to record. On 2026-11-16 the newest release in range, and the newest on PyPI, is mcp 2.3.0. The probe's environment resolved the same on 2026-11-08. The SDK behaviour cited in this entry was read from the mcp 2.3.0 and mcp-types 2.3.0 wheels. A _compat module branches on whether ClientSession has a discover method, so an environment that holds mcp below 2 runs the same Strands release on the initialize handshake only. The hatch test override that caps mcp below 2.0.0 applies to one CI job. No vendored copy and no dependency patch. On mcp 1.x only, Strands wraps two server-side SDK classes with wrapt at import time for trace context, which does not touch the client. Strands names no revision for ordinary calls: the version lists are the SDK's, and calling the SDK's negotiate_auto is Strands' choice, so pinsProtocolVersion is left unset. The one literal is 2026-07-28 for tasks. The TypeScript binding declares @modelcontextprotocol/client ^2.0.0 as a required peer dependency, resolved to 2.3.1 in the root package-lock.json, unpatched, with versionNegotiation mode auto. Its task code subclasses the SDK Client to call the private _outboundMetaEnvelope and mirrors private fields of the SDK stdio transport. @modelcontextprotocol/sdk ^1.32.1 is a dev dependency there, used by tests and fixtures.

Paths read:

- `strands-py/src/strands/tools/mcp/mcp_client.py`
- `strands-py/src/strands/tools/mcp/_compat.py`
- `strands-py/src/strands/tools/mcp/mcp_agent_tool.py`
- `strands-py/src/strands/tools/mcp/mcp_tasks.py`
- `strands-py/src/strands/tools/mcp/mcp_types.py`
- `strands-py/src/strands/tools/mcp/mcp_instrumentation.py`
- `strands-py/src/strands/tools/registry.py`
- `strands-py/src/strands/vended_tools/mcp_router/mcp_router.py`
- `strands-py/pyproject.toml`
- `strands-py/docs/MCP_VERSIONS.md`
- `strands-ts/src/mcp/client.ts`
- `strands-ts/src/mcp/config.node.ts`
- `strands-ts/src/mcp/task-transport.ts`
- `strands-ts/src/tools/mcp-tool.ts`
- `strands-ts/src/agent/agent.ts`
- `strands-ts/package.json`
- `package-lock.json`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/strands.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

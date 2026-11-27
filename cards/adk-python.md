# Google ADK (Python)

Google's Agent Development Kit for Python. An LlmAgent reaches MCP servers through McpToolset, ADK's own session pool and tool wrapper over the official Python SDK's ClientSession. A default construction sends clientInfo google-adk, declares no client capabilities and runs the initialize handshake at 2025-11-25. The SDK is an optional extra that admits 1.x and 2.x, and 2026-07-28 needs SDK 2.x plus the default-off ADK_ENABLE_MCP_MODERN_PROTOCOL switch.

## At a glance

| | |
|---|---|
| Registry id | `adk-python` |
| Vendor | Google |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/google/adk-python> |
| Home | <https://adk.dev/> |
| Wire names | `google-adk` |
| SDK | `mcp` · declares `>=1.24,<3` · official Python SDK · unpatched |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28`. What differs on `2025-11-25` is listed under "On 2025-11-25" below |
| Source last updated | 2026-11-25 |
| Last read | 2026-11-27 |
| Probed | `2.14.0` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ● full | read ⇧ | `2025-11-25` |
| **Resources** | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read | `2025-11-25` |
| **Roots** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ○ unsupported | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2025-11-25`, `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ protocolEraForcing | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sessionRecovery | · untested | read | `2025-11-25` |
| &nbsp;&nbsp;↳ toolDescriptionFencing | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ gracefulToolErrors | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ traceContextPropagation | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ providerManagedMcp | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## On 2025-11-25

When a server's newest revision is `2025-11-25`, Google ADK (Python) negotiates it and these rows differ from the table above. Every other row holds on `2025-11-25` too.

| Capability | Status | Known by | At |
|---|---|---|---|
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ sessionRecovery | ● full |  |  |

- **sampling** — Not declared by a default construction, and ADK ships no handler. McpToolset takes an optional sampling_callback and sampling_capabilities and passes them to ClientSession, and the SDK declares sampling when the callback is present. The handler and the model it calls are the application's.
- **elicitation** — Not declared by a default construction, and ADK ships no handler. McpToolset takes an optional elicitation_callback and passes it to ClientSession. No code under src supplies a callback, so the user-input and tool-confirmation flows ADK has for its own tools are not connected to MCP elicitation.
- **logging** — No logging_callback is passed, so the SDK default discards notifications/message. logging/setLevel is never called. An application that passes message_handler receives log notifications along with every other server notification.
- **bonusFeatures.sessionRecovery** — When a server reports that it no longer holds the session, ADK drops the pooled session, opens a new one and retries the tool call once. It recognises the SDK's code 32600 on 1.x and INVALID_REQUEST with the message Session terminated on 2.x. A transport failure in the middle of a tool call is not retried. tools/list and session setup are retried once on any error.

## What the table flattens

- **transports.stdio** — StdioConnectionParams wraps the SDK's StdioServerParameters and goes to stdio_client with an errlog stream that defaults to sys.stderr. One session is pooled per toolset. The timeout field defaults to 5 seconds, bounds connect plus initialize, and is also the ClientSession read timeout for every stdio request. An agent config file cannot declare a stdio server unless ADK_ALLOW_CONFIG_STDIO_MCP_SERVERS is set.
- **transports.sse** — Chosen by passing SseConnectionParams. ADK does not detect the transport from a URL and does not fall back from one HTTP transport to the other. Headers, a 5 second timeout and a 300 second read timeout go to the SDK's sse_client.
- **transports.streamableHttp** — Chosen by passing StreamableHTTPConnectionParams. ADK builds the HTTP client itself, with the merged headers and a 5 second timeout with a 300 second read timeout, and hands it to the SDK's streamable_http_client. terminate_on_close defaults to true. Sessions are pooled per merged header set and closed after 900 seconds idle. ADK sets no MCP-Protocol-Version header of its own. The Agent Registry and API Registry integrations build this transport.
- **authentication.oauth** — The flow is ADK's generic tool-auth framework, and the SDK's OAuth client is not used. The application passes an auth_scheme and an auth_credential with a registered client id. ADK builds the authorization URL, hands it to the application in an adk_request_credential function call, exchanges the code, refreshes the token and sends it as a Bearer header. Nothing reads a 401 challenge. Protected resource metadata discovery is defined and has no caller under src. Authorization server metadata is fetched only for an ExtendedOAuth2 scheme that carries an issuer_url. There is no dynamic registration, no client ID metadata document and no resource parameter. PKCE S256 is used when the credential has no client secret or asks for it.
- **authentication.header** — Static headers on the connection params, a header_provider callback evaluated per request context, and headers derived from an auth_credential: Bearer, Basic, other HTTP schemes and header API keys. Auth headers win over header_provider on a name collision. ADK adds its own User-Agent and x-goog-api-client tokens. When google-auth would use a client certificate, the HTTP transport switches to mTLS and attaches Application Default Credentials as a Bearer token for https googleapis.com hosts only.
- **tools** — One tools/list request per listing with no cursor, so a second page is never fetched. The list is fetched once per invocation unless tool_list_cache_ttl_seconds is set. tool_filter and tool_name_prefix select and rename tools. A tool whose name matches one of five reserved ADK function names is skipped. Tools are sorted by name. Each description and each schema description is wrapped in untrusted-content markers before it reaches the model. ADK passes an application progress_callback to call_tool and passes none by default.
- **tools.listChanged** — No handler. The McpToolset docstring says ADK does not subscribe to notifications/tools/list_changed. An application can pass message_handler to receive server notifications, and that handler does not invalidate the tool-list cache. A changed list is seen at the next listing.
- **tools.result** — The SDK CallToolResult is dumped to a plain dict with content, structuredContent, isError and meta, and the whole dict is the function response. What the model receives then depends on the model backend. The default Gemini backend sends the dict as built. AnthropicLlm sends the content text when content is non-empty.
- **tools.result.content** — The Gemini, Interactions, LiteLLM and Apigee backends receive the whole dict, content included. AnthropicLlm sends the text of the content blocks joined with newlines, and the JSON of the whole dict when content is empty. No placeholder stands in for an empty array.
- **tools.result.structuredContent** — A key of the same dict on the Gemini, Interactions, LiteLLM and Apigee backends, next to content and with no deduplication. AnthropicLlm drops it whenever content is non-empty. A null value is removed by the dump. On a handshake session the SDK rejects a non-object value and the model receives an error dict.
- **tools.result.outputSchema** — Validated by the SDK inside call_tool. ADK runs no validation of its own. On a mismatch the model receives only {"error": "Unexpected error during MCP tool execution: ..."}. The schema is also sent to Gemini as response_json_schema and rendered into the tool description on LiteLLM.
- **tools.result.audience** — Nothing on the model path reads annotations.audience. The annotations stay inside each block dict.
- **tools.result.isError** — The flag is one key of the dict and the error text stays in content. The Anthropic and Interactions backends also set is_error on the tool result.
- **tools.result.media** — Image, audio and embedded-resource blocks stay dicts inside content. They reach the model as JSON with inline base64, or as the Python str() of the dict on Anthropic. None is converted to a media part.
- **tools.result._meta** — The result _meta is the meta key of the dict on the backends that send the whole dict, and it does not change the route. meta.adk_grounding_metadata is copied to the response grounding metadata when propagate_grounding_metadata is set.
- **resources** — Off by default. With use_mcp_resources=True the toolset adds a load_mcp_resource tool that the model calls with resource names. ADK lists resource names into the instructions on every model request, maps a name to a URI with another resources/list, reads it, and appends the contents to the next request as user turns. One page of resources/list, no cursor. Resource templates are never listed.
- **resources.listChanged** — No handler. The names are listed again on every model request while use_mcp_resources is on.
- **resources.subscribe** — resources/subscribe is never called. A search of src for subscribe_resource finds nothing.
- **prompts** — One use: McpInstructionProvider fetches a named prompt and returns it as the agent instruction. It calls prompts/get with the arguments given to the provider (a mapping, a function of the context, or none) and joins the text of the messages. Non-text content and message roles are dropped. Prompts are not offered to a user or to the model. The provider opens its own session with no callbacks and no header_provider.
- **prompts.listChanged** — No handler. The provider calls prompts/get each time the instruction is resolved.
- **completions** — No completion/complete call. A search of src for a ClientSession.complete call finds nothing.
- **sampling** — On this path a server asks for sampling inside an InputRequiredResult. ADK calls call_tool without allow_input_required, the SDK raises, and the model receives an error dict. An application sampling_callback is still advertised in each request and is not called for tool calls. Read from source, not run.
- **elicitation** — Same as sampling: an InputRequiredResult from tools/call raises in the SDK and becomes an error dict, so an application elicitation_callback is declared and not called. Read from source, not run.
- **elicitation.form** — Reached only through an application elicitation_callback.
- **elicitation.url** — The SDK declares form and url together whenever a callback is passed, so an application cannot declare one without the other.
- **roots** — No list_roots_callback is passed to ClientSession, and McpToolset has no parameter for one. The SDK default answers roots/list with an error.
- **roots.listChanged** — Never sent. A search of src for send_roots_list_changed finds nothing.
- **logging** — ClientSession is built without log_level, so no request opts in to log delivery.
- **instructions** — The initialize result is discarded after the handshake. Nothing under src reads the server instructions string.
- **icons** — No icon field is read. McpTool keeps the tool title, from title or annotations.title, and nothing else from the display metadata.
- **jsonSchema** — ADK validates neither tool arguments nor results itself. The input schema goes to the model as parameters_json_schema when JSON_SCHEMA_FOR_FUNC_DECL is on, which is the registry default, and is converted to a Gemini Schema otherwise. The output schema is checked by the SDK, which picks a jsonschema validator class from the schema's own $schema.
- **extensions.io.modelcontextprotocol/ui** — McpTool reads _meta.ui.resourceUri, or the flat ui/resourceUri key, from the tool definition. After a successful call it adds a UiWidget with provider mcp to the event actions, carrying the resource URI, the tool definition and the call arguments. ADK does not declare the extension, does not fetch the ui:// resource, and has no caller for the visibility property, so an app-only tool is still offered to the model. The bundled dev UI under src/google/adk/cli/browser has no reference to the widget field.
- **extensions.io.modelcontextprotocol/tasks** — No tasks request of any kind, and no experimental task handlers are passed to ClientSession on SDK 1.x.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. ClientSession gets no extensions, and no skills/list, skills/get or resources/directory/read request is sent. ADK's SkillToolset and its list_skills tool serve skills given to the toolset in code, not skills from MCP servers.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. ClientSession gets no extensions, and no events/* request is sent. Neither mcp 1.28.1 nor 2.3.0 has an events client.
- **extensions.io.modelcontextprotocol/events.poll** — events/poll is never sent.
- **extensions.io.modelcontextprotocol/events.push** — events/stream is never sent and notifications/events/* has no handler.
- **extensions.io.modelcontextprotocol/events.webhook** — events/subscribe is never sent.
- **bonusFeatures.modelInitiatedResourceRead** — Opt-in through use_mcp_resources=True. One tool, load_mcp_resource, which takes resource names and has no URI argument. The tool result is a status stub and the contents are appended to the next model request.
- **bonusFeatures.protocolEraForcing** — One process-wide switch. ADK_ENABLE_MCP_MODERN_PROTOCOL, or override_feature_enabled on the private _MCP_MODERN_PROTOCOL member, moves every connection from handshake-only to a server/discover probe with handshake fallback. It needs SDK 2.x. There is no per-server setting and no modern-only mode.
- **bonusFeatures.sessionRecovery** — The recovery path keys on the session-terminated error that the SDK raises for a dropped Mcp-Session-Id. Whether anything triggers it on a connection with no session id was not checked.
- **bonusFeatures.toolDescriptionFencing** — Every MCP tool description, and every description inside its input and output schema, is wrapped in BEGIN_UNTRUSTED_TOOL_DESCRIPTION and END_UNTRUSTED_TOOL_DESCRIPTION markers when the declaration goes to the model. One preamble is added to the system instruction saying the quoted text is data.
- **bonusFeatures.gracefulToolErrors** — On by default. An McpError or any other exception from a tool call becomes an {"error": ...} dict for the model. ADK_DISABLE_MCP_GRACEFUL_ERROR_HANDLING turns it off and the exception reaches the runner. A comment in mcp_tool.py says the flag is off by default, and the registry sets default_on=True.
- **bonusFeatures.traceContextPropagation** — The OpenTelemetry propagator writes the current trace context into the _meta of each tools/call. An empty carrier sends no _meta. The default probe captures show tools/call with no _meta.
- **bonusFeatures.providerManagedMcp** — ManagedAgent takes RemoteMcpServer specs and forwards the URL, headers and allowed tools to the Interactions API as an mcp_server tool param. The backend opens the MCP session. ADK speaks no MCP to that server.

## Verified by the probe

85 records from the live probe (`probe/`), client version `2.14.0`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/adk-python.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.app_only/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.app_only/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.meta_only/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.meta_only/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.with_meta/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.with_meta/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.audience_user/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.audience_user/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [empty_object](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [empty_object](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: 1 validation error for Ca" |
| [empty_object](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.empty_object/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 2 validation errors for un" |
| [empty_object](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.empty_object/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| [large](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [large](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.large/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.large/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [no_content_key](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [no_content_key](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [no_content_key](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: 1 validation error for Ca" |
| [no_content_key](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.no_content_key/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 2 validation errors for un" |
| [no_content_key](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.no_content_key/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.is_error/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.is_error/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.with_image/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.with_image/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.schema_match/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.schema_match/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: Invalid structured content" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: Invalid structured content" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: Invalid structured conten" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.schema_mismatch/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: Invalid structured content" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.schema_mismatch/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | payload once (as json) |
| [mirror](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.mirror/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.mirror/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.sc_empty/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.sc_empty/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.sc_null/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.sc_null/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_string](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [sc_string](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [sc_string](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: 1 validation error for Ca" |
| [sc_string](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.sc_string/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [sc_string](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.sc_string/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| [structured_only](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.structured_only/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.structured_only/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.summary_and_data/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.summary_and_data/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

## Research notes

- [ADK Python's resource tool is opt-in and takes resource names, never URIs](../research/adk-python-loads-resources-by-name.md) — *idiosyncrasy*. With use_mcp_resources=True, McpToolset adds one tool, load_mcp_resource. The model passes resource names, ADK maps each name to a URI through resources/list, and the contents are appended to the next model request as user turns. The default is off.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [ADK Python declares no client capabilities unless the application passes callbacks](../research/adk-python-declares-no-client-capabilities-by-default.md) — *nuance*. A default McpToolset sends an empty capability object. Passing sampling_callback or elicitation_callback makes the SDK declare them. There is no roots or logging parameter, and on 2026-07-28 an input_required tool result raises before any callback runs.
- [ADK Python speaks 2026-07-28 only on MCP SDK 2.x with ADK_ENABLE_MCP_MODERN_PROTOCOL set](../research/adk-python-modern-protocol-needs-sdk-2-and-a-flag.md) — *nuance*. At c6586f19 a default ADK install runs the initialize handshake at 2025-11-25. server/discover needs MCP SDK 2.x and the default-off ADK_ENABLE_MCP_MODERN_PROTOCOL switch. mcp is an optional extra, and four of ADK's five constraints files pin SDK 1.28.1.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *tools*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. list_tools sends one request and takes the cursor only through params.
- [notes/adk-python-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/adk-python-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the ADK source at 287c0b0. Between 287c0b0 and c6586f19 no file under src/google/adk/tools/mcp_tool changed.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *sampling*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. An InputRequiredResult raises RuntimeError unless allow_input_required is true.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *elicitation*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *elicitation.url*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *logging*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. The log-level _meta key is stamped only when log_level is set.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *jsonSchema*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. validator_for(output_schema) with an empty registry.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0 wheel, pinned by constraints-3.15.txt. Client extensions are only what the caller passes in extensions=; 2.3.0 ships no skills or events client.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.28.1/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 1.28.1 wheel, pinned by constraints-3.11.txt to 3.14.txt. ClientCapabilities has no extensions field.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0 wheel, pinned by constraints-3.15.txt. Client extensions are only what the caller passes in extensions=; 2.3.0 ships no skills or events client.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.28.1/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 1.28.1 wheel, pinned by constraints-3.11.txt to 3.14.txt. ClientCapabilities has no extensions field.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *byProtocolVersion.2025-11-25.sampling*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. _build_capabilities declares sampling, elicitation and roots only when a non-default callback was passed.
- [mcp/client/session.py](https://pypi.org/project/mcp/2.3.0/) — *byProtocolVersion.2025-11-25.logging*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 2.3.0. The default logging callback is a no-op, and a log notification goes to it and then to message_handler.

## Provenance

Read at `03725e8c` on 2026-11-27, from `main` of https://github.com/google/adk-python.git. That commit was authored 2026-11-25.

**SDK.** No resolved version is recorded because the repo commits no lockfile. mcp>=1.24,<3 is declared in the mcp, all and test extras and is absent from the base dependencies, so a plain pip install google-adk installs no MCP SDK. The repo commits five uv pip compile outputs that the README recommends as pip constraints: constraints-3.11.txt to constraints-3.14.txt pin mcp==1.28.1, and constraints-3.15.txt pins mcp==2.3.0 with mcp-types==2.3.0. Observed 2026-11-08: the probe's install of google-adk[mcp]==2.14.0 with no constraints file resolved mcp 2.3.0. Observed 2026-11-16: 2.3.0 is the newest mcp on PyPI. Not patched: there is no patches directory, [tool.uv] holds a path source for google-adk itself and uv settings (required-version, exclude-newer), none for the SDK, and no copy of the SDK is vendored. Every SDK import goes through src/google/adk/dependencies/_mcp.py, which tries the 2.x module paths first, sets IS_MCP_SDK_V2 and imports the private mcp.client._probe.negotiate_auto when it exists. Its docstring says Google's internal build swaps that file for one naming a vendored copy, which the open-source build does not use. ADK names no protocol revision. It picks the era, handshake unless ADK_ENABLE_MCP_MODERN_PROTOCOL is set, and the revision strings are the SDK's: 2025-11-25 is LATEST_PROTOCOL_VERSION in 1.28.1 and LATEST_HANDSHAKE_VERSION in 2.3.0. pinsProtocolVersion is left unset because the newest revision 2.3.0 pins is 2026-07-28, which a default ADK install does not offer. SDK constants and behaviour cited in this entry were read from the PyPI wheels mcp 2.3.0, mcp-types 2.3.0 and mcp 1.28.1.

Paths read:

- `src/google/adk/tools/mcp_tool/session_context.py`
- `src/google/adk/tools/mcp_tool/mcp_session_manager.py`
- `src/google/adk/tools/mcp_tool/mcp_toolset.py`
- `src/google/adk/tools/mcp_tool/mcp_tool.py`
- `src/google/adk/tools/load_mcp_resource_tool.py`
- `src/google/adk/agents/mcp_instruction_provider.py`
- `src/google/adk/dependencies/_mcp.py`
- `src/google/adk/dependencies/_httpx.py`
- `src/google/adk/features/_feature_registry.py`
- `src/google/adk/integrations/agent_registry/agent_registry.py`
- `src/google/adk/integrations/api_registry/api_registry.py`
- `src/google/adk/tools/_remote_mcp_server.py`
- `src/google/adk/auth`
- `pyproject.toml`
- `constraints-3.11.txt`
- `constraints-3.12.txt`
- `constraints-3.13.txt`
- `constraints-3.14.txt`
- `constraints-3.15.txt`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/adk-python.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

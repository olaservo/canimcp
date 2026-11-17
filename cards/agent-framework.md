# Microsoft Agent Framework

Microsoft's agent framework, one repository with a Python binding and a .NET binding. The Python binding has its own MCP client class, MCPTool, built on the Python SDK's Client, and the capability rows describe it. The .NET binding has no client class: the application builds an McpClient with the C# SDK and the framework wraps its tools. Notes on each row say where .NET differs.

## At a glance

| | |
|---|---|
| Registry id | `agent-framework` |
| Vendor | Microsoft |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/microsoft/agent-framework> |
| Home | <https://learn.microsoft.com/agent-framework/overview/agent-framework-overview> |
| Wire names | `mcp` |
| SDK | `mcp` 2.3.0 · declares `>=2.2.0,<3` · official Python SDK · unpatched · pins `2026-07-28` |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-11-16 |
| Last read | 2026-11-16 |
| Probed | `1.25.0` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ websocket | ○ unsupported | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2026-07-28` |
| **Resources** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2026-07-28` |
| **Prompts** | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25`, `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ tools | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read | `2026-07-28` |
| **Roots** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ◐ partial | read | `2025-11-25`, `2026-07-28` |
| **Instructions** | ○ unsupported | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **Tasks** | ○ unsupported | read | `2026-07-28` |
| **JSON Schema** |  |  |  |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ deferredToolLoading | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ providerManagedMcp | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ openTelemetryTraceContext | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — MCPStdioTool passes command, args, env and encoding to the SDK's stdio_client. Extra keyword arguments go into StdioServerParameters. .NET: the framework builds no stdio client. An application passes its own McpClient, on any transport the C# SDK offers.
- **transports.sse** — The Python binding has no SSE transport class. The exported MCP tool classes are MCPStdioTool, MCPStreamableHTTPTool and the MCPWebsocketTool stub, and streamable_http_client is the only HTTP transport imported. .NET: both clients the framework builds set HttpTransportMode.StreamableHttp, with a comment that this stops the client negotiating down to HTTP+SSE. An application-built McpClient gets the C# SDK default, AutoDetect.
- **transports.streamableHttp** — MCPStreamableHTTPTool calls the SDK's streamable_http_client, with terminate_on_close defaulting to true. The httpx2 client the framework makes follows redirects, uses a 30 second timeout with a 300 second read timeout, and stores no response cookies. An application can pass its own httpx2.AsyncClient. .NET: DefaultMcpToolHandler builds one Streamable HTTP client per invocation and FoundryToolboxService one per response, both with the standalone GET stream off.
- **transports.websocket** — MCPWebsocketTool is still exported and marked deprecated. Its get_mcp_client raises RuntimeError, so it cannot connect.
- **authentication.oauth** — MCPStreamableHTTPTool has no auth parameter, and no file under python/packages imports mcp.client.auth. An application can pass its own httpx2.AsyncClient through http_client and attach the SDK's OAuth provider to it. The framework does not set that up. FoundryToolbox authenticates with a bearer token from an Azure credential. .NET: neither client the framework builds sets HttpClientTransportOptions.OAuth. The Agent_MCP_Server_Auth sample sets it on a transport the application builds, which is the C# SDK's feature.
- **authentication.header** — static_headers and header_provider add headers to requests whose origin matches the configured url, and remove them when a redirect leaves that origin. header_provider receives the run's keyword arguments. The header set used to connect is bound to the session, and a run with a different set reconnects first. .NET: DefaultMcpToolHandler passes the workflow's headers as AdditionalHeaders and rejects a Host header.
- **tools** — tools/list is called only when the server declares the tools capability. Pages are followed by cursor up to 100 pages and 1,000 tools, and discovery fails past either limit. On 2026-07-28 the SDK's response cache honours ttlMs and cacheScope. A tool whose execution.taskSupport is required is skipped with a warning. Names are normalised to A-Za-z0-9_.- with an optional tool_name_prefix, and no server prefix by default. An object inputSchema without properties gets an empty one. Call arguments are filtered to the properties the schema declares. approval_mode defaults to None, so calls run without approval. Tool _meta from tools/list is sent back as request _meta on tools/call.
- **tools.listChanged** — On 2026-07-28 the framework opens Client.listen for tools and prompts when the server capability sets listChanged, and reloads the catalog on each event. A lost subscription is reopened with backoff from 0.1 to 2 seconds after a full reload. On the handshake path notifications/tools/list_changed schedules the same reload. A reload keeps the existing FunctionTool for a tool whose remote name is unchanged, so a changed description or inputSchema does not reach the model. A caller-owned Client on a handshake-era server gets no automatic refresh. .NET: no list-changed handling in dotnet/src.
- **tools.result** — tool_result_content defaults to structured_first: when structuredContent is present, one JSON text block replaces every content block. The other modes are content_first, content_only, structured_only and both, set per MCPTool, and parse_tool_results replaces the parser. .NET differs: the C# SDK's McpClientTool returns native content only when the result has no isError, no structuredContent and no application _meta, and otherwise the whole CallToolResult as JSON.
- **tools.result.structuredContent** — Under the default mode, json.dumps of structuredContent is the only block the model receives whenever the field is not null. A JSON null is treated as absent. .NET: it reaches the model inside the serialized CallToolResult.
- **tools.result.content** — Under the default mode content reaches the model only when structuredContent is absent. content_first, content_only and both keep it. .NET: native content when nothing else is present, otherwise inside the JSON envelope.
- **tools.result.outputSchema** — The framework does not read outputSchema. mcp 2.3.0 validates structuredContent against it and raises on a mismatch or a missing value, and the model sees 'Error: Function failed.' .NET: surfaced as ReturnJsonSchema and not validated.
- **tools.result.audience** — annotations are not read on the tool-result path in either binding. A block marked for the user is handled like any other.
- **tools.result.isError** — An isError result raises, and the model sees 'Error: Function failed.' The tool's own error text is appended only when include_detailed_errors is set. .NET: the result is returned as the JSON envelope with isError in it.
- **tools.result.media** — Under the default mode non-text blocks are dropped with the text when structuredContent is present. Otherwise images and audio become data content, and the provider converter decides: Chat Completions drops them, Responses and Anthropic keep images.
- **tools.result._meta** — Result _meta is copied onto each item as additional_properties and no provider converter sends it to the model. The security middleware reads _meta.ifc for integrity and confidentiality labels. .NET: any application _meta key switches the result to the JSON envelope, which includes it.
- **resources** — MCPTool never calls resources/list, resources/templates/list or resources/read. The connection wrapper has a read_resource method, and its callers are the experimental MCPSkillsSource and FoundryToolbox, both for skill files. .NET: resources/read is called only by AgentMcpSkill, for the same purpose.
- **resources.listChanged** — Client.listen is opened for tools and prompts only, and the handshake-era handler has no resources case.
- **resources.subscribe** — resources/subscribe is never called. The connection wrapper has no subscribe method.
- **prompts** — prompts/list is paginated like tools/list, and each prompt is added to the same function list as the tools, so the model can call it. A call sends prompts/get and returns the messages as one string: text as it is, other content as JSON, roles dropped. load_prompts defaults to true. Nothing puts a prompt into the conversation as messages. .NET: no prompts call in dotnet/src.
- **prompts.listChanged** — Same mechanism as tools: Client.listen on 2026-07-28, notifications/prompts/list_changed on the handshake path. On reload a prompt function is rebuilt when its description or parameters changed.
- **completions** — completion/complete is never called. The connection wrapper has no completion method. .NET: none in dotnet/src.
- **sampling** — Every framework-owned connection declares sampling, because MCPTool always passes its sampling_callback and the SDK declares the capability for any callback that is not its default. A default construction has no chat client, and the callback answers -32603 'No chat client available'. With a chat client and no sampling_approval_callback it answers -32600 and logs a warning. With both, the request goes to the chat client with maxTokens capped at 4096 and at most 25 requests per session. The framework marks its own sampling support deprecated. The probe's wire capture at 1.25.0 shows clientCapabilities {"sampling":{}} on every request. .NET: the clients the framework builds register no SamplingHandler and declare none.
- **sampling.tools** — sampling.tools is declared only when a chat client is set. The request tools are passed to the chat client as schema-only functions, and tool calls come back as CreateMessageResultWithTools with stopReason toolUse.
- **sampling.context** — sampling_callback does not read includeContext or modelPreferences.
- **elicitation** — No elicitation_callback is passed to Client, so the SDK declares no elicitation capability and its default callback answers any request with -32600. .NET: framework code registers no ElicitationHandler. TaskAwareMcpClientAIFunction resolves a task's input requests through the application's McpClient, so the application's handlers decide.
- **roots** — No list_roots_callback is passed to Client, so roots is not declared. .NET: C# SDK 2.2.0 adds an empty roots capability when the application sets a RootsHandler, and no file in dotnet/src sets one.
- **roots.listChanged** — Not declared and never sent. .NET: in C# SDK 2.2.0 listChanged is a nullable property the application sets on Capabilities.Roots. The SDK does not set it when it adds the capability for a RootsHandler.
- **logging** — logging_callback writes each notifications/message to the agent_framework._mcp Python logger at the mapped level. The level sent to the server is that logger's own level at connect time, not its effective level. With the level unset nothing is sent: on 2026-07-28 no request carries the logLevel opt-in and no messages arrive, and on the handshake path logging/setLevel is not called and the server's default applies. .NET: no logging call in dotnet/src.
- **instructions** — The server's instructions string is not read. After connecting the framework reads protocol_version, server_capabilities and initialize_result. The word instructions appears in _mcp.py once, for the system prompt of a sampling request. .NET: no ServerInstructions reference in dotnet/src.
- **icons** — A tool becomes a FunctionTool with a name, a description and an input schema. icons, title and websiteUrl are not read.
- **tasks** — task_options is accepted, ignored and warned as deprecated, with the message that the Python SDK does not expose the 2026 Tasks extension runtime. Tools that require tasks are left out of the catalog. .NET differs: see the io.modelcontextprotocol/tasks extension row.
- **jsonSchema** — inputSchema is passed to FunctionTool unchanged, apart from an empty properties added to an object schema that has none. Whether FunctionTool validates the model's arguments against it was not read. A prompt's arguments are turned into an object schema of string properties. outputSchema validation is the SDK's.
- **extensions.io.modelcontextprotocol/skills** — Python: MCPSkillsSource is experimental and opt-in, on a Client the application supplies. It reads skill://index.json with resources/read and loads skill-md and archive entries from it. It does not call skills/list or skills/get, does not check the server's extensions capability, and declares nothing. .NET: AgentMcpSkillsSource returns no skills unless the server declares io.modelcontextprotocol/skills, then sends skills/list and skills/get through McpClient.SendRequestAsync with result types it defines itself, and reads files with resources/read.
- **extensions.io.modelcontextprotocol/tasks** — Python: not supported, as the tasks row says. .NET: McpClient.ListAgentToolsWithTasksAsync wraps each tool so a call goes through CallToolAsTaskAsync from ModelContextProtocol.Extensions.Tasks 2.2.0. The wrapper polls with GetTaskAsync, answers input_required with UpdateTaskAsync, and calls CancelTaskAsync when the local call is cancelled. It is opt-in and ships in Microsoft.Agents.AI.Mcp, which carries an alpha version suffix. The Extensions.Tasks source was not read at 2.2.0, so what it puts on the wire is not recorded here.
- **extensions.io.modelcontextprotocol/ui** — No file under python/packages/core reads a ui key or a resourceUri in tool _meta. Tool _meta is kept only to send back on tools/call. The extension is not declared.
- **bonusFeatures.modelInitiatedResourceRead** — MCPTool gives the model no resource tool and never calls resources/read. When MCPSkillsSource is configured the skills provider can read a skill's files from the server, which covers skill resources only.
- **bonusFeatures.deferredToolLoading** — use_progressive_disclosure is off by default and marked experimental. When on, the model sees list_mcp_tools, load_tool and unload_tool plus any always_load tools, and a tool joins the live list when the model loads it.
- **bonusFeatures.providerManagedMcp** — get_mcp_tool on the OpenAI, Anthropic, Foundry and Gemini chat clients builds a provider-hosted MCP tool. The provider connects to the server and the framework speaks no MCP to it.
- **bonusFeatures.openTelemetryTraceContext** — Each tools/call carries the current OpenTelemetry context in request _meta, written by the global propagator. Its keys override caller-supplied keys of the same name, and tools/list _meta overrides both. prompts/get carries none.
- **byProtocolVersion.2025-11-25.bonusFeatures.sessionRecovery** — A ClosedResourceError, or an MCPError whose message contains 'session terminated', counts as connection loss. For a framework-owned connection the tool reconnects, reloads tools and prompts if needed, and retries the tools/call once. mcp 2.3.0 produces that message from an HTTP 404 on a request that carried a session id. A caller-owned Client or ClientSession is not recreated and the call fails. prompts/get retries only on ClosedResourceError. .NET: C# SDK 2.2.0 marks the transport closed on the same 404 and does not re-initialize. dotnet/src has no recovery code, and the clients the framework builds live for one invocation or one response.
- **byProtocolVersion.2025-11-25.bonusFeatures.healthPing** — ping is sent before each tools/list and prompts/list page on a handshake-era connection, and a failure triggers a reconnect. A -32601 reply turns pinging off for the session. There is no periodic loop and no ping before tools/call. A 2026-07-28 connection skips it.

## Verified by the probe

136 records from the live probe (`probe/`), client version `1.25.0`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/agent-framework.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.app_only/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.app_only/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.app_only/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.app_only/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.app_only/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.meta_only/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.meta_only/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.meta_only/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.meta_only/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.meta_only/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "null" |
| [with_meta](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.with_meta/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.with_meta/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.with_meta/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.with_meta/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.with_meta/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.audience_user/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.audience_user/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.audience_user/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.audience_user/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.audience_user/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [empty_object](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.empty_object/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.empty_object/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.empty_object/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.empty_object/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.empty_object/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [large](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.large/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [large](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.large/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [large](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.large/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [large](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.large/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.large/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [no_content_key](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.no_content_key/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.no_content_key/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.no_content_key/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.no_content_key/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.no_content_key/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [is_error](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.is_error/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.is_error/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.is_error/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.is_error/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.is_error/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.with_image/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.with_image/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.with_image/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.with_image/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.with_image/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.schema_match/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.schema_match/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.schema_match/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.schema_match/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.schema_match/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.schema_mismatch/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.schema_mismatch/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.schema_mismatch/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.schema_mismatch/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.schema_mismatch/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.mirror/record.json) | both | stdio | `2026-07-28` | 1.25.0 | payload 2x (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.mirror/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.mirror/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.mirror/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.mirror/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"{}\"}]" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.sc_empty/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as json) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.sc_empty/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.sc_empty/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.sc_empty/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.sc_empty/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.sc_null/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.sc_null/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.sc_null/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.sc_null/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.sc_null/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "null" |
| [sc_string](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.sc_string/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.sc_string/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.sc_string/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.sc_string/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.sc_string/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.structured_only/record.json) | both | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.structured_only/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.structured_only/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "null" |
| [structured_only](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.structured_only/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.structured_only/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.summary_and_data/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.summary_and_data/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.summary_and_data/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.summary_and_data/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.summary_and_data/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |

## Research notes

- [Agent Framework's Python and .NET bindings are two different MCP clients](../research/agent-framework-python-and-dotnet-are-two-mcp-clients.md) — *nuance*. The Python binding wraps the Python SDK in its own MCPTool class and declares sampling. The .NET binding has no client class. The application builds an McpClient on C# SDK 2.2.0 and the framework wraps its tools. Tasks, skills and the wire name differ.
- [Agent Framework's two bindings load skills from an MCP server by different routes](../research/agent-framework-bindings-read-skills-over-mcp-two-ways.md) — *idiosyncrasy*. Python reads the skill://index.json resource and never calls skills/list. .NET requires the server to declare io.modelcontextprotocol/skills and sends skills/list and skills/get with its own result types. A server offering only one route yields no skills on the other binding.
- [Agent Framework's Python binding offers every MCP prompt to the model as a tool](../research/agent-framework-offers-mcp-prompts-to-the-model-as-tools.md) — *idiosyncrasy*. The Python binding turns each prompts/list entry into a function in the same list as the server's tools. The model calls it, the framework sends prompts/get, and the messages come back as one tool-result string with roles dropped. load_prompts defaults to true.
- [Agent Framework's Python binding declares sampling on every connection and refuses it by default](../research/agent-framework-declares-sampling-it-declines-by-default.md) — *nuance*. MCPTool always hands the SDK a sampling callback, so every connection declares sampling. With no chat client the callback answers -32603. With a chat client and no approval callback it answers -32600. The probe saw sampling declared at 1.25.0.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [notes/agent-framework-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/agent-framework-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Agent Framework source at 92838b6. No commit between 92838b6 and 10801303 touches _mcp.py, dotnet/src/Microsoft.Agents.AI.Mcp, the declarative MCP handler or Directory.Packages.props.

## Provenance

Read at `10801303` on 2026-11-16, from `main` of https://github.com/microsoft/agent-framework.git. That commit was authored 2026-11-16.

**SDK.** Python binding, core 1.26.0. mcp is not a base dependency of agent-framework-core. It sits in the core package's all extra with tenacity, and the agent-framework meta package depends on agent-framework-core[all], so pip install agent-framework brings both. MCPTool.connect imports mcp lazily and raises a ToolException naming the package when it is missing. It also imports tenacity on every Client connection, so agent-framework-core with mcp and without tenacity fails at connect. The workspace pyproject lists mcp>=2.2.0,<3 under [tool.uv] override-dependencies as a version floor. There is no [tool.uv.sources] entry for mcp, no patches directory and no vendored copy, and uv.lock resolves mcp and mcp-types 2.3.0 from PyPI. MCPTool passes no mode and no client_info to Client. The SDK's auto mode picks the revision, server/discover at 2026-07-28 and then initialize at 2025-11-25, and the SDK's placeholder name mcp 0.1.0 goes on the wire. The probe's capture at 1.25.0 shows the same name, server/discover at 2026-07-28 as the first request, and MCP-Protocol-Version 2026-07-28 on every HTTP request. The .NET binding uses a second SDK. ModelContextProtocol and ModelContextProtocol.Extensions.Tasks are pinned to 2.2.0 in dotnet/Directory.Packages.props under central package management with transitive pinning. The repository has no packages.lock.json, no NuGet.config and no RestoreSources setting, so the pin is what resolves and nothing replaces the package. C# SDK 2.2.0 also prefers 2026-07-28 when McpClientOptions.ProtocolVersion is null, and the only framework code that sets it passes a property whose default is null. With no ClientInfo the C# SDK sends the entry assembly's name and version, so an application-built .NET client goes on the wire under the application's own assembly name. FoundryToolboxService sends the hosted agent's name.

Paths read:

- `python/packages/core/agent_framework/_mcp.py`
- `python/packages/core/agent_framework/_skills.py`
- `python/packages/core/agent_framework/_agents.py`
- `python/packages/core/pyproject.toml`
- `python/pyproject.toml`
- `python/uv.lock`
- `python/packages/declarative/agent_framework_declarative/_workflows/_mcp_handler.py`
- `python/packages/foundry_hosting/agent_framework_foundry_hosting/_toolbox.py`
- `dotnet/Directory.Packages.props`
- `dotnet/src/Microsoft.Agents.AI.Mcp`
- `dotnet/src/Microsoft.Agents.AI.Workflows.Declarative.Mcp`
- `dotnet/src/Microsoft.Agents.AI.Foundry.Hosting/FoundryToolboxService.cs`
- `dotnet/src/Microsoft.Agents.AI.Foundry.Hosting/ConsentAwareMcpClientAIFunction.cs`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/agent-framework.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

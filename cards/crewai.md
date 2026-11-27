# crewAI

Python framework for crews of role-playing agents and for flows. An agent takes MCP servers through mcps=[...]. crewAI serves that with its own MCPClient on the official mcp SDK and opens a new session for every tool call. crewai-tools adds a second route, MCPServerAdapter, on the third-party mcpadapt package. Only tools are consumed. Every route declares no client capabilities and sends the SDK placeholder name mcp.

## At a glance

| | |
|---|---|
| Registry id | `crewai` |
| Vendor | crewAI, Inc. |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Speaks MCP via | `mcp` (sdk) |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/crewAIInc/crewAI> |
| Home | <https://crewai.com> |
| Wire names | `mcp` |
| SDK | `mcp` 1.30.0 · declares `>=1.30.0,<2` · official Python SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Rows describe | `2025-11-25`, the newest revision it speaks |
| Source last updated | 2026-11-26 |
| Last read | 2026-11-27 |
| Probed | `1.15.37` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ◐ partial | read ⇧ | `2025-11-25` |
| **Resources** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ tools | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read ⇧ | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read ⇧ | `2025-11-25` |
| **Roots** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2025-11-25` |
| **Instructions** | ○ unsupported | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sessionPerToolCall | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ toolFiltering | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ platformManagedServers | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ stdioEnvFilterHook | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ lifecycleEvents | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **speaksMcpVia** — On the native mcps route crewai.mcp.MCPClient is a thin wrapper that owns one SDK ClientSession, so the SDK is the MCP client and decides the handshake, the revision and the client name. The crewai-tools route, MCPServerAdapter, goes through the third-party adapter mcpadapt (0.1.19 or 0.1.20 by Python version), which builds its own ClientSession on the same SDK.
- **transports.stdio** — MCPServerStdio(command, args, env) runs the SDK's stdio_client. The child environment is the SDK's default inherited variables plus the config's env, passed through an optional module-level _env_filter_hook. There is no cwd setting. Discovery starts one server process and every tool call starts another, so a stdio server keeps no state between calls.
- **transports.sse** — MCPServerSSE(url, headers) runs the SDK's sse_client with the SDK's default timeouts. An AMP config whose type is sse resolves to the same class. Nothing falls back to SSE: it is used only when the config asks for it. On the adapter route a params dict with no transport key connects over SSE.
- **transports.streamableHttp** — MCPServerHTTP(url, headers) runs the SDK's deprecated streamablehttp_client alias with terminate_on_close=True, so the SDK sends a DELETE as each per-call session closes when the server issued a session id. streamable=False changes the transport label on events from streamable-http to http and nothing else, though the docs call it Standard HTTP. An https:// string in mcps uses the same SDK function with no headers. The field validator rejects an http:// string, so a plain-http server needs MCPServerHTTP.
- **authentication.oauth** — No OAuth code. HTTPTransport and SSETransport pass a url and headers to the SDK and never pass auth, and the SDK's OAuthClientProvider is not imported anywhere under lib/. A 401 or 403 becomes MCPAuthenticationError, whose message says to check the headers. For an AMP slug the config, with its url and headers, comes from the CrewAI+ API. On the adapter route the params dict reaches the SDK transport as keyword arguments, so an application can pass its own httpx auth object there.
- **authentication.header** — headers on MCPServerHTTP and MCPServerSSE go to the SDK client unchanged. The https:// string form has no place for headers, so it reaches only servers that need none. Stdio credentials go through env.
- **tools** — tools/list is called once per discovery with no cursor, so only the first page is used. Discovery runs when a crew prepares a task or an agent kicks off, on a session that is closed straight after. Each tool becomes a BaseTool named <server>_<tool>, where the server part is the stdio command line or the URL host and path, and the name is sanitized to lowercase a-z0-9_ and cut to 64 characters with a hash suffix. The model sees a Pydantic model rebuilt from inputSchema. title, annotations and outputSchema are not kept. tool_filter can drop tools, and cache_tools_list keeps the list for five minutes in process.
- **tools.listChanged** — No session outlives a discovery or a single call, and ClientSession gets no message_handler, so a notifications/tools/list_changed has nothing to arrive on. The list is read again at the next task or kickoff.
- **tools.result** — Native route: every content block is flattened to text and joined with newlines, and structuredContent is dropped when content has any block. With empty content the model gets str() of the whole CallToolResult. A result above a quarter of the context window is written to a file and the model gets a reference and a reader tool. The https:// string route and the adapter route format results differently; the note covers both.
- **tools.result.content** — Text blocks and embedded text resources keep their text, one block per line. A result with no content key fails SDK validation, and after three attempts the model gets the validation error text.
- **tools.result.structuredContent** — Reaches the model only when content is empty, inside the Python repr of the whole result, which is not JSON. Dropped whenever content has a block. On the adapter route it never reaches the model.
- **tools.result.outputSchema** — crewAI keeps no outputSchema. The SDK validates structuredContent inside call_tool and lists tools first, because each call is a new session. On a mismatch the native route retries the call, then the model gets an error string that carries the SDK's sentence.
- **tools.result.audience** — annotations are never read. A block marked audience: ["user"] reaches the model like any other.
- **tools.result.isError** — Native route: the result becomes a ToolFailure with reason mcp_error, and the model reads the flattened content text. The https:// string route and the adapter never read isError.
- **tools.result.media** — Image and audio blocks become placeholders such as [image: image/png] with no data. An embedded blob becomes [resource: <uri>] and a resource link [resource_link: <uri>]. Embedded text resources keep their text.
- **tools.result._meta** — Not read. It appears only inside the same repr of the whole result when content is empty.
- **resources** — No resources/list, resources/templates/list or resources/read call on any route. MCPClient has methods for tools and prompts only. The docs list resources as not integrated.
- **resources.listChanged** — Nothing lists resources, and no session stays open to receive the notification.
- **resources.subscribe** — resources/subscribe is never called.
- **prompts** — MCPClient has list_prompts and get_prompt, which call prompts/list with no cursor and prompts/get. Nothing in crewAI calls either method: no agent, crew, flow or CLI code turns a prompt into a message. A prompt is reachable only by an application that drives MCPClient itself.
- **prompts.listChanged** — No handler, and no session stays open to receive the notification.
- **completions** — completion/complete is never called.
- **sampling** — Not declared. No sampling_callback is passed, so the SDK leaves sampling out of the capabilities and answers a sampling/createMessage request with an Invalid Request error, "Sampling not supported".
- **sampling.tools** — Follows from sampling.
- **sampling.context** — Follows from sampling.
- **elicitation** — Not declared. No elicitation_callback is passed, so the SDK leaves elicitation out of the capabilities and answers an elicitation/create request with an Invalid Request error.
- **elicitation.form** — Follows from elicitation.
- **elicitation.url** — Follows from elicitation.
- **roots** — Not declared. No list_roots_callback is passed, so the SDK leaves roots out of the capabilities and answers roots/list with an Invalid Request error.
- **roots.listChanged** — notifications/roots/list_changed is never sent.
- **logging** — logging/setLevel is never called and no logging_callback is passed, so the SDK's default callback discards a notifications/message. crewAI's own MCP events on its event bus are client-side records of connections and tool calls.
- **instructions** — The InitializeResult is discarded at all three call sites, so the server instructions string is never read or shown to a model.
- **icons** — A tool is reduced to its name, description and inputSchema at discovery. No icons or websiteUrl field is read.
- **jsonSchema** — A tool's inputSchema is not passed through. create_model_from_schema rebuilds it as a Pydantic model, and the model-facing schema is generated from that model. If the conversion raises, the native route registers the tool with no typed schema and logs a warning. The dialect named by $schema is not read.
- **jsonSchema.features** — oneOf is treated as anyOf. A type given as a list becomes a union. additionalProperties is forced to false on every object. Constraint keywords such as pattern and minimum are copied into field descriptions on the native route. Keywords outside this list were not traced.
- **extensions.io.modelcontextprotocol/ui** — Not declared, and no code reads _meta.ui or a ui:// resource. A tool marked app-only is offered to the model like any other, as the probe saw on 1.15.37.
- **extensions.io.modelcontextprotocol/tasks** — No tasks capability is declared and no tasks/* request is sent. The SDK's experimental task handlers are left at their defaults, which build no capability.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. No skills/list, skills/get or resources/directory/read request is sent, and mcp 1.30.0 has no client extension API to declare one. crewAI's own skills come from local SKILL.md directories and the crewAI Plus registry, not from MCP servers.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. No events/* request is sent from crewai or crewai-tools, and mcp 1.30.0 has no events client code. The MCP event types in crewai/events are crewAI's own event bus.
- **extensions.io.modelcontextprotocol/events.poll** — events/poll is never sent.
- **extensions.io.modelcontextprotocol/events.push** — events/stream is never sent and notifications/events/* has no handler.
- **extensions.io.modelcontextprotocol/events.webhook** — events/subscribe is never sent.
- **bonusFeatures.modelInitiatedResourceRead** — There is no resource support of any kind, so the model has no way to read one.
- **bonusFeatures.sessionPerToolCall** — Each tool call on the native route builds a new MCPClient and transport, connects, initializes, calls and disconnects. The stated reason is that parallel calls sharing a session caused anyio cancel-scope errors.
- **bonusFeatures.toolFiltering** — tool_filter on a server config takes a static allow and block list or a callable that receives the agent and server name. It runs on the discovered list before tools are built.
- **bonusFeatures.platformManagedServers** — A bare slug in mcps, such as notion or notion#search, is looked up through the CrewAI+ API with a platform integration token and resolved to an HTTP or SSE config with headers. It needs crewai-tools installed for the token helper.
- **bonusFeatures.stdioEnvFilterHook** — A module-level _env_filter_hook can rewrite the merged environment before a stdio server is spawned. It is None by default and is meant for an enterprise policy layer.
- **bonusFeatures.lifecycleEvents** — MCPClient emits connection started, completed and failed events and tool execution started, completed and failed events on crewAI's event bus, with the server name, transport type and, for a refused connection, the HTTP status.

## Verified by the probe

65 records from the live probe (`probe/`), client version `1.15.37`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. Rows whose scenario starts with `conformance/` come from the MCP conformance suite, run through the same adapter; their verdict counts the checks. A config name is followed by its kind when the two differ: `setting` is a switch the client documents, `harness` is probe-written code that uses an API the client leaves to the application. The scenario link opens the record; the raw captures sit next to a probe record, and a conformance link opens the run summary. Overlay: `data/verified/crewai.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/crewai@1.15.37/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [app_only](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [app_only](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.app_only/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| **elicitation.form** | | | | | |
| [conformance/elicitation-sep1034-client-defaults](../probe/conformance/summary/crewai.json) | default | http | `2025-11-25` | 1.15.37 | conformance elicitation-sep1034-client-defaults at 2025-11-25: 0/6 checks pass; failed client-elicitation-sep1034-general, client-elicitation-sep1034-string-default, client-elicitation-sep1034-integer-default, client-elicitation-sep1034-number-default, client-elicitation-sep1034-enum-default, client-elicitation-sep1034-boolean-default |
| **protocol.initializeHandshake** | | | | | |
| [conformance/initialize](../probe/conformance/summary/crewai.json) | default | http | `2025-06-18` | 1.15.37 | conformance initialize at 2025-06-18: 1/1 checks pass |
| [conformance/initialize](../probe/conformance/summary/crewai.json) | default | http | `2025-11-25` | 1.15.37 | conformance initialize at 2025-11-25: 1/1 checks pass |
| **protocol.mrtr** | | | | | |
| [conformance/sep-2322-client-request-state](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance sep-2322-client-request-state at 2026-07-28: 0/4 checks pass; failed sep-2322-client-request-state-echoed, sep-2322-client-jsonrpc-id-different, sep-2322-client-no-state-omitted, sep-2322-client-parallel-isolation; client exited 1 |
| **protocol.protocolVersionHeader** | | | | | |
| [conformance/request-metadata](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance request-metadata at 2026-07-28: 0/1 checks pass; failed sep-2575-http-client-sends-version-header; client exited 1 |
| **protocol.resultType** | | | | | |
| [conformance/sep-2322-client-request-state](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance sep-2322-client-request-state at 2026-07-28: 0/1 checks pass; failed sep-2322-default-result-type-complete; client exited 1 |
| **protocol.serverDiscover** | | | | | |
| [conformance/request-metadata](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance request-metadata at 2026-07-28: 0/1 checks pass; failed sep-2575-client-retry-supported-version; client exited 1 |
| **protocol.sseResumability** | | | | | |
| [conformance/sse-retry](../probe/conformance/summary/crewai.json) | default | http | `2025-11-25` | 1.15.37 | conformance sse-retry at 2025-11-25: 3/3 checks pass |
| **protocol.standardRequestHeaders** | | | | | |
| [conformance/http-custom-headers](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance http-custom-headers at 2026-07-28: 0/5 checks pass; failed sep-2243-client-supports-custom-headers, sep-2243-client-mirrors-designated-params, sep-2243-client-encode-values, sep-2243-client-base64-unsafe, sep-2243-client-omit-null; client exited 1 |
| [conformance/http-invalid-tool-headers](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance http-invalid-tool-headers at 2026-07-28: 11/13 checks pass; failed sep-2243-invalid-tool-tools-list-gate, sep-2243-client-reject-invalid-tool; only absence checks passed, which a client that ignores the feature also passes; client exited 1 |
| [conformance/http-standard-headers](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance http-standard-headers at 2026-07-28: 0/1 checks pass; failed sep-2243-client-includes-standard-headers; client exited 1 |
| **tools** | | | | | |
| [conformance/tools_call](../probe/conformance/summary/crewai.json) | default | http | `2025-06-18` | 1.15.37 | conformance tools_call at 2025-06-18: 1/1 checks pass |
| [conformance/tools_call](../probe/conformance/summary/crewai.json) | default | http | `2025-11-25` | 1.15.37 | conformance tools_call at 2025-11-25: 1/1 checks pass |
| [conformance/tools_call](../probe/conformance/summary/crewai.json) | default | http | `2026-07-28` | 1.15.37 | conformance tools_call at 2026-07-28: 0/1 checks pass; failed tool-add-numbers; client exited 1 |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/crewai@1.15.37/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.meta_only/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/crewai@1.15.37/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.with_meta/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/crewai@1.15.37/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [audience_user](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [audience_user](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.audience_user/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/crewai@1.15.37/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_empty_object: Operation fai" |
| [empty_object](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_empty_object: Operation fai" |
| [empty_object](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.empty_object/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: 1 validation error for CallToolResult\ncontent\n  Field requ" |
| [large](../probe/runs/crewai@1.15.37/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [large](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [large](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.large/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/crewai@1.15.37/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_no_content_key: Operation f" |
| [no_content_key](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_no_content_key: Operation f" |
| [no_content_key](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.no_content_key/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: 1 validation error for CallToolResult\ncontent\n  Field requ" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/crewai@1.15.37/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [is_error](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [is_error](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.is_error/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/crewai@1.15.37/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [with_image](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [with_image](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.with_image/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/crewai@1.15.37/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [schema_match](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [schema_match](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.schema_match/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/crewai@1.15.37/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_schema_mismatch: Operation " |
| [schema_mismatch](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_schema_mismatch: Operation " |
| [schema_mismatch](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.schema_mismatch/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Invalid structured content returned by tool probe_schema_m" |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/crewai@1.15.37/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 1.15.37 | payload once (as json) |
| [mirror](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 1.15.37 | payload once (as json) |
| [mirror](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.mirror/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | payload once (as json) |
| [sc_empty](../probe/runs/crewai@1.15.37/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.sc_empty/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_null](../probe/runs/crewai@1.15.37/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_null](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_null](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.sc_null/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_string](../probe/runs/crewai@1.15.37/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_sc_string: Operation failed" |
| [sc_string](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_sc_string: Operation failed" |
| [sc_string](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.sc_string/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: 1 validation error for CallToolResult\nstructuredContent\n  " |
| [structured_only](../probe/runs/crewai@1.15.37/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 1.15.37 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 1.15.37 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.structured_only/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | "…" no marker reached the model; payload: "[]" |
| [summary_and_data](../probe/runs/crewai@1.15.37/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.summary_and_data/record.json) | crewai-tools (setting) | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |

## Research notes

- [crewAI opens a new MCP session for every tool call](../research/crewai-opens-a-new-mcp-session-for-every-tool-call.md) — *idiosyncrasy*. On the native mcps route crewAI connects once to list tools, disconnects, then builds a new client, transport and handshake for each tool call. A stdio server is started again for every call, and no session stays open to receive a notification.
- [crewAI reaches MCP servers through four entry points on three client code paths](../research/crewai-reaches-mcp-through-four-entry-points.md) — *idiosyncrasy*. An agent's mcps list sends config objects and AMP slugs to crewAI's MCPClient and https:// strings to a separate wrapper, and crewai-tools adds MCPServerAdapter on mcpadapt. All four build an mcp 1.30.0 ClientSession and send clientInfo mcp 0.1.0.
- [crewAI requires mcp below 2, so no install of it can speak 2026-07-28](../research/crewai-caps-the-sdk-below-mcp-2.md) — *gap*. crewAI and crewai-tools require mcp>=1.30.0,<2 and lock 1.30.0, the newest 1.x release, which proposes 2025-11-25. Three call sites import an SDK function that mcp 2.3.0 no longer has, and mcpadapt 0.1.20 imports two.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [mcp/client/stdio/__init__.py](https://pypi.org/project/mcp/1.30.0/) — *transports.stdio*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. DEFAULT_INHERITED_ENV_VARS and get_default_environment.
- [mcpadapt/core.py](https://pypi.org/project/mcpadapt/0.1.20/) — *transports.sse*, read 2026-11-16 at `?` in grll/mcpadapt. mcpadapt 0.1.20 wheel; 0.1.19 has the same core.py. transport defaults to sse for a dict.
- [mcp/client/streamable_http.py](https://pypi.org/project/mcp/1.30.0/) — *transports.streamableHttp*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. MCP-Protocol-Version header after negotiation, the DELETE on close, and the deprecated alias.
- [mcpadapt/core.py](https://pypi.org/project/mcpadapt/0.1.20/) — *authentication.oauth*, read 2026-11-16 at `?` in grll/mcpadapt. mcpadapt 0.1.20 wheel; 0.1.19 has the same core.py. client_params are splatted into the SDK transport function.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *tools*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. list_tools sends a cursor only when the caller passes one.
- [notes/crewai-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/crewai-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the crewAI source at d7dfa0e. No file under lib/crewai/src/crewai/mcp, the two MCP tool classes or the crewai-tools adapter changed between d7dfa0e and 758b2c1d.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *sampling*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The default callback and the capability built from it.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *elicitation*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The default callback and the capability built from it.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *roots*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The default callback and the capability built from it.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *logging*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The default logging callback is a no-op.
- [notes/crewai-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/crewai-tool-result-handling.md) — *extensions.io.modelcontextprotocol/ui*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the crewAI source at d7dfa0e. No file under lib/crewai/src/crewai/mcp, the two MCP tool classes or the crewai-tools adapter changed between d7dfa0e and 758b2c1d.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *extensions.io.modelcontextprotocol/tasks*, read 2026-11-16 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. tasks=self._task_handlers.build_capability(), which returns None when no handler is set (mcp/client/experimental/task_handlers.py:206-222).
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel, the version uv.lock resolves. ClientCapabilities is built from sampling, elicitation, roots and tasks only; 1.x has no extensions field and no skills or events client code.
- [mcpadapt/core.py](https://pypi.org/project/mcpadapt/0.1.20/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in grll/mcpadapt. mcpadapt 0.1.20 wheel, used by crewai-tools' MCPServerAdapter. It opens a plain mcp ClientSession and has no skills or events code.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel, the version uv.lock resolves. ClientCapabilities is built from sampling, elicitation, roots and tasks only; 1.x has no extensions field and no skills or events client code.
- [mcpadapt/core.py](https://pypi.org/project/mcpadapt/0.1.20/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in grll/mcpadapt. mcpadapt 0.1.20 wheel, used by crewai-tools' MCPServerAdapter. It opens a plain mcp ClientSession and has no skills or events code.

## Provenance

Read at `77237aec` on 2026-11-27, from `main` of https://github.com/crewAIInc/crewAI.git. That commit was authored 2026-11-26.

**SDK.** A base dependency of crewai, imported lazily inside the MCP functions. crewai-tools repeats the same requirement under its mcp extra next to mcpadapt>=0.1.9, which uv.lock resolves to 0.1.19 below Python 3.12 and 0.1.20 from 3.12. Not patched: the root [tool.uv] override-dependencies list has no mcp entry, [tool.uv.sources] names only workspace members, and there is no patches directory or vendored copy. 1.30.0 is the newest 1.x release on PyPI, and the <2 cap keeps out every release that speaks 2026-07-28. crewAI names no protocol revision; mcp 1.30.0 proposes 2025-11-25 and accepts 2024-11-05, 2025-03-26, 2025-06-18 and 2025-11-25. No client_info is passed, so clientInfo is the SDK default, mcp 0.1.0. The probe's wire capture of 1.15.37 shows the same initialize on both configurations: 2025-11-25, capabilities {}, clientInfo mcp 0.1.0.

Paths read:

- `lib/crewai/src/crewai/mcp/`
- `lib/crewai/src/crewai/tools/mcp_native_tool.py`
- `lib/crewai/src/crewai/tools/mcp_tool_wrapper.py`
- `lib/crewai/src/crewai/agents/agent_builder/base_agent.py`
- `lib/crewai/src/crewai/project/crew_base.py`
- `lib/crewai/src/crewai/events/types/mcp_events.py`
- `lib/crewai/src/crewai/utilities/pydantic_schema_utils.py`
- `lib/crewai-tools/src/crewai_tools/adapters/mcp_adapter.py`
- `lib/crewai/pyproject.toml`
- `lib/crewai-tools/pyproject.toml`
- `pyproject.toml`
- `uv.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/crewai.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

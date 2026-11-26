# eve

Vercel's TypeScript framework for durable backend agents, authored as files under agent/. An MCP server is one connection file with a URL. The MCP client is @ai-sdk/mcp, compiled into the eve package with three build-time patches. It declares no capabilities and uses tools only, which the model reaches through eve__search and eve__tool.

## At a glance

| | |
|---|---|
| Registry id | `eve` |
| Vendor | Vercel |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Speaks MCP via | `@ai-sdk/mcp` (sdk) |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/vercel/eve> |
| Home | <https://eve.dev/> |
| Wire names | `ai-sdk-mcp-client`, `eve` |
| SDK | `@ai-sdk/mcp` 2.0.99 · declares `^2.0.99` · TypeScript SDK · **patched** · pins `2026-07-28` |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-11-16 |
| Last read | 2026-11-16 |
| Probed | `1.0.0-rc.6` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2026-07-28` |
| **Resources** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2026-07-28` |
| **Prompts** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ tools | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read | `2026-07-28` |
| **Roots** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ○ unsupported | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **Tasks** | ○ unsupported | read | `2026-07-28` |
| **JSON Schema** |  |  |  |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ◇ opt-in | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ deferredToolLoading | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ protocolEraForcing | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ traceContextInRequestMeta | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ toolResultAuthChallenge | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ devReachabilityProbe | ● full | read | `2025-03-26` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **speaksMcpVia** — The AI SDK's MCP client, used directly through createMCPClient and wrapped by McpConnectionClient. It is not a reference SDK and carries its own protocol constants. eve bundles it at build time and patches three snippets.
- **transports.stdio** — A connection is a url and nothing else. #createClient builds an http transport and falls back to sse. The SDK's stdio transport is the separate @ai-sdk/mcp/mcp-stdio export, and eve bundles the main entry only. ACP mode rejects client-provided MCP servers.
- **transports.sse** — Fallback only. eve retries with the sse transport when the Streamable HTTP attempt fails with HTTP 400, 404 or 405, and no option selects it. The SSE transport has no discovery support, so it uses initialize at 2025-11-25.
- **transports.streamableHttp** — The default and first attempt. eve supplies the fetch: it adds trace context to each request body, resolves auth and headers again on every request, and turns a 401 into its sign-in flow. The SDK refuses redirects. On 2026-07-28 each request carries Mcp-Method and Mcp-Name headers and there is no session, GET stream or DELETE.
- **authentication.oauth** — eve runs none of the MCP authorization flow itself. It passes no authProvider to the SDK, so the SDK's metadata discovery, registration and PKCE code is never reached, and eve does not read WWW-Authenticate. A connection's auth is a token provider whose token is sent as a bearer. A provider with startAuthorization and completeAuthorization adds interactive sign-in, and the documented one is connect() from @vercel/connect/eve, which gets tokens from Vercel Connect. When the provider has no token yet, eve connects anonymously and asks for sign-in on an HTTP 401 or on an error result carrying _meta["mcp/www_authenticate"]. The three flags below describe eve's own code. What Vercel Connect does towards the authorization server was not read.
- **authentication.header** — A headers map of static values, promises or callbacks that receive the session context, resolved again for every request. An Authorization key in headers is rejected when auth is also set. forwardPrincipal adds an eve-forwarded-principal header naming the turn's user and makes requests fail on a redirect.
- **tools** — tools/list is called once per connection per step with no cursor, so only the server's first page is read. No MCP tool is in the model's tool list: the model finds tools with eve__search, which returns each as <connection>__<tool> with its description and a rendered signature, and calls them with eve__tool. Inputs are validated against inputSchema before the call. A connection can filter tools with allow or block, gate them with an approval policy that sees the tool's annotations, and supply arguments the model never sees.
- **tools.listChanged** — The SDK passes any incoming notification to onUncaughtError as an unsupported message, and eve does not set that callback. On 2026-07-28 the client opens no stream that could carry one. eve builds a new client and lists tools again on every step, so a changed list is seen on the next step.
- **tools.result** — structuredContent replaces the text blocks whenever it is present. Any image, audio, resource or resource_link block makes the block list the value and drops structuredContent. An isError result is thrown and reaches the model as error text.
- **tools.result.content** — Text blocks reach the model when structuredContent is absent, or when the result holds a non-text block. Text with no structuredContent is parsed as JSON when the tool declares no outputSchema and the text starts with { or [. An empty content array gives an empty string with no placeholder.
- **tools.result.structuredContent** — Reaches the model as the JSON value whenever it is present, {} and null included, unless the result holds a non-text content block. A result with no content key is accepted.
- **tools.result.outputSchema** — Never validated, because eve does not pass schemas to the SDK's toolsFromDefinitions. The schema is rendered into the signature eve__search returns, and its presence turns off JSON parsing of text-only results.
- **tools.result.audience** — No code on the result path reads block annotations. A block marked audience: ["user"] reaches the model when the block list is the value.
- **tools.result.isError** — The error is the joined text, else JSON.stringify of structuredContent, else "The tool reported an error.". The model reads it as error text. An error result carrying _meta["mcp/www_authenticate"] starts sign-in and the model does not receive it.
- **tools.result.media** — image and audio blocks and blob resources become file parts, and text resources and resource links become text. File parts are written to the sandbox and replaced by a reference. Images and PDFs within size limits are inlined for the model, and audio stays a label.
- **tools.result._meta** — Result _meta does not reach the model. One key is read: mcp/www_authenticate on an error result starts sign-in.
- **resources** — eve never calls resources/list, resources/templates/list or resources/read. The SDK has methods for all three. The SDK calls in eve are createMCPClient, listTools, toolsFromDefinitions, close and experimental_events.list.
- **resources.listChanged** — Notifications are dropped, as for tools.
- **resources.subscribe** — The SDK has no resources/subscribe or subscriptions/listen request.
- **prompts** — eve never calls prompts/list or prompts/get. The SDK has listPrompts and getPrompt.
- **prompts.listChanged** — Notifications are dropped, as for tools.
- **completions** — The SDK has complete(). eve never calls it.
- **sampling** — Not declared: the capabilities object is {}. The SDK answers sampling/createMessage with -32601. On 2026-07-28 an input request other than form elicitation fails the call.
- **sampling.context** — Sampling is not implemented.
- **sampling.tools** — Sampling is not implemented.
- **elicitation** — Not declared, and eve registers no handler. On the handshake path the SDK answers elicitation/create with -32601. On 2026-07-28 a tools/call that returns input_required fails with an error saying no handler is registered, so a call that needs input cannot complete.
- **elicitation.form** — The SDK supports form elicitation through onElicitationRequest. eve never calls it.
- **elicitation.url** — The SDK rejects any input request whose mode is not form.
- **roots** — Not declared. The SDK answers roots/list with -32601.
- **roots.listChanged** — No roots capability exists to change.
- **logging** — The SDK has no logging/setLevel request, and a notifications/message is dropped with every other notification.
- **instructions** — The SDK keeps the server's instructions string on the client. eve never reads it. The model sees the description the application wrote on the connection.
- **icons** — The metadata eve keeps for a tool is name, description, inputSchema, outputSchema and annotations. Nothing reads icons.
- **tasks** — Not declared, and the SDK has no tasks request.
- **jsonSchema** — Tool inputs are validated before the call with @cfworker/json-schema in 2020-12 mode, whatever $schema the tool declares. Omitted properties receive their default values. outputSchema is never validated.
- **jsonSchema.features** — format is removed before validation. Boolean exclusiveMinimum and exclusiveMaximum are rewritten to the numeric form. A schema with an unknown type, an invalid pattern or an unresolvable $ref is advertised and its values pass through unvalidated.
- **extensions.io.modelcontextprotocol/ui** — Not declared: eve passes no capabilities, and the SDK exports the declaration as mcpAppClientCapabilities for hosts that want it. No code under packages/eve/src reads ui:// resources. A tool whose _meta.ui.visibility leaves out the model is still found by eve__search.
- **extensions.io.modelcontextprotocol/events** — Opt-in per connection with experimental.events, and only with a static Vercel Connect auth provider. eve opens a second SDK client to page events/list and offers each webhook-deliverable event to the model as an events_subscribe_<name> action. Vercel Connect holds the subscription and forwards deliveries, so eve sends no events/subscribe itself. Nothing is declared in client capabilities. The SDK marks its events API experimental and names no SEP.
- **extensions.io.modelcontextprotocol/events.webhook** — Vercel Connect holds the subscription and forwards deliveries. eve sends no events/subscribe itself.
- **extensions.io.modelcontextprotocol/events.poll** — Only webhook-deliverable events are offered.
- **extensions.io.modelcontextprotocol/events.push** — Only webhook-deliverable events are offered.
- **bonusFeatures.modelInitiatedResourceRead** — eve has no resource path of any kind.
- **bonusFeatures.deferredToolLoading** — Every connection tool is a deferred catalog entry with an empty description. The model gets two fixed tools, eve__search and eve__tool, whose definitions do not change when the catalog does.
- **bonusFeatures.protocolEraForcing** — protocolVersionDiscovery: false on a connection skips server/discover and starts with initialize at 2025-11-25. Nothing restricts a connection to 2026-07-28.
- **bonusFeatures.traceContextInRequestMeta** — eve's fetch wrapper rewrites each JSON-RPC request body to add the active OpenTelemetry trace context to params._meta. The probe's capture of eve 1.0.0-rc.6 shows a traceparent key on server/discover, initialize, notifications/initialized, tools/list and tools/call.
- **bonusFeatures.toolResultAuthChallenge** — An error result with a non-empty _meta["mcp/www_authenticate"] starts sign-in for the connection. The source comment names the key as the OpenAI Apps SDK convention.
- **bonusFeatures.devReachabilityProbe** — The dev TUI, on a local target, posts a bare initialize at 2025-03-26 with clientInfo eve / connection-probe to every scaffoldable catalog entry that has an MCP URL, at start and every 60 seconds. It sends no notifications/initialized and no DELETE.
- **byProtocolVersion.2025-11-25.transports.streamableHttp** — Reached when server/discover is answered with a JSON-RPC error other than -32020 and -32021 or with an HTTP error status other than 401, or when the connection sets protocolVersionDiscovery: false. A -32022 qualifies only when it lists a handshake version the client supports. initialize proposes 2025-11-25, or the newest handshake version a -32022 error listed, and any of the five supported revisions is accepted in the reply. The session id is kept, one GET stream is opened, and close sends a DELETE with a 5 second deadline. The client is closed at the end of every step, so each step that uses the connection starts a new session.

## Verified by the probe

34 records from the live probe (`probe/`), client version `1.0.0-rc.6`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/eve.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.app_only/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.meta_only/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.with_meta/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.audience_user/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | "…" client error text, no fixture field: "{\"error\":\"MCPClientError: Failed to parse server response\"}" |
| [empty_object](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.empty_object/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | "…" client error text, no fixture field: "{\"error\":\"MCPClientError: Failed to parse server response\"}" |
| [large](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.large/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.no_content_key/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | […] content only (1x, as json) |
| [is_error](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.is_error/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | […] content only (1x, as json) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | […] content only (1x, as json) |
| [with_image](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.with_image/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | […] content only (1x, as json) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.schema_match/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.schema_mismatch/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | payload once (as json) |
| [mirror](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.mirror/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | payload once (as json) |
| [sc_empty](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.sc_empty/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "null" |
| [sc_null](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.sc_null/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "null" |
| [sc_string](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.sc_string/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.structured_only/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.summary_and_data/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |

## Research notes

- [eve bundles @ai-sdk/mcp into its package and rewrites three parts of it during the build](../research/eve-patches-ai-sdk-mcp-at-build-time.md) — *idiosyncrasy*. @ai-sdk/mcp is a devDependency that eve compiles into its own package. Three rolldown plugins replace exact snippets of the SDK's dist. They add a fallback to initialize on -32022, keep one GET stream per session, and put a 5 second limit on the session DELETE.
- [eve sends a bearer from a token provider and runs none of the MCP authorization flow itself](../research/eve-leaves-oauth-to-a-token-provider.md) — *nuance*. A connection's auth is a token provider. eve passes no authProvider to @ai-sdk/mcp, so metadata discovery, registration and PKCE never run in eve. It connects anonymously and asks for sign-in on a 401 or on an error result with _meta mcp/www_authenticate.
- [eve offers MCP tools only through eve__search and eve__tool, and reads one page of tools/list](../research/eve-defers-every-mcp-tool-and-reads-one-page.md) — *idiosyncrasy*. No MCP tool is in the model's tool list. The model searches a catalog with eve__search and calls a result with eve__tool. eve calls tools/list once per step with no cursor, so a tool past the server's first page cannot be found or called.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [eve sends the AI SDK's default client name, and says eve only in a dev reachability probe](../research/eve-goes-on-the-wire-as-ai-sdk-mcp-client.md) — *idiosyncrasy*. At 0940c042 eve passes no client name to @ai-sdk/mcp, so every connection identifies as ai-sdk-mcp-client 1.0.0. The name eve appears only in a bare initialize that the dev TUI posts to catalog servers every 60 seconds.
- [dist/index.js:2125-2134](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *transports.stdio*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. createMcpTransport accepts sse and http and throws for anything else.
- [dist/index.js:1496-1505,2459-2464](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *transports.sse*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. SseMCPTransport does not set supportsProtocolVersionDiscovery.
- [dist/index.js:1777-1800,1814-1826,2009-2015](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *transports.streamableHttp*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [dist/index.js:1844-1855,1904-1914](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *authentication.oauth*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. The OAuth branch of the transport runs only when authProvider is set.
- [dist/index.js:2750-2760,2896-2907](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *tools*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. listTools sends one tools/list. tools() follows nextCursor, and eve does not call it.
- [dist/index.js:2411-2418](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *tools.listChanged*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. A message with a method and no id goes to onError as "Unsupported message type".
- [notes/eve-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/eve-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the eve source at be1adda.
- [dist/index.js:3004-3018](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *resources*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. listResources, readResource and listResourceTemplates exist on the client.
- [dist/index.js:2411-2418](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *resources.listChanged*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. A message with a method and no id goes to onError as "Unsupported message type".
- [dist/index.js:2566-2593](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *resources.subscribe*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. assertCapability lists every request method the client can send. Any other method throws "Unsupported method".
- [dist/index.js:3019-3031](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *prompts*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [dist/index.js:2411-2418](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *prompts.listChanged*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. A message with a method and no id goes to onError as "Unsupported message type".
- [dist/index.js:3040-3042](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *completions*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [dist/index.js:2403](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *sampling*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. clientCapabilities defaults to {}.
- [dist/index.js:3047-3078](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *sampling*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. onRequestMessage answers ping, handles elicitation/create when a handler is registered, and returns -32601 for every other server request.
- [dist/index.js:2629-2636](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *sampling*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [dist/index.js:3047-3078](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *sampling.context*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. onRequestMessage answers ping, handles elicitation/create when a handler is registered, and returns -32601 for every other server request.
- [dist/index.js:3047-3078](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *sampling.tools*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. onRequestMessage answers ping, handles elicitation/create when a handler is registered, and returns -32601 for every other server request.
- [dist/index.js:3047-3078](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *elicitation*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. onRequestMessage answers ping, handles elicitation/create when a handler is registered, and returns -32601 for every other server request.
- [dist/index.js:2629-2640](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *elicitation*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. The input_required branch for 2026-07-28.
- [dist/index.js:3043-3046,3068-3078](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *elicitation.form*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [dist/index.js:2633-2636](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *elicitation.url*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [dist/index.js:3047-3078](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *roots*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. onRequestMessage answers ping, handles elicitation/create when a handler is registered, and returns -32601 for every other server request.
- [dist/index.js:2566-2593](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *logging*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. assertCapability lists every request method the client can send. Any other method throws "Unsupported method".
- [dist/index.js:2411-2418](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *logging*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. A message with a method and no id goes to onError as "Unsupported message type".
- [dist/index.js:2436-2438,2536,2556](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *instructions*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [dist/index.js:2566-2593](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *tasks*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches. assertCapability lists every request method the client can send. Any other method throws "Unsupported method".
- [dist/index.js:2143-2151](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *extensions.io.modelcontextprotocol/ui*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.
- [notes/eve-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/eve-tool-result-handling.md) — *extensions.io.modelcontextprotocol/ui*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The MCP Apps and visibility findings are in that note, which read the eve source at be1adda.
- [dist/index.js:2459-2479,2496-2530,2548-2556](https://www.npmjs.com/package/@ai-sdk/mcp/v/2.0.99) — *byProtocolVersion.2025-11-25.transports.streamableHttp*, read 2026-11-16 at `?` in @ai-sdk/mcp. @ai-sdk/mcp 2.0.99, the npm artifact before eve applies its build patches.

## Provenance

Read at `0940c042` on 2026-11-16, from `main` of https://github.com/vercel/eve.git. That commit was authored 2026-11-16.

**SDK.** The AI SDK's MCP client from vercel/ai, not a reference SDK. It is a devDependency of packages/eve, declared as catalog: and set to ^2.0.99 in pnpm-workspace.yaml. The build bundles its main entry into the published eve package, which has no dependency on it. Three rolldown plugins replace exact snippets of the SDK's dist during that build: a -32022 answer to server/discover that lists a handshake version falls back to initialize at that version, a handshake-era session gets one GET stream, and the session DELETE gets a 5 second deadline. patches/ and patchedDependencies hold one unrelated patch, for @vercel/geistdocs. The SDK sets LATEST_PROTOCOL_VERSION to 2026-07-28, accepts five revisions back to 2024-11-05, and defaults protocolVersionDiscovery to true, so leading with server/discover is the SDK's choice. The lockfile also holds @modelcontextprotocol/server 2.4.0, which eve uses for its own MCP server channel, and @modelcontextprotocol/sdk 1.30.0 as a peer of other packages. Neither is on the client path. The probe ran eve 1.0.0-rc.6, which bundles 2.0.73 with the same three patches.

Paths read:

- `packages/eve/src/runtime/connections/mcp-client.ts`
- `packages/eve/src/runtime/connections/mcp-tracing.ts`
- `packages/eve/src/runtime/connections/registry.ts`
- `packages/eve/src/runtime/connections/tool-result.ts`
- `packages/eve/src/runtime/connections/events/actions.ts`
- `packages/eve/src/runtime/connections/events/lifecycle-step.ts`
- `packages/eve/src/runtime/resolve-connection.ts`
- `packages/eve/src/public/definitions/connections/mcp.ts`
- `packages/eve/src/shared/connection-types.ts`
- `packages/eve/src/execution/catalog/`
- `packages/eve/src/context/providers/connection.ts`
- `packages/eve/src/protocol/catalog-tools.ts`
- `packages/eve/src/tracing/eve/mcp.ts`
- `packages/eve/src/tools/schema.ts`
- `packages/eve/src/cli/dev/tui/mcp-connection-status.ts`
- `packages/eve/src/acp/adapter.ts`
- `packages/eve/scripts/vendor-compiled/@ai-sdk/mcp.mjs`
- `packages/eve/package.json`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `docs/connections/mcp.mdx`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/eve.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

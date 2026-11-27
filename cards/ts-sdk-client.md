# TypeScript SDK Client

The Client class of the official TypeScript SDK, published as @modelcontextprotocol/client. Rows describe what new Client(clientInfo) with no options declares and does, at 2.4.0 (the version the probe pins and Mastra resolves) and at the clone HEAD, which is 8 commits past the 2.4.0 tag. A default construction runs the 2025 initialize handshake at 2025-11-25 and declares no capabilities. server/discover and 2026-07-28 are reached only with versionNegotiation set to auto or a pin.

## At a glance

| | |
|---|---|
| Registry id | `ts-sdk-client` |
| Vendor | Model Context Protocol |
| Kind | sdk. An MCP SDK. A capability row is the default every client on it inherits unless it overrides. |
| Category | library |
| Platforms | windows, macos, linux, web |
| Licence | Apache-2.0 |
| Source | <https://github.com/modelcontextprotocol/typescript-sdk> |
| Home | <https://github.com/modelcontextprotocol/typescript-sdk> |
| Wire names | not recorded |
| SDK | `@modelcontextprotocol/client` 2.4.0 · official TypeScript SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28`. What differs on `2025-11-25` is listed under "On 2025-11-25" below |
| Source last updated | 2026-11-18 |
| Last read | 2026-11-20 |
| Probed | `2.4.0` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25`, `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ◇ opt-in | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2026-07-28` |
| **Resources** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ◇ opt-in | read | `2026-07-28` |
| **Prompts** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2025-11-25` |
| **Completions** | ● full | read | `2025-11-25` |
| **Sampling** | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ context | ◇ opt-in | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;↳ tools | ◇ opt-in | read | `2025-11-25` |
| **Elicitation** | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ◇ opt-in | read | `2025-11-25` |
| **Roots** | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2025-11-25` |
| **Logging** | ◇ opt-in | read | `2025-11-25` |
| **Instructions** | ● full | read | `2025-11-25`, `2026-07-28` |
| **Icons** | ● full | read | `2025-11-25` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ protocolEraForcing | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ standardRequestHeaders | ◇ opt-in | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## On 2025-11-25

When a server's newest revision is `2025-11-25`, TypeScript SDK Client negotiates it and these rows differ from the table above. Every other row holds on `2025-11-25` too.

| Capability | Status | Known by | At |
|---|---|---|---|
| **Tools** |  |  |  |
| &nbsp;&nbsp;↳ listChanged | ◇ opt-in | read | `2025-11-25` |
| **Resources** |  |  |  |
| &nbsp;&nbsp;↳ subscribe | ◇ opt-in | read | `2025-11-25` |
| **Elicitation** | ◇ opt-in | read | `2025-11-25` |

- **tools.listChanged** — A notifications/tools/list_changed always evicts the cached tools/list. The application is told only when it passes ClientOptions.listChanged.tools, which by default refetches the list and calls onChanged, optionally debounced. The handler is registered only when the server advertises tools.listChanged.
- **resources.subscribe** — subscribeResource() and unsubscribeResource() send resources/subscribe on a 2025 connection. The application registers its own handler for notifications/resources/updated; the client only evicts its cached read.
- **elicitation** — Not declared by default. The application passes capabilities.elicitation and registers setRequestHandler('elicitation/create'). The SDK rejects a request in a mode the client did not declare, validates the result, and fills schema defaults into an accepted form when elicitation.form.applyDefaults is set. An empty elicitation object means form only.

## What the table flattens

- **transports.stdio** — StdioClientTransport, exported from the @modelcontextprotocol/client/stdio subpath. Spawns without a shell. The child gets a whitelist of environment variables (PATH, HOME and similar; on Windows APPDATA, PATH, SYSTEMROOT, USERPROFILE and others) plus the env the application passes. stderr is inherited unless the application sets it. In auto mode the server/discover probe runs on a second short-lived process spawned from the same parameters.
- **transports.sse** — SSEClientTransport is exported and marked deprecated in favour of Streamable HTTP. The SDK does not fall back from one to the other. The class comment shows the application doing the fallback itself. Redirects are followed only within the request origin unless redirectPolicy is follow.
- **transports.streamableHttp** — StreamableHTTPClientTransport. Sends mcp-protocol-version after the handshake. Reconnects a dropped SSE stream up to 2 times with backoff from 1 s to 30 s. Same-origin redirect policy by default. On a 2026-07-28 request the protocol header and Mcp-Method and Mcp-Name are derived from the request body, so the header cannot disagree with the body era.
- **authentication.oauth** — Off until the application passes an OAuthClientProvider as the transport authProvider. Then the auth() flow discovers protected resource metadata, then authorization server metadata through RFC 8414 and OpenID Connect paths. It uses a CIMD URL as the client_id when the provider sets clientMetadataUrl and the server advertises client_id_metadata_document_supported, and registers dynamically otherwise. PKCE is S256. The resource parameter goes on the authorize and token requests. The RFC 9207 iss parameter is checked. A 403 insufficient_scope triggers one step-up reauthorization by default. ClientCredentialsProvider and PrivateKeyJwtProvider cover client_credentials. 2.4.0 always adds prompt=consent when the scope includes offline_access; HEAD adds skipOfflineAccessConsentPrompt.
- **authentication.header** — requestInit.headers on either HTTP transport are sent on every request. Authorization, mcp-session-id and mcp-protocol-version set by the transport take precedence, so a static Authorization header is sent only while an authProvider has no token. An AuthProvider of the form { token: async () => key } sends a bearer token without OAuth.
- **tools** — listTools() with no cursor walks every page, up to listMaxPages (64), stops on a page that repeats the one before, and caches the aggregate. Passing a cursor fetches one page. Against a server with no tools capability it returns an empty list without a request unless enforceStrictCapabilities is set. callTool() validates structuredContent against the outputSchema of a tool it has seen in a cached tools/list, and throws when a tool with an outputSchema returns no structuredContent. With a cold cache it validates nothing.
- **tools.listChanged** — With ClientOptions.listChanged set, connect opens a subscriptions/listen stream for the advertised list types. Without it nothing is subscribed.
- **resources** — listResources(), listResourceTemplates() and readResource() are on the Client, with the same paging and cache rules as tools. resources/read results are cached per URI and evicted on notifications/resources/updated.
- **resources.listChanged** — Same as tools: the cache entry is always evicted, and the application hears of it through ClientOptions.listChanged.resources.
- **resources.subscribe** — listen() opens subscriptions/listen with a filter. It throws on a 2025 connection.
- **prompts** — listPrompts() and getPrompt() are on the Client. Paging and the missing-capability rule match tools.
- **prompts.listChanged** — Through ClientOptions.listChanged.prompts.
- **completions** — complete() sends completion/complete for a prompt or resource template argument. The SDK has no UI that calls it.
- **sampling** — Not declared by default. The application passes capabilities.sampling and registers setRequestHandler('sampling/createMessage'). The SDK validates the request and the handler result against the negotiated era, including the tool-use result shape when the request carries tools. The class comment marks sampling deprecated as of 2026-07-28 (SEP-2577).
- **sampling.context** — includeContext reaches the application handler unchanged. Honouring it is the handler's job.
- **sampling.tools** — A request with tools or toolChoice is validated against the tool-use result schema.
- **elicitation** — Server requests arrive as input_required results on tools/call, prompts/get or resources/read. By default the client answers them through the handler registered for elicitation/create, sampling/createMessage or roots/list and retries the call, up to 10 rounds. With no handler the call fails. An inbound server-to-client request is dropped.
- **elicitation.form** — Declared as elicitation: {} or elicitation.form.
- **elicitation.url** — Declared as elicitation.url. A URL-mode request is rejected when only form was declared.
- **roots** — Not declared by default. The application passes capabilities.roots and registers setRequestHandler('roots/list'). Marked deprecated as of 2026-07-28 (SEP-2577).
- **roots.listChanged** — Sending notifications/roots/list_changed throws unless capabilities.roots.listChanged was declared.
- **logging** — No notifications/message handler is registered by default, and the Protocol layer drops a notification with no handler. The application registers one with setNotificationHandler and may call setLoggingLevel(), which is marked deprecated as of 2026-07-28. The logger option added after 2.4.0 is for the SDK's own diagnostics.
- **instructions** — Kept from the initialize result or the discover result and returned by getInstructions(). Getting them to a model is the application's job.
- **icons** — The wire schemas carry icons on tools, prompts, resources and Implementation, and the parsed results hand them to the application. The SDK renders nothing.
- **jsonSchema** — On Node the default validator is Ajv with formats, picked by the schema's $schema: none or 2020-12 uses Ajv2020, 2019-09 uses Ajv2019, draft-07 and draft-06 use classic Ajv. Other dialects fail to compile and callTool throws before sending. Browser and workerd builds use @cfworker/json-schema. jsonSchemaValidator replaces it.
- **extensions.io.modelcontextprotocol/skills** — SkillsClient from @modelcontextprotocol/client/ext/skills wraps a connected Client and reads the server's skills (SEP-2640). It does not add anything to the client's declared capabilities. Present in 2.4.0.
- **extensions.io.modelcontextprotocol/ui** — No MCP Apps code in packages/client or packages/core-internal.
- **extensions.io.modelcontextprotocol/tasks** — No task runtime in either era. The 2025-11-25 related-task _meta key is marked as kept for interoperability only, with no SDK runtime. The 2026-07-28 wire registry has no tasks/* methods. HEAD (after 2.4.0) adds ClientOptions.extensions, through which an application could supply a tasks extension; the SDK ships none.
- **extensions.io.modelcontextprotocol/events** — Not implemented in 2.4.0 or at HEAD. No package in the repo sends events/list, events/poll, events/stream or events/subscribe, and the only ext subpath @modelcontextprotocol/client exports is ext/skills. Capabilities are what the application passes plus any ClientExtension it supplies, so an application could write its own events extension on that interface.
- **bonusFeatures.protocolEraForcing** — versionNegotiation takes legacy (the default), auto, or { pin: '2026-07-28' }. connect({ prior }) reuses a cached era verdict with no probe. supportedProtocolVersions narrows both lists.
- **bonusFeatures.standardRequestHeaders** — Only on a 2026-07-28 connection over HTTP: Mcp-Method and Mcp-Name on every request, and Mcp-Param-* mirrored from x-mcp-header input-schema declarations of a cached tool. Skipped in a browser.

## Verified by the probe

267 records from the live probe (`probe/`), client version `2.4.0`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. Rows whose scenario starts with `conformance/` come from the MCP conformance suite, run through the same adapter; their verdict counts the checks. A config name is followed by its kind when the two differ: `setting` is a switch the client documents, `harness` is probe-written code that uses an API the client leaves to the application. The scenario link opens the record; the raw captures sit next to a probe record, and a conformance link opens the run summary. Overlay: `data/verified/ts-sdk-client.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.app_only/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.app_only/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.app_only/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **authentication.oauth** | | | | | |
| [conformance/auth/2025-03-26-oauth-endpoint-fallback](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-03-26` | 2.4.0 | conformance auth/2025-03-26-oauth-endpoint-fallback at 2025-03-26: 7/7 checks pass |
| [conformance/auth/2025-03-26-oauth-metadata-backcompat](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-03-26` | 2.4.0 | conformance auth/2025-03-26-oauth-metadata-backcompat at 2025-03-26: 12/12 checks pass |
| [conformance/auth/authorization-server-migration](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/authorization-server-migration at 2026-07-28: 18/18 checks pass |
| [conformance/auth/basic-cimd](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/basic-cimd at 2025-11-25: 12/12 checks pass |
| [conformance/auth/basic-cimd](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/basic-cimd at 2026-07-28: 10/10 checks pass |
| [conformance/auth/client-credentials-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/client-credentials-basic at 2025-11-25 (forced): 5/5 checks pass |
| [conformance/auth/client-credentials-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/client-credentials-basic at 2026-07-28 (forced): 4/4 checks pass |
| [conformance/auth/client-credentials-jwt](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/client-credentials-jwt at 2025-11-25 (forced): 5/5 checks pass |
| [conformance/auth/client-credentials-jwt](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/client-credentials-jwt at 2026-07-28 (forced): 4/4 checks pass |
| [conformance/auth/dpop](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/dpop at 2025-11-25 (forced): 7/7 checks pass |
| [conformance/auth/dpop](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/dpop at 2026-07-28 (forced): 7/7 checks pass |
| [conformance/auth/dpop-nonce](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/dpop-nonce at 2025-11-25 (forced): 7/7 checks pass |
| [conformance/auth/dpop-nonce](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/dpop-nonce at 2026-07-28 (forced): 7/7 checks pass |
| [conformance/auth/enterprise-managed-authorization](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/enterprise-managed-authorization at 2025-11-25 (forced): 5/5 checks pass |
| [conformance/auth/enterprise-managed-authorization](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/enterprise-managed-authorization at 2026-07-28 (forced): 4/4 checks pass |
| [conformance/auth/iss-normalized](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-normalized at 2026-07-28: 4/4 checks pass |
| [conformance/auth/iss-not-advertised](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-not-advertised at 2026-07-28: 10/10 checks pass |
| [conformance/auth/iss-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported at 2026-07-28: 10/10 checks pass |
| [conformance/auth/iss-supported-missing](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported-missing at 2026-07-28: 4/4 checks pass |
| [conformance/auth/iss-unexpected](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-unexpected at 2026-07-28: 4/4 checks pass |
| [conformance/auth/iss-wrong-issuer](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-wrong-issuer at 2026-07-28: 4/4 checks pass |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-default at 2025-11-25: 12/12 checks pass |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-default at 2026-07-28: 10/10 checks pass |
| [conformance/auth/metadata-issuer-mismatch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-issuer-mismatch at 2026-07-28: 1/1 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var1 at 2025-11-25: 12/12 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var1 at 2026-07-28: 10/10 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var2 at 2025-11-25: 12/12 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var2 at 2026-07-28: 10/10 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var3 at 2025-11-25: 12/12 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var3 at 2026-07-28: 10/10 checks pass |
| [conformance/auth/offline-access-not-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/offline-access-not-supported at 2026-07-28: 10/10 checks pass |
| [conformance/auth/offline-access-scope](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/offline-access-scope at 2026-07-28: 10/10 checks pass |
| [conformance/auth/pre-registration](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/pre-registration at 2025-11-25: 12/12 checks pass |
| [conformance/auth/pre-registration](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/pre-registration at 2026-07-28: 11/11 checks pass |
| [conformance/auth/resource-mismatch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/resource-mismatch at 2026-07-28: 1/1 checks pass |
| [conformance/auth/scope-from-scopes-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-from-scopes-supported at 2025-11-25: 12/12 checks pass |
| [conformance/auth/scope-from-scopes-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-from-scopes-supported at 2026-07-28: 10/10 checks pass |
| [conformance/auth/scope-from-www-authenticate](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-from-www-authenticate at 2025-11-25: 12/12 checks pass |
| [conformance/auth/scope-from-www-authenticate](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-from-www-authenticate at 2026-07-28: 10/10 checks pass |
| [conformance/auth/scope-omitted-when-undefined](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-omitted-when-undefined at 2025-11-25: 12/12 checks pass |
| [conformance/auth/scope-omitted-when-undefined](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-omitted-when-undefined at 2026-07-28: 10/10 checks pass |
| [conformance/auth/scope-retry-limit](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-retry-limit at 2025-11-25: 7/7 checks pass |
| [conformance/auth/scope-retry-limit](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-retry-limit at 2026-07-28: 7/7 checks pass |
| [conformance/auth/scope-step-up](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-step-up at 2025-11-25: 17/17 checks pass |
| [conformance/auth/scope-step-up](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-step-up at 2026-07-28: 17/17 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-06-18: 13/13 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-11-25: 13/13 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2026-07-28: 11/11 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-06-18: 13/13 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-11-25: 13/13 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2026-07-28: 11/11 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-06-18: 13/13 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-11-25: 13/13 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2026-07-28: 11/11 checks pass |
| **authentication.oauth.clientIdMetadataDocument** | | | | | |
| [conformance/auth/basic-cimd](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/basic-cimd at 2025-11-25: 1/1 checks pass |
| [conformance/auth/basic-cimd](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/basic-cimd at 2026-07-28: 1/1 checks pass |
| **authentication.oauth.dynamicRegistration** | | | | | |
| [conformance/auth/2025-03-26-oauth-endpoint-fallback](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-03-26` | 2.4.0 | conformance auth/2025-03-26-oauth-endpoint-fallback at 2025-03-26: 1/1 checks pass |
| [conformance/auth/2025-03-26-oauth-metadata-backcompat](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-03-26` | 2.4.0 | conformance auth/2025-03-26-oauth-metadata-backcompat at 2025-03-26: 1/1 checks pass |
| [conformance/auth/authorization-server-migration](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/authorization-server-migration at 2026-07-28: 7/7 checks pass |
| [conformance/auth/dpop](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/dpop at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/auth/dpop](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/dpop at 2026-07-28 (forced): 2/2 checks pass |
| [conformance/auth/dpop-nonce](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/dpop-nonce at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/auth/dpop-nonce](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/dpop-nonce at 2026-07-28 (forced): 2/2 checks pass |
| [conformance/auth/iss-normalized](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-normalized at 2026-07-28: 2/2 checks pass |
| [conformance/auth/iss-not-advertised](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-not-advertised at 2026-07-28: 2/2 checks pass |
| [conformance/auth/iss-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported at 2026-07-28: 2/2 checks pass |
| [conformance/auth/iss-supported-missing](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported-missing at 2026-07-28: 2/2 checks pass |
| [conformance/auth/iss-unexpected](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-unexpected at 2026-07-28: 2/2 checks pass |
| [conformance/auth/iss-wrong-issuer](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-wrong-issuer at 2026-07-28: 2/2 checks pass |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-default at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-default at 2026-07-28: 2/2 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var1 at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var1 at 2026-07-28: 2/2 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var2 at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var2 at 2026-07-28: 2/2 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var3 at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var3 at 2026-07-28: 2/2 checks pass |
| [conformance/auth/offline-access-not-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/offline-access-not-supported at 2026-07-28: 2/2 checks pass |
| [conformance/auth/scope-from-scopes-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-from-scopes-supported at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-from-scopes-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-from-scopes-supported at 2026-07-28: 2/2 checks pass |
| [conformance/auth/scope-from-www-authenticate](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-from-www-authenticate at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-from-www-authenticate](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-from-www-authenticate at 2026-07-28: 2/2 checks pass |
| [conformance/auth/scope-omitted-when-undefined](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-omitted-when-undefined at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-omitted-when-undefined](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-omitted-when-undefined at 2026-07-28: 2/2 checks pass |
| [conformance/auth/scope-retry-limit](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-retry-limit at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-retry-limit](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-retry-limit at 2026-07-28: 2/2 checks pass |
| [conformance/auth/scope-step-up](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-step-up at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-step-up](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-step-up at 2026-07-28: 2/2 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-06-18: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-11-25: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2026-07-28: 2/2 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-06-18: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-11-25: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2026-07-28: 2/2 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-06-18: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-11-25: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2026-07-28: 2/2 checks pass |
| **authentication.oauth.issuerIdentification** | | | | | |
| [conformance/auth/iss-normalized](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-normalized at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-not-advertised](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-not-advertised at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-supported-missing](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported-missing at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-unexpected](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-unexpected at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-wrong-issuer](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-wrong-issuer at 2026-07-28: 1/1 checks pass |
| [conformance/auth/metadata-issuer-mismatch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-issuer-mismatch at 2026-07-28: 1/1 checks pass |
| **authentication.oauth.protectedResourceMetadata** | | | | | |
| [conformance/auth/authorization-server-migration](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/authorization-server-migration at 2026-07-28: 2/2 checks pass |
| [conformance/auth/basic-cimd](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/basic-cimd at 2025-11-25: 1/1 checks pass |
| [conformance/auth/basic-cimd](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/basic-cimd at 2026-07-28: 1/1 checks pass |
| [conformance/auth/client-credentials-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/client-credentials-basic at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/auth/client-credentials-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/client-credentials-basic at 2026-07-28 (forced): 1/1 checks pass |
| [conformance/auth/client-credentials-jwt](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/client-credentials-jwt at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/auth/client-credentials-jwt](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/client-credentials-jwt at 2026-07-28 (forced): 1/1 checks pass |
| [conformance/auth/dpop](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/dpop at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/auth/dpop](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/dpop at 2026-07-28 (forced): 1/1 checks pass |
| [conformance/auth/dpop-nonce](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/dpop-nonce at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/auth/dpop-nonce](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/dpop-nonce at 2026-07-28 (forced): 1/1 checks pass |
| [conformance/auth/enterprise-managed-authorization](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/enterprise-managed-authorization at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/auth/enterprise-managed-authorization](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/enterprise-managed-authorization at 2026-07-28 (forced): 1/1 checks pass |
| [conformance/auth/iss-normalized](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-normalized at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-not-advertised](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-not-advertised at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-supported-missing](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-supported-missing at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-unexpected](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-unexpected at 2026-07-28: 1/1 checks pass |
| [conformance/auth/iss-wrong-issuer](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/iss-wrong-issuer at 2026-07-28: 1/1 checks pass |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-default at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-default at 2026-07-28: 1/1 checks pass |
| [conformance/auth/metadata-issuer-mismatch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-issuer-mismatch at 2026-07-28: 1/1 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var1 at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var1 at 2026-07-28: 1/1 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var2 at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var2 at 2026-07-28: 1/1 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var3 at 2025-11-25: 1/1 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var3 at 2026-07-28: 1/1 checks pass |
| [conformance/auth/offline-access-not-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/offline-access-not-supported at 2026-07-28: 1/1 checks pass |
| [conformance/auth/offline-access-scope](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/offline-access-scope at 2026-07-28: 1/1 checks pass |
| [conformance/auth/pre-registration](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/pre-registration at 2025-11-25: 1/1 checks pass |
| [conformance/auth/pre-registration](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/pre-registration at 2026-07-28: 1/1 checks pass |
| [conformance/auth/resource-mismatch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/resource-mismatch at 2026-07-28: 1/1 checks pass |
| [conformance/auth/scope-from-scopes-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-from-scopes-supported at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-from-scopes-supported](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-from-scopes-supported at 2026-07-28: 1/1 checks pass |
| [conformance/auth/scope-from-www-authenticate](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-from-www-authenticate at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-from-www-authenticate](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-from-www-authenticate at 2026-07-28: 1/1 checks pass |
| [conformance/auth/scope-omitted-when-undefined](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-omitted-when-undefined at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-omitted-when-undefined](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-omitted-when-undefined at 2026-07-28: 1/1 checks pass |
| [conformance/auth/scope-retry-limit](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-retry-limit at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-retry-limit](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-retry-limit at 2026-07-28: 1/1 checks pass |
| [conformance/auth/scope-step-up](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/scope-step-up at 2025-11-25: 1/1 checks pass |
| [conformance/auth/scope-step-up](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/scope-step-up at 2026-07-28: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-06-18: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-11-25: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2026-07-28: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-06-18: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-11-25: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2026-07-28: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-06-18: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-11-25: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2026-07-28: 1/1 checks pass |
| **authentication.oauth.resourceIndicators** | | | | | |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-default at 2025-11-25: 5/5 checks pass |
| [conformance/auth/metadata-default](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-default at 2026-07-28: 5/5 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var1 at 2025-11-25: 5/5 checks pass |
| [conformance/auth/metadata-var1](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var1 at 2026-07-28: 5/5 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var2 at 2025-11-25: 5/5 checks pass |
| [conformance/auth/metadata-var2](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var2 at 2026-07-28: 5/5 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/metadata-var3 at 2025-11-25: 5/5 checks pass |
| [conformance/auth/metadata-var3](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/metadata-var3 at 2026-07-28: 5/5 checks pass |
| [conformance/auth/resource-mismatch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/resource-mismatch at 2026-07-28: 1/1 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-06-18: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2025-11-25: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-basic](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-basic at 2026-07-28: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-06-18: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2025-11-25: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-none](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-none at 2026-07-28: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-06-18: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2025-11-25: 5/5 checks pass |
| [conformance/auth/token-endpoint-auth-post](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance auth/token-endpoint-auth-post at 2026-07-28: 5/5 checks pass |
| **elicitation.form** | | | | | |
| [conformance/elicitation-sep1034-client-defaults](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance elicitation-sep1034-client-defaults at 2025-11-25: 5/5 checks pass |
| **protocol.initializeHandshake** | | | | | |
| [conformance/initialize](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance initialize at 2025-06-18: 1/1 checks pass |
| [conformance/initialize](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance initialize at 2025-11-25: 1/1 checks pass |
| [protocol.initializeHandshake.echo](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/protocol.initializeHandshake.echo/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/protocol.initializeHandshake.echo/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/ts-sdk-client@2.4.0/legacy/both-http/protocol.initializeHandshake.echo/record.json) | legacy (default) | http | `2025-11-25` | 2.4.0 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.echo](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/protocol.initializeHandshake.echo/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/ts-sdk-client@2.4.0/legacy/both-http/protocol.initializeHandshake.reply_2024_11_05/record.json) | legacy (default) | http | `2024-11-05` | 2.4.0 | initialize at 2025-11-25 → 2024-11-05; client continued at 2024-11-05 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2024_11_05](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/protocol.initializeHandshake.reply_2024_11_05/record.json) | legacy (default) | stdio | `2024-11-05` | 2.4.0 | initialize at 2025-11-25 → 2024-11-05; client continued at 2024-11-05 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/ts-sdk-client@2.4.0/legacy/both-http/protocol.initializeHandshake.reply_2025_11_25/record.json) | legacy (default) | http | `2025-11-25` | 2.4.0 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2025_11_25](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/protocol.initializeHandshake.reply_2025_11_25/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | server/discover at 2026-07-28 → supported 2026-07-28; client continued at 2026-07-28 (tools/list, tools/call) |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/ts-sdk-client@2.4.0/legacy/both-http/protocol.initializeHandshake.reply_2026_07_28/record.json) | legacy (default) | http | `2026-07-28` | 2.4.0 | initialize at 2025-11-25 → 2026-07-28; client sent nothing further |
| [protocol.initializeHandshake.reply_2026_07_28](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/protocol.initializeHandshake.reply_2026_07_28/record.json) | legacy (default) | stdio | `2026-07-28` | 2.4.0 | initialize at 2025-11-25 → 2026-07-28; client sent nothing further |
| **protocol.mrtr** | | | | | |
| [conformance/sep-2322-client-request-state](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance sep-2322-client-request-state at 2026-07-28: 4/4 checks pass |
| **protocol.protocolVersionHeader** | | | | | |
| [conformance/request-metadata](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance request-metadata at 2026-07-28: 2/2 checks pass |
| **protocol.resultType** | | | | | |
| [conformance/sep-2322-client-request-state](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance sep-2322-client-request-state at 2026-07-28: 1/1 checks pass; only absence checks passed, which a client that ignores the feature also passes |
| **protocol.serverDiscover** | | | | | |
| [conformance/request-metadata](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance request-metadata at 2026-07-28: 1/1 checks pass |
| [protocol.serverDiscover.method_not_found](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/protocol.serverDiscover.method_not_found/record.json) | auto (setting) | http | `2025-11-25` | 2.4.0 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/protocol.serverDiscover.method_not_found/record.json) | auto (setting) | stdio | `2025-11-25` | 2.4.0 | server/discover at 2026-07-28 → error -32601; then initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/ts-sdk-client@2.4.0/legacy/both-http/protocol.serverDiscover.method_not_found/record.json) | legacy (default) | http | `2025-11-25` | 2.4.0 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| [protocol.serverDiscover.method_not_found](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/protocol.serverDiscover.method_not_found/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | initialize at 2025-11-25 → 2025-11-25; client continued at 2025-11-25 (notifications/initialized, tools/list, tools/call) |
| **protocol.sseResumability** | | | | | |
| [conformance/sse-retry](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance sse-retry at 2025-11-25: 3/3 checks pass |
| **protocol.standardRequestHeaders** | | | | | |
| [conformance/http-custom-headers](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance http-custom-headers at 2026-07-28: 18/18 checks pass |
| [conformance/http-invalid-tool-headers](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance http-invalid-tool-headers at 2026-07-28: 12/12 checks pass |
| [conformance/http-standard-headers](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance http-standard-headers at 2026-07-28: 9/9 checks pass |
| **skills** | | | | | |
| [conformance/sep-2640-client-no-prefetch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance sep-2640-client-no-prefetch at 2025-11-25 (forced): 1/1 checks pass; only absence checks passed, which a client that ignores the feature also passes |
| [conformance/sep-2640-client-no-prefetch](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance sep-2640-client-no-prefetch at 2026-07-28 (forced): 1/1 checks pass; only absence checks passed, which a client that ignores the feature also passes |
| [conformance/sep-2640-client-verify-digest](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance sep-2640-client-verify-digest at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/sep-2640-client-verify-digest](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance sep-2640-client-verify-digest at 2026-07-28 (forced): 1/1 checks pass |
| [conformance/sep-2640-client-verify-frontmatter](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance sep-2640-client-verify-frontmatter at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/sep-2640-client-verify-frontmatter](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance sep-2640-client-verify-frontmatter at 2026-07-28 (forced): 1/1 checks pass |
| [conformance/sep-2640-client-verify-size](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance sep-2640-client-verify-size at 2025-11-25 (forced): 1/1 checks pass |
| [conformance/sep-2640-client-verify-size](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance sep-2640-client-verify-size at 2026-07-28 (forced): 1/1 checks pass |
| **tools** | | | | | |
| [conformance/tools_call](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-06-18` | 2.4.0 | conformance tools_call at 2025-06-18: 1/1 checks pass |
| [conformance/tools_call](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2025-11-25` | 2.4.0 | conformance tools_call at 2025-11-25: 1/1 checks pass |
| [conformance/tools_call](../probe/conformance/summary/ts-sdk-client.json) | default (harness) | http | `2026-07-28` | 2.4.0 | conformance tools_call at 2026-07-28: 1/1 checks pass |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.meta_only/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.meta_only/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.meta_only/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.with_meta/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.with_meta/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.with_meta/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.audience_user/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.audience_user/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.audience_user/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.empty_object/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | result never sent to the model |
| [empty_object](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.empty_object/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | result never sent to the model |
| [empty_object](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.empty_object/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 0x) |
| [large](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.large/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.large/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.large/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [no_content_key](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.no_content_key/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | result never sent to the model |
| [no_content_key](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.no_content_key/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | result never sent to the model |
| [no_content_key](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.no_content_key/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.is_error/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.is_error/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.is_error/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.with_image/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.with_image/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.with_image/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.schema_match/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.schema_match/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.schema_match/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.schema_mismatch/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | result never sent to the model |
| [schema_mismatch](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.schema_mismatch/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | result never sent to the model |
| [schema_mismatch](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.schema_mismatch/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | result never sent to the model |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.mirror/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.mirror/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.mirror/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.sc_empty/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.sc_empty/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.sc_empty/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.sc_null/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.sc_null/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.sc_null/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | result never sent to the model |
| [sc_string](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.sc_string/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [sc_string](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.sc_string/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [sc_string](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.sc_string/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | result never sent to the model |
| [structured_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.structured_only/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.structured_only/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.structured_only/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/ts-sdk-client@2.4.0/auto/both-http/tools.result.summary_and_data/record.json) | auto (setting) | http | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.summary_and_data/record.json) | auto (setting) | stdio | `2026-07-28` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy (default) | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

## Research notes

- [A default TypeScript SDK Client runs the 2025 handshake and never probes server/discover](../research/ts-sdk-client-default-construction-speaks-2025-only.md) — *idiosyncrasy*. In @modelcontextprotocol/client 2.4.0 and at 5ee54ee3, versionNegotiation defaults to legacy, so new Client(info) sends initialize at 2025-11-25 and declares {}. Reaching 2026-07-28 takes mode auto or a pin, and on stdio auto spawns the server a second time for the probe.
- [The probe's ts-sdk-client auto config ran the SDK's legacy default](../research/ts-sdk-client-probe-auto-config-ran-legacy.md) — *misconception*. probe/hosts/ts-sdk-client labels its auto config as server/discover first, but call.ts passes no versionNegotiation for it, so the SDK's legacy default ran. Both configs captured initialize at 2025-11-25 and no record exercises auto mode.

## Provenance

Read at `5ee54ee3` on 2026-11-20, from `main` of https://github.com/modelcontextprotocol/typescript-sdk.git. That commit was authored 2026-11-18.

**SDK.** This entry is the SDK itself. declared is packages/client/package.json at HEAD, which still reads 2.4.0 although HEAD is 8 commits past the @modelcontextprotocol/client@2.4.0 tag (951fe560, 2026-10-23). resolved is the published 2.4.0, which the probe and Mastra install, read from the npm tarball. 2.4.0 depends on @modelcontextprotocol/core 2.4.0 exactly. patched does not apply to the SDK's own source. The commits after the tag add ClientOptions.extensions (experimental), an injectable logger, OpenTelemetry instrumentation attached to every Client unless openTelemetry: false (it injects trace context only when an OpenTelemetry propagator is registered), and skipOfflineAccessConsentPrompt. None changes the declared capabilities, the protocol versions or the negotiation default. The handshake accepts 2025-11-25, 2025-06-18, 2025-03-26, 2024-11-05 and 2024-10-07, a revision this registry does not track.

Paths read:

- `packages/client/src/client/`
- `packages/client/src/ext/skills/`
- `packages/client/src/index.ts`
- `packages/client/package.json`
- `packages/core/src/constants.ts`
- `packages/core-internal/src/shared/protocol.ts`
- `packages/core-internal/src/shared/protocolEras.ts`
- `packages/core-internal/src/shared/inputRequiredDriver.ts`
- `packages/core-internal/src/shared/inputRequiredEngine.ts`
- `packages/core-internal/src/validators/`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/ts-sdk-client.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

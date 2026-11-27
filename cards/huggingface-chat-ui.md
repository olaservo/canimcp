# Hugging Face Chat UI

Hugging Face's open-source chat interface, the app behind HuggingChat. Its SvelteKit server is the MCP client and reaches remote servers only, over Streamable HTTP with an SSE fallback. It is built on @modelcontextprotocol/client 2.0.0 with versionNegotiation set to auto, so it sends server/discover at 2026-07-28 first and falls back to initialize at 2025-11-25. From servers it uses tools and form and URL elicitation, and nothing else. Servers come from the MCP_SERVERS setting or are added by users in the UI, and authenticate with OAuth (CIMD, DCR or a manually entered client) or with headers. It sends four client names, one per connection purpose.

## At a glance

| | |
|---|---|
| Registry id | `huggingface-chat-ui` |
| Vendor | Hugging Face |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | chat |
| Platforms | web |
| Licence | Apache-2.0 |
| Source | <https://github.com/huggingface/chat-ui> |
| Home | <https://github.com/huggingface/chat-ui> |
| Wire names | `chat-ui-mcp`, `chat-ui-intern`, `chat-ui-health-check`, `chat-ui-mcp-probe` |
| SDK | `@modelcontextprotocol/client` 2.0.0 · declares `^2.0.0` · official TypeScript SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28`. What differs on `2025-11-25` is listed under "On 2025-11-25" below |
| Source last updated | 2026-11-23 |
| Last read | 2026-11-27 |
| In traffic | evalstate/mcp-clients, window ending 2026-11-26 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ● full | read, observed | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Resources** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read ⇧ | `2026-07-28` |
| **Prompts** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ● full | read | `2026-07-28` |
| **Roots** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ○ unsupported | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read, observed | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read, observed | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ pooledSessions | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ progressNotifications | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ serverInstallLink | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## On 2025-11-25

When a server's newest revision is `2025-11-25`, Hugging Face Chat UI negotiates it and these rows differ from the table above. Every other row holds on `2025-11-25` too.

| Capability | Status | Known by | At |
|---|---|---|---|
| **Elicitation** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ form | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ● full | read ⇧ | `2025-11-25` |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ pooledSessions | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sessionRecovery | ● full | read | `2025-11-25` |

- **elicitation** — elicitation/create arrives on the connection during the call and is answered while the server waits. It is routed to the conversation whose call is in flight on that connection. A call that can be elicited gets a connection of its own per conversation on a 2025-era server, and a request that still cannot be attributed is declined with cancel. The call deadline pauses while the user answers, though the server's own request timeout may end the wait first.
- **extensions.io.modelcontextprotocol/ui** — Not declared in initialize capabilities.
- **extensions.io.modelcontextprotocol/tasks** — The core experimental form is not used either: no tasks capability in initialize, and no task field on tools/call.
- **extensions.io.modelcontextprotocol/skills** — Same as 2026-07-28: no skills/list and no resource reads.
- **extensions.io.modelcontextprotocol/events** — Same as 2026-07-28.
- **bonusFeatures.pooledSessions** — The 30-second idle ping succeeds on a handshake-era connection, so a pooled client is reused until it has been idle for 10 minutes.
- **bonusFeatures.sessionRecovery** — An HTTP 404 on a call is treated as an expired session: the pooled client is evicted, a new one runs initialize, and the call is sent again, up to twice.

## What the table flattens

- **transports.stdio** — A server entry has a name, a URL and headers only, and every connection builds an HTTP transport. Chat UI runs as a web server and launches no processes.
- **transports.sse** — Fallback against the same URL when the Streamable HTTP connect throws, on the pooled client, the tool-listing client and the health check alike.
- **transports.streamableHttp** — Tried first for every server. Requests go through a fetch wrapper that refuses non-HTTPS and private-network URLs unless MCP_ALLOW_INSECURE_URLS is set, and that passes error responses to the OAuth scope-challenge handler. A pooled client sends DELETE for its session when it is disposed.
- **authentication.oauth** — Chat UI runs discovery itself when a user adds a server: a hand-written initialize at 2025-11-25 under the name chat-ui-mcp-probe looks for a 401 or 403, then RFC 9728 and RFC 8414 metadata through SDK helpers. The authorization server must advertise PKCE S256. The client is a CIMD document the app serves at /api/mcp/oauth/client-metadata when the server advertises client_id_metadata_document_supported and the app's origin is HTTPS, else DCR, else a client the user types in. The callback checks state and the RFC 9207 iss parameter. Tokens live in MongoDB, encrypted when MCP_OAUTH_ENCRYPTION_KEY is set, and are refreshed before a send. An insufficient_scope challenge on any MCP response records the scope and asks the user to authorize again, at most three times.
- **authentication.header** — A headers map on an MCP_SERVERS entry or a user-added server is sent on every request. With MCP_FORWARD_HF_USER_TOKEN=true the signed-in user's Hugging Face token is added as a bearer header to Hugging Face MCP URLs that carry ?login, unless an Authorization header is already set. A server cannot use an OAuth connection and a manual Authorization header together.
- **tools** — Tools are listed on a separate client that connects, calls tools/list with no cursor and closes. The SDK walks every page of that call, up to 64. Each server's listing is cached for 60 seconds, keyed on URL, OAuth connection and headers. Names are rewritten to ^[a-zA-Z0-9_-]{1,64}$ with a server-name suffix on a collision, and input schemas are sanitized for strict providers before they reach the model. Calls go over a pooled client. Tool annotations are kept in the mapping and not sent to the model. No tool-result note for Chat UI exists in olaservo/structured-content-research at f32f225, so tools.result is not recorded here.
- **tools.listChanged** — The client is built without the SDK's listChanged option and registers no handler, and the listing client is closed right after tools/list. A changed list is picked up when the 60-second cache entry expires.
- **resources** — Nothing calls resources/list, resources/templates/list or resources/read. Resource support was added in 7b0682fe and reverted in 890cfdf9 in August 2026.
- **resources.listChanged** — No handler is registered.
- **resources.subscribe** — No resources/subscribe call.
- **prompts** — No prompts/list or prompts/get call.
- **completions** — No completion/complete call.
- **sampling** — Not declared and no handler. On a 2026-07-28 connection an input_required round that asks for sampling/createMessage is refused as an unsupported input request.
- **elicitation** — Declared as elicitation {form, url} on session and ML Intern connections by default, and dropped when MCP_DISABLE_ELICITATION=true. Health-check connections declare nothing. On 2026-07-28 the client is built with inputRequired.autoFulfill false and each call allows input_required, so a prompt is stored in MongoDB, shown in the conversation and answered later, after which the call is re-sent with inputResponses and requestState. Only one input request per round is accepted. A prompt stays answerable for MCP_ELICITATION_TIMEOUT_MS, one hour by default.
- **elicitation.form** — Fields may be strings (with email, uri, date or date-time formats), numbers and integers with minimum and maximum, booleans, single-select from enum or oneOf const, and multi-select arrays. At most 32 fields. Any other field schema, or text over the length limits, is declined with cancel. Answers are validated against the fields on the server before they are accepted.
- **elicitation.url** — Shown as a link the user opens. Only http and https URLs are accepted. No notifications/elicitation/complete handler is registered.
- **roots** — Not declared and no roots/list handler.
- **logging** — No notifications/message handler is registered and logging/setLevel is never sent.
- **instructions** — getInstructions is never called. The client that lists tools is closed straight after tools/list.
- **icons** — The tool listing keeps name, description, inputSchema and annotations only. Server and tool icons are not read.
- **jsonSchema.features** — Tool arguments from the model are checked against the server's original inputSchema with the SDK's fromJsonSchema before the call is sent, and a schema that does not compile lets the call through. The schema the model sees is a sanitized copy: null defaults are dropped and a property with no type gets one inferred, string when nothing implies another. Elicitation schemas use the flat subset in the form row.
- **extensions.io.modelcontextprotocol/ui** — Not declared, and nothing reads _meta.ui or ui:// resources. Resources are not read at all.
- **extensions.io.modelcontextprotocol/tasks** — Not declared, and callTool is never given task parameters.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. Nothing sends skills/list or reads skill:// resources, and @modelcontextprotocol/client 2.0.0 exports no skills extension. The HF telemetry has seen no skills/list from this client.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. Nothing sends events/list, events/poll, events/stream or events/subscribe, and the SDK client 2.0.0 has no events methods. The HF telemetry does not report events.
- **bonusFeatures.pooledSessions** — Tool calls share pooled clients keyed by URL, OAuth connection, headers, conversation isolation and client name. A client idle more than 30 seconds is pinged before reuse, and one idle 10 minutes is closed. On a 2026-07-28 connection the SDK refuses ping locally, because that revision removed it, so the ping fails and the client is replaced with a new connection and a new server/discover. Reuse holds only within 30 seconds of the last use. A call that fails with a closed connection is retried up to twice on a fresh client.
- **bonusFeatures.progressNotifications** — Every call passes onprogress, so it carries a progress token. Each progress notification restarts the call's inactivity deadline (MCP_TOOL_TIMEOUT_MS, two minutes by default) and is shown in the tool block.
- **bonusFeatures.serverInstallLink** — A link of the form /?mcp=<url>&mcp_name=<name> opens the add-server form filled in. Nothing is contacted until the user clicks Add.

## Observed in traffic

From `evalstate/mcp-clients` at [`f492b6dd`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/f492b6ddd3fc37c4026db822ecf9f0c70b3edd4c/reports/dashboard-v1.json), report generated 2026-11-27, window 2026-09-28 to 2026-11-26. Grouped as `huggingface-chatui` from wire names `chat-ui-mcp`. Tool calls by revision over the 30 days to 2026-11-26: `2026-07-28` 100%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | `2026-07-28` | ● full | More than 50% of this client's 2026-07-28 tool calls in the window declared it. |
| elicitation.url | ● full | `2026-07-28` | ● full | More than 50% of this client's 2026-07-28 tool calls in the window declared it. |
| apps | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Research notes

- [Hugging Face Chat UI answers 2026-07-28 elicitations after the tool call has returned](../research/huggingface-chat-ui-parks-modern-elicitations-in-its-database.md) — *nuance*. On 2026-07-28 Chat UI stores an input_required prompt in MongoDB, ends the turn, and re-sends the call with the answer when the user replies. On a 2025-era connection the prompt is answered inside the open call, or declined when it cannot be tied to one conversation.
- [Hugging Face Chat UI replaces a 2026-07-28 pooled connection whenever it has been idle 30 seconds](../research/huggingface-chat-ui-cannot-ping-a-modern-pooled-connection.md) — *idiosyncrasy*. The connection pool pings a client idle more than 30 seconds before reusing it. ping does not exist in 2026-07-28, so on a modern connection SDK 2.0.0 refuses it locally, the pool treats the client as stale, and a new connection with a new server/discover takes its place.
- [Hugging Face Chat UI sends a different client name for each kind of connection](../research/huggingface-chat-ui-sends-four-client-names.md) — *idiosyncrasy*. Chat UI introduces itself as chat-ui-mcp for chat, chat-ui-intern for ML Intern, chat-ui-health-check for the add-server check and chat-ui-mcp-probe for OAuth discovery. Only the first two declare elicitation, and only the last is a hand-written initialize.
- [dist/index.mjs:buildDiscoveryUrls,discoverAuthorizationServerMetadata](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0) — *authentication.oauth*, read 2026-11-27 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/client 2.0.0. The authorization server metadata lookup tries the OAuth and OpenID Connect well-known paths.
- [dist/index.mjs:Client.listTools](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0) — *tools*, read 2026-11-27 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/client 2.0.0. listTools without a cursor aggregates every page, capped by listMaxPages (default 64).
- [dist/dialects-BOhdv1Fc.mjs](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0) — *jsonSchema*, read 2026-11-27 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/client 2.0.0. No $schema means 2020-12; 2019-09, draft-07 and draft-06 are also accepted, and any other dialect throws.
- [package.json](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-27 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/client 2.0.0 exports ., ./stdio and the validators only.
- [dist/index.mjs](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0) — *extensions.io.modelcontextprotocol/events*, read 2026-11-27 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/client 2.0.0 has subscriptions/listen for list-changed notifications and no events/* methods.
- [dist/src-D_zzAWoS.mjs:Protocol._assertOutboundRequestInEra](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.0.0) — *bonusFeatures.pooledSessions*, read 2026-11-27 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/client 2.0.0. The 2026-07-28 request registry has no ping, and request() throws MethodNotSupportedByProtocolVersion before sending.

## Provenance

Read at `7fc0f672` on 2026-11-27, from `main` of https://github.com/huggingface/chat-ui.git. That commit was authored 2026-11-23.

**SDK.** @modelcontextprotocol/core is also declared ^2.0.0 and resolves to 2.0.0. @modelcontextprotocol/server and @modelcontextprotocol/node 2.0.0 are used only by mock servers under scripts/ and tests/. ^2.0.0 accepts 2.4.0, the newest on npm on 2026-11-27, but package-lock.json holds 2.0.0. Not patched: no patches directory, no patch-package or patchedDependencies, and the package.json overrides touch only @reflink/reflink. The SDK defaults versionNegotiation to legacy and chat-ui sets auto, so leading with 2026-07-28 is chat-ui's choice. The fallback offer of 2025-11-25 is the SDK's LATEST_PROTOCOL_VERSION, and the SDK accepts a handshake answer back to 2024-10-07.

Paths read:

- `src/lib/server/mcp`
- `src/lib/server/textGeneration/mcp`
- `src/routes/api/mcp`
- `src/lib/utils/mcpOAuth.ts`
- `src/lib/utils/linkParams.ts`
- `src/lib/stores/mcpServers.ts`
- `src/lib/server/urlSafety.ts`
- `src/lib/server/mlAssistant.ts`
- `package.json`
- `package-lock.json`
- `.env`
- `chart/env/prod.yaml`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

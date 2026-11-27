# Zed

Code editor with a built-in agent. Zed calls MCP servers context servers and speaks MCP through its own hand-written JSON-RPC client in the context_server crate, with no MCP SDK. The client declares no capabilities, uses tools and prompts, and does not use resources. External ACP agents run in Zed receive the configured servers and connect to them with their own MCP clients.

## At a glance

| | |
|---|---|
| Registry id | `zed` |
| Vendor | Zed Industries |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | ide |
| Platforms | windows, macos, linux |
| Licence | GPL-3.0-or-later |
| Source | <https://github.com/zed-industries/zed> |
| Home | <https://zed.dev> |
| Wire names | `Zed` |
| SDK | `none` · Rust SDK · unpatched |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Source last updated | 2026-11-20 |
| Last read | 2026-11-20 |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ◐ partial | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ none | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2025-11-25` |
| **Resources** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| **Roots** | ○ unsupported | read | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2025-11-25` |
| **Instructions** | ○ unsupported | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | — not recorded | | |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ toolCallCancellation | ○ unsupported | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — Launched through the system shell with piped stdin, stdout and stderr; stderr goes to the log. A server marked remote: true in a remote project is launched on the remote host through Zed's remote stdio launcher. Extensions can supply the command.
- **transports.sse** — A url server always uses the Streamable HTTP transport. There is no legacy HTTP+SSE transport and no fallback to one.
- **transports.streamableHttp** — POSTs each message with Accept for JSON and event-stream and reads either kind of response. Keeps Mcp-Session-Id and sends DELETE on drop. Sends MCP-Protocol-Version only after negotiating 2025-06-18 or 2025-11-25. Never opens the GET stream, so server messages arrive only on the SSE response to a POST. A 404 for an expired session is reported as an error with no re-initialize.
- **authentication.oauth** — Starts on a 401 at initialize or later, unless a static Authorization header is configured. Discovers protected resource metadata, then authorization server metadata by RFC 8414 and OIDC URLs, and requires S256 PKCE. Uses CIMD (https://zed.dev/oauth/client-metadata.json) when the server advertises it, DCR otherwise, or a pre-registered client_id and secret from settings. Sends resource on the authorization, token and refresh requests. The callback is a loopback server, the session is stored in the system keychain, and a 401 triggers one refresh and retry. The callback's iss parameter is not checked.
- **authentication.header** — A headers map on a url server is sent on every POST and on the DELETE. With an Authorization header set, Zed does not start OAuth.
- **authentication.none** — A url server with no headers and no stored session connects without credentials until it returns 401.
- **tools** — tools/list is called only when the server declares tools, once at start and again on list_changed. It is sent with no cursor and nextCursor is never read, so only the first page is used. Each call is authorized through authorize_third_party_tool, which follows the agent's tool permission settings. Tool calls time out after context_server_timeout or the per-server timeout, capped at 600 seconds.
- **tools.listChanged** — The only server notification Zed subscribes to. It re-lists the server's tools. Registered only when the server declares tools.
- **tools.result** — Text and image blocks from content reach the model. structuredContent, outputSchema, annotations and _meta are parsed or ignored and never read. A result with no content key fails deserialization.
- **tools.result.content** — Text blocks reach the model as text parts. An empty content array becomes the string <Tool returned an empty string>.
- **tools.result.structuredContent** — Kept on the parsed response and never read.
- **tools.result.outputSchema** — Stored with the tool and never read. No validation.
- **tools.result.audience** — Tool result blocks have no annotations field, so audience is dropped at parse time.
- **tools.result.isError** — The concatenated text blocks of content become the error message.
- **tools.result.media** — Images reach the model as image parts when the model supports images. Audio, resource and resource_link blocks are logged and dropped.
- **tools.result._meta** — Parsed and never read.
- **resources** — The types define resources/list, resources/read and subscribe, and no client code sends them. Resource capabilities on the server are not checked anywhere.
- **resources.listChanged** — No handler for notifications/resources/list_changed.
- **resources.subscribe** — No resources/subscribe call and no resources/updated handler.
- **prompts** — Each prompt becomes a slash command in the agent panel, prefixed with the server id when its name clashes. Prompts with more than one argument are skipped. A prompt with one argument takes it as free text. prompts/get messages are added to the thread as user and assistant content, with annotations kept.
- **prompts.listChanged** — Prompts are listed once when the server starts. No handler for notifications/prompts/list_changed.
- **completions** — completion/complete is defined in the types and never sent.
- **sampling** — ClientCapabilities is built with sampling: None. Server-to-client requests have no handlers.
- **elicitation** — ClientCapabilities has no elicitation field. The elicitation handling in agent_servers belongs to ACP.
- **roots** — Declared as roots: None. A roots/list request from the server finds no handler and gets no response.
- **logging** — No handler for notifications/message and no logging/setLevel call. Server stderr goes to Zed's log.
- **instructions** — InitializeResponse has no instructions field, so server instructions are discarded at parse time.
- **icons** — No type in types.rs has an icons or websiteUrl field, including Tool and Implementation.
- **extensions.io.modelcontextprotocol/ui** — No MCP Apps code and no extension declared. The experimental field is always None.
- **extensions.io.modelcontextprotocol/tasks** — No tasks capability and no tasks methods.
- **bonusFeatures.modelInitiatedResourceRead** — No resource tools are offered to the model.
- **bonusFeatures.toolCallCancellation** — The client can send notifications/cancelled through request_with, and nothing calls it. A user cancel or a timeout on a tool call drops the pending request without notifying the server.

## Research notes

- [Zed hand-writes its MCP client, declares no capabilities and never answers a server request](../research/zed-hand-writes-its-mcp-client-and-answers-no-server-requests.md) — *idiosyncrasy*. At ad1058d7 Zed's MCP client is its own Rust code with no SDK. It sends clientInfo Zed 0.1.0 and an empty capabilities object, and its request handler table is never filled, so ping, roots/list and every other server-to-client request gets no response.
- [Zed hands its MCP server list to external ACP agents, and OAuth sessions stay behind](../research/zed-passes-mcp-servers-to-external-agents-without-oauth.md) — *nuance*. Zed sends its configured MCP servers to an external ACP agent as stdio commands and HTTP URLs with static headers. The agent connects with its own MCP client, and Zed's OAuth tokens and timeouts are not passed.
- [notes/zed-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/f32f225c/notes/zed-tool-result-handling.md) — *tools.result*, read 2026-11-20 at `f32f225c` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Zed source at 0cfc4a4 (Zed 1.30.0).

## Provenance

Read at `ad1058d7` on 2026-11-20, from `main` of https://github.com/zed-industries/zed.git. That commit was authored 2026-11-20.

**SDK.** Hand-written. The context_server crate depends on serde, serde_json and schemars and implements JSON-RPC, the lifecycle, both transports and OAuth itself. Cargo.lock has no rmcp or other MCP crate. The workspace [patch.crates-io] section patches cpal, tree-sitter-language, async-process, async-task, windows-capture and calloop, none of them MCP. LATEST_PROTOCOL_VERSION is Zed's own constant. clientInfo.version is the context_server crate's CARGO_PKG_VERSION, 0.1.0, not Zed's version (1.31.0 at this commit). The crate also holds an MCP server half (listener.rs) that nothing outside the crate uses at this commit.

Paths read:

- `crates/context_server/`
- `crates/agent/src/tools/context_server_registry.rs`
- `crates/agent/src/agent.rs`
- `crates/project/src/context_server_store.rs`
- `crates/project/src/project_settings.rs`
- `crates/agent_servers/src/acp/v1.rs`
- `crates/agent_servers/src/acp/v2.rs`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

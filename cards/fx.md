# fx (native engine)

Coding agent CLI from Vercel Labs, one native Zig binary. Its MCP client is hand-written in Zig with no SDK, and one engine serves the terminal app, `fx ask` and ACP editors. It sends `server/discover` at 2026-07-28 first and falls back to the `initialize` handshake. It consumes tools and elicitation. Resources, prompts and HTTP+SSE were removed in 0.0.15.

## At a glance

| | |
|---|---|
| Registry id | `fx` |
| Vendor | Vercel Labs |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | cli |
| Platforms | macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/vercel-labs/fx> |
| Home | <https://fx.sh> |
| Wire names | `fx` |
| SDK | `none` · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28`. What differs on `2025-11-25` is listed under "On 2025-11-25" below |
| Source last updated | 2026-11-16 |
| Last read | 2026-11-16 |
| Probed | `0.0.16` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ result | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2026-07-28` |
| **Resources** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2026-07-28` |
| **Prompts** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ○ unsupported | read | `2025-11-25`, `2026-07-28` |
| **Elicitation** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ● full | read | `2025-11-25`, `2026-07-28` |
| **Roots** | ○ unsupported | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ● full | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ deferredToolLoading | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ lazyServerStart | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ standardRequestHeaders | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ cacheableResult | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ progressNotifications | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ shellToolCalls | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## On 2025-11-25

When a server's newest revision is `2025-11-25`, fx (native engine) negotiates it and these rows differ from the table above. Every other row holds on `2025-11-25` too.

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ sessionRecovery | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ standardRequestHeaders | ○ unsupported | read | `2025-11-25` |

- **transports.streamableHttp** — After the initialize fallback, requests carry Mcp-Session-Id and the agreed MCP-Protocol-Version. A listening GET is opened, a broken stream is resumed with GET and Last-Event-ID up to twice, a cancel is a notifications/cancelled POST, and the session is ended with DELETE.
- **bonusFeatures.sessionRecovery** — A 404 for the current session starts a new session with initialize. A 404 without a session id is a plain failure.
- **bonusFeatures.standardRequestHeaders** — A 2025 session sends Accept, MCP-Protocol-Version, Mcp-Session-Id and Last-Event-ID only.

## What the table flattens

- **transports.stdio** — One process per server in its own process group, one JSON-RPC message per line. The child gets HOME, LOGNAME, PATH, SHELL, TERM and USER from fx plus the entry's env, and nothing else of fx's environment. stderr lines go to the debug log. Each new process is probed again.
- **transports.sse** — An entry with "type": "sse" is parsed and then held back with "HTTP+SSE servers are not supported". The changelog lists the removal under 0.0.15.
- **transports.streamableHttp** — POST with a JSON or SSE answer. On a 2026-07-28 server every request carries MCP-Protocol-Version, Mcp-Method and, for a call, Mcp-Name. A broken stream is re-issued with a new id and a cancel closes the stream. Redirects are not followed. The 2025 session behaviour is under byProtocolVersion.
- **authentication.oauth** — Discovery reads the WWW-Authenticate challenge, then RFC 9728 resource metadata, then authorization server metadata with OpenID Connect discovery as a fallback. The server must list S256. Registration tries a configured oauth.client_id, then a client ID metadata document when the server supports them and the entry sets oauth.client_metadata_url, then Dynamic Client Registration as a native public client named fx. fx hosts no metadata document, so a default install registers dynamically and clientIdMetadataDocument is recorded false. The redirect is a loopback listener on 127.0.0.1. A 403 insufficient_scope challenge starts a step-up sign-in. A missing iss is refused when the server advertised it. Sign-out revokes the token.
- **authentication.header** — headers, header_env and bearer_token_env on an HTTP entry. An entry that names an unset variable, or a value a header cannot carry, is held back with the reason.
- **tools** — tools/list follows nextCursor for up to 100 pages and restarts once on an invalid cursor. A tool with no name, an inputSchema that is not an object, a repeated name or, over HTTP, an invalid x-mcp-header annotation is dropped and counted. MCP tools are not in the model's tool list: the model finds, opens and runs them through the toolbox tool, under the name mcp_<server>_<tool>. A server an ACP editor supplies is sent every turn unless the editor sets _meta.fx.alwaysLoaded to false.
- **tools.listChanged** — On 2026-07-28 fx opens subscriptions/listen asking for toolsListChanged only. On a 2025 server it takes notifications/tools/list_changed. Either marks the list stale and it is listed again at the next need. A positive ttlMs on a 2026 list also expires it.
- **tools.result** — The whole result goes to the model as one JSON string inside an envelope: {"server", "tool", "result": {content, structuredContent, isError}}. Nothing compares the two fields. An envelope over 16 KiB is stored, and the model gets a 4 KiB preview with a handle for read_tool_result. The files the note reads did not change between its pin and c3dc80c4, apart from one HTTP connection fix in src/mcp (29b9c67f).
- **tools.result.content** — Text blocks stay as block objects in the envelope, with their annotations and _meta. A result with no content key, or a content that is not an array, is invalid and the model gets a failure text. An empty array is sent as "content":[] with no placeholder.
- **tools.result.structuredContent** — A JSON value in the envelope next to content, unvalidated, non-object values included. In a stored result's 4 KiB preview content comes first, so a text mirror longer than that leaves no structuredContent in the preview.
- **tools.result.outputSchema** — Stored and hashed into the tool's definition digest, never checked against structuredContent. A tool whose outputSchema is not an object, or names a dialect other than 2020-12 or draft-07, is left out of the catalog.
- **tools.result.audience** — Checked for shape only. A block addressed to the user still reaches the model with the annotation visible in the envelope. A malformed audience fails the whole result.
- **tools.result.isError** — The same envelope, structuredContent included, returned as a tool failure.
- **tools.result.media** — Image blocks and image/ embedded blobs (png, jpeg, gif, webp) reach a vision model as image parts. Audio and other binary blocks keep their block with the data removed and a delivery note. resource_link blocks and embedded text resources stay in the envelope as JSON.
- **tools.result._meta** — Result-level _meta is dropped where the answer is read. Block-level _meta stays in the envelope text. Tool-level _meta is only hashed, so _meta.ui.visibility has no effect.
- **resources** — The engine sends five kinds of request: server/discover, initialize, tools/list, tools/call and subscriptions/listen. The changelog lists the removal of resources and the resource command under 0.0.15.
- **resources.listChanged** — The listen filter asks for toolsListChanged only, and a resources/list_changed notice has nothing to refresh.
- **resources.subscribe** — No resources/subscribe request, and the listen filter never names resourceSubscriptions.
- **prompts** — No prompts/list or prompts/get request. Removed with resources in 0.0.15.
- **prompts.listChanged** — The listen filter asks for toolsListChanged only.
- **completions** — No completion/complete request.
- **sampling** — Never declared. A 2026 input_required round that asks for sampling ends the call as unsupported input. A 2025 sampling/createMessage request gets -32601.
- **elicitation** — Declared per surface. The terminal app declares form and url. fx ask declares both only when the output mode is a terminal and stdin and stderr are TTYs, and nothing otherwise. An ACP session declares the modes the editor declared and forwards the questions to it. On 2026-07-28 the questions arrive as input_required rounds on tools/call, on 2025 as elicitation/create requests.
- **elicitation.form** — A flat object of string, number, integer, boolean, single-select and multi-select properties, at most 32. The answer is checked against the schema before it is sent. A form the client cannot read gets -32602 on 2025 and ends the call as malformed on 2026.
- **elicitation.url** — Only HTTPS URLs, or HTTP to a loopback host. fx asks before opening the link and flags a Punycode or non-ASCII host. On 2025 it waits for notifications/elicitation/complete and handles the -32042 error that lists required URL elicitations.
- **roots** — Never declared. A 2026 round that asks for roots ends the call as unsupported input, and a 2025 roots/list request gets -32601.
- **roots.listChanged** — Nothing sends notifications/roots/list_changed.
- **logging** — No logging/setLevel, and the per-request _meta carries no logLevel key. The notification handler has no branch for notifications/message, so one is dropped. A stdio server's stderr goes to the debug log, which is a separate channel.
- **instructions** — Kept from the last discover or initialize result. They reach the model with a tool's schema when the toolbox opens or runs that server's tool, cut at the mcp_server_instructions_bytes limit. They are not in the system prompt.
- **icons** — A tool's icons are validated, stored and hashed into the definition digest. Nothing renders them.
- **jsonSchema** — A tool schema that names any other $schema is rejected and the tool is left out. Elicitation forms accept only a flat object of primitive properties. How much of a tool's inputSchema is checked before a call was not read.
- **extensions.io.modelcontextprotocol/ui** — The declared capability object holds elicitation or nothing. No file under src/ names ui:// or resourceUri, and a tool marked app-only stays available to the model.
- **extensions.io.modelcontextprotocol/tasks** — No tasks request. A result whose resultType is anything but complete or input_required, "task" included, is read as unrecognized and treated as invalid.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. The engine sends only server/discover, initialize, tools/list, tools/call and subscriptions/listen, and has had no resources/read since 0.0.15. fx's own skills load from SKILL.md files on disk.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. No events/* request is written and no notifications/events/* handler exists.
- **bonusFeatures.modelInitiatedResourceRead** — fx reads no resources at all.
- **bonusFeatures.deferredToolLoading** — MCP servers are listed in a toolbox menu and their tools stay out of the tool list, so every request sends the same tools. The toolbox tool searches, opens and runs them. The probe ran 0.0.16, where capability_search and mcp_select_tool did this job.
- **bonusFeatures.lazyServerStart** — Each server starts when something first needs its tool list or calls it, and is kept until a reload drops it.
- **bonusFeatures.standardRequestHeaders** — On 2026-07-28 over HTTP: Mcp-Method on every request, Mcp-Name on tools/call, and Mcp-Param-* headers from a tool's x-mcp-header annotations. A tool with an invalid annotation is dropped from the list.
- **bonusFeatures.cacheableResult** — A 2026 tool list is served from cache only while every page's ttlMs holds, capped at 24 hours. A 2025 list stays fresh until it is invalidated or the process restarts.
- **bonusFeatures.progressNotifications** — Every request carries a progressToken equal to its id. Accepted progress on a call reaches the host as a progress event, which the changelog says is shown in the terminal and in fx ask.
- **bonusFeatures.shellToolCalls** — fx mcp call TOOL runs one of the session's MCP tools from a command the shell tool runs, through a Unix-socket bridge to the same engine, and prints only the tool's data. It is not a second MCP client.

## Verified by the probe

17 records from the live probe (`probe/`), client version `0.0.16`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/fx.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta did not reach the model) |
| [with_meta](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 0.0.16 | "…" no marker reached the model; payload: "[\"{\\\"skills\\\":[],\\\"mcp_tools\\\":[{\\\"name\\\":\\\"mcp_probe_probe_empty_object\\\",\\\"ser" |
| [large](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [no_content_key](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 0.0.16 | "…" no marker reached the model; payload: "[\"{\\\"skills\\\":[],\\\"mcp_tools\\\":[{\\\"name\\\":\\\"mcp_probe_probe_no_content_key\\\",\\\"s" |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 0.0.16 | […] and {…} (content 1x, structuredContent 1x, as text) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_string](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [structured_only](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

## Research notes

- [fx removed resources, prompts and HTTP+SSE in 0.0.15](../research/fx-removed-resources-prompts-and-sse-in-0-0-15.md) — *idiosyncrasy*. fx 0.0.15 dropped MCP resources, prompts and the HTTP+SSE transport. At c3dc80c4 its engine sends `server/discover`, `initialize`, `tools/list`, `tools/call` and `subscriptions/listen`, and no other request.
- [fx declares elicitation per surface, and declares nothing when no one can answer](../research/fx-declares-elicitation-only-where-someone-can-answer.md) — *idiosyncrasy*. fx builds its capability object per surface. The terminal app declares elicitation with form and url, `fx ask` declares them only when it runs on a terminal, and an ACP session copies the editor's modes. The probe drove `fx ask --json` and saw `{}`.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [fx sends server/discover at 2026-07-28 before it tries initialize](../research/fx-probes-server-discover-before-initialize.md) — *idiosyncrasy*. fx's hand-written Zig client opens every server with `server/discover` at `2026-07-28` and falls back to `initialize` at `2025-11-25` on a non-modern answer or after 10 seconds. The handshake also accepts `2025-06-18` and `2025-03-26`, and refuses `2024-11-05`.
- [notes/fx-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/fx-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the fx source at 3fd4905.

## Provenance

Read at `c3dc80c4` on 2026-11-16, from `main` of https://github.com/vercel-labs/fx.git. That commit was authored 2026-11-16.

**SDK.** Hand-written in Zig under src/mcp/, whose files import only std and each other. build.zig.zon has an empty dependencies table, so there is no SDK, no lockfile and nothing to patch. fx names its own revisions in src/mcp/core/era.zig. @modelcontextprotocol/sdk 1.30.0 appears in tests/e2e/conformance/package-lock.json as a dependency of the official conformance runner that tests fx. The schema's language enum has no value for Zig, so language is left out. c3dc80c4 is 88 commits after the v0.0.17 tag.

Paths read:

- `src/mcp/`
- `src/core/mcp_host/`
- `src/core/mcp/`
- `src/core/tooling/toolbox.zig`
- `src/tools/capabilities/toolbox.zig`
- `src/builtins/mcp.zig`
- `src/acp/mcp_servers.zig`
- `src/core/cli/cli_ask.zig`
- `src/main.zig`
- `build.zig.zon`
- `CHANGELOG.md`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/fx.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

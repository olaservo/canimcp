# libfx (fx JavaScript adapter)

The fx agent core as a JavaScript library, a native Node.js addon and a WebAssembly build. libfx has no MCP client of its own and no MCP SDK dependency: `createMcpAdapter` from `libfx/mcp` takes a client the embedding application already connected and turns its tools into agent tools. The transport, handshake, `clientInfo`, declared capabilities and authentication all belong to that client. The fx Zig engine is switched off in the libfx core.

## At a glance

| | |
|---|---|
| Registry id | `libfx` |
| Vendor | Vercel Labs |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Speaks MCP via | `@modelcontextprotocol/sdk` (sdk) |
| Category | library |
| Platforms | macos, linux, web |
| Licence | Apache-2.0 |
| Source | <https://github.com/vercel-labs/fx/tree/main/sdk> |
| Home | <https://github.com/vercel-labs/fx/tree/main/sdk#readme> |
| Wire names | not recorded |
| SDK | `@modelcontextprotocol/sdk` · official TypeScript SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Source last updated | 2026-11-16 |
| Last read | 2026-11-16 |
| Probed | `0.0.0-eab1401` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | · untested | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | · untested | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2025-11-25` |
| **Resources** | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read | `2025-11-25` |
| **Roots** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
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
| &nbsp;&nbsp;↳ toolCallCancellation | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ requestCorrelationMeta | ◇ opt-in | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **speaksMcpVia** — Supplied by the embedding application, not installed by libfx. createMcpAdapter accepts any object with listTools() and callTool() and calls them with the TypeScript SDK v1 signatures. The probe supplied @modelcontextprotocol/client 2.4.0, the split v2 package.
- **transports.stdio** — The host's client owns the transport and libfx never sees it. The row is the SDK's: 1.32.2 ships a stdio client transport. The probe ran libfx over stdio with @modelcontextprotocol/client 2.4.0, and the repo's adapter test runs a stdio server through a hand-written client.
- **transports.sse** — The host's client owns the transport. The row is the SDK's: 1.32.2 ships an SSE client transport. Not run with libfx.
- **transports.streamableHttp** — The host's client owns the transport. The row is the SDK's: 1.32.2 ships a Streamable HTTP client transport. Not run with libfx: the probe used stdio, and the repo's HTTP test posts JSON-RPC through a hand-written client.
- **authentication.oauth** — libfx takes no part in authentication. The README says the application creates the client and handles its auth. What OAuth support an application gets depends on the SDK version it installs, which was not read.
- **authentication.header** — Set on the host's transport, outside libfx. Not read.
- **tools** — createMcpAdapter lists once, following nextCursor for up to 64 pages and rejecting a repeated cursor or one over 4096 characters. Each tool becomes a host tool: the prefix option is prepended, characters outside letters, digits, _ and - become _, and the name is cut to 64 characters with a numeric suffix on a collision. A repeated tool name from the server throws. Every tool goes in the model's tool list with idempotent: false.
- **tools.listChanged** — The catalog is read once inside createMcpAdapter. The adapter registers no notification handler and returns only tools, instructions and close().
- **tools.result** — The model receives the joined content text, a newline, and JSON.stringify(structuredContent). Only the JSON is sent when the two strings are identical. There is no envelope. A result longer than the session's max_tool_result_bytes, 64 KiB by default, is replaced whole with "Host tool result exceeded the configured limit". sdk/mcp.js and sdk/engine.js did not change between the note's pin and c3dc80c4.
- **tools.result.content** — Text blocks and embedded text resources are joined with newlines. A resource_link becomes "<name>: <uri>". Audio and non-image blobs become an empty string with no note. An empty result is an empty string with no placeholder.
- **tools.result.structuredContent** — Appended after the text as compact JSON, or sent alone when content is empty. structuredContent: null is not undefined, so the model receives the text "null".
- **tools.result.outputSchema** — The adapter copies name, description and inputSchema and does not read outputSchema. Validation is the host client's: a throw from callTool becomes the tool's error text, as the probe's schema-mismatch run on client 2.4.0 shows.
- **tools.result.audience** — Annotations are not read.
- **tools.result.isError** — Thrown as an Error whose message is the same joined text, which the engine uses as the tool's error content. Empty text becomes "MCP tool <name> failed".
- **tools.result.media** — Image blocks and image/ embedded blobs become typed images next to the text. Audio is dropped.
- **tools.result._meta** — Result _meta is not read.
- **resources** — Fixed context only. The application lists URIs in options.resources. Each is read once with readResource when the adapter is created, and its text is wrapped in <mcp_resource> tags in adapter.instructions. There is no resources/list, no templates, and nothing the model or a user can trigger later. Non-text contents become a one-line placeholder, and the combined instructions are capped at 64 KiB.
- **resources.listChanged** — Resources are read once at construction.
- **resources.subscribe** — The adapter calls readResource and nothing else on resources.
- **prompts** — Fixed context only. The application names prompts in options.prompts, each a name or a getPrompt request. Each is fetched once when the adapter is created, and its message text is wrapped in <mcp_prompt> tags in adapter.instructions. There is no prompts/list and no user invocation.
- **prompts.listChanged** — Prompts are fetched once at construction.
- **completions** — The adapter's client interface has no completion method.
- **sampling** — libfx registers no sampling handler and does not touch the client's capabilities. A Client constructed without options declares none: the probe's initialize capture shows "capabilities": {}. An application can register its own handler on its client. libfx offers its model to no such handler.
- **elicitation** — Nothing by default. Transport, authentication, elicitation, and cleanup stay with the host, in the words of sdk/types/mcp.d.ts. An application that wants it declares it and answers it on its own client.
- **elicitation.form** — Host-owned.
- **elicitation.url** — Host-owned.
- **roots** — Not declared by a default client, and libfx passes no workspace to it.
- **roots.listChanged** — Host-owned.
- **logging** — The adapter registers no handler for notifications/message and never calls setLoggingLevel.
- **instructions** — adapter.instructions holds only the resource and prompt text the application asked for. The adapter never reads the server's initialize instructions. An application can append client.getInstructions() to the agent's instructions itself.
- **icons** — The adapter copies a tool's name, description and inputSchema only.
- **extensions.io.modelcontextprotocol/ui** — Tool _meta is not read, so a tool marked app-only is given to the model like any other.
- **extensions.io.modelcontextprotocol/tasks** — Each call is one callTool that is awaited to its result.
- **bonusFeatures.modelInitiatedResourceRead** — Resources are read only at construction, from URIs the application lists.
- **bonusFeatures.toolCallCancellation** — The turn's AbortSignal is passed as callTool's third argument, the options position in SDK v1. @modelcontextprotocol/client 2.4.0 takes options second, so with that client the signal is not received. Read from source and the two packages. No cancellation was run.
- **bonusFeatures.requestCorrelationMeta** — Off by default. createMcpAdapter(client, { propagateCorrelation: true }) sends a random UUID as _meta["libfx/correlationId"] on each tools/call. It is the only _meta libfx writes.

## Verified by the probe

17 records from the live probe (`probe/`), client version `0.0.0-eab1401`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/libfx.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" no marker reached the model; payload: "" |
| [large](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" no marker reached the model; payload: "Host tool result exceeded the configured limit" |
| [no_content_key](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | {…} structuredContent only (1x, as json) |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [schema_mismatch](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" client error text, no fixture field: "Structured content does not match the tool's output schema: data must have requi" |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | payload once (as json) |
| [sc_empty](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] content only (1x, as json) |
| [sc_null](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"record\",\n    \"code\": \"inva" |
| [sc_string](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"record\",\n    \"code\": \"inva" |
| [structured_only](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |

## Research notes

- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [libfx passes the turn's abort signal where only the v1 TypeScript SDK reads it](../research/libfx-passes-the-abort-signal-in-the-sdk-v1-position.md) — *gap*. libfx calls `client.callTool(params, undefined, { signal })`, the TypeScript SDK v1 signature. `@modelcontextprotocol/client` 2.4.0 declares `callTool(params, options)`, so a v2 client does not receive the signal. Read from source and both packages. No cancellation was run.
- [libfx has no MCP client and no SDK dependency, and wraps a client the application supplies](../research/libfx-has-no-mcp-client-of-its-own.md) — *idiosyncrasy*. libfx depends on no MCP SDK and holds no MCP client. `createMcpAdapter` wraps a client the application already connected, so the wire name, revision, capabilities, transport and auth are the application's. fx's Zig engine is switched off in the libfx core.
- [dist/esm/client/stdio.js](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.2) — *transports.stdio*, read 2026-11-16 at `?` in @modelcontextprotocol/sdk.
- [dist/esm/client/sse.js](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.2) — *transports.sse*, read 2026-11-16 at `?` in @modelcontextprotocol/sdk.
- [dist/esm/client/streamableHttp.js](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.2) — *transports.streamableHttp*, read 2026-11-16 at `?` in @modelcontextprotocol/sdk.
- [notes/fx-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/fx-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises the "JS adapter" section of its fx note, which read the fx source at 3fd4905.
- [dist/esm/client/index.js:479](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.2) — *bonusFeatures.toolCallCancellation*, read 2026-11-16 at `?` in @modelcontextprotocol/sdk. callTool(params, resultSchema = CallToolResultSchema, options).
- [dist/public-CvV4ZHkX.mjs:3866](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0) — *bonusFeatures.toolCallCancellation*, read 2026-11-16 at `?` in @modelcontextprotocol/client. callTool(params, options).

## Provenance

Read at `c3dc80c4` on 2026-11-16, from `main` of https://github.com/vercel-labs/fx.git. That commit was authored 2026-11-16.

**SDK.** Host-supplied, and not a dependency. sdk/package.json has no dependencies, devDependencies or peerDependencies field, and the published libfx 0.0.17 lists only its four native-addon packages as optionalDependencies. There is no declared or resolved version to record: the application installs the SDK and passes a connected client in. sdk/types/mcp.d.ts describes the calls as the TypeScript SDK v1 signatures. 1.32.2 was the newest v1 release on npm on 2026-11-16, and it sets LATEST_PROTOCOL_VERSION to 2025-11-25. The probe supplied @modelcontextprotocol/client 2.4.0, which defaults to the initialize handshake at 2025-11-25 and reaches 2026-07-28 only when the application sets its versionNegotiation option. Nothing is patched, because nothing is installed. Published libfx versions are fx's: c3dc80c4 is 88 commits after v0.0.17.

Paths read:

- `sdk/mcp.js`
- `sdk/types/mcp.d.ts`
- `sdk/package.json`
- `sdk/README.md`
- `sdk/engine.js`
- `sdk/tests/test-mcp-adapter.mjs`
- `src/wasm_core_main.zig`
- `src/napi_core_main.zig`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/libfx.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

# Langflow

Visual builder for AI flows and agents, served as a web app and a desktop app. Its MCP Tools component connects to MCP servers registered under Settings > MCP Servers and hands their tools to an agent or runs one tool directly. The client is Langflow's own wrapper on the official mcp SDK in lfx.base.mcp.util. langchain-mcp-adapters is declared as an extra and never imported. Only tools are consumed, no client capability is declared, and the wire name is the SDK placeholder mcp. Langflow also serves flows as an MCP server, which this entry does not cover.

## At a glance

| | |
|---|---|
| Registry id | `langflow` |
| Vendor | Langflow |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Speaks MCP via | `mcp` (sdk) |
| Category | automation |
| Platforms | windows, macos, linux, web |
| Licence | MIT |
| Source | <https://github.com/langflow-ai/langflow> |
| Home | <https://www.langflow.org> |
| Wire names | `mcp` |
| SDK | `mcp` 1.30.0 · declares `>=1.30.0,<2.0.0` · official Python SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Rows describe | `2025-11-25`, the newest revision it speaks |
| Source last updated | 2026-11-27 |
| Last read | 2026-11-27 |

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
| &nbsp;&nbsp;↳ none | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Resources** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;↳ tools | ○ unsupported | read ⇧ | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read ⇧ | `2025-11-25` |
| **Roots** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2025-11-25` |
| **Instructions** | ○ unsupported | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ pooledSessions | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ pinnedToolContracts | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ toolCallTracing | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **speaksMcpVia** — MCPStdioClient and MCPStreamableHttpClient in lfx.base.mcp.util own a pooled SDK ClientSession per server, built with no callbacks and no client_info, so the SDK decides the handshake, the revision and the client name. The langchain-mcp-adapters extra (0.1.14 in uv.lock) is not imported by any Langflow code.
- **transports.stdio** — A server config with a command runs through the SDK's stdio_client. The command must be one of node, python, python3, npx, uvx, docker, or cmd, sh or bash wrapping one of those, and args and env pass a shell-metacharacter and environment blocklist. The child gets the SDK's default inherited variables plus DEBUG=true, PATH and the config's env. Headers on a stdio config are inserted into argv as --headers key value, for mcp-proxy. When custom code execution is restricted, only administrators may use stdio servers. Langflow registers each project's own MCP server in the user's list as a stdio uvx mcp-proxy entry.
- **transports.sse** — Used when a server's config sets mode SSE, or as a fallback after a Streamable HTTP attempt fails with 400, 404, 405 or 406. A timeout or other transient failure never falls back. After one SSE success the server is remembered as SSE-only for the life of the session manager. The SDK's sse_client gets the configured headers, a 30 s read timeout and Langflow's httpx factory with redirects off. Pinned preset components disable the fallback.
- **transports.streamableHttp** — The default for a config with a url and no mode. Langflow opens the SDK's deprecated streamablehttp_client alias with its own httpx factory (redirects off, optional SSL verification off, SSRF address pinning when that protection is on). Each attempt gives initialize a fixed 2 s, with three attempts, independent of LANGFLOW_MCP_SERVER_TIMEOUT. Sessions are pooled per URL and headers and kept until idle for 400 s. On disconnect Langflow sends its own DELETE without an Mcp-Session-Id header before the SDK sends one with it.
- **authentication.oauth** — No OAuth code on the client path. The SDK's OAuthClientProvider is not imported, and the httpx factory is never given an auth object. A 401 surfaces as a connection error naming the server and the status. The OAuth code elsewhere in Langflow belongs to its own MCP server and MCP Composer.
- **authentication.header** — Headers come from the server config and from the component's Headers input, which wins on a clash. A header value that names a global variable is replaced by its value. When Langflow itself runs as an MCP server, a header whose value repeats its name, such as x-api-key: x-api-key, forwards the incoming request's header. Names are lowercased and values with CR or LF are dropped. An operator can have an end-user id header added for allowlisted internal hosts only.
- **authentication.none** — A server with no headers connects without credentials.
- **tools** — tools/list is called with no cursor, so only the first page is used. The MCP Tools component lists tools again on every agent run, with a 30 s per-component cache, and on demand in the editor. Each tool becomes a LangChain StructuredTool under the server's tool name, with the description and an args schema rebuilt from inputSchema. The raw inputSchema and outputSchema are kept in tool metadata. title, annotations, icons and _meta are not kept. With Tool mode off the component runs one selected tool and outputs its content blocks as a table.
- **tools.listChanged** — ClientSession gets no message_handler, so the SDK drops notifications/tools/list_changed. Sessions stay open in the pool, and the list is read again at the next agent run.
- **resources** — No resources/list, resources/templates/list or resources/read call anywhere on the client path. The client classes expose list_tools and call_tool only.
- **resources.listChanged** — Nothing lists resources, and no message_handler is passed.
- **resources.subscribe** — resources/subscribe is never called.
- **prompts** — prompts/list and prompts/get are never called.
- **prompts.listChanged** — Nothing lists prompts, and no message_handler is passed.
- **completions** — completion/complete is never called.
- **sampling** — Not declared. No sampling_callback is passed, so the SDK leaves sampling out of the capabilities and answers sampling/createMessage with an Invalid Request error.
- **sampling.context** — Follows from sampling.
- **sampling.tools** — Follows from sampling.
- **elicitation** — Not declared. No elicitation_callback is passed, so the SDK leaves elicitation out of the capabilities.
- **elicitation.form** — Follows from elicitation.
- **elicitation.url** — Follows from elicitation.
- **roots** — Not declared. No list_roots_callback is passed, so the SDK answers roots/list with an Invalid Request error.
- **roots.listChanged** — notifications/roots/list_changed is never sent.
- **logging** — logging/setLevel is never called and no logging_callback is passed, so the SDK's default callback discards notifications/message. Langflow's own logs and the mcp.tool.call tracing span record client-side events only.
- **instructions** — The stdio path discards the InitializeResult. The HTTP and SSE paths keep it on the session only so a pinned preset can compare serverInfo. instructions is never read or put in front of a model.
- **icons** — A tool keeps its name, description, inputSchema and outputSchema. Tool icons and the server's icons and websiteUrl are not read.
- **jsonSchema** — inputSchema is rebuilt as a Pydantic model by create_input_schema_from_json_schema, and the model-facing schema comes from that model. The root must have type object. Otherwise the conversion raises ValueError, and update_tools re-raises it, so one such tool fails the whole server's tool load. The dialect named by $schema is not read.
- **jsonSchema.features** — anyOf becomes the first non-null subtype, or T \| None for a two-member nullable. $ref resolves by its last path segment against $defs only, and a missing or circular target becomes a string. A self-referencing object becomes dict. oneOf and allOf without a type become Any. additionalProperties false drops extra keys, and anything else keeps them. enum and the constraint keywords are not carried into the model.
- **extensions.io.modelcontextprotocol/ui** — Not declared, and no code reads a tool's _meta.ui or a ui:// resource. Tool _meta is not kept at discovery.
- **extensions.io.modelcontextprotocol/tasks** — No tasks capability is declared and no tasks/* request is sent. The SDK's experimental task handlers stay at their defaults, which build no capability.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. Each ClientSession is built with no arguments beyond the streams, so the SDK builds the capabilities with experimental set to None, and the client sends only tools/list and tools/call. The mcp 1.30.0 SDK has no skills/list or resources/directory/read method.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. No code sends events/list, events/poll, events/stream or events/subscribe, and the client capabilities come from the SDK default with experimental set to None. The mcp 1.30.0 SDK has no events methods.
- **extensions.io.modelcontextprotocol/events.poll** — No events/poll request.
- **extensions.io.modelcontextprotocol/events.push** — No events/stream request and no handler for notifications/events/*.
- **extensions.io.modelcontextprotocol/events.webhook** — No events/subscribe request.
- **bonusFeatures.modelInitiatedResourceRead** — There is no resource support of any kind.
- **bonusFeatures.pooledSessions** — One MCPSessionManager in the component cache keeps up to 10 live sessions per server, keyed by command, args and env for stdio and by URL and headers for HTTP. Runs and chat sessions that reach the same server reuse a live session. Idle sessions are reaped after 400 s. A tool call that fails with a closed connection discards that session and retries once on a new one.
- **bonusFeatures.pinnedToolContracts** — Preset components shipped by bundles (IBM watsonx.data, Confluent) can pin a server's endpoint, transport, tool names, argument and result schemas, a digest of tools/list and serverInfo. A mismatch at load raises an error. Unpinned tools are hidden, and pinned argument schemas are checked again at call time.
- **bonusFeatures.toolCallTracing** — Each tool call runs inside an mcp.tool.call span with the tool name, the transport actually used and the server (stdio command basename or URL host). A result with isError true marks the span as an error.

## Research notes

- [Langflow requires mcp below 2 for its client and pins the servers it launches below 2 as well](../research/langflow-caps-the-sdk-below-mcp-2.md) — *gap*. lfx and langflow-base require mcp>=1.30.0,<2.0.0 and lock 1.30.0, which proposes 2025-11-25, so 2026-07-28 is unreachable. Langflow also injects --with mcp~=1.28 into every uvx server it launches, because mcp-proxy and mcp-composer fail to import under the 2.0 SDK.
- [Langflow gives a Streamable HTTP server two seconds to answer initialize, and a timeout never falls back to SSE](../research/langflow-gives-streamable-http-two-seconds-to-initialize.md) — *idiosyncrasy*. Langflow waits a fixed 2 s for initialize on each of three Streamable HTTP attempts, whatever LANGFLOW_MCP_SERVER_TIMEOUT says. It falls back to SSE only on a 400, 404, 405 or 406. A timeout counts as transient, so a slow server fails with no SSE attempt.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [Langflow's MCP client is its own wrapper on the mcp SDK, and langchain-mcp-adapters is an unused extra](../research/langflow-speaks-mcp-through-its-own-sdk-wrapper.md) — *misconception*. Langflow lists langchain-mcp-adapters as an optional extra, and no Langflow code imports it. Every MCP server connection goes through lfx.base.mcp.util, which builds a bare SDK ClientSession, so the wire name is the SDK placeholder mcp and no client capability is declared.
- [mcp/client/stdio/__init__.py](https://pypi.org/project/mcp/1.30.0/) — *transports.stdio*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The config env is merged over get_default_environment().
- [mcp/client/streamable_http.py](https://pypi.org/project/mcp/1.30.0/) — *transports.streamableHttp*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. MCP-Protocol-Version header after negotiation, and the deprecated alias with terminate_on_close=True.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *tools.listChanged*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The default message handler does nothing.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *sampling*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The default callback and the capability built from it.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *elicitation*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *roots*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *logging*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The default logging callback is a no-op.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *extensions.io.modelcontextprotocol/tasks*, read 2026-11-20 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The initialize request sends experimental=None and no extensions.
- [mcp/client/session.py](https://pypi.org/project/mcp/1.30.0/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 1.30.0 wheel. The initialize request sends experimental=None and no extensions.

## Provenance

Read at `2b6faa1c` on 2026-11-27, from `main` of https://github.com/langflow-ai/langflow.git. That commit was authored 2026-11-27.

**SDK.** A base dependency of both lfx and langflow-base, imported at module level in lfx.base.mcp.util. Not patched: the root [tool.uv] constraint and override lists have no mcp entry, [tool.uv.sources] names only workspace members, and the repository has no patch files or vendored SDK. The <2.0.0 cap rules out mcp 2.x, so 2026-07-28 is unreachable. langchain-mcp-adapters>=0.1.14,<0.2.0 is an optional extra of langflow-base, locked at 0.1.14, and no Langflow code imports it. Separately, Langflow injects --with mcp~=1.28 into the uvx servers it launches itself (LANGFLOW_MCP_SDK_CONSTRAINT).

Paths read:

- `src/lfx/src/lfx/base/mcp/`
- `src/lfx/src/lfx/components/models_and_agents/mcp_component.py`
- `src/lfx/src/lfx/schema/json_schema.py`
- `src/lfx/src/lfx/services/settings/groups/mcp.py`
- `src/backend/base/langflow/api/utils/mcp/discovery.py`
- `src/backend/base/langflow/api/utils/mcp/config_utils.py`
- `src/backend/base/langflow/api/v2/mcp.py`
- `src/lfx/pyproject.toml`
- `src/backend/base/pyproject.toml`
- `pyproject.toml`
- `uv.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

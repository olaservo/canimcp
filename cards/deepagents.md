# deepagents

LangChain's Python agent harness. The core deepagents library has no MCP code and no MCP dependency: create_deep_agent takes LangChain tools and the application supplies them. The MCP route in the monorepo is deepagents-code, the dcode terminal agent, which connects to each server with a FastMCP proxy client and converts tools with langchain.mcp. deepagents-talon and the evals harness load tools through langchain.mcp's MCPAdapter. The capability rows describe deepagents-code.

## At a glance

| | |
|---|---|
| Registry id | `deepagents` |
| Vendor | LangChain |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Speaks MCP via | `fastmcp` (sdk) |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/langchain-ai/deepagents> |
| Home | <https://docs.langchain.com/oss/python/deepagents/overview> |
| Wire names | `mcp` |
| SDK | `fastmcp` 4.1.2 · declares `>=4.0.0b4` · Python SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Rows describe | `2025-11-25`, the newest revision it speaks |
| Source last updated | 2026-11-26 |
| Last read | 2026-11-26 |
| Probed | `0.7.34+code-0.2.5` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ○ unsupported | read ⇧ | `2025-11-25` |
| **Resources** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read, declared | `2025-11-25` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ tools | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ○ unsupported | read, declared | `2025-11-25` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read | `2025-11-25` |
| **Roots** | ○ unsupported | read, declared | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Logging** | ◐ partial | read | `2025-11-25` |
| **Instructions** | ○ unsupported | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
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
| &nbsp;&nbsp;↳ deferredToolLoading | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sessionRecovery | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ projectServerApproval | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **speaksMcpVia** — FastMCP's client is what speaks to a server, over the official mcp SDK's ClientSession. deepagents-code builds one FastMCP StatefulProxyClient per configured server and mounts them on an in-process FastMCP router. langchain.mcp, a module inside the langchain package, turns each MCP tool into a LangChain tool and each result into a ToolMessage. deepagents-code's own code covers config discovery and merging, ${VAR} expansion, project server approval, OAuth login and token storage, tool naming and filtering, timeouts and reconnects. langchain-mcp-adapters was removed in deepagents-code 0.1.71 and is in no manifest or lockfile at 87f6080d.
- **transports.stdio** — FastMCP's StdioTransport, built from the config entry by StdioMCPServer.to_transport. An entry with no type and no url is stdio. deepagents-code checks that the command is on PATH before connecting, keeps the subprocess alive across tool calls, and sends the server's stderr to the null device because the TUI owns the terminal. Project-level stdio servers start only after the user approves them.
- **transports.sse** — Used when the entry sets type or transport to sse, and when an entry gives only a url whose path has a /sse segment: deepagents-code leaves the transport unset in that case and FastMCP infers SSE from the URL. FastMCP marks its SSE transport legacy-only.
- **transports.streamableHttp** — The default for an entry with a url and no type. streamable_http and streamable-http are accepted as aliases for http. deepagents-code supplies the httpx2 client: 2 second connect timeout, 30 second default, 300 second read, redirects followed.
- **authentication.oauth** — A subclass of the SDK's OAuthClientProvider. It is attached when the entry sets auth: oauth, or when tokens from an earlier login are stored and no Authorization header is configured. Loading tools never opens a browser: a server with no usable tokens, or one that answers 401 with an RFC 9728 Bearer challenge, is listed as unauthenticated and the user runs dcode mcp login <server>. Login uses a loopback callback on localhost, reusing the port of an earlier registration, with a paste-back prompt as the fallback. Tokens are stored per server in a file under the state directory, and refreshes are serialized across processes with a file lock. No client_metadata_url is passed, so the SDK registers dynamically and never uses a Client ID Metadata Document. GitHub's hosted server uses the device flow with a built-in public client id, and Slack's uses a built-in client id with a fixed callback port 3118.
- **authentication.header** — A headers map on a remote entry is passed to the transport. Values must be strings, and ${VAR} and ${VAR:-default} references are expanded from the environment when the server is activated. An entry cannot combine auth: oauth with an Authorization header, and a static Authorization header takes precedence over stored OAuth tokens.
- **tools** — tools/list is sent once per server at load through FastMCP's list_tools, which follows nextCursor for up to 250 pages. Each tool becomes a LangChain StructuredTool through langchain.mcp's as_langchain_tool and is offered to the model as <server>_<tool>. A name with characters outside A-Z, a-z, 0-9, _ and -, or longer than 64, is sanitized and given a 12 character hash suffix. allowedTools and disabledTools filter a server's tools, with glob patterns. A call is cut off after 120 seconds by default and the model gets an error message saying the operation may still be running.
- **tools.listChanged** — The per-server client is built with no message handler, so notifications/tools/list_changed is not acted on. The LangChain tools are built once per load.
- **tools.result** — content only. langchain.mcp converts the content blocks into the ToolMessage content and puts structuredContent on ToolMessage.artifact, which no provider request is built from. The rule is ported from langchain-mcp-adapters.
- **tools.result.content** — Every content block reaches the model, converted to a LangChain block. An empty content array gives a ToolMessage with empty content, with no fallback to structuredContent.
- **tools.result.structuredContent** — Held as MCPToolArtifact on ToolMessage.artifact and never serialized for the model. A PostToolUse hook receives the whole ToolMessage, artifact included, and can return text as additionalContext.
- **tools.result.outputSchema** — deepagents never reads outputSchema. The mcp SDK validates successful results against it on the in-process router session, and a mismatch raises a RuntimeError out of the tool call, so the call ends without a ToolMessage. The per-server session skips the check.
- **tools.result.audience** — annotations.audience is not read. A block marked for the user reaches the model like any other.
- **tools.result.isError** — The content blocks become a ToolMessage with status error. structuredContent is dropped. With no content blocks the text is "The MCP tool reported an error with empty content."
- **tools.result.media** — Image blocks, resource links and embedded resources become image, file or text blocks, which the installed provider package then converts. An audio block raises NotImplementedError and the call ends without a ToolMessage.
- **tools.result._meta** — Result _meta is not read by deepagents or langchain.mcp.
- **resources** — No resources/list, resources/templates/list or resources/read call. deepagents-code uses a server for its tools only, and langchain.mcp converts tools only.
- **resources.listChanged** — No resource support and no notification handler.
- **resources.subscribe** — resources/subscribe is never sent.
- **prompts** — No prompts/list or prompts/get call.
- **prompts.listChanged** — No prompt support and no notification handler.
- **completions** — completion/complete is never sent.
- **sampling** — Declared to every server and not served. FastMCP's ProxyClient installs a forwarding handler by default, and the handler relays sampling/createMessage to the in-process router session, whose client deepagents-code builds with no handler. On deepagents-code 0.2.5 with fastmcp 4.1.2 and mcp 2.2.0 a server that sent sampling/createMessage got a JSON-RPC error: "Cannot send 'sampling/createMessage': this transport context has no back-channel for server-initiated requests." The loader code is the same at 87f6080d.
- **sampling.context** — No sampling handler reads includeContext.
- **sampling.tools** — The declaration is sampling: {} with no tools sub-capability, and no handler exists.
- **elicitation** — Declared to every server and not served. FastMCP's ProxyClient installs a forwarding handler by default, and the handler relays elicitation/create to the in-process router session, whose client deepagents-code builds with no handler. On deepagents-code 0.2.5 with fastmcp 4.1.2 and mcp 2.2.0 a server that sent elicitation/create got a JSON-RPC error: "Cannot send 'elicitation/create': this transport context has no back-channel for server-initiated requests." The loader code is the same at 87f6080d.
- **elicitation.form** — Declared, and answered with an error.
- **elicitation.url** — Declared because the SDK declares form and url together. FastMCP's forwarding handler turns a URL request into a form request with an empty schema before relaying it, and the relay fails.
- **roots** — Declared to every server and not served. FastMCP's ProxyClient installs a forwarding handler by default, and the handler relays roots/list to the in-process router session, whose client deepagents-code builds with no handler. On deepagents-code 0.2.5 with fastmcp 4.1.2 and mcp 2.2.0 a server that sent roots/list got a JSON-RPC error: "Cannot send 'roots/list': this transport context has no back-channel for server-initiated requests." The loader code is the same at 87f6080d.
- **roots.listChanged** — The SDK declares roots.listChanged: true whenever a roots callback exists. Nothing in deepagents-code sends notifications/roots/list_changed.
- **logging** — Receives and does not steer. Each per-server client gets a log handler that writes notifications/message to the deepagents_code.mcp_tools Python logger at the level the server chose, tagged with the server name and the MCP logger name. The records go to the Python logging of deepagents-code. They do not reach the model. logging/setLevel is never sent.
- **instructions** — The instructions string from the initialize result is available on the FastMCP client and deepagents-code does not read it. langchain.mcp reads server_info from the client it is given, which here is the in-process router, and does not read instructions.
- **icons** — No reference to icons or websiteUrl under libs/code. The server and tool records the /mcp viewer is given hold names, descriptions, transport, status and input schemas.
- **extensions.io.modelcontextprotocol/ui** — No MCP Apps support. No extension is declared, _meta.ui is not read, and a tool whose visibility leaves out the model is offered to the model like any other.
- **extensions.io.modelcontextprotocol/tasks** — No tasks/* call. FastMCP's ProxyClient turns off the client's internal tasks extension, so nothing about tasks is declared to a server.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. FastMCP's client has skills/list and skills/get, and they run only on a client built with SkillsClientExtension. No deepagents client passes it: deepagents-code builds StatefulProxyClient and FastMCPClient with no extensions, and deepagents-talon goes through langchain.mcp's MCPAdapter, which does the same. deepagents' own skills load from local directories.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. No events/* request is sent, and neither fastmcp-slim 4.1.2 nor 4.2.3 nor langchain 1.5.2 has an events client.
- **extensions.io.modelcontextprotocol/events.poll** — events/poll is never sent.
- **extensions.io.modelcontextprotocol/events.push** — events/stream is never sent and notifications/events/* has no handler.
- **extensions.io.modelcontextprotocol/events.webhook** — events/subscribe is never sent.
- **bonusFeatures.modelInitiatedResourceRead** — No resource support of any kind, so the model has no way to read one.
- **bonusFeatures.deferredToolLoading** — models.provider_tool_search defaults to on. On a listed OpenAI Responses or Anthropic model, reached directly or through the LangSmith gateway, MCP tool schemas are left to the provider's native tool search. Every other route loads all schemas up front.
- **bonusFeatures.sessionRecovery** — A FastMCP middleware on each mounted proxy catches a closed connection during tools/call, tears the session down so the next call reconnects, and returns an isError result saying the operation may have completed and was not retried. The failed call is never replayed. A failed token refresh is returned as an error result carrying the login command.
- **bonusFeatures.projectServerApproval** — Config is read from the user-level .mcp.json, <project>/.deepagents/.mcp.json and <project>/.mcp.json. Servers from the two project files, stdio and remote alike, load only when the whole config is trusted with --trust-project-mcp or when a scoped approval or the environment allowlist enables that server, matched on the project root and a fingerprint of the server entry. A server on the user deny list is dropped even from a trusted config. A project server skipped for lack of approval is listed in /mcp and after /reload with status untrusted and a message to restart and approve it, since approval happens only in the startup prompt.

## Verified by the probe

68 records from the live probe (`probe/`), client version `0.7.34+code-0.2.5`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/deepagents.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.app_only/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.app_only/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.meta_only/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.meta_only/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.with_meta/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.with_meta/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.audience_user/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.audience_user/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.empty_object/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.empty_object/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.large/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.large/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.no_content_key/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.no_content_key/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.is_error/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.is_error/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.with_image/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as blocks) |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.with_image/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.schema_match/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.schema_match/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.schema_mismatch/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.schema_mismatch/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | payload once (as json) |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | payload once (as json) |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.mirror/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | payload 2x (as json) |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.mirror/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | payload once (as text) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.sc_empty/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as json) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.sc_empty/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.sc_null/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.sc_null/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.sc_string/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.sc_string/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | "…" no marker reached the model; payload: "[]" |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | "…" no marker reached the model; payload: "[]" |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.structured_only/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.structured_only/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | "…" no marker reached the model; payload: "<result>[]</result>" |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.summary_and_data/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.summary_and_data/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |

## Where the evidence disagrees

- **sampling** — recorded as `unsupported`, but declared-tier evidence at `2025-11-25` says `full`.
  <br>canimcp-probe (2026-11-08) — The initialize request in probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.app_only/wire.jsonl, from deepagents-code 0.2.5 on fastmcp 4.1.2 and mcp 2.2.0, declares sampling: {}.
- **elicitation** — recorded as `unsupported`, but declared-tier evidence at `2025-11-25` says `full`.
  <br>canimcp-probe (2026-11-08) — The initialize request in probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.app_only/wire.jsonl, from deepagents-code 0.2.5 on fastmcp 4.1.2 and mcp 2.2.0, declares elicitation: {form: {}, url: {}}.
- **roots** — recorded as `unsupported`, but declared-tier evidence at `2025-11-25` says `full`.
  <br>canimcp-probe (2026-11-08) — The initialize request in probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.app_only/wire.jsonl, from deepagents-code 0.2.5 on fastmcp 4.1.2 and mcp 2.2.0, declares roots: {listChanged: true}.

## Research notes

- [deepagents-code declares sampling, elicitation and roots to every server and answers none of them](../research/deepagents-code-declares-capabilities-it-cannot-serve.md) — *idiosyncrasy*. deepagents-code declares sampling, form and URL elicitation, and roots with listChanged to every server, because FastMCP's ProxyClient installs forwarding handlers by default. Nothing behind them answers, so each request gets a JSON-RPC error.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [The deepagents library has no MCP client; deepagents-code and Talon bring their own, on FastMCP](../research/deepagents-core-library-has-no-mcp-client.md) — *misconception*. The deepagents library has no MCP code or dependency. Sibling packages do. deepagents-code and deepagents-talon use FastMCP with langchain.mcp, and the evals harness uses langchain.mcp's MCPAdapter. langchain-mcp-adapters left in deepagents-code 0.1.71.
- [deepagents-code offers servers 2025-11-25 because FastMCP's proxy client defaults to the handshake](../research/deepagents-code-inherits-the-handshake-era-from-fastmcps-proxy-client.md) — *idiosyncrasy*. deepagents-code names no protocol revision. Its per-server client is FastMCP's ProxyClient, which defaults to the initialize handshake, so servers are offered 2025-11-25. dcode mcp login and deepagents-talon use a plain FastMCP Client, which probes server/discover first.
- [langchain/mcp/tools.py:234-304](https://pypi.org/project/langchain/1.5.2/) — *tools*, read 2026-11-26 at `?` in langchain-ai/langchain. langchain 1.5.2, from the PyPI wheel; tools.py is byte-identical to 1.5.0. as_langchain_tool builds a StructuredTool with response_format content_and_artifact.
- [notes/deepagents-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/deepagents-tool-result-handling.md) — *tools.result*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the deepagents source at a93aed4 with langchain 1.5.0, fastmcp 4.1.2 and mcp 2.3.0.
- [langchain/mcp/__init__.py:19-38](https://pypi.org/project/langchain/1.5.2/) — *resources*, read 2026-11-26 at `?` in langchain-ai/langchain. langchain 1.5.2, from the PyPI wheel. The adapter exports MCPAdapter, MCPToolArtifact and as_langchain_tool. It converts tools only.
- [langchain/mcp/__init__.py:19-38](https://pypi.org/project/langchain/1.5.2/) — *prompts*, read 2026-11-26 at `?` in langchain-ai/langchain. langchain 1.5.2, from the PyPI wheel. The adapter exports MCPAdapter, MCPToolArtifact and as_langchain_tool. It converts tools only.
- [langchain/mcp/__init__.py:19-38](https://pypi.org/project/langchain/1.5.2/) — *completions*, read 2026-11-26 at `?` in langchain-ai/langchain. langchain 1.5.2, from the PyPI wheel. The adapter exports MCPAdapter, MCPToolArtifact and as_langchain_tool. It converts tools only.
- [langchain/mcp/tools.py:204-209](https://pypi.org/project/langchain/1.5.2/) — *instructions*, read 2026-11-26 at `?` in langchain-ai/langchain. langchain 1.5.2, from the PyPI wheel. _tool_metadata reads client.server_info only.
- [notes/deepagents-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/deepagents-tool-result-handling.md) — *extensions.io.modelcontextprotocol/ui*, read 2026-11-16 at `711f1f6` in olaservo/structured-content-research. That note searched libs/ and langchain.mcp for ui://, resourceUri, io.modelcontextprotocol/ui and visibility at a93aed4 and found nothing MCP-related.
- [langchain/mcp/adapter.py:190-199](https://pypi.org/project/langchain/1.5.2/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in langchain-ai/langchain. langchain 1.5.2 wheel, the version every libs/ uv.lock resolves. MCPAdapter builds FastMCPClient(target) with no extensions; langchain/mcp has no skills or events code. No deepagents lockfile contains langchain-mcp-adapters.
- [fastmcp/client/mixins/skills.py:40-59](https://pypi.org/project/fastmcp-slim/4.1.2/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in PrefectHQ/fastmcp. fastmcp-slim 4.1.2 wheel (libs/code). list_skills_mcp and get_skill_mcp require a modern connection, SkillsClientExtension in Client(extensions=[...]) and the server's io.modelcontextprotocol/skills entry. 4.2.3 (libs/talon) has the same check in _require_skills_extension at line 73.
- [fastmcp/client/extension_hooks.py:54-68](https://pypi.org/project/fastmcp-slim/4.2.3/) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in PrefectHQ/fastmcp. fastmcp-slim 4.1.2 and 4.2.3 wheels. The only extensions folded in by default come from registered factories, which only fastmcp_tasks registers; skills is never added by default, and neither version has an events client.
- [langchain/mcp/adapter.py:190-199](https://pypi.org/project/langchain/1.5.2/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in langchain-ai/langchain. langchain 1.5.2 wheel, the version every libs/ uv.lock resolves. MCPAdapter builds FastMCPClient(target) with no extensions; langchain/mcp has no skills or events code. No deepagents lockfile contains langchain-mcp-adapters.
- [fastmcp/client/extension_hooks.py:54-68](https://pypi.org/project/fastmcp-slim/4.2.3/) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in PrefectHQ/fastmcp. fastmcp-slim 4.1.2 and 4.2.3 wheels. The only extensions folded in by default come from registered factories, which only fastmcp_tasks registers; skills is never added by default, and neither version has an events client.

## Provenance

Read at `87f6080d` on 2026-11-26, from `main` of https://github.com/langchain-ai/deepagents.git. That commit was authored 2026-11-26.

**SDK.** Versions are deepagents-code's, from libs/code. fastmcp 4.1.2 is a metapackage over fastmcp-slim 4.1.2, which holds the code. It runs the official mcp SDK, declared "mcp>=2.0.0" and resolved to 2.3.0 with mcp-types 2.3.0. langchain is declared ">=1.5.2,<2.0.0" and resolves to 1.5.2, whose mcp extra asks for fastmcp>=4.0.11; deepagents-code depends on fastmcp directly and does not use the extra. Not patched: no patches directory, no vendored fork, and the one [tool.uv] override in libs/code is for filelock. deepagents-code does subclass the SDK's OAuthClientProvider and reads private FastMCP attributes (_disconnect, _session_state). The core library's manifest and lockfile hold neither fastmcp nor mcp. deepagents-talon declares "fastmcp>=4.2.3" and "mcp>=2.3.0" and resolves to fastmcp 4.2.3 and mcp 2.3.0. The evals harness declares "langchain[mcp]>=1.4.1" and resolves fastmcp 4.2.2 and mcp 2.3.0. deepagents names no protocol revision: FastMCP's ProxyClient picks the handshake era and the mcp SDK's LATEST_HANDSHAKE_VERSION picks 2025-11-25. The probe ran deepagents-code 0.2.5 with mcp 2.2.0; the lockfile now resolves 2.3.0.

Paths read:

- `libs/code/deepagents_code/mcp_tools.py`
- `libs/code/deepagents_code/mcp_proxy.py`
- `libs/code/deepagents_code/mcp_middleware.py`
- `libs/code/deepagents_code/mcp_auth.py`
- `libs/code/deepagents_code/mcp_config.py`
- `libs/code/deepagents_code/mcp_providers`
- `libs/code/deepagents_code/provider_tool_search.py`
- `libs/code/deepagents_code/server_graph.py`
- `libs/code/pyproject.toml`
- `libs/code/uv.lock`
- `libs/deepagents/pyproject.toml`
- `libs/talon/deepagents_talon/mcp.py`
- `libs/talon/deepagents_talon/mcp_auth.py`
- `libs/talon/pyproject.toml`
- `libs/talon/uv.lock`
- `libs/evals/deepagents_harbor/langgraph_project/langgraph_agent.py`
- `libs/acp/deepagents_acp/server.py`
- `libs/evals/pyproject.toml`
- `libs/evals/uv.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/deepagents.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

# mcp-use

Open source MCP framework from mcp-use, Inc. with a TypeScript binding and a Python binding in one repository. The client side is @mcp-use/client (MCPClient, connectors, OAuth, React hooks) and @mcp-use/agent (MCPAgent, a provider-neutral tool loop) in TypeScript, and the mcp-use PyPI package (MCPClient and a LangChain MCPAgent) in Python. The repository also holds an MCP server framework (the mcp-use npm package), an inspector, a CLI, a scaffolder, a tunnel and an MCP Apps view SDK, which are out of scope here. The rows describe a default MCPClient and MCPAgent construction of the TypeScript binding, which the root README presents as the framework and which runs on the v2 SDK. Row notes say where the Python binding differs. Both bindings send anonymized telemetry to PostHog by default.

## At a glance

| | |
|---|---|
| Registry id | `mcp-use` |
| Vendor | mcp-use, Inc. |
| Kind | framework. A library an application embeds. A capability row is what a default install declares, and the embedding application can change it. |
| Category | library |
| Platforms | windows, macos, linux, web |
| Licence | MIT |
| Source | <https://github.com/mcp-use/mcp-use> |
| Home | <https://mcp-use.com/> |
| Wire names | `mcp-use`, `http-connector`, `stdio-connector` |
| SDK | `@modelcontextprotocol/client` 2.3.1 · official TypeScript SDK · unpatched |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-11-19 |
| Last read | 2026-11-20 |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25`, `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25`, `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2025-11-25`, `2026-07-28` |
| **Resources** | ◐ partial | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ◇ opt-in | read | `2026-07-28` |
| **Prompts** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2026-07-28` |
| **Completions** | ◇ opt-in | read | `2026-07-28` |
| **Sampling** | ◇ opt-in | read | `2026-07-28` |
| **Elicitation** | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ◇ opt-in | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ◇ opt-in | read ⇧ | `2026-07-28` |
| **Roots** | ● full | read | `2025-11-25`, `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2026-07-28` |
| **Logging** | ◇ opt-in | read | `2026-07-28` |
| **Instructions** | ◇ opt-in | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | — not recorded | | |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ◐ partial | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — StdioConnector, Node only, built from a config entry with command, args, env, cwd and stderr. The child gets the SDK's safe default environment plus env, and stderr is piped to errlog by default. Its protocolNegotiation defaults to legacy, so a stdio server gets the initialize handshake at 2025-11-25 unless the entry sets auto or a pin. Python: StdioConnector on the SDK's stdio_client.
- **transports.sse** — The TypeScript HttpConnector creates only a StreamableHTTPClientTransport and has no SSE fallback. A failed streamable connection becomes an error. Python differs: HttpConnector tries streamable HTTP and falls back to SSE on any failure. Checked: the TypeScript client package and the Python connector.
- **transports.streamableHttp** — HttpConnector on the SDK's StreamableHTTPClientTransport, with a 10 second connect timeout and two reconnection retries by default. protocolNegotiation defaults to auto: the SDK sends server/discover at 2026-07-28 and falls back to initialize for a 2025-era server. A gatewayUrl option routes MCP requests through a proxy with X-Target-URL. A legacy session gets a DELETE on close. The browser MCPClient builds the same connector. Python: streamable HTTP on mcp 1.x, initialize only.
- **authentication.oauth** — On by default. MCPClient attaches an OAuth provider to every HTTP server whose entry has no authProvider, no authToken and no Authorization header, unless oauth is false. A connect or later request that needs authorization runs the flow and retries once. The Node provider listens on 127.0.0.1:33418 (walking up 10 ports, then an ephemeral port), opens the browser, and persists client registrations and tokens under ~/.mcp-use/oauth with mode 0600. Client metadata is a public client with authorization_code and refresh_token grants. DCR, PKCE, RFC 9728 discovery, the resource parameter and the RFC 9207 iss check run in the SDK. A Client ID Metadata Document is used only when the clientMetadataUrl option is set. After an anonymous connection, RFC 9728 metadata is probed for 2 seconds to mark mixed-auth servers. The browser entry uses a popup or redirect. Python: the default auth {} also builds an OAuth helper, written by mcp-use on authlib, with a callback on localhost:8080, DCR, PKCE S256, CIMD when client_metadata_url is set and tokens under ~/.mcp_use/tokens. A server with no discoverable OAuth metadata connects without auth.
- **authentication.header** — headers on an HTTP entry are sent on every transport request, and authToken adds Authorization: Bearer. Either one turns off the default OAuth provider. Python: headers and a string auth as a bearer token.
- **tools** — The connector lists tools at connect and caches them. MCPAgent turns every tool from every server into a provider tool, renaming duplicates with a numeric suffix, and drops names in disallowedTools. The agent builds its tool list once at initialize.
- **tools.listChanged** — mcp-use passes listChanged with autoRefresh for tools to the SDK, so the connector cache is refreshed and the notification is forwarded to onNotification handlers. On a 2026-07-28 connection the SDK opens a subscriptions/listen stream for it when the server advertises tools.listChanged. MCPAgent does not rebuild its provider tools, so the model keeps the list from initialize. Python: the notification is logged and passed to message_handler, and nothing is refreshed.
- **resources** — MCPAgent reads resources by default (exposeResourcesAsTools true). At initialize it lists every resource across all pages and turns each concrete resource into a tool with no arguments that calls resources/read. Resource templates are not exposed. MCPClient also offers listResources, listResourceTemplates and readResource to the application. Python: the LangChain MCPAgent also exposes each resource as a tool, from the first page of resources/list.
- **resources.listChanged** — The SDK delivers the notification with autoRefresh off. mcp-use logs it and forwards it to onNotification handlers. The agent keeps the resource tools from initialize.
- **resources.subscribe** — subscribeToResource and unsubscribeFromResource exist on the connector and session. MCPAgent never calls them, and notifications/resources/updated reaches only an application onNotification handler. Not checked on a 2026-07-28 connection.
- **prompts** — MCPAgent exposes prompts by default (exposePromptsAsTools true). Each prompt becomes a tool whose arguments are strings, required unless the prompt marks them optional, and calling it runs prompts/get. MCPClient also offers listPrompts and getPrompt. Python: the same, through LangChain tools.
- **prompts.listChanged** — Delivered with autoRefresh off, logged and forwarded to onNotification handlers. The agent keeps the prompt tools from initialize.
- **completions** — complete() on the connector and session sends completion/complete. MCPAgent never calls it. The inspector uses it.
- **sampling** — Declared only when onSampling is passed to MCPClient, to a config root or to a server entry. The callback answers sampling/createMessage, and on a 2026-07-28 connection the SDK uses the same handler for input_required rounds. MCPAgent passes no callback. The option is marked deprecated in the source. Python: sampling_callback on MCPClient.
- **elicitation** — Declared only when onElicitation is passed. Form and url are declared together and both go to the one callback. mcp-use exports accept, decline, cancel and default-filling helpers for writing one. MCPAgent passes no callback. Python: elicitation_callback on MCPClient.
- **elicitation.form** — Through the application's onElicitation callback.
- **elicitation.url** — Declared with form whenever a callback is passed. The callback receives the URL request and has to open it itself.
- **roots** — Declared on every connection with listChanged true, by both bindings. roots/list returns the roots from the config entry, empty by default. setRoots replaces them and sends notifications/roots/list_changed. The TypeScript source marks roots as kept for v1 compatibility.
- **roots.listChanged** — Sent by setRoots on a connected client.
- **logging** — notifications/message falls through to the fallback notification handler and reaches only onNotification callbacks the application registers. Nothing is logged by default and logging/setLevel is never sent. Python: logging_callback on MCPClient, otherwise the SDK default.
- **instructions** — The connector exposes the server's instructions through an instructions getter. MCPAgent's system prompt is its own string or the application's, and server instructions are never added to it.
- **icons** — serverInfo.icons is cached on the connector and MCPAgent ignores it. The default clientInfo sends an icon, title, description and websiteUrl. The React useMcp hook uses the first server icon as a favicon, which is application code.
- **jsonSchema** — Both connectors install DialectJsonSchemaValidator, which maps a $schema URI to the matching @cfworker/json-schema draft and treats a schema with no $schema as 2020-12. An unknown $schema falls back to the SDK's strict validator. It exists because the v2 SDK rejects non-2020-12 output schemas from older servers. Used for tool output validation in the SDK.
- **extensions.io.modelcontextprotocol/ui** — clientOptions.capabilities.views true expands to the extension with mimeTypes text/html;profile=mcp-app. Off by default. The React entry renders views with @modelcontextprotocol/ext-apps. MCPAgent does not render them.
- **extensions.io.modelcontextprotocol/skills** — The session has listSkills, listAllSkills, getSkill and readResourceDirectory, sent as raw requests. MCPAgent never calls them and the client declares nothing for the extension.
- **extensions.io.modelcontextprotocol/tasks** — No code in either client package sends tasks/* or declares a tasks capability or extension.
- **bonusFeatures.modelInitiatedResourceRead** — Each concrete resource listed at initialize becomes its own tool with no arguments. The model cannot read a URI that was not listed, and templates are not exposed.
- **byProtocolVersion.2025-11-25.tools.listChanged** — The server pushes the notification on the session and the connector cache refreshes. The agent still keeps its initial list.
- **byProtocolVersion.2025-11-25.elicitation** — Server-initiated elicitation/create requests go to onElicitation. Default stdio connections are on this revision.

## Research notes

- [mcp-use probes 2026-07-28 over HTTP and stays on the handshake over stdio](../research/mcp-use-picks-the-protocol-era-by-transport.md) — *idiosyncrasy*. The TypeScript MCPClient sets the SDK's auto negotiation on HTTP servers, so they get server/discover at 2026-07-28 first, and keeps the SDK's legacy default on stdio, so a local server gets initialize at 2025-11-25. One client, one config file, two eras.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [The mcp-use Python binding is capped below mcp 2 and has a WebSocket connector that skips the handshake](../research/mcp-use-python-binding-runs-on-the-1x-sdk.md) — *idiosyncrasy*. mcp-use 1.7.1 for Python declares mcp>=1.24.0,<2.0.0, so it speaks the initialize handshake up to 2025-11-25 only. Its lists stop at the first page, HTTP falls back to SSE, and its WebSocket connector is hand-written and sends initialize with no protocol version or clientInfo.
- [dist/index.mjs:2559-2585](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1) — *transports.streamableHttp*, read 2026-11-20 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.3.1. DEFAULT_VERSION_NEGOTIATION_MODE is legacy, so auto on HTTP is mcp-use's setting.
- [dist/index.mjs:746-750,770,1086-1100,1210-1218](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1) — *authentication.oauth*, read 2026-11-20 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.3.1. CIMD when the provider has clientMetadataUrl, the iss check, OpenID discovery URLs and S256 PKCE.
- [dist/index.mjs:4315-4330](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1) — *tools*, read 2026-11-20 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.3.1. listTools with no cursor walks every page, capped at 64 by default.
- [dist/index.mjs:3216-3227,3425-3452](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1) — *tools.listChanged*, read 2026-11-20 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.3.1. List-changed handlers, and the subscriptions/listen stream opened at connect on a modern connection.
- [dist/index.mjs:3191-3209](https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1) — *sampling*, read 2026-11-20 at `?` in @modelcontextprotocol/client. @modelcontextprotocol/client 2.3.1. input_required rounds are fulfilled through the registered handlers.

## Provenance

Read at `8ff4b865` on 2026-11-20, from `main` of https://github.com/mcp-use/mcp-use.git. That commit was authored 2026-11-19.

**SDK.** This block is the TypeScript binding. @mcp-use/client 2.4.6 and @mcp-use/agent 2.0.27 pin @modelcontextprotocol/client and @modelcontextprotocol/core at exactly 2.3.1, and pnpm-lock.yaml resolves 2.3.1. The workspace patchedDependencies patches @modelcontextprotocol/server 2.3.1, which the server package uses, and better-call. The client SDK is not patched. patches/@modelcontextprotocol__sdk.patch is still in the tree and is not listed in patchedDependencies, so pnpm does not apply it. @modelcontextprotocol/sdk ^1.32.1 is a dev dependency of the agent package, from the workspace catalog. The SDK's version negotiation default is legacy. mcp-use sets auto on HTTP and keeps legacy on stdio, so the era is mcp-use's choice and pinsProtocolVersion is left unset. The Python binding (mcp-use 1.7.1 on PyPI) declares mcp>=1.24.0,<2.0.0 as a base dependency and commits no lockfile. On 2026-11-20 the newest release in range is mcp 1.30.0, whose LATEST_PROTOCOL_VERSION is 2025-11-25, so the Python binding cannot reach 2026-07-28. Its wire name is mcp-use with the package version. No Python patch or vendored SDK was found.

Paths read:

- `libraries/typescript/packages/client/src/core`
- `libraries/typescript/packages/client/src/transport`
- `libraries/typescript/packages/client/src/auth`
- `libraries/typescript/packages/client/src/utils/json-schema-validator.ts`
- `libraries/typescript/packages/client/package.json`
- `libraries/typescript/packages/agent/src/agents/mcp_agent.ts`
- `libraries/typescript/packages/agent/src/adapters`
- `libraries/typescript/packages/agent/package.json`
- `libraries/typescript/pnpm-workspace.yaml`
- `libraries/typescript/pnpm-lock.yaml`
- `libraries/python/mcp_use/client`
- `libraries/python/mcp_use/agents/mcpagent.py`
- `libraries/python/mcp_use/agents/adapters`
- `libraries/python/pyproject.toml`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

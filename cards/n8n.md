# n8n

Workflow automation platform, self-hosted or n8n Cloud. Its MCP client is the MCP Client Tool node, which an AI Agent node uses as a toolkit, the standalone MCP Client node, and hidden MCP registry nodes, all on one connect function over SDK 1.32.0. A second client in @n8n/agents serves the Agents module and Instance AI. Both declare no client capabilities and use only tools.

## At a glance

| | |
|---|---|
| Registry id | `n8n` |
| Vendor | n8n |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | automation |
| Platforms | windows, macos, linux, web |
| Licence | closed source (LicenseRef-n8n-sustainable-use) |
| Source | <https://github.com/n8n-io/n8n> |
| Home | <https://n8n.io> |
| Wire names | `@n8n/n8n-nodes-langchain.mcpClientTool`, `@n8n/n8n-nodes-langchain.mcpClient`, `@n8n/agents`, `Microsoft-Agent-365` |
| SDK | `@modelcontextprotocol/sdk` 1.32.0 · declares `catalog:` · official TypeScript SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Rows describe | `2025-11-25`, the newest revision it speaks |
| Source last updated | 2026-11-27 |
| Last read | 2026-11-27 |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Resources** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read ⇧ | `2025-11-25` |
| **Prompts** | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
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
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ sessionReusePerExecution | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — The workflow nodes offer only HTTP Streamable and SSE. @n8n/agents has a stdio path for a config with a command, and no n8n surface traced here supplies one: Agent JSON configs and N8N_INSTANCE_AI_MCP_SERVERS carry URLs only.
- **transports.sse** — Labelled deprecated in the node UI. MCP Client Tool v1 is SSE only and v1.1 defaults to it. The user picks the transport and the nodes do not fall back between them. @n8n/agents falls back to SSE on a 404 or 405 only when no transport is configured.
- **transports.streamableHttp** — The default transport from MCP Client Tool v1.2 and on the MCP Client node. Redirects are followed, and each hop is checked against the credential allowlist and the instance egress filter. close() sends a session DELETE with a 1 second limit.
- **authentication.oauth** — OAuth runs in n8n's credential layer, not the SDK auth provider: the user connects an MCP OAuth2 credential in the editor, and the node sends its token as a bearer header. A 401 on any request refreshes the token and retries once. It never starts a new authorization. Discovery reads protected resource metadata from the credential's server URL, path first then root, then authorization server metadata (RFC 8414 and OIDC, issuer checked). Automatic registration is on by default for the MCP OAuth2 credential. CIMD is opt-in through N8N_OAUTH_CIMD_ENABLED (default false) and needs an HTTPS metadata URL; otherwise DCR. The callback checks iss (RFC 9207). A generic OAuth2 credential is also offered.
- **authentication.header** — Bearer Auth, Header Auth and Multiple Headers Auth credentials. Headers are dropped when a redirect crosses origins.
- **tools** — The workflow nodes follow nextCursor through every page. @n8n/agents reads only the first page. Each tool becomes an agent tool named <node name>_<tool name>, cut to 64 characters, and Tools to Include filters the list. A server that returns no tools fails the node. From MCP Client Tool v1.4 one client is cached per execution and node, so a stateful server keeps its session across agent tool calls.
- **tools.listChanged** — The Client is built without the listChanged option, so SDK 1.32.0 registers no tools/list_changed handler. The tool list is read once per connection.
- **resources** — No call to this method in the MCP node code or in @n8n/agents. Searched for the SDK client methods with git grep at this commit.
- **resources.listChanged** — No handler registered.
- **resources.subscribe** — No resources/subscribe call.
- **prompts** — No call to this method in the MCP node code or in @n8n/agents. Searched for the SDK client methods with git grep at this commit.
- **prompts.listChanged** — No handler registered.
- **completions** — No call to this method in the MCP node code or in @n8n/agents. Searched for the SDK client methods with git grep at this commit.
- **sampling** — Every client is constructed with capabilities: {}.
- **elicitation** — Not declared. capabilities is {}.
- **roots** — Not declared. capabilities is {}.
- **logging** — No notifications/message handler and no logging/setLevel call.
- **instructions** — The SDK stores the server instructions, and nothing calls getInstructions().
- **icons** — Tool icons are not read. Every MCP tool node shows n8n's own MCP icon.
- **extensions.io.modelcontextprotocol/tasks** — Not declared. capabilities is {}.
- **extensions.io.modelcontextprotocol/ui** — Not declared and not implemented on the client side. Both MCP clients build the SDK Client with capabilities {} and nothing reads _meta.ui.resourceUri or fetches ui:// resources. The @n8n/mcp-apps package serves an MCP App from n8n's own MCP server and is not used by the client nodes or @n8n/agents.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented on the client side. Neither MCP client sends skills/list or skills/get. The skills extension code in the repo belongs to n8n's MCP server.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. No code in the repo sends events/list, events/poll, events/stream or events/subscribe. The client capabilities are built here.
- **bonusFeatures.sessionReusePerExecution** — MCP Client Tool v1.4 and registry nodes v1.1 keep one client per execution and node, closed when the execution finishes or is cancelled, on a transport error, or after an idle TTL. Earlier versions connect and close per tool call.

## Research notes

- [n8n does MCP OAuth in its credential layer, and CIMD is off until an environment variable turns it on](../research/n8n-does-mcp-oauth-in-its-credential-layer.md) — *nuance*. At 84decbe0 the MCP nodes never pass an SDK auth provider. OAuth discovery, DCR and CIMD run when a user connects an MCP OAuth2 credential in the editor, and the node only sends the bearer token. CIMD needs N8N_OAUTH_CIMD_ENABLED, which defaults to false.
- [n8n sends the workflow node's type as clientInfo.name, and has a second MCP client with its own name](../research/n8n-sends-the-node-type-as-client-name.md) — *idiosyncrasy*. At 84decbe0 n8n's MCP nodes send the node type as clientInfo.name and the node's typeVersion as version, so one instance sends several names, one per registry server. A second client in @n8n/agents sends `@n8n/agents` 0.1.0. The seed name `n8n-mcp-client` is not in the source.
- [dist/esm/client/index.js](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.0) — *tools.listChanged*, read 2026-11-20 at `?` in @modelcontextprotocol/sdk.
- [dist/esm/client/index.js](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.0) — *instructions*, read 2026-11-20 at `?` in @modelcontextprotocol/sdk.

## Provenance

Read at `fb1aec9c` on 2026-11-27, from `master` of https://github.com/n8n-io/n8n.git. That commit was authored 2026-11-27.

**SDK.** The pnpm catalog pins 1.32.0, and nodes-langchain, @n8n/agents and cli all resolve to that one copy. The SDK is not in patchedDependencies. Its dependency pkce-challenge 5.0.0 is patched (drops ~ from the verifier alphabet and adds a types field); n8n's own OAuth code imports that package, and the MCP nodes never call the SDK auth module. 1.32.0 sets LATEST_PROTOCOL_VERSION to 2025-11-25 and supports back to 2024-10-07, so the SDK decides the revision. 2026-07-28 is not reachable. The catalog also lists @modelcontextprotocol/server 2.3.0 and node 2.1.0, which serve n8n's own MCP server.

Paths read:

- `packages/@n8n/nodes-langchain/nodes/mcp/McpClient/`
- `packages/@n8n/nodes-langchain/nodes/mcp/McpClientTool/`
- `packages/@n8n/nodes-langchain/nodes/mcp/McpRegistryClientTool/`
- `packages/@n8n/nodes-langchain/nodes/mcp/shared/`
- `packages/@n8n/nodes-langchain/nodes/vendors/Microsoft/microsoft-utils.ts`
- `packages/@n8n/nodes-langchain/credentials/McpOAuth2Api.credentials.ts`
- `packages/@n8n/agents/src/runtime/mcp/`
- `packages/cli/src/modules/agents/json-config/mcp-client-factory.ts`
- `packages/cli/src/modules/instance-ai/turn-setup/assistant-agent.factory.ts`
- `packages/cli/src/oauth/oauth.service.ts`
- `pnpm-workspace.yaml`
- `patches/pkce-challenge@5.0.0.patch`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

# OpenClaw

Multi-channel AI gateway that runs agents across chat surfaces and remote nodes. Two MCP client surfaces for configured servers: the per-session agent bundle and the headless node host. Bundled plugins carry a few fixed-purpose MCP clients of their own.

## At a glance

| | |
|---|---|
| Registry id | `openclaw` |
| Vendor | OpenClaw Foundation |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/openclaw/openclaw> |
| Home | <https://github.com/openclaw/openclaw> |
| Wire names | `openclaw-bundle-mcp`, `openclaw-node-host` |
| SDK | `@modelcontextprotocol/client` 2.4.0 · official TypeScript SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Rows describe | `2025-11-25`, the newest revision it speaks |
| Source last updated | 2026-11-20 |
| Last read | 2026-11-20 |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| **Resources** | ● full | read | `2025-11-25` |
| **Prompts** | ● full | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ◇ opt-in | read | `2025-11-25` |
| **Roots** | ○ unsupported | read | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2025-11-25` |
| **Instructions** | ◐ partial | read | `2025-11-25` |
| Icons | — not recorded | | |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | — not recorded | | |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — OpenClaw's own Transport implementation, OpenClawStdioClientTransport, rather than a subclass of the SDK's StdioClientTransport. Server stderr is drained and its content is not logged: one debug line per server says output was omitted.
- **transports.sse** — The fallback for any non-stdio server, including one configured by URL with no transport named. See openclaw-defaults-a-url-server-to-sse. A 404 on a message POST is treated as an expired session.
- **transports.streamableHttp** — Built only when the config names it explicitly through transport: streamable-http or a type alias of http or streamable-http. The SDK transport is wrapped, not subclassed; the wrapper forwards the negotiated protocol version and sends it on its own session DELETE. Recovers from an expired session on a 404 without replaying the failed call.
- **authentication.oauth** — Full SDK OAuth provider with a persisted per-identity store, now in the shared SQLite state database. Both registration paths are available: Dynamic Client Registration through saveClientInformation, and a Client ID Metadata Document through a per-server oauth.clientMetadataUrl. Credentials can be invalidated by scope (all, client, tokens, verifier, discovery). The node host skips any server configured for OAuth.
- **tools** — Every tool on every enabled server is materialized as a first-class agent tool with its full JSON schema, prefixed per server with collision-safe renaming. Descriptions are passed through a prompt-injection scrubber first. Two compaction surfaces can hide them behind a search interface instead.
- **tools.listChanged** — Subscribed on both surfaces with autoRefresh false and no debounce. On the agent bundle the notification invalidates the catalog and the next turn rebuilds it. On the node host it queues a tools/list refetch straight away.
- **resources** — Reachable by the model through generated per-server resources_list and resources_read tools, added only when the server declared resources and the operator's tool filter allows them. Names match neither Codex's nor opencode's convention.
- **prompts** — Same shape as resources: generated per-server prompts_list and prompts_get tools, gated the same way.
- **completions** — No completion/complete call on either surface for a configured server. A complete operation exists on the native projection view added in October, which has no production caller.
- **sampling** — Not declared and not implemented for configured servers. A sampling/createMessage handler exists only on the native projection bridge, registered when a borrowing caller supplies a sampling capability, and nothing in production acquires that view.
- **elicitation** — Declared as elicitation: { form: {}, url: {} } and handled on both surfaces, but only when mcp.apps.enabled is true in config, which defaults to false. A default install declares and handles nothing. With the flag on, the agent bundle routes the request to a Gateway question and the node host forwards it to the Gateway; a request with no single active tool call is rejected. The bundle also declares an openai/elicitation extension.
- **roots** — Not declared and not implemented for configured servers, so unlike goose, opencode and fast-agent this client does not reach the roots.listChanged declaration gap at all. A roots/list handler and a sendRootsListChanged call exist only on the native projection bridge, which nothing in production acquires.
- **logging** — No logging/setLevel call. A notifications/message handler exists only on the native projection bridge. Server stderr on stdio is drained without logging its content.
- **instructions** — The agent bundle reads the initialize result's instructions and puts them in the system prompt under an "MCP Server Instructions" heading, per server, cut at 2,000 characters, and only while that server backs at least one tool in the prompt. The node host does not read them.
- **extensions.io.modelcontextprotocol/ui** — Declared with a mimeTypes list of text/html;profile=mcp-app, but only when mcp.apps.enabled is true in config, which defaults to false. A default install declares no extensions and no capabilities at all. The same flag also turns on the elicitation declaration.
- **extensions.io.modelcontextprotocol/tasks** — No tasks/* call anywhere in the MCP client files.

## Research notes

- [An OpenClaw server configured by URL alone gets SSE, not Streamable HTTP](../research/openclaw-defaults-a-url-server-to-sse.md) — *idiosyncrasy*. OpenClaw only builds a Streamable HTTP transport when the config names it explicitly. With no `type` or `transport` field the resolver falls through to SSE, the transport deprecated in 2025-03-26. Cline does the same thing for a different stated reason.
- [OpenClaw handles the expired Streamable HTTP session in its own code](../research/openclaw-recovers-expired-http-sessions-without-patching-the-sdk.md) — *nuance*. A stateful server signals an expired session with HTTP 404, and the stock SDK surfaces it as a terminal error. opencode now recovers in its own code. OpenClaw detects the same condition in its own lifecycle code, on both surfaces, and refuses to replay the failed call.
- [OpenClaw scrubs MCP tool descriptions for prompt injection, and one of its two rules does nothing](../research/openclaw-scrubs-tool-descriptions-with-three-regexes.md) — *nuance*. Server-supplied tool descriptions pass a sanitizer before reaching the model on both surfaces. It redacts two fixed phrasings of "ignore previous instructions" and truncates at 1,200 characters. Its second rule rewrites "system prompt" to itself, changing only whitespace.
- [OpenClaw gives the model resources and prompts under a fourth set of tool names](../research/openclaw-names-its-resource-tools-a-fourth-way.md) — *nuance*. OpenClaw materializes per-server `resources_list`, `resources_read`, `prompts_list` and `prompts_get` tools, so the model can read a resource. The names match neither Codex and opencode's convention nor anything in the spec.
- [A default OpenClaw install declares no client capabilities at all](../research/openclaw-declares-nothing-unless-mcp-apps-is-on.md) — *idiosyncrasy*. OpenClaw's client capabilities are elicitation and an MCP Apps UI extension, both built behind `mcp.apps.enabled`, which defaults to off. A default install sends an empty capability object. The node host declares elicitation under the same flag and nothing without it.

## Provenance

Read at `3e7c305f` on 2026-11-20, from `main` of https://github.com/openclaw/openclaw.git. That commit was authored 2026-11-20.

**SDK.** Moved from @modelcontextprotocol/sdk 1.30.0 to the v2 split packages: @modelcontextprotocol/client and @modelcontextprotocol/core, both pinned to exactly 2.4.0 at every declaration site (root, ui, extensions/browser, extensions/qa-lab), and the lockfile agrees. Unpatched: patches/ holds 16 patches and pnpm-workspace.yaml patchedDependencies lists 16 packages, none of them an @modelcontextprotocol package, and there is no override. Every SDK Client is constructed with versionNegotiation mode 'legacy', so the handshake is initialize and the revision is the SDK's: client 2.4.0 pins LATEST_PROTOCOL_VERSION at 2025-11-25. @modelcontextprotocol/sdk 1.32.2 is still a root dependency, used for v1 result schemas the plugin SDK keeps for one release window. Where opencode patched the SDK for expired-session recovery, OpenClaw wraps the SDK HTTP transports, replaces the stdio transport with its own, and handles expiry in its own lifecycle code.

Paths read:

- `src/agents/agent-bundle-mcp-runtime.ts`
- `src/agents/agent-bundle-mcp-materialize.ts`
- `src/agents/agent-bundle-mcp-catalog-projection.ts`
- `src/agents/mcp-metadata.ts`
- `src/agents/mcp-client-lifecycle.ts`
- `src/agents/mcp-client-elicitation.runtime.ts`
- `src/agents/mcp-transport.ts`
- `src/agents/mcp-transport-config.ts`
- `src/agents/mcp-http-transport.ts`
- `src/agents/mcp-stdio-transport.ts`
- `src/agents/mcp-oauth-provider.ts`
- `src/agents/native-mcp-runtime-client.ts`
- `src/agents/mcp-event-request.ts`
- `src/config/mcp-config-normalize.ts`
- `src/config/zod-schema.mcp-server.ts`
- `src/node-host/mcp.ts`
- `src/node-host/mcp-elicitation.ts`
- `src/node-host/runtime.ts`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

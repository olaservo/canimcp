# Kilo Code

Open-source coding agent for VS Code, JetBrains and the terminal. Now built on opencode, not Cline: the CLI is a fork of opencode's, and the VS Code and JetBrains extensions both spawn `kilo serve`, so one MCP client sits behind every surface. Ships a patched SDK 1.32.1 on main; the v2 branch has moved to the split SDK.

## At a glance

| | |
|---|---|
| Registry id | `kilocode` |
| Vendor | Kilo Code |
| Category | ide |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/Kilo-Org/kilocode> |
| Home | <https://kilo.ai> |
| Wire names | `kilo` |
| SDK | `@modelcontextprotocol/sdk` 1.32.1 · official TypeScript SDK · **patched** · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Source last updated | 2026-11-10 |
| Last read | 2026-11-10 |

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
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2025-11-25` |
| **Resources** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| **Roots** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2025-11-25` |
| **Logging** | ◐ partial | read | `2025-11-25` |
| **Instructions** | ● full | read | `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| **Tasks** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ patchedSdkSessionRecovery | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — Docker and podman commands get --rm injected. The child environment is rebuilt without Kilo backend credentials, and stderr is piped and drained into the log.
- **transports.sse** — Fallback when Streamable HTTP fails, against the same URL. Not tried after an auth failure. Same order as opencode.
- **transports.streamableHttp** — Tried first for every remote server. Requests go through a fetch wrapper that normalises the optional GET stream probe.
- **authentication.oauth** — CIMD is Kilo's addition: clientMetadataUrl is https://kilo.ai/docs/oauth/kilo/client.json, offered only when no clientId or clientSecret is configured and the redirect URI is the default. The SDK uses it when the authorization server supports URL-based client ids and falls back to DCR otherwise. A stored token that has expired is refreshed before connecting, bounded by the connect timeout, because some servers answer an expired token with 403 and the SDK only retries 401. The callback is a loopback server on 127.0.0.1.
- **authentication.header** — A headers map on a remote server is passed as requestInit headers on both transports.
- **tools** — tools/list is called only when the server declares tools. Paginated with a duplicate-cursor guard. A page whose outputSchema fails to compile is re-requested without outputSchema.
- **tools.listChanged** — Re-lists the catalog and publishes ToolsChanged. Registered only when the server declared tools.
- **tools.result** — The direct path is the default: Code Mode is opt-in here (KILO_EXPERIMENTAL_CODE_MODE or experimental.code_mode), where opencode made it the default route. On the direct path content wins and structuredContent fills in as one JSON text block only when content is empty.
- **tools.result.content** — Text blocks reach the model joined and truncated at 2000 lines or 50 KB. Images become attachments. audio and resource_link blocks are dropped.
- **tools.result.structuredContent** — Reaches the model only when content is empty, as JSON.stringify of the object. With Code Mode on, scripts receive it as the return value.
- **resources** — Exposed as three built-in tools, list_mcp_resources, list_mcp_resource_templates and read_mcp_resource, registered only when a connected server declares resources. Same as opencode.
- **resources.listChanged** — Only logging and tools/list_changed handlers are registered.
- **resources.subscribe** — No resources/subscribe call and no resources/updated handler.
- **prompts** — Every server prompt becomes a slash command. Only text content survives, and arguments are filled positionally as $1, $2. Same as opencode.
- **prompts.listChanged** — No prompts/list_changed handler is registered.
- **completions** — No completion/complete call.
- **sampling** — Commented out in the capability object, against opencode issue 11948. Kilo kept opencode's comments and links.
- **elicitation** — Commented out against opencode issue 23066.
- **roots** — The only capability Kilo declares. list_roots returns one root, the file URL of the instance directory.
- **roots.listChanged** — Declared as a bare roots:{}. Nothing sends notifications/roots/list_changed.
- **logging** — Receives notifications/message into the log. Never calls logging/setLevel.
- **instructions** — Server instructions are trimmed and carried per server.
- **icons** — No icon handling in the client.
- **tasks** — Commented out against opencode issue 28567.
- **extensions.io.modelcontextprotocol/ui** — Behind KILO_EXPERIMENTAL_MCP_APPS. A tool with _meta.ui.resourceUri gets mcpApp metadata on its tool part, and two experimental HTTP endpoints read a resource and call a tool for a widget. The extension is not declared in the capability object, and no widget host is in the repo.
- **bonusFeatures.modelInitiatedResourceRead** — The same three tool names as opencode and Codex, each permission-gated.
- **bonusFeatures.patchedSdkSessionRecovery** — opencode's session-recovery patch carried forward onto SDK 1.32.1: a 404 on a request carrying a session id re-initializes and retries once. The patch also adds offline_access scope selection and keeps output validators across paginated tools/list pages.

## Research notes

- [Kilo Code adds CIMD and a pre-connect token refresh to opencode's OAuth path](../research/kilocode-adds-cimd-and-pre-connect-token-refresh.md) — *nuance*. Kilo offers a hosted client metadata document as its OAuth client id when no client is configured, ahead of DCR. It refreshes an expired stored token before connecting, because some servers answer an expired token with 403 and SDK 1.32.1 only retries 401.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [opencode declares roots and nothing else, with sampling, elicitation and tasks commented out](../research/opencode-declares-only-roots.md) — *idiosyncrasy*. The client capability object lists sampling, elicitation and tasks, each commented out above a link to the issue tracking it. Only roots is live, so a server that offers any of the other three never gets asked.
- [opencode ships a patched MCP SDK that recovers an expired HTTP session](../research/opencode-patches-its-sdk-for-session-recovery.md) — *idiosyncrasy*. opencode applies a bun patch to @modelcontextprotocol/sdk 1.29.0 that clears the session and retries once when a request carrying a session id gets a 404. Stock 1.29.0 has no recovery path, so opencode's Streamable HTTP behaviour is not the SDK's.
- [Kilo Code is built on opencode now, and one MCP client serves the CLI, VS Code and JetBrains](../research/kilocode-runs-opencodes-mcp-client-behind-every-surface.md) — *misconception*. Kilo Code started as a Cline fork. At 278edf3a its MCP client is opencode's, with Kilo's edits marked kilocode_change. The VS Code and JetBrains extensions spawn `kilo serve` and have no MCP client of their own. main ships a patched SDK 1.32.1; the v2 branch uses the split SDK.
- [dist/esm/client/auth.js:302-309](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.1) — *authentication.oauth*, read 2026-11-10 at `?` in @modelcontextprotocol/sdk.
- [notes/kilocode-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/kilocode-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Kilo Code source at b6a49d0.

## Provenance

Read at `278edf3a` on 2026-11-10, from `main` of https://github.com/Kilo-Org/kilocode.git. That commit was authored 2026-11-10.

**SDK.** Pinned exactly in packages/opencode and patched through bun's patchedDependencies. 1.32.1 sets LATEST_PROTOCOL_VERSION to 2025-11-25 and supports back to 2024-10-07, so the SDK decides the revision. Upstream opencode has since moved to @modelcontextprotocol/client 2.4.0; Kilo's v2 branch is on @modelcontextprotocol/client 2.3.1, also patched, and main has not followed.

Paths read:

- `packages/opencode/src/mcp/index.ts`
- `packages/opencode/src/mcp/catalog.ts`
- `packages/opencode/src/mcp/oauth-provider.ts`
- `packages/opencode/src/session/tools.ts`
- `packages/opencode/src/command/index.ts`
- `packages/opencode/src/kilocode/mcp/`
- `packages/opencode/src/kilocode/tool/code-mode.ts`
- `packages/opencode/src/effect/runtime-flags.ts`
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts`
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt`
- `patches/@modelcontextprotocol%2Fsdk@1.32.1.patch`

Source is not vendored. Client source is read from the shared `_clients` checkout (see `AGENTS.md`); check out that commit there to reproduce any claim above.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

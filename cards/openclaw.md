# OpenClaw

Multi-channel AI gateway that runs agents across chat surfaces and remote nodes. Two MCP client surfaces: the per-session agent bundle and the headless node host.

## At a glance

| | |
|---|---|
| Registry id | `openclaw` |
| Vendor | OpenClaw Foundation |
| Category | agent-framework |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/openclaw/openclaw> |
| Home | <https://github.com/openclaw/openclaw> |
| Wire names | `openclaw-bundle-mcp`, `openclaw-node-host` |
| SDK | `@modelcontextprotocol/sdk` 1.30.0 · official TypeScript SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Source last updated | 2026-08-26 |
| Last read | 2026-08-26 |

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
| **Elicitation** | ○ unsupported | read | `2025-11-25` |
| **Roots** | ○ unsupported | read | `2025-11-25` |
| **Logging** | ○ unsupported | read | `2025-11-25` |
| **Instructions** | ○ unsupported | read | `2025-11-25` |
| Icons | — not recorded | | |
| **Tasks** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◐ partial | read | `2025-11-25` |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — SDK StdioClientTransport subclassed as OpenClawStdioClientTransport. Server stderr is attached to the debug log per line rather than discarded.
- **transports.sse** — The fallback for any non-stdio server, including one configured by URL with no transport named. See openclaw-defaults-a-url-server-to-sse.
- **transports.streamableHttp** — Built only when the config names it explicitly. Sends the mcp-protocol-version header from the transport's negotiated value. Recovers from an expired session on a 404 without replaying the failed call.
- **authentication.oauth** — Full SDK OAuth provider with a persisted per-identity store. Both registration paths are available: Dynamic Client Registration through saveClientInformation, and a Client ID Metadata Document through a per-server oauth.clientMetadataUrl. Credentials can be invalidated by scope (all, client, tokens, verifier, discovery).
- **tools** — Every tool on every enabled server is materialized as a first-class agent tool with its full JSON schema, prefixed per server with collision-safe renaming. Descriptions are passed through a prompt-injection scrubber first. Two compaction surfaces can hide them behind a search interface instead.
- **tools.listChanged** — Subscribed on both surfaces with autoRefresh false and no debounce: the notification invalidates the catalog and the next turn rebuilds it, rather than refetching immediately.
- **resources** — Reachable by the model through generated per-server resources_list and resources_read tools, added only when the server declared resources and the operator's tool filter allows them. Names match neither Codex's nor opencode's convention.
- **prompts** — Same shape as resources: generated per-server prompts_list and prompts_get tools, gated the same way.
- **completions** — No completion/complete call in either surface. Verified by searching the MCP client files rather than inferred.
- **sampling** — Not declared and not implemented. No CreateMessageRequestSchema handler exists on either surface.
- **elicitation** — Not declared and not implemented. No ElicitRequestSchema handler on either surface.
- **roots** — Not declared and not implemented. No ListRootsRequestSchema handler, so unlike goose, opencode and fast-agent this client does not reach the roots.listChanged declaration gap at all.
- **logging** — No logging/setLevel call and no logging notification handler. Server stderr on stdio is logged, which is not the same thing.
- **instructions** — The server's instructions field from initialize is never read. Verified by searching both surfaces for it rather than assumed.
- **tasks** — No tasks/* call anywhere in the MCP client files.
- **extensions.io.modelcontextprotocol/ui** — Declared with a mimeTypes list of text/html;profile=mcp-app, but only when mcp.apps.enabled is true in config, which defaults to false. A default install declares no extensions and no capabilities at all.

## Research notes

- [An OpenClaw server configured by URL alone gets SSE, not Streamable HTTP](../research/openclaw-defaults-a-url-server-to-sse.md) — *idiosyncrasy*. OpenClaw only builds a Streamable HTTP transport when the config names it explicitly. With no `type` or `transport` field the resolver falls through to SSE, the transport deprecated in 2025-03-26. Cline does the same thing for a different stated reason.
- [OpenClaw handles the expired Streamable HTTP session in its own code](../research/openclaw-recovers-expired-http-sessions-without-patching-the-sdk.md) — *nuance*. A stateful server signals an expired session with HTTP 404, and the stock SDK surfaces it as a terminal error. opencode patches the SDK to recover. OpenClaw detects the same condition in its own lifecycle code, on both surfaces, and refuses to replay the failed call.
- [OpenClaw scrubs MCP tool descriptions for prompt injection, and one of its three rules does nothing](../research/openclaw-scrubs-tool-descriptions-with-three-regexes.md) — *nuance*. Server-supplied tool descriptions pass a sanitizer before reaching the model on both surfaces. It redacts two fixed phrasings of "ignore previous instructions" and truncates at 1,200 characters. Its third rule rewrites "system prompt" to itself, changing only whitespace.
- [OpenClaw gives the model resources and prompts under a fourth set of tool names](../research/openclaw-names-its-resource-tools-a-fourth-way.md) — *nuance*. OpenClaw materializes per-server `resources_list`, `resources_read`, `prompts_list` and `prompts_get` tools, so the model can read a resource. The names match neither Codex and opencode's convention nor anything in the spec.
- [A default OpenClaw install declares no client capabilities at all](../research/openclaw-declares-nothing-unless-mcp-apps-is-on.md) — *idiosyncrasy*. OpenClaw's only client capability is an MCP Apps UI extension, and it is built behind `mcp.apps.enabled`, which defaults to off. A default install sends an empty capability object. The node host surface passes no capabilities under any setting.

## Provenance

Read at `a2d54319` on 2026-08-26, from `main` of https://github.com/openclaw/openclaw.git. That commit was authored 2026-08-26.

**SDK.** Pinned to an exact version at four declaration sites (root, ui, extensions/browser, extensions/qa-lab) and they all agree, unlike Cline where two workspaces disagreed. Unpatched: patches/ is empty and pnpm-workspace.yaml has no patchedDependencies. No protocol version literal appears anywhere in the client code, so the revision is entirely the SDK's: 1.30.0 pins LATEST_PROTOCOL_VERSION at 2025-11-25. Where opencode patched the SDK for expired-session recovery, OpenClaw subclasses the transports instead and handles it in its own lifecycle code.

Paths read:

- `src/agents/agent-bundle-mcp-runtime.ts`
- `src/agents/agent-bundle-mcp-materialize.ts`
- `src/agents/mcp-client-lifecycle.ts`
- `src/agents/mcp-transport.ts`
- `src/agents/mcp-transport-config.ts`
- `src/agents/mcp-http-transport.ts`
- `src/agents/mcp-stdio-transport.ts`
- `src/agents/mcp-oauth-provider.ts`
- `src/agents/mcp-metadata.ts`
- `src/node-host/mcp.ts`
- `package.json`
- `pnpm-lock.yaml`

Source is not vendored. Client source is read from the shared `_clients` checkout (see `AGENTS.md`); check out that commit there to reproduce any claim above.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

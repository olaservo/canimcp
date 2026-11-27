# Cline

Open-source coding agent shipping as a VS Code extension and a CLI from one monorepo. Both surfaces use the official TypeScript SDK unpatched, except the stdio path in @cline/core, which is a hand-written JSON-RPC client fixed at 2024-11-05.

## At a glance

| | |
|---|---|
| Registry id | `cline` |
| Vendor | Cline Bot Inc. |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | ide |
| Platforms | windows, macos, linux |
| Licence | Apache-2.0 |
| Source | <https://github.com/cline/cline> |
| Home | <https://cline.bot/> |
| Wire names | `Cline`, `@cline/core` |
| SDK | `@modelcontextprotocol/sdk` 1.30.0 · declares `^1.29.0` · official TypeScript SDK · unpatched · pins `2025-11-25` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Rows describe | `2025-11-25`, the newest revision it speaks |
| Source last updated | 2026-11-26 |
| Last read | 2026-11-27 |
| Probed | `3.0.74` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read, declared | `2024-11-05`, `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read, declared | `2024-11-05`, `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2024-11-05`, `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ isError | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| **Resources** | ◐ partial | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ○ unsupported | read | `2024-11-05`, `2025-11-25` |
| **Elicitation** | ○ unsupported | read | `2024-11-05`, `2025-11-25` |
| **Roots** | ○ unsupported | read | `2024-11-05`, `2025-11-25` |
| **Logging** | ◐ partial | read | `2024-11-05`, `2025-11-25` |
| **Instructions** | ○ unsupported | read | `2024-11-05`, `2025-11-25` |
| **Icons** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ◇ opt-in | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2024-11-05`, `2025-11-25` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2024-11-05`, `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read ⇧ | `2024-11-05`, `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read ⇧ | `2024-11-05`, `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read ⇧ | `2024-11-05`, `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ mcpRemoteProxyRewrite | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sharedSettingsFile | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — Two implementations. The extension uses the SDK's StdioClientTransport. The CLI uses a hand-written client that tries newline-delimited framing first and respawns the server with LSP-style Content-Length framing if initialize fails, a framing MCP's stdio transport does not define. Agent Plugin MCP servers use the hand-written client on every surface, the extension included.
- **transports.sse** — Chosen by an explicit type in config, with no fallback probing. It is also what a URL server with no type resolves to on both surfaces, so the deprecated transport is the accidental default.
- **transports.streamableHttp** — Reached only by setting type explicitly. The extension wraps fetch to rewrite a 404 on the transport's SSE probe GET into a 405, because the SDK only handles 405 and many servers answer 404.
- **authentication.oauth** — One flow shared by both surfaces: the extension delegates to @cline/core's authorizeMcpServerOAuth, the same call the CLI makes. Tokens live in the shared settings file under each server's oauth key, so an authorization completed in the CLI is picked up by an open extension window. token_endpoint_auth_method is none unless a clientSecret is configured. The callback binds a loopback server on the first free port, 1456-1461 from the extension and 1456-1458 from the CLI. Discovery, PKCE and protected-resource metadata are the SDK's auth() and were not read.
- **authentication.header** — A headers map on a remote server is passed through as requestInit headers on both transports. A configured Authorization header suppresses the OAuth prompt: a 401 is reported as a rejected header rather than a sign-in.
- **tools** — One page of tools/list, no cursor, on both surfaces. Every tool is flattened into a model-facing tool named <server>__<tool>, sanitized to [A-Za-z0-9_-] and truncated to 64 characters with an 8-character sha1 suffix when it does not fit. A tool whose _meta.ui.visibility is an array without "model" is left out of the model's tool list, whether or not MCP Apps is on. Tool annotations are kept on the descriptor and not passed to the model. outputSchema and structuredContent appear nowhere in the codebase.
- **tools.listChanged** — The extension registers a handler and refreshes the cached list, coalescing a burst into one refresh and retrying a failed refresh three times with backoff. The CLI registers no handler, so a catalog change is invisible to it until restart.
- **tools.result** — The whole CallToolResult is JSON.stringified into one text block. No placeholder for an empty content array.
- **tools.result.content** — Inside the stringified envelope, text blocks still nested as {"type":"text","text":...}.
- **tools.result.structuredContent** — Inside the stringified envelope next to content, with no duplicate check against the text.
- **tools.result.isError** — Inside the stringified envelope.
- **tools.result._meta** — Inside the stringified envelope.
- **tools.result.media** — Image and audio blocks are stringified with their base64 intact inside the text block, so they reach the model as text, not as native media parts.
- **resources** — The extension lists resources and resource templates and shows them in the server configuration UI. The model cannot read one: the access_mcp_resource tool id survives in the tool enum with no registration and no handler. A resources/read call was added in October 2026 for MCP Apps. In @cline/core it reads only ui:// URIs, for the host, and only when the session sets mcpApps: true, which no app in the repo does. The extension's McpHub.readResource has no caller. The CLI does not list resources at all.
- **resources.listChanged** — Extension only, same debounced refresh as tools.
- **resources.subscribe** — No resources/subscribe call and no resources/updated handler on either surface.
- **prompts** — Same shape as resources: the extension lists prompts and renders name, title, description and arguments in a UI tab. There is no prompts/get call anywhere, so a listed prompt cannot be run. The CLI does not list them.
- **prompts.listChanged** — Extension only, same debounced refresh as tools.
- **completions** — No completion/complete call at this commit.
- **sampling** — Both surfaces initialize with an empty capabilities object by default, and no CreateMessageRequestSchema handler exists.
- **elicitation** — Not declared and not implemented. No ElicitRequestSchema handler anywhere in the repo.
- **roots** — Not declared and not implemented, despite the extension knowing the workspace roots for its own file tools.
- **logging** — The extension handles notifications/message and routes it to the active task, or buffers it when no task is running. It never calls logging/setLevel, so the level is whatever the server defaults to. Any other notification is written to the extension log. The CLI handles no notifications.
- **instructions** — The initialize result's instructions field is never read on either surface.
- **icons** — No icon handling in either MCP implementation.
- **bonusFeatures.mcpRemoteProxyRewrite** — The CLI recognizes a stdio config of exactly `npx [-y] mcp-remote <url>` with no env and no extra arguments, and rewrites it to a native Streamable HTTP transport. Cline's own OAuth then handles the server, instead of a child process opening a browser as a side effect of enabling the server. The extension does not do this rewrite, so the same settings file means different things to the two surfaces.
- **bonusFeatures.sharedSettingsFile** — The extension, the CLI and the JetBrains plugin read and write one settings file at ~/.cline/data/settings/cline_mcp_settings.json, under a cross-process lock with atomic replace. The extension watches it and fingerprints the connection-relevant content, so OAuth churn from another process does not trigger a reconnect loop but a token written elsewhere does.
- **extensions.io.modelcontextprotocol/ui** — Declared by @cline/core with a mimeTypes list of text/html;profile=mcp-app only when the session config sets mcpApps: true, which defaults to false. No app in the repo sets it, so the CLI and the extension declare no extensions. The extension's own client never declares it.
- **extensions.io.modelcontextprotocol/tasks** — Not declared and not implemented, though SDK 1.30.0 carries an experimental tasks client.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. No MCP client in the repo sends skills/list, skills/get or resources/directory/read, and @modelcontextprotocol/sdk 1.30.0 has no skills client. Cline's own skills are not loaded from MCP servers.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. No MCP client in the repo sends events/list, events/poll, events/stream or events/subscribe, and @modelcontextprotocol/sdk 1.30.0 has no events client.

## Verified by the probe

34 records from the live probe (`probe/`), client version `3.0.74`. Each row is one run against the instrumented fixture server with the model mocked; a tool-result verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/cline.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/cline@3.0.74/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 3.0.74 | tool offered but never called |
| [app_only](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2024-11-05` | 3.0.74 | tool offered but never called |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/cline@3.0.74/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/cline@3.0.74/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/cline@3.0.74/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/cline@3.0.74/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 0x) |
| [empty_object](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2024-11-05` | 3.0.74 | "…" no marker reached the model; payload: "{}" |
| [large](../probe/runs/cline@3.0.74/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 3.0.74 | […] content only (1x, as json) |
| [large](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.large/record.json) | default | stdio | `2024-11-05` | 3.0.74 | […] content only (1x, as json) |
| [no_content_key](../probe/runs/cline@3.0.74/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [no_content_key](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/cline@3.0.74/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/cline@3.0.74/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/cline@3.0.74/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/cline@3.0.74/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 3.0.74 | "…" client error text, no fixture field: "{\"error\":\"MCP error -32602: Structured content does not match the tool's output " |
| [schema_mismatch](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/cline@3.0.74/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/cline@3.0.74/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/cline@3.0.74/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 3.0.74 | "…" client error text, no fixture field: "{\"error\":\"[\\n  {\\n    \\\"expected\\\": \\\"record\\\",\\n    \\\"code\\\": \\\"invalid_type\\\"," |
| [sc_null](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_string](../probe/runs/cline@3.0.74/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 3.0.74 | "…" client error text, no fixture field: "{\"error\":\"[\\n  {\\n    \\\"expected\\\": \\\"record\\\",\\n    \\\"code\\\": \\\"invalid_type\\\"," |
| [sc_string](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [structured_only](../probe/runs/cline@3.0.74/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/cline@3.0.74/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

## Where the evidence disagrees

- **transports.sse** — recorded as `full`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — Records stdio only. The extension and the CLI both build SSE and Streamable HTTP transports from a url config, and both ship an OAuth flow that only applies to them.
- **transports.streamableHttp** — recorded as `full`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — Records stdio only. The extension and the CLI both build SSE and Streamable HTTP transports from a url config, and both ship an OAuth flow that only applies to them.
- **resources** — recorded as `partial`, but declared-tier evidence at `2025-06-18` says `full`.
  <br>apify/mcp-client-capabilities `4406120` (2026-02-02) — Records resources as full. The read finds a list and a UI tab, and no path from either to the model or to the resource contents.

## Research notes

- [Cline's CLI speaks stdio through a hand-written client fixed at 2024-11-05](../research/cline-hand-rolls-stdio-in-its-cli.md) — *idiosyncrasy*. Three of Cline's four MCP paths use the official TypeScript SDK and negotiate 2025-11-25. The fourth, stdio in @cline/core, is a hand-written JSON-RPC client that sends 2024-11-05, ignores the version it gets back, and falls back to LSP-style Content-Length framing.
- [A Cline server configured by URL alone gets SSE, not Streamable HTTP](../research/cline-defaults-a-url-server-to-sse.md) — *idiosyncrasy*. Both surfaces resolve a URL-based server with no explicit type to SSE. The extension's schema says why in a comment - reordering the union would break configs written before Streamable HTTP existed - so the transport deprecated in 2025-03-26 stays the default.
- [Cline lists resources and prompts into a UI tab and gives the model no way to fetch either](../research/cline-lists-resources-and-prompts-but-never-reads-them.md) — *idiosyncrasy*. The VS Code extension calls resources/list, resources/templates/list and prompts/list on every connect and shows the results in the server panel. Nothing calls prompts/get, and resources/read serves only the off-by-default MCP Apps runtime, so the model cannot fetch either.
- [Cline declares an empty capability object on both surfaces](../research/cline-declares-no-client-capabilities.md) — *idiosyncrasy*. Both of Cline's MCP implementations send `capabilities: {}` in initialize by default. No roots, no sampling, no elicitation, no tasks — and none of the four are implemented anywhere, so the declaration is accurate.
- [Cline's CLI rewrites `npx mcp-remote <url>` into a native Streamable HTTP transport](../research/cline-rewrites-mcp-remote-proxy-configs.md) — *idiosyncrasy*. A stdio config of exactly `npx [-y] mcp-remote <url>`, with no env and no other arguments, is replaced by a streamableHttp transport before any process is spawned. The extension does not do this, so one settings file describes two different connections.
- [notes/cline-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/cline-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Cline source at 94eecbb.
- [dist/esm/types.js](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.30.0) — *extensions.io.modelcontextprotocol/skills*, read 2026-11-26 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/sdk 1.30.0, the version bun.lock resolves. Its dist has no skills/* or events/* methods.
- [dist/esm/types.js](https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.30.0) — *extensions.io.modelcontextprotocol/events*, read 2026-11-26 at `?` in modelcontextprotocol/typescript-sdk. @modelcontextprotocol/sdk 1.30.0, the version bun.lock resolves. Its dist has no skills/* or events/* methods.

## Provenance

Read at `cbc7d141` on 2026-11-27, from `main` of https://github.com/cline/cline.git. That commit was authored 2026-11-26.

**SDK.** Two workspaces declare it and disagree: sdk/packages/core asks for ^1.29.0 and apps/vscode for ^1.25.1. bun.lock hoists one copy, so both run 1.30.0. patchedDependencies covers @opentui-ui/dialog, ollama-ai-provider-v2 and @shadcn/react and not the SDK, which is the answer to the question opencode raised: Cline is on the same SDK and does not patch it. The protocol version is the SDK's on every path except one - 1.30.0 pins LATEST_PROTOCOL_VERSION at 2025-11-25 - but the @cline/core stdio client does not use the SDK at all and sends 2024-11-05 of its own accord.

Paths read:

- `apps/vscode/src/services/mcp/McpHub.ts`
- `apps/vscode/src/services/mcp/McpOAuthManager.ts`
- `apps/vscode/src/services/mcp/schemas.ts`
- `apps/vscode/src/shared/mcp.ts`
- `apps/vscode/src/shared/tools.ts`
- `apps/vscode/src/sdk/vscode-runtime-builder.ts`
- `apps/vscode/webview-ui/src/components/mcp/configuration/tabs/installed/server-row/ServerRow.tsx`
- `sdk/packages/core/src/extensions/mcp/client.ts`
- `sdk/packages/core/src/extensions/mcp/oauth.ts`
- `sdk/packages/core/src/extensions/mcp/config-loader.ts`
- `sdk/packages/core/src/extensions/mcp/remote-proxy.ts`
- `sdk/packages/core/src/extensions/mcp/name-transform.ts`
- `sdk/packages/core/src/extensions/mcp/tools.ts`
- `sdk/packages/core/src/runtime/orchestration/runtime-builder.ts`
- `sdk/packages/core/src/extensions/mcp/apps.ts`
- `sdk/packages/core/src/extensions/mcp/session-apps.ts`
- `sdk/packages/core/src/extensions/mcp/manager.ts`
- `apps/vscode/src/sdk/cline-session-factory.ts`
- `apps/vscode/package.json`
- `sdk/packages/core/package.json`
- `package.json`
- `bun.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/verified/cline.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

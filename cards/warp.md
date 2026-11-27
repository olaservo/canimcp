# Warp

Terminal with a built-in coding agent, for macOS, Linux and Windows, plus a TUI and the oz agent CLI. All three surfaces use one MCP client: crates/mcp on rmcp 3.5.0, driven by TemplatableMCPServerManager in the app crate. The model runs on Warp's server, so the client sends each server's tool and resource list there and executes the calls the server returns. Declares no client capabilities. Leads with server/discover at 2026-07-28 on every transport except legacy SSE.

## At a glance

| | |
|---|---|
| Registry id | `warp` |
| Vendor | Warp (Denver Technologies, Inc.) |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | ide |
| Platforms | macos, linux, windows |
| Licence | AGPL-3.0-only AND MIT |
| Source | <https://github.com/warpdotdev/warp> |
| Home | <https://www.warp.dev> |
| Wire names | `dev.warp.Warp-Stable`, `dev.warp.Warp`, `dev.warp.WarpOss` |
| SDK | `rmcp` 3.5.0 · declares `3.5` · official Rust SDK · unpatched · pins `2026-07-28` |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28` and every older revision it speaks, not yet split by revision |
| Source last updated | 2026-11-21 |
| Last read | 2026-11-21 |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ● full | read | `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Resources** | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2026-07-28` |
| **Prompts** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read ⇧ | `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read ⇧ | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read ⇧ | `2026-07-28` |
| **Roots** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ○ unsupported | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ toolCallCancellation | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ importsOtherClientConfigs | ◇ opt-in | read | `2026-07-28` |
| &nbsp;&nbsp;↳ platformManagedServers | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ projectServerApproval | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — On Windows the command runs as cmd.exe /c <command> with no console window. Empty env values are skipped so the variable is inherited. stderr is piped into the per-server log. Uses rmcp's Auto lifecycle: a server/discover probe at 2026-07-28, falling back to initialize at 2025-11-25.
- **transports.sse** — Used only when the preflight gets 404 or 405 for both server/discover and initialize. There is no config option to pick SSE. The transport is Warp's copy of the SSE client rmcp removed, and it always runs initialize at 2025-11-25.
- **transports.streamableHttp** — Every URL server is preflighted with a hand-built POST before rmcp connects. A 200 selects Streamable HTTP with the era and version the preflight negotiated. Requests carry User-Agent Warp-MCP-Client/1.0 unless the config sets one.
- **authentication.oauth** — On by default (mcp_oauth). A 401 starts OAuth unless the challenge lacks resource_metadata and the config set an Authorization, X-Api-Key or Api-Key header. Uses rmcp's AuthorizationManager. Issuers in the build's channel config, such as GitHub, use a pre-registered client; any other issuer gets DCR with client_name Warp. No client_metadata_url is set, so CIMD is never used. The GUI redirects to warp://mcp/oauth2callback, the TUI to a 127.0.0.1 loopback. Tokens are kept in secure storage and a refresh token is carried forward when a refresh response omits one. Headless and cloud agent runs refuse interactive OAuth.
- **authentication.header** — A URL server's headers map is sent on every request, preflight included. Values can be templated from variables and managed secrets. For managed servers in agent runs the headers can be replaced on an open Streamable HTTP connection (managed_mcp_credential_refresh, on by default).
- **tools** — tools/list is called once per connection, only when the server declares tools, through rmcp's list_all_tools, which follows every cursor. A listing error leaves the server connected with no tools. Only name, description and inputSchema go to the model; a tool whose schema cannot be converted to a protobuf Struct is dropped. Whole-number floats are coerced to integers for integer-typed arguments. Calls are permission-gated and have a 30-minute deadline.
- **tools.listChanged** — The handler is rmcp's ClientConfig, whose on_tool_list_changed is a no-op. The list is refreshed only when the server reconnects.
- **resources** — resources/list (all pages) runs once per connection when the server declares resources. The uri, name, description and mimeType of each resource go to Warp's server with the tools, and the agent can ask for a read, which the client sends as resources/read with one retry after a closed transport. Text and blob contents are passed back. Resource templates are never listed.
- **resources.listChanged** — on_resource_list_changed is rmcp's no-op default.
- **resources.subscribe** — No resources/subscribe or subscriptions/listen call.
- **prompts** — No prompts/list or prompts/get call anywhere in the client.
- **prompts.listChanged** — on_prompt_list_changed is rmcp's no-op default.
- **completions** — No completion/complete call.
- **sampling** — Not declared. A sampling request reaches rmcp's default create_message, which returns method not found.
- **elicitation** — Not declared. A request that arrives anyway reaches rmcp's default create_elicitation, which declines.
- **roots** — Not declared: the capability object is ClientCapabilities::default(). rmcp's default list_roots still answers a roots/list with an empty list, where goose returns its working directory and Codex has the same default.
- **roots.listChanged** — Never declared and never sent. Warp does not call notify_roots_list_changed, and rmcp 3.5.0 does not derive the capability from a handler.
- **logging** — on_logging_message is rmcp's no-op and logging/setLevel is never sent. Every received message, notifications/message included, is written as raw JSON to Warp's per-server log file by the transport wrapper.
- **instructions** — Server instructions are written to the per-server log with the rest of the server info and go no further. The context sent to the model carries a description from Warp's own config.
- **icons** — Tool and resource icons are dropped when the lists are converted for the model, and the server info is not read for them.
- **extensions.io.modelcontextprotocol/ui** — Not declared, and the tool metadata sent to the model has no _meta.
- **extensions.io.modelcontextprotocol/tasks** — The io.modelcontextprotocol/tasks extension is not declared and no tasks call is made.
- **extensions.io.modelcontextprotocol/skills** — Not declared and not implemented. make_client_info builds the client capabilities from Default::default() with no extensions, and after connecting the client only calls resources/list and tools/list. rmcp 3.5.0 has no skills/list support; the SDK added it in 3.10.0.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. make_client_info builds the client capabilities with no extensions, and no events/list, events/poll, events/stream or events/subscribe call exists in the repo. rmcp 3.5.0 has no events support. The two non-test events grep hits are Warp's own agent event stream endpoints (/api/v1/agent/events/stream), not MCP.
- **bonusFeatures.modelInitiatedResourceRead** — The resource list is part of the agent's context and the agent requests a read by URI or name. The read goes through the same action pipeline as tool calls.
- **bonusFeatures.toolCallCancellation** — notifications/cancelled is sent only when the 30-minute tool-call deadline passes, with a 5-second bound on sending it. The model is then told the outcome is unknown and not to retry.
- **bonusFeatures.importsOtherClientConfigs** — Reads ~/.warp/.mcp.json, ~/.claude.json and project .mcp.json, ~/.codex/config.toml (normalised from TOML), and .agents/.mcp.json, and watches them. Servers in ~/.warp/.mcp.json start automatically. Global third-party servers start only when agents.mcp_servers.file_based_mcp_enabled is on, which defaults to false. Project-scoped servers never start automatically.
- **bonusFeatures.platformManagedServers** — Logged-in GUI and TUI users get the Warp-hosted Factory MCP server attached automatically, authenticated with their session token (factory_mcp, on by default). Team-managed servers and well-known ids such as linear resolve through Warp's server to a config with short-lived proxy credentials, refreshed during agent runs.
- **bonusFeatures.projectServerApproval** — Servers found in a repository config are listed and never auto-started. Cloud agent runs apply the same decision and do not force the third-party setting on.

## Research notes

- [Warp picks the HTTP transport and protocol era with its own request before rmcp connects](../research/warp-preflights-http-servers-outside-the-sdk.md) — *idiosyncrasy*. For a URL server Warp POSTs a hand-built server/discover, then initialize if the server looks legacy, from its own reqwest client. The answer picks Streamable HTTP, SSE or OAuth and fixes the era. rmcp then connects again, so a legacy server gets two initialize requests.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [Warp declares no client capabilities, and rmcp still answers roots and elicitation for it](../research/warp-declares-no-client-capabilities.md) — *idiosyncrasy*. Warp's MCP handler is rmcp's bare ClientConfig with empty capabilities. rmcp 3.5.0's defaults then answer roots/list with an empty list, decline elicitation and reject sampling. rmcp derives no capability from a handler, and Warp never sends roots/list_changed.
- [goose emits a roots notification that 2026-07-28 removed, and rmcp does not stop it](../research/goose-sends-removed-roots-notification.md) — *idiosyncrasy*. notify_roots_list_changed fires on every working-directory change with no version check, goose prefers 2026-07-28 where the notification no longer exists, and rmcp 3.1.4 gates nothing on the outbound notification path.
- [Warp's clientInfo.name is the app id, which differs by release channel and operating system](../research/warp-sends-its-app-id-as-client-name.md) — *idiosyncrasy*. Warp sends ChannelState::app_id() as clientInfo.name. On macOS that is the bundle identifier, dev.warp.Warp-Stable for the stable app. Linux and Windows take it from a build-time channel config whose generator is not in the repo. Open-source builds send dev.warp.WarpOss.
- [src/transport/auth.rs:799-825,1840-1846,1866,2396-2404,2751,3705](https://crates.io/crates/rmcp/3.5.0) — *authentication.oauth*, read 2026-11-21 at `?` in rmcp. PKCE, the resource parameter, PRM and OIDC discovery, and the iss check are rmcp 3.5.0 behaviour.
- [src/service/client.rs:1760-1774](https://crates.io/crates/rmcp/3.5.0) — *tools*, read 2026-11-21 at `?` in rmcp.
- [src/handler/client.rs:241-246,296-304](https://crates.io/crates/rmcp/3.5.0) — *tools.listChanged*, read 2026-11-21 at `?` in rmcp.
- [src/handler/client.rs:235-240,296-304](https://crates.io/crates/rmcp/3.5.0) — *resources.listChanged*, read 2026-11-21 at `?` in rmcp.
- [src/handler/client.rs:97-105,296-304](https://crates.io/crates/rmcp/3.5.0) — *sampling*, read 2026-11-21 at `?` in rmcp.
- [src/handler/client.rs:179-191](https://crates.io/crates/rmcp/3.5.0) — *elicitation*, read 2026-11-21 at `?` in rmcp.
- [src/handler/client.rs:107-112,296-304](https://crates.io/crates/rmcp/3.5.0) — *roots*, read 2026-11-21 at `?` in rmcp.
- [src/model/capabilities.rs:174-194](https://crates.io/crates/rmcp/3.5.0) — *roots.listChanged*, read 2026-11-21 at `?` in rmcp.
- [src/service/client.rs:1753](https://crates.io/crates/rmcp/3.5.0) — *roots.listChanged*, read 2026-11-21 at `?` in rmcp.
- [src/handler/client.rs:221-227](https://crates.io/crates/rmcp/3.5.0) — *logging*, read 2026-11-21 at `?` in rmcp.

## Provenance

Read at `f8223cef` on 2026-11-21, from `master` of https://github.com/warpdotdev/warp.git. That commit was authored 2026-11-21.

**SDK.** The workspace declares rmcp "3.5" and Cargo.lock resolves one copy, 3.5.0 (checksum matches the crates.io artifact read). crates/mcp enables client, client-side-sse, auth, transport-streamable-http-client-reqwest and transport-child-process. The [patch.crates-io] section covers core-foundation crates and objc, not rmcp. crates/mcp carries a copy of rmcp's removed SSE client transport; rmcp itself is unmodified. Warp chooses the discover-first lifecycle, but its version list is rmcp's KNOWN_VERSIONS and its first offer is rmcp's LATEST, so the preferred revision follows the SDK. crates/computer_use_mcp is an MCP server and uses rmcp's client only in tests.

Paths read:

- `crates/mcp/src/`
- `app/src/ai/mcp/`
- `app/src/ai/agent_sdk/mcp.rs`
- `app/src/ai/agent_sdk/mcp_config.rs`
- `app/src/ai/agent_sdk/driver/mcp_startup.rs`
- `app/src/ai/agent_sdk/driver/managed_mcp_refresh.rs`
- `app/src/ai/blocklist/action_model/execute/call_mcp_tool.rs`
- `app/src/ai/blocklist/action_model/execute/read_mcp_resource.rs`
- `app/src/ai/agent/api/convert_to.rs`
- `app/src/features.rs`
- `app/Cargo.toml`
- `crates/warp_core/src/channel/state.rs`
- `Cargo.toml`
- `Cargo.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

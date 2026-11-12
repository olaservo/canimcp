# Hermes Agent

Python agent CLI, desktop app and gateway from Nous Research. The second client here on the mcp Python SDK and the counterpart to fast-agent on it: same library, opposite protocol-era default. Hermes leads with the initialize handshake and probes server/discover only when a server rejects it. One MCP client serves every surface.

## At a glance

| | |
|---|---|
| Registry id | `hermes-agent` |
| Vendor | Nous Research |
| Category | cli |
| Platforms | windows, macos, linux |
| Licence | MIT |
| Source | <https://github.com/NousResearch/hermes-agent> |
| Home | <https://github.com/NousResearch/hermes-agent> |
| Wire names | `hermes-agent`, `hermes-probe`, `hermes` |
| SDK | `mcp` 2.3.0 · declares `==2.3.0` · official Python SDK · unpatched |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Source last updated | 2026-11-09 |
| Last read | 2026-11-09 |
| Probed | `0.23.0+689.ga9ff979` (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ headers | ● full | read | `2025-11-25` |
| **Tools** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ _meta | ◐ partial | read ⇧ | `2025-11-25` |
| **Resources** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2025-11-25` |
| **Prompts** | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2025-11-25` |
| **Completions** | ○ unsupported | read | `2025-11-25` |
| **Sampling** | ● full | read, declared | `2025-11-25` |
| &nbsp;&nbsp;↳ tools | ◐ partial | read, declared | `2025-11-25` |
| **Elicitation** | ◐ partial | read, declared | `2025-11-25` |
| &nbsp;&nbsp;↳ form | ◐ partial | read, declared | `2025-11-25` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read, declared | `2025-11-25` |
| **Roots** | ○ unsupported | read, declared | `2025-11-25` |
| **Logging** | ◐ partial | read | `2025-11-25` |
| **Instructions** | ○ unsupported | read | `2025-11-25` |
| Icons | — not recorded | | |
| **Tasks** | ○ unsupported | read | `2025-11-25` |
| JSON Schema | — not recorded | | |
| Extensions | — not recorded | | |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ toolDescriptionScrubbing | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ deferredToolLoading | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ resultSpillover | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sessionRecovery | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ nonMcpEndpointDetection | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ eventsExtension | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ trustTiers | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ declaredToolCosts | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ lazyServerStart | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — The SDK's stdio_client. Spawned process groups are registered with a shared parent-death supervisor and a spawn ledger, and on Windows Hermes first puts itself in a kill-on-close job object, so a hard kill of Hermes does not leave children running. Server stderr goes to a shared log file, orphans from earlier attempts are reaped before each spawn, and a session can be recycled on idle_timeout_seconds or max_lifetime_seconds. npx, uvx and pipx packages get an OSV malware check before spawn, which fails open on timeout. The handshake is bounded by connect_timeout inside the coroutine.
- **transports.streamableHttp** — The default for a server configured with a url. Hermes probes for both the current streamable_http_client and the deprecated streamablehttp_client alias. It builds its own httpx client, which adds a 10 MiB body cap, proxy settings from the environment and the OS, and optional mTLS client certificates. The MCP-Protocol-Version header is seeded from the handshake-era constant, not the newest revision.
- **transports.sse** — Selected by transport: sse, and also used as a fallback. When the first Streamable HTTP connect is rejected with 400, 405, 406 or 411, or with the SDK's -32603 "Server returned an error response", Hermes retries over SSE and keeps SSE for later reconnects. The fallback does not fire on a timeout, an auth error, a reconnect after a working session, or with strict_redirect_headers, which SSE refuses at connect.
- **authentication.oauth** — Opt-in through auth: oauth on the server entry, on the SDK's OAuthClientProvider. By default the client_id is Hermes' Client ID Metadata Document URL when the server supports CIMD, else RFC 7591 dynamic registration with application_type native. Tokens persist per server, are reloaded when another process refreshes them, and are bound to the issuer. An RFC 8628 device flow runs only on request, through hermes mcp login --flow device or oauth.flow: device. The web dashboard can receive the browser callback in place of a loopback listener.
- **authentication.headers** — Arbitrary headers per server entry, plus an optional identity_header carrying a static value or the active Hermes profile name. Authorization is always dropped on a cross-origin redirect, and strict_redirect_headers drops every configured header there.
- **tools** — Paginated: a shared helper follows nextCursor across up to 50 pages for tools, resources and prompts, holding the server's RPC lock, and reads SEP-2549 cache hints from the first page. tools/list is sent only when the server advertised tools. Registered names are mcp__<server>__<tool>, clamped to 64 characters with a hash suffix. Tool descriptions are checked against ten prompt-injection patterns, which log a warning and block nothing.
- **tools.listChanged** — A message_handler on the session watches notifications/tools/list_changed and schedules a background refresh, kept strongly referenced so it is not garbage-collected mid-flight. The refresh re-paginates under the RPC lock and deregisters only the names that went away.
- **tools.result** — Both fields reach the model in one JSON string unless the text mirrors the JSON. Over 2,000,000 serialized characters the structured value is replaced by a head-and-tail truncated string.
- **tools.result.content** — Text blocks joined with newlines under a result key in a JSON string.
- **tools.result.structuredContent** — Appended as a structuredContent key unless a text block is an exact JSON copy of it, in which case the copy is dropped. With empty content it becomes the result value. Ignored on isError.
- **tools.result._meta** — Application keys ride along as a _meta key; protocol-reserved keys are stripped.
- **resources** — Reachable by the model, not only listed. Hermes materializes per-server mcp__<server>__list_resources and mcp__<server>__read_resource tools, registered only when the server's own capabilities advertised resources, and suppressible with tools.resources on the server entry. ResourceLink results are rewritten to point at the same server's read_resource tool. A server tool whose name normalises to the same name wins over the utility.
- **resources.listChanged** — notifications/resources/list_changed is matched and logged at debug level as ignored. The utility tools query the server on every call, so nothing cached goes stale. The August entry recorded this as full; the same ignore branch was already there at a24c12d1.
- **resources.subscribe** — Nothing calls resources/subscribe. Hermes learns about resource changes only from the list-changed notification.
- **prompts** — Same shape as resources: per-server mcp__<server>__list_prompts and mcp__<server>__get_prompt tools, gated on the server having advertised prompts and suppressible with tools.prompts.
- **prompts.listChanged** — notifications/prompts/list_changed is matched and logged at debug level as ignored. The August entry recorded this as full; the same ignore branch was already there at a24c12d1.
- **completions** — No completion/complete call anywhere. Neither prompt arguments nor resource template variables get server-side completion.
- **sampling** — Declared and served by default: sampling.enabled defaults to true on the server entry. Requests are rate-limited, ten a minute by default, audited to the log with model and token counts, and a failure is returned as ErrorData. A docstring records sampling as deprecated upstream under SEP-2577 and freezes the handler.
- **sampling.tools** — Opt-in per server through expose_client_tools, off by default. A comment says strict servers rejected the unknown sampling.tools sub-capability during initialization (#5468). Server-sent tools are forwarded to the model and CreateMessageResultWithTools is returned whatever the setting. At a24c12d1 the sub-capability was always declared.
- **elicitation** — Declared and served by default: elicitation.enabled defaults to true. Hermes passes only an elicitation callback, and mcp 2.3.0 turns any callback into a declaration of both form and url modes. Requests go through Hermes' approval system, and accept, decline and error counts are tracked per server.
- **elicitation.form** — The user sees the message and a summary of the requested fields and answers accept, decline or cancel. Accept returns empty content, so the server gets no field values back. A timeout or exception fails closed. The empty accept was already there at a24c12d1.
- **elicitation.url** — URL-mode requests are declined with a log line saying URL-mode elicitation is not implemented. The url capability is declared anyway, because the SDK declares it whenever an elicitation callback is set. The August entry recorded this as full; the decline was already there at a24c12d1.
- **roots** — No list_roots_callback is passed at either session construction site and no roots handler exists anywhere in the client, so nothing is declared and roots/list is never answered. Hermes is the second client read here that does not reach the SDK roots.listChanged problem at all, for the same reason as OpenClaw: it never opts in.
- **logging** — Receives but does not steer. A logging_callback routes notifications/message into Hermes' own logging, tagged with the server name, mapping MCP levels onto Python ones and truncating a single payload at 2000 characters so a chatty or broken server cannot flood the log. The docstring records that without it the SDK's default callback discards them, so server-side warnings during a tool call were invisible, and credits the fix as a port of an opencode change. Nothing calls logging/setLevel, so the server's default verbosity is whatever it chooses.
- **instructions** — The instructions field of the negotiation result is never read. Only capabilities is consumed, to gate the resource and prompt utility tools.
- **tasks** — No tasks methods referenced anywhere in the client.
- **bonusFeatures.modelInitiatedResourceRead** — The model can read a resource with no user in the loop, through the per-server read_resource tool, provided the server advertised resources.
- **bonusFeatures.toolDescriptionScrubbing** — Ten regexes check every MCP tool description for prompt-injection patterns and log a warning; the text reaches the model unchanged. What is removed is Unicode tag characters and bidi embedding, override and isolate controls. The August entry called the regex pass scrubbing; it was warn-only then too.
- **bonusFeatures.deferredToolLoading** — MCP tools are removed from the model-visible tool array by default and replaced with a tool_search, tool_describe and tool_call bridge, with a catalog listing embedded in the bridge's description under a token budget that degrades through five fixed forms rather than truncating. Core Hermes tools are deferred only when named in a curated list.
- **bonusFeatures.resultSpillover** — An MCP result past 50,000 characters, configurable through tool_budget.mcp_result_size_chars and tighter than the 100,000 generic default, is written to a spillover file and replaced in context by a block naming its size, path and a read_file recovery line. A single result is hard-capped at 2,000,000 characters with a head and tail split around an omission notice.
- **bonusFeatures.sessionRecovery** — Expired HTTP sessions are detected and the transport reconnected. The call is retried once only for tools annotated readOnlyHint: true; any other tool gets the transport healed and an outcome_uncertain error instead of a replay. A connect-failure cooldown keeps a dead server from being retried in a tight loop, and a parked server probes itself every 300 seconds.
- **bonusFeatures.nonMcpEndpointDetection** — A URL that answers HEAD or GET with a content type outside the MCP media types is POSTed a hand-written minimal initialize frame at 2025-03-26, naming itself hermes-probe, before Hermes raises NonMcpEndpointError. The check is skipped for SSE, OAuth servers and any server that has connected before.
- **bonusFeatures.eventsExtension** — Opt-in per server with events: true. Implements webhook delivery from the experimental Triggers & Events extension: events/list, events/subscribe with a webhook URL and secret, and events/unsubscribe, exposed to the model as three utility tools. Subscribing always asks the user, and the gateway verifies Standard Webhooks signatures on delivery. Poll and push delivery are not implemented, and nothing is declared in the client capabilities.
- **bonusFeatures.trustTiers** — Each server entry takes trust: full, the default, or untrusted, and an unrecognised value is treated as untrusted. On an untrusted server every tool call needs approval unless the tool's annotations carry readOnlyHint: true, and an approval can be remembered per server and tool. The hint is cached with the schema, so lazily registered tools are gated the same way.
- **bonusFeatures.declaredToolCosts** — A server entry can declare per-tool costs, single figures or ranges, through tool_costs, plus a per-chat spend_limit. The approval prompt names the cost and the chat's running total, counted at the top of each range, and a call that would pass the limit needs an explicit yes even on a trust: full server. The figures come from client config, not from the server.
- **bonusFeatures.lazyServerStart** — With lazy: true on a server entry, Hermes registers the server's tools from an on-disk schema cache without starting the server, and connects on first use. Entries are keyed by server name and a fingerprint of the connection config, are written after each live registration, and expire on the SEP-2549 ttlMs from tools/list. Entries without a TTL never expire, and a missing or stale entry falls back to a normal connect.

## Verified by the probe

85 records from the live probe (`probe/`), client version `0.23.0+689.ga9ff979`. Each row is one run against the instrumented fixture server with the model mocked; the verdict says which fixture fields reached the model. Glyphs: `[…]` content, `{…}` structuredContent, `⟨…⟩` the whole envelope, `"…"` a placeholder. The scenario link opens the record; the raw captures sit next to it. Overlay: `data/verified/hermes-agent.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| **apps.visibility** | | | | | |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.app_only/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.app_only/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.app_only/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| **tools.result._meta** | | | | | |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.meta_only/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.meta_only/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.meta_only/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.with_meta/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.with_meta/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.with_meta/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| **tools.result.audience** | | | | | |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.audience_user/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.audience_user/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.audience_user/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| **tools.result.content** | | | | | |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.empty_object/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.empty_object/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.empty_object/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.large/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.large/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.large/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.no_content_key/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.no_content_key/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.no_content_key/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| **tools.result.isError** | | | | | |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.is_error/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.is_error/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.is_error/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| **tools.result.media** | | | | | |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.with_image/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.with_image/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.with_image/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| **tools.result.outputSchema** | | | | | |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.schema_match/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.schema_match/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.schema_match/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.schema_mismatch/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.schema_mismatch/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.schema_mismatch/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| **tools.result.structuredContent** | | | | | |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.mirror/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.mirror/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.mirror/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.sc_empty/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.sc_empty/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.sc_empty/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.sc_null/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.sc_null/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.sc_null/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.sc_string/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.sc_string/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.sc_string/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.structured_only/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.structured_only/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.structured_only/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.summary_and_data/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.summary_and_data/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |

## Where the evidence disagrees

- **sampling.tools** — recorded as `partial`, but declared-tier evidence at `2025-11-25` says `unsupported`.
  <br>canimcp-probe (2026-11-08) — initialize.capabilities on the wire was {"sampling":{},"elicitation":{"form":{},"url":{}}} (wire.jsonl). No tools key under sampling.
- **elicitation** — recorded as `partial`, but declared-tier evidence at `2025-11-25` says `full`.
  <br>canimcp-probe (2026-11-08) — initialize.capabilities on the wire was {"sampling":{},"elicitation":{"form":{},"url":{}}} (wire.jsonl).
- **elicitation.form** — recorded as `partial`, but declared-tier evidence at `2025-11-25` says `full`.
  <br>canimcp-probe (2026-11-08) — initialize.capabilities on the wire was {"sampling":{},"elicitation":{"form":{},"url":{}}} (wire.jsonl).
- **elicitation.url** — recorded as `unsupported`, but declared-tier evidence at `2025-11-25` says `full`.
  <br>canimcp-probe (2026-11-08) — initialize.capabilities on the wire was {"sampling":{},"elicitation":{"form":{},"url":{}}} (wire.jsonl).

## Research notes

- [A Hermes server configured by URL alone gets Streamable HTTP](../research/hermes-defaults-a-url-server-to-streamable-http.md) — *idiosyncrasy*. A bare URL gets Streamable HTTP. Since `a24c12d1`, Hermes falls back to SSE when the first Streamable HTTP connect is rejected with a transport-mismatch status, and keeps SSE for later reconnects. It is still the first client read here whose default is the current transport.
- [Hermes seeds MCP-Protocol-Version from the handshake era, not the newest revision](../research/hermes-seeds-the-protocol-header-from-the-handshake-version.md) — *nuance*. On HTTP, Hermes defaults `MCP-Protocol-Version` to the SDK's `LATEST_HANDSHAKE_VERSION` rather than `LATEST_PROTOCOL_VERSION`. The header has to agree with the body, and the body on that path is still an `initialize` handshake.
- [Hermes gives the model resources and prompts under a fifth set of tool names](../research/hermes-names-its-resource-tools-a-fifth-way.md) — *nuance*. Hermes materializes per-server `list_resources`, `read_resource`, `list_prompts` and `get_prompt` tools under an `mcp__<server>__` prefix. The model can read a resource, but the names match neither Codex and opencode's convention nor OpenClaw's.
- [Hermes declares URL-mode elicitation and declines every URL-mode request](../research/hermes-declares-url-elicitation-it-declines.md) — *gap*. mcp 2.3.0 declares both `form` and `url` elicitation for any callback, and the probe saw both on the wire from Hermes. The Hermes callback declines every URL-mode request, and an accepted form request returns empty content.
- [fast-agent declares roots.listChanged and never sends the notification](../research/fast-agent-never-sends-roots-list-changed.md) — *gap*. The Python SDK sets `roots.listChanged: true` whenever a client passes a roots callback, with no way to opt out. fast-agent's roots come from static config, so it never sends the notification. Two SDKs, three clients, same gap.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [OpenClaw scrubs MCP tool descriptions for prompt injection, and one of its three rules does nothing](../research/openclaw-scrubs-tool-descriptions-with-three-regexes.md) — *nuance*. Server-supplied tool descriptions pass a sanitizer before reaching the model on both surfaces. It redacts two fixed phrasings of "ignore previous instructions" and truncates at 1,200 characters. Its third rule rewrites "system prompt" to itself, changing only whitespace.
- [OpenClaw handles the expired Streamable HTTP session in its own code](../research/openclaw-recovers-expired-http-sessions-without-patching-the-sdk.md) — *nuance*. A stateful server signals an expired session with HTTP 404, and the stock SDK surfaces it as a terminal error. opencode patches the SDK to recover. OpenClaw detects the same condition in its own lifecycle code, on both surfaces, and refuses to replay the failed call.
- [Hermes reverses its SDK's auto mode and tries initialize before server/discover](../research/hermes-leads-with-the-legacy-handshake.md) — *nuance*. On the same mcp Python SDK as fast-agent, Hermes inverts the default. Its `protocol: auto` sends the legacy `initialize` handshake first and probes `server/discover` only when a server rejects it as modern-only. The stated reason: almost every server today is handshake-era.
- [Hermes runs one MCP client across every surface, and a second one it does not expose](../research/hermes-runs-one-mcp-client-for-every-surface.md) — *nuance*. CLI, desktop, gateway, TUI gateway, ACP adapter, cron and web all use the same `tools/mcp_tool*` client. No TypeScript SDK, and no hand-rolled client that carries a session. The one other `ClientSession` is internal, drives a computer-use server, and declares nothing.
- [Hermes never set clientInfo, so servers saw the SDK's placeholder name](../research/hermes-goes-on-the-wire-as-mcp.md) — *gap*. At `a24c12d1` Hermes passed no `client_info`, so handshakes carried the SDK placeholder `mcp` 0.1.0. At `9dcf7714` it sends `hermes-agent` with its base version, as the probe saw on the wire. Older builds still send `mcp`.
- [notes/hermes-agent-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/0c0395d/notes/hermes-agent-tool-result-handling.md) — *tools.result*, read 2026-11-08 at `0c0395d` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the Hermes Agent source at e0754412.
- [src/mcp/client/session.py:634-638](https://github.com/modelcontextprotocol/python-sdk/tree/v2.3.0) — *elicitation*, read 2026-11-09 at `2118f14f` in modelcontextprotocol/python-sdk.
- [src/mcp/client/session.py:634-638](https://github.com/modelcontextprotocol/python-sdk/tree/v2.3.0) — *elicitation.url*, read 2026-11-09 at `2118f14f` in modelcontextprotocol/python-sdk.
- [src/mcp/client/session.py:639-648](https://github.com/modelcontextprotocol/python-sdk/tree/v2.3.0) — *roots*, read 2026-11-09 at `2118f14f` in modelcontextprotocol/python-sdk. ClientSession derives the roots capability from list_roots_callback; with none passed the capability is absent.

## Provenance

Read at `9dcf7714` on 2026-11-09, from `main` of https://github.com/NousResearch/hermes-agent.git. That commit was authored 2026-11-09.

**SDK.** mcp==2.3.0 exactly, resolving to 2.3.0 in uv.lock alongside mcp-types 2.3.0, with no [tool.uv] source override and no vendored fork. Unlike every other client read here, the SDK is not a base dependency. It is declared identically under the mcp and computer-use extras and the dev dependency group. The runtime lazy install the August read found is gone: tools/lazy_deps.py is now a retired shim, and install repair syncs the mcp extra when mcp_servers is configured and the SDK is missing. The import is deferred behind _ensure_mcp_sdk, so a session with no MCP servers configured never pays for it. Every version decision on the live path is the SDK's: Hermes names no revision of its own and picks an era instead. The revisions it names itself are 2025-03-26, in a fallback constant and the non-MCP-endpoint probe frame, and 2025-06-18, in the desktop-app liveness probe.

Paths read:

- `tools/mcp_tool.py`
- `tools/mcp_tool_*.py`
- `tools/mcp_oauth.py`
- `tools/mcp_oauth_manager.py`
- `tools/mcp_oauth_device.py`
- `tools/mcp_oauth_provider.py`
- `tools/mcp_dashboard_oauth.py`
- `tools/mcp_schema_cache.py`
- `tools/tool_search.py`
- `tools/budget_config.py`
- `tools/lazy_deps.py`
- `tools/ansi_strip.py`
- `tools/computer_use/cua_backend_session.py`
- `hermes_platform/resolver/app.py`
- `gateway/platforms/webhook_mcp_events.py`
- `model_tools.py`
- `hermes_cli/mcp_config.py`
- `hermes_cli/main_install_repair.py`
- `pyproject.toml`
- `uv.lock`

Source is not vendored. Client source is read from the shared `_clients` checkout (see `AGENTS.md`); check out that commit there to reproduce any claim above.

---

Generated from `data/clients.json`, `data/verified/hermes-agent.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

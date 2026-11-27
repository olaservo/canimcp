# Reachy Mini conversation app

Voice conversation app for Pollen Robotics' Reachy Mini robot. A speech-to-speech model on a Hugging Face realtime backend, reached through the OpenAI SDK's Realtime client, gets local robot tools plus tools from Hugging Face Gradio Spaces. The app reaches those Spaces over MCP with the official Python SDK: tools only, Streamable HTTP only, a new connection for every list and every call, and the SDK's placeholder clientInfo.

## At a glance

| | |
|---|---|
| Registry id | `reachy-mini-conversation-app` |
| Vendor | Pollen Robotics |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | other |
| Platforms | linux, macos, windows |
| Licence | Apache-2.0 |
| Source | <https://github.com/pollen-robotics/reachy_mini_conversation_app> |
| Home | <https://github.com/pollen-robotics/reachy_mini_conversation_app> |
| Wire names | `mcp` |
| SDK | `mcp` 2.2.0 · declares `>=2.0,<3` · official Python SDK · unpatched · pins `2026-07-28` |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28` and every older revision it speaks, not yet split by revision |
| Source last updated | 2026-11-26 |
| Last read | 2026-11-26 |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ sse | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ streamableHttp | ◐ partial | read | `2026-07-28` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ header | ◐ partial | read | `2026-07-28` |
| &nbsp;&nbsp;↳ none | ● full | read | `2026-07-28` |
| **Tools** | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Resources** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ subscribe | ○ unsupported | read | `2026-07-28` |
| **Prompts** | ○ unsupported | read | `2026-07-28` |
| **Completions** | ○ unsupported | read | `2026-07-28` |
| **Sampling** | ○ unsupported | read | `2026-07-28` |
| **Elicitation** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ form | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ url | ○ unsupported | read | `2026-07-28` |
| **Roots** | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ listChanged | ○ unsupported | read | `2026-07-28` |
| **Logging** | ○ unsupported | read | `2026-07-28` |
| **Instructions** | ○ unsupported | read | `2026-07-28` |
| **Icons** | ○ unsupported | read | `2026-07-28` |
| **JSON Schema** |  |  |  |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ poll | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ push | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ webhook | ○ unsupported | read | `2026-07-28` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ modelInitiatedResourceRead | ○ unsupported | read | `2026-07-28` |
| &nbsp;&nbsp;↳ toolCallRetry | ● full | read | `2026-07-28` |
| &nbsp;&nbsp;↳ bundledServers | ● full | read | `2026-07-28` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — The only transport the client loads is streamable_http_client, and a server URL must be http or https.
- **transports.sse** — No sse_client import. An installed Space's URL must end in exactly /gradio_api/mcp/, so Gradio's /gradio_api/mcp/sse endpoint is refused.
- **transports.streamableHttp** — The SDK's streamable_http_client over an httpx2 client the app builds with the server's headers, follow_redirects=False and a timeout of the larger of 10 s and 30 s. Every list and every call opens and closes its own transport. Only Hugging Face Gradio Space endpoints are reachable: https, a host ending in .hf.space, port 443, path /gradio_api/mcp/. The lower-level mcp_client module also accepts any https URL or http on localhost, and no configuration path reaches it with one.
- **authentication.oauth** — The httpx2 client gets headers and no auth flow, and the SDK's OAuth provider is never constructed. A 401 surfaces as a discovery or invocation error.
- **authentication.header** — One header, chosen by the app: Authorization: Bearer with the Hugging Face token (HF_TOKEN, else the hf auth login cache), sent only to Spaces the Hub reports as private. A person cannot set other headers.
- **authentication.none** — Public Spaces, including the four bundled Pollen Spaces, are called with no credentials.
- **tools** — tools/list follows nextCursor to the end. It runs when a Space is installed or refreshed (the tool-spaces add CLI or the Tools view), and again only if the model names a tool missing from the cache. Each tool is namespaced <alias>__<tool>, where the alias is the normalised Space slug, and its name, description and inputSchema are cached in installed_tool_spaces.json. The model's tool list is built from that cache with no network call. The bundled Pollen Spaces carry static specs and are never listed. The tools go to the realtime model in session.update, beside the local robot tools. tools/call opens a fresh connection each time, and the SDK sends tools/list after a successful call on that connection to validate structuredContent against outputSchema.
- **tools.listChanged** — No connection stays open between calls and the SDK Client gets no message_handler. A changed tool list is seen only when a person re-adds the Space.
- **resources** — The client calls list_tools and call_tool and nothing else. No resources/* request is sent.
- **prompts** — No prompts/* request is sent. The system prompt comes from the selected personality profile.
- **completions** — No completion/complete request is sent.
- **sampling** — The SDK Client is built from the transport alone, with no sampling_callback, so the SDK declares no sampling capability.
- **elicitation** — No elicitation_callback, so nothing is declared and the SDK's default handler refuses a request.
- **roots** — No list_roots_callback, so no roots capability is declared.
- **logging** — No logging_callback and no log_level, so a 2026-07-28 server is never asked for log messages and logging/setLevel is never sent on a handshake connection.
- **instructions** — Client.instructions is never read. Session instructions come from the personality profile and memory.
- **icons** — Only a tool's name, description and inputSchema are read. The Tools view shows each Space by slug, private flag and tool count.
- **jsonSchema** — inputSchema is passed to the realtime model unchanged as the function's parameters, and replaced with an empty object schema when it is not a JSON object. The app does not validate the model's arguments. The SDK validates structuredContent against outputSchema with jsonschema's validator_for, which honours $schema and falls back to 2020-12; on 2026-07-28 it also drops tools whose x-mcp-header annotations are invalid.
- **extensions.io.modelcontextprotocol/ui** — Not declared and not rendered. The SDK Client is built without extensions=, and _meta.ui on a tool is not read. The app has a web UI of its own and no ui:// resource handling.
- **extensions.io.modelcontextprotocol/tasks** — No tasks/* request and no tasks capability, as the 2026-07-28 extension or as the 2025-11-25 core experimental feature. mcp 2.2.0's client package has no tasks code to turn on.
- **extensions.io.modelcontextprotocol/skills** — No skills/list or skills/get request. Profiles and local Python tools are the app's own extension points.
- **extensions.io.modelcontextprotocol/events** — Not declared and not implemented. git grep finds no events/* method in the repo, and mcp 2.2.0 has no events client.
- **extensions.io.modelcontextprotocol/events.poll** — events/poll is never sent.
- **extensions.io.modelcontextprotocol/events.push** — events/stream is never opened, and no connection outlives a single request.
- **extensions.io.modelcontextprotocol/events.webhook** — events/subscribe is never sent.
- **bonusFeatures.modelInitiatedResourceRead** — Resources are not used at all.
- **bonusFeatures.toolCallRetry** — A tools/call that fails with anything other than a timeout is sent once more after 0.25 s on a new connection. That includes the SDK's rejection of structuredContent that fails outputSchema, after the server has already run the tool. Timeouts are not retried. Per-call timeouts are 10 s for requests and 30 s for the tool.
- **bonusFeatures.bundledServers** — Four Pollen Robotics Gradio Spaces (search, time, weather, knowledge) are seeded with static tool specs when no manifest exists, and their five tools are in the default profile's default_tools. A default install talks MCP to them the first time the model calls one.

## Research notes

- [The Reachy Mini conversation app connects only to Hugging Face Gradio Spaces](../research/reachy-mini-conversation-app-reaches-only-gradio-spaces.md) — *idiosyncrasy*. A person adds an MCP server by Hugging Face Space slug, and every URL is checked against https://*.hf.space/gradio_api/mcp/. Four Pollen Spaces ship enabled with cached tool specs, and the client goes on the wire as the Python SDK's placeholder mcp 0.1.0.
- [The Reachy Mini conversation app opens a new MCP connection for every tool call](../research/reachy-mini-conversation-app-connects-once-per-tool-call.md) — *idiosyncrasy*. Each list and each tools/call builds a new httpx2 client, transport and SDK Client, so every call pays a server/discover probe, the SDK lists tools after it, no Mcp-Param headers are sent, and a call that fails for any reason but a timeout is sent twice.
- [Nothing in the spec says the model can read a resource](../research/model-initiated-resource-read.md) — *in-flight*. Resources are specified as application-driven, with no guidance on whether the model itself can pull one by URI. The PR adding a SHOULD has been open and conflicted since April.
- [mcp/client/session.py:1100-1127](https://pypi.org/project/mcp/2.2.0/) — *tools*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 2.2.0. call_tool validates a non-error result and lists tools first when the session has no cached output schema.
- [mcp/client/session.py:614-649](https://pypi.org/project/mcp/2.2.0/) — *sampling*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 2.2.0. sampling, elicitation and roots are declared only when the matching callback is passed.
- [mcp/client/session.py:633-637](https://pypi.org/project/mcp/2.2.0/) — *elicitation*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk.
- [mcp/client/session.py:638-645](https://pypi.org/project/mcp/2.2.0/) — *roots*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk.
- [mcp/client/client.py:310-324](https://pypi.org/project/mcp/2.2.0/) — *logging*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk.
- [mcp/client/session.py:1156-1181,1291-1309](https://pypi.org/project/mcp/2.2.0/) — *jsonSchema*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk.
- [mcp/server/apps.py:1,43](https://pypi.org/project/mcp/2.2.0/) — *extensions.io.modelcontextprotocol/ui*, read 2026-11-26 at `?` in modelcontextprotocol/python-sdk. mcp 2.2.0 ships MCP Apps as a server-side extension only.

## Provenance

Read at `622a3a67` on 2026-11-26, from `main` of https://github.com/pollen-robotics/reachy_mini_conversation_app.git. That commit was authored 2026-11-26.

**SDK.** mcp and mcp-types are both declared >=2.0,<3 and resolve to 2.2.0 in uv.lock; httpx2 resolves to 2.9.1. A pip install outside uv can take a newer 2.x. Not patched: no patches directory, no vendored copy, and [tool.uv] sets only required-version, exclude-newer and per-package exclude-newer exemptions, none for mcp. The app names no protocol revision and leaves Client(mode=) at the SDK default auto, so the SDK decides both the era and the version: server/discover at 2026-07-28 first, then initialize offering 2025-11-25 on any non-modern answer, accepting any handshake revision back to 2024-11-05. A comment beside the Client construction states this. Client gets no client_info, so the wire name is the SDK's placeholder mcp 0.1.0 on both eras, and the capability object is empty.

Paths read:

- `src/reachy_mini_conversation_app/mcp_client.py`
- `src/reachy_mini_conversation_app/tool_spaces.py`
- `src/reachy_mini_conversation_app/tool_space_routes.py`
- `src/reachy_mini_conversation_app/tools/core_tools.py`
- `src/reachy_mini_conversation_app/huggingface_realtime.py`
- `src/reachy_mini_conversation_app/config.py`
- `src/reachy_mini_conversation_app/profile_toolsets.py`
- `src/reachy_mini_conversation_app/static/js/views/tools.js`
- `src/reachy_mini_conversation_app/utils.py`
- `profiles/default/profile.md`
- `pyproject.toml`
- `uv.lock`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

# Visual Studio Code

Microsoft's editor. Its MCP client is hand-written in the workbench, with no MCP SDK, and serves Copilot Chat, which is vendored in the same repo at extensions/copilot and has no MCP client of its own. It declares roots, sampling, elicitation (form and url), tasks and the MCP Apps extension on every connection, and sends 2025-11-25 in initialize. Agent sessions run in the separate agent host hand server configs to the embedded agent's own MCP client.

## At a glance

| | |
|---|---|
| Registry id | `vscode` |
| Vendor | Microsoft |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | ide |
| Platforms | windows, macos, linux, web |
| Licence | MIT |
| Source | <https://github.com/microsoft/vscode> |
| Home | <https://code.visualstudio.com> |
| Wire names | `Visual Studio Code`, `Visual Studio Code - Insiders`, `Code - OSS` |
| SDK | `none` · TypeScript SDK · unpatched |
| Prefers | `2025-11-25` |
| Speaks | `2025-06-18`, `2025-11-25` |
| Source last updated | 2026-11-20 |
| Last read | 2026-11-20 |
| In traffic | evalstate/mcp-clients, window ending 2026-11-08 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ sse | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ streamableHttp | ◐ partial | read | `2025-11-25` |
| **Authentication** |  |  |  |
| &nbsp;&nbsp;↳ oauth | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ header | ● full | read | `2025-11-25` |
| **Tools** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ result | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ content | ◐ partial | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ structuredContent | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ outputSchema | ○ unsupported | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ audience | ● full | read ⇧ | `2025-11-25` |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ media | ◐ partial | read ⇧ | `2025-11-25` |
| **Resources** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ◐ partial | read | `2025-11-25` |
| &nbsp;&nbsp;↳ subscribe | ● full | read | `2025-11-25` |
| **Prompts** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read | `2025-11-25` |
| **Completions** | ● full | read | `2025-11-25` |
| **Sampling** | ◐ partial | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ context | ○ unsupported | read, declared ⇧ | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ tools | ○ unsupported | read, declared ⇧ | `2025-06-18`, `2025-11-25` |
| **Elicitation** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ form | ● full | read, declared ⇧ | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ url | ● full | read, declared ⇧ | `2025-06-18`, `2025-11-25` |
| **Roots** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ listChanged | ● full | read, declared ⇧ | `2025-06-18`, `2025-11-25` |
| **Logging** | ● full | read | `2025-11-25` |
| **Instructions** | ● full | read | `2025-11-25` |
| **Icons** | ● full | read | `2025-11-25` |
| **Tasks** | ● full | read, declared | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ list | ● full | read, declared ⇧ | `2025-06-18`, `2025-11-25` |
| &nbsp;&nbsp;↳ cancel | ● full | read, declared ⇧ | `2025-06-18`, `2025-11-25` |
| **JSON Schema** |  |  |  |
| **Extensions** |  |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ● full | read | `2025-11-25` |
| **Beyond the spec** |  |  |  |
| &nbsp;&nbsp;↳ mcpGateway | ● full | read | `2025-11-25` |
| &nbsp;&nbsp;↳ traceContextInMeta | ● full | read | `2025-11-25` |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **transports.stdio** — Spawned from the Node extension host with envFile and env merged over process.env. stdout is split on newlines. stderr lines go to the server's output log as warnings. Not available in the web build, which registers only the common HTTP service.
- **transports.sse** — Fallback when the first POST to the URL returns a 4xx other than 401 or 403, or when a POST response carries an SSE endpoint event. The legacy SSE stream then holds the session.
- **transports.streamableHttp** — Tried first for every HTTP server. Handles Mcp-Session-Id, the GET backchannel with Last-Event-ID, DELETE on close, and a 400 or 404 on a session id as a reason to re-initialize. Requests do not carry the MCP-Protocol-Version header that 2025-06-18 and later require after initialize. Only the OAuth metadata fetches send it.
- **authentication.oauth** — On a 401 or 403 the client reads resource_metadata from WWW-Authenticate, falls back to the well-known protected resource paths, then to authorization server metadata, then to default endpoints derived from the URL. A stored client id wins. Without one, CIMD is used when the server advertises client_id_metadata_document_supported and the product sets authClientIdMetadataUrl; the Code - OSS product.json does not set it, and the Microsoft builds' product.json is not in the repo. Otherwise DCR, and if DCR fails the user is prompted for a client id and secret. The DCR request lists device_code among its grant types, and no device flow was found in the dynamic provider. Enterprise-managed servers can use cross-app access through a configured IdP.
- **authentication.header** — Configured headers go on every POST, GET and DELETE. A server definition can also name an authentication provider id and scopes, whose token becomes the Authorization header. Configured headers and credentials are stripped on a cross-origin redirect.
- **tools** — Hugging Face traffic includes tool calls from this client. tools/list is called only when the server declares tools, and follows nextCursor with no duplicate-cursor guard. Each inputSchema is validated against the draft-07 meta-schema and a tool that fails is dropped with a warning. Tool lists are cached so tools show before a server starts. Calls carry progressToken, vscode.conversationId, vscode.requestId and W3C trace context in _meta.
- **tools.listChanged** — Re-lists tools on notifications/tools/list_changed. After each tool call the client also waits for a pending refresh.
- **tools.result** — One route: McpToolImplementation.invoke converts the result and Copilot Chat renders the parts. When structuredContent is truthy its JSON replaces every text block on the model path.
- **tools.result.content** — Text blocks reach the model only when structuredContent is absent or falsy. A result with no content array throws before the structured branch runs. Text over 8 KB is written to disk and replaced by a pointer.
- **tools.result.structuredContent** — Sent as one compact JSON text part with assistant audience whenever it is truthy, in place of the text blocks. structuredContent {} sends the text {}.
- **tools.result.outputSchema** — Carried on the tool object and never read. Nothing validates structuredContent.
- **tools.result.audience** — A block whose annotations.audience excludes assistant is skipped on the model path.
- **tools.result.media** — Images reach the model, resized and within an image budget. Audio and non-image binaries are dropped by Copilot Chat. Media blocks bypass the structuredContent gate.
- **resources** — User-driven: resources and templates are listed in a quick pick and attached to chat as context, and are exposed as files under an MCP resource file system. Template variables use completion/complete. No tool lets the model list or read resources.
- **resources.listChanged** — The notification is received and fires an event that nothing subscribes to. Resource lists are fetched fresh each time the picker opens, so the notification has no effect.
- **resources.subscribe** — Watching a resource file subscribes when the server declares resources.subscribe, and resources/updated becomes a file change event. No resources/unsubscribe call was found.
- **prompts** — Each server prompt becomes a /mcp.<server>.<prompt> slash command in chat, with an argument picker backed by completion/complete.
- **prompts.listChanged** — Re-lists prompts on notifications/prompts/list_changed.
- **completions** — Used for prompt arguments (ref/prompt) and resource template variables (ref/resource), with already-chosen values passed as context.arguments.
- **sampling** — Declared as a bare sampling: {} on every connection. The first request from a server asks the user, separately for requests made during a tool call and outside one, and chat.mcp.serverSampling can pre-approve servers and pick allowed models. Text, image and audio parts go to the chosen chat model. maxTokens, temperature and stopSequences are not passed, and the reply is text only.
- **sampling.context** — includeContext is not read.
- **sampling.tools** — sampling.tools is not declared. tool_use and tool_result parts are dropped from the messages.
- **elicitation** — Declared as { form: {}, url: {} } on every connection. A request without mode but with requestedSchema is treated as form, for pre-2025-11-25 servers.
- **elicitation.form** — Rendered as a sequence of quick picks and inputs. Handles string formats, numbers, booleans, plain, titled and legacy enumNames enums, and multi-select arrays, with defaults.
- **elicitation.url** — Opens the URL with commands disallowed and waits for notifications/elicitation/complete. A tool call that fails with URL_ELICITATION_REQUIRED runs the listed elicitations and retries once.
- **roots** — Roots are the workspace folders on the server's remote authority, as file URIs with normalised drive letters, or the explicit roots of a server definition.
- **roots.listChanged** — Declared. notifications/roots/list_changed is sent when the folders change, but only after the server has called roots/list since the last notification.
- **logging** — notifications/message goes to the server's output log. logging/setLevel is sent after initialize when the server declares logging, and again when the user changes the log level.
- **instructions** — Stored with the server metadata. Copilot Chat's agent prompt adds each server's instructions in an instruction tag for tools with that server's prefix.
- **icons** — Parsed for the server, tools, prompts, resources and templates, with theme and sizes. data: URIs are always accepted, http(s) only from the server's own authority on HTTP servers, and file: only for stdio servers. The mime type must be an allowed image type.
- **tasks** — The read disagrees with the Apify record, which has tasks declared as {"requests":{"tools":{"call":{}}}}. At 8e900494 the client declares {list:{}, cancel:{}, requests:{sampling:{createMessage:{}}, elicitation:{create:{}}}} and answers tasks/get, tasks/result, tasks/list and tasks/cancel for task-augmented sampling and elicitation. tools.call is a server-side task capability. On the other side, a tools/call is sent as a task when the server declares tasks.requests.tools.call and the tool's execution.taskSupport is required or optional, and the result is polled.
- **jsonSchema** — Every tool inputSchema is checked with the json.validate command against the draft-07 meta-schema, after adding an empty properties object when one is missing. A tool whose schema fails is omitted. No $schema is read and no 2020-12 handling was found.
- **extensions.io.modelcontextprotocol/ui** — Declared on every connection with mimeTypes ["text/html;profile=mcp-app"]. Tools with _meta.ui.resourceUri render the app in chat. The app host answers ui/initialize, tools/call, resources/read, sampling/createMessage, ui/open-link, ui/download-file, ui/request-display-mode, ui/message and ui/update-model-context. chat.mcp.apps.enabled (default true, tagged experimental) gates the app data attached to the tool registration, not the declaration. _meta.ui.visibility without model hides a tool from the model.
- **bonusFeatures.mcpGateway** — VS Code re-exposes its connected servers over local HTTP so Copilot CLI sessions use them. Copilot Chat routes CLI sessions through the gateway when chat.cli.mcp.enabled is on, which is the default. The server then sees VS Code's client, not the CLI's.
- **bonusFeatures.traceContextInMeta** — tools/call _meta carries traceparent and tracestate (SEP-414) when a trace is active, plus vscode.conversationId and vscode.requestId.

## Observed in traffic

From `evalstate/mcp-clients` at [`c30d6f28`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/c30d6f2859b699fe9f36e674e4722bfd2d8a1258/reports/dashboard-v1.json), report generated 2026-11-09, window 2026-09-10 to 2026-11-08. Grouped as `visual-studio-code` from wire names `Visual Studio Code`, `Visual Studio Code - Insiders`. Tool calls by revision over the 30 days to 2026-11-08: `2025-11-25` 100%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| apps | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Research notes

- [VS Code sends no MCP-Protocol-Version header on Streamable HTTP requests](../research/vscode-omits-the-protocol-version-header.md) — *idiosyncrasy*. At 8e900494 VS Code's HTTP transport sends MCP-Protocol-Version only on OAuth metadata fetches. POST, GET and DELETE to the server carry none, so a server following 2025-06-18 or later assumes 2025-03-26. The client also never checks the protocolVersion the server returns.
- [VS Code has one hand-written MCP client, and agent-host sessions use the embedded agent's client instead](../research/vscode-has-one-mcp-client-and-agent-sessions-bring-their-own.md) — *nuance*. At 8e900494 VS Code's hand-written MCP client serves Copilot Chat, which is vendored at extensions/copilot with no client of its own. Copilot CLI sessions use VS Code's gateway. Agent-host sessions hand server configs to the Claude, Codex or Copilot runtime's own client.
- [notes/vscode-tool-result-handling.md](https://github.com/olaservo/structured-content-research/blob/f32f225c/notes/vscode-tool-result-handling.md) — *tools.result*, read 2026-11-20 at `f32f225c` in olaservo/structured-content-research. The read tier for tool result handling lives in that repo (AGENTS.md); this entry summarises its note, which read the VS Code source at d53b9e1d with Copilot Chat 0.75.0.

## Provenance

Read at `8e900494` on 2026-11-20, from `main` of https://github.com/microsoft/vscode.git. That commit was authored 2026-11-20.

**SDK.** The client is hand-written: JSON-RPC through src/vs/base/common/jsonRpcProtocol.ts, with types from a generated copy of the spec schema in src/vs/platform/mcp/common/modelContextProtocol.ts (LATEST_PROTOCOL_VERSION 2025-11-25), re-exported under workbench/contrib/mcp. The root package.json has @modelcontextprotocol/sdk ^1.29.0 as a devDependency, resolved to 1.29.0, used by the agent host's Claude integration. extensions/copilot declares ^1.30.0, resolved to 1.30.0, used only for the server Copilot Chat runs for the Copilot CLI. Neither is on the client path. pnpm patchedDependencies patches only foundry-local-sdk.

Paths read:

- `src/vs/workbench/contrib/mcp/`
- `src/vs/platform/mcp/`
- `src/vs/workbench/api/common/extHostMcp.ts`
- `src/vs/workbench/api/node/extHostMcpNode.ts`
- `src/vs/workbench/api/common/extHostAuthentication.ts`
- `src/vs/workbench/api/browser/mainThreadAuthentication.ts`
- `src/vs/workbench/api/browser/mainThreadMcp.ts`
- `src/vs/base/common/oauth.ts`
- `src/vs/workbench/contrib/chat/browser/widget/chatContentParts/toolInvocationParts/chatMcpAppModel.ts`
- `src/vs/platform/agentHost/node/`
- `extensions/copilot/src/extension/chatSessions/copilotcli/node/mcpHandler.ts`
- `extensions/copilot/src/extension/prompts/node/agent/defaultAgentInstructions.tsx`

Source is not vendored. To reproduce any claim above, check out that commit in the client's repository.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

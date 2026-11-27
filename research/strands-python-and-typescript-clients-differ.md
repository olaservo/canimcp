---
id: strands-python-and-typescript-clients-differ
title: Strands ships two MCP clients, and a server sees a different client from each
kind: idiosyncrasy
summary: The Python and TypeScript bindings each wrap their language's official SDK and both probe server/discover first. They differ in wire name, tool list refresh, server logs, legacy tasks, and where trace context goes on a tool call.
capabilities:
  - tools.listChanged
  - logging
  - tasks
  - tools.result.content
clients:
  - strands
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py MCPClient, session construction and negotiation
    commit: 8e388465
    path: strands-py/src/strands/tools/mcp/mcp_client.py:MCPClient._async_background_thread
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py _compat, negotiate_session and the tools-changed subscription
    commit: 8e388465
    path: strands-py/src/strands/tools/mcp/_compat.py:negotiate_session,tools_changed_subscription
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts McpClient, constructor and _createClient
    commit: 8e388465
    path: strands-ts/src/mcp/client.ts:McpClient
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts McpClient, tool invocation, legacy tasks and trace context
    commit: 8e388465
    path: strands-ts/src/mcp/client.ts
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts Agent.initialize, MCP tool registration and refresh
    commit: 8e388465
    path: strands-ts/src/agent/agent.ts:Agent.initialize
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts McpTool, content mapping
    commit: 8e388465
    path: strands-ts/src/tools/mcp-tool.ts:McpTool
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts package.json, MCP dependencies and engines
    commit: 8e388465
    path: strands-ts/package.json
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: root package-lock.json, resolved MCP packages
    commit: 8e388465
    path: package-lock.json
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.3.1
    title: "@modelcontextprotocol/client 2.3.1, version negotiation default, the stdio sibling probe and the list page cap"
    path: dist/index.mjs
    date: 2026-11-16
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts TaskTransport, the raw JSON-RPC path and the stdio probe shape
    commit: 8e388465
    path: strands-ts/src/mcp/task-transport.ts
    date: 2026-11-27
  - url: https://pypi.org/project/mcp/2.3.0/
    title: mcp 2.3.0, negotiate_auto
    path: mcp/client/_probe.py
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - strands-python-speaks-two-sdk-majors
  - strands-sends-the-server-config-key-as-client-name
---

# Strands ships two MCP clients, and a server sees a different client from each

The `strands-agents/harness-sdk` repository holds two SDKs with one MCP client each: `MCPClient` in `strands-py/src/strands/tools/mcp/` and `McpClient` in `strands-ts/src/mcp/`. A search for the SDK imports and for a hand-written `initialize` at `d982a0d4` found no third implementation. The other packages in the repository consume these two: `harness-py` and `harness-ts` call `load_servers` and `loadServers`, `strands-cli` builds `McpClient` instances, and `strands-mcp` is a server.

The registry entry describes the Python binding, because the probe ran it. This note lists what a server sees differently from the TypeScript binding at the same commit.

| | Python (`strands-agents`) | TypeScript (`@strands-agents/sdk`) |
|---|---|---|
| SDK, declared | `mcp>=1.23.0,<2.4`, a base dependency | `@modelcontextprotocol/client` `^2.0.0`, a required peer dependency |
| SDK, resolved | no lockfile; 2.3.0 is the newest in range on 2026-11-16 | 2.3.1 in the root `package-lock.json` |
| First request | `server/discover` at `2026-07-28`, through the SDK's `negotiate_auto` | `server/discover` at `2026-07-28`, through `versionNegotiation: { mode: 'auto' }` |
| Fallback | `initialize` offering `2025-11-25` | `initialize` offering `2025-11-25` |
| stdio connect | one server process, probed in place | the SDK probes a second, disposable process started from the same command, then starts the session process |
| Oldest handshake revision in the SDK's list | `2024-11-05` | `2024-10-07` |
| Default `clientInfo` | `mcp` `0.1.0`, the SDK placeholder | `strands-agents-ts-sdk` `0.0.1` |
| Default capabilities | `{}` | `{}` |
| `tools/list` paging | every page, no cap | every page, the SDK's cap of 64 pages |
| Tools list-changed | acted on only when the application sets `on_tools_changed` | the Agent sets `onToolsChanged` on every client and swaps tools in its registry |
| `notifications/message` | discarded by the SDK's default callback | written to the Strands logger at a mapped level |
| Unknown content block in a tool result | dropped | passed to the model as a JSON block |
| Empty `content` in a tool result | an empty result | the text "Tool execution completed successfully with no output." |
| Tasks at `2025-11-25` | only when `mcp` 1.x is installed | on the 2.x SDK, with raw `tools/call`, `tasks/get` and `tasks/result` requests |
| Tasks at `2026-07-28` | Strands' own SEP-2663 models over `send_request` | `@modelcontextprotocol/ext-tasks` 0.2.2 over a `TaskTransport` that writes raw JSON-RPC |
| Trace context on `tools/call` | `params._meta` | a `_meta` key inside `params.arguments` |
| Dropped session | `auto_reconnect` option, off by default | `connect(true)`, called by the application |
| Runs in | CPython 3.10 and later | Node 22 and later, and a browser bundle without `loadServers` |

Neither binding declares sampling or roots, and both declare elicitation with `form` and `url` only when the application passes a callback. Both expose prompts, resources and the server's instructions as client methods that the agent loop does not call.

## Both lead with discover, each by its own setting

The Python binding builds a low-level `ClientSession`, which negotiates nothing until asked, and calls `negotiate_auto` from `mcp.client.client` itself in `_compat.negotiate_session`. The TypeScript binding passes `versionNegotiation: { mode: 'auto' }` to `Client`, and `@modelcontextprotocol/client` 2.3.1 sets `DEFAULT_VERSION_NEGOTIATION_MODE` to `legacy`. The revision lists are the SDKs'. The order is Strands' choice in both bindings.

On stdio the two SDKs probe differently. `negotiate_auto` in `mcp` 2.3.0 sends `server/discover` on the session's own pipe and falls back to `initialize` on an error. `@modelcontextprotocol/client` 2.3.1 runs the probe in `negotiateStdioViaSibling`: it constructs a second transport from the same command and arguments with stderr ignored, probes it, disposes of it, and only then starts the caller's transport. A stdio server launched by a TypeScript Strands agent is therefore started twice per connection. Strands' `TaskTransport` copies the wrapped transport's `constructor`, `stderr`, `pid` and `_serverParams` onto itself so the SDK still takes this path when tasks are configured. A comment there says the SDK has no supported hook for this and that the reflected members track the SDK version. The peer range is `^2.0.0`.

## Trace context goes inside the tool arguments in TypeScript

`McpClient._prepareToolCall` calls `injectTraceContext(args)` unless `disableMcpInstrumentation` is set. When an OpenTelemetry span is active, that function returns the arguments with an added `_meta` key holding the propagation carrier, and the result is sent as `params.arguments`. A server that validates arguments against an `inputSchema` with `additionalProperties: false` receives a key its schema does not list. The Python binding passes the carrier through the SDK's `meta` parameter, which puts it in `params._meta`. The TypeScript path was read and was not run. The probe ran the Python binding only.

## Legacy tasks work in one binding per SDK line

The Python binding on `mcp` 2.x reads task support from `capabilities.extensions` only, and its lifecycle methods raise unless the connection negotiated `2026-07-28`. A `2025-11-25` server that advertises `tasks.requests.tools.call` gets direct tool calls. The legacy flow is in the Python code, behind `MCP_V2` being false. The TypeScript binding checks `getNegotiatedProtocolVersion() === '2025-11-25'` and the tool's `taskSupport`, then drives `tools/call` with `task: {}`, `tasks/get` and `tasks/result` through `Client.request`.

## What the registry cannot hold

`metadata.sdk` is one object and `clientInfoNames`, `platforms` and every capability row are per entry. The entry records the Python SDK in `metadata.sdk`, puts the TypeScript SDK in its `notes` and evidence, and uses row notes for the differences in the table. A consumer that reads only statuses gets the Python binding.

## Not checked

The TypeScript binding was not run. Its tool-result handling is outside the structured-content-research note, which covers Python only. The fallback from discover to `initialize` was read in both SDKs and not exercised: every probe run was answered at `2026-07-28`.

---
id: pi-keeps-mcp-tools-out-of-the-models-tool-list
title: pi does not declare MCP tools to the model by default
kind: idiosyncrasy
summary: pi's default exposure for an MCP server is codemode. The model gets no declaration for the server's tools, only a codemode tool and one line per server in the system prompt, and reaches the tools from scripts it writes. deferred, direct and hidden are set per server or per tool.
capabilities:
  - tools
  - tools.listChanged
  - instructions
  - resources
clients:
  - pi
  - opencode
  - kilocode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/core/mcp-servers.ts, the McpExposure type and getMcpToolExposure
    commit: cdf74062
    path: packages/coding-agent/src/core/mcp-servers.ts:McpExposure,MCP_EXPOSURES,MCP_EXPOSURE_ALIASES,getMcpToolExposure
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/mcp/index.ts, renderServersSection
    commit: cdf74062
    path: packages/coding-agent/src/extensions/mcp/index.ts
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/mcp/index.ts, syncResourceTools and ensureDiscoveryActive
    commit: cdf74062
    path: packages/coding-agent/src/extensions/mcp/index.ts:createMcpExtension
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/mcp/index.ts, the startup wait and the tool_call wait
    commit: cdf74062
    path: packages/coding-agent/src/extensions/mcp/index.ts:createMcpExtension
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/src/extensions/mcp/tools.ts, toToolExposure
    commit: cdf74062
    path: packages/coding-agent/src/extensions/mcp/tools.ts:toToolExposure
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/docs/mcp.md, Control tool exposure
    commit: cdf74062
    path: packages/coding-agent/docs/mcp.md:Control tool exposure
    date: 2026-11-27
  - url: https://github.com/olaservo/structured-content-research/blob/711f1f6/notes/pi-mono-tool-result-handling.md
    title: How pi-mono handles MCP tool results, for what a script and the model receive on each route
    commit: 711f1f6
    date: 2026-11-16
status: current
lastVerified: 2026-11-27
related:
  - pi-dropped-no-mcp-and-shipped-its-own-client
  - model-initiated-resource-read
  - kilocode-runs-opencodes-mcp-client-behind-every-surface
---

# pi does not declare MCP tools to the model by default

Every MCP tool is registered in pi as `mcp__<server>__<tool>`. Whether the model is told about it depends on the server's `exposure`, which a `toolExposure` map can override per tool name or `*` pattern.

| Exposure | The model's tool list | How a tool is called |
|---|---|---|
| `codemode` (default) | no MCP tools; the `codemode` tool is activated | a script calls `tools.mcp__<server>__<tool>(args)` |
| `deferred` | no MCP tools until `tool_search` loads matches for the next call | directly, once loaded |
| `direct` | the tool, like a built-in | directly, and from scripts |
| `hidden` | nothing | not reachable |

`getMcpToolExposure` returns `config.exposure ?? "codemode"`, and `/mcp` treats `codemode` as the value that removes the key from `mcp.json`. So a server copied in from another client's config, with no pi-specific fields, is a codemode server.

On that default the model sees two things. One is the `codemode` tool, whose description does not list MCP tools; a script finds them with `searchTools()`, `describeTool()`, `describeNamespace()` or `ALL_TOOLS`. The other is an `mcp_servers` section in the system prompt with one line per server: its namespace, whether it is reached through codemode or tool_search, and a summary of at most 250 characters. The section is capped at 4096 characters, and servers that do not fit are counted in a closing line. `autoEnableCodemode: false` beside `mcpServers` stops the activation, and pi then warns once that the tools cannot be called.

## What this does to the other rows

- Instructions. The summary line is the first line of the entry's `description`, and of the server's `instructions` only when there is no description. The full instructions are attached to the tool namespace, where `describeNamespace()` returns them to a script and `tool_search` ranks by them. A server whose tools are all `direct` is not in the section, so its instructions reach the model only if a script asks.
- Resources. The three resource tools take the widest exposure among the servers that have resources, in the order direct, codemode, deferred. On a default install they are script-callable and not declared.
- Tool list changes. pi cannot unregister a tool, so a tool the server withdraws is re-registered as `hidden`.
- Startup. The first prompt waits up to 10 seconds for servers that have `direct` tools, because those must be in the first request. Codemode and deferred servers connect in the background, and a script or search waits for the servers it names when it runs.

## Against the other code-mode clients

The registry records opencode as routing MCP tools through its `execute` script tool by default, and Kilo Code as making that opt-in. pi's default is the script route too. In pi the route is set per server and per tool in `mcp.json`, and there is a third route, `deferred`, that ends in a direct call.

The probe's `default` config for pi sets `exposure: direct`, so its `default` records describe an opt-in route. The `codemode` config is the stock one.

---
id: strands-sends-the-server-config-key-as-client-name
title: Strands tells a server its own config key as the client name, or the SDK placeholder
kind: idiosyncrasy
summary: A Python MCPClient built directly sends clientInfo.name "mcp", the SDK placeholder. One built by load_servers sends the server's config key, so an entry named github sees a client called github. TypeScript defaults to strands-agents-ts-sdk.
capabilities:
  - clientInfoNames
clients:
  - strands
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py MCPClient, application_name, client_name and the client_info passed to ClientSession
    commit: 8e388465
    path: strands-py/src/strands/tools/mcp/mcp_client.py:MCPClient.__init__,MCPClient,MCPClient._async_background_thread
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py _build_client_from_config, application_name defaults to the config key
    commit: 8e388465
    path: strands-py/src/strands/tools/mcp/mcp_client.py:_build_client_from_config
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts McpClient constructor defaults and loadServers baseOptions
    commit: 8e388465
    path: strands-ts/src/mcp/client.ts:McpClient
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-ts config.node.ts, applicationName falls back to the config key
    commit: 8e388465
    path: strands-ts/src/mcp/config.node.ts:baseOptions
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: harness-py agent.py, mcp_servers go through load_servers
    commit: 8e388465
    path: harness-py/src/strands_harness/agent.py:create_harness
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: harness-ts builtin-tools.ts, clientName keys the mcp_servers axis
    commit: 8e388465
    path: harness-ts/src/builtin-tools.ts:UNNAMED_MCP_CLIENT,mcpClientsByClientName
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-cli agent/mcp.ts, applicationName is the server name and the version is the harness version
    commit: 8e388465
    path: strands-cli/src/agent/mcp.ts:CLIENT_DEFAULTS,createClient
    date: 2026-11-27
  - url: https://pypi.org/project/mcp/2.3.0/
    title: mcp 2.3.0, DEFAULT_CLIENT_INFO and the client_info fallback
    path: mcp/client/session.py
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - hermes-goes-on-the-wire-as-mcp
  - goose-client-name-varies-by-surface
  - strands-python-and-typescript-clients-differ
  - mastra-sends-the-server-config-key-as-its-client-name
---

# Strands tells a server its own config key as the client name, or the SDK placeholder

Neither Strands binding has one name it always sends. What a server reads in `clientInfo.name` depends on how the application built the client.

| How the client was built | `clientInfo.name` | `clientInfo.version` |
|---|---|---|
| Python, `MCPClient(...)` with no `application_name` | `mcp` | `0.1.0` |
| Python, `MCPClient(..., application_name="x")` | `x` | `application_version`, else the installed `strands-agents` version |
| Python, `MCPClient.load_servers(config)` | the server's key in the config, unless the entry sets `application_name` | `application_version` from the entry, else the `strands-agents` version |
| TypeScript, `new McpClient(...)` with no `applicationName` | `strands-agents-ts-sdk` | `0.0.1` |
| TypeScript, `McpClient.loadServers(config, defaults)` | `defaults.applicationName`, else the server's key in the config | `defaults.applicationVersion`, else `0.0.1` |

## The Python default is the SDK's placeholder

`MCPClient` passes `client_info` to `ClientSession` only when `application_name` is set. Otherwise it passes `None`, and `mcp` 2.3.0 falls back to `DEFAULT_CLIENT_INFO`, `Implementation(name="mcp", version="0.1.0")`. The docstring for `application_name` says so: "Defaults to None (uses the MCP SDK default "mcp")". The probe's script builds `MCPClient` directly, and its wire capture shows `{"name":"mcp","version":"0.1.0"}` in the `server/discover` request and in every request after it. Hermes sent the same placeholder until it started passing `client_info`.

## The config loaders send the name of the server

`_build_client_from_config` passes `application_name=server.get("application_name", name)`, where `name` is the key of the server entry. A config with `{"mcpServers": {"github": {...}}}` produces a client that introduces itself to the GitHub server as `github`. The TypeScript loader does the same when the caller gave no default: `applicationName: defaults?.applicationName ?? name`.

The field has a second job that explains the default. `MCPClient.client_name` returns the same value, documented as "Defaults to the config key for `load_servers` clients". The harness packages use it as the local label for a connection: a subagent is offered its parent's MCP servers by `client_name`, and `harness-ts` treats `strands-agents-ts-sdk` as meaning unnamed. One string is both the application's label for the server and the client's name on the wire.

The harness and the CLI in the same repository take this path. `harness-py` loads `mcp_servers` with `MCPClient.load_servers`, `harness-ts` with `McpClient.loadServers`, and `strands-cli` sets `applicationName` to the server name and `applicationVersion` to the harness version.

## What a telemetry feed sees

A feed keyed on `clientInfo.name` has no row for Strands. Python agents built by hand land in `mcp` with every other caller of the Python SDK that sets no name. Agents built from a config file land under names chosen for servers, and the same agent shows a different name to each server it connects to. The version field is the only Strands signal on the config path in Python, where it carries the `strands-agents` version. `strands-agents-ts-sdk` identifies the TypeScript binding only for clients built without a name, and its `0.0.1` is a constant.

The registry entry lists `mcp` and `strands-agents-ts-sdk` in `clientInfoNames`. The config-key names cannot be listed.

## Not checked

What deployed Strands applications set was not surveyed. The TypeScript names were read from source and not captured on the wire.

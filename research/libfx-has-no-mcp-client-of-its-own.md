---
id: libfx-has-no-mcp-client-of-its-own
title: libfx has no MCP client and no SDK dependency, and wraps a client the application supplies
kind: idiosyncrasy
summary: libfx depends on no MCP SDK and holds no MCP client. `createMcpAdapter` wraps a client the application already connected, so the wire name, revision, capabilities, transport and auth are the application's. fx's Zig engine is switched off in the libfx core.
capabilities:
  - tools
  - tools.listChanged
  - resources
  - prompts
  - instructions
clients:
  - libfx
  - fx
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/vercel-labs/fx
    title: sdk/mcp.js, createMcpAdapter
    commit: ed1f3317
    path: sdk/mcp.js:createMcpAdapter
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: sdk/types/mcp.d.ts, the McpClient interface
    commit: ed1f3317
    path: sdk/types/mcp.d.ts:McpClient
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: sdk/package.json, no dependency fields
    commit: ed1f3317
    path: sdk/package.json
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: sdk/README.md, MCP and skills
    commit: ed1f3317
    path: sdk/README.md:MCP and skills
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/wasm_core_main.zig, allow_acp_mcp
    commit: ed1f3317
    path: src/wasm_core_main.zig:main
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/napi_core_main.zig, allow_acp_mcp
    commit: ed1f3317
    path: src/napi_core_main.zig:run
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/acp/sessions.zig, the refusal when MCP is off
    commit: c3dc80c4
    path: src/acp/sessions.zig:handleNewSession
    date: 2026-11-16
  - url: https://github.com/vercel-labs/fx
    title: src/main.zig, no MCP host on WebAssembly
    commit: c3dc80c4
    path: src/main.zig:init
    date: 2026-11-16
  - url: https://github.com/vercel-labs/fx
    title: sdk/NAPI.md, capability profile
    commit: ed1f3317
    path: sdk/NAPI.md:Capability profile
    date: 2026-11-27
  - url: https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/1.32.2
    title: "@modelcontextprotocol/sdk 1.32.2, protocol version constants"
    path: dist/esm/types.js
    date: 2026-11-16
  - url: https://www.npmjs.com/package/@modelcontextprotocol/client/v/2.4.0
    title: "@modelcontextprotocol/client 2.4.0, the default negotiation mode"
    path: dist/public-CvV4ZHkX.mjs
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - fx-probes-server-discover-before-initialize
  - libfx-passes-the-abort-signal-in-the-sdk-v1-position
---

# libfx has no MCP client and no SDK dependency, and wraps a client the application supplies

The probe registry records libfx's SDK as "host-supplied". At `c3dc80c4` that means the following.

libfx does not depend on an MCP SDK. `sdk/package.json` has no `dependencies`, `devDependencies` or `peerDependencies` field. The published `libfx` 0.0.17 lists four `@libfx/libfx-*` native-addon packages as `optionalDependencies` and nothing else.

libfx takes a client instance from the application. `createMcpAdapter(client, options)` in `sdk/mcp.js` throws unless `client.listTools` and `client.callTool` are functions, and otherwise accepts any object. `sdk/types/mcp.d.ts` describes the shape as "The parts of an MCP client the adapter calls, with the MCP TypeScript SDK v1 signatures", and adds "Transport, authentication, elicitation, and cleanup stay with the host." The README says "libfx doesn't own the MCP connection. You create the client, handle its auth and close it after the agent." The repo's own adapter test passes a hand-written JSON-RPC object, and no SDK client appears anywhere under `sdk/`.

libfx does not reuse fx's engine. The libfx core is the same Zig agent core as fx, built as a native addon and as WebAssembly, and both entry points set `allow_acp_mcp = false`. A session that names MCP servers is refused with "MCP servers are unavailable in this runtime". On a WebAssembly target `src/main.zig` passes no MCP host loader. So the two entries share no MCP client code. fx's client is `src/mcp/`, and libfx's MCP surface is `sdk/mcp.js`, 130 lines.

The repo has no third MCP client. `fx mcp call` is a Unix-socket bridge from a shell command to the running session's engine. Servers an ACP editor supplies are parsed into the same engine.

What this means for the registry row:

- libfx sends no `clientInfo.name` of its own. The probe's capture shows `canimcp-probe-libfx-host`, the name the probe's script gave its client.
- The protocol revision is the client's. `@modelcontextprotocol/sdk` 1.32.2 pins `2025-11-25`. `@modelcontextprotocol/client` 2.4.0, which the probe used, defaults to the `initialize` handshake at `2025-11-25` and reaches `2026-07-28` only through its `versionNegotiation` option.
- The declared capabilities are the client's. A client constructed without options declares `{}`.

What the adapter does itself:

- Lists tools once, across up to 64 pages, and never again. A `tools/list_changed` notification has no effect on an existing adapter.
- Calls `callTool` for each model tool call and flattens the result to text and images.
- Reads the resources and prompts the application names in `options.resources` and `options.prompts`, once, and returns their text as `instructions`.
- Does not read the server's `initialize` instructions, tool `outputSchema`, annotations, icons or `_meta`.

The registry schema has no value for an SDK that is expected and not installed. The entry names `@modelcontextprotocol/sdk` in `speaksMcpVia` and `metadata.sdk` with no `declared` or `resolved` version.

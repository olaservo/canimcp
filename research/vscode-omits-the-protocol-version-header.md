---
id: vscode-omits-the-protocol-version-header
title: VS Code sends no MCP-Protocol-Version header on Streamable HTTP requests
kind: idiosyncrasy
summary: At 8e900494 VS Code's HTTP transport sends MCP-Protocol-Version only on OAuth metadata fetches. POST, GET and DELETE to the server carry none, so a server following 2025-06-18 or later assumes 2025-03-26. The client also never checks the protocolVersion the server returns.
capabilities:
  - transports.streamableHttp
clients:
  - vscode
specVersions:
  - 2025-06-18
  - 2025-11-25
sources:
  - url: https://github.com/microsoft/vscode
    title: extHostMcp.ts, McpHTTPHandle._sendStreamableHttp
    commit: c30f00e4
    path: src/vs/workbench/api/common/extHostMcp.ts:McpHTTPHandle._sendStreamableHttp
    date: 2026-11-27
  - url: https://github.com/microsoft/vscode
    title: extHostMcp.ts, _fetchWithAuthRetry, the only place the header is set
    commit: c30f00e4
    path: src/vs/workbench/api/common/extHostMcp.ts:McpHTTPHandle._fetchWithAuthRetry
    date: 2026-11-27
  - url: https://github.com/microsoft/vscode
    title: mcpServerRequestHandler.ts, initialize and the stored reply
    commit: c30f00e4
    path: src/vs/workbench/contrib/mcp/common/mcpServerRequestHandler.ts:McpServerRequestHandler.create
    date: 2026-11-27
  - url: https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
    title: Streamable HTTP, protocol version header
    date: 2026-11-20
status: current
lastVerified: 2026-11-27
---

# VS Code sends no MCP-Protocol-Version header on Streamable HTTP requests

The 2025-06-18 and 2025-11-25 transports say a client using HTTP must send `MCP-Protocol-Version: <negotiated version>` on every request after initialization. A server that receives no header should assume 2025-03-26.

At `8e900494` the only code that sets the header is `_fetchWithAuthRetry` in `src/vs/workbench/api/common/extHostMcp.ts`. It builds `{ 'MCP-Protocol-Version': MCP.LATEST_PROTOCOL_VERSION }` for the protected resource and authorization server metadata fetches made after a 401 or 403. `_sendStreamableHttp` sends the configured headers, `Content-Type`, `Accept` and `Mcp-Session-Id`. The GET backchannel adds `Accept` and `Last-Event-ID`, and the DELETE on close adds `Mcp-Session-Id`. A case-insensitive search of `src` for `mcp-protocol-version` outside tests finds only those two lines.

The client sends `protocolVersion: "2025-11-25"` in `initialize` and stores the server's reply without comparing versions. A server that answers with an older revision is used as if nothing changed.

A server that gates 2025-06-18 or later behaviour on the header sees VS Code as a 2025-03-26 client on every request after `initialize`, while the `initialize` body says 2025-11-25. Servers that only read the body are unaffected. This was read from source and not observed against a server.

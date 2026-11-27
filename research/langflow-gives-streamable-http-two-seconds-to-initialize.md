---
id: langflow-gives-streamable-http-two-seconds-to-initialize
title: Langflow gives a Streamable HTTP server two seconds to answer initialize, and a timeout never falls back to SSE
kind: idiosyncrasy
summary: Langflow waits a fixed 2 s for initialize on each of three Streamable HTTP attempts, whatever LANGFLOW_MCP_SERVER_TIMEOUT says. It falls back to SSE only on a 400, 404, 405 or 406. A timeout counts as transient, so a slow server fails with no SSE attempt.
capabilities:
  - transports.streamableHttp
  - transports.sse
clients:
  - langflow
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/base/mcp/util.py, the Streamable HTTP attempt loop and the 2 s initialize cap
    commit: 2b6faa1c
    path: src/lfx/src/lfx/base/mcp/util.py:MCPSessionManager.session_task
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/base/mcp/util.py, attempt count, retry delay, and the transient and SSE-fallback tests
    commit: 2b6faa1c
    path: src/lfx/src/lfx/base/mcp/util.py:_convert_mcp_result
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/base/mcp/util.py, the SSE path and the per-server transport preference
    commit: 2b6faa1c
    path: src/lfx/src/lfx/base/mcp/util.py:MCPSessionManager.get_session,MCPSessionManager.session_task
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/services/settings/groups/mcp.py, mcp_server_timeout and its note on the 2 s cap
    commit: 2b6faa1c
    path: src/lfx/src/lfx/services/settings/groups/mcp.py:McpSettings
    date: 2026-11-27
  - url: https://github.com/langflow-ai/langflow
    title: src/lfx/src/lfx/base/mcp/util.py, the advisory DELETE sent on disconnect
    commit: 2b6faa1c
    path: src/lfx/src/lfx/base/mcp/util.py:MCPStreamableHttpClient._terminate_remote_session
    date: 2026-11-27
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, streamablehttp_client and terminate_on_close
    path: mcp/client/streamable_http.py
    date: 2026-11-20
status: current
lastVerified: 2026-11-27
related:
  - langflow-speaks-mcp-through-its-own-sdk-wrapper
---

# Langflow gives a Streamable HTTP server two seconds to answer initialize, and a timeout never falls back to SSE

## The handshake budget

At `21381e5b` (Langflow 1.13.3), a server registered with a URL and no explicit mode is treated as `Streamable_HTTP`. `MCPSessionManager._create_streamable_http_session` opens the SDK's `streamablehttp_client` and calls `asyncio.wait_for(session.initialize(), timeout=2.0)`. It makes up to three attempts (`STREAMABLE_HTTP_CONNECT_ATTEMPTS = 3`), sleeping 0.35 s and then 0.7 s between them.

The 2 s figure is a literal. `LANGFLOW_MCP_SERVER_TIMEOUT` (default 60 s) bounds the outer connect and the wait for the session future, and the setting's own description says it "does not change the per-attempt 2 s cap on the Streamable HTTP `initialize` handshake, so a slow-to-start server is only tolerated over stdio". A remote server that takes longer than 2 s to answer `initialize`, for example on a cold start, fails all three attempts.

## When SSE is tried

The SSE path runs in two cases. The server's config sets `mode: "SSE"`, which skips Streamable HTTP. Or the Streamable HTTP failure looks like a transport mismatch: an `httpx.HTTPStatusError` with 400, 404, 405 or 406, or an `McpError` or message naming 404, 405, 406, "not found", "method not allowed" or "not acceptable".

`_is_transient_streamable_http_error` is checked first, and a timeout, `ConnectionError`, `OSError`, any `httpx.RequestError`, a 5xx, a 429, or a message such as "connection closed" or "taskgroup" makes it true. A transient failure is retried and never falls back. So the 2 s timeout above ends with an error naming Streamable HTTP and no SSE attempt.

Once SSE connects, the manager records `sse` as that server's preferred transport, keyed by URL and headers, and later sessions go straight to SSE for as long as that session manager lives in the component cache. The SSE path calls `initialize()` with no 2 s cap. Its read timeout is 30 s. A pinned preset sets `allow_sse_fallback: false`, and then SSE is never tried.

## The extra DELETE

`MCPStreamableHttpClient.disconnect()` sends its own best-effort HTTP DELETE to the server URL before the session is torn down. It looks for the session id with `getattr(self.session, "session_id", None) or getattr(self.session, "id", None)`. The SDK's `ClientSession` has neither attribute, so the DELETE goes without an `Mcp-Session-Id` header, with the configured headers. The SDK's `streamablehttp_client` defaults to `terminate_on_close=True` and sends its own DELETE with the session id when the transport closes. From the code, a server sees one DELETE without a session id and then one with it. It is also sent when the session fell back to SSE. In this commit only the `GET /api/v2/mcp/servers?action_count=true` check calls `disconnect()`. The MCP Tools component leaves its pooled sessions to the idle reaper (400 s by default). I did not run this against a server.

## Not checked

I did not measure how often a real server misses the 2 s window. I did not check whether Langflow Desktop overrides any of these constants.

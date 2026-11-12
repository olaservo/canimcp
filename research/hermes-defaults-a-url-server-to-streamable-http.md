---
id: hermes-defaults-a-url-server-to-streamable-http
title: A Hermes server configured by URL alone gets Streamable HTTP
kind: idiosyncrasy
summary: A bare URL gets Streamable HTTP. Since `a24c12d1`, Hermes falls back to SSE when the first Streamable HTTP connect is rejected with a transport-mismatch status, and keeps SSE for later reconnects. It is still the first client read here whose default is the current transport.
capabilities:
  - transports.sse
  - transports.streamableHttp
clients:
  - hermes-agent
  - cline
  - openclaw
specVersions:
  - 2025-03-26
  - 2025-11-25
sources:
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool.py, MCPServerTask._run_http transport selection
    commit: a24c12d1
    path: tools/mcp_tool.py:3588-3672
    date: 2026-08-27
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_transport.py, transport selection and the SSE fallback
    commit: 9dcf7714
    path: tools/mcp_tool_transport.py:532-560,600-668
    date: 2026-11-09
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_errors.py, _is_streamable_http_rejection
    commit: 9dcf7714
    path: tools/mcp_tool_errors.py:73-91
    date: 2026-11-09
status: current
lastVerified: 2026-11-09
related:
  - cline-defaults-a-url-server-to-sse
  - openclaw-defaults-a-url-server-to-sse
---

# A Hermes server configured by URL alone gets Streamable HTTP

`_run_http` reads the `url` key and builds a Streamable HTTP transport. SSE is behind an explicit `if config.get("transport") == "sse"` branch, documented in place as being for servers that implement the SSE transport rather than Streamable HTTP. There is no type union whose ordering could decide the question by accident.

Three clients have now been read on this point and Hermes is the first to default forward. Cline's extension schema orders a union with SSE first and carries a comment saying why: reordering would break configs written before Streamable HTTP existed. OpenClaw's default is structural rather than argued — the modern transport sits behind a name check and SSE is the next unconditional statement. Hermes inverts both by putting the deprecated transport behind the name check instead.

At `a24c12d1` a pre-2025-03-26 config that worked on Cline needed an explicit `transport: sse` line here. At `9dcf7714` it does not. When the first Streamable HTTP connect fails with 400, 405, 406 or 411, or with the SDK's -32603 "Server returned an error response", Hermes retries over SSE. Once SSE works it is kept for later reconnects, and a warning tells the user to pin `transport: sse`. The fallback does not fire on a timeout, an auth error, or a reconnect after a session has worked. So Hermes now covers the same SSE-only servers Cline and OpenClaw protect, with the order reversed: the current transport first, the deprecated one on rejection.

Hermes also refuses one combination outright. `strict_redirect_headers` cannot be used with SSE, on the stated grounds that the SSE transport cannot enforce the redirect boundary that setting exists to guarantee, so a config asking for both fails at connect rather than running with the weaker guarantee. The automatic SSE fallback is also disabled under that setting.

Handling for the SDK's own transport-entry churn sits alongside this. Hermes probes for both `streamable_http_client` and the deprecated `streamablehttp_client` alias and treats HTTP as available if either imports. A comment records that gating on the deprecated name alone broke every HTTP and SSE server on mcp 2.x, and that reaching the newer entry point was necessary but not sufficient because the same path unpacked the transport as a 3-tuple, which is the 1.x shape. At `9dcf7714` the streams are indexed, which works for both shapes.

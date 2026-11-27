---
id: reachy-mini-conversation-app-reaches-only-gradio-spaces
title: The Reachy Mini conversation app connects only to Hugging Face Gradio Spaces
kind: idiosyncrasy
summary: A person adds an MCP server by Hugging Face Space slug, and every URL is checked against https://*.hf.space/gradio_api/mcp/. Four Pollen Spaces ship enabled with cached tool specs, and the client goes on the wire as the Python SDK's placeholder mcp 0.1.0.
capabilities:
  - transports.streamableHttp
  - authentication.header
  - authentication.oauth
  - tools
  - clientInfoNames
clients:
  - reachy-mini-conversation-app
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/pollen-robotics/reachy_mini_conversation_app
    title: src/reachy_mini_conversation_app/tool_spaces.py, bundled specs, URL validation, client construction and install
    commit: 622a3a67
    path: src/reachy_mini_conversation_app/tool_spaces.py:50-171,252-274,514-534,615-683
    date: 2026-11-26
  - url: https://github.com/pollen-robotics/reachy_mini_conversation_app
    title: src/reachy_mini_conversation_app/mcp_client.py, validate_http_mcp_url and the Client construction
    commit: 622a3a67
    path: src/reachy_mini_conversation_app/mcp_client.py:74-85,366-381
    date: 2026-11-26
  - url: https://github.com/pollen-robotics/reachy_mini_conversation_app
    title: src/reachy_mini_conversation_app/tool_space_routes.py, the tool_spaces.* JSON-RPC methods
    commit: 622a3a67
    path: src/reachy_mini_conversation_app/tool_space_routes.py:57-84,176-178
    date: 2026-11-26
  - url: https://github.com/pollen-robotics/reachy_mini_conversation_app
    title: profiles/default/profile.md, default_tools
    commit: 622a3a67
    path: profiles/default/profile.md:3-23
    date: 2026-11-26
  - url: https://pypi.org/project/mcp/2.2.0/
    title: mcp 2.2.0, DEFAULT_CLIENT_INFO and the client_info fallback
    path: mcp/client/session.py:67,424
    date: 2026-11-26
status: current
lastVerified: 2026-11-26
related:
  - reachy-mini-conversation-app-connects-once-per-tool-call
  - hermes-goes-on-the-wire-as-mcp
---

# The Reachy Mini conversation app connects only to Hugging Face Gradio Spaces

At `622a3a67` the app calls a remote MCP server a "Tool Space". A person adds one by slug, with `reachy-mini-conversation-app tool-spaces add owner/name` or the Tools view of the web UI, which calls the `tool_spaces.add` JSON-RPC method. Install looks the Space up with `HfApi.space_info`, refuses one that is disabled or whose SDK is not Gradio, builds `https://<host>/gradio_api/mcp/`, lists the tools and writes them to `installed_tool_spaces.json`. The CLI enables the tools in the active profile unless `--install-only` is given. The UI always installs only, and a person then picks tools per personality.

## What URL can be reached

`validate_space_mcp_url` requires https, a host ending in `.hf.space`, no userinfo, port 443, the path `/gradio_api/mcp/` exactly, and no query or fragment. It runs when the manifest is read and again in `build_remote_client` before every connection, so editing the manifest cannot point the app at another server. The README says the app accepts these endpoints "not arbitrary MCP URLs".

The lower-level `mcp_client.validate_http_mcp_url` is looser: any https URL, or http on `localhost`, `127.0.0.1` or `::1`. The integration test drives `RemoteMcpToolClient` against a local `MCPServer` that way. No configuration path in the app reaches it with such a URL.

## What a default install does

When no manifest exists, four Pollen Robotics Spaces are seeded with static tool specs: search, time, weather and knowledge. Their five tools are in the default profile's `default_tools`. Startup builds the model's tool list from these specs with no MCP traffic. The first request a bundled Space sees is the discover probe in front of a `tools/call`, the first time the model picks one of its tools.

## Credentials

The only header the app sets is `Authorization: Bearer <token>`, with `HF_TOKEN` or the `hf auth login` cache, and only for a Space the Hub reports as private. There is no OAuth flow and no way to add other headers.

## Wire name

`Client(transport)` passes no `client_info`, so mcp 2.2.0 sends its placeholder `mcp` 0.1.0, in the `initialize` request and in the per-request `_meta` on `2026-07-28`. The capability object is empty. A server cannot tell this app from any other caller that leaves the SDK default. Hermes sent the same name until it set `client_info` ([[hermes-goes-on-the-wire-as-mcp]]).

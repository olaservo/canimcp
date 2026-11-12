---
id: fast-agent-never-sends-roots-list-changed
title: fast-agent declares roots.listChanged and never sends the notification
kind: gap
summary: The Python SDK sets `roots.listChanged: true` whenever a client passes a roots callback, with no way to opt out. fast-agent's roots come from static config, so it never sends the notification. Two SDKs, three clients, same gap.
capabilities:
  - roots
  - roots.listChanged
clients:
  - fast-agent
  - opencode
  - goose
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/client_callback_runtime.py, _make_list_roots_callback
    commit: 1b58e686
    path: src/fast_agent/mcp/client_callback_runtime.py:123-137
    date: 2026-08-25
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.0.0, mcp/client/session.py, _build_capabilities
    path: mcp/client/session.py:603-608
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - fast-agent-declares-capabilities-per-server
  - opencode-declares-only-roots
  - goose-sends-removed-roots-notification
---

# fast-agent declares roots.listChanged and never sends the notification

`_make_list_roots_callback` returns `None` unless the server entry lists roots. When it does return a callback, the roots are built from `server_config.roots`, which is read once from config and never changes for the life of the process. Nothing in the repository sends `notifications/roots/list_changed`; the string does not appear.

The declaration is not fast-agent's. The SDK builds it:

```python
roots = (
    # TODO: Should this be based on whether we
    # _will_ send notifications, or only whether
    # they're supported?
    types.RootsCapability(list_changed=True)
    if self._list_roots_callback is not _default_list_roots_callback
    else None
)
```

The TODO is upstream's own. There is no parameter a caller can pass to declare roots without the notification.

## The same shape in the TypeScript SDK

opencode is in the same position for the same reason: it declares roots, answers `roots/list`, holds one root fixed at client creation, and never notifies. goose declares no roots capability at all and sends the notification anyway, which is the mirror image.

So across two reference SDKs and three clients, the `listChanged` flag on `roots` carries no information. A server that reads it and skips its own re-polling on the strength of it will hold a stale root list against every one of them.

## What this means for the rmcp question

The open question in the plan was whether the rmcp roots gap is worth reporting upstream, and the answer had been blocked on finding a caller that both opts into roots and changes them. fast-agent is not that caller either. Three clients now declare `roots.listChanged` and none of them can send it, which makes the flag itself the more useful thing to report: two SDKs derive it from "a callback exists" rather than from "changes will be announced".

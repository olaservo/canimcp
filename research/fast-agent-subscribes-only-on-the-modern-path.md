---
id: fast-agent-subscribes-only-on-the-modern-path
title: fast-agent watches server state through subscriptions/listen, and only there
kind: nuance
summary: On a 2026-07-28 connection fast-agent opens a `subscriptions/listen` stream and refreshes its whole cached view on any event. On the fallback handshake path it acts on `tools/list_changed` and drops the prompts and resources equivalents.
capabilities:
  - tools.listChanged
  - prompts.listChanged
  - resources.listChanged
  - resources.subscribe
clients:
  - fast-agent
specVersions:
  - 2026-07-28
  - 2025-11-25
sources:
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/mcp_connection_manager.py, _subscription_filter and _run_subscription_loop
    commit: 1b58e686
    path: src/fast_agent/mcp/mcp_connection_manager.py:525-596
    date: 2026-08-25
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/client_callback_runtime.py, _handle_message
    commit: 1b58e686
    path: src/fast_agent/mcp/client_callback_runtime.py:252-284
    date: 2026-08-25
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/mcp_aggregator.py, server_notification_callback
    commit: 1b58e686
    path: src/fast_agent/mcp/mcp_aggregator.py:503
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - fast-agent-leads-with-the-modern-discover-probe
---

# fast-agent watches server state through subscriptions/listen, and only there

`_subscription_filter` returns `None` unless `client.discover_result` is set, so the whole subscription loop is gated on the connection having negotiated `2026-07-28`. On that path fast-agent reads the server's `DiscoverResult.capabilities` and asks for exactly what the server offers: `tools_list_changed`, `prompts_list_changed`, `resources_list_changed`, and the resource URIs it currently has materialized if the server advertises `resources.subscribe`.

It then compares what it asked for against the `honored` filter the server returns, and records the connection as `open` or `partial` accordingly. A server that silently accepts a filter it will not serve is visible in `/mcp` rather than mistaken for a quiet one.

The event handling is level-triggered. `handle_subscription_event` ignores which event arrived and re-runs the full attachment refresh. Changing the selected resource set mid-stream is handled by closing and reopening the stream — the loop calls that state `rotating`.

`resources/subscribe` is never called. The URI-level subscription is expressed entirely through the `subscriptions/listen` filter, so on a handshake-era connection fast-agent has no resource subscription at all.

## What the fallback path keeps

On a `2025-11-25` connection the same information arrives as notifications, and fast-agent's `message_handler` sorts them into three buckets:

| Notification | Handled |
|---|---|
| `notifications/progress` | recorded on the transport timeline |
| `notifications/tools/list_changed` | refreshes that server's tools |
| everything else | forwarded to `server_notification_callback` |

`server_notification_callback` is initialized to `None` in the aggregator's constructor and assigned nowhere in `src/`. The only assignment in the repository is in `tests/unit/fast_agent/mcp/test_client_callback_runtime.py`. So on the handshake path `notifications/prompts/list_changed`, `notifications/resources/list_changed`, `notifications/resources/updated` and `notifications/message` are received, matched, and dropped.

The comment beside the attribute describes it as the hook for exactly those — "log messages, resource updates, etc." It is an extension point with no production consumer, not a disabled feature.

## Logging

There is no `logging/setLevel` call anywhere in the repository, and no handler that renders a `notifications/message`. Server log output reaches the dropped bucket above on the legacy path and is not requested at all on the modern one.

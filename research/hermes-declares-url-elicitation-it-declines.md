---
id: hermes-declares-url-elicitation-it-declines
title: Hermes declares URL-mode elicitation and declines every URL-mode request
kind: gap
summary: mcp 2.3.0 declares both `form` and `url` elicitation for any callback, and the probe saw both on the wire from Hermes. The Hermes callback declines every URL-mode request, and an accepted form request returns empty content.
capabilities:
  - elicitation
  - elicitation.url
  - elicitation.form
clients:
  - hermes-agent
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/NousResearch/hermes-agent
    title: tools/mcp_tool_sampling.py, the elicitation callback
    commit: 9dcf7714
    path: tools/mcp_tool_sampling.py:264-333
    date: 2026-11-09
  - url: https://github.com/modelcontextprotocol/python-sdk/tree/v2.3.0
    title: mcp 2.3.0, ClientSession._build_capabilities
    commit: 2118f14f
    path: src/mcp/client/session.py:634-638
    date: 2026-11-09
  - url: https://github.com/olaservo/canimcp
    title: probe run against hermes-agent 0.23.0+689.ga9ff979, initialize request
    path: probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.mirror/wire.jsonl
    date: 2026-11-08
status: current
lastVerified: 2026-11-09
related:
  - fast-agent-never-sends-roots-list-changed
---

# Hermes declares URL-mode elicitation and declines every URL-mode request

In mcp 2.3.0, `ClientSession._build_capabilities` declares elicitation as `ElicitationCapability(form=FormElicitationCapability(), url=UrlElicitationCapability())` whenever the caller passed an elicitation callback. A caller cannot declare form mode alone.

Hermes passes a callback by default, since `elicitation.enabled` defaults to true. The callback's first check is for URL mode, and it declines with a log line saying URL-mode elicitation is not implemented. The probe run against `hermes-agent 0.23.0` recorded the initialize request with `"elicitation":{"form":{},"url":{}}`. A server that trusts the declaration and sends a URL-mode request for an OAuth or payment step gets a decline every time.

Form mode is declared and handled, but only as a consent prompt. The user sees the message and a summary of the requested fields and answers accept, decline or cancel. Accept returns `content={}`, so a server that asked for values receives none.

Both behaviours were already present at `a24c12d1`. The August registry entry recorded URL mode as full, with a browser opened at the URL, and form mode as full. Neither was correct at that commit.

The SDK side matches the `roots.listChanged` problem in `fast-agent-never-sends-roots-list-changed`: the SDK declares a capability on the strength of a callback being present, and the caller has no way to narrow it.

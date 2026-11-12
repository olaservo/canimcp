---
id: fast-agent-declares-capabilities-per-server
title: fast-agent's capability declaration varies from server to server
kind: idiosyncrasy
summary: fast-agent builds its client capability object per connection, from that server's config. Sampling and elicitation are on by default, roots only when the server entry lists them. Two servers in one config file can see two different clients.
capabilities:
  - sampling
  - sampling.tools
  - elicitation
  - elicitation.form
  - elicitation.url
  - roots
clients:
  - fast-agent
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/client_callback_runtime.py, __post_init__ and the callback factories
    commit: 1b58e686
    path: src/fast_agent/mcp/client_callback_runtime.py:93-102,123-164
    date: 2026-08-25
  - url: https://github.com/evalstate/fast-agent
    title: src/fast_agent/mcp/elicitation_factory.py, resolve_elicitation_handler
    commit: 1b58e686
    path: src/fast_agent/mcp/elicitation_factory.py:97-146
    date: 2026-08-25
  - url: https://github.com/modelcontextprotocol/python-sdk
    title: mcp 2.0.0, mcp/client/session.py, _build_capabilities
    path: mcp/client/session.py:576-611
    date: 2026-08-25
status: current
lastVerified: 2026-08-25
related:
  - cline-declares-no-client-capabilities
  - opencode-declares-only-roots
  - utilized-capability-declarations
  - fast-agent-never-sends-roots-list-changed
---

# fast-agent's capability declaration varies from server to server

The SDK derives the capability object from which callbacks were passed to `Client`: a sampling callback produces `sampling`, an elicitation callback produces `elicitation`, a roots callback produces `roots`. fast-agent decides each of those three per connection, in `MCPClientCallbackRuntime.__post_init__`, from that server's config entry.

| Callback | Present when |
|---|---|
| `list_roots_callback` | the server entry has a non-empty `roots` list |
| `sampling_callback` | the server entry has a `sampling` block, or global `auto_sampling` is on |
| `elicitation_callback` | the resolved elicitation mode is not `none` |

`auto_sampling` defaults to `true` and the elicitation mode defaults to `forms`, so a default install declares sampling and elicitation to every server and roots to none of them. Set `elicitation.mode: none` on one server and it sees a client with no elicitation capability while its neighbour still does.

## Where this sits against the other reads

Five clients read, and fast-agent is the first whose declaration is not a fixed property of the client:

| Client | Declares |
|---|---|
| goose | less than it implements |
| Codex CLI | elicitation |
| opencode | roots |
| Cline | nothing |
| fast-agent | sampling and elicitation by default; roots per server; all three configurable per server |

An observed-tier feed keyed on client name will show fast-agent declaring different capability sets in different sessions, and both records will be correct.

## The sub-capabilities are not conditional

Two of the three carry sub-flags that the SDK fills in without asking fast-agent:

- `sampling` is declared as `SamplingCapability(tools=SamplingToolsCapability())`. That claim is real: `sample()` passes `params.tools` to the LLM and returns `CreateMessageResultWithTools` with `stopReason: "toolUse"` when the model calls one.
- `elicitation` is declared with both `form` and `url` sub-capabilities whenever any elicitation callback exists. That claim is also real — the forms handler branches on `ElicitRequestURLParams` — but fast-agent has no way to declare one without the other.
- `roots` is declared with `listChanged: true` unconditionally, and that claim is not real. See [[fast-agent-never-sends-roots-list-changed]].

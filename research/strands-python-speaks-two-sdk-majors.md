---
id: strands-python-speaks-two-sdk-majors
title: One Strands Python release runs on mcp 1.x or 2.x, and the installed major decides the protocol
kind: nuance
summary: strands-agents declares mcp>=1.23.0,<2.4 and commits no lockfile. A fresh install gets mcp 2.3.0 and probes 2026-07-28 first. An environment that holds mcp below 2 runs the same release on the initialize handshake at 2025-11-25.
capabilities:
  - tools.listChanged
  - tasks
  - elicitation
clients:
  - strands
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py/pyproject.toml, the mcp requirement and the test-only 1.x override
    commit: d982a0d4
    path: strands-py/pyproject.toml
    date: 2026-11-16
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py _compat.py, MCP_V2 and the per-line branches
    commit: 8e388465
    path: strands-py/src/strands/tools/mcp/_compat.py:MCP_V2,call_tool
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py/docs/MCP_VERSIONS.md
    commit: 8e388465
    path: strands-py/docs/MCP_VERSIONS.md:MCP 1.x and 2.x Support and Migration
    date: 2026-11-27
  - url: https://github.com/strands-agents/harness-sdk
    title: strands-py mcp_client.py, task gating per SDK line and 1.x cancellation
    commit: 8e388465
    path: strands-py/src/strands/tools/mcp/mcp_client.py:MCPClient._call_tool_direct,MCPClient._should_use_task,MCPClient._require_v2_task_lifecycle
    date: 2026-11-27
  - url: https://pypi.org/project/mcp-types/2.3.0/
    title: mcp-types 2.3.0, protocol version lists
    path: mcp_types/version.py
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/1.30.0/
    title: mcp 1.30.0, LATEST_PROTOCOL_VERSION
    path: mcp/types.py
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - strands-python-and-typescript-clients-differ
  - fast-agent-leads-with-the-modern-discover-probe
  - hermes-leads-with-the-legacy-handshake
  - adk-python-modern-protocol-needs-sdk-2-and-a-flag
---

# One Strands Python release runs on mcp 1.x or 2.x, and the installed major decides the protocol

At `d982a0d4`, `strands-py/pyproject.toml` requires `mcp>=1.23.0,<2.4`. The range covers the 1.x line from 1.23.0 and the 2.x line through 2.3. No `uv.lock`, `poetry.lock` or pinned requirements file for the Python package is committed, so the version is whatever the installing project's resolver picks. On 2026-11-16 the newest release in range is `mcp` 2.3.0, which is also the newest on PyPI, and the newest 1.x release is 1.30.0. The probe's environment, installed on 2026-11-08 from `strands-agents==1.64.0`, resolved 2.3.0.

An August 2026 scan of this repository recorded `mcp>=1.23.0,<2.0.0`, which could not reach `2026-07-28`. That cap is gone from the dependency list. It survives in one place, a hatch test override that applies when `STRANDS_TEST_MCP_V1=1` is set, so one CI job can run the client suite against 1.x. `strands-py/docs/MCP_VERSIONS.md` still gives the range as `<2.2`. The history between those three values was not walked.

## How the code picks a line

`_compat.py` sets `MCP_V2 = hasattr(ClientSession, "discover")` at import, a check for the method with no version string involved. Every difference between the lines is behind that flag.

| | `mcp` 2.x installed | `mcp` 1.x installed |
|---|---|---|
| Negotiation | `negotiate_auto`: `server/discover` at `2026-07-28`, then `initialize` if the server does not answer it as a modern server | `session.initialize()` only |
| Revisions reachable | `2024-11-05` to `2026-07-28` | `2024-11-05` to `2025-11-25` |
| Elicitation during a call | `InputRequiredResult` rounds resolved by Strands' own loop, and server requests on a legacy connection | server-initiated `elicitation/create` requests |
| Tools list-changed | needs a `subscriptions/listen` stream on a modern connection, opened only if `on_tools_changed` is set before `start()` | pushed by the server |
| Tasks | SEP-2663 extension, `2026-07-28` connections only | the 2025-11-25 experimental flow through `session.experimental` |
| Cancelling a call | the SDK dispatcher sends the cancel | Strands sends `notifications/cancelled` with a request id read from a private session field |
| HTTP client | `httpx2`, with an adapter for `httpx.Auth` objects | `httpx` |
| Trace context for in-process servers | left to the SDK | two server-side SDK classes wrapped with `wrapt` |

## What this means for the registry

A `strands-agents` version number does not identify a protocol revision. Two deployments of the same Strands release can lead with different eras, and nothing on the wire says which Strands release either one is unless the application sets `application_name`. The probe's version string, `1.64.0+mcp-2.3.0`, carries both numbers.

The registry entry records the 2.x behaviour at the top level, because that is what a fresh install does. Its `byProtocolVersion` block for `2025-11-25` covers two cases that share a revision and differ in code path: an `mcp` 2.x install whose discover probe fell back, and an `mcp` 1.x install. Tasks are the row where the two differ. On 2.x a `2025-11-25` server's task capability is ignored. On 1.x the legacy flow runs.

The project documents the choice. `MCP_VERSIONS.md` says a fresh install resolves to the newest 2.x release in range and gives `pip install strands-agents "mcp<2"` as the way to stay on 1.x.

## Not checked

Nothing here was run on `mcp` 1.x. The 1.x column was read from the `MCP_V2` false branches and from the `mcp` 1.30.0 wheel's version constant. Releases of `mcp` between 1.23.0 and 1.30.0, and 2.0.0 to 2.2.0, were not read.

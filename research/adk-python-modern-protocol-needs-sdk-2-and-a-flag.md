---
id: adk-python-modern-protocol-needs-sdk-2-and-a-flag
title: ADK Python speaks 2026-07-28 only on MCP SDK 2.x with ADK_ENABLE_MCP_MODERN_PROTOCOL set
kind: nuance
summary: At c6586f19 a default ADK install runs the initialize handshake at 2025-11-25. server/discover needs MCP SDK 2.x and the default-off ADK_ENABLE_MCP_MODERN_PROTOCOL switch. mcp is an optional extra, and four of ADK's five constraints files pin SDK 1.28.1.
capabilities:
  - protocolVersions
clients:
  - adk-python
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/google/adk-python
    title: src/google/adk/tools/mcp_tool/session_context.py, _CLIENT_INFO and _connect
    commit: 03725e8c
    path: src/google/adk/tools/mcp_tool/session_context.py:_connect,_warn_probe_unavailable
    date: 2026-11-27
  - url: https://github.com/google/adk-python
    title: src/google/adk/features/_feature_registry.py, _MCP_MODERN_PROTOCOL and is_feature_enabled
    commit: c6586f19
    path: src/google/adk/features/_feature_registry.py:FeatureName,is_feature_enabled
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: src/google/adk/dependencies/_mcp.py, SDK major detection and the negotiate_auto import
    commit: 03725e8c
    path: src/google/adk/dependencies/_mcp.py
    date: 2026-11-27
  - url: https://github.com/google/adk-python
    title: pyproject.toml, base dependencies and the all, mcp and test extras
    commit: c6586f19
    path: pyproject.toml
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: constraints-3.13.txt, the mcp pin
    commit: c6586f19
    path: constraints-3.13.txt
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: constraints-3.15.txt, the mcp and mcp-types pins
    commit: c6586f19
    path: constraints-3.15.txt
    date: 2026-11-16
  - url: https://github.com/google/adk-python
    title: scripts/update_constraints.sh, the existing file passed back as a constraint
    commit: 03725e8c
    path: scripts/update_constraints.sh
    date: 2026-11-27
  - url: https://github.com/google/adk-python
    title: README.md, the recommended install with a constraints file
    commit: 03725e8c
    path: README.md:For example,for Python 3.11
    date: 2026-11-27
  - url: https://pypi.org/project/mcp/2.3.0/
    title: mcp 2.3.0, negotiate_auto and ClientSession.initialize
    path: mcp/client/_probe.py, mcp/client/session.py
    date: 2026-11-16
  - url: https://pypi.org/project/mcp-types/2.3.0/
    title: mcp-types 2.3.0, the handshake and modern version tables
    path: mcp_types/version.py
    date: 2026-11-16
  - url: https://pypi.org/project/mcp/1.28.1/
    title: mcp 1.28.1, LATEST_PROTOCOL_VERSION and ClientSession.initialize
    path: mcp/types.py, mcp/client/session.py
    date: 2026-11-16
status: current
lastVerified: 2026-11-16
related:
  - hermes-leads-with-the-legacy-handshake
  - fast-agent-leads-with-the-modern-discover-probe
  - codex-defaults-to-2025-06-18
  - adk-python-declares-no-client-capabilities-by-default
  - strands-python-speaks-two-sdk-majors
---

# ADK Python speaks 2026-07-28 only on MCP SDK 2.x with ADK_ENABLE_MCP_MODERN_PROTOCOL set

Read at `c6586f19`, where `src/google/adk/version.py` says 2.14.1.

## The connect function

Every MCP client path in ADK builds its `ClientSession` in `SessionContext._run` and then calls `_connect`. `_connect` has three branches. With `FeatureName._MCP_MODERN_PROTOCOL` off it calls `session.initialize()`. With the flag on and no `negotiate_auto` available it logs one warning and calls `session.initialize()`. With the flag on and `negotiate_auto` available it calls `negotiate_auto(session)`.

The flag is registered as `FeatureStage.EXPERIMENTAL, default_on=False`. `is_feature_enabled` checks a programmatic override first, then `ADK_ENABLE_MCP_MODERN_PROTOCOL`, then `ADK_DISABLE_MCP_MODERN_PROTOCOL`, then the registry default. The values `1`, `true`, `yes` and `on` enable it. The enum member has a leading underscore, and the comment beside it says it is off because it changes wire behaviour. `_connect` is its only reader under `src/`. The switch covers the whole process. There is no per-toolset setting and no setting that refuses the handshake fallback.

The full variable name is spelled out in one file in the repo, in a comment in the feature registry. A search of `docs/`, `README.md` and `CHANGELOG.md` for it finds nothing. The changelog lists the feature under 2.11.0 (2026-10-01) as an opt-in path, from commit `e738c26f`, whose message names the variable.

## What each setting sends

| | Flag off (default) | Flag on, SDK 2.x |
|---|---|---|
| First request | `initialize` offering `2025-11-25` | `server/discover` stamped `2026-07-28` |
| Fallback | none | `initialize` at `2025-11-25`, on any `MCPError` except a -32022 that lists only modern versions |
| Identity | `clientInfo` once, in `initialize` | `clientInfo` and `clientCapabilities` in the `_meta` of every request |
| Revisions the server can pick | `2024-11-05` to `2025-11-25` | `2026-07-28`, or the four handshake revisions after a fallback |

The revision strings are the SDK's. ADK names none. `mcp` 2.3.0 offers `LATEST_HANDSHAKE_VERSION` in `initialize`, and `mcp` 1.28.1 offers `LATEST_PROTOCOL_VERSION`. Both are `2025-11-25`. `negotiate_auto` is the private `mcp.client._probe.negotiate_auto`. ADK imports it in its own `try` block, so if that module moves the SDK is still detected as 2.x and connections use the handshake.

The probe's records agree with this read. Its default runs at 2.14.0 captured `initialize` at `2025-11-25` with `clientInfo.name` `google-adk`. Its `modern` runs, with the variable set, captured `server/discover` first with the same name in `_meta`.

## Which SDK an install gets

`mcp>=1.24,<3` is declared in the `mcp`, `all` and `test` extras. It is absent from the base `dependencies`, so `pip install google-adk` installs no MCP SDK, and importing `google.adk.tools.mcp_tool` then logs "MCP Tool is not installed" at debug level and exports nothing.

The repo commits no lockfile. It commits five `uv pip compile --all-extras` outputs, `constraints-3.11.txt` to `constraints-3.15.txt`, and the README recommends installing with the one for your Python version. The files for Python 3.11, 3.12, 3.13 and 3.14 pin `mcp==1.28.1`. The file for 3.15 pins `mcp==2.3.0` and `mcp-types==2.3.0`. On SDK 1.28.1 `negotiate_auto` is `None`, so the flag does nothing there except log the warning.

`scripts/update_constraints.sh` passes each existing file back to uv as a constraint, so an existing pin stays while it satisfies the declared range. The 3.15 file was first generated in `75aef1ec` on 2026-10-12. The range was widened to admit 2.x in `d64dcfaa` on 2026-09-11.

An install with no constraints file takes whatever pip resolves inside the range. The probe's install of `google-adk[mcp]==2.14.0` resolved `mcp` 2.3.0 on 2026-11-08, and 2.3.0 was the newest `mcp` on PyPI on 2026-11-16.

The revision an ADK agent can reach therefore depends on the SDK major the install resolved and on an environment variable.

## Other behaviour that follows the SDK major

`IS_MCP_SDK_V2` in `dependencies/_mcp.py` also selects `httpx2` as the HTTP library for the MCP client on 2.x and `httpx` on 1.x, turns off the OpenTelemetry httpx instrumentor for MCP calls, passes the session read timeout as a float where 1.x takes a `timedelta`, and dumps SDK models by alias so that result keys keep their 1.x camelCase names.

## Not checked

The 1.x paths were read in the `mcp` 1.28.1 wheel for the version constants and `initialize` only. Nothing here was run. What happens to a server request for input on the modern path is in [[adk-python-declares-no-client-capabilities-by-default]].

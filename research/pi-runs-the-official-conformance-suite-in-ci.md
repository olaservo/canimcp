---
id: pi-runs-the-official-conformance-suite-in-ci
title: pi runs the official client conformance suite in CI against a committed baseline
kind: nuance
summary: pi's CI runs the client scenarios of @modelcontextprotocol/conformance 0.2.0-alpha.11 at three revisions and compares each check with baseline.json. Three scenarios are baselined as failing, stdio is not exercised, and 2026-07-28 is left out as not implemented.
capabilities:
  - elicitation
  - authentication.oauth
  - transports.streamableHttp
clients:
  - pi
specVersions:
  - 2025-03-26
  - 2025-06-18
  - 2025-11-25
sources:
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/test/mcp-conformance/README.md
    commit: ede8bdca
    path: packages/coding-agent/test/mcp-conformance/README.md:MCP client conformance
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/test/mcp-conformance/baseline.json
    commit: ede8bdca
    path: packages/coding-agent/test/mcp-conformance/baseline.json
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/test/mcp-conformance/run.ts, the MODES list
    commit: ede8bdca
    path: packages/coding-agent/test/mcp-conformance/run.ts:MODES
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/coding-agent/test/mcp-conformance/client.ts, the code under test
    commit: ede8bdca
    path: packages/coding-agent/test/mcp-conformance/client.ts
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: .github/workflows/ci.yml, the mcp-conformance job
    commit: ede8bdca
    path: .github/workflows/ci.yml
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/mcp/src/protocol/types.ts, SUPPORTED_PROTOCOL_VERSIONS
    commit: ede8bdca
    path: packages/mcp/src/protocol/types.ts:LATEST_PROTOCOL_VERSION,SUPPORTED_PROTOCOL_VERSIONS,SupportedProtocolVersion
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi
    title: packages/mcp/src/client.ts, the rejection of a server version outside the list
    commit: ede8bdca
    path: packages/mcp/src/client.ts:McpClient.connect
    date: 2026-11-27
  - url: https://github.com/earendil-works/pi/commit/a4715ec9bffbfcb8a32a1a4100dcfd06c12c93e4
    title: test(coding-agent) run the official MCP client conformance suite in CI, first released in v1.0.0
    commit: a4715ec9
    date: 2026-11-16
status: current
lastVerified: 2026-11-27
related:
  - pi-dropped-no-mcp-and-shipped-its-own-client
  - pi-uses-a-per-server-client-id-document-without-iss
---

# pi runs the official client conformance suite in CI against a committed baseline

Two days after MCP support landed, `a4715ec9` (2026-10-01) added a CI job that runs the official conformance suite's client scenarios against pi. At `07ece436` the job pins `@modelcontextprotocol/conformance@0.2.0-alpha.11`.

The harness does not drive the `pi` binary. `client.ts` builds the same `McpServerConnection` that a `url` entry in `mcp.json` gets, calls the scenario's tool, and runs `signInMcpServer` with a simulated browser that fetches the authorization URL and delivers the redirect to pi's loopback callback server. Every check the suite reports is compared with `baseline.json`. The run fails when a baselined pass fails or goes missing, when a check fails that the baseline does not list, or when a baselined scenario did not run.

## What the baseline records

| Revision | Scenarios | Baselined failures |
|---|---|---|
| `2025-03-26` | 2, both OAuth back-compat | none |
| `2025-06-18` | 5 | none |
| `2025-11-25` | 19 | 3 |

The three at `2025-11-25`:

- `elicitation-sep1034-client-defaults` fails all six elicitation checks. The README gives the reason as "pi does not support elicitation".
- `auth/basic-cimd` fails `cimd-client-id-used`, because pi sends its own document URL on pi.dev and the suite expects its own.
- `auth/scope-retry-limit` fails the harness's own `pi-client` check by design: the scenario's server never accepts the granted scope, and the client gives up.

The passing set at `2025-11-25` includes `initialize`, `tools_call`, `sse-retry` with its Last-Event-ID and retry-timing checks, four metadata discovery variants, the scope scenarios including step-up, the three token endpoint auth methods, pre-registration, and `json-schema-2020-12-preservation`.

## What it does not cover

- stdio. The harness uses the HTTP connection path only.
- `2024-11-05`. The README says pi negotiates three revisions and `run.ts` lists three, while `SUPPORTED_PROTOCOL_VERSIONS` accepts four.
- `2026-07-28`. The README says "2026-07-28 is not covered: it is a stateless protocol pi does not implement". The client throws on an `initialize` result whose version is outside its list, and it never sends `server/discover`.
- Resources, logging and roots. No scenario in the baseline names them.

For this registry the baseline is a vendor-run record at a known suite version, keyed by scenario and check. A refresh can diff `baseline.json` between two commits to see which checks moved.

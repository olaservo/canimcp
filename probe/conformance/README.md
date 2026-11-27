# Conformance suite as verified evidence (prototype)

This folder runs the client scenarios of the official MCP conformance suite (`@modelcontextprotocol/conformance` 0.2.0-alpha.12, npm gitHead `f44482b`) against clients the probe knows, maps every check to a canimcp capability id, and writes a preview of the `verified` evidence a run would add to `data/verified/<client>.json`. Nothing here is merged into `data/` yet.

Two ways in:

- **SDK clients** run the SDK's own everything-client. For `ts-sdk-client` that is `everything-client/`, the TypeScript SDK's `test/conformance/src` at the `@modelcontextprotocol/client@2.4.0` tag (`951fe56`), which pins this suite version. The conformance repo's own `examples/clients/typescript/everything-client.ts` is built on the 1.x `@modelcontextprotocol/sdk` and imports suite internals, so it does not fit 2.4.0.
- **Hosts and frameworks** run through `bridge/host-bridge.mjs <adapter>`, which hands the scenario URL to an existing probe adapter (`probe/hosts/<adapter>/adapter.ts`) and drives it with the probe's mock model and a scenario-aware script (`bridge/call-every-tool.mjs`).

## Layout

```
run.mjs                       runs every client scenario at every spec version it applies to; writes results/<client>/<runId>/runs.json
summarize.mjs                 runs.json + mapping.json -> summary/<client>.json and ingest-preview/<client>.json (validated with the repo schemas)
mapping.json                  check id -> capability id rules, scenario defaults, proposed ids, client capabilities no scenario covers
build.mjs                     bundles the everything-client to dist/everything-client.mjs (no tsx at run time, runs under WSL)
everything-client/            the TypeScript SDK's conformance client at 951fe56, plus canimcp.patch
bridge/host-bridge.mjs        conformance --command for probe adapters
bridge/call-every-tool.mjs    mock-model script: plans tool calls from what the host offers and the suite's context
bridge/profiles.mjs           per-adapter settings: default config, client timeout, script profile (CONF_PROFILE)
bridge/adapters/<id>.mjs      conformance-only configs added to an adapter: `answer` for mastra, fast-agent, strands, agent-framework and adk-python (plus adk-python `answer-modern`)
summary/<client>.json         committed results summary per client
ingest-preview/<client>.json  the proposed data/verified overlay, not merged
results/                      raw checks.json, cli.log and bridge captures (gitignored)
```

## Running

```
cd probe/conformance
npm install
node build.mjs
npm run build --prefix ..          # the bridge loads the compiled probe from probe/dist
node run.mjs --client ts-sdk-client --command "node dist/everything-client.mjs" --concurrency 4
node run.mjs --client mastra --command "node bridge/host-bridge.mjs mastra" --concurrency 3 --timeout 60000
node summarize.mjs --client ts-sdk-client --client-version 2.4.0 --config default --harness "ts-sdk everything-client 951fe56 + canimcp.patch"
```

`run.mjs` lists the client scenarios with `conformance list --client` and runs each one with `--scenario <s> --spec-version <v>` once per version in its applicability tags. Extension scenarios have no tags, so they run at 2025-11-25 and at 2026-07-28 with `--force`, which matches the SDK's own CI legs. Options: `--only a,b`, `--exclude auth/` (scenario name prefixes; this one gives the no-auth set of 15 scored runs plus 8 skills runs), `--versions v1,v2`, `--concurrency`, `--timeout`. The suite splits `--command` on spaces and runs it through a shell, so no path in it may contain a space, and the command runs with this folder as its working directory. Python adapters need `BRIDGE_TIMEOUT_MS=80000` and `--timeout 100000` for their cold start.

The no-auth set for the bridged clients, as run on 2026-11-27 (Windows unless noted):

```
node run.mjs --client <id> --command "node bridge/host-bridge.mjs <id>" --exclude auth/ --concurrency 2 --timeout 110000
node run.mjs --client eve --command "node bridge/host-bridge.mjs eve" --exclude auth/ --concurrency 1 --timeout 90000
node run.mjs --client adk-python-modern --command "node bridge/host-bridge.mjs adk-python modern" --exclude auth/ --versions 2026-07-28 --timeout 110000
node run.mjs --client mastra-answer --command "node bridge/host-bridge.mjs mastra answer" --exclude auth/ --timeout 60000
node run.mjs --client fast-agent-answer --command "node bridge/host-bridge.mjs fast-agent answer" --exclude auth/ --timeout 110000
# 2026-11-27, later: answer configs for three Python frameworks, and hermes with discover first
node run.mjs --client <id>-answer --command "node bridge/host-bridge.mjs <id> answer" --exclude auth/ --concurrency 2 --timeout 110000   # strands, agent-framework, adk-python
node run.mjs --client adk-python-modern-answer --command "node bridge/host-bridge.mjs adk-python answer-modern" --exclude auth/ --versions 2026-07-28 --timeout 110000
node run.mjs --client hermes-agent-stateless --command "node bridge/host-bridge.mjs hermes-agent tool-search-off-stateless" --exclude auth/ --concurrency 2 --timeout 110000
# fx and libfx, from WSL (see below):
node run.mjs --client fx --command "node bridge/host-bridge.mjs fx" --exclude auth/ --concurrency 2 --timeout 90000
node summarize.mjs --client mastra-answer --registry-id mastra --client-version <v> --config answer --harness "..."
```

`<id>` is one of strands, agent-framework, adk-python, crewai, deepagents, hermes-agent, cline, pi, libfx. `bridge/profiles.mjs` picks each adapter's config and client timeout (Python adapters get 80 s), so the command needs no config argument; a second argument overrides it. A run under a different `--client` id (`mastra-answer`) keeps the default-config summary; `--registry-id` names the registry entry in the ingest preview. The eve runs above used concurrency 1. Two `eve dev` servers at once exited early ("Development server exited unexpectedly") because eve compiles the agent into `<app>/node_modules/.cache/eve/authored-modules`, and every app's `node_modules` was a junction to the one install in `hosts/eve`. `hosts/eve/agent.mjs` now gives each app its own `node_modules` with a junction per package, and six runs at concurrency 3 completed with the same results as the serial run.

On Windows, run SDK clients from WSL: `wsl -d Ubuntu -e bash -lc 'cd /mnt/c/.../probe/conformance && export PATH=$HOME/node/current/bin:$PATH && node run.mjs ...'`. Node 24.19.0 on Windows aborts at `process.exit` with `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c` (exit code 3221226505) after every 2026-07-28 run of the everything-client, after all checks have passed. The same bundle exits 0 under WSL. The suite counts the exit code, so on Windows those runs read as failures.

## The patch

`everything-client/canimcp.patch` changes four lines. The handlers for `auth/pre-registration`, `auth/client-credentials-jwt`, `auth/client-credentials-basic` and `auth/enterprise-managed-authorization` construct `Client` without `versionNegotiation`, so at 2026-07-28 the client completes the OAuth flow, then sends `initialize` and the stateless mock rejects it with `-32020 Missing MCP-Protocol-Version header`. The checks the suite has recorded by then all pass, and the client exits 1. The patch adds `versionNegotiation: { mode: 'auto' }` under `isModernConformanceRun()`, as the file's other 2026-capable handlers do. With it the four pass at 2026-07-28 and emit one or two more checks each (pre-registration 10 to 12). The SDK's own 2026 leg (`--suite all --spec-version 2026-07-28 --expected-failures`, empty baseline) scores suite runs by check status, so the unpatched exit does not show there.

## Results: TypeScript SDK client 2.4.0

79 runs over 48 scenarios, WSL Ubuntu, Node 24.19.0, 2026-11-27: 77 pass. The two failures are `auth/wif-jwt-bearer` at both versions (`wif-assertion-verified`: the client never sends the JWT-bearer token request), which the SDK baselines as an expected failure. Per scenario and capability: `summary/ts-sdk-client.json`.

## Results: the bridge

`mastra` (`@mastra/mcp` 2.9.0-alpha.1 on `@modelcontextprotocol/client` 2.4.0), all 79 runs, Windows: 17 pass. `initialize`, `tools_call` (three versions), `sse-retry`, `request-metadata`, `http-standard-headers`, `http-custom-headers`, `http-invalid-tool-headers` and `json-schema-ref-no-deref` pass. `json-schema-2020-12-preservation` fails on what the model is shown: `$schema` arrives as draft-07 and `allOf` is missing at both versions (the suite scores the `allOf` check only at 2026-07-28). The echo is built from the tool parameters in the mock's chat-completions request, so this is the schema the model received. The elicitation scenario fails because the adapter's agent sets no elicitation handler (`-32601`), every auth scenario fails because it sets no auth provider, MRTR fails three of five checks with `SdkError` on each tool call (its input-required results embed an elicitation request), and the eight skills runs record no checks.

`fast-agent` 0.10.53, 12 scenarios, Windows: 13 of 17 runs pass, including `json-schema-2020-12-preservation` at both versions. Elicitation fails because fast-agent opens an interactive form (`No Windows console found`), MRTR fails three of five checks, and `auth/metadata-default` gets through discovery and dynamic registration (3 and 4 checks pass) and then times out waiting for a browser.

## Results: the no-auth set across the bridge, 2026-11-27

Suite 0.2.0-alpha.12, no-auth scenarios: 15 scored runs (11 scenarios across their spec versions) and 8 skills runs. "Runs pass" counts scored runs only. Every client recorded no signal on the 8 skills runs except fast-agent `answer` (below). Per run and capability: `summary/<client>.json`.

| Client (config) | Runs pass | Checks pass/fail | Fails because |
|---|---|---|---|
| strands 1.64.0, mcp 2.3.0 | 13/15 | 70/9 | no elicitation handler (`-32600`); MRTR 2/5 |
| agent-framework 1.25.0 | 12/15 | 73/10 | no elicitation handler; MRTR 2/5; `omit-null`: the framework rejects the model's `verbose: null` ("Argument parsing failed") before calling the tool |
| adk-python 2.14.0 (default) | 7/15 | 32/26 | handshake only, so every 2026-07-28 run fails; no elicitation |
| adk-python 2.14.0 (`modern`, 2026-07-28 only) | 7/8 | 52/3 | MRTR 2/5: "Server returned InputRequiredResult; pass allow_input_required=True" |
| cline 3.0.74 | 6/15 | 31/27 | no 2026-07-28; elicitation `-32601`; drops `$schema` from the schema the model sees |
| pi 1.5.0 (`default`, direct exposure) | 7/15 | 32/26 | no 2026-07-28; elicitation `-32601` |
| deepagents 0.7.34 + code 0.2.5 | 5/15 | 30/27 | no 2026-07-28; elicitation `-32603` "no back-channel for server-initiated requests"; inlines `$ref`, so `$defs` is gone |
| crewai 1.15.37 | 5/15 | 26/29 | no 2026-07-28; no elicitation; drops `$schema` and `$defs`; fetches a network `$ref` (`json-schema-ref-no-deref`) |
| hermes-agent a9ff979 (`tool-search-off`) | 9/15 | 65/16 | `protocol: auto` gives up on the 2026-07-28 servers that answer `initialize` with `-32020`; declines form elicitation; MRTR 1/5: no `allow_input_required`, and after three failed calls hermes marks the server unreachable and skips the fourth |
| eve 1.0.0-rc.6 | 8/15 | 54/22 | no elicitation handler; schema checks see a reconstruction (below); `omit-null` rejected by eve's input validation; no reconnect after an SSE stream closes (`sse-retry` timed out) |
| fx 0.0.16 (`default`, WSL) | 13/15 | 71/9 | declares no elicitation; MRTR 2/5 ("the server asked for input fx can't give") |
| libfx eab1401 (WSL) | 7/15 | 32/26 | no 2026-07-28 (legacy negotiation); elicitation `-32601` |
| mastra (`answer`) | 13/15 | 75/3 | `json-schema-2020-12-preservation` at both versions, as before; elicitation 5/5 and MRTR 5/5 now pass |
| fast-agent 0.10.53 (`answer`) | 14/15 | 79/5 incl. skills | elicitation defaults 0/5: the handler accepts with `{}` and nothing fills the defaults. Skills: no-prefetch passes at both versions; the six verify runs record "not testable" FAILUREs because the model never loads a skill, which the summary now lists under `notTestable` |
| strands (`answer`) | 14/15 | 74/5 | elicitation defaults 0/5, as fast-agent; MRTR 5/5 |
| agent-framework (`answer`) | 13/15 | 76/6 | elicitation defaults 0/5; `omit-null` as default; MRTR 5/5 |
| adk-python (`answer`) | 7/15 | 32/25 | handshake only, as default; elicitation answered, defaults 0/5 |
| adk-python (`answer-modern`, 2026-07-28 only) | 7/8 | 53/3 | MRTR 2/5, as `modern`: ADK passes no `allow_input_required` |
| hermes-agent a9ff979 (`tool-search-off-stateless`) | 12/15 | 75/11 | declines form elicitation; MRTR 1/5, as `tool-search-off`; drops `allOf` and the nested `anyOf` from the schema the model sees (2026-07-28 only, where the suite scores it) |

Mastra `answer` passes the elicitation scenario with `capabilities.elicitation.form.applyDefaults: true`, as the SDK's own conformance client sets it. With Mastra's stock `{ form: {} }` (config `answer-no-defaults`) the five default checks fail. The Python SDK has no equivalent option, so fast-agent `answer` fails them, and so do the other Python answer configs.

The Python answer configs use each framework's own API for the handler, with packages as installed in each host's `.venv`:

- strands: `MCPClient(elicitation_callback=...)` (`strands/tools/mcp/mcp_client.py:318`), set by `PROBE_CONFIG=answer` in `hosts/strands/agent.py`. Strands already passes `allow_input_required=True` on tool calls under mcp 2.x (`strands/tools/mcp/_compat.py:177`) and answers embedded requests with the same callback, so the handler alone turns MRTR on.
- agent-framework: no elicitation option of its own; the client it builds sets none (`agent_framework/_mcp.py:2565`). `hosts/agent-framework/conformance_agent.py` hands `MCPStreamableHTTPTool(mcp_client=...)` an `mcp.Client` it built with `elicitation_callback`. `mcp.Client.call_tool` drives the input-required loop itself (`mcp/client/client.py:756`), so MRTR passes too.
- adk-python: `McpToolset(elicitation_callback=...)` (`google/adk/tools/mcp_tool/mcp_toolset.py:178`), set by `PROBE_ELICIT=accept` in `hosts/adk-python/agent.py`. ADK calls tools without `allow_input_required` (`mcp_tool.py:731`), so MRTR still fails with "Server returned InputRequiredResult; pass allow_input_required=True".
- crewai 1.15.37 has no config. Every session it builds is `ClientSession(read, write)` with no callbacks (`crewai/mcp/client.py:194`, `crewai/mcp/tool_resolver.py:667`, `crewai/tools/mcp_tool_wrapper.py:176`, and `mcpadapt/core.py:130` under `crewai_tools.MCPServerAdapter`), so the SDK's default answers `-32600` "Elicitation not supported" and elicitation is not declared. Same on crewai main at `77237aec`. Its SDK is mcp 1.30.0, which has no 2026-07-28 support.
- deepagents-code 0.2.5 has no config. It mounts each server through a FastMCP `ProxyClient` pinned to `mode="legacy"` (`fastmcp/server/providers/proxy.py:1742`) on an in-process router, and gives the tools a bare `FastMCPClient(router)` (`deepagents_code/mcp_tools.py:1954`). That client negotiates 2026-07-28 over the in-memory transport, which has no back-channel, so a forwarded `elicitation/create` fails with `NoBackChannelError` (`-32603`). Setting a callback on the router client changes nothing. Setting the client's `mode` to `legacy` as well makes the handler answer (1 pass, 5 default checks fail), but that edits an object the loader builds internally, so it is not a config here. FastMCP's own `MCPConfig` proxies avoid this with `transport.legacy_only = True` (`fastmcp/mcp_config.py:167`).

Findings from these runs, with the evidence under `results/` (gitignored):

- crewai 1.15.37 dereferences a network `$ref` in a tool `inputSchema`. The canary URL was fetched once with `python-requests/2.34.2`, and the fetched schema reached the model inlined. `crewai/utilities/pydantic_schema_utils.py:866` calls `jsonref.replace_refs(json_schema, proxies=False)` with the default loader; the same line is on crewai main at `77237aec`. Check `sep-2106-no-network-ref-deref`, `results/crewai/2026-11-27T14-14-24-915Z/2026-07-28/json-schema-ref-no-deref/`.
- The Python SDK (mcp and mcp_types 2.3.0) rejects a 2026-07-28 `CallToolResult` without `resultType` ("CallToolResult.resultType Field required"); `mcp_types/_v2026_07_28` declares it required. Observed through strands, adk-python `modern`, fast-agent `answer`, hermes-agent and agent-framework ("Function failed"). The suite still scores `sep-2322-default-result-type-complete` SUCCESS in each, since the check only records that the client did not retry. It is an absence check, so those runs give `protocol.resultType` no status (see Mapping). Evidence: the `test_mrtr_no_result_type` tool result in `results/bridge/<client>/sep-2322-client-request-state-*/model.jsonl`.
- hermes-agent `protocol: auto` falls back to `server/discover` only on `-32022` or `-32601`. The suite's 2026-07-28 `tools_call` and `json-schema-2020-12-preservation` servers answer a header-less `initialize` with HTTP 400 `-32020` "Missing MCP-Protocol-Version header", so hermes ends up with no tools. The `request-metadata` server answers `-32022`, the MRTR server `-32601`, and the header scenarios' servers answer `initialize` itself; hermes gets through those. With `protocol: stateless` (config `tool-search-off-stateless`), hermes leads with `server/discover`, and the 2026-07-28 `tools_call`, `request-metadata` and `http-standard-headers` runs pass. `results/hermes-agent-stateless/2026-11-27T16-02-52-701Z/`.
- hermes-agent drops `allOf` and the nested `anyOf` from the tool schema the model is shown (`sep-2106-client-composition-keywords-preserved`: "allOf missing from echoed inputSchema"). The suite scores the check at 2026-07-28 only, which hermes reached only with `stateless`; mastra fails the same check. `results/hermes-agent-stateless/2026-11-27T16-02-52-701Z/2026-07-28/json-schema-2020-12-preservation/`. Where hermes rewrites the schema was not traced.
- eve does not reconnect after the server closes a `tools/call` SSE stream, and the run times out. The suite scores `client-sse-graceful-reconnect` SUCCESS and `client-sse-retry-timing` FAILURE at -98 ms because it counts the standalone GET eve opened before the close. `results/eve/2026-11-27T14-14-24-967Z/2025-11-25/sse-retry/`.

How the harness reaches each client:

- strands, agent-framework, adk-python and crewai offer the model nothing but the MCP tools, under bare or URL-derived names; their profile is `mcp: 'all'`. Every other client prefixes the server name `probe`, and the script calls only tools whose name carries it, so it never calls a host's built-in tools.
- cline loops on a plain text reply, so the script ends the run with `submit_and_exit` (profile `finish`).
- hermes-agent runs `tool-search-off`. The stock config defers MCP tools behind `tool_search`.
- eve lists no MCP tool to the model. The script calls `eve__search` with `probe__`, reads the tool names and TypeScript signatures from the result, builds arguments from the signatures, and calls each tool through `eve__tool`. The model never sees a JSON Schema, so the echo in `json-schema-2020-12-preservation` is rebuilt from the signature, and its `$schema`, `$defs` and `additionalProperties` failures describe eve's model-facing format.
- fx 0.0.16 defers MCP tools behind `capability_search` and `mcp_select_tool`. The search is lexical, so the script searches server `probe` with the words of every no-auth scenario's tool names, selects each quoted name, then calls the tools fx offers. fx also skips a `url` server entry without `"type": "http"`. `hosts/fx/adapter.ts` writes it for every HTTP run. The first run used a conformance-only `http` config for this; a re-run with the default config on 2026-11-27 gave the same 13/15 and 71/9.
- mastra `answer` runs `hosts/mastra/conformance-agent.mjs`: the adapter's agent plus an `inputRequests` handler that accepts with empty content. fast-agent `answer` runs `hosts/fast-agent/conformance_agent.py`, a FastAgent app with a decorator-supplied `elicitation_handler` that does the same; `fast-agent go` offers only an interactive form or auto-cancel.

## What blocks the bridge for other clients

- codex, goose and opencode run in the Docker image, which has no network beyond loopback, so the suite has to run inside the container with the bridge. fx and libfx need WSL.
- Elicitation answer configs exist for mastra, fast-agent, strands, agent-framework and adk-python. crewai and deepagents give an application no way to answer (above); cline, pi, eve and libfx answer `-32601`; hermes declines; fx declares none.
- The stock configs of hermes-agent (tool search), pi (`codemode`) and opencode (Code Mode) hide MCP tools from the model and are not run here.
- Clients without 2026-07-28 support (adk-python default, cline, pi, deepagents, crewai, libfx) fail every 2026-07-28 scenario at the handshake, which hides what those scenarios test.
- Auth needs a headless user agent. Frameworks need an OAuth provider wired into their script that follows the authorization redirect, as the SDK's `ConformanceOAuthProvider` does. Hosts open a browser or print the URL and wait on a local callback; a `BROWSER`/`xdg-open` shim or a bridge that tails client output and fetches the URL would complete the flow, since the suite's authorization endpoint redirects without a login page. Hosts that keep tokens in a keyring or the home directory also need a fresh store per run. Client-credentials, enterprise-managed authorization, DPoP and WIF need application code most hosts do not expose.
- `sep-2322-client-request-state` returns input-required results that embed an elicitation request, so it needs the same elicitation answer.
- The skills scenarios record nothing unless the client implements the skills extension client side.
- Scenarios are HTTP only. eve already declares `transports: ['http']`; a stdio-only client cannot run them.

## Mapping

`mapping.json` maps by check id, first match wins, and falls back to the scenario's default. Ids the vocabulary lacks are listed under `proposed`: `protocol.requestMeta` (SEP-2575 per-request `_meta`), `authentication.oauth.scopes`, `authentication.oauth.refreshTokens` (SEP-2207), `authentication.oauth.dpop` (SEP-1932), `authentication.oauth.workloadIdentityFederation` (SEP-1933), and aliases for the two auth extensions that have none in `extensions.known`. `wire-schema-valid` is kept in the record and mapped to nothing. `jsonSchemaDialect` is a top-level section of `spec-versions.json`, not a `capabilities` key.

Two kinds of check do not count as evidence of support:

- Absence checks (`absence` in `mapping.json`) pass when the client does nothing: `sep-2243-x-mcp-header-*` (the client did not call a tool with an invalid header definition), `sep-2640-host-no-prefetch`, `sep-2106-no-network-ref-deref`, and `sep-2322-default-result-type-complete` (the client did not retry, which a Python SDK client that rejects the result also satisfies). Their failures count. Their passes count only beside a passing check of the same capability in the same run that is not an absence check.
- Checks the suite emits as FAILURE with "Not testable:" (the client never reached the behaviour, such as the skills verify checks when no skill is loaded, or the issuer checks when the client never got through OAuth) are left out of the evidence and listed under `notTestable` in the summary.

No client scenario in this suite version exercises sampling, roots, roots.listChanged, tools.listChanged, resources, prompts, completions, logging, tasks, elicitation.url, stdio, or anything about tool results reaching the model. The `input-required-result-*` scenarios that involve sampling and roots are server scenarios. `notCovered` in `mapping.json` has the full list.

## Proposed ingest

One Evidence record per (capability, scenario, spec version, client version, config), in the existing schema, so `ingest-preview/<client>.json` validates against `schema/verified-evidence.schema.json` today:

- `tier: verified`, `source: modelcontextprotocol/conformance`, `url` the suite tree at its commit, `date`, `at` the spec version the scenario ran at, `scenario: conformance/<scenario>`, `clientVersion`, `config`, `artifact` the run directory.
- `status`: `full` when every check mapped to that capability passed and the suite accepted the client's exit, `partial` when some passed, and omitted when none did or when only absence checks did. A run with no passing check cannot tell a missing feature from an adapter that does not configure it (mastra's auth runs), so it carries the failure in `note` and leaves the status to the editor.
- `note`: `conformance <scenario> at <version>: n/m checks pass; failed <ids>`.
- `run`: suite, suite version, spec version, forced, harness, platform, exit codes, duration, and the checks (`id`, `status`, `errorMessage`).
- Runs that record no SUCCESS, FAILURE or WARNING check produce no evidence and are listed under `noSignal` in the summary.

For the merge, add a `ConformanceObservation` member to `ProbeObservation` (`type: conformance`, suite, suite version and commit, scenario, spec version, forced, checks, client exit code, harness) and move the checks there from `run`. Have `scripts/collect.ts` read `probe/conformance/runs/<client>@<version>/<config>/<specVersion>/<scenario>/checks.json` alongside `probe/runs`, committing `checks.json` and keeping `cli.log` and bridge captures out of git as the probe does with client output. Add the proposed ids to `spec-versions.json` first.

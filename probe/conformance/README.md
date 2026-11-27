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

`run.mjs` lists the client scenarios with `conformance list --client` and runs each one with `--scenario <s> --spec-version <v>` once per version in its applicability tags. Extension scenarios have no tags, so they run at 2025-11-25 and at 2026-07-28 with `--force`, which matches the SDK's own CI legs. Options: `--only a,b`, `--versions v1,v2`, `--concurrency`, `--timeout`. The suite splits `--command` on spaces and runs it through a shell, so no path in it may contain a space, and the command runs with this folder as its working directory. Python adapters need `BRIDGE_TIMEOUT_MS=80000` and `--timeout 100000` for their cold start.

On Windows, run SDK clients from WSL: `wsl -d Ubuntu -e bash -lc 'cd /mnt/c/.../probe/conformance && export PATH=$HOME/node/current/bin:$PATH && node run.mjs ...'`. Node 24.19.0 on Windows aborts at `process.exit` with `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c` (exit code 3221226505) after every 2026-07-28 run of the everything-client, after all checks have passed. The same bundle exits 0 under WSL. The suite counts the exit code, so on Windows those runs read as failures.

## The patch

`everything-client/canimcp.patch` changes four lines. The handlers for `auth/pre-registration`, `auth/client-credentials-jwt`, `auth/client-credentials-basic` and `auth/enterprise-managed-authorization` construct `Client` without `versionNegotiation`, so at 2026-07-28 the client completes the OAuth flow, then sends `initialize` and the stateless mock rejects it with `-32020 Missing MCP-Protocol-Version header`. The checks the suite has recorded by then all pass, and the client exits 1. The patch adds `versionNegotiation: { mode: 'auto' }` under `isModernConformanceRun()`, as the file's other 2026-capable handlers do. With it the four pass at 2026-07-28 and emit one or two more checks each (pre-registration 10 to 12). The SDK's own 2026 leg (`--suite all --spec-version 2026-07-28 --expected-failures`, empty baseline) scores suite runs by check status, so the unpatched exit does not show there.

## Results: TypeScript SDK client 2.4.0

79 runs over 48 scenarios, WSL Ubuntu, Node 24.19.0, 2026-11-27: 77 pass. The two failures are `auth/wif-jwt-bearer` at both versions (`wif-assertion-verified`: the client never sends the JWT-bearer token request), which the SDK baselines as an expected failure. Per scenario and capability: `summary/ts-sdk-client.json`.

## Results: the bridge

`mastra` (`@mastra/mcp` 2.9.0-alpha.1 on `@modelcontextprotocol/client` 2.4.0), all 79 runs, Windows: 17 pass. `initialize`, `tools_call` (three versions), `sse-retry`, `request-metadata`, `http-standard-headers`, `http-custom-headers`, `http-invalid-tool-headers` and `json-schema-ref-no-deref` pass. `json-schema-2020-12-preservation` fails on what the model is shown: `$schema` arrives as draft-07 and `allOf` is missing at both versions (the suite scores the `allOf` check only at 2026-07-28). The echo is built from the tool parameters in the mock's chat-completions request, so this is the schema the model received. The elicitation scenario fails because the adapter's agent sets no elicitation handler (`-32601`), every auth scenario fails because it sets no auth provider, MRTR fails three of five checks with `SdkError` on each tool call (its input-required results embed an elicitation request), and the eight skills runs record no checks.

`fast-agent` 0.10.53, 12 scenarios, Windows: 13 of 17 runs pass, including `json-schema-2020-12-preservation` at both versions. Elicitation fails because fast-agent opens an interactive form (`No Windows console found`), MRTR fails three of five checks, and `auth/metadata-default` gets through discovery and dynamic registration (3 and 4 checks pass) and then times out waiting for a browser.

## What blocks the bridge for other clients

- The bridge replaces an adapter's own `mockScript` with `call-every-tool.mjs`. Clients that need a warm-up turn, tool search or a code-mode tool (cline, codex, crewai, deepagents, eve, fx, hermes-agent, opencode, pi) need the two composed: the adapter's script first, with the planned tool as its fixture tool, then the plan.
- codex, goose and opencode run in the Docker image, which has no network beyond loopback, so the suite has to run inside the container with the bridge. fx and libfx need WSL.
- Elicitation needs each client configured to answer: a handler in the framework scripts (mastra, strands, adk-python, agent-framework, crewai, deepagents), and for hosts a non-interactive accept mode or a TTY driver. fast-agent shows a console form.
- Auth needs a headless user agent. Frameworks need an OAuth provider wired into their script that follows the authorization redirect, as the SDK's `ConformanceOAuthProvider` does. Hosts open a browser or print the URL and wait on a local callback; a `BROWSER`/`xdg-open` shim or a bridge that tails client output and fetches the URL would complete the flow, since the suite's authorization endpoint redirects without a login page. Hosts that keep tokens in a keyring or the home directory also need a fresh store per run. Client-credentials, enterprise-managed authorization, DPoP and WIF need application code most hosts do not expose.
- `sep-2322-client-request-state` returns input-required results that embed an elicitation request, so it needs the same elicitation answer.
- The skills scenarios record nothing unless the client implements the skills extension client side.
- Scenarios are HTTP only. eve already declares `transports: ['http']`; a stdio-only client cannot run them.

## Mapping

`mapping.json` maps by check id, first match wins, and falls back to the scenario's default. Ids the vocabulary lacks are listed under `proposed`: `protocol.requestMeta` (SEP-2575 per-request `_meta`), `authentication.oauth.scopes`, `authentication.oauth.refreshTokens` (SEP-2207), `authentication.oauth.dpop` (SEP-1932), `authentication.oauth.workloadIdentityFederation` (SEP-1933), and aliases for the two auth extensions that have none in `extensions.known`. `wire-schema-valid` is kept in the record and mapped to nothing. `jsonSchemaDialect` is a top-level section of `spec-versions.json`, not a `capabilities` key.

No client scenario in this suite version exercises sampling, roots, roots.listChanged, tools.listChanged, resources, prompts, completions, logging, tasks, elicitation.url, stdio, or anything about tool results reaching the model. The `input-required-result-*` scenarios that involve sampling and roots are server scenarios. `notCovered` in `mapping.json` has the full list.

## Proposed ingest

One Evidence record per (capability, scenario, spec version, client version, config), in the existing schema, so `ingest-preview/<client>.json` validates against `schema/verified-evidence.schema.json` today:

- `tier: verified`, `source: modelcontextprotocol/conformance`, `url` the suite tree at its commit, `date`, `at` the spec version the scenario ran at, `scenario: conformance/<scenario>`, `clientVersion`, `config`, `artifact` the run directory.
- `status`: `full` when every check mapped to that capability passed and the suite accepted the client's exit, `partial` when some passed, and omitted when none did. A run with no passing check cannot tell a missing feature from an adapter that does not configure it (mastra's auth runs), so it carries the failure in `note` and leaves the status to the editor.
- `note`: `conformance <scenario> at <version>: n/m checks pass; failed <ids>`.
- `run`: suite, suite version, spec version, forced, harness, platform, exit codes, duration, and the checks (`id`, `status`, `errorMessage`).
- Runs that record no SUCCESS, FAILURE or WARNING check produce no evidence and are listed under `noSignal` in the summary.

For the merge, add a `ConformanceObservation` member to `ProbeObservation` (`type: conformance`, suite, suite version and commit, scenario, spec version, forced, checks, client exit code, harness) and move the checks there from `run`. Have `scripts/collect.ts` read `probe/conformance/runs/<client>@<version>/<config>/<specVersion>/<scenario>/checks.json` alongside `probe/runs`, committing `checks.json` and keeping `cli.log` and bridge captures out of git as the probe does with client output. Add the proposed ids to `spec-versions.json` first.

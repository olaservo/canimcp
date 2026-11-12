# canimcp probe

A live probe for MCP clients. It runs a real client against an instrumented fixture MCP server and a mock model endpoint, records what the client does at both ends, and writes one canimcp `verified`-tier evidence record per (client, client version, scenario, protocol revision, config). The first scenario family is tool result handling: which of `content` and `structuredContent` reaches the model. The registry, capture points and record shape are general enough for the other spec and extension features to follow.

No real API keys are involved and nothing leaves localhost. The mock model is the only "provider" a client talks to.

Run reports: `pilot-2026-11-07.md` (the first six clients) and `pilot-2026-11-08.md` (eleven more, the `_meta` scenarios, and the shared fixes that pass forced). The open follow-ups are listed in the root folder's `TODO.md`, outside this repo.

## Layout

```
probe/
  fixtures/tool-results.ts     the fixtures: one tool per fixture, one fixed CallToolResult each, marker strings in every field
  server/fixture-server.ts     the instrumented MCP server: stdio and Streamable HTTP, 2025 handshake and 2026-07-28 stateless
  server/raw-jsonrpc.ts        the hand-written JSON-RPC path for results the SDK will not send unchanged
  mock-model/server.ts         the mock model: Chat Completions, Responses, Anthropic Messages; logs every request body
  mock-model/script.ts         the scripted turn: call the fixture tool, then end with text; adapters can supply their own script
  classify/classify.ts         captures in, observation out
  registry/scenarios.json      scenario registry: capability id, revisions, fixture, capture, observation type
  registry/clients.json        every client the probe knows about: hosts, harnesses, frameworks, how each is driven
  registry/sdks.json           the MCP SDKs, and which clients sit on which
  registry/sdk-compat.json     generated: which fixtures each server path sends unchanged, per era
  hosts/<client>/adapter.ts    one adapter per client: install manifest, config writer, command line, extra mock script
  runner.ts                    takes a client and a scenario set, runs them, writes records
  scripts/sdk-compat.ts        regenerates registry/sdk-compat.json
  scripts/collect.ts           runs/ -> data/verified/<client>.json
  scripts/reclassify.ts        recomputes records from captures after a classifier change
  runs/<client>@<version>/<config>/<era>-<transport>/<scenario>/   the raw captures and record.json for each run
```

## Running

```
cd probe
npm install
npm run build
node dist/scripts/sdk-compat.js                   # once per SDK version
node dist/runner.js --client goose --set core      # or --set tool-results, or --scenarios a,b,c
node dist/runner.js --client codex --set tool-results --config mcp-2026-07-28 --transport http
node dist/scripts/collect.js                       # writes ../data/verified/<client>.json
cd .. && npm run validate
```

Runner options: `--mode sdk|mcpserver|raw|auto` (default `auto`: the raw path only where `sdk-compat.json` says the SDK changes the fixture), `--era both|legacy|modern` (default `both`: the server answers either and the client chooses; `legacy` hides `server/discover`, `modern` rejects the handshake), `--transport stdio|http`, `--config <name>` (default: every config the adapter declares), `--timeout <ms>`, `--keep-tmp`.

Each run directory holds `wire.jsonl` (every JSON-RPC message in and out, captured before validation), `model.jsonl` (every model request body, the mock's decision, and its reply), the client's stdout and stderr, the config the adapter wrote, and `record.json`. `index.json` under the client directory lists the client's records.

## Platform notes

Everything here was learned on a Windows 11 machine with the repo under OneDrive.

- **Clients must not see the operator's machine.** codex, goose, opencode and fx each search upward from their working directory for skills and instruction files, and a working directory under the operator's home reaches `~/.claude/skills` and the like. The runner therefore puts each run's scratch directory (the client's cwd, HOME and config) outside the home tree: `C:\canimcp-probe` on Windows, `$TMPDIR/canimcp-probe` elsewhere, or `PROBE_TMP`. After a run it searches the captures for text from the operator's skills and global instruction files, read locally from `lib/operator-guard.ts`'s list, and exits non-zero naming the files if any turns up. The repo's pre-commit hook runs the same search over staged files. On Windows that is not enough for codex, goose and opencode, which find the user profile through the OS and list the skills in it whatever HOME says. Their captures for codex 0.169.0-alpha.3, goose 1.58.0 and opencode a98e3fa and 2.2.6 were made that way, and `scripts/strip-operator-skills.js` replaced each of the operator's skill entries with one `[canimcp removed N skills found on the operator's machine]` line, leaving the client's bundled skills. Verdicts were the same before and after. Re-runs in a container will replace them.

- **fx and libfx run only on Linux and macOS.** On Windows run the runner from WSL Ubuntu: `wsl -d Ubuntu -e bash -lc 'cd /mnt/c/.../canimcp/probe && export PATH=$HOME/node/current/bin:$HOME/zig:$PATH && node dist/runner.js --client fx ...'`. That WSL has Node 24 at `~/node/current/bin/node` and Zig 0.17.0 at `~/zig`; the fx source checkout and build live at `~/fx-src`, the packaged libfx at `~/libfx-pkg`. WSL cannot reach ports on the Windows side (firewall), so for those hosts the whole stack runs inside WSL. fx ignores `settings.json` on a world-writable path, which every `/mnt/c` path is, so the adapter puts `FX_HOME` under Linux `/tmp`.
- **goose is built from source** when no release contains the pin: `cargo build --release -p goose-cli --bin goose` took 33 minutes; the binary goes to `hosts/goose/bin/` (gitignored) and the cargo target dir was `%LOCALAPPDATA%\canimcp-build\goose-target`, which can be deleted once the build is no longer needed.
- **hermes-agent** is an editable install of a detached git worktree at `%LOCALAPPDATA%\canimcp-build\hermes-agent`; `hosts/hermes-agent/requirements.txt` has the recipe. Deleting that worktree breaks the venv.
- **opencode is built from source** when no release contains the pin, from a detached worktree at `%LOCALAPPDATA%\canimcp-build\opencode` with bun 1.4.4 installed locally under `%LOCALAPPDATA%\canimcp-build\bun144` (the build script refuses older bun; the global bun here is 1.3.4). `hosts/opencode/package.json` has the recipe; the binary goes to `hosts/opencode/bin/` (gitignored) and the adapter prefers it over the npm install. The worktree and the local bun can be deleted once the binary exists.
- **Python clients** import slowly from a venv under OneDrive (10 to 60 s cold). Run `.venv/Scripts/python.exe -m compileall -q -j 4 .venv/Lib/site-packages` once after installing, and pass `--timeout 300000` (hermes: `--timeout 240000`) to the runner.
- **Codex** at 0.169.0-alpha.3 speaks the Responses API only (`wire_api = "chat"` fails config loading), puts MCP tools in a `namespace` tool named `mcp__<server>`, and applies its `mcp_2026_07_28` feature to Streamable HTTP servers only. Its first turn may start before MCP tools are listed; the mock script spends a warm-up round trip.
- **Clients that split a stdio command line on whitespace** cannot take `C:\Program Files
odejs
ode.exe`; the runner passes `node` from PATH. crewAI also hashes long server names into the tool name, so its adapter spawns a one-line `srv.mjs` wrapper.
- **The Anthropic Python SDK** posts to `/v1/messages?beta=true`; the mock routes on the path for that reason. The Gemini endpoint in the mock exists for ADK.
- **Agents writing adapters** should use a file-writing tool for TypeScript: Bash heredocs on this machine break on backticks.

## How a run works

1. The runner picks a free port and starts the mock model with the fixture tool's name and, if the adapter has one, its script module.
2. For HTTP it starts the fixture server on another port; for stdio it hands the adapter the command line the client should spawn.
3. The adapter writes the client's config into a scratch directory under the run (home directory, settings, MCP server entry, model provider pointing at the mock) and runs the client once with a fixed prompt.
4. The mock answers the first model request that offers the fixture tool with a call to it, and the next request with text. Turn detection is by tool results in the request, so a client that makes extra calls (codex's warm-up, fx's tool selection) still converges.
5. The classifier reads the captures: was the tool offered, was it called, did a result reach the model, which markers are in the payload, how many times, in what form (`text`, `json`, `envelope`, `blocks`, `empty`), what the negotiated revision was, and whether the server sent the fixture unchanged.

## Fixtures

Every fixture is one tool. Each payload carries a unique marker: `MARK_CONTENT_7f3a` in the text block, `MARK_SC_91be` in `structuredContent`, `MARK_USER_5a1d` in the audience-[user] block, a known PNG prefix for the image, and start/end markers for the large result. The classifier attributes what reached the model by marker, so it never has to guess from shape alone. The one exception is `mirror`, where the text is an exact copy of the JSON; there the record says how many times the payload arrived and in what form.

`summary_and_data`, `mirror` and `structured_only` are the three results on the research clients page. The variants are `sc_empty`, `with_image`, `audience_user`, `is_error`, `schema_match`, `schema_mismatch`, `app_only`, `large`, `no_content_key`, `empty_object`, `sc_string`, `sc_null`, `with_meta` and `meta_only`. The two `_meta` fixtures carry `MARK_META_4d2e` under an application key in the result's `_meta`; `with_meta` has both payload fields and `meta_only` has `content` alone, so the pair shows whether `_meta` reaches the model and whether its presence alone changes the route.

## Which fixtures need the raw path

`scripts/sdk-compat.ts` runs the official TypeScript client against the fixture server in each mode and era and compares what went on the wire with the fixture. At `@modelcontextprotocol/server` 2.4.0:

| Fixture | low-level `Server` | `McpServer.registerTool` | raw |
|---|---|---|---|
| `no_content_key`, `empty_object` | normalized to `content: []` | normalized to `content: []` | sent as is; the SDK client rejects it on 2026-07-28 (`content` required) and accepts it on 2025-11-25 (defaults to `[]`) |
| `sc_string`, `sc_null` on 2025 | rejected (`structuredContent` must be an object) | wrapped as `{result: ...}` | sent as is; the SDK client rejects it on 2025 |
| `sc_string`, `sc_null` on 2026-07-28 | sent as is | sent as is | sent as is |
| `schema_mismatch` | sent as is | rejected (output schema validation) | sent as is |
| everything else | sent as is | sent as is | sent as is |

The full matrix with error texts is `registry/sdk-compat.json`. The runner's default mode reads the `sdk` rows and uses the raw path for `no_content_key`, `empty_object`, `sc_string` and `sc_null`.

The conformance suite's `src/mock-server/` was read first and not reused: it is built on the legacy `@modelcontextprotocol/sdk` 1.x, depends on the suite's own wire-schema validator, and has no stdio. Its two ideas carried over: record every request before validation, and build the stateless server by hand so it can front-run SDK support.

## Adding a client

1. Add the client to `registry/clients.json`: title, kind (`host`, `harness`, `framework`), repo, `source` (its `_clients/repos.tsv` name), language, SDK, and `drive` (`cli`, `script`, or `gui`).
2. Create `hosts/<client>/`. Pin the install there: a `package.json` for npm clients, a `requirements.txt` plus a `uv venv` at `hosts/<client>/.venv` for Python clients (the adapter runs the venv interpreter directly, and `python -m compileall` over site-packages cuts the first import from tens of seconds to a few), a note on the build for compiled ones (the goose adapter expects `bin/goose` built at the pin; the fx adapter expects `bin/fx`). Everything but the manifest is gitignored.
3. Write `hosts/<client>/adapter.ts` exporting a `HostAdapter` (`lib/hosts.ts`): `id`, `configs` (`default` first, then one per switch the client's research note names), `version()`, and `run(ctx)`. `run` writes the client's config into `ctx.tmpDir`, points its model provider at `ctx.mockUrl` and its MCP server at `ctx.serverCommand` or `ctx.serverUrl`, runs the client once with `ctx.prompt`, and returns stdout, stderr and exit code. Set `platforms` when the client does not run everywhere; the fx adapters run from WSL on Windows. Set `transports` when the client lacks one; eve has no stdio MCP client, and the runner then refuses that transport instead of writing failed records.
4. If the client needs the model to do something before the tool is reachable (tool search, deferred loading, a warm-up round trip, or a script tool such as pi's `codemode`, opencode's `execute`, eve's `eve__tool` or deepagents' `js_eval`), add `hosts/<client>/mock-script.ts` and name it in the adapter's `mockScript`. The classifier treats a call whose arguments name the fixture tool, or whose call id starts with `call_probe_fixture`, as the fixture tool reached indirectly. The script sees every request's offered tools and tool results and returns a decision; returning `undefined` falls through to the default.
5. `npm run build`, then `node dist/runner.js --client <client> --set core`. Read `model.jsonl` for the first run: the tool names and the shape the client uses tell you whether the default matcher finds the tool.

## Adding a scenario

1. Add the fixture to `fixtures/tool-results.ts` (or a new fixtures file for a new family), with a marker in every field the classifier should attribute.
2. Add the scenario to `registry/scenarios.json` with its capability id from `data/spec-versions.json`, the revisions it applies to, the fixture, and the question it answers. Add the capability id to `spec-versions.json` if it is new.
3. For a new family, add an observation type to `schema/mcp-client-registry.schema.json` under `ProbeObservation`, a classifier for it, and a `families` entry in the scenario registry naming the capture it reads. The wire capture already covers initialize capabilities, roots, list-changed handling, and elicitation and sampling replies; those families need a scenario handler on the server side and a classifier, not new capture points.
4. Rerun `scripts/sdk-compat.ts` if the fixture is a tool result.

## Records

Each `record.json` carries a canimcp `Evidence` object: `tier: verified`, `at` (the revision seen on the wire), `source: canimcp-probe`, `date`, `scenario`, `clientVersion`, `config`, `artifact` (the run directory), `note` (a one-line verdict in the clients page glyphs), and `observation`, the typed detail. `scripts/collect.ts` writes them per client into `data/verified/<client>.json`, validated by `schema/verified-evidence.schema.json`. `npm run build:cards` at the repo root renders the overlay into each client card (a *Verified by the probe* section) and into `cards/tool-results.md`, the cross-client matrix.

## Related work

The capture-before-validation idea is the conformance suite's (`modelcontextprotocol/conformance`, `src/mock-server/`), and the scenario and requirement vocabulary should stay aligned with it so a probe record can cite the conformance requirement it exercises. Three people and one project to talk to as this grows: MCPJam, whose inspector drives hosts interactively and could run these fixtures; Alex Akimov; Shaun Smith (evalstate), whose fast-agent and HF telemetry are the `observed` tier here; and Jan Curn (Apify), whose `mcp-client-capabilities` is the `declared` tier. The aim is one shared fixture set that the conformance suite, an interactive inspector, and this probe all run, so a client's declared, verified and observed rows come from the same scenarios.

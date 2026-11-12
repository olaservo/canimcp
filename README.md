# canimcp

Data behind canimcp.io: which MCP clients support what, how each claim is known, and research notes on the parts a support matrix cannot express.

Addresses [modelcontextprotocol#1814](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1814) (client compatibility matrix) and [registry#718](https://github.com/modelcontextprotocol/registry/issues/718) (structured client schema).

## Why this is not just another matrix

Existing sources answer one question — does client X support feature Y, yes or no. They disagree with each other, and none of them says where the answer came from.

An example that is checkable today. The apify registry records Claude Code as having no elicitation support, pinned at protocol version `2025-06-18`. The Hugging Face MCP telemetry records Claude Code using elicitation, with 99.999% of its traffic on `2025-11-25`. Both are honest. One is a curated record last touched in February; the other is observed traffic from last week.

So a capability here is not a boolean. It carries evidence, and evidence carries a tier:

| Tier | Means |
|---|---|
| `declared` | The client says so — `initialize.capabilities`, or a curated list |
| `verified` | A probe or conformance scenario exercised it |
| `observed` | Telemetry over real traffic |
| `read` | Someone read the client's source at a pinned commit |

Tiers are not ranked. Several can coexist on one capability and disagree. A disagreement is a finding, not a bug to reconcile.

Every claim also carries the protocol revision it applies to. This is not decoration: `2026-07-28` is stateless with per-request `_meta`, everything through `2025-11-25` uses the initialize handshake, and a result on one says nothing about the other.

## Layout

```
schema/
  mcp-client-registry.schema.json   client entries, capabilities, evidence, probe observations
  research-note.schema.json         frontmatter for research/ notes
  verified-evidence.schema.json     the per-client overlay the probe writes
data/
  clients.json                      the registry - researched entries only
  clients.apify-seed.json           the old apify-derived seed, kept for reference
  clients.example.json              worked example of the evidence shape
  spec-versions.json                per-capability lifecycle across protocol versions
  verified/<client>.json            generated: verified-tier evidence from the probe, keyed by capability
research/
  <id>.md                           prose notes, referenced by id from the registry
cards/
  <id>.md                           generated one-page profile per client
scripts/
  validate.js                       validates the schemas, the overlays and cross-checks references
  build-cards.js                    renders cards/ from the registry
probe/
  README.md                         the live probe: fixture server, mock model, adapters, runner
  registry/                         scenarios, the list of clients, the list of SDKs
  hosts/<client>/                   one adapter per client
  runs/                             raw captures and one record per run
```

`spec-versions.json` describes the protocol, not any client: when each capability was introduced, changed, deprecated or removed, with SEP numbers. Client entries record only where they deviate from those defaults. It is what lets a consumer tell "unsupported" apart from "did not exist at that version".

## The probe

`probe/` is the source of `verified`-tier evidence. It runs a real client against an instrumented fixture MCP server and a mock model endpoint, both on localhost, and records every JSON-RPC message on the wire and every request body the client sends the model. The first scenario family is tool result handling: which of `content` and `structuredContent` reaches the model, in what form and how often, read off marker strings in the fixtures. Each run yields one `Evidence` record with `tier: verified`, the revision seen on the wire, the client version, the configuration, and a typed `observation`; `probe/scripts/collect.ts` gathers them into `data/verified/<client>.json`. `probe/README.md` has the layout, how to add a client, and how to add a scenario.

`probe/registry/clients.json` is the list of clients the project tracks, hosts, harnesses and frameworks alike, with how each one can be driven. `probe/registry/sdks.json` lists the MCP SDKs, because most client behaviour is the SDK's before it is the client's, and the SDK's own client is a probe target too.

## Research notes

A matrix cell says whether something works. A note says what is actually going on. Five kinds:

- `nuance` — the boolean is true, but there are conditions worth knowing
- `gap` — something the spec or ecosystem does not cover, or covers badly
- `misconception` — a widely-held belief about MCP that is wrong
- `idiosyncrasy` — one client behaves unlike the others
- `in-flight` — work still moving in the spec repos, SEPs, or a working group

Notes are Markdown with YAML frontmatter validated against `schema/research-note.schema.json`. They carry `capabilities` and `clients` so a note surfaces on the cells it bears on, `sources` pinned to commits, and for in-flight work a `tracking` block with SEP numbers, PRs, issues and `lastActivity`. `status` is `current`, `needs-review`, `stale` or `superseded` — and `lastVerified` means the claims were re-checked against sources, not that the prose was edited.

A worked example is `research/utilized-capability-declarations.md`: MCP's handshake cannot express which capabilities a peer actually consumes, which is why servers sniff client names. SEP-1381 proposed a fix and was closed `dormant` on 2026-06-26.

## Client cards

`cards/<id>.md` is a one-page profile of a client: what it is, the revisions it speaks, a capability table with the evidence tier behind every row, the notes a status cannot carry, and the commit the read was done at.

Cards are generated by `npm run build:cards` and are not hand-edited. The probe's run reports are `probe/pilot-2026-11-07.md` and `probe/pilot-2026-11-08.md`. A client the probe has run against also gets a *Verified by the probe* section, one row per run, and `cards/tool-results.md` is the cross-client matrix of those runs: one row per client, config and transport, one column per scenario, the clients-page glyph in each cell. Both are rendered from `data/verified/`, the overlay `probe/scripts/collect.ts` writes, so a cell changes only when the probe is rerun. The read tier for tool result handling lives in `olaservo/structured-content-research`; `tools.result` entries in the registry point at that repo's note by commit and summarise it (see `AGENTS.md`). A status reaches a card only by being in the registry, so a card cannot claim more than the registry can source. Two things the table is careful about: a capability absent from an entry renders as *not recorded* rather than *unsupported*, and a sub-capability resting on its parent's evidence is marked rather than left looking unsourced.

Cards also give each client a section listing where its evidence tiers disagree — declared against read, most often. `npm run build` fails if a card on disk is behind the registry.

## First data pass: open-source clients

Starting with clients whose source can be cloned and re-read on a schedule, so `read`-tier evidence stays current instead of decaying. Repos and default branches verified 2026-08-23:

| Client | Repo | Branch | License | Status |
|---|---|---|---|---|
| opencode | `anomalyco/opencode` | `dev` | MIT | done, `7cde8329` |
| Codex CLI | `openai/codex` | `main` | Apache-2.0 | done, `b705b6b0` |
| Cline | `cline/cline` | `main` | Apache-2.0 | |
| goose | `aaif-goose/goose` | `main` | Apache-2.0 | done, `c5e5929a` |
| fast-agent | `evalstate/fast-agent` | `main` | Apache-2.0 | |

Gemini CLI was on this list and is off it. Consumer access ended 2026-06-18 and the repo is maintenance-only; the successor, Antigravity CLI, is a closed-source Go binary. The repo still reads as healthy — unarchived, pushed daily, no README notice — so repository metadata is not a reliable liveness signal. See `research/gemini-cli-succeeded-by-closed-source-antigravity.md`.

goose and opencode both moved orgs (from `block/` and `sst/`); the rows above are the current locations.

Later: VS Code, Zed, Continue, Roo Code. VS Code matters most of the six-plus — it declares more capabilities than any other client — but `microsoft/vscode` is large enough to need its own path handling.

Each client's `metadata.source` block records `repo`, `ref`, `checkedCommit`, `commitDate`, `checkedAt` and the `paths` holding the MCP implementation, so a refresh can shallow-clone, diff against the last commit read, and re-verify only what moved. The two dates answer different questions: `commitDate` is when the source last changed, `checkedAt` is when this registry last read it. The gap between them is how far behind a read already was; the gap between `commitDate` and HEAD is how stale it has since become.

### Which SDK, and which version of it

`metadata.sdk` records the SDK a client's MCP implementation is built on, because most client behaviour is not the client's own. It carries `declared` and `resolved` separately: a manifest states a requirement and a lockfile states a version, and only the resolved one describes what runs. goose declares `rmcp` `"3.0.0"` and resolves to `3.1.4`; Codex pins `=3.1.3` so both agree.

`pinsProtocolVersion` marks the case where the negotiated revision is the SDK's decision rather than the client's. opencode speaks `2025-11-25` because SDK 1.29.0 pins `LATEST_PROTOCOL_VERSION` there. goose and Codex both name their revision in their own source, so the field is absent for them — three clients read, and only one of the three preferred revisions was actually chosen by the client.

`patched` is the field that stops the rest from being trusted too far. opencode pins `@modelcontextprotocol/sdk` exactly and then patches four of its runtime files through `bun.lock`, so "on the official SDK" settles nothing on its own. Check for `patches/`, `pnpm.patchedDependencies`, `patch-package`, a Cargo `[patch]` section, or a vendored fork before recording `patched: false` — both Rust clients have a `[patch.crates-io]` section, and neither patches rmcp, but that is a thing to verify rather than assume.

**No client source is vendored here.** This repo stores commit hashes and quotes only the excerpts a claim needs, with attribution. Clones live in the shared `_clients` checkout described in `AGENTS.md`; read at the pinned commit there. `.gitignore` blocks `clients/` and `.inbox/` so a clone made inside the repo cannot be committed by accident.

## Usage

```bash
npm install
npm run validate
```

`validate.js` checks the registry against its schema, checks every research note's frontmatter, confirms note ids match filenames, confirms every `research:` reference resolves, confirms `preferredProtocolVersion` is a member of `protocolVersions`, and checks every `data/verified/*.json` overlay against its schema and its capability ids against `spec-versions.json`.

Validate a specific file:

```bash
node scripts/validate.js data/clients.example.json
```

Re-render the client cards after editing the registry:

```bash
npm run build:cards
```

`npm run build` runs the validator and then checks the cards are current.

## Known work

- Two of the five clients above are unresearched. `clients.apify-seed.json` holds their old apify-derived records; entries move into `clients.json` as they are read, not before.
- `scripts/migrate.js` seeds from apify. Kept for reference; not part of `npm run build` any more.

## Contributing

Edit `data/clients.json` or add a note in `research/`, then run `npm run build`. New capability claims need at least one evidence record. `read`-tier evidence needs a commit.

`npm install` points git at `.githooks/`, whose pre-commit hook runs `scripts/check-private.js` on the staged files. It rejects a home directory path, a probe capture that reached into an agent's config folder, and an email address. `node scripts/check-private.js --fix` rewrites home directory paths to `~`. The other two need a fix by hand, usually a re-run with the client isolated from the operator's machine. CI runs the same check over the whole tree.

## License

Code is MIT, see `LICENSE`. Data, research notes, cards and probe captures are CC BY 4.0, see `LICENSE-DATA.md`.

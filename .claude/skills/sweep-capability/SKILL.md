---
name: sweep-capability
description: Record one capability across every client in the canimcp registry at the lowest cost that still gets it right. Searches release notes, docs, setting names, feature names and launched runtimes as well as protocol method names, reads existing notes first, sends agents only to clients with a hit, and records cited unsupported rows for the rest. Use when asked to fill, add or check a capability or extension for all clients (for example skills over MCP, MCP Events, MCP Apps, tasks, a new protocol revision).
---

# Sweep one capability across clients

A sweep answers "which clients support X" for one capability. The 2026-11-26 extension fill showed both failure modes: 25 full agent reads to learn that nearly every client lacks two extensions, and one wrong answer (VS Code skills over MCP) because the search looked only for method names in the client's own MCP code.

All paths are relative to the repo root. Client source is in `../../_clients`; run `bash ../../_clients/sync.sh` first.

## Step 1: Define what counts

Write down, before searching:

- the capability id and the registry key it lives under (`extensions["io.modelcontextprotocol/skills"]`, `elicitation.url`, ...), and its sub-rows (events has `poll`, `push`, `webhook`);
- the protocol identifiers: method names, notification names, capability or extension keys;
- the human names: the feature as release notes and settings would call it ("skills over MCP", "MCP Apps", "events"), the SEP number, and likely setting keys;
- the SDK helpers that implement it (`SkillsClient`, `ext/skills`, an rmcp feature), and which SDK versions ship them.

## Step 2: Search every client, broadly

For each client with a clone, search HEAD for all of the identifiers and names from Step 1, not only method names:

```
git -C ../../_clients/<clone> grep -n -i -E "<identifiers|human names|setting keys|helper names>" HEAD -- . ':!*test*' ':!*fixture*'
```

Also, per client:

- Read the existing notes in `research/` that list the client. A note may already answer the question (VS Code's note on agent sessions bringing their own MCP client did).
- Check the client's release notes or changelog since its pin for the feature by name (`CHANGELOG.md`, `RELEASE*`, a docs repo, GitHub releases with `gh release list`).
- Check whether the client launches or embeds a runtime, agent host or SDK that could implement the feature outside its own MCP code (VS Code's agent host starts the Copilot runtime; goose and Codex sit on rmcp). If the SDK version the lockfile resolves ships the helper, check whether the client turns it on.

Sort the clients into: a hit in code, settings, notes or release notes; no hit anywhere.

## Step 3: Read only the hits

Launch one agent per client with a hit, all in one message, with `../client-read-kit/brief.md`-style instructions scoped to this capability. Give each its search hits, so it starts from them. Ask for the row (status, notes, evidence with `file:Symbol` citations), any `byProtocolVersion["2025-11-25"]` difference, and findings.

For the clients with no hit, the owner writes the row without an agent: status `unsupported`, a one-sentence note, and evidence citing where the client declares its capabilities (most entries already cite this on their `roots`, `elicitation` or `extensions` rows) plus a sentence that release notes through the client's current version name no such feature. Entries with no source read (closed-source clients) get `untested` unless telemetry or docs say otherwise.

## Step 4: Cross-check

Before applying, compare against the other tiers: the HF telemetry overlay (`data/observed/`) and the probe's records (`data/verified/`). A client that telemetry or a probe shows using the feature cannot be `unsupported`; read again. Then apply the rows to `data/clients.json`, run `npm run build:cards` and `npm run build`, and commit on a branch.

## Step 5: Prefer a probe

If the capability can be exercised (a server offers it and the client's behaviour shows on the wire or in the model request), add a probe scenario and run it for every client with an adapter. A probe record is the strongest evidence the registry has. See `probe/README.md`.

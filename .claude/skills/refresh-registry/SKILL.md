---
name: refresh-registry
description: Bring the canimcp registry back in line with its sources, cheaply. Syncs the shared client clones, re-pins every citation whose cited code did not change, sends review agents only the citations whose code did (with the diff), checks MCP-related commits for new features, then updates data/clients.json, the research notes, the telemetry and the cards. Use when asked to refresh the registry, re-read clients, check what is stale, or bump pins.
---

# Refresh the registry

Every `read` claim is pinned to a commit and cites a file or a symbol in it (`file`, `file:Symbol`, `file:A,B`; never line numbers). Most upstream commits do not touch the code a claim rests on, so a refresh re-pins those mechanically and spends agent time only where code changed or a new feature may have landed.

All paths are relative to the repo root. Client source is in `../../_clients`. Never commit to, branch in, or push from those clones.

## Rules that hold throughout

- Change a sentence only when it states something the code no longer does. New text is only for new behaviour.
- A status needs a source. A `read` evidence item needs the commit and the file or symbol it was read at.
- Tool-result handling (`tools.result.*`) belongs to `GitHub/_research/structured-content-research`. Do not re-read it here.
- One owner edits the shared files: `data/clients.json`, the schemas, `scripts/` and `probe/`. Agents return findings; the owner applies them.
- Where the probe covers a capability, its records outrank a source read. A probe re-run after a pin moves is the better check than an agent reading the diff (see `probe/README.md`).

## Step 1: Branch, sync, check

```
git switch -c refresh-YYYY-MM-DD main
bash ../../_clients/sync.sh
npm run refresh:check -- --remote > /tmp/check.txt
```

Note any `FAILED:` line from the sync; that client is checked against whatever commit its clone is at. The check lists, per entry: state, commits behind, the MCP-related commits since the pin, and changed tracked paths and cited files.

## Step 2: Re-pin what did not change

```
node scripts/repin-citations.js --residual <scratch>/residual.json        # dry run
node scripts/repin-citations.js --write --residual <scratch>/residual.json
```

A citation whose symbol text (or, for a bare file, whole file) is identical at HEAD moves to HEAD with today's date. A note whose sources all held gets today's `lastVerified`, and an entry whose citations at its pin all held gets its `metadata.source` pin moved. Only the client's own repository is re-pinned; SDK citations stay at the release the client resolves. `residual.json` holds the rest, each with the claim it backs and the diff of its symbol or file.

## Step 3: Review only what changed

Split `residual.json` by client and launch one review agent per client with changed citations, all in one message. Use a smaller model (`model: "sonnet"`) for these: the job is reading a short diff against a stated claim. Give each agent `review-brief.md` from this folder, its slice of the residual file, and the path to write its verdicts. It returns each item with `verdict: "holds"` (and `newPath` if the symbol moved or was renamed) or `verdict: "changed"` with a `finding` that says what the code now does, citing file and symbol.

Then:

```
node scripts/accept-review.js <scratch>/review-*.json            # dry run
node scripts/accept-review.js <scratch>/review-*.json --write
```

Held citations are re-pinned. Apply each `changed` finding by hand: status, notes, evidence.

## Step 4: Look for new features

The refresh check's "MCP commits since" list is the cheap signal for behaviour that no citation covers yet. For each entry with such commits, read the subjects and, where one names a feature (skills, events, elicitation, a new transport, OAuth, a protocol revision), check the client's release notes or changelog for that version and grep for the setting or feature name. Hand a likely hit to an agent with the client-read brief scoped to that capability. A capability across many clients at once is the `sweep-capability` skill.

## Step 5: Telemetry and declared sources

When the check says the telemetry dataset moved, run `npm run ingest:observed`. Entries with no source read (the closed-source ones and Hugging Face Chat UI) take some extension rows straight from the overlay; check those against the new feed. When Apify's list moved, compare the records `declared` evidence cites. A new disagreement between tiers goes in the capability's `notes`.

## Step 6: Rebuild and check

```
npm run build:cards
npm run build
npm run refresh:check
```

## Step 7: Deliver

Commit on the branch and push it. The commit message names each client whose claims changed and what changed, and gives the count of citations re-pinned without review. Open a pull request only when asked. Report the counts (re-pinned, reviewed and held, changed), the changed claims, notes that went stale, and new disagreements between tiers.

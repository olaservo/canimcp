---
name: refresh-registry
description: Bring the canimcp registry back in line with its sources. Syncs the shared client clones, runs the refresh check to see which entries have moved, re-reads each moved client with one subagent per client, then updates data/clients.json, the research notes, the telemetry and the cards. Use when asked to refresh the registry, re-read clients, check what is stale, or bump pins.
---

# Refresh the registry

Every `read` claim in the registry is pinned to a commit. This workflow finds the entries whose source has moved since, re-verifies them, and updates the pins. It corrects facts and leaves the existing writing alone.

All paths are relative to the repo root. Client source is in `../../_clients`, one clone per client, shared by every research repo on the machine. Never commit to, branch in, or push from those clones.

## Rules that hold throughout

- Change a sentence only when it states something the code no longer does. Correct the path, name, number or mechanism inside it and leave the rest of the wording alone. New text is only for new behaviour.
- A status needs a source. A `read` evidence item needs the commit and the path it was read at.
- Record both dates: `metadata.source.commitDate` is when the source last changed, and `checkedAt` is when it was read.
- Tool-result handling (`tools.result.*`) belongs to `GitHub/_research/structured-content-research`. Do not re-read it here. A pin bump there means a probe re-run, which is separate work.
- One owner edits the shared files: `data/clients.json`, the schemas, `scripts/` and `probe/`. Subagents edit only the research notes for their own client.

## Step 1: Branch and sync

Work on a branch from an up-to-date `main`, named `refresh-YYYY-MM-DD`. Then sync the clones and run the check:

```
bash ../../_clients/sync.sh
npm run refresh:check -- --remote
```

A `FAILED:` line from the sync means that clone did not update. Note it and check that client against whatever commit it is at.

The check prints one row per entry that has a source read:

- `current`: the clone is at the checked commit. Nothing to do.
- `unchanged`: the clone moved and no tracked path or cited file did. Spot-check one cited path, then bump the pin in Step 3 without a subagent.
- `moved`: a tracked path or a cited file changed. The entry needs a re-read. The report lists the cited files that changed, the ones that are gone, and the research notes that cite them.
- `no-clone` or `pin-missing`: fix the clone or `repos.tsv` first.

With `--remote` it also says whether Apify's list and the telemetry dataset have moved past the pins the registry cites.

## Step 2: One subagent per moved client

Launch one subagent per `moved` client, all in one message so they run together. Give each one:

- The client's entry from `data/clients.json`, its research notes, and its row from the check with the changed and missing files.
- The task: verify every claim in the entry and the notes against `../../_clients/<name>` at HEAD. Start from the cited paths, then search for code that moved or was renamed. Apply the standing rules in `TODO.md` in the parent folder: check for a patched SDK, a default-off feature flag, test-only code, and every MCP implementation in the repo.
- What it may edit: only `research/<its notes>.md`. It updates `sources` (commit, path, date), `lastVerified`, and any sentence that is now wrong. A note whose behaviour is gone gets `status: stale` and one sentence saying what changed.
- What it returns: the new full commit and its date; for each capability whose status, notes or evidence must change, the new value with the path and line it was read at; the resolved SDK version from the lockfile; the wire names; and anything new that deserves a note.

## Step 3: Apply the reports

The owner of the shared files applies every report to `data/clients.json`:

- `metadata.source.checkedCommit`, `commitDate` and `checkedAt`, and `metadata.lastVerified`.
- `metadata.sdk` when the resolved version or the patch state changed.
- Each capability the report names: `status`, `notes`, and the `read` evidence items with the new commit, path and date. Keep an older evidence item when it still records something true about an earlier revision, and give it its own `status` when it now disagrees.
- New research note ids in the capability's `research` list.

For an `unchanged` client, bump the pin fields and the commit on the evidence items that were spot-checked.

## Step 4: Telemetry and declared sources

When the check says the telemetry dataset moved:

```
npm run ingest:observed
```

That re-fetches the feed at its current revision and rejoins it to the registry by wire name. A client the feed has and the registry does not is listed under "Evidence without a registry entry" on the clients index. Add an entry for it only when the product can be identified from a source.

When Apify's list moved, compare each record a `declared` evidence item cites with the record at the new commit, and update the status and the commit where the record changed.

The build shows every place an evidence item disagrees with the registry's status, on the capability pages under "Where the tiers disagree". Read that list after the ingest. A new disagreement is a finding: record what each tier shows in the capability's `notes`, and do not pick a side without a source.

## Step 5: Rebuild and check

```
npm run build:cards
npm run build
npm run refresh:check
```

The second check should show every refreshed entry as `current`. `npm run build` validates the registry and the notes, checks the cards, and builds the site.

## Step 6: Deliver

Commit on the branch and push it. The commit message names each client and what changed in one sentence, and lists pin-only bumps on one line. Open a pull request only when asked. Report which entries changed, which were verified unchanged, which notes went stale, and any new disagreement between tiers.

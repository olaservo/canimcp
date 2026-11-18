---
name: publish
description: Publish finished canimcp changes end to end. Rebuilds the generated files, runs the build, shows what the live site will gain and lose, commits on a branch, pushes, opens a pull request, merges it once CI passes, deploys main to canimcp.io, checks the live site against the build, and records the deploy. Use only when the site owner asks to publish, ship, release or deploy the changes, or runs /publish.
---

# Publish changes to canimcp.io

This takes changes that are already made and gets them onto `main` and onto the live site. It does not decide what the changes should be.

All paths are relative to the repo root. `TODO.md` is in the parent folder.

## What a request to publish covers

Running this skill is the owner's go-ahead to push one branch, open one pull request, merge it, and deploy, for the changes in front of you. It covers that one set of changes. A later change needs a new request.

It does not cover a comment, review or issue on GitHub, an upstream report, publishing `server.json` to the MCP Registry, or a rollback. Ask for each of those.

Being asked to make a change is not a request to publish it. Do not start this workflow on your own.

## Step 1: See what is being published

```
git fetch origin
git status -sb
git diff --stat origin/main
gh auth status
npx wrangler whoami
```

- Tell the owner in one or two lines what the change set is. If it holds something they have not seen or did not ask for, stop and ask.
- If `gh` or `wrangler` is not logged in, stop. The owner runs `gh auth login` or `npx wrangler login`.
- If `main` is behind `origin/main`, bring it up to date before branching.
- `package-lock.json` can show as modified with an empty `git diff` on Windows. Leave it out of the commit.

## Step 2: Regenerate what the change touches

| Changed | Run |
|---|---|
| `probe/registry/clients.json`, or records under `probe/runs/` | `npm run build` and `node dist/scripts/collect.js` in `probe/` |
| `data/clients.json`, `data/verified/`, `research/` | `npm run build:cards` |
| A probe classifier | `node dist/scripts/reclassify.js` in `probe/`, then the two rows above |

Skip a row that does not apply. A change to `web/`, `worker/` or `scripts/` alone needs none of them.

## Step 3: Build

```
npm run build
npm run refresh:check
```

`npm run build` validates the registry and the notes, checks the cards and the private-data rules, and builds `site/`. It has to pass. Fix the cause of a failure. Do not skip a check or the pre-commit hook.

`refresh:check` does not block a publish. Report any entry it lists as `moved`.

## Step 4: See what the deploy will change

```
npm run check:live
```

This compares `site/` with what canimcp.io serves, file by file, and asks the live MCP server how many clients it has.

- "In the build, not served" is what the deploy adds. "Served with different content" is what it changes. Both should be explained by the change set. A changed file with no connection to it means the live site and `main` have drifted, or the build picked up something else. Find out which before going on.
- "Served pages absent from the build" is what the deploy removes. Stop and ask unless removing that page is the stated point of the change. Other sites link to these URLs.

When `worker/` or `wrangler.jsonc` changed, also run the build through the Worker locally:

```
npx wrangler dev --port 8911
node scripts/check-live.js --origin http://127.0.0.1:8911 --expect-equal
```

Check first that nothing is listening on the port, since another project's dev server on the same port answers instead. Stop the server before the deploy, because a rebuild of `site/` under it can fail on a lock. On Windows, stopping the task leaves `node` and `workerd` running. Kill the `node ... wrangler ... dev` process tree with `taskkill /PID <pid> /T /F`, and only the one started from this repo.

## Step 5: Commit, push, pull request, merge

1. Work on a branch from `main`, named for the change. Stage files by name.
2. Commit. The message says what changed in plain sentences, in the style of `git log`.
3. `git push -u origin <branch>`.
4. Open the pull request with `gh pr create --base main --body-file <file>`, with the body written to a file outside the repo. Follow the earlier pull requests: a sentence on what it does, a short list of what changed, anything a reader should know before trusting it, and what was checked locally. Write as the owner, in the first person singular.
5. `gh pr checks <number> --watch`. Merge only when the `check` workflow passes. If it fails, fix it on the branch and push again.
6. `gh pr merge <number> --merge --delete-branch`. The repo uses merge commits. The command also switches to `main`, fast-forwards it and deletes the branch locally and on `origin`.
7. Confirm with `git status -sb` and `git log --oneline -1` that you are on `main` at the merge commit.

## Step 6: Deploy from main

Deploy only from `main` at `origin/main`, with no uncommitted change other than the `package-lock.json` case above. The live site then matches a commit anyone can read.

```
npm run deploy
```

It runs the build again and then `wrangler deploy`. Keep the `Current Version ID` it prints.

Skip the deploy when it would change nothing: Step 4 listed no difference, and the change set touches none of the files the Worker is bundled from. Those are `worker/`, `wrangler.jsonc`, `scripts/lib/capabilities.js`, and `package.json` with its dependencies. Say in the report that the deploy was skipped and why, and still run Step 7.

## Step 7: Check the live site

```
npm run check:live -- --expect-equal
```

It should end with "The running site matches the build." If files differ, wait a minute and run it once more. If they still differ, or pages fail to load, tell the owner what is wrong and offer `npx wrangler rollback`. Do not roll back without being told to.

## Step 8: Record and report

In `../TODO.md`, update the "Last updated" date and add to the relevant paragraph what was published: the date, the pull request number, the merge commit, and the Worker version id or that the deploy was skipped. Correct any line the publish made untrue, such as "not deployed" or "not pushed".

Report the pull request URL, the merge commit, the Worker version id, and the result of the live check. Say plainly if a step was skipped or failed.

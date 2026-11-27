#!/usr/bin/env node
/**
 * Reports which registry entries have fallen behind their sources. It changes
 * nothing: the refresh skill in .claude/skills/refresh-registry acts on it.
 *
 * For an entry with metadata.source, it compares checkedCommit with HEAD of the
 * client's clone in _clients and lists the tracked paths and the cited files
 * that changed in between. With --remote it also asks whether Apify's list and
 * the telemetry dataset have moved past the pins the registry cites.
 *
 * Run `bash ../../_clients/sync.sh` first, or the clones are only as new as
 * their last sync.
 *
 * Usage: node scripts/refresh-check.js [--json] [--remote] [--clients <dir>]
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './lib/frontmatter.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const clientsDir = resolve(option('--clients') ?? process.env.CANIMCP_CLIENTS_DIR ?? join(root, '..', '..', '_clients'));
const today = new Date();

const readJson = (...p) => JSON.parse(readFileSync(join(root, ...p), 'utf8'));
const git = (dir, ...argv) => execFileSync('git', ['-C', dir, ...argv], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).trim();
const tryGit = (dir, ...argv) => { try { return git(dir, ...argv); } catch { return null; } };
const sameRepo = (a, b) => a.replace(/\.git$/, '').toLowerCase() === b.replace(/\.git$/, '').toLowerCase();
const daysSince = (date) => (date ? Math.floor((today - new Date(date)) / 86_400_000) : null);

if (!existsSync(join(clientsDir, 'repos.tsv'))) {
  console.error(`No repos.tsv in ${clientsDir}. Pass --clients <dir> or set CANIMCP_CLIENTS_DIR.`);
  process.exit(2);
}
const clones = readFileSync(join(clientsDir, 'repos.tsv'), 'utf8').split(/\r?\n/).filter(Boolean).map((l) => l.split('\t')).map(([name, url]) => ({ name, url }));

/** Every evidence item under an entry, with the capability path it sits on. */
function evidenceOf(node, path = [], out = []) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return out;
  for (const e of node.evidence ?? []) out.push({ capability: path.join('.'), ...e });
  for (const [k, v] of Object.entries(node)) if (k !== 'evidence' && k !== 'metadata') evidenceOf(v, [...path, k], out);
  return out;
}

const registry = Object.entries(readJson('data', 'clients.json')).filter(([id]) => !id.startsWith('$'));
const notes = readdirSync(join(root, 'research')).filter((f) => f.endsWith('.md')).map((f) => ({ id: f.slice(0, -3), fm: parseFrontmatter(readFileSync(join(root, 'research', f), 'utf8'), f) })).filter((n) => n.fm);

const reads = [];
const unread = [];
for (const [id, entry] of registry) {
  const src = entry.metadata?.source;
  if (!src?.checkedCommit) {
    unread.push({ id, title: entry.title, tiers: [...new Set(evidenceOf(entry).map((e) => e.tier))] });
    continue;
  }
  const row = { id, title: entry.title, repo: src.repo, checkedCommit: src.checkedCommit.slice(0, 8), checkedAt: src.checkedAt, ageDays: daysSince(src.checkedAt) };
  const clone = clones.find((c) => sameRepo(c.url, src.repo));
  const dir = clone && join(clientsDir, clone.name);
  if (!dir || !existsSync(join(dir, '.git'))) {
    reads.push({ ...row, state: 'no-clone', detail: `no clone of ${src.repo} in ${clientsDir}` });
    continue;
  }
  const head = git(dir, 'rev-parse', 'HEAD');
  if (tryGit(dir, 'cat-file', '-e', `${src.checkedCommit}^{commit}`) === null) {
    reads.push({ ...row, state: 'pin-missing', head: head.slice(0, 8), detail: 'the checked commit is not in the clone, so upstream rewrote history or the clone is shallow' });
    continue;
  }
  Object.assign(row, { clone: clone.name, head: head.slice(0, 8), headDate: git(dir, 'log', '-1', '--format=%cs', head) });
  if (head === src.checkedCommit) {
    reads.push({ ...row, state: 'current', commitsBehind: 0, trackedChanged: [], citedChanged: [], citedGone: [], notes: [] });
    continue;
  }
  const range = `${src.checkedCommit}..${head}`;
  const pathspecs = (src.paths ?? []).map((p) => (p.includes('*') ? `:(glob)${p}` : p));
  const trackedChanged = pathspecs.length ? git(dir, 'diff', '--name-only', range, '--', ...pathspecs).split('\n').filter(Boolean) : [];
  // An evidence path is `file`, `file:lines` or `file:symbol`.
  const cited = [...new Set(evidenceOf(entry).filter((e) => e.path && e.commit && src.checkedCommit.startsWith(e.commit)).map((e) => e.path.split(':')[0]))];
  const changedAll = new Set(git(dir, 'diff', '--name-only', range).split('\n'));
  const citedChanged = cited.filter((f) => changedAll.has(f));
  const citedGone = cited.filter((f) => tryGit(dir, 'cat-file', '-e', `${head}:${f}`) === null);
  // Notes that cite this repository at the checked commit, in a file that has changed.
  const touched = notes.filter((n) => (n.fm.sources ?? []).some((s) => s.url && sameRepo(s.url, src.repo) && s.commit && src.checkedCommit.startsWith(s.commit) && s.path && changedAll.has(String(s.path).split(':')[0]))).map((n) => n.id);
  // Commits since the pin that name MCP or an MCP feature, or touch a path with mcp in it. A new
  // capability usually shows up here first, including one built outside the cited files.
  const MCP_WORDS = /\bmcp\b|model context protocol|elicitation|sampling|\broots\b|skills? over|server\/discover|structuredContent|resource link|oauth|cimd|sep-\d+|io\.modelcontextprotocol/i;
  const log = git(dir, 'log', '--format=%h%x09%s', range).split(/\r?\n/).filter(Boolean).map((l) => l.split('\t'));
  const byPath = new Set(git(dir, 'log', '--format=%h', range, '--', ':(glob,icase)**/*mcp*', ':(glob,icase)**/*mcp*/**').split(/\r?\n/).filter(Boolean));
  const mcpCommits = log.filter(([hash, subject]) => MCP_WORDS.test(subject ?? '') || byPath.has(hash)).map(([hash, subject]) => ({ hash, subject }));
  reads.push({
    ...row,
    mcpCommits,
    state: trackedChanged.length || citedChanged.length ? 'moved' : 'unchanged',
    commitsBehind: Number(git(dir, 'rev-list', '--count', range)),
    trackedChanged, citedChanged, citedGone, notes: touched,
  });
}

const remote = [];
if (flag('--remote')) {
  const evidence = registry.flatMap(([, entry]) => evidenceOf(entry));
  const apifyPins = [...new Set(evidence.filter((e) => e.source === 'apify/mcp-client-capabilities' && e.commit).map((e) => e.commit))];
  const apifyHead = (tryGit(root, 'ls-remote', 'https://github.com/apify/mcp-client-capabilities.git', 'HEAD') ?? '').split(/\s/)[0];
  remote.push({ source: 'apify/mcp-client-capabilities', pinned: apifyPins, head: apifyHead.slice(0, 7) || null, moved: apifyHead ? !apifyPins.every((p) => apifyHead.startsWith(p)) : null });
  for (const f of readdirSync(join(root, 'data', 'observed')).filter((x) => x.endsWith('.json'))) {
    const overlay = readJson('data', 'observed', f);
    let head = null;
    try {
      head = (await (await fetch(`https://huggingface.co/api/datasets/${overlay.source}`)).json()).sha ?? null;
    } catch { /* offline */ }
    remote.push({ source: overlay.source, pinned: [overlay.revision.slice(0, 8)], head: head?.slice(0, 8) ?? null, moved: head ? head !== overlay.revision : null, windowEnd: overlay.window?.end });
  }
}

const report = { generatedAt: today.toISOString().slice(0, 10), clientsDir, reads, unread, remote };
if (flag('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const L = [`Registry refresh check, ${report.generatedAt}. Clones in ${clientsDir}.`, ''];
  L.push('| Client | Read at | Age | State | Behind | MCP commits | Tracked paths changed | Cited files changed | Notes to re-check |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of reads) {
    L.push(`| ${r.id} | ${r.checkedCommit} (${r.checkedAt}) | ${r.ageDays}d | ${r.state} | ${r.commitsBehind ?? ''} | ${r.mcpCommits?.length ?? ''} | ${r.trackedChanged?.length ?? ''} | ${r.citedChanged ? `${r.citedChanged.length}${r.citedGone.length ? `, ${r.citedGone.length} gone` : ''}` : r.detail} | ${(r.notes ?? []).length || ''} |`);
  }
  L.push('', '`moved` means a tracked path or a cited file changed, so the entry needs a re-read. `unchanged` means the clone moved and nothing the entry tracks did, so the pin can be bumped after a spot check.');
  for (const r of reads.filter((x) => x.state === 'moved')) {
    L.push('', `${r.id}, ${r.checkedCommit}..${r.head} (${r.headDate}):`);
    if (r.citedChanged.length) L.push(`- cited files changed: ${r.citedChanged.join(', ')}`);
    if (r.citedGone.length) L.push(`- cited files gone at HEAD: ${r.citedGone.join(', ')}`);
    if (r.notes.length) L.push(`- notes citing a changed file: ${r.notes.join(', ')}`);
  }
  for (const r of reads.filter((x) => x.mcpCommits?.length)) {
    L.push('', `${r.id}, MCP commits since ${r.checkedCommit}:`);
    for (const c of r.mcpCommits.slice(0, 10)) L.push(`- ${c.hash} ${c.subject}`);
    if (r.mcpCommits.length > 10) L.push(`- and ${r.mcpCommits.length - 10} more`);
  }
  if (unread.length) L.push('', `No source read to refresh (${unread.length}): ${unread.map((u) => `${u.id} [${u.tiers.join(', ') || 'no evidence'}]`).join('; ')}.`);
  for (const r of remote) L.push('', `${r.source}: pinned ${r.pinned.join(', ') || 'nothing'}, upstream ${r.head ?? 'not reachable'}${r.moved ? ', moved' : r.moved === false ? ', current' : ''}.`);
  console.log(L.join('\n'));
}

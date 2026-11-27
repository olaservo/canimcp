#!/usr/bin/env node
/**
 * Moves `read` citations to the clone's HEAD when the code they cite did not
 * change, so a refresh sends a reviewer only the citations whose code did.
 *
 * A citation is `file`, `file:Symbol` or `file:A,B` (functions, classes or
 * Markdown headings, found by scripts/lib/symbols.js). It is unchanged when each
 * symbol's text, or for a bare file the whole file, is the same at HEAD as at
 * the cited commit. A file renamed in between is followed.
 *
 * Without --write nothing changes. With --write unchanged citations get the
 * HEAD commit and today's date, a note whose sources were all unchanged gets
 * today's lastVerified, and an entry whose citations at its checked commit were
 * all unchanged gets its metadata.source pin moved to HEAD. --residual writes
 * the rest, each with the diff of its symbol or file, for the review step.
 *
 * Usage: node scripts/repin-citations.js [--client <id>]... [--write] [--residual <file.json>] [--clients <dir>]
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { symbolText } from './lib/symbols.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const options = (name) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));
const clientsDir = resolve(options('--clients')[0] ?? process.env.CANIMCP_CLIENTS_DIR ?? join(root, '..', '..', '_clients'));
const only = new Set(options('--client'));
const write = flag('--write');
const today = new Date().toISOString().slice(0, 10);

const git = (dir, ...argv) => execFileSync('git', ['-C', dir, ...argv], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
const tryGit = (dir, ...argv) => { try { return git(dir, ...argv); } catch { return null; } };
const slug = (url) => String(url).replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/, '').replace(/\/$/, '').toLowerCase();

const clones = readFileSync(join(clientsDir, 'repos.tsv'), 'utf8').split(/\r?\n/).filter(Boolean).map((l) => l.split('\t'))
  .map(([name, url]) => ({ name, slug: slug(url), dir: join(clientsDir, name) })).filter((c) => existsSync(join(c.dir, '.git')));
const heads = new Map();
const cloneFor = (source) => {
  const c = source && clones.find((x) => x.slug === slug(source));
  if (!c) return null;
  if (!heads.has(c.name)) heads.set(c.name, git(c.dir, 'rev-parse', 'HEAD').trim());
  return { ...c, head: heads.get(c.name) };
};
const fileCache = new Map();
const fileAt = (clone, commit, path) => {
  const key = `${clone.name}:${commit}:${path}`;
  if (!fileCache.has(key)) fileCache.set(key, tryGit(clone.dir, 'show', `${commit}:${path}`));
  return fileCache.get(key);
};
const renamedTo = (clone, from, path) => {
  if (fileAt(clone, clone.head, path) !== null) return path;
  const out = tryGit(clone.dir, 'diff', '-M', '--name-status', '--diff-filter=R', from, clone.head, '--', path) ?? '';
  const hit = out.split('\n').map((l) => l.split('\t')).find((p) => p[0]?.startsWith('R') && p[1] === path);
  return hit ? hit[2] : null;
};

const scratch = mkdtempSync(join(tmpdir(), 'repin-'));
/** A unified diff of two texts. */
function diffTexts(a, b, label) {
  writeFileSync(join(scratch, 'a'), a ?? '');
  writeFileSync(join(scratch, 'b'), b ?? '');
  let out = '';
  try { execFileSync('git', ['diff', '--no-index', '--unified=3', join(scratch, 'a'), join(scratch, 'b')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { out = e.stdout ?? ''; }
  out = out.split('\n').slice(4).join('\n');
  return `${label}\n${out.length > 15000 ? `${out.slice(0, 15000)}\n[diff truncated]` : out}`;
}

/** {path} when the cited code is unchanged at HEAD, else {reason, diff}. */
function check(clone, commit, cited) {
  const full = tryGit(clone.dir, 'rev-parse', '--verify', `${commit}^{commit}`)?.trim();
  if (!full) return { reason: `commit ${commit} is not in the clone` };
  const i = cited.indexOf(':');
  const file = i === -1 ? cited : cited.slice(0, i);
  const symbols = i === -1 ? [] : cited.slice(i + 1).split(',').map((s) => s.trim()).filter(Boolean);
  const before = fileAt(clone, full, file);
  if (before === null) return { reason: `${file} is not in ${commit}` };
  const now = renamedTo(clone, full, file);
  if (!now) return { reason: `${file} is gone at HEAD`, diff: '' };
  const after = fileAt(clone, clone.head, now);
  const newPath = now + (symbols.length ? `:${symbols.join(',')}` : '');
  const wholeFile = () => (before === after ? { path: newPath } : { reason: `${file} changed`, diff: diffTexts(before, after, `--- ${file}`) });
  if (!symbols.length) return wholeFile();
  const diffs = [];
  for (const s of symbols) {
    const was = symbolText(before, file, s);
    if (was === null) return wholeFile();
    const is = symbolText(after, now, s);
    if (is === null) return { reason: `${s} is not in ${now} at HEAD`, diff: diffTexts(was, '', `--- ${file}:${s}`) };
    if (was !== is) diffs.push(diffTexts(was, is, `--- ${file}:${s}`));
  }
  return diffs.length ? { reason: `${symbols.length === 1 ? symbols[0] : 'a cited symbol'} changed`, diff: diffs.join('\n') } : { path: newPath };
}

const residual = [];
const stats = { unchanged: 0, changed: 0, pins: 0, notes: 0 };
const note = (where, clone, commit, cited, claim, result) => {
  if (result.path) { stats.unchanged++; return; }
  stats.changed++;
  residual.push({ ...where, repo: clone.slug, from: commit, head: clone.head.slice(0, 8), path: cited, claim, reason: result.reason, diff: result.diff ?? '' });
};

// --- registry ----------------------------------------------------------------

const registryPath = join(root, 'data', 'clients.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
for (const [id, entry] of Object.entries(registry)) {
  if (id.startsWith('$') || (only.size && !only.has(id))) continue;
  const pin = entry.metadata?.source?.checkedCommit;
  const own = entry.metadata?.source?.repo && slug(entry.metadata.source.repo);
  let pinOk = true;
  const walk = (node, capability, owner) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach((n) => walk(n, capability, owner)); return; }
    // Only the client's own repository moves with its HEAD. An SDK citation is pinned to the release the client resolves.
    if (node.tier === 'read' && node.commit && node.path && own && slug(node.source) === own) {
      const clone = cloneFor(node.source);
      if (!clone || clone.head.startsWith(node.commit)) return;
      const result = check(clone, node.commit, node.path);
      const claim = { status: owner?.status, notes: owner?.notes, evidenceNote: node.note };
      note({ kind: 'evidence', client: id, capability }, clone, node.commit, node.path, claim, result);
      if (pin && pin.startsWith(node.commit) && !result.path) pinOk = false;
      if (result.path && write) Object.assign(node, { commit: clone.head.slice(0, 8), date: today, path: result.path });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'metadata') continue;
      if (k === 'evidence') walk(v, capability, node);
      else walk(v, [capability, k].filter(Boolean).join('.'), owner);
    }
  };
  walk(entry, '', null);
  walk(entry.metadata?.sdk?.evidence, 'metadata.sdk', entry.metadata?.sdk);
  const src = entry.metadata?.source;
  const clone = src && cloneFor(src.repo);
  if (write && pinOk && clone && pin && !clone.head.startsWith(pin)) {
    Object.assign(src, { checkedCommit: clone.head, commitDate: git(clone.dir, 'log', '-1', '--format=%cI', clone.head).trim(), checkedAt: today });
    entry.metadata.lastVerified = today;
    stats.pins++;
  }
}
if (write) writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

// --- research notes ------------------------------------------------------------

const notesDir = join(root, 'research');
for (const f of readdirSync(notesDir).filter((x) => x.endsWith('.md'))) {
  const text = readFileSync(join(notesDir, f), 'utf8');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const clientsBlock = fm[1].match(/^clients:\r?\n((?:[ \t]+- .*(?:\r?\n|$))+)/m);
  const noteClients = clientsBlock ? clientsBlock[1].split(/\r?\n/).map((l) => l.replace(/^\s+- /, '').trim()).filter(Boolean) : [];
  if (only.size && !noteClients.some((c) => only.has(c))) continue;
  const ownRepos = new Set(noteClients.map((c) => registry[c]?.metadata?.source?.repo).filter(Boolean).map(slug));
  const summary = fm[1].match(/^summary: (.*)$/m)?.[1];
  const lines = fm[1].split(/\r?\n/);
  let item = null;
  let all = true;
  let any = false;
  const flush = () => {
    if (!item?.url || !item.commit || !item.path || !ownRepos.has(slug(item.url))) return;
    const clone = cloneFor(item.url);
    if (!clone || clone.head.startsWith(item.commit)) return;
    any = true;
    const result = check(clone, item.commit, item.path);
    note({ kind: 'note', note: f.slice(0, -3) }, clone, item.commit, item.path, { summary }, result);
    if (!result.path) { all = false; return; }
    if (write) {
      lines[item.commitLine] = lines[item.commitLine].replace(/commit: .*/, `commit: ${clone.head.slice(0, 8)}`);
      lines[item.pathLine] = lines[item.pathLine].replace(/path: .*/, `path: ${result.path}`);
      if (item.dateLine !== undefined) lines[item.dateLine] = lines[item.dateLine].replace(/date: .*/, `date: ${today}`);
    }
  };
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(- )?(url|commit|path|date|title): (.*)$/);
    if (m?.[1]) { flush(); item = {}; }
    if (!m) { if (!/^\s/.test(line)) { flush(); item = null; } return; }
    if (!item) return;
    if (m[2] === 'url') item.url = m[3].trim();
    if (m[2] === 'commit') Object.assign(item, { commit: m[3].trim(), commitLine: i });
    if (m[2] === 'path') Object.assign(item, { path: m[3].trim(), pathLine: i });
    if (m[2] === 'date') item.dateLine = i;
  });
  flush();
  if (write && any) {
    let body = lines.join('\n');
    if (all) { body = body.replace(/^lastVerified: .*$/m, `lastVerified: ${today}`); stats.notes++; }
    writeFileSync(join(notesDir, f), text.replace(fm[1], body));
  }
}
rmSync(scratch, { recursive: true, force: true });

// --- report ----------------------------------------------------------------------

const residualPath = options('--residual')[0];
if (residualPath) writeFileSync(residualPath, `${JSON.stringify(residual, null, 2)}\n`);
console.log(`${stats.unchanged} citations unchanged, ${stats.changed} changed.${write ? ` Re-pinned the unchanged ones; ${stats.pins} entry pins and ${stats.notes} notes moved to HEAD.` : ' Dry run: pass --write to re-pin the unchanged ones.'}`);
const groups = new Map();
for (const r of residual) {
  const key = r.kind === 'note' ? `note ${r.note}` : r.client;
  groups.set(key, [...(groups.get(key) ?? []), r]);
}
for (const [where, items] of groups) {
  console.log(`\n${where} (${items.length}):`);
  for (const r of items.slice(0, 12)) console.log(`- ${r.capability ? `${r.capability}: ` : ''}${r.path}: ${r.reason}`);
  if (items.length > 12) console.log(`- and ${items.length - 12} more`);
}
if (residualPath && residual.length) console.log(`\nChanged citations, each with its diff: ${residualPath}`);

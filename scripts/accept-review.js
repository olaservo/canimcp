#!/usr/bin/env node
/**
 * Applies a reviewer's verdicts on the changed citations that
 * scripts/repin-citations.js --residual wrote. Each item comes back with
 * `verdict`: "holds" re-pins the citation to `head` (at `newPath` when the
 * symbol moved or was renamed), and "changed" is listed for the owner, who
 * edits the claim by hand. Nothing else in the registry or notes changes.
 *
 * Usage: node scripts/accept-review.js <review.json> [<review.json> ...] [--write]
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const write = args.includes('--write');
const items = args.filter((a) => !a.startsWith('--')).flatMap((f) => JSON.parse(readFileSync(f, 'utf8')));
const today = new Date().toISOString().slice(0, 10);
const slug = (url) => String(url).replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/, '').replace(/\/$/, '').toLowerCase();

const holds = items.filter((i) => i.verdict === 'holds');
const changed = items.filter((i) => i.verdict === 'changed');
const unknown = items.filter((i) => !['holds', 'changed'].includes(i.verdict));
const key = (repo, commit, path) => `${slug(repo)}|${commit}|${path}`;
const wanted = new Map(holds.map((i) => [key(i.repo, i.from, i.path), i]));
let applied = 0;

const registryPath = join(root, 'data', 'clients.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const walk = (node) => {
  if (Array.isArray(node)) return node.forEach(walk);
  if (!node || typeof node !== 'object') return;
  const hit = node.tier === 'read' && wanted.get(key(node.source, node.commit, node.path));
  if (hit) {
    Object.assign(node, { commit: hit.head, date: today, path: hit.newPath ?? hit.path });
    hit.applied = true;
    applied++;
  }
  Object.values(node).forEach(walk);
};
walk(registry);
if (write) writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

const notesDir = join(root, 'research');
for (const f of readdirSync(notesDir).filter((x) => x.endsWith('.md'))) {
  const text = readFileSync(join(notesDir, f), 'utf8');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const lines = fm[1].split(/\r?\n/);
  let item = null;
  let changedNote = false;
  const flush = () => {
    const hit = item?.url && wanted.get(key(item.url, item.commit, item.path));
    if (!hit) return;
    lines[item.commitLine] = lines[item.commitLine].replace(/commit: .*/, `commit: ${hit.head}`);
    lines[item.pathLine] = lines[item.pathLine].replace(/path: .*/, `path: ${hit.newPath ?? hit.path}`);
    if (item.dateLine !== undefined) lines[item.dateLine] = lines[item.dateLine].replace(/date: .*/, `date: ${today}`);
    hit.applied = true;
    applied++;
    changedNote = true;
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
  if (write && changedNote) writeFileSync(join(notesDir, f), text.replace(fm[1], lines.join('\n')));
}

console.log(`${applied} of ${holds.length} held citations re-pinned${write ? '' : ' (dry run: pass --write)'}. ${changed.length} claims changed and need an edit by hand.`);
for (const i of holds.filter((h) => !h.applied)) console.log(`  not found: ${i.client ?? i.note} ${i.path} at ${i.from}`);
for (const i of unknown) console.log(`  no verdict: ${i.client ?? i.note} ${i.path}`);
for (const i of changed) console.log(`\n${i.kind === 'note' ? `note ${i.note}` : `${i.client} ${i.capability}`}: ${i.path}\n  ${i.finding ?? '(no finding given)'}`);

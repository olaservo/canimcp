#!/usr/bin/env node
/**
 * One-off: rewrites `file:lines` citations as `file:Symbol` (the function,
 * class or heading the lines sit in, at the cited commit) or as the bare file
 * when no symbol covers them, in data/clients.json and the research notes'
 * frontmatter. Line numbers churn with every upstream edit; a symbol is what a
 * contributor searches for and what a refresh compares.
 *
 * Usage: node scripts/migrate-citations.js [--write] [--clients <dir>]
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { languageOf, symbolsFor } from './lib/symbols.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const clientsDir = resolve(args.includes('--clients') ? args[args.indexOf('--clients') + 1] : join(root, '..', '..', '_clients'));
const write = args.includes('--write');

const slug = (url) => String(url).replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/, '').replace(/\/$/, '').toLowerCase();
const clones = readFileSync(join(clientsDir, 'repos.tsv'), 'utf8').split(/\r?\n/).filter(Boolean).map((l) => l.split('\t'))
  .map(([name, url]) => ({ slug: slug(url), dir: join(clientsDir, name) })).filter((c) => existsSync(join(c.dir, '.git')));
const cache = new Map();
const fileAt = (dir, commit, file) => {
  const key = `${dir}|${commit}|${file}`;
  if (!cache.has(key)) {
    try { cache.set(key, execFileSync('git', ['-C', dir, 'show', `${commit}:${file}`], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })); } catch { cache.set(key, null); }
  }
  return cache.get(key);
};

const RANGES = /^\d+(-\d+)?(,\s*\d+(-\d+)?)*$/;
const stats = { symbol: 0, file: 0, unchanged: 0 };

/** The new path for one citation, or the old one when it has no line numbers. */
function convert(path, source, commit) {
  // A few citations list several files; keep the files.
  if (/,\s*[\w.-]+\//.test(path)) {
    stats.file++;
    return [...new Set(path.split(/,\s*(?=[\w.-]+\/)/).map((p) => p.split(':')[0].trim()))].join(', ');
  }
  const i = path.indexOf(':');
  if (i === -1 || !RANGES.test(path.slice(i + 1).trim())) { stats.unchanged++; return path; }
  const file = path.slice(0, i);
  const clone = source && clones.find((c) => c.slug === slug(source));
  const text = clone && commit && languageOf(file) ? fileAt(clone.dir, commit, file) : null;
  if (!text) { stats.file++; return file; }
  const symbols = [...new Set(path.slice(i + 1).split(',').flatMap((part) => {
    const [a, b = a] = part.trim().split('-').map(Number);
    return symbolsFor(text, file, a, b);
  }))];
  if (!symbols.length || symbols.length > 4) { stats.file++; return file; }
  stats.symbol++;
  return `${file}:${symbols.join(',')}`;
}

const registryPath = join(root, 'data', 'clients.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const samples = [];
const walk = (node) => {
  if (Array.isArray(node)) return node.forEach(walk);
  if (!node || typeof node !== 'object') return;
  if (node.tier === 'read' && typeof node.path === 'string') {
    const next = convert(node.path, node.source, node.commit);
    if (next !== node.path && samples.length < 25 && Math.random() < 0.05) samples.push(`${node.path} -> ${next}`);
    node.path = next;
  }
  Object.values(node).forEach(walk);
};
walk(registry);
if (write) writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

const notesDir = join(root, 'research');
let notesChanged = 0;
for (const f of readdirSync(notesDir).filter((x) => x.endsWith('.md'))) {
  const text = readFileSync(join(notesDir, f), 'utf8');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const lines = fm[1].split(/\r?\n/);
  let item = null;
  let changed = false;
  const flush = () => {
    if (item?.pathLine === undefined) return;
    const next = convert(item.path, item.url, item.commit);
    if (next !== item.path) {
      lines[item.pathLine] = lines[item.pathLine].replace(/path: .*/, `path: ${next}`);
      changed = true;
    }
  };
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(- )?(url|commit|path): (.*)$/);
    if (m?.[1] && m[2] === 'url') { flush(); item = { url: m[3].trim() }; return; }
    if (m?.[1]) { flush(); item = {}; }
    if (!m) { if (!/^\s/.test(line)) { flush(); item = null; } return; }
    if (!item) return;
    if (m[2] === 'commit') item.commit = m[3].trim();
    if (m[2] === 'path') Object.assign(item, { path: m[3].trim(), pathLine: i });
    if (m[2] === 'url') item.url = m[3].trim();
  });
  flush();
  if (changed) {
    notesChanged++;
    if (write) writeFileSync(join(notesDir, f), text.replace(fm[1], lines.join('\n')));
  }
}

console.log(`${stats.symbol} citations to symbols, ${stats.file} to files, ${stats.unchanged} left as they were; ${notesChanged} notes touched.${write ? '' : ' Dry run: pass --write.'}`);
for (const s of samples) console.log(`  ${s}`);

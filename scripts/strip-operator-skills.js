#!/usr/bin/env node
/**
 * Removes the operator's own skills from probe captures.
 *
 * On Windows, codex, goose and opencode find the user profile through the OS and list
 * the skills in it, whatever HOME and the working directory say. This deletes each
 * entry whose name matches a skill folder in the operator's home, leaving the client's
 * bundled skills, and puts one placeholder line where the entries were. Runs made in
 * a container do not need it.
 *
 * Usage: node scripts/strip-operator-skills.js <run-dir>...
 * Then run reclassify, since records hold offsets into model.jsonl.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Keep in step with probe/lib/operator-guard.ts.
const SKILL_DIRS = ['.claude/skills', '.agents/skills', '.codex/skills', '.config/opencode/skills', '.config/goose/skills', '.gemini/skills'];

// Skill folders can nest (~/.claude/skills/synced/<id>/<name>/SKILL.md).
function* skillFiles(dir, depth = 0) {
  if (depth > 4 || !existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    // Clients install their own skills in hidden folders such as ~/.codex/skills/.system.
    if (e.name.startsWith('.')) continue;
    // Skill folders are often junctions or symlinks, which readdir does not report as directories.
    try {
      if (!statSync(join(dir, e.name)).isDirectory()) continue;
    } catch {
      continue;
    }
    const f = join(dir, e.name, 'SKILL.md');
    if (existsSync(f)) yield [e.name, f];
    else yield* skillFiles(join(dir, e.name), depth + 1);
  }
}

const names = new Set();
for (const d of SKILL_DIRS) {
  for (const [n, f] of skillFiles(join(homedir(), d))) {
    names.add(n);
    const m = /^name:\s*["']?([^"'\r\n]+)/m.exec(readFileSync(f, 'utf8'));
    if (m) names.add(m[1].trim());
  }
}

const note = (n) => `[canimcp removed ${n} skill${n === 1 ? '' : 's'} found on the operator's machine]`;

const HOME = homedir().replace(/\\/g, '/').toLowerCase();

// Bullet lists (codex, goose): "- name: description", possibly with continuation lines.
// Codex tags each entry with a root ("(file: r0/name/SKILL.md)") and lists the roots
// above it. There the root decides, since a bundled skill can share a name with one
// of the operator's.
function stripBullets(s) {
  const lines = s.split('\n');
  const operatorRoots = new Set();
  for (const line of lines) {
    const r = /^- `(r\d+)` = `([^`]+)`/.exec(line);
    if (r && r[2].replace(/\\/g, '/').toLowerCase().startsWith(HOME + '/')) operatorRoots.add(r[1]);
  }
  const out = [];
  let removed = 0, at = -1, dropping = false;
  for (const line of lines) {
    const m = /^- ([^:\s]+): /.exec(line);
    const root = m && /\(file: (r\d+)\/[^)]*\)\s*$/.exec(line);
    if (m) dropping = root ? operatorRoots.has(root[1]) : names.has(m[1]);
    else if (dropping && (line === '' || line.startsWith('- ') || line.startsWith('<') || line.startsWith('#'))) dropping = false;
    if (dropping) {
      if (m) {
        removed++;
        if (at < 0) at = out.length;
      }
      continue;
    }
    out.push(line);
  }
  if (!removed) return s;
  out.splice(at, 0, `- ${note(removed)}`);
  return out.join('\n');
}

// XML lists (opencode): <skill><id>name</id>...</skill>.
function stripXml(s) {
  let removed = 0, indent = '';
  const re = /(\n?)([ \t]*)<skill>\s*<id>([^<]+)<\/id>[\s\S]*?<\/skill>/g;
  const out = s.replace(re, (all, nl, ind, id) => {
    if (!names.has(id)) return all;
    removed++;
    indent = ind;
    return removed === 1 ? `${nl}\u0000` : '';
  });
  return removed ? out.replace('\u0000', `${indent}${note(removed)}`) : s;
}

const strip = (s) => stripXml(stripBullets(s));

function walk(v) {
  if (typeof v === 'string') return strip(v);
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
  return v;
}

function* captures(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* captures(p);
    else if (e.name === 'model.jsonl') yield p;
  }
}

let changed = 0;
for (const root of process.argv.slice(2)) {
  for (const f of captures(root)) {
    const text = readFileSync(f, 'utf8');
    const out = text
      .split('\n')
      .map((l) => (l.trim() ? JSON.stringify(walk(JSON.parse(l))) : l))
      .join('\n');
    if (out !== text) {
      writeFileSync(f, out);
      changed++;
    }
  }
}
console.log(`stripped operator skills from ${changed} capture(s)`);

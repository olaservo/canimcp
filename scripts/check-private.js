#!/usr/bin/env node
/**
 * Fails when a file in the repo carries something from the machine it was made on.
 *
 * Fixable: a home directory prefix (C:\Users\<name>, /mnt/c/Users/<name>, /home/<name>,
 * /Users/<name>). `--fix` rewrites each one to `~`.
 *
 * Blocking: a path into an agent's config folder (~/.claude, ~/.codex and the like)
 * in a probe capture, which means the client under test read the operator's own
 * setup, and an email address. These have no automatic fix.
 *
 * Usage:
 *   node scripts/check-private.js            tracked and untracked files in the working tree
 *   node scripts/check-private.js --staged   staged content only (the pre-commit hook)
 *   node scripts/check-private.js --fix      redact home prefixes in place, then check
 */

import { execFileSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const staged = process.argv.includes('--staged');
const fix = process.argv.includes('--fix');

// A path separator as it appears raw, JSON-escaped, or URL-encoded.
const SEP = String.raw`(?:\\\\|\\|/|%2[Ff]|%5[Cc])+`;
const NAME = String.raw`[^\\/"'\s:*?<>|%]+`;
const HOME = [
  new RegExp(String.raw`(?:file:${SEP})?[A-Za-z]:${SEP}Users${SEP}${NAME}`, 'gi'),
  new RegExp(String.raw`/mnt/[a-z]/Users/${NAME}`, 'gi'),
  new RegExp(String.raw`(?<![\w.-])/home/${NAME}`, 'g'),
  new RegExp(String.raw`(?<![\w.:-])/Users/${NAME}`, 'g'),
];
const AGENT_CONFIG = /~[\\/]+\.(?:claude|codex|cursor|gemini|copilot|continue|fx)[\\/]/g;
const CAPTURE = /^(?:probe\/runs\/|data\/verified\/)/;
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g;
const EMAIL_OK = /^(?:noreply@|.*@example\.(?:com|org|net)$|.*@users\.noreply\.github\.com$)/i;
// This file names the patterns it looks for.
const SKIP = new Set(['scripts/check-private.js']);

// Text from the operator's own skills and global instruction files. Clients under test
// pick these up by searching upward from their working directory, and the capture then
// carries them in a system prompt with no path attached. Only the machine that made the
// capture can check this, so it runs in the hook and is a no-op in CI.
// Keep the folder lists in step with probe/lib/operator-guard.ts.
const SKILL_DIRS = ['.claude/skills', '.agents/skills', '.codex/skills', '.config/opencode/skills', '.config/goose/skills', '.gemini/skills'];
const INSTRUCTION_FILES = ['.claude/CLAUDE.md', '.codex/AGENTS.md', '.config/opencode/AGENTS.md', '.gemini/GEMINI.md', '.config/goose/.goosehints'];
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
    if (existsSync(f)) yield f;
    else yield* skillFiles(join(dir, e.name), depth + 1);
  }
}
function operatorMarkers() {
  const home = homedir();
  const out = new Set();
  for (const d of SKILL_DIRS) {
    for (const file of skillFiles(join(home, d))) {
      const m = /^description:\s*["']?(.{30,}?)["']?\s*$/m.exec(readFileSync(file, 'utf8'));
      if (m) out.add(m[1].slice(0, 60));
    }
  }
  for (const f of INSTRUCTION_FILES) {
    const file = join(home, f);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const t = line.trim();
      if (t.length >= 50 && !t.startsWith('|') && !t.startsWith('```')) out.add(t.slice(0, 60));
    }
  }
  return [...out];
}
const MARKERS = operatorMarkers();

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 28 });

function files() {
  const out = staged ? git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z') : git('ls-files', '-co', '--exclude-standard', '-z');
  return out.split('\0').filter((f) => f && !SKIP.has(f));
}

function read(f) {
  const buf = staged ? execFileSync('git', ['show', `:${f}`], { maxBuffer: 1 << 28 }) : readFileSync(f);
  return buf.includes(0) ? null : buf.toString('utf8');
}

const lineOf = (text, i) => text.slice(0, i).split('\n').length;
const problems = [];
let fixed = 0;

for (const f of files()) {
  let text;
  try {
    text = read(f);
  } catch {
    continue;
  }
  if (text == null) continue;

  if (fix && !staged) {
    let out = text;
    for (const re of HOME) out = out.replace(re, '~');
    if (out !== text) {
      writeFileSync(f, out);
      fixed++;
      text = out;
    }
  }

  for (const re of HOME) {
    for (const m of text.matchAll(re)) problems.push(`${f}:${lineOf(text, m.index)}: home directory ${m[0]} (run with --fix)`);
  }
  if (CAPTURE.test(f)) {
    for (const m of text.matchAll(AGENT_CONFIG)) problems.push(`${f}:${lineOf(text, m.index)}: capture reads the operator's agent config at ${m[0]}`);
  }
  if (MARKERS.length) {
    const plain = text.replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\\//g, '/');
    const hits = MARKERS.filter((m) => text.includes(m) || plain.includes(m)).length;
    if (hits) problems.push(`${f}: holds text from ${hits} of the operator's own skill or instruction files`);
  }
  for (const m of text.matchAll(EMAIL)) {
    if (!EMAIL_OK.test(m[0])) problems.push(`${f}:${lineOf(text, m.index)}: email address`);
  }
}

if (fixed) console.log(`redacted home directories in ${fixed} file(s)`);
if (problems.length) {
  const shown = problems.slice(0, 40);
  console.error(shown.join('\n'));
  if (problems.length > shown.length) console.error(`... and ${problems.length - shown.length} more`);
  console.error(`\n${problems.length} problem(s). Nothing personal goes into this repo; see scripts/check-private.js.`);
  process.exit(1);
}
console.log('check-private: clean');

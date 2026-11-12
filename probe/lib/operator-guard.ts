// Keeps the operator's own machine out of probe captures.
//
// Clients search upward from their working directory, and from HOME, for skills and
// instruction files. A run directory under the operator's home lets them find the
// operator's ~/.claude/skills and the like, and the captured system prompt then
// carries them into the repo. So run scratch goes outside the home tree, and after
// each run the captures are searched for text taken from the operator's skill and
// instruction files. That text is read here and never written anywhere.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve, relative, isAbsolute } from 'node:path';

const inside = (child: string, parent: string) => {
  const r = relative(parent.toLowerCase(), child.toLowerCase());
  return !r.startsWith('..') && !isAbsolute(r);
};

/** A scratch root outside the home tree. PROBE_TMP overrides it. */
export function scratchRoot(): string {
  const home = homedir();
  const candidates = [process.env.PROBE_TMP, process.platform === 'win32' ? resolve(process.env.SystemDrive ?? 'C:', '\\canimcp-probe') : resolve(tmpdir(), 'canimcp-probe')];
  for (const c of candidates) {
    if (c && !inside(resolve(c), home)) return resolve(c);
  }
  throw new Error(`no scratch directory outside ${home}; set PROBE_TMP`);
}

const SKILL_DIRS = ['.claude/skills', '.agents/skills', '.codex/skills', '.config/opencode/skills', '.config/goose/skills', '.gemini/skills'];
const INSTRUCTION_FILES = ['.claude/CLAUDE.md', '.codex/AGENTS.md', '.config/opencode/AGENTS.md', '.gemini/GEMINI.md', '.config/goose/.goosehints'];

// Skill folders can nest (~/.claude/skills/synced/<id>/<name>/SKILL.md).
function* skillFiles(dir: string, depth = 0): Generator<string> {
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

/** Distinctive strings from the operator's skills and global instruction files. */
export function operatorMarkers(): string[] {
  const home = homedir();
  const out = new Set<string>();
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
  out.add(home);
  out.add(home.replace(/\\/g, '/'));
  out.add(home.replace(/\\/g, '\\\\'));
  return [...out];
}

// Raw client output stays on the operator's machine (see .gitignore), so only committed files are searched.
const UNCOMMITTED_FILE = /^(?:client-stdout\.txt|client-stderr\.txt|client-log\.jsonl|.*\.log)$/;
const UNCOMMITTED_DIR = new Set(['tmp', 'hermes-logs']);

function* textFiles(dir: string): Generator<string> {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) {
      if (!UNCOMMITTED_DIR.has(d.name)) yield* textFiles(p);
    } else if (!UNCOMMITTED_FILE.test(d.name) && statSync(p).size < 64 << 20) yield p;
  }
}

/** Files under runDir holding operator text, with the count of markers each holds. Markers are not returned. */
export function findOperatorText(runDir: string, markers: string[]): Array<{ file: string; hits: number }> {
  const found: Array<{ file: string; hits: number }> = [];
  for (const file of textFiles(runDir)) {
    const text = readFileSync(file, 'utf8');
    // JSON captures escape quotes and slashes, so compare against the unescaped text too.
    const plain = text.replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\\//g, '/');
    const hits = markers.filter((m) => text.includes(m) || plain.includes(m)).length;
    if (hits) found.push({ file: relative(runDir, file), hits });
  }
  return found;
}

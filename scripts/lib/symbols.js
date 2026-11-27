/**
 * Finds named definitions in source text by line patterns, without a parser.
 * A citation names the function, class or heading a claim rests on, as
 * `file:Symbol` or `file:Class.method`, and a refresh compares that
 * definition's text between two commits.
 *
 * Supported: Python, TypeScript and JavaScript, Rust, Go, Zig, C#, Java,
 * Kotlin, Swift, and Markdown headings. Other files are cited as the file.
 */

const LANG = {
  py: 'py',
  ts: 'js', tsx: 'js', js: 'js', mjs: 'js', cjs: 'js', jsx: 'js', mts: 'js', cts: 'js',
  rs: 'rs', go: 'go', zig: 'zig', cs: 'jvm', java: 'jvm', kt: 'jvm', swift: 'jvm',
  md: 'md', mdx: 'md',
};

export const languageOf = (file) => LANG[file.split('/').pop().split('.').pop().toLowerCase()] ?? null;
// Languages whose methods have no keyword, so a name followed by a parameter list is a definition.
const KEYWORDLESS_METHODS = new Set(['js', 'jvm']);

const NOT_A_NAME = new Set(['if', 'for', 'while', 'switch', 'catch', 'return', 'function', 'else', 'do', 'try', 'with', 'match', 'loop', 'new', 'await', 'typeof', 'super', 'constructor']);

/** The name a line defines, or null. `kind` is 'container' for a class-like block whose members get qualified names. */
function definitionOn(line, lang) {
  let m;
  if (lang === 'py') {
    if ((m = line.match(/^\s*class\s+([A-Za-z_]\w*)/))) return { name: m[1], kind: 'container' };
    if ((m = line.match(/^\s*(?:async\s+)?def\s+([A-Za-z_]\w*)/))) return { name: m[1], kind: 'member' };
    if ((m = line.match(/^([A-Z][A-Z0-9_]{2,})\s*(?::[^=]*)?=/))) return { name: m[1], kind: 'member' };
    return null;
  }
  if (lang === 'md') {
    if ((m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/))) return { name: m[2], kind: 'member', level: m[1].length };
    return null;
  }
  // Brace languages. Comments define nothing. A const or let counts at the top level, or anywhere when it holds a function.
  if (/^\s*(\/\/|\/\*|\*|#)/.test(line)) return null;
  const top = indentOf(line) === 0;
  const patterns = [
    [/^\s*(?:export\s+)?(?:default\s+)?(?:declare\s+)?(?:abstract\s+)?(?:public\s+|internal\s+|private\s+|protected\s+|sealed\s+|static\s+|partial\s+|open\s+|final\s+|data\s+)*(?:class|interface|struct|enum|trait|record|object|protocol|extension)\s+([A-Za-z_$][\w$]*)/, 'container'],
    [/^\s*impl(?:<[^>]*>)?\s+(?:[\w:<>, ]+\s+for\s+)?([A-Za-z_][\w]*)/, 'container'],
    [/^\s*(?:pub(?:\([^)]*\))?\s+)?(?:async\s+)?(?:unsafe\s+)?(?:extern\s+"[^"]*"\s+)?fn\s+([A-Za-z_]\w*)/, 'member'],
    [/^\s*(?:pub\s+)?(?:export\s+)?(?:inline\s+)?fn\s+([A-Za-z_]\w*)/, 'member'],
    [/^func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)/, 'member'],
    [/^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/, 'member'],
    [/^\s*(?:export\s+)?(?:declare\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=/, 'member'],
    [/^\s*(?:export\s+)?(?:type|interface)\s+([A-Za-z_$][\w$]*)/, 'member'],
    [/^\s*(?:pub\s+)?(?:const|var)\s+([A-Za-z_]\w*)\s*(?::[^=]+)?=/, 'member'],
    [/^\s*(?:pub(?:\([^)]*\))?\s+)?(?:const|static)\s+([A-Z_][A-Z0-9_]*)\s*:/, 'member'],
    [/^\s*(?:(?:public|private|protected|internal|static|async|readonly|override|abstract|virtual|sealed|final|suspend|fun|func|get|set|\*)\s+)*#?([A-Za-z_$][\w$]*)\s*(?:<[^>()]*>)?\s*\([^;]*$/, 'member'],
    [/^\s*([A-Za-z_$][\w$]*)\s*:\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*(?::[^=]+)?=>)/, 'member'],
  ];
  for (const [re, kind] of patterns) {
    if (!top && re === patterns[6][0] && !/=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*(?::[^=]+)?=>|[A-Za-z_$][\w$]*\s*=>|Effect\.(?:gen|fn\w*)\b)/.test(line)) continue;
    if (!top && re === patterns[8][0]) continue;
    if (!KEYWORDLESS_METHODS.has(lang) && (re === patterns[10][0] || re === patterns[11][0])) continue;
    if ((m = line.match(re)) && !NOT_A_NAME.has(m[1])) {
      // A method pattern also matches calls; a definition line opens a block or ends with a parameter list.
      if (re === patterns[10][0] && !/\{\s*$|\)\s*(?::[^=]*)?$|=>\s*\{?\s*$|,\s*$|\(\s*$/.test(line)) return null;
      return { name: m[1], kind };
    }
  }
  return null;
}

const indentOf = (line) => line.length - line.trimStart().length;

/** The 0-based index of the last line of the block that starts at `start`. */
function blockEnd(lines, start, lang, def) {
  if (lang === 'py') {
    // The block runs until a line at or left of the definition's indent, outside any open bracket.
    const base = indentOf(lines[start]);
    let depth = 0;
    let end = start;
    for (let i = start; i < lines.length; i++) {
      const l = lines[i];
      if (i > start && depth <= 0 && l.trim() && indentOf(l) <= base && !/^\s*[)\]}]/.test(l)) break;
      const code = l.replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""').replace(/#.*$/, '');
      depth += (code.match(/[([{]/g) ?? []).length - (code.match(/[)\]}]/g) ?? []).length;
      if (l.trim()) end = i;
    }
    return end;
  }
  if (lang === 'md') {
    for (let i = start + 1; i < lines.length; i++) {
      const m = lines[i].match(/^(#{1,6})\s/);
      if (m && m[1].length <= def.level) return i - 1;
    }
    return lines.length - 1;
  }
  // Brackets of every kind count, and the block ends where they all close. A line that leaves
  // none open ends it, unless the line stops mid-expression.
  let depth = 0;
  const midExpression = /(=>|=|,|\|\||&&|\?|:|\+|\.)\s*$/;
  for (let i = start; i < lines.length; i++) {
    const text = lines[i].replace(/(["'`])(?:\\.|(?!\1).)*\1/g, '""').replace(/\/\/.*$/, '');
    for (const ch of text) {
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth--;
    }
    if (depth <= 0 && !midExpression.test(text) && !/^\s*\./.test(lines[i + 1] ?? '')) return i;
  }
  return lines.length - 1;
}

/** Every definition in the text as {name, qualified, start, end} with 0-based line indexes. */
export function definitions(text, file) {
  const lang = languageOf(file);
  if (!lang) return [];
  const lines = text.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const def = definitionOn(lines[i], lang);
    if (!def) continue;
    out.push({ name: def.name, kind: def.kind, start: i, end: blockEnd(lines, i, lang, def) });
  }
  // A member inside a container gets the container's name as a prefix.
  for (const d of out) {
    if (lang === 'md') { d.qualified = d.name; continue; }
    const parent = out.filter((p) => p !== d && p.kind === 'container' && p.start < d.start && p.end >= d.end).sort((a, b) => b.start - a.start)[0];
    d.qualified = parent ? `${parent.name}.${d.name}` : d.name;
  }
  return out;
}

/**
 * The symbols that cover 1-based lines a..b: the innermost definition that
 * encloses the range, else the definitions that start inside it. Empty when
 * the lines are module-level code.
 */
export function symbolsFor(text, file, a, b) {
  const defs = definitions(text, file);
  const s = a - 1;
  const e = b - 1;
  const enclosing = defs.filter((d) => d.start <= s && d.end >= e).sort((x, y) => (x.end - x.start) - (y.end - y.start))[0];
  if (enclosing) return [enclosing.qualified];
  const inside = [...new Set(defs.filter((d) => d.start >= s && d.start <= e).map((d) => d.qualified))];
  return inside.length <= 3 ? inside : [];
}

/** The text of the named definition, every occurrence joined, or null when it is not there. */
export function symbolText(text, file, symbol) {
  const lines = text.split(/\r?\n/);
  const hits = definitions(text, file).filter((d) => d.qualified === symbol || (languageOf(file) !== 'md' && !symbol.includes('.') && d.name === symbol));
  if (!hits.length) return null;
  return hits.map((d) => lines.slice(d.start, d.end + 1).join('\n')).join('\n\n');
}

/**
 * Minimal YAML frontmatter reader. Handles the subset the note schema uses:
 * scalars, block sequences of scalars, nested maps, and sequences of maps.
 * Deliberately not a general YAML parser — notes that need more than this
 * should be simplified rather than the parser extended.
 */
export function parseFrontmatter(text, label) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const root = {};
  const stack = [{ indent: -1, node: root }];

  for (const line of lines) {
    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].node;

    if (trimmed.startsWith('- ')) {
      const item = trimmed.slice(2).trim();
      if (!Array.isArray(parent)) continue;
      if (item.includes(': ')) {
        const obj = {};
        const [k, ...rest] = item.split(': ');
        obj[k.trim()] = coerce(rest.join(': '));
        parent.push(obj);
        stack.push({ indent, node: obj });
      } else {
        parent.push(coerce(item));
      }
      continue;
    }

    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const rawValue = trimmed.slice(idx + 1).trim();

    if (rawValue === '') {
      // Container: an array if the next non-empty line is a sequence item.
      const node = nextIsSequence(lines, line) ? [] : {};
      if (Array.isArray(parent)) parent[parent.length - 1][key] = node;
      else parent[key] = node;
      stack.push({ indent, node });
    } else {
      const target = Array.isArray(parent) ? parent[parent.length - 1] : parent;
      target[key] = coerce(rawValue);
    }
  }
  return root;

  function nextIsSequence(all, current) {
    const i = all.indexOf(current);
    const currentIndent = current.length - current.trimStart().length;
    for (let j = i + 1; j < all.length; j++) {
      const ind = all[j].length - all[j].trimStart().length;
      if (ind <= currentIndent) return false;
      return all[j].trim().startsWith('- ');
    }
    return false;
  }
}

export function coerce(v) {
  let s = v.trim();
  if (s === '[]') return [];
  if (s === '{}') return {};
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  if (/^-?\d+$/.test(s)) return Number(s);
  if (s === 'true') return true;
  if (s === 'false') return false;
  return s;
}

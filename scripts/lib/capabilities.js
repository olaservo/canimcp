/**
 * Walks a registry entry into its capabilities. Shared by the site build and
 * the Worker's MCP server, so it uses no Node APIs.
 */

const NOT_CHILDREN = new Set(['evidence', 'research', 'notes', 'byProtocolVersion']);
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Extension name -> alias, from spec-versions.json. */
export function extensionAliases(spec) {
  const out = {};
  for (const [name, ext] of Object.entries(spec.extensions?.known ?? {})) if (ext.alias) out[name] = ext.alias;
  return out;
}

/**
 * Every capability in a client entry that has a status, as {id, node}. An id
 * is the dotted path of registry keys. An extension goes by its alias when
 * spec-versions.json gives it one.
 */
export function capabilityNodes(entry, aliases = {}) {
  const out = [];
  const walk = (node, path) => {
    if (!isObject(node)) return;
    if (typeof node.status === 'string') out.push({ id: path.join('.'), node });
    for (const [k, v] of Object.entries(node)) if (!NOT_CHILDREN.has(k)) walk(v, [...path, k]);
  };
  for (const [key, value] of Object.entries(entry)) {
    if (key === 'metadata' || key === 'byProtocolVersion') continue;
    if (key === 'extensions' && isObject(value)) {
      for (const [name, ext] of Object.entries(value)) walk(ext, [aliases[name] ?? `extensions.${name}`]);
    } else {
      walk(value, [key]);
    }
  }
  return out;
}

/** A capability node without its sub-capabilities. */
export function ownFields(node) {
  const out = {};
  for (const [k, v] of Object.entries(node)) if (!isObject(v) || NOT_CHILDREN.has(k)) out[k] = v;
  return out;
}

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

// --- protocol revisions ------------------------------------------------------

const OWN = ['status', 'notes', 'evidence', 'research'];

/** Protocol revisions are dates, so they sort as strings. */
export const newestRevision = (entry) => [...(entry.protocolVersions ?? [])].sort().pop() ?? null;

/** The revision a client negotiates with a server whose newest is `revision`: the newest it speaks at or below it. */
export const effectiveRevision = (entry, revision) => (entry.protocolVersions ?? []).filter((v) => v <= revision).sort().pop() ?? null;

/**
 * True when the entry's rows are recorded per revision: its newest revision is
 * older than the baseline, so the top level is that revision, or it has
 * byProtocolVersion records. Otherwise one set of rows stands for every
 * revision it speaks.
 */
export const recordedPerRevision = (entry, baseline) => newestRevision(entry) < baseline || Object.keys(entry.byProtocolVersion ?? {}).length > 0;

/** The baseline revision first, then each revision some entry has byProtocolVersion records for, newest first. */
export function revisionViews(entries, spec) {
  const baseline = spec.protocolVersions.find((v) => v.status === 'current').version;
  const older = new Set(entries.flatMap(([, e]) => Object.keys(e.byProtocolVersion ?? {})));
  older.delete(baseline);
  return [baseline, ...[...older].sort().reverse()];
}

/** Lays an override over a capability tree. An override that sets a status replaces the claim as a unit: status, notes, evidence and research. */
function overlay(top, over) {
  const out = isObject(top) ? { ...top } : typeof top === 'string' ? { status: top } : {};
  if (typeof over.status === 'string') for (const k of OWN) delete out[k];
  for (const [k, v] of Object.entries(over)) out[k] = isObject(v) && !OWN.includes(k) ? overlay(out[k], v) : v;
  return out;
}

/**
 * A client entry as a server whose newest revision is `revision` sees it. The
 * client negotiates the newest revision it speaks at or below that one; its
 * byProtocolVersion record for that revision, if any, is laid over the top
 * level. Returns null when the client speaks nothing at or below it.
 * `override` is the record applied, or null.
 */
export function entryAt(entry, revision) {
  const negotiated = effectiveRevision(entry, revision);
  if (!negotiated) return null;
  const { byProtocolVersion, ...rest } = entry;
  const override = negotiated === newestRevision(entry) ? null : byProtocolVersion?.[negotiated] ?? null;
  return { entry: override ? overlay(rest, override) : rest, revision: negotiated, override };
}

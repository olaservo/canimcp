#!/usr/bin/env node
/**
 * Validates the client registry and the research notes, and checks that every
 * `research:` reference in the registry resolves to a note that exists.
 *
 * Usage: node scripts/validate.js [clients.json ...]
 * With no arguments, validates data/clients.json, data/clients.example.json
 * and every note in research/.
 */

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const REGISTRY_SCHEMA = 'schema/mcp-client-registry.schema.json';
const NOTE_SCHEMA = 'schema/research-note.schema.json';
const RESEARCH_DIR = 'research';

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

const VERIFIED_SCHEMA = 'schema/verified-evidence.schema.json';
const VERIFIED_DIR = 'data/verified';

const registrySchema = readJson(REGISTRY_SCHEMA);
const validateRegistry = ajv.compile(registrySchema);
const validateNote = ajv.compile(readJson(NOTE_SCHEMA));
// The overlay schema refers to the registry schema's Evidence by $id.
const validateVerified = ajv.compile(readJson(VERIFIED_SCHEMA));
const OBSERVED_SCHEMA = 'schema/observed-evidence.schema.json';
const OBSERVED_DIR = 'data/observed';
const validateObserved = ajv.compile(readJson(OBSERVED_SCHEMA));

let failures = 0;

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

function report(label, ok, errors) {
  if (ok) {
    console.log(`  ok    ${label}`);
    return;
  }
  failures++;
  console.log(`  FAIL  ${label}`);
  for (const e of errors ?? []) {
    console.log(`          ${e.instancePath || '/'} ${e.message}`);
  }
}

/**
 * Minimal YAML frontmatter reader. Handles the subset the note schema uses:
 * scalars, block sequences of scalars, nested maps, and sequences of maps.
 * Deliberately not a general YAML parser — notes that need more than this
 * should be simplified rather than the parser extended.
 */
function parseFrontmatter(text, label) {
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

function coerce(v) {
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

// --- research notes -------------------------------------------------------

const noteIds = new Set();
console.log('research notes');
if (existsSync(RESEARCH_DIR)) {
  const files = readdirSync(RESEARCH_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) console.log('  (none)');
  for (const f of files) {
    const label = join(RESEARCH_DIR, f);
    const fm = parseFrontmatter(readFileSync(label, 'utf8'), label);
    if (!fm) {
      report(label, false, [{ message: 'no YAML frontmatter block' }]);
      continue;
    }
    const ok = validateNote(fm);
    report(label, ok, validateNote.errors);
    if (ok) {
      if (fm.id !== basename(f, '.md')) {
        failures++;
        console.log(`  FAIL  ${label}`);
        console.log(`          id "${fm.id}" does not match filename`);
      }
      noteIds.add(fm.id);
    }
  }
} else {
  console.log('  (no research/ directory)');
}

// --- registries -----------------------------------------------------------

const targets =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ['data/clients.json', 'data/clients.example.json'].filter(existsSync);

console.log('\nclient registries');
for (const t of targets) {
  const data = readJson(t);
  const clients = Object.fromEntries(
    Object.entries(data).filter(([k]) => !k.startsWith('$'))
  );
  const ok = validateRegistry(clients);
  report(`${t} (${Object.keys(clients).length} clients)`, ok, validateRegistry.errors);

  // Cross-check: every research id referenced must exist, and
  // preferredProtocolVersion must be one of protocolVersions.
  for (const [key, entry] of Object.entries(clients)) {
    for (const id of collectResearchRefs(entry)) {
      if (!noteIds.has(id)) {
        failures++;
        console.log(`  FAIL  ${t}`);
        console.log(`          ${key}: research note "${id}" not found in ${RESEARCH_DIR}/`);
      }
    }
    const pref = entry.preferredProtocolVersion;
    if (pref && !(entry.protocolVersions ?? []).includes(pref)) {
      failures++;
      console.log(`  FAIL  ${t}`);
      console.log(`          ${key}: preferredProtocolVersion "${pref}" not in protocolVersions`);
    }
  }
}

// --- probe evidence overlays ----------------------------------------------

if (process.argv.slice(2).length === 0) {
  console.log('\nverified evidence');
  if (existsSync(VERIFIED_DIR)) {
    const files = readdirSync(VERIFIED_DIR).filter((f) => f.endsWith('.json'));
    if (files.length === 0) console.log('  (none)');
    const capabilityIds = knownCapabilityIds(readJson('data/spec-versions.json'));
    for (const f of files) {
      const label = join(VERIFIED_DIR, f);
      const data = readJson(label);
      const ok = validateVerified(data);
      report(`${label} (${Object.values(data.capabilities ?? {}).reduce((n, c) => n + (c.evidence?.length ?? 0), 0)} records)`, ok, validateVerified.errors);
      for (const id of Object.keys(data.capabilities ?? {})) {
        if (!capabilityIds.has(id)) {
          failures++;
          console.log(`  FAIL  ${label}`);
          console.log(`          capability "${id}" is not in data/spec-versions.json`);
        }
      }
    }
  } else {
    console.log('  (no data/verified directory)');
  }

  console.log('\nobserved evidence');
  if (existsSync(OBSERVED_DIR)) {
    const capabilityIds = knownCapabilityIds(readJson('data/spec-versions.json'));
    const registry = readJson('data/clients.json');
    for (const f of readdirSync(OBSERVED_DIR).filter((f) => f.endsWith('.json'))) {
      const label = join(OBSERVED_DIR, f);
      const data = readJson(label);
      const ok = validateObserved(data);
      const records = (data.clients ?? []).reduce((n, c) => n + Object.values(c.capabilities ?? {}).reduce((m, x) => m + (x.evidence?.length ?? 0), 0), 0);
      report(`${label} (${data.clients?.length ?? 0} clients, ${records} records)`, ok, validateObserved.errors);
      for (const c of data.clients ?? []) {
        const bad = Object.keys(c.capabilities ?? {}).filter((id) => !capabilityIds.has(id));
        if (c.registryId && !registry[c.registryId]) bad.push(`registryId "${c.registryId}" has no entry in data/clients.json`);
        for (const b of bad) {
          failures++;
          console.log(`  FAIL  ${label} ${c.id}`);
          console.log(`          ${b.startsWith('registryId') ? b : `capability "${b}" is not in data/spec-versions.json`}`);
        }
      }
    }
  } else {
    console.log('  (no data/observed directory)');
  }
}

function knownCapabilityIds(spec) {
  const ids = new Set(Object.keys(spec.capabilities ?? {}));
  for (const ext of Object.values(spec.extensions?.known ?? {})) {
    for (const id of Object.keys(ext.features ?? {})) ids.add(id);
  }
  return ids;
}

function collectResearchRefs(node, out = []) {
  if (Array.isArray(node)) {
    for (const n of node) collectResearchRefs(n, out);
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'research' && Array.isArray(v)) out.push(...v);
      else collectResearchRefs(v, out);
    }
  }
  return out;
}

console.log('');
if (failures > 0) {
  console.error(`${failures} failure(s)`);
  process.exit(1);
}
console.log('all valid');

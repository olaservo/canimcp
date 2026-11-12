/**
 * Migrates mcp-clients.json to enhanced canimcp format.
 *
 * Usage: node scripts/migrate.js
 *
 * Reads from: ../mcp-client-capabilities/src/mcp_client_capabilities/mcp-clients.json
 * Writes to: data/clients.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Source and destination paths
const SOURCE_PATH = join(ROOT_DIR, '..', 'mcp-client-capabilities', 'src', 'mcp_client_capabilities', 'mcp-clients.json');
const DEST_PATH = join(ROOT_DIR, 'data', 'clients.json');

// Category inference rules
const CATEGORY_RULES = [
  // IDEs and editors
  { pattern: /vscode|visual studio|cursor|windsurf|zed|jetbrains|xcode|cline|kilo|roo|continue/i, category: 'ide' },
  // Chat interfaces
  { pattern: /claude\.ai|chatgpt|mistral|cherry|le chat|lobehub|librechat/i, category: 'chat' },
  // CLI tools
  { pattern: /cli|claude-code|goose|opencode|gemini-cli|crush|codex/i, category: 'cli' },
  // Automation platforms
  { pattern: /n8n|make|apify|dust|factory|postman|arcade|gitguardian/i, category: 'automation' },
  // Browser extensions
  { pattern: /raycast|browser|extension/i, category: 'browser-extension' },
];

// Platform inference from URL or name
const PLATFORM_RULES = [
  { pattern: /macos|mac|raycast|xcode/i, platforms: ['macos'] },
  { pattern: /windows/i, platforms: ['windows'] },
  { pattern: /linux/i, platforms: ['linux'] },
  { pattern: /ios|iphone|ipad/i, platforms: ['ios'] },
  { pattern: /android/i, platforms: ['android'] },
  { pattern: /web|\.ai$|\.com$|browser/i, platforms: ['web'] },
];

// Vendor inference from URL
const VENDOR_RULES = [
  { pattern: /anthropic|claude/i, vendor: 'Anthropic' },
  { pattern: /openai|chatgpt|codex/i, vendor: 'OpenAI' },
  { pattern: /microsoft|vscode|visual studio/i, vendor: 'Microsoft' },
  { pattern: /google|antigravity|gemini/i, vendor: 'Google' },
  { pattern: /jetbrains/i, vendor: 'JetBrains' },
  { pattern: /github|copilot/i, vendor: 'GitHub' },
  { pattern: /amazon|aws|q-dev/i, vendor: 'Amazon' },
  { pattern: /cursor/i, vendor: 'Cursor' },
  { pattern: /codeium|windsurf/i, vendor: 'Codeium' },
  { pattern: /mistral/i, vendor: 'Mistral AI' },
  { pattern: /zed/i, vendor: 'Zed Industries' },
];

/**
 * Infers category from client ID and title.
 */
function inferCategory(id, title, url) {
  const text = `${id} ${title} ${url}`;
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(text)) {
      return rule.category;
    }
  }
  return 'other';
}

/**
 * Infers platforms from client ID, title, and URL.
 */
function inferPlatforms(id, title, url) {
  const text = `${id} ${title} ${url}`;
  const platforms = new Set();

  for (const rule of PLATFORM_RULES) {
    if (rule.pattern.test(text)) {
      rule.platforms.forEach(p => platforms.add(p));
    }
  }

  // Default: assume desktop apps support all desktop platforms
  if (platforms.size === 0) {
    // IDEs typically support all desktop
    const category = inferCategory(id, title, url);
    if (category === 'ide' || category === 'cli') {
      return ['windows', 'macos', 'linux'];
    }
    // Chat apps are often web-based
    if (category === 'chat') {
      return ['web'];
    }
  }

  return Array.from(platforms);
}

/**
 * Infers vendor from client ID, title, and URL.
 */
function inferVendor(id, title, url) {
  const text = `${id} ${title} ${url}`;
  for (const rule of VENDOR_RULES) {
    if (rule.pattern.test(text)) {
      return rule.vendor;
    }
  }
  return undefined;
}

/**
 * Checks if a client is open source based on URL patterns.
 */
function inferOpenSource(url) {
  if (!url) return undefined;
  if (url.includes('github.com') || url.includes('gitlab.com')) {
    return true;
  }
  return undefined;
}

/**
 * Migrates a single client entry to enhanced format.
 */
function migrateClient(id, oldRecord) {
  const { title, url, protocolVersion, ...capabilities } = oldRecord;

  const enhanced = {
    title,
    url,
    protocolVersion,
    category: inferCategory(id, title, url),
    platforms: inferPlatforms(id, title, url),
    transports: {
      stdio: {},  // Most clients support stdio, mark as present
    },
  };

  // Copy capabilities, preserving structure
  if (capabilities.tools) {
    enhanced.tools = capabilities.tools;
  }
  if (capabilities.resources) {
    enhanced.resources = capabilities.resources;
  }
  if (capabilities.prompts) {
    enhanced.prompts = capabilities.prompts;
  }
  if (capabilities.sampling) {
    enhanced.sampling = capabilities.sampling;
  }
  if (capabilities.elicitation) {
    enhanced.elicitation = capabilities.elicitation;
  }
  if (capabilities.roots) {
    enhanced.roots = capabilities.roots;
  }
  if (capabilities.completions) {
    enhanced.completions = capabilities.completions;
  }
  if (capabilities.logging) {
    enhanced.logging = capabilities.logging;
  }

  // Add metadata
  const vendor = inferVendor(id, title, url);
  const openSource = inferOpenSource(url);

  if (vendor || openSource !== undefined) {
    enhanced.metadata = {};
    if (vendor) enhanced.metadata.vendor = vendor;
    if (openSource !== undefined) enhanced.metadata.openSource = openSource;
  }

  return enhanced;
}

/**
 * Deduplicates clients with same title, merging capabilities.
 */
function deduplicateClients(clients) {
  const byTitle = new Map();

  for (const [id, client] of Object.entries(clients)) {
    const key = client.title.toLowerCase().replace(/\s+/g, '-');

    if (byTitle.has(key)) {
      // Merge capabilities (prefer more complete entry)
      const existing = byTitle.get(key);
      const merged = { ...existing.client };

      // Merge each capability, preferring non-empty
      for (const cap of ['tools', 'resources', 'prompts', 'sampling', 'elicitation', 'roots', 'completions', 'logging']) {
        if (client[cap] && Object.keys(client[cap]).length > 0) {
          merged[cap] = { ...merged[cap], ...client[cap] };
        }
      }

      // Prefer entry with more capabilities
      const existingCaps = Object.keys(existing.client).filter(k => !['title', 'url', 'protocolVersion', 'category', 'platforms', 'transports', 'metadata'].includes(k)).length;
      const newCaps = Object.keys(client).filter(k => !['title', 'url', 'protocolVersion', 'category', 'platforms', 'transports', 'metadata'].includes(k)).length;

      if (newCaps > existingCaps) {
        merged.url = client.url;
        merged.protocolVersion = client.protocolVersion;
      }

      byTitle.set(key, { id: existing.id, client: merged });
    } else {
      byTitle.set(key, { id, client });
    }
  }

  // Convert back to object
  const result = {};
  for (const [key, { id, client }] of byTitle) {
    // Use cleaned key as ID for consistency
    result[key] = client;
  }

  return result;
}

// --- Unified-shape conversion -------------------------------------------------
// The inference + dedup steps above operate on the legacy presence-based shape
// (singular protocolVersion, `{}` = supported, `listChanged: true`). This final
// pass converts each deduplicated entry to the schema's unified status shape
// (protocolVersions[], status strings/objects). See schema/mcp-client-registry.schema.json.

const PASSTHROUGH = new Set(['title', 'url', 'description', 'category', 'platforms', 'metadata']);

/** Convert a legacy sub-feature value (true | {} | nested) to a CapabilityStatus. */
function convSub(value) {
  if (value === true) return 'full';
  if (value && typeof value === 'object') {
    return Object.keys(value).length === 0 ? 'full' : convContainer(value);
  }
  return value;
}

/** Convert a legacy capability value to the unified shape ("full" or { status, ...subs }). */
function convContainer(value) {
  if (value === true) return 'full';
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && Object.keys(value).length === 0) return 'full';
  const out = { status: 'full' };
  for (const [k, v] of Object.entries(value)) out[k] = convSub(v);
  return out;
}

/** transports/authentication are plain name -> CapabilityStatus maps (no top-level status). */
function convMap(value) {
  const out = {};
  for (const [k, v] of Object.entries(value)) out[k] = convSub(v);
  return out;
}

/** Convert one legacy entry to the unified shape, preserving a readable key order. */
function toUnifiedShape(client) {
  const out = {};
  for (const k of ['title', 'url', 'description']) if (k in client) out[k] = client[k];
  if (client.protocolVersion) {
    out.protocolVersions = [client.protocolVersion];
    out.preferredProtocolVersion = client.protocolVersion;
  }
  for (const k of ['category', 'platforms']) if (k in client) out[k] = client[k];
  for (const [k, v] of Object.entries(client)) {
    if (PASSTHROUGH.has(k) || k === 'protocolVersion') continue;
    out[k] = (k === 'transports' || k === 'authentication') ? convMap(v) : convContainer(v);
  }
  if ('metadata' in client) out.metadata = client.metadata;
  return out;
}

// Main migration
console.log('Reading source data...');
const sourceData = JSON.parse(readFileSync(SOURCE_PATH, 'utf-8'));
console.log(`Found ${Object.keys(sourceData).length} clients in source.`);

console.log('Migrating clients...');
const migrated = {};
for (const [id, record] of Object.entries(sourceData)) {
  migrated[id] = migrateClient(id, record);
}

console.log('Deduplicating...');
const deduplicated = deduplicateClients(migrated);
console.log(`Deduplicated to ${Object.keys(deduplicated).length} unique clients.`);

console.log('Converting to unified schema shape...');
const unified = Object.fromEntries(
  Object.entries(deduplicated).map(([id, client]) => [id, toUnifiedShape(client)])
);

// Sort by title
const sorted = Object.fromEntries(
  Object.entries(unified).sort(([, a], [, b]) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  )
);

console.log('Writing output...');
mkdirSync(join(ROOT_DIR, 'data'), { recursive: true });
writeFileSync(DEST_PATH, JSON.stringify(sorted, null, 2) + '\n');

console.log(`Migration complete. Output: ${DEST_PATH}`);
console.log('\nRun "npm run validate" to verify the output.');

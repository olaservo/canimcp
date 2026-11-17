#!/usr/bin/env node
/**
 * Compares the built site/ with what a running copy of the site serves.
 *
 * Before a deploy it lists what the deploy will change. After one, `--expect-equal`
 * fails on any difference. Run `npm run build:site` first.
 *
 * Usage:
 *   node scripts/check-live.js                         site/ against https://canimcp.io
 *   node scripts/check-live.js --expect-equal          exit 1 unless they match
 *   node scripts/check-live.js --origin http://127.0.0.1:8911   against a local preview
 *   node scripts/check-live.js --all                   list every path, not the first 30
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const at = args.indexOf('--origin');
const origin = (at >= 0 && args[at + 1] ? args[at + 1] : 'https://canimcp.io').replace(/\/$/, '');
const SITE = 'site';
// `_headers` configures the asset server and 404.html is served with a 404 status.
const SKIP = new Set(['_headers', '404.html', '404.md']);
// Cloudflare Web Analytics adds its script to every HTML page it serves.
const BEACON = /<script\b[^>]*static\.cloudflareinsights\.com\/beacon[^>]*><\/script>\n?/;

if (!existsSync(join(SITE, 'sitemap.xml'))) {
  console.error('check-live: no build in site/. Run `npm run build:site` first.');
  process.exit(2);
}

const walk = (dir, prefix = '') => readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((e) => {
  const rel = prefix ? `${prefix}/${e.name}` : e.name;
  return e.isDirectory() ? walk(dir, rel) : [rel];
});

/** The URL path a built file is served at. HTML pages are served without the extension. */
const urlPath = (file) => {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  if (file.endsWith('.html')) return `/${file.slice(0, -'.html'.length)}`;
  return `/${file}`;
};

async function pool(items, size, fn) {
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) await fn(items[next++]);
  }));
}

const files = walk(SITE).filter((f) => !SKIP.has(f)).sort();
const missing = [];
const changed = [];
const failed = [];

await pool(files, 12, async (file) => {
  const headers = file.endsWith('.html') ? { Accept: 'text/html' } : {};
  try {
    const res = await fetch(origin + urlPath(file), { headers });
    if (res.status === 404) return void missing.push(file);
    if (!res.ok) return void failed.push(`${file} (${res.status})`);
    let live = Buffer.from(await res.arrayBuffer());
    if (file.endsWith('.html')) live = Buffer.from(live.toString('utf8').replace(BEACON, ''));
    if (!live.equals(readFileSync(join(SITE, file)))) changed.push(file);
  } catch (err) {
    failed.push(`${file} (${err.cause?.code ?? err.message})`);
  }
});

// Pages the running site lists and this build does not have. A deploy would remove them.
const locs = (xml) => new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
const removed = [];
try {
  const res = await fetch(`${origin}/sitemap.xml`);
  if (res.ok) {
    const local = locs(readFileSync(join(SITE, 'sitemap.xml'), 'utf8'));
    removed.push(...[...locs(await res.text())].filter((p) => !local.has(p)).sort());
  } else failed.push(`sitemap.xml (${res.status})`);
} catch (err) {
  failed.push(`sitemap.xml (${err.cause?.code ?? err.message})`);
}

// The MCP server reads the same published JSON, so its client count should match the build.
const builtClients = JSON.parse(readFileSync(join(SITE, 'data', 'clients', 'index.json'), 'utf8'));
const builtCount = (builtClients.clients ?? builtClients).length;
let mcpCount = null;
try {
  const res = await fetch(`${origin}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'list_clients', arguments: {} } }),
  });
  const text = await res.text();
  const body = JSON.parse(text.split('\n').find((l) => l.startsWith('data:'))?.slice(5) ?? text);
  const result = body.result?.structuredContent ?? JSON.parse(body.result.content[0].text);
  mcpCount = result.clients.length;
} catch (err) {
  failed.push(`/mcp list_clients (${err.message})`);
}

const show = (label, list) => {
  console.log(`${label}: ${list.length}`);
  const shown = flag('--all') ? list : list.slice(0, 30);
  for (const item of shown) console.log(`  ${item}`);
  if (shown.length < list.length) console.log(`  and ${list.length - shown.length} more, see --all`);
};

console.log(`check-live: ${files.length} built files against ${origin}`);
show('In the build, not served', missing);
show('Served with different content', changed);
show('Served pages absent from the build', removed);
console.log(`MCP list_clients: ${mcpCount ?? 'no answer'} served, ${builtCount} in the build`);
if (failed.length) show('Could not check', failed);

const equal = !missing.length && !changed.length && !removed.length && !failed.length && mcpCount === builtCount;
console.log(equal ? 'The running site matches the build.' : 'The running site differs from the build.');
if (failed.length || (flag('--expect-equal') && !equal)) process.exit(1);

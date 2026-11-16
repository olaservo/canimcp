#!/usr/bin/env node
/**
 * Builds the static site into site/.
 *
 * Every page is written twice: HTML, and a Markdown twin at the same path with
 * `.md` appended. The Markdown is the source; the HTML is rendered from it.
 * Also writes the JSON Schemas at their `$id` paths, the registry under /data,
 * the OpenAPI document and the catalogs under /.well-known that describe it,
 * llms.txt, sitemap.xml, robots.txt and _headers.
 *
 * Fails when an internal link does not resolve, a served Markdown file has an
 * unclosed code fence, or a page's text is over the size budget.
 *
 * Usage: node scripts/build-site.js
 */

import { SkillsExtension, memorySkillFiles } from '@modelcontextprotocol/server/ext/skills';
import { marked } from 'marked';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { API_CATALOG_TYPE, OPENAPI_TYPE, buildApiFiles, checkApiFiles } from './lib/api-files.js';
import { buildCapabilityIndex } from './lib/capability-index.js';
import { capabilityJson, capabilityPage, indexJson, matrixPage } from './lib/capability-pages.js';
import { KIND_LABEL, KIND_MEANING, KINDS, kindOf } from './lib/kinds.js';
import { parseFrontmatter } from './lib/frontmatter.js';
import { SERVER as MCP_SERVER, TOOLS as MCP_TOOLS } from '../worker/mcp-tools.js';

const ORIGIN = 'https://canimcp.io';
const REPO = 'https://github.com/olaservo/canimcp';
const SITE_NAME = 'canimcp';
const TAGLINE = 'Which MCP clients support what, how each claim is known, and research notes on the parts a support matrix cannot express.';
const KEYWORDS = ['Model Context Protocol', 'MCP', 'MCP clients', 'MCP client capabilities', 'MCP client support'];
// The subject of the site, linked to the pages that define it.
const MCP_ENTITY = {
  '@type': 'Thing', name: 'Model Context Protocol',
  sameAs: ['https://modelcontextprotocol.io/', 'https://en.wikipedia.org/wiki/Model_Context_Protocol'],
};
// Ora's page-token-budget check: about 25K tokens of extracted text.
const MAX_PAGE_CHARS = 100_000;
const MAX_LLMS_CHARS = 30_000;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'site');
const today = new Date().toISOString().slice(0, 10);

const read = (...p) => readFileSync(join(root, ...p), 'utf8').replace(/\r\n/g, '\n');
const readJson = (...p) => JSON.parse(readFileSync(join(root, ...p), 'utf8'));

function write(rel, content) {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

/** Date of the last commit that touched a source file, or today when git has no answer. */
function lastmod(...paths) {
  try {
    const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  } catch { /* not a git checkout */ }
  return today;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const yamlString = (s) => JSON.stringify(String(s));
const stripMd = (s) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_<>]/g, '').replace(/\s+/g, ' ').trim();

function firstParagraph(md) {
  const para = md.split('\n\n').map((b) => b.trim()).find((b) => b && !b.startsWith('#') && !b.startsWith('|'));
  const text = stripMd(para || '');
  return text.length > 300 ? `${text.slice(0, 297).replace(/\s+\S*$/, '')}...` : text;
}

const h1 = (md) => (md.match(/^# (.+)$/m) || [, ''])[1].trim();

// --- links ------------------------------------------------------------------

const cardUrl = (id) => (id === 'observed' || id === 'tool-results' ? `/${id}` : `/clients/${id}`);

/** Rewrites a source file's relative links to site paths. `from` is `cards` or `research`. */
function siteLinks(md, from, label) {
  return md.replace(/\]\((?!https?:|mailto:|#|\/)([^)\s]+)\)/g, (_, target) => {
    const [path, frag = ''] = target.split('#');
    const hash = frag ? `#${frag}` : '';
    let m;
    if (path.startsWith('../probe/')) return `](${REPO}/blob/main/${path.slice(3)}${hash})`;
    if ((m = path.match(/^\.\.\/research\/([^/]+)\.md$/))) return `](/research/${m[1]}${hash})`;
    if ((m = path.match(/^\.\.\/cards\/([^/]+)\.md$/))) return `](${cardUrl(m[1])}${hash})`;
    if ((m = path.match(/^([^/]+)\.md$/))) return `](${from === 'cards' ? cardUrl(m[1]) : `/research/${m[1]}`}${hash})`;
    throw new Error(`${label}: no site path for relative link "${target}"`);
  });
}

// --- pages ------------------------------------------------------------------

/** @type {{url:string,title:string,description:string,md:string,lastmod:string,frontmatter?:string,type?:string}[]} */
const pages = [];
const page = (p) => { pages.push(p); return p; };

const clients = Object.entries(readJson('data', 'clients.json')).filter(([k]) => !k.startsWith('$'));
const verifiedFiles = readdirSync(join(root, 'data', 'verified')).filter((f) => f.endsWith('.json')).sort();
const verified = verifiedFiles.map((f) => readJson('data', 'verified', f));

// Each folder under skills/ is an Agent Skill. The same bytes are published
// under /.well-known/agent-skills and, through the bundle, by the MCP server.
const skillBundle = {};
(function walk(dir, rel) {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.isDirectory()) walk(join(dir, e.name), `${rel}${e.name}/`);
    else skillBundle[`${rel}${e.name}`] = read('skills', `${rel}${e.name}`);
  }
})(join(root, 'skills'), '');
// The SDK that serves the skills also checks them here, so a bad skill fails the build.
const skillCatalog = await SkillsExtension.load(memorySkillFiles(skillBundle), { strict: true });
const skills = skillCatalog.entries.map((s) => {
  const dir = s.uri.replace(/^skill:\/\//, '').replace(/\/SKILL\.md$/, '');
  if (s.resources.length !== 1) throw new Error(`skills/${dir}: has ${s.resources.length} files, and the discovery index publishes a single SKILL.md per skill`);
  return {
    name: s.frontmatter.name, description: s.frontmatter.description, uri: s.uri, digest: s.resources[0].digest,
    url: `${ORIGIN}/.well-known/agent-skills/${dir}/SKILL.md`, file: `${dir}/SKILL.md`,
  };
});

// Client cards, and the two generated cross-client cards.
const cardFiles = readdirSync(join(root, 'cards')).filter((f) => f.endsWith('.md')).sort();
for (const f of cardFiles) {
  const id = f.slice(0, -3);
  if (id === 'tool-results') continue;
  const md = siteLinks(read('cards', f), 'cards', `cards/${f}`);
  page({ url: cardUrl(id), title: h1(md), description: firstParagraph(md), md, lastmod: lastmod(`cards/${f}`) });
}

// cards/tool-results.md is over the page budget, so the per-client record
// tables under "Every record" become one page each.
const toolResultPages = [];
{
  const src = siteLinks(read('cards', 'tool-results.md'), 'cards', 'cards/tool-results.md');
  const mod = lastmod('cards/tool-results.md');
  const cut = src.indexOf('\n## Every record\n');
  if (cut === -1) throw new Error('cards/tool-results.md: no "## Every record" section');
  const head = src.slice(0, cut).trimEnd();
  const sections = src.slice(cut).split(/\n(?=### )/).slice(1);
  for (const s of sections) {
    const title = s.match(/^### (.+)$/m)[1].trim();
    const body = s.replace(/^### .+\n/, '').trim();
    const overlay = body.match(/data\/verified\/([a-z0-9-]+)\.json/);
    const slug = overlay ? overlay[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const summary = stripMd(body.split('\n\n')[0]);
    toolResultPages.push({ slug, title, summary });
    page({
      url: `/tool-results/${slug}`,
      title: `Tool result records: ${title}`,
      description: `Every probe record for ${title}. ${summary}`,
      md: `# Tool result records: ${title}\n\nThe verdict line for each probe run, with a link to the record and its captures. The cross-client matrix is on [Tool result handling, verified](/tool-results).\n\n${body}\n`,
      lastmod: mod,
    });
  }
  const list = toolResultPages.map((p) => `- [${p.title}](/tool-results/${p.slug}): ${p.summary}`).join('\n');
  const md = `${head}\n\n## Every record\n\nThe full verdict line per run, with a link to the record and its captures, one page per client.\n\n${list}\n`;
  page({ url: '/tool-results', title: h1(md), description: firstParagraph(md), md, lastmod: mod });
}

// Research notes.
const notes = [];
const noteFiles = readdirSync(join(root, 'research')).filter((f) => f.endsWith('.md')).sort();
for (const f of noteFiles) {
  const id = f.slice(0, -3);
  const text = read('research', f);
  const fm = parseFrontmatter(text, f);
  const block = text.match(/^---\n[\s\S]*?\n---\n/);
  if (!fm || !block) throw new Error(`research/${f}: no frontmatter`);
  const mod = lastmod(`research/${f}`);
  const url = `/research/${id}`;
  let body = siteLinks(text.slice(block[0].length).trim(), 'research', `research/${f}`);

  const meta = [
    `Kind: ${fm.kind}`,
    `Status: ${fm.status}`,
    fm.lastVerified && `Last verified: ${fm.lastVerified}`,
    fm.clients?.length && `Clients: ${fm.clients.map((c) => (cardFiles.includes(`${c}.md`) ? `[${c}](${cardUrl(c)})` : c)).join(', ')}`,
    fm.specVersions?.length && `Revisions: ${fm.specVersions.map((v) => `\`${v}\``).join(', ')}`,
  ].filter(Boolean).join(' · ');
  body = body.replace(/^(# .+)$/m, `$1\n\n${meta}`);

  if (fm.sources?.length && !/^## Sources$/m.test(body)) {
    const items = fm.sources.map((s) => {
      const at = [s.commit && `commit \`${s.commit}\``, s.path && `\`${s.path}\``, s.date].filter(Boolean).join(', ');
      return `- [${s.title || s.url}](${s.url})${at ? `, ${at}` : ''}`;
    });
    body += `\n\n## Sources\n\n${items.join('\n')}`;
  }
  // A related id with no note file yet is listed without a link.
  if (fm.related?.length) {
    body += `\n\n## Related notes\n\n${fm.related.map((r) => (noteFiles.includes(`${r}.md`) ? `- [${r}](/research/${r})` : `- ${r}`)).join('\n')}`;
  }

  notes.push({ id, fm, url });
  page({
    url, title: fm.title, description: fm.summary, md: `${body}\n`, lastmod: mod,
    frontmatter: `${block[0].trimEnd().replace(/\n---$/, '')}\ncanonical: ${ORIGIN}${url}\nlast-updated: ${mod}\n---\n`,
  });
}

// Capabilities: the registry, the probe's overlays, the telemetry and the
// lifecycle joined by capability id, as one page each and a matrix.
const observedOverlays = readdirSync(join(root, 'data', 'observed')).filter((f) => f.endsWith('.json')).sort().map((f) => readJson('data', 'observed', f));
const capIndex = buildCapabilityIndex({
  clients, spec: readJson('data', 'spec-versions.json'), verified, observed: observedOverlays,
  probeClients: readJson('probe', 'registry', 'clients.json').clients, probeSdks: readJson('probe', 'registry', 'sdks.json').sdks,
  notes, origin: ORIGIN,
});
{
  const slugs = new Set(capIndex.capabilities.map((c) => c.slug));
  if (slugs.size !== capIndex.capabilities.length) throw new Error('two capability ids share a page slug');
  const mod = lastmod('data', 'probe/registry/clients.json');
  const noteTitles = Object.fromEntries(notes.map((n) => [n.id, n.fm.title]));
  for (const cap of capIndex.capabilities) {
    const md = capabilityPage(cap, capIndex, { origin: ORIGIN, noteTitles });
    page({ url: `/capabilities/${cap.slug}`, title: `${cap.id} support in MCP clients`, description: firstParagraph(md), md: `${md}\n`, lastmod: mod });
  }
  const md = matrixPage(capIndex, { origin: ORIGIN });
  page({ url: '/capabilities/', title: 'Capabilities', description: firstParagraph(md), md: `${md}\n`, lastmod: mod });
}

const api = buildApiFiles({
  origin: ORIGIN, repo: REPO, version: readJson('package.json').version, tagline: TAGLINE,
  clients: clients.map(([id, c]) => ({ id, title: c.title })), verified, skills,
  capabilitySlugs: capIndex.capabilities.map((c) => c.slug),
});

// Index pages.
const clientRows = clients.map(([id, c]) => {
  const m = c.metadata || {};
  return `| [${c.title}](/clients/${id}) | ${m.vendor || ''} | ${kindOf(c)} | ${c.category || ''} | ${c.preferredProtocolVersion ? `\`${c.preferredProtocolVersion}\`` : ''} | ${m.lastVerified || ''} |`;
});
const clientTable = `| Client | Vendor | Kind | Category | Prefers | Last read |\n|---|---|---|---|---|---|\n${clientRows.join('\n')}`;
const newest = (list) => list.reduce((a, b) => (a > b ? a : b), '0000-00-00');

// The lenses on the clients index: by kind, by SDK, and what has evidence but no entry.
const byKind = `| Kind | What a capability row means | Clients |\n|---|---|---|\n${KINDS.map((k) => [k, clients.filter(([, c]) => kindOf(c) === k)]).filter(([, list]) => list.length)
  .map(([k, list]) => `| ${KIND_LABEL[k]} | ${KIND_MEANING[k]} | ${list.map(([id, c]) => `[${c.title}](/clients/${id})`).join(', ')} |`).join('\n')}`;
const aboutTable = `| Client | About |\n|---|---|\n${clients.map(([id, c]) => `| [${c.title}](/clients/${id}) | ${c.description.replace(/\|/g, '\\|')} |`).join('\n')}`;
const sdkGroups = new Map();
for (const [id, c] of clients) {
  const sdk = c.metadata?.sdk;
  const key = sdk?.name ?? 'not recorded';
  if (!sdkGroups.has(key)) sdkGroups.set(key, []);
  const version = sdk?.resolved ?? sdk?.declared;
  sdkGroups.get(key).push(`[${c.title}](/clients/${id})${version ? ` at \`${version}\`` : ''}${sdk?.patched ? ', patched' : ''}`);
}
const bySdk = `| SDK | Clients |\n|---|---|\n${[...sdkGroups].map(([name, list]) => `| ${name === 'not recorded' ? name : `\`${name}\``} | ${list.join('; ')} |`).join('\n')}`;
const unregistered = capIndex.subjects.filter((s) => !s.registry);
const unregisteredList = `| Project | Kind | Evidence | Source |\n|---|---|---|---|\n${unregistered.map((s) => {
  const has = capIndex.capabilities.flatMap((c) => (c.subjects[s.id] ? [c.subjects[s.id]] : []));
  const what = [has.some((x) => x.verified) && 'probe records', has.some((x) => x.observed) && 'telemetry'].filter(Boolean).join(', ');
  return `| [${s.title}](${s.page.slice(ORIGIN.length)}) | ${s.kind} | ${what} | ${s.repo ? `<${s.repo}>` : ''} |`;
}).join('\n')}`;

page({
  url: '/clients/',
  title: 'Clients',
  description: `The ${clients.length} MCP clients with a researched registry entry, each with its capabilities, the evidence for them, and research notes.`,
  md: `# Clients\n\nThe ${clients.length} MCP clients with a researched registry entry. Each page has the client's capabilities, how each one is known, the probe's records for it, and its research notes.\n\n${clientTable}\n\n[Capabilities](/capabilities/) has the same clients as a matrix, one row per capability.\n\n## About each client\n\n${aboutTable}\n\n## By kind\n\nThe kind of an entry decides what a capability row means.\n\n${byKind}\n\n## By SDK\n\nThe SDK each client's MCP code is built on, at the version its lockfile resolves to.\n\n${bySdk}\n\n## Evidence without a registry entry\n\nThese ${unregistered.length} have probe records or telemetry and no researched entry yet. Each links to what there is.\n\n${unregisteredList}\n`,
  lastmod: newest(pages.filter((p) => p.url.startsWith('/clients/')).map((p) => p.lastmod)),
});

// The research index: one table per kind of finding, then the same notes by client.
const NOTE_KINDS = [
  ['idiosyncrasy', 'Idiosyncrasies', 'One client behaves unlike the others.'],
  ['nuance', 'Nuances', 'The status is right, and the behaviour has conditions that matter.'],
  ['gap', 'Gaps', 'Something the spec or the ecosystem does not cover, or covers badly.'],
  ['misconception', 'Misconceptions', 'A widely held belief about MCP that is wrong.'],
  ['in-flight', 'In flight', 'Work under way in the spec repositories, a SEP or a working group.'],
];
{
  const capPage = Object.fromEntries(capIndex.capabilities.map((c) => [c.id, `/capabilities/${c.slug}`]));
  const titles = Object.fromEntries(clients.map(([id, c]) => [id, c.title]));
  const clientLink = (c) => (cardFiles.includes(`${c}.md`) ? `[${titles[c] ?? c}](${cardUrl(c)})` : titles[c] ?? c);
  const capLink = (c) => (capPage[c] ? `[\`${c}\`](${capPage[c]})` : `\`${c}\``);
  const anchor = (label) => label.toLowerCase().replace(/\s+/g, '-');
  const unknown = notes.filter((n) => !NOTE_KINDS.some(([k]) => k === n.fm.kind));
  if (unknown.length) throw new Error(`research/${unknown[0].id}.md: kind "${unknown[0].fm.kind}" has no section on the research index`);
  const groups = NOTE_KINDS.map(([kind, label, meaning]) => ({ label, meaning, list: notes.filter((n) => n.fm.kind === kind) })).filter((g) => g.list.length);
  const row = (n) => `| [${n.fm.title}](${n.url})${n.fm.status === 'current' ? '' : ` (${n.fm.status})`} | ${(n.fm.clients ?? []).map(clientLink).join(', ')} | ${(n.fm.capabilities ?? []).map(capLink).join(', ')} | ${n.fm.lastVerified ?? ''} |`;
  const sections = groups.map((g) => `## ${g.label}\n\n${g.meaning}\n\n| Note | Clients | Capabilities | Verified |\n|---|---|---|---|\n${g.list.map(row).join('\n')}`).join('\n\n');
  const noteClients = [...new Set(notes.flatMap((n) => n.fm.clients ?? []))].sort();
  const byClient = noteClients.map((c) => {
    const list = notes.filter((n) => (n.fm.clients ?? []).includes(c));
    return `| ${clientLink(c)} | ${list.length} | ${list.map((n) => `[${n.fm.title}](${n.url})`).join('<br>')} |`;
  }).join('\n');
  page({
    url: '/research/',
    title: 'Research notes',
    description: `${notes.length} notes on MCP client behaviour that a support matrix cannot express, each citing the source it was read from.`,
    md: `# Research notes\n\n${notes.length} notes on client behaviour that a support matrix cannot express. Each cites the repository, commit and path it was read from.\n\n| Kind | Notes | What it is |\n|---|---|---|\n${groups.map((g) => `| [${g.label}](#${anchor(g.label)}) | ${g.list.length} | ${g.meaning} |`).join('\n')}\n\nThe same notes are listed [by client](#by-client) below. A note marked stale describes behaviour that has since changed.\n\n${sections}\n\n## By client\n\n| Client | Notes | Titles |\n|---|---|---|\n${byClient}\n`,
    lastmod: newest(pages.filter((p) => p.url.startsWith('/research/')).map((p) => p.lastmod)),
  });
}

{
  const md = read('web', 'about.md');
  page({ url: '/about', title: h1(md), description: firstParagraph(md), md, lastmod: lastmod('web/about.md') });
}
for (const name of ['contact', 'privacy']) {
  const md = read('web', `${name}.md`);
  page({ url: `/${name}`, title: h1(md), description: firstParagraph(md), md, lastmod: lastmod(`web/${name}.md`) });
}

page({
  url: '/api', title: h1(api.docsMd), description: firstParagraph(api.docsMd), md: api.docsMd,
  lastmod: lastmod('scripts/lib/api-files.js', 'data', 'schema'),
});

const home = page({
  url: '/',
  title: SITE_NAME,
  description: TAGLINE,
  type: 'website',
  md: `${read('web', 'index.md').trimEnd()}\n\n## Clients\n\n${clientTable}\n\n## Across clients\n\n- [Capabilities](/capabilities/): the matrix, ${capIndex.capabilities.length} capabilities by client, with a page per capability that has the evidence behind every cell.\n- [Tool result handling, verified](/tool-results): what reached the model when each client called a fixture tool, from ${toolResultPages.length} clients run through the probe.\n- [Capabilities observed in traffic](/observed): which capabilities clients declare in real traffic, by protocol revision.\n- [Research notes](/research/): ${notes.length} notes on behaviour a matrix cannot express.\n\n## Data and schemas\n\n- [Data API](/api): the files below as an API, described by [\`/openapi.json\`](/openapi.json).\n- [MCP server](/api#mcp-server): the same data over MCP at \`${api.mcpUrl}\`, read-only, no authentication.\n- [\`/data/clients.json\`](/data/clients.json): the registry. One entry per client is at \`/data/clients/<id>.json\`, listed in [\`/data/clients/index.json\`](/data/clients/index.json).\n- [\`/data/spec-versions.json\`](/data/spec-versions.json): the lifecycle of each capability across protocol revisions.\n- \`/data/verified/<client>.json\`: the probe's records per client, listed in [\`/data/verified/index.json\`](/data/verified/index.json).\n- [\`/data/observed/hf-mcp-clients.json\`](/data/observed/hf-mcp-clients.json): the telemetry feed.\n- [\`/schemas/client-registry.json\`](/schemas/client-registry.json), [\`research-note.json\`](/schemas/research-note.json), [\`verified-evidence.json\`](/schemas/verified-evidence.json), [\`observed-evidence.json\`](/schemas/observed-evidence.json): JSON Schemas, served at their \`$id\`.\n\nThe source is at <${REPO}>. [About](/about) covers where the data comes from and how to report a correction.\n`,
  lastmod: today,
});
home.lastmod = newest(pages.map((p) => p.lastmod));

// --- render -----------------------------------------------------------------

const pageUrls = new Set(pages.map((p) => p.url));
const mdPath = (url) => (url.endsWith('/') ? `${url}index.md` : `${url}.md`);
const htmlFile = (url) => (url.endsWith('/') ? `${url}index.html` : `${url}.html`);

/** Points a page's internal links at the Markdown twins, for the `.md` output. */
function markdownLinks(md) {
  return md.replace(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g, (all, path, hash = '') => (pageUrls.has(path) ? `](${mdPath(path)}${hash})` : all));
}

let slugs = new Map();
marked.use({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const base = inner.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, '').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
      const n = slugs.get(base) || 0;
      slugs.set(base, n + 1);
      return `<h${depth} id="${n ? `${base}-${n}` : base}">${inner}</h${depth}>\n`;
    },
  },
});

function renderHtml(p, { robots } = {}) {
  slugs = new Map();
  const body = marked.parse(p.md).replace(/<table>/g, '<div class="scroll"><table>').replace(/<\/table>/g, '</table></div>');
  const canonical = `${ORIGIN}${p.url}`;
  const title = p.url === '/' ? `${SITE_NAME}: MCP client support, with evidence` : `${p.title} · ${SITE_NAME}`;
  const jsonLd = p.url !== '/' ? '' : `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': `${ORIGIN}/#org`, name: SITE_NAME, url: `${ORIGIN}/`, description: TAGLINE,
        logo: `${ORIGIN}/icon.svg`, sameAs: [REPO],
        contactPoint: { '@type': 'ContactPoint', contactType: 'corrections and support', url: `${ORIGIN}/contact` },
      },
      {
        '@type': 'WebSite', '@id': `${ORIGIN}/#website`, name: SITE_NAME, url: `${ORIGIN}/`, description: TAGLINE, inLanguage: 'en',
        keywords: KEYWORDS, sameAs: [REPO], publisher: { '@id': `${ORIGIN}/#org` }, about: MCP_ENTITY,
      },
      {
        '@type': 'Dataset', '@id': `${ORIGIN}/#dataset`, name: 'canimcp MCP client capability registry', description: TAGLINE,
        url: `${ORIGIN}/`, license: 'https://creativecommons.org/licenses/by/4.0/', isAccessibleForFree: true, dateModified: p.lastmod,
        keywords: KEYWORDS, sameAs: [REPO], creator: { '@id': `${ORIGIN}/#org` }, about: MCP_ENTITY,
        distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${ORIGIN}/data/clients.json` }],
      },
    ],
  }).replace(/</g, '\\u003c')}</script>\n`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
${robots ? `<meta name="robots" content="${robots}">\n` : `<link rel="canonical" href="${canonical}">
<link rel="alternate" type="text/markdown" href="${mdPath(p.url)}">
<link rel="ard" href="/.well-known/ard.json">
<link rel="service-desc" type="${esc(OPENAPI_TYPE)}" href="/openapi.json">
<meta property="og:type" content="${p.type || 'article'}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ORIGIN}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="canimcp: which MCP clients support what, and how each claim is known.">
<meta name="twitter:card" content="summary_large_image">
`}<link rel="icon" type="image/svg+xml" href="/icon.svg">
<link rel="stylesheet" href="/style.css">
${jsonLd}</head>
<body>
<main>
${body}</main>
<nav aria-label="Site">
<a href="/">canimcp</a><a href="/capabilities/">Capabilities</a><a href="/clients/">Clients</a><a href="/tool-results">Tool results</a><a href="/observed">Observed</a><a href="/research/">Research notes</a><a href="/api">API</a><a href="/about">About</a>
</nav>
<footer>
<p>Updated ${p.lastmod}.${robots ? '' : ` <a href="${mdPath(p.url)}">This page as Markdown</a>.`} <a href="/llms.txt">llms.txt</a>. <a href="${REPO}">Source on GitHub</a>. Data and writing under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. <a href="/contact">Contact</a>. <a href="/privacy">Privacy</a>.</p>
</footer>
</body>
</html>
`;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const p of pages) {
  const frontmatter = p.frontmatter
    || `---\ntitle: ${yamlString(p.title)}\ndescription: ${yamlString(p.description)}\ncanonical: ${ORIGIN}${p.url}\nlast-updated: ${p.lastmod}\n---\n`;
  write(htmlFile(p.url), renderHtml(p));
  write(mdPath(p.url), `${frontmatter}\n${markdownLinks(p.md)}`);
}

{
  const md = read('web', '404.md');
  write('404.html', renderHtml({ url: '/404', title: h1(md), description: 'There is no page at this URL.', md, lastmod: today }, { robots: 'noindex' }));
  write('404.md', markdownLinks(md));
}
for (const f of ['style.css', 'icon.svg', 'og.png']) copyFileSync(join(root, 'web', f), join(out, f));

// --- data and schemas -------------------------------------------------------

const schemaNames = {
  'mcp-client-registry.schema.json': 'client-registry.json',
  'research-note.schema.json': 'research-note.json',
  'verified-evidence.schema.json': 'verified-evidence.json',
  'observed-evidence.schema.json': 'observed-evidence.json',
};
for (const [src, name] of Object.entries(schemaNames)) {
  const schema = readJson('schema', src);
  if (schema.$id !== `${ORIGIN}/schemas/${name}`) throw new Error(`schema/${src}: $id is ${schema.$id}, expected ${ORIGIN}/schemas/${name}`);
  write(`schemas/${name}`, readFileSync(join(root, 'schema', src)));
}

/** A data file's `$schema` is a path into schema/; the published copy names the `$id`. */
function publishJson(rel, data) {
  const m = typeof data.$schema === 'string' && data.$schema.match(/schema\/([^/]+)$/);
  if (m && schemaNames[m[1]]) data = { ...data, $schema: `${ORIGIN}/schemas/${schemaNames[m[1]]}` };
  write(rel, `${JSON.stringify(data, null, 2)}\n`);
}

publishJson('data/clients.json', readJson('data', 'clients.json'));
publishJson('data/spec-versions.json', readJson('data', 'spec-versions.json'));
const dataFiles = ['/data/clients.json', '/data/spec-versions.json', '/data/clients/index.json', '/data/verified/index.json', '/data/research/index.json'];
publishJson('data/research/index.json', notes.map(({ id, fm, url }) => ({
  id, title: fm.title, kind: fm.kind, status: fm.status, summary: fm.summary,
  clients: fm.clients ?? [], capabilities: fm.capabilities ?? [], specVersions: fm.specVersions ?? [],
  lastVerified: fm.lastVerified ?? null, page: `${ORIGIN}${url}`, markdown: `${ORIGIN}${url}.md`,
})));
publishJson('data/capabilities/index.json', indexJson(capIndex, { origin: ORIGIN }));
dataFiles.push('/data/capabilities/index.json');
for (const cap of capIndex.capabilities) {
  publishJson(`data/capabilities/${cap.slug}.json`, capabilityJson(cap, capIndex, { origin: ORIGIN }));
  dataFiles.push(`/data/capabilities/${cap.slug}.json`);
}
for (const [id, c] of clients) {
  publishJson(`data/clients/${id}.json`, { id, schema: `${ORIGIN}/schemas/client-registry.json#/$defs/ClientEntry`, entry: c });
}
publishJson('data/clients/index.json', clients.map(([id, c]) => ({
  id, title: c.title, description: c.description, data: `${ORIGIN}/data/clients/${id}.json`, page: `${ORIGIN}/clients/${id}`,
})));
publishJson('data/verified/index.json', verified.map((v) => ({
  client: v.client, registryId: v.registryId ?? null, title: v.title, versions: v.versions,
  data: `${ORIGIN}/data/verified/${v.client}.json`,
  ...(pageUrls.has(`/tool-results/${v.client}`) ? { page: `${ORIGIN}/tool-results/${v.client}` } : {}),
})));
for (const dir of ['verified', 'observed']) {
  if (!existsSync(join(root, 'data', dir))) continue;
  for (const f of readdirSync(join(root, 'data', dir)).filter((f) => f.endsWith('.json')).sort()) {
    publishJson(`data/${dir}/${f}`, readJson('data', dir, f));
    dataFiles.push(`/data/${dir}/${f}`);
  }
}

// --- API description --------------------------------------------------------

const json = (data) => `${JSON.stringify(data, null, 2)}\n`;
write('openapi.json', json(api.openapi));
write('.well-known/api-catalog', json(api.apiCatalog));
// The AI Catalog Standard reads the same document at its own path.
write('.well-known/ard.json', json(api.ard));
write('.well-known/ai-catalog.json', json(api.ard));

// --- MCP Registry -----------------------------------------------------------

// The proof record for the Registry's HTTP authentication. It holds a public
// key and is absent until one is generated; see "MCP Registry" in the README.
const registryAuth = existsSync(join(root, 'web', 'mcp-registry-auth')) ? read('web', 'mcp-registry-auth').trim() : null;
if (registryAuth !== null) {
  if (!/^v=MCPv1; k=(ed25519|ecdsap384); p=[A-Za-z0-9+/=]+$/.test(registryAuth)) throw new Error('web/mcp-registry-auth: not an MCPv1 proof record');
  write('.well-known/mcp-registry-auth', `${registryAuth}\n`);
}

// --- skills -----------------------------------------------------------------

for (const [path, text] of Object.entries(skillBundle)) write(`.well-known/agent-skills/${path}`, text);
write(MCP_SERVER.skillsBundle.slice(1), json(skillBundle));
write('.well-known/agent-skills/index.json', json({
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: skills.map((s) => {
    const digest = `sha256:${createHash('sha256').update(skillBundle[s.file]).digest('hex')}`;
    if (digest !== s.digest) throw new Error(`skills/${s.file}: the SDK's digest ${s.digest} is not the SHA-256 of the published file`);
    return { name: s.name, type: 'skill-md', description: s.description, url: s.url, digest };
  }),
}));

// --- discovery files --------------------------------------------------------

const abs = (url) => `${ORIGIN}${url}`;
const mdLink = (title, url, note) => `- [${title}](${abs(pageUrls.has(url) ? mdPath(url) : url)})${note ? `: ${note}` : ''}`;
const byUrl = (url) => pages.find((p) => p.url === url);
const clientPages = clients.map(([id]) => byUrl(`/clients/${id}`));

const llms = `# ${SITE_NAME}

> ${TAGLINE}

canimcp is a registry of Model Context Protocol clients. A capability carries evidence, and each piece of evidence has a tier (\`declared\`, \`verified\`, \`observed\`, \`read\`) and the protocol revision it applies to. Tiers are not ranked and can disagree.

## When to use this

- Before relying on an MCP feature in a server, check which clients implement it and at which protocol revision.
- To find out what a client does with a tool result: which of \`content\` and \`structuredContent\` reaches the model.
- To see where a client's declared capabilities, its source and its observed traffic disagree.

For one client, fetch \`${ORIGIN}/data/clients/<id>.json\` or its page below. Every page is Markdown at the URL with \`.md\` appended, and at the page URL with \`Accept: text/markdown\`. Nothing here needs authentication.

## Clients

${clientPages.map((p) => mdLink(p.title, p.url, p.description)).join('\n')}
- [All clients](${abs('/clients/llms.txt')}): the section index

## Across clients

${mdLink('Capabilities', '/capabilities/', `the matrix of ${capIndex.capabilities.length} capabilities by client; each capability has its own page with the evidence`)}
- [Capability pages](${abs('/capabilities/llms.txt')}): the section index
${mdLink('Tool result handling, verified', '/tool-results', 'what reached the model when each client called a fixture tool; links to one record page per client')}
${mdLink('Capabilities observed in traffic', '/observed', 'capabilities clients declare in real traffic, by protocol revision')}

## Research notes

${mdLink('Research notes', '/research/', `${notes.length} notes, each with a one-paragraph summary`)}
- [Research notes index](${abs('/research/llms.txt')}): the section index

## Data

- [Client registry](${abs('/data/clients.json')}): every researched client in one JSON file
- [Client index](${abs('/data/clients/index.json')}): ids, titles and the per-client JSON URLs
- [Capability index](${abs('/data/capabilities/index.json')}): the matrix as JSON; one capability with its evidence is at \`${ORIGIN}/data/capabilities/<slug>.json\`
- [Capability lifecycle](${abs('/data/spec-versions.json')}): each capability across protocol revisions
- [Observed telemetry](${abs('/data/observed/hf-mcp-clients.json')}): the feed behind the observed tier
- [Probe record index](${abs('/data/verified/index.json')}): the clients the probe has run; records are at \`${ORIGIN}/data/verified/<client>.json\`

## API

${mdLink('Data API', '/api', 'the JSON above as an API: endpoints, examples, errors and versioning')}
- MCP server: \`${api.mcpUrl}\`, Streamable HTTP, read-only, no authentication, ${MCP_TOOLS.length} tools; [server card](${abs(MCP_SERVER.cardPath)})
- [Agent Skills index](${abs('/.well-known/agent-skills/index.json')}): ${skills.map((s) => `[${s.name}](${s.url})`).join(', ')}; the MCP server serves the same skills at \`skill://\` URIs
- [OpenAPI description](${abs('/openapi.json')}): OpenAPI 3.1, ${api.operations.length} operations, no authentication
- [API catalog](${abs('/.well-known/api-catalog')}): RFC 9727 linkset
- [ARD catalog](${abs('/.well-known/ard.json')}): Agentic Resource Discovery entries

## Schemas

${Object.values(schemaNames).map((n) => `- [${n}](${abs(`/schemas/${n}`)})`).join('\n')}

## Optional

${mdLink('About', '/about', 'where the data comes from, the licence, and how to report a correction')}
${mdLink('Contact', '/contact', 'how to report an error or ask for a client')}
${mdLink('Privacy', '/privacy', 'what the site and its host record')}
- [Source repository](${REPO}): the registry, the probe and its captures
`;
if (llms.length > MAX_LLMS_CHARS) throw new Error(`llms.txt is ${llms.length} characters, over ${MAX_LLMS_CHARS}`);
write('llms.txt', llms);

write('clients/llms.txt', `# ${SITE_NAME}: clients

> One page per MCP client: capabilities, how each is known, probe records and research notes.

## Client pages

${clientPages.map((p) => mdLink(p.title, p.url, p.description)).join('\n')}

## Client data

${clients.map(([id, c]) => `- [${c.title} JSON](${abs(`/data/clients/${id}.json`)})`).join('\n')}

## Probe records by client

${toolResultPages.map((p) => mdLink(p.title, `/tool-results/${p.slug}`, p.summary)).join('\n')}
`);

write('capabilities/llms.txt', `# ${SITE_NAME}: capabilities

> One page per MCP capability: which clients support it, the evidence for each, probe results, telemetry and the protocol lifecycle.

## Matrix

${mdLink('Capabilities', '/capabilities/', 'every capability by client')}

## Capability pages

${capIndex.capabilities.map((c) => mdLink(c.id, `/capabilities/${c.slug}`, `${Object.values(c.subjects).filter((s) => s.status !== undefined).length} clients recorded${c.lifecycle?.introducedIn ? `, introduced in ${c.lifecycle.introducedIn}` : ''}`)).join('\n')}
`);

write('research/llms.txt', `# ${SITE_NAME}: research notes

> Notes on MCP client behaviour that a support matrix cannot express, each citing the source it was read from.

## Notes

${notes.map((n) => mdLink(n.fm.title, n.url, n.fm.summary)).join('\n')}
`);

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `<url><loc>${abs(p.url)}</loc><lastmod>${p.lastmod}</lastmod></url>`).sort().join('\n')}
</urlset>
`);

write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`);

write('_headers', `/*
  X-Content-Type-Options: nosniff
  Link: </sitemap.xml>; rel="sitemap", </llms.txt>; rel="describedby"; type="text/plain", </.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc"; type="${OPENAPI_TYPE}", </api>; rel="service-doc", </.well-known/ard.json>; rel="ard"
/*.md
  Content-Type: text/markdown; charset=utf-8
/*.txt
  Content-Type: text/plain; charset=utf-8
/schemas/*
  Content-Type: application/schema+json
  Access-Control-Allow-Origin: *
/data/*
  Access-Control-Allow-Origin: *
/openapi.json
  Access-Control-Allow-Origin: *
/.well-known/*
  Access-Control-Allow-Origin: *
/.well-known/api-catalog
  Content-Type: ${API_CATALOG_TYPE}
/.well-known/mcp-registry-auth
  Content-Type: text/plain; charset=utf-8
`);

// --- checks -----------------------------------------------------------------

const problems = [];
// Paths the Worker answers itself, which have no file in site/.
const workerPaths = new Set([MCP_SERVER.path, MCP_SERVER.cardPath]);
const exists = (url) => {
  const path = decodeURI(url.split('#')[0].split('?')[0]);
  if (pageUrls.has(path) || workerPaths.has(path)) return true;
  return path !== '/' && !path.endsWith('/') && existsSync(join(out, path));
};

for (const p of pages) {
  const html = readFileSync(join(out, htmlFile(p.url)), 'utf8');
  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (!exists(href)) problems.push(`${p.url}: link to ${href} does not resolve`);
  }
  const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ');
  if (text.length > MAX_PAGE_CHARS) problems.push(`${p.url}: ${text.length} characters of text, over ${MAX_PAGE_CHARS}`);

  const md = readFileSync(join(out, mdPath(p.url)), 'utf8');
  for (const [, href] of md.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    if (!exists(href)) problems.push(`${mdPath(p.url)}: link to ${href} does not resolve`);
  }
  if ((md.match(/^\s*(```|~~~)/gm) || []).length % 2) problems.push(`${mdPath(p.url)}: unclosed code fence`);
}
for (const f of ['llms.txt', 'clients/llms.txt', 'capabilities/llms.txt', 'research/llms.txt']) {
  for (const [, url] of readFileSync(join(out, f), 'utf8').matchAll(/\]\((https?:[^)\s]+)\)/g)) {
    if (url.startsWith(ORIGIN) && !exists(url.slice(ORIGIN.length))) problems.push(`${f}: link to ${url} does not resolve`);
  }
}

problems.push(...checkApiFiles({ origin: ORIGIN, ...api }, exists));

// server.json is what the MCP Registry publishes. It must say what the server says.
{
  const listing = readJson('server.json');
  const want = {
    name: MCP_SERVER.name, title: MCP_SERVER.title, description: MCP_SERVER.description,
    version: readJson('package.json').version, websiteUrl: ORIGIN, 'repository.url': REPO, 'remotes[0].url': api.mcpUrl,
    'icons[0].src': `${ORIGIN}${MCP_SERVER.icon.path}`,
  };
  const got = {
    ...listing, 'repository.url': listing.repository?.url, 'remotes[0].url': listing.remotes?.[0]?.url, 'icons[0].src': listing.icons?.[0]?.src,
  };
  if (!existsSync(join(out, MCP_SERVER.icon.path))) problems.push(`mcp-tools.js: the icon ${MCP_SERVER.icon.path} was not built`);
  for (const [k, v] of Object.entries(want)) {
    if (got[k] !== v) problems.push(`server.json: ${k} is ${JSON.stringify(got[k])}, and the server has ${JSON.stringify(v)}`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\nsite build failed: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`site: ${pages.length} pages, ${dataFiles.length + clients.length} data files, ${Object.keys(schemaNames).length} schemas, ${api.operations.length} API operations, ${skills.length} skill(s) -> site/`);

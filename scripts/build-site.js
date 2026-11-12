// build-site.js — copy data JSON into site/data/ so the static site is
// fully self-contained for any static host (Cloudflare Pages, Vercel, etc.).
import { mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'site', 'data');

mkdirSync(outDir, { recursive: true });

const files = ['clients.json', 'spec-versions.json'];
for (const f of files) {
  copyFileSync(join(root, 'data', f), join(outDir, f));
  console.log(`copied data/${f} -> site/data/${f}`);
}

// The probe's verified-tier overlay, one file per client.
const verifiedDir = join(root, 'data', 'verified');
if (existsSync(verifiedDir)) {
  mkdirSync(join(outDir, 'verified'), { recursive: true });
  for (const f of readdirSync(verifiedDir).filter((f) => f.endsWith('.json'))) {
    copyFileSync(join(verifiedDir, f), join(outDir, 'verified', f));
    console.log(`copied data/verified/${f} -> site/data/verified/${f}`);
  }
}
console.log('site build complete.');

// Bundles the everything-client to dist/everything-client.mjs so it starts
// without tsx and runs unchanged under WSL from a Windows install.
import { build } from 'esbuild';

await build({
  entryPoints: ['everything-client/everythingClient.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  outfile: 'dist/everything-client.mjs',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  logLevel: 'warning',
});

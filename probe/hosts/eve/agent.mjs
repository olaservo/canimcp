// One eve turn against the fixture server, model routed to the mock.
// eve is a framework run through its CLI, so this script writes a minimal eve
// app into PROBE_APP_DIR, starts `eve dev --no-ui` on a free port, sends the
// prompt once with `eve remote connect --print`, prints the final text, and
// stops the dev server. Runs with the pinned packages installed in this
// directory; the app's node_modules is a junction to them.
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, mkdirSync, rmdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const hostDir = dirname(fileURLToPath(import.meta.url));
const mockUrl = process.env.PROBE_MOCK_URL;
const prompt = process.env.PROBE_PROMPT;
const config = process.env.PROBE_CONFIG ?? 'default';
const serverUrl = process.env.PROBE_SERVER_URL || undefined;
const appDir = resolve(process.env.PROBE_APP_DIR ?? process.cwd());
const eveBin = resolve(hostDir, 'node_modules/eve/bin/eve.js');

if (!serverUrl) {
  console.error('PROBE_AGENT_ERROR: eve MCP connections take only an HTTP url (defineMcpClientConnection.url, Streamable HTTP or SSE); there is no stdio transport. Run with --transport http.');
  process.exit(1);
}

const discovery = config === 'no-discovery' ? 'false' : 'true';

mkdirSync(resolve(appDir, 'agent/connections'), { recursive: true });
writeFileSync(
  resolve(appDir, 'package.json'),
  JSON.stringify({ name: 'canimcp-probe-eve-app', private: true, type: 'module', dependencies: { '@ai-sdk/openai': '*', ai: '*', eve: '*', 'just-bash': '*', zod: '*' } }, null, 2)
);
writeFileSync(
  resolve(appDir, 'tsconfig.json'),
  JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, skipLibCheck: true, noEmit: true }, include: ['agent'] }, null, 2)
);
writeFileSync(resolve(appDir, 'agent/instructions.md'), 'You call the tool you are asked to call, then report its output.\n');
writeFileSync(
  resolve(appDir, 'agent/agent.ts'),
  [
    'import { defineAgent } from "eve";',
    'import { createOpenAI } from "@ai-sdk/openai";',
    '',
    `const openai = createOpenAI({ baseURL: ${JSON.stringify(`${mockUrl}/v1`)}, apiKey: "probe" });`,
    '',
    '// A model outside the AI Gateway catalog has to declare its context window or compaction fails to compile.',
    'export default defineAgent({ model: openai.chat("gpt-probe"), modelContextWindowTokens: 128_000 });',
    '',
  ].join('\n')
);
writeFileSync(
  resolve(appDir, 'agent/connections/probe.ts'),
  [
    'import { defineMcpClientConnection } from "eve/connections";',
    '',
    'export default defineMcpClientConnection({',
    `  url: ${JSON.stringify(serverUrl)},`,
    '  description: "probe: the canimcp fixture server.",',
    `  protocolVersionDiscovery: ${discovery},`,
    '});',
    '',
  ].join('\n')
);
writeFileSync(
  resolve(appDir, 'agent/sandbox.ts'),
  [
    'import { defineSandbox } from "eve/sandbox";',
    'import { JustBashSandbox } from "eve/sandbox/just-bash";',
    '',
    'export const environment = JustBashSandbox.environment({ autoInstall: false });',
    'export default defineSandbox(() => environment.open());',
    '',
  ].join('\n')
);
const appModules = resolve(appDir, 'node_modules');
if (!existsSync(appModules)) symlinkSync(resolve(hostDir, 'node_modules'), appModules, 'junction');

const env = { ...process.env, EVE_TELEMETRY_DISABLED: '1', EVE_TRACES: 'off', CI: '1', NO_COLOR: '1' };

function freePort() {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => res(port));
    });
    srv.on('error', rej);
  });
}

function killTree(child) {
  if (child.pid === undefined || child.exitCode !== null) return;
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
  else child.kill('SIGTERM');
}

/** Stop the dev server and wait for it to go, so the runner can remove the app directory. */
function stop(child) {
  return new Promise((res) => {
    if (child.exitCode !== null) return res();
    const timer = setTimeout(res, 10000);
    child.on('exit', () => {
      clearTimeout(timer);
      res();
    });
    killTree(child);
  });
}

/** Start the dev server and resolve once it prints its listening line. */
function startDev(port) {
  return new Promise((res, rej) => {
    const child = spawn(process.execPath, [eveBin, 'dev', '--no-ui', '--no-default-extensions', '--host', '127.0.0.1', '--port', String(port), '--logs', 'all'], {
      cwd: appDir,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let log = '';
    let ready = false;
    const timer = setTimeout(() => {
      if (!ready) {
        killTree(child);
        rej(new Error(`eve dev did not become ready in 120 s\n${log}`));
      }
    }, 120000);
    const onData = (d) => {
      const s = d.toString();
      log += s;
      process.stderr.write(s.replace(/^/gm, '[eve dev] '));
      if (!ready && /server listening at/.test(log)) {
        ready = true;
        clearTimeout(timer);
        res(child);
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', (code) => {
      if (!ready) {
        clearTimeout(timer);
        rej(new Error(`eve dev exited early (${code})\n${log}`));
      }
    });
  });
}

function print(url) {
  return new Promise((res) => {
    const child = spawn(process.execPath, [eveBin, 'remote', 'connect', '--url', url, '--print', prompt], { cwd: appDir, env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    let stdout = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => process.stderr.write(d.toString().replace(/^/gm, '[eve remote] ')));
    child.on('close', (code) => res({ code, stdout }));
  });
}

let dev;
let exitCode = 0;
try {
  const port = await freePort();
  dev = await startDev(port);
  const r = await print(`http://127.0.0.1:${port}`);
  process.stdout.write(r.stdout.endsWith('\n') ? r.stdout : r.stdout + '\n');
  if (r.code !== 0) {
    exitCode = r.code ?? 1;
    console.error(`PROBE_AGENT_ERROR: eve remote connect --print exited ${r.code}`);
  }
} catch (e) {
  exitCode = 1;
  console.error(`PROBE_AGENT_ERROR: ${e && e.stack ? e.stack : String(e)}`);
} finally {
  if (dev) await stop(dev);
  // Remove the junction itself; a recursive rm would walk into the shared install.
  try {
    rmdirSync(appModules);
  } catch {
    // already gone
  }
}
process.exit(exitCode);

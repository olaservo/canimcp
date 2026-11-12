// Hermes Agent through `hermes -z <prompt>` (one-shot), provider `custom` on Chat Completions.
// Installed as an editable checkout at the pin in .venv (see requirements.txt).
//
// At a9ff9799 every chat turn runs in a gateway daemon that the client starts for its
// HERMES_HOME when none is running (`gateway run --idle-exit`, detached). The daemon spawns the
// MCP servers and talks to the model; the `hermes` process is a WebSocket client. The daemon
// lingers for gateway.unmanaged_idle_exit_seconds after the client leaves (default 600), so the
// adapter sets that low and kills the pid recorded in <home>/gateway.pid before returning, or the
// runner cannot remove the run's tmp directory.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { existsSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { runCommand, ensureDir, slash, findFinalText, type HostAdapter, type RunContext, type RunResult } from '../../lib/hosts.js';

const here = dirname(fileURLToPath(import.meta.url));
const hostDir = resolve(here, '../../../hosts/hermes-agent');
const venvBin = resolve(hostDir, '.venv', process.platform === 'win32' ? 'Scripts' : 'bin');
const python = process.env.PROBE_HERMES_PYTHON ?? resolve(venvBin, process.platform === 'win32' ? 'python.exe' : 'python');
const bin = process.env.PROBE_HERMES_BIN ?? resolve(venvBin, process.platform === 'win32' ? 'hermes.exe' : 'hermes');

/** The daemon's pid from gateway.pid or gateway.lock (both JSON records with a pid, or a bare pid). */
function readPid(home: string): number | undefined {
  for (const name of ['gateway.pid', 'gateway.lock']) {
    const p = resolve(home, name);
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, 'utf8').trim();
    try {
      const rec = JSON.parse(raw) as { pid?: number } | number;
      const pid = typeof rec === 'number' ? rec : rec.pid;
      if (pid) return pid;
    } catch {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return undefined;
}

function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Stop the detached gateway daemon this run started, and wait for it to go. A daemon still
 *  starting when the client gave up writes its pid file late, so wait for it up to waitMs. */
async function stopGateway(home: string, waitMs: number): Promise<string> {
  let pid = readPid(home);
  const until = Date.now() + waitMs;
  while (pid === undefined && Date.now() < until) {
    await sleep(500);
    pid = readPid(home);
  }
  if (pid === undefined) return 'gateway.pid absent';
  if (!pidAlive(pid)) return `gateway ${pid} already gone`;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
  else {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // gone
    }
  }
  for (let i = 0; i < 50 && pidAlive(pid); i++) await sleep(200);
  return pidAlive(pid) ? `gateway ${pid} still alive after kill` : `gateway ${pid} killed`;
}

/** The client gave up waiting for a daemon it started (ensure_gateway_runtime's fixed 60 s). */
const gatewayNotReady = (r: { exitCode: number | null; stderr: string }) => r.exitCode !== 0 && /Gateway (starting|pending|not_ready)/.test(r.stderr);

const adapter: HostAdapter = {
  id: 'hermes-agent',
  title: 'Hermes Agent',
  mockScript: 'mock-script.js',
  configs: [
    {
      name: 'default',
      description:
        'provider custom (Chat Completions), mcp_servers.probe with protocol auto: initialize first, server/discover only on a modern-only rejection. MCP tools are deferred behind the tool_search bridge, so the model reaches the tool through tool_call.',
      modelApi: 'chat',
    },
    { name: 'tool-search-off', description: 'tools.tool_search.enabled: off: the MCP tool is offered to the model directly as mcp__probe__<tool>.', modelApi: 'chat' },
    { name: 'stateless', description: 'mcp_servers.probe.protocol: stateless: server/discover first, one initialize retry on any error.', modelApi: 'chat' },
    { name: 'legacy', description: 'mcp_servers.probe.protocol: legacy: initialize only, no fallback.', modelApi: 'chat' },
  ],
  async version() {
    if (!existsSync(bin) || !existsSync(python)) return { missing: `${bin} not found; create the venv as described in probe/hosts/hermes-agent/requirements.txt` };
    const r = await runCommand(python, ['-c', 'from hermes_cli.version_info import get_version_info as g; v = g(); print(v.derived_version); print(v.commit)'], { timeoutMs: 120000 });
    const [derived, commit] = r.stdout.trim().split(/\r?\n/);
    if (!derived) return { missing: `version probe failed: ${r.stderr.trim().split(/\r?\n/).slice(-1)[0] ?? ''}` };
    return { version: derived, detail: `commit ${commit}` };
  },
  async run(ctx: RunContext): Promise<RunResult> {
    // The home lives outside the run's tmp directory, on the local temp disk: the daemon and its
    // helpers hold files under it for a while after they are told to stop, and the runner's own
    // rmSync of tmp has no retry. The daemon's logs are copied into the run directory afterwards.
    const homeRoot = process.env.PROBE_HERMES_HOME_ROOT ?? resolve(tmpdir(), 'canimcp-hermes');
    const home = ensureDir(resolve(homeRoot, `${ctx.config.name}-${ctx.fixture.id}-${ctx.transport}-${process.pid}`));
    rmSync(home, { recursive: true, force: true });
    ensureDir(home);
    const cwd = ensureDir(resolve(ctx.tmpDir, 'workspace'));
    // The runner hands a bare `node` when the Node path has a space in it; hermes takes the command
    // as a list and resolves a bare `node` against its own package manager first, so pass the path.
    const command = ctx.serverCommand.command === 'node' ? slash(process.execPath) : ctx.serverCommand.command;
    const server: Record<string, unknown> =
      ctx.transport === 'http' ? { url: ctx.serverUrl } : { command, args: ctx.serverCommand.args };
    server.timeout = 60;
    if (ctx.config.name === 'stateless' || ctx.config.name === 'legacy') server.protocol = ctx.config.name;
    // YAML is a JSON superset, so the config is written as JSON and needs no quoting rules.
    // _config_version matches cli-config.yaml.example at the pin, so no migration runs.
    const config: Record<string, unknown> = {
      _config_version: 52,
      model: { default: 'gpt-probe', provider: 'custom', base_url: `${ctx.mockUrl}/v1`, api_key: 'probe' },
      gateway: { unmanaged_idle_exit_seconds: 2 },
      mcp_servers: { probe: server },
    };
    if (ctx.config.name === 'tool-search-off') config.tools = { tool_search: { enabled: 'off' } };
    const text = JSON.stringify(config, null, 2) + '\n';
    writeFileSync(resolve(home, 'config.yaml'), text);
    writeFileSync(resolve(ctx.runDir, 'client-config.yaml'), text);

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      HERMES_HOME: home,
      OPENAI_API_KEY: 'probe',
      NO_COLOR: '1',
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1',
    };
    const args = ['-z', ctx.prompt, '--ignore-rules', '--yolo'];
    const started = Date.now();
    let r = await runCommand(bin, args, { cwd, env, timeoutMs: ctx.timeoutMs });
    let notes = '';
    if (gatewayNotReady(r) && Date.now() - started < ctx.timeoutMs) {
      // The daemon keeps starting after the client's deadline; a second client attaches to it.
      notes += `[adapter] first attempt: exit=${r.exitCode} ${r.stderr.trim().split(/\r?\n/).pop() ?? ''}; retrying once\n`;
      const again = await runCommand(bin, args, { cwd, env, timeoutMs: Math.max(10000, ctx.timeoutMs - (Date.now() - started)) });
      r = { ...again, stdout: r.stdout + again.stdout, stderr: r.stderr + again.stderr, durationMs: Date.now() - started };
    }
    const stopped = await stopGateway(home, gatewayNotReady(r) ? 90000 : 5000);
    // Keep the daemon's logs next to the captures, then remove the home ourselves with retries:
    // the venv's python launcher holds the log handle for a moment after the daemon dies, and the
    // runner's own rmSync of tmp has no retry.
    let gatewayLog = '';
    const logsDir = resolve(home, 'logs');
    const logPath = resolve(logsDir, 'gateway-stdio.log');
    if (existsSync(logPath)) gatewayLog = readFileSync(logPath, 'utf8');
    try {
      cpSync(logsDir, resolve(ctx.runDir, 'hermes-logs'), { recursive: true, force: true });
    } catch (e) {
      notes += `[adapter] could not copy logs: ${String(e)}\n`;
    }
    let removed = `home kept at ${home} (PROBE_HERMES_KEEP_HOME)`;
    if (!process.env.PROBE_HERMES_KEEP_HOME) {
      try {
        rmSync(home, { recursive: true, force: true, maxRetries: 20, retryDelay: 500 });
        removed = 'home removed';
      } catch (e) {
        removed = `home left at ${home}: ${String(e).split('\n')[0]}`;
      }
    }
    const stderr = `${r.stderr}\n${notes}[adapter] ${stopped}; ${removed}\n`;
    return { ...r, stderr, finalText: findFinalText(r.stdout) ?? findFinalText(r.stderr) ?? findFinalText(gatewayLog) };
  },
};

export default adapter;

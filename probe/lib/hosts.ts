// The contract between the runner and a host adapter, plus process helpers.
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Fixture } from '../fixtures/tool-results.js';

export type ModelApi = 'chat' | 'responses' | 'anthropic' | 'gemini';
export type Era = 'both' | 'legacy' | 'modern';
export type ServerMode = 'sdk' | 'mcpserver' | 'raw';

export interface HostConfig {
  /** `default` first, then one per switch the client's note names. */
  name: string;
  description: string;
  modelApi: ModelApi;
}

export interface RunContext {
  fixture: Fixture;
  config: HostConfig;
  /** Absolute run directory; adapters put scratch files under <runDir>/tmp. */
  runDir: string;
  tmpDir: string;
  /** The mock model's base URL, without a trailing slash, no /v1. */
  mockUrl: string;
  /** Stdio: the command and args that start the fixture server. */
  serverCommand: { command: string; args: string[] };
  /** HTTP: the fixture server's /mcp URL, when the run uses HTTP. */
  serverUrl?: string;
  transport: 'stdio' | 'http';
  era: Era;
  prompt: string;
  /** Milliseconds before the runner kills the client. */
  timeoutMs: number;
}

export interface RunResult {
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  /** The client's final text, when the adapter can find it. */
  finalText?: string;
  durationMs: number;
}

export interface HostAdapter {
  id: string;
  title: string;
  configs: HostConfig[];
  /** Platforms the adapter runs on. Absent means any. */
  platforms?: NodeJS.Platform[];
  /** Transports the client can speak to an MCP server. Absent means both; eve, for one, has no stdio client. */
  transports?: Array<'stdio' | 'http'>;
  /** Path to a mock-model script module, relative to the adapter directory, for clients that need extra turns. */
  mockScript?: string;
  /** The installed client version, or a reason it is not installed. */
  version(): Promise<{ version: string; detail?: string } | { missing: string }>;
  run(ctx: RunContext): Promise<RunResult>;
}

export async function freePort(): Promise<number> {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      srv.close(() => res(port));
    });
    srv.on('error', rej);
  });
}

export interface SpawnResult {
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

/** Run a command to completion with a timeout, capturing both streams. */
export function runCommand(
  command: string,
  args: string[],
  opts: { cwd?: string; env?: NodeJS.ProcessEnv; timeoutMs: number; stdin?: string; shell?: boolean }
): Promise<SpawnResult> {
  return new Promise((res) => {
    const started = Date.now();
    const child = spawn(command, args, { cwd: opts.cwd, env: opts.env, stdio: ['pipe', 'pipe', 'pipe'], shell: opts.shell ?? false, windowsHide: true });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child);
    }, opts.timeoutMs);
    child.on('error', (e) => {
      stderr += `\nspawn error: ${String(e)}`;
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      res({ exitCode: code, timedOut, stdout, stderr, durationMs: Date.now() - started });
    });
    if (opts.stdin !== undefined) child.stdin.write(opts.stdin);
    child.stdin.end();
  });
}

export function killTree(child: ChildProcess): void {
  if (child.pid === undefined) return;
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
  } else {
    try {
      child.kill('SIGTERM');
    } catch {
      // already gone
    }
  }
}

/** Start a long-running child (mock model, HTTP fixture server) and wait for a ready line on stderr. */
export function startService(command: string, args: string[], readyPattern: RegExp, opts: { env?: NodeJS.ProcessEnv; logPath: string; timeoutMs?: number }): Promise<ChildProcess> {
  return new Promise((res, rej) => {
    const child = spawn(command, args, { env: opts.env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    let log = '';
    let ready = false;
    const timer = setTimeout(() => {
      if (!ready) {
        killTree(child);
        rej(new Error(`service did not become ready: ${command} ${args.join(' ')}\n${log}`));
      }
    }, opts.timeoutMs ?? 20000);
    const onData = (d: Buffer) => {
      log += d.toString();
      writeFileSync(opts.logPath, log);
      if (!ready && readyPattern.test(log)) {
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
        rej(new Error(`service exited early (${code}): ${command} ${args.join(' ')}\n${log}`));
      }
    });
  });
}

export function ensureDir(path: string): string {
  mkdirSync(path, { recursive: true });
  return path;
}

/** Extract the mock model's done marker from a client's output, if present. */
export function findFinalText(text: string): string | undefined {
  const m = text.match(/PROBE_(?:DONE|TOOL_NOT_OFFERED)[^\r\n"]*/);
  return m ? m[0] : undefined;
}

/** Forward slashes, which every pilot client accepts on Windows and which survive TOML and JSON. */
export function slash(p: string): string {
  return resolve(p).replace(/\\/g, '/');
}

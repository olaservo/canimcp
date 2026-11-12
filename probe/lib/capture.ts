// Append-only JSONL capture shared by the fixture server and the mock model,
// plus the small argument helpers every entry point uses.
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export class Capture {
  constructor(readonly path: string) {
    mkdirSync(dirname(path), { recursive: true });
  }
  write(entry: Record<string, unknown>): void {
    appendFileSync(this.path, JSON.stringify({ t: new Date().toISOString(), ...entry }) + '\n');
  }
}

export function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1] !== undefined) return process.argv[i + 1];
  const env = process.env[`PROBE_${name.toUpperCase().replace(/-/g, '_')}`];
  if (env !== undefined) return env;
  if (fallback !== undefined) return fallback;
  throw new Error(`missing --${name}`);
}

export function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

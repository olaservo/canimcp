// The scripted turn. The default script calls the fixture tool on the first
// request that offers it and ends with text once a tool result has come back.
// A client adapter may supply its own script module (default export) for
// clients that need an extra step, such as fx's deferred tool selection.
import type { OfferedTool, ToolResultSeen } from './server.js';

export type Decision =
  | { type: 'call'; tool: string; args: Record<string, unknown>; callId: string; namespace?: string; delayMs?: number }
  | { type: 'text'; text: string; delayMs?: number };

export interface ScriptContext {
  api: 'chat' | 'responses' | 'anthropic' | 'gemini';
  /** The fixture tool's bare name, before any client prefix. */
  fixtureTool: string;
  toolArgs: Record<string, unknown>;
  offeredTools: OfferedTool[];
  toolResults: ToolResultSeen[];
  body: Record<string, unknown>;
  seq: number;
}

export type Script = (ctx: ScriptContext, helpers: typeof HELPERS) => Decision | undefined;

/** Does an offered tool name denote the fixture tool, under any client prefix? */
export function matchesFixtureTool(name: string, fixtureTool: string): boolean {
  const n = name.toLowerCase();
  const f = fixtureTool.toLowerCase();
  if (n === f) return true;
  if (n.endsWith(f)) return true;
  // Some clients replace underscores or clip names; accept a contained match.
  return n.includes(f) || n.replace(/[^a-z0-9]/g, '').includes(f.replace(/[^a-z0-9]/g, ''));
}

export function findFixtureTool(ctx: ScriptContext): OfferedTool | undefined {
  return ctx.offeredTools.find((t) => matchesFixtureTool(t.name, ctx.fixtureTool));
}

export const HELPERS = { matchesFixtureTool, findFixtureTool };

export const DONE_TEXT = 'PROBE_DONE: the tool has been called and its result has been read.';

export function decide(ctx: ScriptContext, script?: Script): Decision {
  if (script) {
    const d = script(ctx, HELPERS);
    if (d) return d;
  }
  if (ctx.toolResults.length > 0) return { type: 'text', text: DONE_TEXT };
  const tool = findFixtureTool(ctx);
  if (tool) return { type: 'call', tool: tool.name, namespace: tool.namespace, args: ctx.toolArgs, callId: `call_probe_${ctx.seq}` };
  return { type: 'text', text: `PROBE_TOOL_NOT_OFFERED: no tool matching ${ctx.fixtureTool} among ${ctx.offeredTools.length} tools.` };
}

// Connects the official client to the fixture server, calls the tool, and
// writes what the client returned (or threw) to <runDir>/host-result.json.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const runDir = process.env.PROBE_RUN_DIR as string;
const tool = process.env.PROBE_TOOL as string;
const negotiation = process.env.PROBE_NEGOTIATION ?? 'auto';
const serverUrl = process.env.PROBE_SERVER_URL || undefined;
const serverCommand = JSON.parse(process.env.PROBE_SERVER_COMMAND as string) as { command: string; args: string[] };

const client = new Client({ name: 'canimcp-probe-ts-sdk-client', version: '0.1.0' }, negotiation === 'legacy' ? { versionNegotiation: { mode: 'legacy' } } : undefined);
const transport = serverUrl ? new StreamableHTTPClientTransport(new URL(serverUrl)) : new StdioClientTransport({ command: serverCommand.command, args: serverCommand.args, stderr: 'inherit' });

const out: Record<string, unknown> = { negotiation };
try {
  await client.connect(transport);
  out.negotiatedVersion = client.getNegotiatedProtocolVersion?.();
  const tools = await client.listTools();
  out.tools = tools.tools.map((t) => t.name);
  const offered = tools.tools.find((t) => t.name === tool);
  out.toolOffered = offered !== undefined;
  if (offered) {
    try {
      out.result = await client.callTool({ name: tool, arguments: {} });
    } catch (e) {
      out.callError = String(e);
    }
  }
} catch (e) {
  out.connectError = String(e);
} finally {
  try {
    await client.close();
  } catch {
    // ignore
  }
}
writeFileSync(resolve(runDir, 'host-result.json'), JSON.stringify(out, null, 2));
console.log(out.callError ? `PROBE_CALL_ERROR: ${out.callError}` : out.connectError ? `PROBE_CONNECT_ERROR: ${out.connectError}` : 'PROBE_DONE: host-level result written');
process.exit(0);

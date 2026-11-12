// One libfx turn: the official TypeScript client supplies the MCP connection,
// createMcpAdapter turns its tools into libfx tools, and the engine calls the
// mock model over the Chat Completions API.
import { createFxAgent, memory } from 'libfx';
import { createMcpAdapter } from 'libfx/mcp';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const mockUrl = process.env.PROBE_MOCK_URL;
const prompt = process.env.PROBE_PROMPT;
const serverUrl = process.env.PROBE_SERVER_URL || undefined;
const serverCommand = JSON.parse(process.env.PROBE_SERVER_COMMAND);

const client = new Client({ name: 'canimcp-probe-libfx-host', version: '0.1.0' });
const transport = serverUrl ? new StreamableHTTPClientTransport(new URL(serverUrl)) : new StdioClientTransport({ command: serverCommand.command, args: serverCommand.args, stderr: 'inherit' });

let exitCode = 0;
let agent;
let mcp;
try {
  await client.connect(transport);
  mcp = await createMcpAdapter(client, { prefix: 'probe_' });
  console.error(`tools: ${mcp.tools.map((t) => t.name).join(', ') || '(none)'}`);
  agent = createFxAgent({
    provider: {
      name: 'probe',
      baseUrl: `${mockUrl}/v1`,
      models: { 'gpt-probe': { contextWindow: 128000, maxOutputTokens: 8192, supportsToolUse: true } },
    },
    model: 'gpt-probe',
    instructions: ['You call the tool you are asked to call, then report its output.', mcp.instructions].filter(Boolean).join('\n\n'),
    tools: mcp.tools,
    durability: memory(),
  });
  const turn = agent.session().prompt(prompt);
  let text = '';
  for await (const event of turn) {
    if (event.type === 'text_delta') text += event.delta;
  }
  const result = await turn.result;
  console.log(text);
  console.error(`stopReason=${result.stopReason}${result.error ? ' error=' + JSON.stringify(result.error) : ''}`);
} catch (e) {
  exitCode = 1;
  console.error(`PROBE_AGENT_ERROR: ${e && e.stack ? e.stack : String(e)}`);
} finally {
  if (agent) await agent.close().catch(() => undefined);
  if (mcp) await mcp.close().catch(() => undefined);
  await client.close().catch(() => undefined);
}
process.exit(exitCode);

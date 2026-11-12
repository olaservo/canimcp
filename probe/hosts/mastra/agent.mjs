// One Mastra agent turn against the fixture server, model routed to the mock.
// Runs with the pinned packages installed in this directory.
import { Agent } from '@mastra/core/agent';
import { MCPClient } from '@mastra/mcp';

const mockUrl = process.env.PROBE_MOCK_URL;
const prompt = process.env.PROBE_PROMPT;
const config = process.env.PROBE_CONFIG ?? 'default';
const serverUrl = process.env.PROBE_SERVER_URL || undefined;
const serverCommand = JSON.parse(process.env.PROBE_SERVER_COMMAND);

const serverEntry = serverUrl ? { url: new URL(serverUrl) } : { command: serverCommand.command, args: serverCommand.args };
if (config === 'return-errors') serverEntry.onToolError = 'return';
if (config === 'legacy') serverEntry.protocolVersion = 'legacy';

const mcp = new MCPClient({ id: 'probe', servers: { probe: serverEntry } });
let exitCode = 0;
try {
  const tools = await mcp.listTools();
  console.error(`tools: ${Object.keys(tools).join(', ') || '(none)'}`);
  const agent = new Agent({
    id: 'probe-agent',
    name: 'probe-agent',
    instructions: 'You call the tool you are asked to call, then report its output.',
    model: { id: 'openai/gpt-probe', url: `${mockUrl}/v1`, apiKey: 'probe', api: 'chat' },
    tools,
  });
  const result = await agent.generate(prompt, { maxSteps: 4 });
  console.log(result.text);
} catch (e) {
  exitCode = 1;
  console.error(`PROBE_AGENT_ERROR: ${e && e.stack ? e.stack : String(e)}`);
} finally {
  await mcp.disconnect().catch(() => undefined);
}
process.exit(exitCode);

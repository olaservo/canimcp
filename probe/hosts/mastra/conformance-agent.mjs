// agent.mjs for conformance runs (probe/conformance/bridge/adapters/mastra.mjs):
// the same agent turn, with an inputRequests handler on the server entry so
// Mastra declares elicitation and answers it. The handler accepts with empty
// content. As in the SDK's own conformance client, the capability sets
// form.applyDefaults (PROBE_APPLY_DEFAULTS=0 leaves Mastra's stock { form: {} }),
// so defaults that reach the server were filled by the SDK, not the handler.
import { Agent } from '@mastra/core/agent';
import { MCPClient } from '@mastra/mcp';

const mockUrl = process.env.PROBE_MOCK_URL;
const prompt = process.env.PROBE_PROMPT;
const serverUrl = process.env.PROBE_SERVER_URL;

const answers = [];
const serverEntry = {
  url: new URL(serverUrl),
  ...(process.env.PROBE_APPLY_DEFAULTS === '0' ? {} : { capabilities: { elicitation: { form: { applyDefaults: true } } } }),
  inputRequests: async ({ params }) => {
    answers.push(params?.message ?? '');
    return { action: 'accept', content: {} };
  },
};

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
  const result = await agent.generate(prompt, { maxSteps: 8 });
  console.log(result.text);
} catch (e) {
  exitCode = 1;
  console.error(`PROBE_AGENT_ERROR: ${e && e.stack ? e.stack : String(e)}`);
} finally {
  console.error(`input requests answered: ${answers.length}`);
  await mcp.disconnect().catch(() => undefined);
}
process.exit(exitCode);

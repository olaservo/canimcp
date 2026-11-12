"""One Strands agent turn against the fixture server, model routed to the mock.

Runs with the pinned packages installed in ./.venv. Environment, as mastra's
agent.mjs uses it: PROBE_MOCK_URL, PROBE_PROMPT, PROBE_CONFIG, PROBE_SERVER_URL
(Streamable HTTP) or PROBE_SERVER_COMMAND (stdio, JSON {command, args}).
"""

import json
import os
import sys
import traceback

from mcp import StdioServerParameters, stdio_client
from strands import Agent
from strands.tools.mcp import MCPClient

# newline="\n": Windows text mode would write \r\n and findFinalText would keep the \r.
sys.stdout.reconfigure(encoding="utf-8", newline="\n")
sys.stderr.reconfigure(encoding="utf-8", newline="\n")

mock_url = os.environ["PROBE_MOCK_URL"]
prompt = os.environ["PROBE_PROMPT"]
config = os.environ.get("PROBE_CONFIG", "default")
server_url = os.environ.get("PROBE_SERVER_URL") or None
server_command = json.loads(os.environ["PROBE_SERVER_COMMAND"])


def make_model(name: str):
    if name == "anthropic":
        from strands.models.anthropic import AnthropicModel

        return AnthropicModel(client_args={"base_url": mock_url, "api_key": "probe"}, model_id="claude-probe", max_tokens=1024)
    if name == "responses":
        from strands.models.openai_responses import OpenAIResponsesModel

        return OpenAIResponsesModel(client_args={"base_url": f"{mock_url}/v1", "api_key": "probe"}, model_id="gpt-probe")
    from strands.models.openai import OpenAIModel

    return OpenAIModel(client_args={"base_url": f"{mock_url}/v1", "api_key": "probe"}, model_id="gpt-probe")


if server_url:
    mcp_client = MCPClient(url=server_url)
else:
    params = StdioServerParameters(command=server_command["command"], args=server_command["args"])
    mcp_client = MCPClient(lambda: stdio_client(params))

exit_code = 0
try:
    # Built before the MCP session opens: importing the provider SDK takes tens of seconds here.
    model = make_model(config)
    with mcp_client:
        tools = mcp_client.list_tools_sync()
        print(f"tools: {', '.join(t.tool_name for t in tools) or '(none)'}", file=sys.stderr)
        agent = Agent(
            model=model,
            tools=tools,
            system_prompt="You call the tool you are asked to call, then report its output.",
            callback_handler=None,
        )
        result = agent(prompt)
        print(str(result))
except Exception:
    exit_code = 1
    print(f"PROBE_AGENT_ERROR: {traceback.format_exc()}", file=sys.stderr)
sys.exit(exit_code)

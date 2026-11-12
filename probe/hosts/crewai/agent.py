"""One crewAI crew turn against the fixture server, model routed to the mock.

Runs with the pinned packages installed in .venv next to this file. Env:
PROBE_MOCK_URL, PROBE_PROMPT, PROBE_CONFIG, PROBE_SERVER_URL, PROBE_SERVER_COMMAND.
"""

import json
import os
import sys
import time
import traceback

_t0 = time.monotonic()


def mark(label):
    print(f"[{time.monotonic() - _t0:7.2f}s] {label}", file=sys.stderr, flush=True)


mock_url = os.environ["PROBE_MOCK_URL"]
prompt = os.environ["PROBE_PROMPT"]
config = os.environ.get("PROBE_CONFIG", "default")
server_url = os.environ.get("PROBE_SERVER_URL") or None
server_command = json.loads(os.environ["PROBE_SERVER_COMMAND"])

from crewai import LLM, Agent, Crew, Task  # noqa: E402

mark("crewai imported")
llm =LLM(model="openai/gpt-probe", base_url=f"{mock_url}/v1", api_key="probe")


def native_mcps():
    from crewai.mcp import MCPServerHTTP, MCPServerStdio

    if server_url:
        return [MCPServerHTTP(url=server_url)]
    # The native client names a tool <server>_<tool> and sanitize_tool_name
    # cuts the result to 64 chars with a hash suffix. With the server name
    # built from the full command line (`node C:/.../fixture-server.js
    # --fixture ...`) the tool's own name is cut off. A one-line wrapper in
    # the working directory keeps the server name at `node_srv_mjs`, like a
    # user's `npx -y <package>` entry would.
    wrapper = "srv.mjs"
    with open(wrapper, "w", encoding="utf-8") as f:
        f.write("// Starts the fixture server with its arguments baked in; see agent.py.\n")
        f.write("import { pathToFileURL } from 'node:url';\n")
        f.write(f"const script = {json.dumps(server_command['args'][0])};\n")
        f.write(f"process.argv = [process.argv[0], script, ...{json.dumps(server_command['args'][1:])}];\n")
        f.write("await import(pathToFileURL(script).href);\n")
    return [MCPServerStdio(command=server_command["command"], args=[wrapper])]


def tools_adapter():
    from crewai_tools import MCPServerAdapter

    if server_url:
        params = {"url": server_url, "transport": "streamable-http"}
    else:
        from mcp import StdioServerParameters

        params = StdioServerParameters(command=server_command["command"], args=server_command["args"])
    return MCPServerAdapter(params)


exit_code = 0
adapter = None
try:
    agent_kwargs = dict(
        role="probe",
        goal="Call the tool you are asked to call, then report its output.",
        backstory="You call the tool you are asked to call, then report its output.",
        llm=llm,
        verbose=False,
        max_iter=4,
    )
    if config == "crewai-tools":
        adapter = tools_adapter()
        tools = list(adapter.tools)
        print(f"tools: {', '.join(t.name for t in tools) or '(none)'}", file=sys.stderr)
        agent = Agent(tools=tools, **agent_kwargs)
    else:
        agent = Agent(mcps=native_mcps(), **agent_kwargs)
    mark("agent built")
    task = Task(description=prompt, expected_output="What the tool returned.", agent=agent)
    crew = Crew(agents=[agent], tasks=[task], memory=False, verbose=False)
    result = crew.kickoff()
    mark("kickoff returned")
    print(result.raw, flush=True)
except BaseException:
    exit_code = 1
    print("PROBE_AGENT_ERROR: " + traceback.format_exc(), file=sys.stderr)
finally:
    if adapter is not None:
        try:
            adapter.stop()
        except Exception:
            pass
    mark("exiting")
sys.exit(exit_code)

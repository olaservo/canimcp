# Agent Framework run for conformance answer configs (probe/conformance/bridge/adapters/agent-framework.mjs).
# MCPStreamableHTTPTool builds its own mcp.Client with no elicitation_callback, so this passes a
# caller-owned Client through `mcp_client=` with one that accepts every request with empty content.
# The Client's call_tool answers input-required results through the same callback.
import asyncio
import os
import sys
import time
import traceback

T0 = time.monotonic()

from agent_framework import Agent, MCPStreamableHTTPTool  # noqa: E402
from agent_framework.openai import OpenAIChatCompletionClient  # noqa: E402
from mcp import Client, types  # noqa: E402

mock_url = os.environ["PROBE_MOCK_URL"]
prompt = os.environ["PROBE_PROMPT"]
server_url = os.environ["PROBE_SERVER_URL"]

answered: list[str] = []


async def accept_empty(context, params):
    del context
    answered.append(getattr(params, "message", ""))
    return types.ElicitResult(action="accept", content={})


def log(msg: str) -> None:
    print(f"[{time.monotonic() - T0:7.2f}s] {msg}", file=sys.stderr, flush=True)


async def main() -> int:
    log("config=answer api=chat tool_result_content=structured_first")
    try:
        # read_timeout_seconds matches the framework-owned Client (request_timeout 30).
        async with Client(server_url, read_timeout_seconds=30, elicitation_callback=accept_empty) as mcp_client:
            async with MCPStreamableHTTPTool(name="probe", mcp_client=mcp_client, approval_mode="never_require") as mcp:
                names = [getattr(f, "name", str(f)) for f in getattr(mcp, "functions", [])]
                log(f"connected; tools: {', '.join(names) or '(none)'}")
                client = OpenAIChatCompletionClient(model="gpt-probe", api_key="probe", base_url=f"{mock_url}/v1")
                agent = Agent(
                    client=client,
                    name="probe-agent",
                    instructions="You call the tool you are asked to call, then report its output.",
                    tools=mcp,
                )
                result = await agent.run(prompt)
                log("agent.run returned")
                print(result.text)
                return 0
    except Exception:
        print(f"PROBE_AGENT_ERROR: {traceback.format_exc()}", file=sys.stderr)
        return 1
    finally:
        log(f"input requests answered: {len(answered)}")


if __name__ == "__main__":
    code = asyncio.run(main())
    log("exiting")
    sys.exit(code)

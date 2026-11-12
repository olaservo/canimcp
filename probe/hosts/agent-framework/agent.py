# One Agent Framework (Python) agent turn against the fixture server, model routed to the mock.
# Runs with the pinned packages installed in .venv next to this file.
import asyncio
import json
import os
import sys
import time
import traceback

T0 = time.monotonic()

from agent_framework import Agent, MCPStdioTool, MCPStreamableHTTPTool  # noqa: E402

mock_url = os.environ["PROBE_MOCK_URL"]
prompt = os.environ["PROBE_PROMPT"]
config = os.environ.get("PROBE_CONFIG", "default")
server_url = os.environ.get("PROBE_SERVER_URL") or None
server_command = json.loads(os.environ["PROBE_SERVER_COMMAND"])

# Config name -> (model API, tool_result_content mode).
CONFIGS = {
    "default": ("chat", "structured_first"),
    "content-first": ("chat", "content_first"),
    "content-only": ("chat", "content_only"),
    "structured-only": ("chat", "structured_only"),
    "both": ("chat", "both"),
    "responses": ("responses", "structured_first"),
    "anthropic": ("anthropic", "structured_first"),
}


def make_client(api: str):
    if api == "chat":
        from agent_framework.openai import OpenAIChatCompletionClient

        return OpenAIChatCompletionClient(model="gpt-probe", api_key="probe", base_url=f"{mock_url}/v1")
    if api == "responses":
        from agent_framework.openai import OpenAIChatClient

        return OpenAIChatClient(model="gpt-probe", api_key="probe", base_url=f"{mock_url}/v1")
    if api == "anthropic":
        import httpx2
        from agent_framework.anthropic import AnthropicClient
        from anthropic import AsyncAnthropic

        # The framework calls anthropic_client.beta.messages.create, which posts to
        # /v1/messages?beta=true. The mock routes on the full URL and 404s on the query,
        # so a request hook drops it. Headers and body are untouched.
        async def strip_query(request: httpx2.Request) -> None:
            request.url = request.url.copy_with(query=None)

        http_client = httpx2.AsyncClient(event_hooks={"request": [strip_query]})
        anthropic_client = AsyncAnthropic(api_key="probe", base_url=mock_url, http_client=http_client)
        return AnthropicClient(model="claude-probe", anthropic_client=anthropic_client)
    raise ValueError(api)


def make_mcp_tool(mode: str):
    if server_url:
        return MCPStreamableHTTPTool(name="probe", url=server_url, approval_mode="never_require", tool_result_content=mode)
    return MCPStdioTool(
        name="probe",
        command=server_command["command"],
        args=server_command["args"],
        approval_mode="never_require",
        tool_result_content=mode,
    )


def log(msg: str) -> None:
    print(f"[{time.monotonic() - T0:7.2f}s] {msg}", file=sys.stderr, flush=True)


async def main() -> int:
    api, mode = CONFIGS[config]
    log(f"config={config} api={api} tool_result_content={mode}")
    try:
        async with make_mcp_tool(mode) as mcp:
            names = [getattr(f, "name", str(f)) for f in getattr(mcp, "functions", [])]
            log(f"connected; tools: {', '.join(names) or '(none)'}")
            client = make_client(api)
            log("chat client built")
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
        log("mcp tool closed")


if __name__ == "__main__":
    code = asyncio.run(main())
    log("exiting")
    sys.exit(code)

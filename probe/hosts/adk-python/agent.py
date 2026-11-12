"""One ADK agent turn against the fixture server, model routed to the mock.

Runs with the pinned packages installed in .venv next to this file. The adapter
passes the same PROBE_* variables the mastra host uses, plus the ADK feature
flags for the config under test.
"""

import asyncio
import json
import os
import sys
import traceback

from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import (
    StdioConnectionParams,
    StreamableHTTPConnectionParams,
)
from google.genai import types
from mcp import StdioServerParameters

mock_url = os.environ["PROBE_MOCK_URL"]
prompt = os.environ["PROBE_PROMPT"]
config = os.environ.get("PROBE_CONFIG", "default")
server_url = os.environ.get("PROBE_SERVER_URL") or None
server_command = json.loads(os.environ["PROBE_SERVER_COMMAND"])


def make_model():
  if config == "anthropic":
    # The Claude class at this version is Vertex only; AnthropicLlm builds AsyncAnthropic(),
    # which reads ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL. Imported here because the
    # anthropic package is the slowest import and the Gemini configs do not need it.
    from google.adk.models.anthropic_llm import AnthropicLlm

    return AnthropicLlm(model="claude-probe")
  # Gemini API backend: GOOGLE_GENAI_USE_VERTEXAI=false and GOOGLE_API_KEY come from the adapter;
  # the mock serves /v1beta/models/<model>:generateContent.
  return Gemini(model="gemini-probe", base_url=mock_url)


def make_connection():
  if server_url:
    return StreamableHTTPConnectionParams(url=server_url, timeout=30)
  return StdioConnectionParams(
      server_params=StdioServerParameters(
          command=server_command["command"], args=server_command["args"]
      ),
      timeout=30,
  )


async def main() -> int:
  toolset = McpToolset(connection_params=make_connection())
  exit_code = 0
  try:
    tools = await toolset.get_tools()
    print(f"tools: {', '.join(t.name for t in tools) or '(none)'}", file=sys.stderr)
    agent = LlmAgent(
        name="probe_agent",
        model=make_model(),
        instruction="You call the tool you are asked to call, then report its output.",
        tools=[toolset],
    )
    session_service = InMemorySessionService()
    session = await session_service.create_session(app_name="probe", user_id="probe")
    runner = Runner(agent=agent, app_name="probe", session_service=session_service)
    final_text = []
    async for event in runner.run_async(
        user_id="probe",
        session_id=session.id,
        new_message=types.Content(role="user", parts=[types.Part(text=prompt)]),
    ):
      if event.is_final_response() and event.content and event.content.parts:
        final_text.extend(p.text for p in event.content.parts if p.text)
    print("\n".join(final_text))
  except Exception:
    exit_code = 1
    print(f"PROBE_AGENT_ERROR: {traceback.format_exc()}", file=sys.stderr)
  finally:
    try:
      await toolset.close()
    except Exception:
      pass
  return exit_code


if __name__ == "__main__":
  sys.exit(asyncio.run(main()))

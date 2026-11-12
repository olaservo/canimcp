"""One deepagents turn against the fixture server, model routed to the mock.

Runs with the pinned packages installed in .venv. MCP tools come through
deepagents-code's loader (FastMCP proxy router + langchain.mcp), the route the
research note describes; the agent is built with create_deep_agent and the
two middlewares the CLI puts on the MCP path.

Configs (PROBE_CONFIG):
  default      create_deep_agent + mcp_tool_middleware
  hooks        plus ServerHooksMiddleware with a PostToolUse hook that echoes
               the ToolMessage artifact back as additionalContext
  interpreter  MCP tools exposed only through the QuickJS js_eval tool (PTC)
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
import uuid
import warnings
from pathlib import Path

warnings.filterwarnings("ignore")

MOCK_URL = os.environ["PROBE_MOCK_URL"]
PROMPT = os.environ["PROBE_PROMPT"]
CONFIG = os.environ.get("PROBE_CONFIG", "default")
SERVER_URL = os.environ.get("PROBE_SERVER_URL") or None
SERVER_COMMAND = json.loads(os.environ["PROBE_SERVER_COMMAND"])
RECURSION_LIMIT = 12
HERE = Path(__file__).resolve().parent


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


def final_text(messages: list) -> str:
    from langchain_core.messages import AIMessage

    for m in reversed(messages):
        if isinstance(m, AIMessage):
            c = m.content
            if isinstance(c, str):
                return c
            return "\n".join(b.get("text", "") for b in c if isinstance(b, dict))
    return ""


async def main() -> int:
    from deepagents import create_deep_agent
    from deepagents_code.mcp_middleware import mcp_tool_middleware
    from deepagents_code.mcp_tools import _load_tools_from_config
    from langchain_openai import ChatOpenAI

    if SERVER_URL:
        entry = {"type": "http", "url": SERVER_URL}
    else:
        entry = {"command": SERVER_COMMAND["command"], "args": SERVER_COMMAND["args"]}
    tools, manager, infos = await _load_tools_from_config({"mcpServers": {"probe": entry}})
    for info in infos:
        log(f"server {info.name}: status={getattr(info, 'status', '?')} error={getattr(info, 'error', None)}")
    log(f"tools: {', '.join(t.name for t in tools) or '(none)'}")

    model = ChatOpenAI(model="gpt-probe", base_url=f"{MOCK_URL}/v1", api_key="probe")
    system_prompt = "You call the tool you are asked to call, then report its output."
    middleware: list = []
    agent_tools = list(tools)
    invoke_kwargs: dict = {}
    run_config: dict = {"recursion_limit": RECURSION_LIMIT}
    hooks_manager = None
    checkpointer = None

    if CONFIG == "hooks":
        from deepagents_code.approval_mode import ApprovalMode
        from deepagents_code.hooks.manager import HookSessionIdentity, HooksManager
        from deepagents_code.hooks.server_middleware import ServerHooksMiddleware
        from deepagents_code.model_config import DEFAULT_CONFIG_DIR
        from langgraph.checkpoint.memory import InMemorySaver

        hooks_path = Path(DEFAULT_CONFIG_DIR) / "hooks.json"
        hooks_path.parent.mkdir(parents=True, exist_ok=True)
        hooks_path.write_text(
            json.dumps(
                {
                    "hooks": {
                        "PostToolUse": [
                            {"hooks": [{"type": "command", "command": "hook.py", "argv": [sys.executable, str(HERE / "hook.py")]}]}
                        ]
                    }
                }
            )
        )
        log(f"hooks.json: {hooks_path}")
        thread_id = str(uuid.uuid4())
        hooks_manager = HooksManager.create(
            cwd=Path.cwd(),
            identity=lambda: HookSessionIdentity(thread_id, ApprovalMode.MANUAL),
            notice=lambda message, severity: log(f"hook notice [{severity}]: {message}"),
        )
        log(f"hooks enabled: {hooks_manager.enabled}")
        middleware.append(ServerHooksMiddleware(cwd=Path.cwd(), mcp_tools=tools))
        checkpointer = InMemorySaver()
        run_config["configurable"] = {"thread_id": thread_id}
        invoke_kwargs["context"] = hooks_manager.apply_graph_context(
            {"thread_id": thread_id, "approval_mode": "manual"}
        )
        log(f"context: {invoke_kwargs['context']}")

    if tools:
        middleware.append(mcp_tool_middleware(timeout_seconds=60))

    if CONFIG == "interpreter":
        from deepagents_code.config_manifest import (
            INTERPRETER_MAX_PTC_CALLS_DEFAULT,
            INTERPRETER_MAX_RESULT_CHARS_DEFAULT,
            INTERPRETER_MEMORY_LIMIT_MB_DEFAULT,
            INTERPRETER_TIMEOUT_SECONDS_DEFAULT,
        )
        from langchain_quickjs import CodeInterpreterMiddleware

        # The CLI's defaults for the js_eval tool, with the MCP tools named as
        # PTC entries; they are then reachable only as tools.<camelCase>().
        middleware.append(
            CodeInterpreterMiddleware(
                tool_name="js_eval",
                timeout=INTERPRETER_TIMEOUT_SECONDS_DEFAULT,
                memory_limit=INTERPRETER_MEMORY_LIMIT_MB_DEFAULT * 1024 * 1024,
                max_ptc_calls=INTERPRETER_MAX_PTC_CALLS_DEFAULT,
                max_result_chars=INTERPRETER_MAX_RESULT_CHARS_DEFAULT,
                ptc=list(tools),
            )
        )
        agent_tools = []

    log("building agent")
    agent = create_deep_agent(
        model,
        tools=agent_tools,
        system_prompt=system_prompt,
        middleware=middleware,
        checkpointer=checkpointer,
    )
    log("invoking")

    exit_code = 0
    try:
        payload: object = {"messages": [{"role": "user", "content": PROMPT}]}
        result = await agent.ainvoke(payload, run_config, **invoke_kwargs)
        log("invoke returned")
        rounds = 0
        while hooks_manager is not None and result.get("__interrupt__") and rounds < 10:
            from langgraph.types import Command

            pending = {i.id: i.value for i in result["__interrupt__"]}
            log(f"hook interrupts: {len(pending)}")
            resumes = await hooks_manager.fulfill_pending_interrupts(pending)
            result = await agent.ainvoke(Command(resume=resumes), run_config, **invoke_kwargs)
            rounds += 1
        print(final_text(result.get("messages", [])), flush=True)
    except Exception as e:  # noqa: BLE001
        exit_code = 1
        import traceback

        log("PROBE_AGENT_ERROR: " + "".join(traceback.format_exception(e)))
    finally:
        if manager is not None:
            try:
                await manager.cleanup()
            except Exception as e:  # noqa: BLE001
                log(f"cleanup: {e!r}")
    return exit_code


if __name__ == "__main__":
    code = asyncio.run(main())
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(code)

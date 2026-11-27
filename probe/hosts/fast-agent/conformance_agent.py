"""fast-agent run for conformance answer configs (probe/conformance/bridge/adapters/fast-agent.mjs).

`fast-agent go` offers elicitation through an interactive form or auto-cancel only,
so this runs the same agent turn as a FastAgent app with a decorator-supplied
elicitation handler that accepts every request with empty content.
"""

import asyncio
import os
import sys

from fast_agent import FastAgent
from mcp_types import ElicitResult

answered = []


async def accept_empty(context, params):
    del context
    answered.append(getattr(params, "message", ""))
    return ElicitResult(action="accept", content={})


fast = FastAgent(
    "canimcp-conformance",
    config_path=os.environ["PROBE_FA_CONFIG"],
    parse_cli_args=False,
    quiet=True,
    home=os.environ["PROBE_FA_HOME"],
    workspace=os.environ["PROBE_FA_WORKSPACE"],
)


@fast.agent(
    "probe_agent",
    instruction="You call the tool you are asked to call, then report its output.",
    servers=["probe"],
    model=os.environ.get("PROBE_FA_MODEL", "generic.gpt-probe"),
    elicitation_handler=accept_empty,
)
async def main() -> int:
    async with fast.run() as app:
        text = await app.probe_agent.send(os.environ["PROBE_PROMPT"])
        print(text)
    print(f"input requests answered: {len(answered)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))

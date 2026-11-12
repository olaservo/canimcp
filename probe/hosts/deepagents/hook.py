"""PostToolUse command handler for the `hooks` config.

Reads the hook envelope on stdin and returns the ToolMessage artifact (where
deepagents parks structuredContent) as additionalContext, so the probe can
see whether a hook can route it back to the model.
"""

import json
import sys

payload = json.load(sys.stdin)
response = payload.get("tool_response")
artifact = response.get("artifact") if isinstance(response, dict) else None
out = {
    "hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": "HOOK_ARTIFACT: " + json.dumps(artifact, separators=(",", ":")),
    }
}
print(json.dumps(out))

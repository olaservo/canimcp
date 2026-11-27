---
id: fx-declares-elicitation-only-where-someone-can-answer
title: fx declares elicitation per surface, and declares nothing when no one can answer
kind: idiosyncrasy
summary: fx builds its capability object per surface. The terminal app declares elicitation with form and url, `fx ask` declares them only when it runs on a terminal, and an ACP session copies the editor's modes. The probe drove `fx ask --json` and saw `{}`.
capabilities:
  - elicitation
  - elicitation.form
  - elicitation.url
clients:
  - fx
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/vercel-labs/fx
    title: src/core/mcp_host/runtime.zig, Options.questions and declaredCapabilities
    commit: "79638170"
    path: src/core/mcp_host/runtime.zig:Options,start,declaredCapabilities
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/main.zig, loadMcpHost for the terminal app
    commit: "79638170"
    path: src/main.zig:loadMcpHost
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/core/cli/cli_ask.zig, askElicitationCapabilities
    commit: "79638170"
    path: src/core/cli/cli_ask.zig:askElicitationCapabilities,runPromptInternal
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/core/mcp/elicitation.zig, parseAcpCapabilities
    commit: "79638170"
    path: src/core/mcp/elicitation.zig:parseAcpCapabilities
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/acp/mcp_servers.zig, prepare
    commit: "79638170"
    path: src/acp/mcp_servers.zig:prepare
    date: 2026-11-27
  - url: https://github.com/vercel-labs/fx
    title: src/mcp/protocol/mrtr.zig, supported
    commit: "79638170"
    path: src/mcp/protocol/mrtr.zig:supported
    date: 2026-11-27
status: current
lastVerified: 2026-11-27
related:
  - fast-agent-declares-capabilities-per-server
  - utilized-capability-declarations
---

# fx declares elicitation per surface, and declares nothing when no one can answer

The fx engine takes its capability object as a JSON string from the host. `declaredCapabilities` in `src/core/mcp_host/runtime.zig` at `c3dc80c4` returns one of four strings: `{"elicitation":{"form":{},"url":{}}}`, `{"elicitation":{"form":{}}}`, `{"elicitation":{"url":{}}}` or `{}`. Elicitation is the only capability fx can declare. The comment on the option reads "The questions fx's UI on this surface can ask, declared to servers so they only ask those."

Each surface sets the option when it starts the MCP host:

| Surface | Declares |
|---|---|
| Terminal app | `form` and `url` |
| `fx ask` with terminal output and a TTY on stdin and stderr | `form` and `url` |
| `fx ask` with `--json`, `--quiet`, piped output or no TTY | `{}` |
| ACP session | The modes the editor declared in its own `elicitation` capability |

The ACP reader has no empty-object fallback. An editor that sends `"elicitation": {}` gets neither mode, where the MCP rule reads an empty object as form.

The same object goes out in `initialize` on a 2025 server and in `_meta` on every request to a 2026 server, so both eras see the same declaration for a given surface.

The engine holds servers to the declaration. On `2026-07-28`, an `input_required` round is checked against the object with `mrtr.supported`, and a round that asks for a mode fx did not declare ends the call as unsupported input. A round that asks for sampling or roots ends the same way on every surface.

The probe drives fx with `fx ask --json --no-save --quiet`, so its capture shows `"io.modelcontextprotocol/clientCapabilities": {}` on every request. That capture is the headless declaration. A feed that keys on the client name `fx` will see sessions with elicitation and sessions without, from the same build.

# Tool result handling, verified

What reached the model when each client called a fixture tool: 1063 probe records across 17 clients, generated from `data/verified/` by `scripts/build-cards.js`. Each cell is one run of the live probe (`probe/`) against the instrumented fixture server with the model mocked, so the verdict is read off the request the client sent to the model, not inferred from source. Rerun the probe to change a cell.

`[…]` content reached the model · `{…}` structuredContent reached it · `[…]{…}` both · `⟨…⟩` the whole CallToolResult (or a wrapper around it) · `"…"` a placeholder or error text and no fixture payload · `≡` the mirror fixture, text and JSON identical, with the count · `×n` the payload arrived n times · `+_meta` the result `_meta` reached the model · `∅` tool hidden from the model · `↛` offered but never called · `✗` called but no result reached the model · blank: not run.

Columns are the probe scenarios (`probe/registry/scenarios.json`); drop the `tools.result.` prefix. Rows are client version, config and run (transport, and era policy when not both). The At column is the protocol revision seen on the wire.

| Client | Config | Run | At | summary_and_data | mirror | structured_only | sc_empty | with_image | audience_user | is_error | schema_match | schema_mismatch | app_only | large | no_content_key | empty_object | sc_string | sc_null | with_meta | meta_only |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Google ADK (Python) `2.14.0` | default | http | `2025-11-25` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | "…" | ⟨…⟩ | ⟨…⟩ | "…" | "…" | "…" | ⟨…⟩ | ⟨…⟩+_meta | ⟨…⟩+_meta |
| Google ADK (Python) `2.14.0` | default | stdio | `2025-11-25` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | "…" | ⟨…⟩ | ⟨…⟩ | "…" | "…" | "…" | ⟨…⟩ | ⟨…⟩+_meta | ⟨…⟩+_meta |
| Google ADK (Python) `2.14.0` | anthropic | stdio | `2025-11-25` | […] | ≡ | ⟨…⟩ | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | "…" | […] | […] | […] |
| Google ADK (Python) `2.14.0` | modern | stdio | `2026-07-28` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | "…" | ⟨…⟩ | ⟨…⟩ | "…" | "…" | ⟨…⟩ | ⟨…⟩ | ⟨…⟩+_meta | ⟨…⟩+_meta |
| Google ADK (Python) `2.14.0` | strict-errors | stdio | `2025-11-25` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ✗ | ⟨…⟩ | ⟨…⟩ | ✗ | ✗ | ✗ | ⟨…⟩ | ⟨…⟩+_meta | ⟨…⟩+_meta |
| Microsoft Agent Framework `1.25.0` | default | http | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | "…" | {…} | "…" | {…} | {…} | "…" | "…" | {…} | […] | {…} | […] |
| Microsoft Agent Framework `1.25.0` | default | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | "…" | {…} | "…" | {…} | {…} | "…" | "…" | {…} | […] | {…} | […] |
| Microsoft Agent Framework `1.25.0` | anthropic | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | "…" | {…} | "…" | {…} | {…} | "…" | "…" | {…} | […] | {…} | […] |
| Microsoft Agent Framework `1.25.0` | both | stdio | `2026-07-28` | […]{…} | ≡×2 | {…} | […] | […]{…} | […]{…} | "…" | […]{…} | "…" | […]{…} | […]{…} | "…" | "…" | […]{…} | […] | […]{…} | […] |
| Microsoft Agent Framework `1.25.0` | content-first | stdio | `2026-07-28` | […] | ≡ | {…} | […] | […] | […] | "…" | […] | "…" | […] | […] | "…" | "…" | […] | […] | […] | […] |
| Microsoft Agent Framework `1.25.0` | content-only | stdio | `2026-07-28` | […] | ≡ | "…" | […] | […] | […] | "…" | […] | "…" | […] | […] | "…" | "…" | […] | […] | […] | […] |
| Microsoft Agent Framework `1.25.0` | responses | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | "…" | {…} | "…" | {…} | {…} | "…" | "…" | {…} | […] | {…} | […] |
| Microsoft Agent Framework `1.25.0` | structured-only | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | "…" | {…} | "…" | {…} | {…} | "…" | "…" | {…} | "…" | {…} | "…" |
| [Cline](cline.md) `3.0.74` | default | http | `2025-11-25` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | "…" | ↛ | […] | ⟨…⟩ | ⟨…⟩ | "…" | "…" | ⟨…⟩+_meta | ⟨…⟩+_meta |
| [Cline](cline.md) `3.0.74` | default | stdio | `2024-11-05` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ↛ | […] | ⟨…⟩ | "…" | ⟨…⟩ | ⟨…⟩ | ⟨…⟩+_meta | ⟨…⟩+_meta |
| [Codex CLI](openai-codex.md) `0.169.0-alpha.3` | default | http | `2025-06-18` | {…} | ≡ | {…} |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| [Codex CLI](openai-codex.md) `0.169.0-alpha.3` | default | stdio | `2025-06-18` | {…} | ≡ | {…} | "…" | {…} | {…} | {…} | {…} | {…} | ∅ | {…} | {…} | "…" | {…} | […] | {…} | […] |
| [Codex CLI](openai-codex.md) `0.169.0-alpha.3` | mcp-2026-07-28 | http | `2026-07-28` | {…} |  |  |  |  |  |  |  |  |  |  |  |  |  |  | {…} | […] |
| [Codex CLI](openai-codex.md) `0.169.0-alpha.3` | mcp-2026-07-28 | stdio | `2025-06-18` | {…} | ≡ | {…} | "…" | {…} | {…} | {…} | {…} | {…} | ∅ | {…} | {…} | "…" | {…} | […] |  |  |
| crewAI `1.15.37` | default | http | `2025-11-25` | […] | ≡ | {…} | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | "…" | […] | […] | […] |
| crewAI `1.15.37` | default | stdio | `2025-11-25` | […] | ≡ | {…} | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | "…" | […] | […] | […] |
| crewAI `1.15.37` | crewai-tools | stdio | `2025-11-25` | […] | ≡ | "…" | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | "…" | […] | […] | […] |
| deepagents `0.7.34+code-0.2.5` | default | http | `2025-11-25` | […] | ≡ | "…" | […] | […] | […] | […] | […] | ✗ | […] | […] | ✗ | ✗ | ✗ | […] | […] | […] |
| deepagents `0.7.34+code-0.2.5` | default | stdio | `2025-11-25` | […] | ≡ | "…" | […] | […] | […] | […] | […] | ✗ | […] | […] | ✗ | ✗ | ✗ | […] | […] | […] |
| deepagents `0.7.34+code-0.2.5` | hooks | stdio | `2025-11-25` | […]{…} | ≡×2 | {…} | […] | […]{…} | […]{…} | […] | […]{…} | ✗ | […]{…} | […]{…} | ✗ | ✗ | ✗ | […] | […]{…} | […] |
| deepagents `0.7.34+code-0.2.5` | interpreter | stdio | `2025-11-25` | […] | ≡ | "…" | […] | […] | […] | […] | […] | ∅ | […] | […] | ∅ | ∅ | ∅ | […] | […] | […] |
| eve `1.0.0-rc.6` | default | http | `2026-07-28` | {…} | ≡ | {…} | "…" | […] | {…} | […] | {…} | {…} | {…} | {…} | {…} | "…" | {…} | "…" | {…} | […] |
| eve `1.0.0-rc.6` | no-discovery | http | `2025-11-25` | {…} | ≡ | {…} | "…" | […] | {…} | […] | {…} | {…} | {…} | {…} | {…} | "…" | {…} | "…" | {…} | […] |
| [fast-agent](fast-agent.md) `0.10.53` | default | http | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | {…} | {…} | "…" | ∅ | {…} | "…" | "…" | {…} | […] | {…} | […] |
| [fast-agent](fast-agent.md) `0.10.53` | default | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | {…} | {…} | "…" | ∅ | {…} | "…" | "…" | {…} | […] | {…} | […] |
| [fast-agent](fast-agent.md) `0.10.53` | anthropic | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | {…} | {…} | "…" | ∅ | {…} | "…" | "…" | {…} | […] | {…} | […] |
| [fast-agent](fast-agent.md) `0.10.53` | legacy | stdio | `2025-11-25` | {…} | ≡ | {…} | "…" | {…} | {…} | {…} | {…} | "…" | ∅ | {…} | "…" | "…" | "…" | […] | {…} | […] |
| [fast-agent](fast-agent.md) `0.10.53` | modern | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | {…} | {…} | "…" | ∅ | {…} | "…" | "…" | {…} | […] | {…} | […] |
| fx (native engine) `0.0.16` | default | stdio | `2026-07-28` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | […]{…} | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | "…" | "…" | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ |
| [goose](goose.md) `1.58.0` | default | http | `2026-07-28` | […] | ≡ | "…" |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| [goose](goose.md) `1.58.0` | default | stdio | `2026-07-28` | […] | ≡ | "…" | […] | […] | […] | […] | […] | […] | ∅ | […] | "…" | "…" | […] | […] | […] | […] |
| [goose](goose.md) `1.58.0` | anthropic | stdio | `2026-07-28` | […] | ≡ | "…" | […] | […] | […] | […] | […] | […] | ∅ | […] | "…" | "…" | […] | […] | […] | […] |
| [goose](goose.md) `1.58.0` | code-mode | stdio | `2026-07-28` |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ∅ | ∅ |
| [Hermes Agent](hermes-agent.md) `0.23.0+689.ga9ff979` | default | http | `2025-11-25` | […]{…} | ≡ | {…} | […] | […]{…} | […]{…} | […] | […]{…} | "…" | […]{…} | […] | "…" | "…" | "…" | […] | […]{…}+_meta | […]+_meta |
| [Hermes Agent](hermes-agent.md) `0.23.0+689.ga9ff979` | default | stdio | `2025-11-25` | […]{…} | ≡ | {…} | […] | […]{…} | […]{…} | […] | […]{…} | "…" | […]{…} | […] | "…" | "…" | "…" | […] | […]{…}+_meta | […]+_meta |
| [Hermes Agent](hermes-agent.md) `0.23.0+689.ga9ff979` | legacy | stdio | `2025-11-25` | […]{…} | ≡ | {…} | […] | […]{…} | […]{…} | […] | […]{…} | "…" | […]{…} | […] | "…" | "…" | "…" | […] | […]{…}+_meta | […]+_meta |
| [Hermes Agent](hermes-agent.md) `0.23.0+689.ga9ff979` | stateless | stdio | `2026-07-28` | […]{…} | ≡ | {…} | […] | […]{…} | […]{…} | […] | […]{…} | "…" | […]{…} | […] | "…" | "…" | […] | […] | […]{…}+_meta | […]+_meta |
| [Hermes Agent](hermes-agent.md) `0.23.0+689.ga9ff979` | tool-search-off | stdio | `2025-11-25` | […]{…} | ≡ | {…} | […] | […]{…} | […]{…} | […] | […]{…} | "…" | […]{…} | […] | "…" | "…" | "…" | […] | […]{…}+_meta | […]+_meta |
| libfx (fx JavaScript adapter) `0.0.0-eab1401` | default | stdio | `2025-11-25` | […]{…} | ≡ | {…} | […] | […]{…} | […]{…} | […]{…} | […]{…} | "…" | […]{…} | "…" | {…} | "…" | "…" | "…" | […]{…} | […] |
| Mastra `mcp-2.9.0-alpha.1+core-1.83.0-alpha.1` | default | http | `2026-07-28` | {…} | ≡ | {…} |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Mastra `mcp-2.9.0-alpha.1+core-1.83.0-alpha.1` | default | stdio | `2026-07-28` | {…} | ≡ | {…} | "…" | {…} | {…} | […] | […] | "…" | ∅ | {…} | "…" | "…" | {…} | "…" | {…} | ⟨…⟩+_meta |
| Mastra `mcp-2.9.0-alpha.1+core-1.83.0-alpha.1` | legacy | stdio | `2025-11-25` | {…} | ≡ | {…} |  |  |  |  |  |  |  |  |  |  |  |  | {…} | ⟨…⟩+_meta |
| Mastra `mcp-2.9.0-alpha.1+core-1.83.0-alpha.1` | return-errors | stdio | `2026-07-28` | {…} |  |  |  |  |  | ⟨…⟩ |  |  |  |  |  |  |  |  | {…} | ⟨…⟩+_meta |
| [opencode](opencode.md) `0.0.0-a98e3fa`, `2.2.6` | default | http | `2025-11-25` | {…} / {…} | ≡ / ≡ | {…} / {…} | "…" / "…" | {…} / {…} | {…} / {…} | […] / […] | {…} / {…} | {…} / "…" | {…} / {…} | {…} / {…} | {…} / {…} | "…" / "…" | "…" / "…" | "…" / "…" | {…} / {…} | […] / […] |
| [opencode](opencode.md) `0.0.0-a98e3fa`, `2.2.6` | default | stdio | `2025-11-25` | {…} / {…} | ≡ / ≡ | {…} / {…} | "…" / "…" | {…} / {…} | {…} / {…} | […] / […] | {…} / {…} | {…} / "…" | {…} / {…} | {…} / {…} | {…} / {…} | "…" / "…" | "…" / "…" | "…" / "…" | {…} / {…} | […] / […] |
| [opencode](opencode.md) `0.0.0-a98e3fa`, `2.2.6` | codemode-off | stdio | `2025-11-25` | […] / […] | ≡ / ≡ | {…} / {…} | […] / […] | […] / […] | […] / […] | ⟨…⟩ / ⟨…⟩ | […] / […] | […] / "…" | […] / […] | […] / […] | {…} / {…} | "…" / "…" | "…" / "…" | "…" / "…" | […] / […] | […] / […] |
| [opencode](opencode.md) `0.0.0-a98e3fa`, `2.2.6` | execute-denied | stdio | `2025-11-25` | […] / […] | ≡ / ≡ | {…} / {…} | […] / […] | […] / […] | […] / […] | ⟨…⟩ / ⟨…⟩ | […] / […] | […] / "…" | […] / […] | […] / […] | {…} / {…} | "…" / "…" | "…" / "…" | "…" / "…" | […] / […] | […] / […] |
| [opencode](opencode.md) `0.0.0-a98e3fa`, `2.2.6` | protocol-2026-07-28 | stdio | `2026-07-28` | […] / […] | ≡ / ≡ | {…} / {…} | […] / […] | […] / […] | […] / […] | ⟨…⟩ / ⟨…⟩ | […] / […] | […] / "…" | […] / […] | […] / […] | "…" / "…" | "…" / "…" | […] / […] | […] / […] | […] / […] | […] / […] |
| pi `1.5.0` | default | http | `2025-11-25` | […] | ≡ | {…} | […] | […] | […] | […] | […] | […] | […] | […] | {…} | "…" | […] | […] | […] | […] |
| pi `1.5.0` | default | stdio | `2025-11-25` | […] | ≡ | {…} | […] | […] | […] | […] | […] | […] | […] | […] | {…} | "…" | […] | […] | […] | […] |
| pi `1.5.0` | anthropic | stdio | `2025-11-25` | […] | ≡ | {…} | […] | […] | […] | […] | […] | […] | […] | […] | {…} | "…" | […] | […] | […] | […] |
| pi `1.5.0` | codemode | stdio | `2025-11-25` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | […] | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ |
| pi `1.5.0` | deferred | stdio | `2025-11-25` | […] | ≡ | {…} | […] | […] | […] | […] | […] | […] | […] | […] | {…} | "…" | […] | […] | […] | […] |
| Strands Agents `1.64.0+mcp-2.3.0` | default | http | `2026-07-28` | […] | ≡ | "…" | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | […] | […] | […] | […] |
| Strands Agents `1.64.0+mcp-2.3.0` | default | stdio | `2026-07-28` | […] | ≡ | "…" | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | […] | […] | […] | […] |
| Strands Agents `1.64.0+mcp-2.3.0` | anthropic | stdio | `2026-07-28` | […] | ≡ | "…" | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | […] | […] | […] | […] |
| Strands Agents `1.64.0+mcp-2.3.0` | responses | stdio | `2026-07-28` | […] | ≡ | "…" | […] | […] | […] | […] | […] | "…" | […] | […] | "…" | "…" | […] | […] | […] | […] |
| ts-sdk-client `2.4.0` | auto | stdio | `2025-11-25` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ |  |  |  |  |  |  |  |  |  |  |  |  | ⟨…⟩+_meta | ⟨…⟩+_meta |
| ts-sdk-client `2.4.0` | legacy | stdio | `2025-11-25` | ⟨…⟩ | ⟨…⟩×2 | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ✗ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ⟨…⟩ | ✗ | ✗ | ⟨…⟩+_meta | ⟨…⟩+_meta |

## Scenarios

| Scenario | Capability | Question |
|---|---|---|
| summary_and_data | `tools.result.structuredContent` | Both fields present and different: which one does the model read? |
| mirror | `tools.result.structuredContent` | Text mirrors the JSON exactly: once, twice, or deduplicated? |
| structured_only | `tools.result.structuredContent` | content is empty: does the data reach the model, or a placeholder? |
| sc_empty | `tools.result.structuredContent` | structuredContent is {}: treated as present or absent? |
| with_image | `tools.result.media` | Does an image block change which field wins, and does the image survive? |
| audience_user | `tools.result.audience` | Does a block with audience [user] reach the model? |
| is_error | `tools.result.isError` | On isError, which field carries the error text the model sees? |
| schema_match | `tools.result.outputSchema` | With a declared outputSchema that matches, which field reaches the model? |
| schema_mismatch | `tools.result.outputSchema` | With a declared outputSchema that does not match, what does the model see? |
| app_only | `apps.visibility` | Is a tool with _meta.ui.visibility [app] offered to the model? |
| large | `tools.result.content` | Over 64 KiB: what is dropped, truncated, or reordered? |
| no_content_key | `tools.result.content` | No content key at all: parse failure, empty, or the data? |
| empty_object | `tools.result.content` | An empty result object: parse failure, empty, or placeholder? |
| sc_string | `tools.result.structuredContent` | A non-object structuredContent (legal since 2026-07-28): same path as an object? |
| sc_null | `tools.result.structuredContent` | structuredContent null: absent or present? |
| with_meta | `tools.result._meta` | Result-level _meta next to both payload fields: does it reach the model, and does its presence change which field wins? |
| meta_only | `tools.result._meta` | Result-level _meta with content only: does _meta alone switch the client to an envelope or another path? |

## Every record

The full verdict line per run, with a link to the record and its captures.

### Google ADK (Python)

85 records, version `2.14.0`, no registry entry yet. Overlay `data/verified/adk-python.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.app_only/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.app_only/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [meta_only](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.meta_only/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.meta_only/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.with_meta/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.with_meta/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [audience_user](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.audience_user/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.audience_user/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [empty_object](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [empty_object](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [empty_object](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: 1 validation error for Ca" |
| [empty_object](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.empty_object/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 2 validation errors for un" |
| [empty_object](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.empty_object/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| [large](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [large](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.large/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [large](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.large/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [no_content_key](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [no_content_key](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [no_content_key](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: 1 validation error for Ca" |
| [no_content_key](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.no_content_key/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 2 validation errors for un" |
| [no_content_key](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.no_content_key/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| [is_error](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.is_error/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.is_error/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.with_image/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.with_image/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.schema_match/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.schema_match/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: Invalid structured content" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: Invalid structured content" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: Invalid structured conten" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.schema_mismatch/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: Invalid structured content" |
| [schema_mismatch](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.schema_mismatch/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| [mirror](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | payload once (as json) |
| [mirror](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.mirror/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.mirror/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.sc_empty/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.sc_empty/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.sc_null/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.sc_null/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_string](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [sc_string](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\":\"Unexpected error during MCP tool execution: 1 validation error for Cal" |
| [sc_string](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | "…" client error text, no fixture field: "{\"error\": \"Unexpected error during MCP tool execution: 1 validation error for Ca" |
| [sc_string](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.sc_string/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [sc_string](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.sc_string/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | result never sent to the model |
| [structured_only](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.structured_only/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.structured_only/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2025-11-25` | 2.14.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/modern/both-stdio/tools.result.summary_and_data/record.json) | modern | stdio | `2026-07-28` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/adk-python@2.14.0/strict-errors/both-stdio/tools.result.summary_and_data/record.json) | strict-errors | stdio | `2025-11-25` | 2.14.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

### Microsoft Agent Framework

136 records, version `1.25.0`, no registry entry yet. Overlay `data/verified/agent-framework.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.app_only/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.app_only/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.app_only/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.app_only/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.app_only/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [meta_only](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.meta_only/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.meta_only/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.meta_only/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.meta_only/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.meta_only/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "null" |
| [with_meta](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.with_meta/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.with_meta/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.with_meta/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.with_meta/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.with_meta/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [audience_user](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.audience_user/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.audience_user/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.audience_user/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.audience_user/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.audience_user/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [empty_object](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [empty_object](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.empty_object/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.empty_object/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.empty_object/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.empty_object/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [empty_object](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.empty_object/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [large](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.large/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [large](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.large/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [large](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.large/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [large](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.large/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.large/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [no_content_key](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.no_content_key/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.no_content_key/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.no_content_key/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.no_content_key/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [no_content_key](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.no_content_key/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [is_error](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.is_error/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.is_error/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.is_error/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.is_error/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [is_error](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.is_error/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [with_image](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.with_image/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.with_image/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.with_image/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.with_image/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.with_image/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.schema_match/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.schema_match/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.schema_match/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.schema_match/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.schema_match/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"Error: Function failed.\"}]" |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.schema_mismatch/record.json) | both | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.schema_mismatch/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.schema_mismatch/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.schema_mismatch/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [schema_mismatch](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.schema_mismatch/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "Error: Function failed." |
| [mirror](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.mirror/record.json) | both | stdio | `2026-07-28` | 1.25.0 | payload 2x (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.mirror/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.mirror/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.mirror/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [mirror](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.mirror/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | payload once (as json) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"{}\"}]" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.sc_empty/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as json) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.sc_empty/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.sc_empty/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.sc_empty/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.sc_empty/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.sc_null/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.sc_null/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.sc_null/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.sc_null/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.sc_null/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "null" |
| [sc_string](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.sc_string/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.sc_string/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.sc_string/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.sc_string/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.sc_string/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.structured_only/record.json) | both | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.structured_only/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.structured_only/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | "…" no marker reached the model; payload: "null" |
| [structured_only](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.structured_only/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.structured_only/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/both/both-stdio/tools.result.summary_and_data/record.json) | both | stdio | `2026-07-28` | 1.25.0 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/content-first/both-stdio/tools.result.summary_and_data/record.json) | content-first | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/content-only/both-stdio/tools.result.summary_and_data/record.json) | content-only | stdio | `2026-07-28` | 1.25.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/responses/both-stdio/tools.result.summary_and_data/record.json) | responses | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/agent-framework@1.25.0/structured-only/both-stdio/tools.result.summary_and_data/record.json) | structured-only | stdio | `2026-07-28` | 1.25.0 | {…} structuredContent only (1x, as json) |

### Cline

34 records, version `3.0.74`, registry entry [cline](cline.md). Overlay `data/verified/cline.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/cline@3.0.74/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 3.0.74 | tool offered but never called |
| [app_only](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2024-11-05` | 3.0.74 | tool offered but never called |
| [meta_only](../probe/runs/cline@3.0.74/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/cline@3.0.74/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [audience_user](../probe/runs/cline@3.0.74/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [empty_object](../probe/runs/cline@3.0.74/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 0x) |
| [empty_object](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2024-11-05` | 3.0.74 | "…" no marker reached the model; payload: "{}" |
| [large](../probe/runs/cline@3.0.74/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 3.0.74 | […] content only (1x, as json) |
| [large](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.large/record.json) | default | stdio | `2024-11-05` | 3.0.74 | […] content only (1x, as json) |
| [no_content_key](../probe/runs/cline@3.0.74/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [no_content_key](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [is_error](../probe/runs/cline@3.0.74/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/cline@3.0.74/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/cline@3.0.74/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/cline@3.0.74/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 3.0.74 | "…" client error text, no fixture field: "{\"error\":\"MCP error -32602: Structured content does not match the tool's output " |
| [schema_mismatch](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [mirror](../probe/runs/cline@3.0.74/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/cline@3.0.74/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/cline@3.0.74/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 3.0.74 | "…" client error text, no fixture field: "{\"error\":\"[\\n  {\\n    \\\"expected\\\": \\\"record\\\",\\n    \\\"code\\\": \\\"invalid_type\\\"," |
| [sc_null](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_string](../probe/runs/cline@3.0.74/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 3.0.74 | "…" client error text, no fixture field: "{\"error\":\"[\\n  {\\n    \\\"expected\\\": \\\"record\\\",\\n    \\\"code\\\": \\\"invalid_type\\\"," |
| [sc_string](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [structured_only](../probe/runs/cline@3.0.74/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/cline@3.0.74/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/cline@3.0.74/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2024-11-05` | 3.0.74 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

### Codex CLI

38 records, version `0.169.0-alpha.3`, registry entry [openai-codex](openai-codex.md). Overlay `data/verified/codex.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | tool not offered to the model |
| [app_only](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.app_only/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | tool not offered to the model |
| [meta_only](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-http/tools.result.meta_only/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.169.0-alpha.3 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-http/tools.result.with_meta/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [audience_user](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.audience_user/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [empty_object](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0053 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [empty_object](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.empty_object/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "[{\"type\":\"input_text\",\"text\":\"Wall time: 0.0042 seconds\\nOutput:\"},{\"type\":\"inpu" |
| [large](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.large/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.is_error/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.with_image/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.schema_match/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [mirror](../probe/runs/codex@0.169.0-alpha.3/default/both-http/tools.result.mirror/record.json) | default | http | `2025-06-18` | 0.169.0-alpha.3 | payload once (as json) |
| [mirror](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | payload once (as json) |
| [mirror](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.mirror/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | payload once (as json) |
| [sc_empty](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "Wall time: 0.0133 seconds\nOutput:\n{}" |
| [sc_empty](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | "…" no marker reached the model; payload: "Wall time: 0.0117 seconds\nOutput:\n{}" |
| [sc_null](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | […] content only (1x, as text) |
| [sc_null](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.sc_null/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | […] content only (1x, as text) |
| [sc_string](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.sc_string/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/codex@0.169.0-alpha.3/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.structured_only/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-http/tools.result.summary_and_data/record.json) | mcp-2026-07-28 | http | `2026-07-28` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/codex@0.169.0-alpha.3/mcp-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | mcp-2026-07-28 | stdio | `2025-06-18` | 0.169.0-alpha.3 | {…} structuredContent only (1x, as json) |

### crewAI

51 records, version `1.15.37`, no registry entry yet. Overlay `data/verified/crewai.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/crewai@1.15.37/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [app_only](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [app_only](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.app_only/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [meta_only](../probe/runs/crewai@1.15.37/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.meta_only/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/crewai@1.15.37/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.with_meta/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text, _meta did not reach the model) |
| [audience_user](../probe/runs/crewai@1.15.37/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [audience_user](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [audience_user](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.audience_user/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [empty_object](../probe/runs/crewai@1.15.37/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_empty_object: Operation fai" |
| [empty_object](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_empty_object: Operation fai" |
| [empty_object](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.empty_object/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: 1 validation error for CallToolResult\ncontent\n  Field requ" |
| [large](../probe/runs/crewai@1.15.37/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [large](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [large](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.large/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/crewai@1.15.37/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_no_content_key: Operation f" |
| [no_content_key](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_no_content_key: Operation f" |
| [no_content_key](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.no_content_key/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: 1 validation error for CallToolResult\ncontent\n  Field requ" |
| [is_error](../probe/runs/crewai@1.15.37/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [is_error](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [is_error](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.is_error/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [with_image](../probe/runs/crewai@1.15.37/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [with_image](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [with_image](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.with_image/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [schema_match](../probe/runs/crewai@1.15.37/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [schema_match](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [schema_match](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.schema_match/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/crewai@1.15.37/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_schema_mismatch: Operation " |
| [schema_mismatch](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_schema_mismatch: Operation " |
| [schema_mismatch](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.schema_mismatch/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Invalid structured content returned by tool probe_schema_m" |
| [mirror](../probe/runs/crewai@1.15.37/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 1.15.37 | payload once (as json) |
| [mirror](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 1.15.37 | payload once (as json) |
| [mirror](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.mirror/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | payload once (as json) |
| [sc_empty](../probe/runs/crewai@1.15.37/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.sc_empty/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_null](../probe/runs/crewai@1.15.37/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_null](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_null](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.sc_null/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [sc_string](../probe/runs/crewai@1.15.37/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_sc_string: Operation failed" |
| [sc_string](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: Error executing MCP tool probe_sc_string: Operation failed" |
| [sc_string](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.sc_string/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | "…" client error text, no fixture field: "Error executing tool: 1 validation error for CallToolResult\nstructuredContent\n  " |
| [structured_only](../probe/runs/crewai@1.15.37/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 1.15.37 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 1.15.37 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.structured_only/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | "…" no marker reached the model; payload: "[]" |
| [summary_and_data](../probe/runs/crewai@1.15.37/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/crewai@1.15.37/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/crewai@1.15.37/crewai-tools/both-stdio/tools.result.summary_and_data/record.json) | crewai-tools | stdio | `2025-11-25` | 1.15.37 | […] content only (1x, as text) |

### deepagents

68 records, version `0.7.34+code-0.2.5`, no registry entry yet. Overlay `data/verified/deepagents.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.app_only/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [app_only](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.app_only/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.meta_only/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.meta_only/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.with_meta/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.with_meta/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text, _meta did not reach the model) |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.audience_user/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [audience_user](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.audience_user/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.empty_object/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [empty_object](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.empty_object/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.large/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [large](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.large/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.no_content_key/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [no_content_key](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.no_content_key/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.is_error/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [is_error](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.is_error/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.with_image/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as blocks) |
| [with_image](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.with_image/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.schema_match/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [schema_match](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.schema_match/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.schema_mismatch/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [schema_mismatch](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.schema_mismatch/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | payload once (as json) |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | payload once (as json) |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.mirror/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | payload 2x (as json) |
| [mirror](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.mirror/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | payload once (as text) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.sc_empty/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as json) |
| [sc_empty](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.sc_empty/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.sc_null/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_null](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.sc_null/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.sc_string/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | result never sent to the model |
| [sc_string](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.sc_string/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | tool not offered to the model |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | "…" no marker reached the model; payload: "[]" |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | "…" no marker reached the model; payload: "[]" |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.structured_only/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.structured_only/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | "…" no marker reached the model; payload: "<result>[]</result>" |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/hooks/both-stdio/tools.result.summary_and_data/record.json) | hooks | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [summary_and_data](../probe/runs/deepagents@0.7.34+code-0.2.5/interpreter/both-stdio/tools.result.summary_and_data/record.json) | interpreter | stdio | `2025-11-25` | 0.7.34+code-0.2.5 | […] content only (1x, as text) |

### eve

34 records, version `1.0.0-rc.6`, no registry entry yet. Overlay `data/verified/eve.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.app_only/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [meta_only](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.meta_only/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.with_meta/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [audience_user](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.audience_user/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [empty_object](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | "…" client error text, no fixture field: "{\"error\":\"MCPClientError: Failed to parse server response\"}" |
| [empty_object](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.empty_object/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | "…" client error text, no fixture field: "{\"error\":\"MCPClientError: Failed to parse server response\"}" |
| [large](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [large](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.large/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.no_content_key/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | […] content only (1x, as json) |
| [is_error](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.is_error/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | […] content only (1x, as json) |
| [with_image](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | […] content only (1x, as json) |
| [with_image](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.with_image/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | […] content only (1x, as json) |
| [schema_match](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.schema_match/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.schema_mismatch/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [mirror](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | payload once (as json) |
| [mirror](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.mirror/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | payload once (as json) |
| [sc_empty](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.sc_empty/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "null" |
| [sc_null](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.sc_null/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | "…" no marker reached the model; payload: "null" |
| [sc_string](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.sc_string/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.structured_only/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/eve@1.0.0-rc.6/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/eve@1.0.0-rc.6/no-discovery/both-http/tools.result.summary_and_data/record.json) | no-discovery | http | `2025-11-25` | 1.0.0-rc.6 | {…} structuredContent only (1x, as json) |

### fast-agent

85 records, version `0.10.53`, registry entry [fast-agent](fast-agent.md). Overlay `data/verified/fast-agent.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.app_only/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | tool not offered to the model |
| [app_only](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.app_only/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | tool not offered to the model |
| [meta_only](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.meta_only/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.meta_only/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.with_meta/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.with_meta/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [audience_user](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.audience_user/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.audience_user/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [empty_object](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 2 validation errors " |
| [empty_object](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 2 validation errors " |
| [empty_object](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "[{\"type\":\"text\",\"text\":\"Failed to call_tool 'probe_empty_object' on server 'prob" |
| [empty_object](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.empty_object/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 1 validation error f" |
| [empty_object](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.empty_object/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_empty_object' on server 'probe': 2 validation errors " |
| [large](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.large/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.large/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [no_content_key](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 2 validation error" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 2 validation error" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "[{\"type\":\"text\",\"text\":\"Failed to call_tool 'probe_no_content_key' on server 'pr" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.no_content_key/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 1 validation error" |
| [no_content_key](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.no_content_key/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_no_content_key' on server 'probe': 2 validation error" |
| [is_error](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.is_error/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.is_error/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as blocks) |
| [with_image](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.with_image/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.with_image/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.schema_match/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.schema_match/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "[{\"type\":\"text\",\"text\":\"Failed to call_tool 'probe_schema_mismatch' on server 'p" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.schema_mismatch/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| [schema_mismatch](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.schema_mismatch/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_schema_mismatch' on server 'probe': Invalid structure" |
| [mirror](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.mirror/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | payload once (as json) |
| [mirror](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.mirror/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | payload once (as json) |
| [sc_empty](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "[{\"type\":\"text\",\"text\":\"{}\"}]" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.sc_empty/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.sc_empty/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.sc_null/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | […] content only (1x, as text) |
| [sc_null](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.sc_null/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | […] content only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [sc_string](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.sc_string/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | "…" client error text, no fixture field: "Failed to call_tool 'probe_sc_string' on server 'probe': 1 validation error for " |
| [sc_string](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.sc_string/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.structured_only/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.structured_only/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy | stdio | `2025-11-25` | 0.10.53 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/fast-agent@0.10.53/modern/both-stdio/tools.result.summary_and_data/record.json) | modern | stdio | `2026-07-28` | 0.10.53 | {…} structuredContent only (1x, as json) |

### fx (native engine)

17 records, version `0.0.16`, no registry entry yet. Overlay `data/verified/fx.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [meta_only](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta did not reach the model) |
| [with_meta](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta did not reach the model) |
| [audience_user](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [empty_object](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 0.0.16 | "…" no marker reached the model; payload: "[\"{\\\"skills\\\":[],\\\"mcp_tools\\\":[{\\\"name\\\":\\\"mcp_probe_probe_empty_object\\\",\\\"ser" |
| [large](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [no_content_key](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 0.0.16 | "…" no marker reached the model; payload: "[\"{\\\"skills\\\":[],\\\"mcp_tools\\\":[{\\\"name\\\":\\\"mcp_probe_probe_no_content_key\\\",\\\"s" |
| [is_error](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 0.0.16 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [mirror](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_string](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [structured_only](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/fx@0.0.16/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 0.0.16 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

### goose

39 records, version `1.58.0`, registry entry [goose](goose.md). Overlay `data/verified/goose.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| [app_only](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| [meta_only](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/goose@1.58.0/code-mode/both-stdio/tools.result.meta_only/record.json) | code-mode | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| [with_meta](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/goose@1.58.0/code-mode/both-stdio/tools.result.with_meta/record.json) | code-mode | stdio | `2026-07-28` | 1.58.0 | tool not offered to the model |
| [audience_user](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [empty_object](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "The tool call returned the following error:\n-32603: -32603: Unexpected response " |
| [empty_object](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "Error: -32603: -32603: Unexpected response type" |
| [large](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [large](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [no_content_key](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [is_error](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as blocks) |
| [schema_match](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [mirror](../probe/runs/goose@1.58.0/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.58.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 1.58.0 | payload once (as json) |
| [mirror](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | payload once (as json) |
| [sc_empty](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [structured_only](../probe/runs/goose@1.58.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [structured_only](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | "…" no marker reached the model; payload: "(empty result)" |
| [summary_and_data](../probe/runs/goose@1.58.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.58.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/goose@1.58.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 1.58.0 | […] content only (1x, as text) |

### Hermes Agent

85 records, version `0.23.0+689.ga9ff979`, registry entry [hermes-agent](hermes-agent.md). Overlay `data/verified/hermes-agent.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.app_only/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.app_only/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [app_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.app_only/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.meta_only/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.meta_only/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [meta_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.meta_only/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.with_meta/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.with_meta/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [with_meta](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.with_meta/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text, _meta reached the model) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.audience_user/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.audience_user/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [audience_user](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.audience_user/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.empty_object/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.empty_object/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [empty_object](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.empty_object/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_empty_object\">\nThe following co" |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.large/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.large/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [large](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.large/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.no_content_key/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.no_content_key/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [no_content_key](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.no_content_key/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_no_content_key\">\nThe following " |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.is_error/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.is_error/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [is_error](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.is_error/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.with_image/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.with_image/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [with_image](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.with_image/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.schema_match/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.schema_match/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_match](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.schema_match/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.schema_mismatch/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.schema_mismatch/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [schema_mismatch](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.schema_mismatch/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_schema_mismatch\">\nThe following" |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.mirror/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.mirror/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [mirror](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.mirror/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | payload once (as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.sc_empty/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.sc_empty/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.sc_empty/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.sc_null/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.sc_null/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_null](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.sc_null/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.sc_string/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.sc_string/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] content only (1x, as text) |
| [sc_string](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.sc_string/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | "…" client error text, no fixture field: "<untrusted_tool_result source=\"mcp__probe__probe_sc_string\">\nThe following conte" |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.structured_only/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.structured_only/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.structured_only/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | {…} structuredContent only (1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/stateless/both-stdio/tools.result.summary_and_data/record.json) | stateless | stdio | `2026-07-28` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |
| [summary_and_data](../probe/runs/hermes-agent@0.23.0+689.ga9ff979/tool-search-off/both-stdio/tools.result.summary_and_data/record.json) | tool-search-off | stdio | `2025-11-25` | 0.23.0+689.ga9ff979 | […] and {…} (content 1x, structuredContent 1x, as text) |

### libfx (fx JavaScript adapter)

17 records, version `0.0.0-eab1401`, no registry entry yet. Overlay `data/verified/libfx.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [meta_only](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json, _meta did not reach the model) |
| [audience_user](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [empty_object](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" no marker reached the model; payload: "" |
| [large](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" no marker reached the model; payload: "Host tool result exceeded the configured limit" |
| [no_content_key](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [with_image](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [schema_match](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |
| [schema_mismatch](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" client error text, no fixture field: "Structured content does not match the tool's output schema: data must have requi" |
| [mirror](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | payload once (as json) |
| [sc_empty](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] content only (1x, as json) |
| [sc_null](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"record\",\n    \"code\": \"inva" |
| [sc_string](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"record\",\n    \"code\": \"inva" |
| [structured_only](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/libfx@0.0.0-eab1401/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.0.0-eab1401 | […] and {…} (content 1x, structuredContent 1x, as json) |

### Mastra

29 records, version `mcp-2.9.0-alpha.1+core-1.83.0-alpha.1`, no registry entry yet. Overlay `data/verified/mastra.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | tool not offered to the model |
| [meta_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.meta_only/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.meta_only/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.with_meta/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.with_meta/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [audience_user](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [empty_object](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"array\",\n    \"code\": \"inval" |
| [large](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" client error text, no fixture field: "Invalid result for tools/call: [\n  {\n    \"expected\": \"array\",\n    \"code\": \"inval" |
| [is_error](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | […] content only (1x, as text) |
| [is_error](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.is_error/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" client error text, no fixture field: "Structured content does not match the tool's output schema: data must have requi" |
| [mirror](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | payload once (as json) |
| [mirror](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | payload once (as json) |
| [mirror](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.mirror/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | payload once (as json) |
| [sc_empty](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" no marker reached the model; payload: "{}" |
| [sc_null](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | "…" no marker reached the model; payload: "null" |
| [sc_string](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as text) |
| [structured_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.structured_only/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy | stdio | `2025-11-25` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/mastra@mcp-2.9.0-alpha.1+core-1.83.0-alpha.1/return-errors/both-stdio/tools.result.summary_and_data/record.json) | return-errors | stdio | `2026-07-28` | mcp-2.9.0-alpha.1+core-1.83.0-alpha.1 | {…} structuredContent only (1x, as json) |

### opencode

170 records, versions `0.0.0-a98e3fa`, `2.2.6`, registry entry [opencode](opencode.md). Overlay `data/verified/opencode.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@2.2.6/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.app_only/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.app_only/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.app_only/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.app_only/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.app_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [app_only](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.app_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.meta_only/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.meta_only/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.meta_only/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.meta_only/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.meta_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.meta_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.with_meta/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.with_meta/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.with_meta/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.with_meta/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.with_meta/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.with_meta/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text, _meta did not reach the model) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@2.2.6/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.audience_user/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.audience_user/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.audience_user/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.audience_user/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.audience_user/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [audience_user](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.audience_user/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.empty_object/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.empty_object/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.empty_object/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.empty_object/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "null" |
| [empty_object](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.empty_object/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [empty_object](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.empty_object/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_empty_object\\\" on " |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.large/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.large/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.large/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.large/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [large](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.large/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [large](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.large/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.no_content_key/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.no_content_key/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.no_content_key/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.no_content_key/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [no_content_key](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.no_content_key/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_no_content_key\\\" o" |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@2.2.6/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.is_error/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.is_error/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.is_error/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.is_error/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.is_error/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [is_error](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.is_error/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@2.2.6/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.with_image/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.with_image/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.with_image/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.with_image/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.with_image/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [with_image](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.with_image/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@2.2.6/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.schema_match/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.schema_match/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.schema_match/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.schema_match/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.schema_match/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_match](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.schema_match/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_schema_mismatch\" on server \"probe\" failed: Structured content do" |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_schema_mismatch\" on server \"probe\" failed: Structured content do" |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.schema_mismatch/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.schema_mismatch/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_schema_mismatch\\\" " |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.schema_mismatch/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.schema_mismatch/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_schema_mismatch\\\" " |
| [schema_mismatch](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.schema_mismatch/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_schema_mismatch\\\" " |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.mirror/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.mirror/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.mirror/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.mirror/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | payload once (as json) |
| [mirror](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.mirror/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | payload once (as json) |
| [mirror](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.mirror/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | payload once (as json) |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@2.2.6/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" no marker reached the model; payload: "{}" |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.sc_empty/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.sc_empty/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.sc_empty/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.sc_empty/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_empty](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.sc_empty/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@2.2.6/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_null\" on server \"probe\" failed: Invalid result for tools/call" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.sc_null/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.sc_null/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.sc_null/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.sc_null/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_null\\\" on serve" |
| [sc_null](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.sc_null/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_null](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.sc_null/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@2.2.6/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "MCP tool \"probe_sc_string\" on server \"probe\" failed: Invalid result for tools/ca" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.sc_string/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.sc_string/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.sc_string/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.sc_string/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | "…" client error text, no fixture field: "{\"error\":{\"type\":\"tool.execution\",\"message\":\"MCP tool \\\"probe_sc_string\\\" on ser" |
| [sc_string](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.sc_string/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [sc_string](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.sc_string/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.structured_only/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.structured_only/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.structured_only/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.structured_only/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.structured_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.structured_only/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@2.2.6/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 0.0.0-a98e3fa | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@2.2.6/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 2.2.6 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/codemode-off/both-stdio/tools.result.summary_and_data/record.json) | codemode-off | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@2.2.6/codemode-off/both-stdio/tools.result.summary_and_data/record.json) | codemode-off | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/execute-denied/both-stdio/tools.result.summary_and_data/record.json) | execute-denied | stdio | `2025-11-25` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@2.2.6/execute-denied/both-stdio/tools.result.summary_and_data/record.json) | execute-denied | stdio | `2025-11-25` | 2.2.6 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@0.0.0-a98e3fa/protocol-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 0.0.0-a98e3fa | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/opencode@2.2.6/protocol-2026-07-28/both-stdio/tools.result.summary_and_data/record.json) | protocol-2026-07-28 | stdio | `2026-07-28` | 2.2.6 | […] content only (1x, as text) |

### pi

85 records, version `1.5.0`, no registry entry yet. Overlay `data/verified/pi.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/pi@1.5.0/default/both-http/tools.result.app_only/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.app_only/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [app_only](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.app_only/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [meta_only](../probe/runs/pi@1.5.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.meta_only/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta did not reach the model) |
| [meta_only](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.meta_only/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.with_meta/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta did not reach the model) |
| [with_meta](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.with_meta/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text, _meta did not reach the model) |
| [audience_user](../probe/runs/pi@1.5.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.audience_user/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [audience_user](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.audience_user/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [empty_object](../probe/runs/pi@1.5.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "(no tool output)" |
| [empty_object](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "(no tool output)" |
| [empty_object](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "" |
| [empty_object](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.empty_object/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 0x, structuredContent 0x) |
| [empty_object](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.empty_object/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | "…" no marker reached the model; payload: "[\"Loaded 1 tool. They are available from your next call:\\n- mcp__probe__probe_em" |
| [large](../probe/runs/pi@1.5.0/default/both-http/tools.result.large/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.large/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [large](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.large/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/pi@1.5.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [no_content_key](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.no_content_key/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [no_content_key](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.no_content_key/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [is_error](../probe/runs/pi@1.5.0/default/both-http/tools.result.is_error/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.is_error/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [is_error](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.is_error/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/pi@1.5.0/default/both-http/tools.result.with_image/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.with_image/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.with_image/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/pi@1.5.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.schema_match/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.schema_match/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.schema_mismatch/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.schema_mismatch/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [mirror](../probe/runs/pi@1.5.0/default/both-http/tools.result.mirror/record.json) | default | http | `2025-11-25` | 1.5.0 | payload once (as json) |
| [mirror](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2025-11-25` | 1.5.0 | payload once (as json) |
| [mirror](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | payload once (as json) |
| [mirror](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.mirror/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.mirror/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | payload once (as json) |
| [sc_empty](../probe/runs/pi@1.5.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.sc_empty/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_empty](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.sc_empty/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.sc_null/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.sc_null/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.sc_string/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [sc_string](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.sc_string/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [structured_only](../probe/runs/pi@1.5.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [structured_only](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.structured_only/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.structured_only/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | {…} structuredContent only (1x, as json) |
| [summary_and_data](../probe/runs/pi@1.5.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/pi@1.5.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/pi@1.5.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/pi@1.5.0/codemode/both-stdio/tools.result.summary_and_data/record.json) | codemode | stdio | `2025-11-25` | 1.5.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/pi@1.5.0/deferred/both-stdio/tools.result.summary_and_data/record.json) | deferred | stdio | `2025-11-25` | 1.5.0 | […] content only (1x, as text) |

### Strands Agents

68 records, version `1.64.0+mcp-2.3.0`, no registry entry yet. Overlay `data/verified/strands.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.app_only/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.app_only/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.app_only/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [app_only](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.app_only/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.meta_only/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.meta_only/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.meta_only/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [meta_only](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.meta_only/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.with_meta/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.with_meta/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.with_meta/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [with_meta](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.with_meta/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text, _meta did not reach the model) |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.audience_user/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.audience_user/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.audience_user/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [audience_user](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.audience_user/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.empty_object/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.empty_object/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.empty_object/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "[{\"text\":\"Tool execution failed: 2 validation errors for union[CallToolResult,fu" |
| [empty_object](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.empty_object/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.large/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.large/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.large/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [large](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.large/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.no_content_key/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.no_content_key/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.no_content_key/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "[{\"text\":\"Tool execution failed: 2 validation errors for union[CallToolResult,fu" |
| [no_content_key](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.no_content_key/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: 2 validation errors for union[CallToolResult,function-aft" |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.is_error/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.is_error/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.is_error/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [is_error](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.is_error/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.with_image/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.with_image/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.with_image/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as blocks) |
| [with_image](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.with_image/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as blocks) |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.schema_match/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.schema_match/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.schema_match/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_match](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.schema_match/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.schema_mismatch/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: Invalid structured content returned by tool probe_schema_" |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.schema_mismatch/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: Invalid structured content returned by tool probe_schema_" |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.schema_mismatch/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "[{\"text\":\"Tool execution failed: Invalid structured content returned by tool pro" |
| [schema_mismatch](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.schema_mismatch/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" client error text, no fixture field: "Tool execution failed: Invalid structured content returned by tool probe_schema_" |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.mirror/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.mirror/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.mirror/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [mirror](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.mirror/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | payload once (as json) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.sc_empty/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.sc_empty/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.sc_empty/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_empty](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.sc_empty/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.sc_null/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.sc_null/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.sc_null/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_null](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.sc_null/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.sc_string/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.sc_string/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.sc_string/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [sc_string](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.sc_string/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.structured_only/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "" |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.structured_only/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "" |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.structured_only/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "[]" |
| [structured_only](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.structured_only/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | "…" no marker reached the model; payload: "" |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-http/tools.result.summary_and_data/record.json) | default | http | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/default/both-stdio/tools.result.summary_and_data/record.json) | default | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/anthropic/both-stdio/tools.result.summary_and_data/record.json) | anthropic | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |
| [summary_and_data](../probe/runs/strands@1.64.0+mcp-2.3.0/responses/both-stdio/tools.result.summary_and_data/record.json) | responses | stdio | `2026-07-28` | 1.64.0+mcp-2.3.0 | […] content only (1x, as text) |

### ts-sdk-client

22 records, version `2.4.0`, no registry entry yet. Overlay `data/verified/ts-sdk-client.json`.

| Scenario | Config | Run | At | Version | Verdict |
|---|---|---|---|---|---|
| [app_only](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.app_only/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [meta_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.meta_only/record.json) | auto | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [meta_only](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.meta_only/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x, _meta reached the model) |
| [with_meta](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.with_meta/record.json) | auto | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [with_meta](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.with_meta/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x, _meta reached the model) |
| [audience_user](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.audience_user/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [empty_object](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.empty_object/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 0x) |
| [large](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.large/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [no_content_key](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.no_content_key/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [is_error](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.is_error/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [with_image](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.with_image/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_match](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.schema_match/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [schema_mismatch](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.schema_mismatch/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | result never sent to the model |
| [mirror](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.mirror/record.json) | auto | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (payload 2x) |
| [mirror](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.mirror/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (payload 2x) |
| [sc_empty](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.sc_empty/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 0x) |
| [sc_null](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.sc_null/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | result never sent to the model |
| [sc_string](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.sc_string/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | result never sent to the model |
| [structured_only](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.structured_only/record.json) | auto | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [structured_only](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.structured_only/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 0x, structuredContent 1x) |
| [summary_and_data](../probe/runs/ts-sdk-client@2.4.0/auto/both-stdio/tools.result.summary_and_data/record.json) | auto | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |
| [summary_and_data](../probe/runs/ts-sdk-client@2.4.0/legacy/both-stdio/tools.result.summary_and_data/record.json) | legacy | stdio | `2025-11-25` | 2.4.0 | ⟨…⟩ envelope (content 1x, structuredContent 1x) |

---

Generated from `data/verified/*.json` by `scripts/build-cards.js`. Rerun the probe and `npm run build:cards`, do not edit this file.

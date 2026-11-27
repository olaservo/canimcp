# Hugging Face Chat UI

Hugging Face's open-source chat interface. Open source, and the source has not been read for this entry yet. Apify has no record for it, so the entry rests on Hugging Face MCP traffic alone. 100% of its tool calls in the feed are at 2026-07-28. What the traffic declares is on the capability pages. The wire name chat-ui-mcp appears in `src/lib/server/mcp/client.ts` of that repository.

## At a glance

| | |
|---|---|
| Registry id | `huggingface-chat-ui` |
| Vendor | Hugging Face |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | chat |
| Licence | Apache-2.0 |
| Source | <https://github.com/huggingface/chat-ui> |
| Home | <https://github.com/huggingface/chat-ui> |
| Wire names | `chat-ui-mcp` |
| Prefers | `2026-07-28` |
| Speaks | `2026-07-28` |
| Rows describe | `2026-07-28` and every older revision it speaks, not yet split by revision |
| In traffic | evalstate/mcp-clients, window ending 2026-11-25 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| Transports | — not recorded | | |
| Authentication | — not recorded | | |
| **Tools** | ● full | observed |  |
| Resources | — not recorded | | |
| Prompts | — not recorded | | |
| Completions | — not recorded | | |
| Sampling | — not recorded | | |
| Elicitation | — not recorded | | |
| Roots | — not recorded | | |
| Logging | — not recorded | | |
| Instructions | — not recorded | | |
| Icons | — not recorded | | |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ○ unsupported | observed | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | observed | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | · untested |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | · untested |  |  |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **tools** — Known only from traffic: the feed counts tool calls from this wire name.
- **extensions.io.modelcontextprotocol/ui** — Not declared in traffic: the HF telemetry (huggingface-chatui) sees io.modelcontextprotocol/ui in at most half of this client's 2026-07-28 tool calls.
- **extensions.io.modelcontextprotocol/tasks** — Not declared in traffic: the HF telemetry (huggingface-chatui) sees the tasks extension in at most half of this client's 2026-07-28 tool calls. No source to read.
- **extensions.io.modelcontextprotocol/skills** — No source to read. The HF telemetry records skills only from a successful skills/list call, and it has seen none from this client, which does not show the client lacks it.
- **extensions.io.modelcontextprotocol/events** — No source to read, and the HF telemetry does not report events.

## Observed in traffic

From `evalstate/mcp-clients` at [`904917c5`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/904917c5574ca3c830de12131ed318dec05ea179/reports/dashboard-v1.json), report generated 2026-11-26, window 2026-09-27 to 2026-11-25. Grouped as `huggingface-chatui` from wire names `chat-ui-mcp`. Tool calls by revision over the 30 days to 2026-11-25: `2026-07-28` 100%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | `2026-07-28` | — not recorded | More than 50% of this client's 2026-07-28 tool calls in the window declared it. |
| elicitation.url | ● full | `2026-07-28` | — not recorded | More than 50% of this client's 2026-07-28 tool calls in the window declared it. |
| apps | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Provenance

No source read is recorded for this client. Every claim above comes from another tier.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

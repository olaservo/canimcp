# ChatGPT

OpenAI's chat product. Closed source, so nothing here is a read. The entry joins Apify's curated record, written at 2025-06-18, to Hugging Face MCP traffic. Its tool calls in the feed are split: 53.8% at 2025-11-25, 46.2% at 2026-07-28. Apify's record is under the wire name ChatGPT. The traffic is under openai-mcp, which the feed labels OpenAI ChatGPT, and that label is what joins the two.

## At a glance

| | |
|---|---|
| Registry id | `chatgpt` |
| Vendor | OpenAI |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | chat |
| Licence | closed source |
| Home | <https://chatgpt.com> |
| Wire names | `openai-mcp`, `ChatGPT` |
| Speaks | `2025-06-18`, `2025-11-25`, `2026-07-28` |
| Rows describe | `2026-07-28` and every older revision it speaks, not yet split by revision |
| In traffic | evalstate/mcp-clients, window ending 2026-11-25 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| Transports | — not recorded | | |
| Authentication | — not recorded | | |
| **Tools** | ● full | declared | `2025-06-18` |
| **Resources** | ○ unsupported | declared | `2025-06-18` |
| **Prompts** | ○ unsupported | declared | `2025-06-18` |
| Completions | — not recorded | | |
| **Sampling** | ○ unsupported | declared | `2025-06-18` |
| **Elicitation** | ○ unsupported | declared | `2025-06-18` |
| **Roots** | ○ unsupported | declared | `2025-06-18` |
| Logging | — not recorded | | |
| Instructions | — not recorded | | |
| Icons | — not recorded | | |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | — not recorded | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | — not recorded | | |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **tools** — Hugging Face traffic includes tool calls from this client.
- **elicitation** — Both tiers agree: Apify's record has no elicitation key, and the traffic does not declare it.

## Observed in traffic

From `evalstate/mcp-clients` at [`904917c5`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/904917c5574ca3c830de12131ed318dec05ea179/reports/dashboard-v1.json), report generated 2026-11-26, window 2026-09-27 to 2026-11-25. Grouped as `openai` from wire names `openai-mcp`. Tool calls by revision over the 30 days to 2026-11-25: `2026-07-28` 64.4%, `2025-11-25` 35.6%, `2025-03-26` <0.1%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| elicitation.url | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| apps | ● full | ? | — not recorded | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| tasks | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Provenance

No source read is recorded for this client. Every claim above comes from another tier.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

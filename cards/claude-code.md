# Claude Code

Anthropic's coding agent for the terminal and IDEs. Closed source, so nothing here is a read. The entry joins Apify's curated record, written at 2025-06-18, to Hugging Face MCP traffic. 99.2% of its tool calls in the feed are at 2026-07-28. The two disagree on elicitation.

## At a glance

| | |
|---|---|
| Registry id | `claude-code` |
| Vendor | Anthropic |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | cli |
| Licence | closed source |
| Home | <https://claude.com/product/claude-code> |
| Wire names | `claude-code` |
| Prefers | `2026-07-28` |
| Speaks | `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| In traffic | evalstate/mcp-clients, window ending 2026-11-25 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| Transports | — not recorded | | |
| Authentication | — not recorded | | |
| **Tools** | ● full | declared | `2025-06-18` |
| **Resources** | ● full | declared | `2025-06-18` |
| **Prompts** | ● full | declared | `2025-06-18` |
| Completions | — not recorded | | |
| **Sampling** | ○ unsupported | declared | `2025-06-18` |
| **Elicitation** | · untested | declared | `2025-06-18` |
| **Roots** | ● full | declared | `2025-06-18` |
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
- **elicitation** — The tiers disagree. Apify's record has no elicitation key at 2025-06-18. Hugging Face traffic declares elicitation, with no revision recorded, and URL elicitation at 2026-07-28. Neither tier exercised it, and the source cannot be read.

## Observed in traffic

From `evalstate/mcp-clients` at [`904917c5`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/904917c5574ca3c830de12131ed318dec05ea179/reports/dashboard-v1.json), report generated 2026-11-26, window 2026-09-27 to 2026-11-25. Grouped as `claude-code` from wire names `claude-code`. Tool calls by revision over the 30 days to 2026-11-25: `2026-07-28` 99.2%, `2025-11-25` 0.8%, `2025-06-18` <0.1%, `2025-03-26` <0.1%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | · untested ≠ | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ● full | `2026-07-28` | — not recorded | More than 50% of this client's 2026-07-28 tool calls in the window declared it. |
| apps | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| tasks | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Where the evidence disagrees

- **elicitation** — recorded as `untested`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `2b28e97` (2026-11-15) — No elicitation key on the claude-code record.

## Provenance

No source read is recorded for this client. Every claim above comes from another tier.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

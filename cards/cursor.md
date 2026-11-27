# Cursor

AI code editor from Anysphere. Closed source, so nothing here is a read. The entry joins Apify's curated record, written at 2025-06-18, to Hugging Face MCP traffic. 99.9% of its tool calls in the feed are at 2025-11-25.

## At a glance

| | |
|---|---|
| Registry id | `cursor` |
| Vendor | Anysphere |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | ide |
| Licence | closed source |
| Home | <https://cursor.com> |
| Wire names | `Cursor`, `Cursor MCP Availability`, `cursor-agent`, `cursor-check`, `cursor-diag`, `cursor-hf-check`, `cursor-mcp-sync-check`, `cursor-public-preflight`, `cursor-test`, `cursor-vscode` |
| Prefers | `2025-11-25` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25` |
| Rows describe | `2025-11-25`, the newest revision it speaks |
| In traffic | evalstate/mcp-clients, window ending 2026-11-25 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| Transports | — not recorded | | |
| Authentication | — not recorded | | |
| **Tools** | ● full | declared | `2025-06-18` |
| &nbsp;&nbsp;↳ listChanged | ● full | declared ⇧ | `2025-06-18` |
| **Resources** | ● full | declared | `2025-06-18` |
| **Prompts** | ● full | declared | `2025-06-18` |
| Completions | — not recorded | | |
| **Sampling** | ○ unsupported | declared | `2025-06-18` |
| **Elicitation** | ● full | declared | `2025-06-18` |
| **Roots** | ● full | declared | `2025-06-18` |
| Logging | — not recorded | | |
| Instructions | — not recorded | | |
| Icons | — not recorded | | |
| JSON Schema | — not recorded | | |
| **Extensions** | | | |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/ui | ● full | observed |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/tasks | ○ unsupported | observed | `2026-07-28` |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/skills | · untested |  |  |
| &nbsp;&nbsp;↳ io.modelcontextprotocol/events | · untested |  |  |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `◇` opt-in  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **tools** — Hugging Face traffic includes tool calls from this client.
- **extensions.io.modelcontextprotocol/ui** — Declared in traffic: the HF telemetry (cursor) sees io.modelcontextprotocol/ui in the client capabilities. The telemetry shows the declaration, not how the view is rendered.
- **extensions.io.modelcontextprotocol/tasks** — Not declared in traffic: the HF telemetry (cursor) sees the tasks extension in at most half of this client's 2026-07-28 tool calls. No source to read.
- **extensions.io.modelcontextprotocol/skills** — No source to read. The HF telemetry records skills only from a successful skills/list call, and it has seen none from this client, which does not show the client lacks it.
- **extensions.io.modelcontextprotocol/events** — No source to read, and the HF telemetry does not report events.

## Observed in traffic

From `evalstate/mcp-clients` at [`904917c5`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/904917c5574ca3c830de12131ed318dec05ea179/reports/dashboard-v1.json), report generated 2026-11-26, window 2026-09-27 to 2026-11-25. Grouped as `cursor` from wire names `Cursor`, `Cursor MCP Availability`, `cursor-check`, `cursor-diag`, `cursor-hf-check`, `cursor-mcp-sync-check`, `cursor-public-preflight`, `cursor-test`, `cursor-vscode`. Tool calls by revision over the 30 days to 2026-11-25: `2026-07-28` <0.1%, `2025-11-25` 100%, `2025-03-26` <0.1%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. 2026-07-28 is 0.015% of this client's tool calls over the 30 days to 2026-11-25, so the sample is small. |
| apps | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| tasks | ○ unsupported | `2026-07-28` | ○ unsupported | At most 50% of this client's 2026-07-28 tool calls in the window declared it. 2026-07-28 is 0.015% of this client's tool calls over the 30 days to 2026-11-25, so the sample is small. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Provenance

No source read is recorded for this client. Every claim above comes from another tier.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

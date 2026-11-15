# Visual Studio Code

Microsoft's editor. Open source, and the source has not been read for this entry yet. The entry joins Apify's curated record, written at 2025-06-18, to Hugging Face MCP traffic. 100% of its tool calls in the feed are at 2025-11-25.

## At a glance

| | |
|---|---|
| Registry id | `vscode` |
| Vendor | Microsoft |
| Kind | host. A shipped application. A capability row is what it declares and implements. |
| Category | ide |
| Licence | MIT |
| Source | <https://github.com/microsoft/vscode> |
| Home | <https://code.visualstudio.com> |
| Wire names | `Visual Studio Code`, `Visual Studio Code - Insiders` |
| Prefers | `2025-11-25` |
| Speaks | `2025-06-18`, `2025-11-25` |
| In traffic | evalstate/mcp-clients, window ending 2026-11-08 (see below) |

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
| **Sampling** | ● full | declared | `2025-06-18` |
| **Elicitation** | ● full | declared | `2025-06-18` |
| &nbsp;&nbsp;↳ form | ● full | declared ⇧ | `2025-06-18` |
| &nbsp;&nbsp;↳ url | ● full | declared ⇧ | `2025-06-18` |
| **Roots** | ● full | declared | `2025-06-18` |
| Logging | — not recorded | | |
| Instructions | — not recorded | | |
| Icons | — not recorded | | |
| **Tasks** | ● full | declared | `2025-06-18` |
| JSON Schema | — not recorded | | |
| Extensions | — not recorded | | |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **tools** — Hugging Face traffic includes tool calls from this client.
- **tasks** — Declared as {"requests":{"tools":{"call":{}}}}.

## Observed in traffic

From `evalstate/mcp-clients` at [`c30d6f28`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/c30d6f2859b699fe9f36e674e4722bfd2d8a1258/reports/dashboard-v1.json), report generated 2026-11-09, window 2026-09-10 to 2026-11-08. Grouped as `visual-studio-code` from wire names `Visual Studio Code`, `Visual Studio Code - Insiders`. Tool calls by revision over the 30 days to 2026-11-08: `2025-11-25` 100%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ● full | ? | ● full | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| apps | ● full | ? | — not recorded | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Provenance

No source read is recorded for this client. Every claim above comes from another tier.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

# Google Antigravity

Google's agentic IDE and CLI, the successor to Gemini CLI for consumer accounts. Closed source, so nothing here is a read. The entry joins Apify's curated record, unchanged since November 2025, to Hugging Face MCP traffic, and the two disagree on protocol revision and elicitation.

## At a glance

| | |
|---|---|
| Registry id | `antigravity` |
| Vendor | Google |
| Category | ide |
| Platforms | windows, macos, linux |
| Licence | closed source |
| Home | <https://antigravity.google> |
| Wire names | `Antigravity`, `Antigravity-Client`, `antigravity`, `antigravity-client` |
| Prefers | `2026-07-28` |
| Speaks | `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`, `2026-07-28` |
| In traffic | evalstate/mcp-clients, window ending 2026-11-08 (see below) |

## Capabilities

| Capability | Status | Known by | At |
|---|---|---|---|
| **Transports** |  |  |  |
| &nbsp;&nbsp;↳ stdio | ● full | declared | `2025-06-18` |
| Authentication | — not recorded | | |
| **Tools** | ● full | declared | `2025-06-18` |
| **Resources** | ○ unsupported | declared | `2025-06-18` |
| **Prompts** | ○ unsupported | declared | `2025-06-18` |
| Completions | — not recorded | | |
| **Sampling** | ○ unsupported | declared | `2025-06-18` |
| **Elicitation** | · untested | declared | `2025-06-18` |
| **Roots** | ● full | declared | `2025-06-18` |
| &nbsp;&nbsp;↳ listChanged | ● full | declared ⇧ | `2025-06-18` |
| Logging | — not recorded | | |
| Instructions | — not recorded | | |
| Icons | — not recorded | | |
| Tasks | — not recorded | | |
| JSON Schema | — not recorded | | |
| Extensions | — not recorded | | |
| Beyond the spec | — not recorded | | |

`●` full  `◐` partial  `○` unsupported  `·` untested  `—` not recorded  `⇧` rests on the parent capability's evidence

Not recorded means nobody has looked, which is not the same claim as unsupported. Under tools.result, full means the field reaches the model on the default conversational path, partial means it does under a condition the notes name, and unsupported means it never does.

## What the table flattens

- **tools** — Hugging Face traffic includes tool calls from clients sending these names, so the agent does call MCP tools.
- **elicitation** — The tiers disagree. Apify's record has no elicitation key at 2025-06-18. Hugging Face traffic sets both elicitation and URL elicitation, with no revision recorded. Neither tier exercised it, and the source cannot be read.

## Observed in traffic

From `evalstate/mcp-clients` at [`c30d6f28`](https://huggingface.co/datasets/evalstate/mcp-clients/blob/c30d6f2859b699fe9f36e674e4722bfd2d8a1258/reports/dashboard-v1.json), report generated 2026-11-09, window 2026-09-10 to 2026-11-08. Grouped as `antigravity` from wire names `Antigravity`, `Antigravity-Client`, `antigravity`, `antigravity-client`. Tool calls by revision over the 30 days to 2026-11-08: `2026-07-28` 97.3%, `2025-11-25` 2.1%, `2025-03-26` <0.1%, `2024-11-05` 0.6%.

| Capability | Observed | At | Registry | Note |
|---|---|---|---|---|
| elicitation | ● full | ? | · untested ≠ | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| elicitation.url | ● full | ? | — not recorded | Set because the initialize-era backfill (2026-06-07/2026-07-26) has it, or because more than 50% of 2026-07-28 tool calls declared it; the report does not say which, so no revision is recorded. |
| apps | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it, and the initialize-era backfill does not have it. |
| tasks | ○ unsupported | `2026-07-28` | — not recorded | At most 50% of this client's 2026-07-28 tool calls in the window declared it. |

`≠` the observed status differs from the registry's. The registry status may be about a different revision; compare the At column with the evidence above. Every row is read against the source's policy block, carried verbatim in `data/observed/hf-mcp-clients.json`.

## Where the evidence disagrees

- **elicitation** — recorded as `untested`, but declared-tier evidence at `2025-06-18` says `unsupported`.
  <br>apify/mcp-client-capabilities `2b28e97` (2026-11-11) — No elicitation key on the antigravity-client record.

## Research notes

- [Gemini CLI was retired for consumers and its successor is closed source](../research/gemini-cli-succeeded-by-closed-source-antigravity.md) — *gap*. Gemini CLI stopped serving consumer accounts on 2026-06-18 and is now maintenance-only. Antigravity CLI replaces it as a closed-source Go binary, so its MCP behaviour cannot be read from source.

## Provenance

No source read is recorded for this client. Every claim above comes from another tier.

---

Generated from `data/clients.json`, `data/observed/hf-mcp-clients.json` by `scripts/build-cards.js`. Edit the registry, rerun the probe or the ingest, not this file.

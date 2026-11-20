---
name: check-mcp-client-support
description: Check which MCP clients support a protocol capability, and how each claim is known, using the canimcp registry at canimcp.io. Use when deciding whether an MCP server can rely on a feature such as elicitation, sampling, roots, structured tool output or a protocol revision, or when asked what a specific client such as Codex, goose or Cline does with it.
---

# Check MCP client support

canimcp records which MCP clients support which capabilities, with the evidence for each claim. Use it before telling someone that a client does or does not support an MCP feature.

## Where to ask

Use the MCP server at `https://canimcp.io/mcp` when it is connected. Otherwise fetch the JSON it reads from, on `https://canimcp.io`.

| Question | MCP tool | JSON |
|---|---|---|
| Which clients are covered | `list_clients` | `/data/clients/index.json` |
| Which capability ids exist | `list_capabilities` | `/data/capabilities/index.json` |
| Which clients support a capability | `find_capability_support` | `/data/capabilities/{slug}.json`, where the slug is the id with dots as hyphens |
| What one client does | `get_client` | `/data/clients/{id}.json` |
| What reached the model from a tool result | `get_probe_results` | `/data/verified/{client}.json` |
| Why a status is what it is | `search_research_notes`, `get_research_note` | `/data/research/index.json` |

`https://canimcp.io/openapi.json` describes the JSON. Every page on the site is Markdown at its URL plus `.md`, and each capability has a page at `/capabilities/{slug}`.

## Steps

1. Find the capability id. Ids are dotted paths that follow the wire field names, such as `elicitation.url`, `roots.listChanged` and `tools.result.structuredContent`. Call `list_capabilities` when unsure.
2. Call `find_capability_support` with the id.
3. Read each client's `status` together with its `evidence`. Do not report the status alone.
4. When a client's result has `research` ids, read those notes before answering. They hold the cases a status cannot express.
5. For `tools.result.*` capabilities, also call `get_probe_results`. The probe ran the real client against a fixture server and recorded what the client sent to its model.

## Reading the answer

- A status is `full`, `partial`, `opt-in`, `unsupported` or `untested`. `opt-in` means the client implements it and a default install does not use it until a setting, flag or application code turns it on. The notes say what turns it on.
- A client under `notRecorded` has no entry for that capability. That is not `unsupported`. Say it is not recorded.
- A client with no `status` has probe records or telemetry and no registry record. Report what the `verified` or `observed` part says, and say the registry has not settled a status.
- Each evidence item has a `tier`:
  - `declared`: the client says so, in the capabilities it sends or in a curated list.
  - `verified`: the probe exercised it.
  - `observed`: it was seen in telemetry over real traffic.
  - `read`: someone read the client's source at the commit given.
- Tiers are not ranked. When two disagree, report both. An evidence item whose own `status` differs from the capability's is a recorded disagreement.
- Each evidence item has `at`, the protocol revision it applies to. `2026-07-28` is stateless, and every revision through `2025-11-25` uses the initialize handshake. A result at one says nothing about the other.
- For images in tool results, use `tools.result.media`. Each probe result has `image` (`image-part`, `base64-text` or `absent`) and `modelApi`. The same client can pass an image on one model API and drop it on another, so report the API with the outcome. Only one small PNG is tested. Audio, embedded resources and resource links are not.
- A declaration can be wrong in either direction. Some clients declare a capability their code declines, and some implement one they do not declare.
- The registry covers only the clients `list_clients` returns. A client that is not listed is unknown here.

## Reporting

Give the client, the status, the tier and revision behind it, and the date or commit of the evidence. Link the client's page, `https://canimcp.io/clients/{id}`. Client behaviour changes between releases, so include the client's `lastVerified` date when the answer will be relied on.

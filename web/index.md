# canimcp

Which MCP clients support what, how each claim is known, and research notes on the parts a support matrix cannot express.

A capability here carries evidence, and evidence carries a tier and the protocol revision it applies to.

| Tier | Means |
|---|---|
| `declared` | The client says so, in `initialize.capabilities` or a curated list |
| `verified` | A probe or conformance scenario exercised it |
| `observed` | Telemetry over real traffic |
| `read` | Someone read the client's source at a pinned commit |

Tiers are not ranked. Several can sit on one capability and disagree, and a disagreement is a finding. `2026-07-28` is stateless with per-request `_meta`, and every revision through `2025-11-25` uses the initialize handshake, so a result on one says nothing about the other.

## When to use this

- Before relying on an MCP feature in a server, check which clients implement it and at which protocol revision.
- To find out what a client does with a tool result: which of `content` and `structuredContent` reaches the model.
- To see where a client's declared capabilities, its source and its observed traffic disagree.

Every page has a Markdown version at the same URL with `.md` appended, and the same URL returns Markdown for `Accept: text/markdown`. The registry is JSON under `/data`, and [`/llms.txt`](/llms.txt) indexes all of it.

---
id: gemini-cli-succeeded-by-closed-source-antigravity
title: Gemini CLI was retired for consumers and its successor is closed source
kind: gap
summary: Gemini CLI stopped serving consumer accounts on 2026-06-18 and is now maintenance-only. Antigravity CLI replaces it as a closed-source Go binary, so its MCP behaviour cannot be read from source.
capabilities: []
clients:
  - gemini-cli
  - antigravity
sources:
  - url: https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/
    title: "An important update: Transitioning Gemini CLI to Antigravity CLI"
    date: 2026-08-24
  - url: https://github.com/google-gemini/gemini-cli/discussions/27274
    title: Announcement discussion, google-gemini/gemini-cli
    date: 2026-08-24
  - url: https://api.github.com/repos/google-gemini/gemini-cli
    title: Repository metadata, checked directly
    date: 2026-08-24
  - url: https://github.com/apify/mcp-client-capabilities
    title: mcp-clients.json, antigravity-client record
    commit: "4406120"
    date: 2026-08-24
  - url: https://huggingface.co/datasets/evalstate/mcp-clients
    title: dashboard-v1.json, antigravity capability_support_60d
    date: 2026-08-23
status: current
lastVerified: 2026-08-24
related:
  - utilized-capability-declarations
---

# Gemini CLI was retired for consumers and its successor is closed source

Google announced at I/O on 2026-05-19 that it was consolidating developer tooling under the Antigravity brand. On 2026-06-18 Gemini CLI and the Gemini Code Assist IDE extensions stopped serving requests for consumer tiers — free users, Google AI Pro and Ultra subscribers, and free Gemini Code Assist for individuals. Enterprise access continues for Gemini Code Assist Standard and Enterprise licence holders and for paid API keys through Google Cloud.

The repository is maintenance-only, not dead. From the announcement discussion: work continues on GitHub for model releases, bug fixes and security fixes for enterprise customers, and the project stays Apache-2.0. No new feature development.

## The repository gives no signal

Checked 2026-08-24: `google-gemini/gemini-cli` is not archived, was pushed to within the hour, and has 106,639 stars. The README markets Gemini 3 models and MCP support, and mentions neither the transition, the June date, nor Antigravity. Searching it for deprecation wording returns nothing.

A survey that reads repository metadata to decide what is alive gets this one wrong. Archived flags, commit recency and README banners all report a healthy project. The retirement lives in a blog post and a discussion thread.

## The successor cannot be read

Antigravity CLI is a closed-source Go binary. Asked directly in the announcement discussion whether it would be open-sourced like Gemini CLI, Google gave no answer. The announcement says it keeps Agent Skills, Hooks, Subagents and Extensions, now called Antigravity plugins. It does not say what it does with MCP.

So the `read` tier is unavailable for the client that replaced a readable one. What remains for Antigravity is `declared` and `observed`, and those already disagree:

| Source | Says |
|---|---|
| apify `antigravity-client`, pinned `2025-06-18` | `roots` (listChanged), `tools` |
| Hugging Face telemetry, 60d to 2026-08-22 | elicitation and elicitation-url both in use |

Nothing can settle that by reading code. Only a probe — pointing Antigravity at an instrumented server and recording what it sends — can, which makes the probe tier load-bearing rather than a nice-to-have.

There is also an unverified community report in the discussion that Antigravity's UI detects MCP servers but the agent does not use them. It is recorded here as hearsay, not as a claim. If true it would mean an MCP client that negotiates capabilities it never exercises, which is precisely the distinction [[utilized-capability-declarations]] describes and no handshake can express.

## What this means for the registry

Keep gemini-cli. A maintenance-only client is not noise: its capabilities are frozen by policy rather than by neglect, which makes it the clearest available example of what a client looks like once it stops moving. Record the 2026-06-18 consumer cutoff and the enterprise carve-out on the entry, because "is this client still in use" has different answers depending on who is asking.

Add Antigravity as declared-and-observed only, and mark the absence of a `read` tier as a property of the client rather than a gap in the research.

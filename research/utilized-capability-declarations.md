---
id: utilized-capability-declarations
title: Capability negotiation cannot express which capabilities a peer actually uses
kind: gap
summary: MCP's initialize handshake declares what each side offers, never what it consumes, so servers cannot gracefully degrade. The SEP proposing a fix was closed dormant on 2026-06-26 with no replacement named.
capabilities: []
clients: []
specVersions:
  - 2024-11-05
  - 2025-03-26
  - 2025-06-18
  - 2025-11-25
  - 2026-07-28
tracking:
  state: stalled
  seps:
    - 1381
  issues:
    - https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1381
    - https://github.com/modelcontextprotocol/modelcontextprotocol/issues/679
  lastActivity: 2026-06-26
sources:
  - url: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1381
    title: "SEP-1381: Utilized Capability Declarations"
    date: 2026-08-23
  - url: https://github.com/apify/mcp-client-capabilities
    title: mcp-client-capabilities README, Background section
    commit: "4406120"
    date: 2026-08-23
status: current
lastVerified: 2026-08-23
related:
  - client-name-sniffing
---

# Capability negotiation cannot express which capabilities a peer actually uses

`initialize` carries `capabilities` in both directions, and both sides read it as "what I offer". There is no field for "what I will consume". A server learns that a client *can* accept resources; it never learns whether that client will surface them to the model, or drop them on the floor.

The difference decides server design. A server that would expose data as resources has to know whether resources reach the model, because if they do not the same data needs a `read_resource` tool instead. The same choice appears for prompts, for `tools/listChanged` gating dynamic tool activation, and for logging — a server can write to a local file instead of emitting log messages nobody displays. None of these are answerable from the handshake.

What servers do instead is sniff `clientInfo.name`. SEP-1381 names this directly: without utilization declarations, "server authors will be forced to sniff client names to manually adjust behaviors similar to user agent sniffing in web browsers."

## The proposed fix, and where it went

SEP-1381 (Michael Bleigh, opened 2025-08-22) proposed an optional `utilizedCapabilities` field on both `InitializeRequest` and `InitializeResult` — the converse of the existing declaration, in both directions, fully backwards compatible because it is optional.

It was closed on 2026-06-26 by `localden`, carrying the labels `SEP`, `draft`, and `dormant`, after 35 comments and an assignment to `pwwpche`. No successor proposal is named on the issue.

An earlier discussion (#679) had floated two alternatives: merging client and server capabilities into one intermingled object, or reworking negotiation around provided and consumed RPC methods. SEP-1381 rejected the first as confusing and the second as too costly for the benefit.

## Why this matters here

This gap is the reason a client capability registry exists at all. Every curated MCP client list — this one included — is a workaround for a handshake that cannot answer the question, and the apify registry's own README says so plainly, pointing at SEP-1381 as the protocol-level fix that would eventually make it unnecessary. That README still describes SEP-1381 as pending. It has been closed for two months.

The practical consequence for anyone building a server today: name sniffing remains the only mechanism, and it will stay that way through at least `2026-07-28`. A registry keyed on `clientInfo.name` is not a stopgap waiting on a spec fix; it is the supported path.

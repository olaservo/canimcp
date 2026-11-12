---
id: goose-elicitation-needs-tool-call-context
title: goose only answers elicitation raised inside a tool call
kind: nuance
summary: create_elicitation resolves a session id and a tool-call request id from the request context and errors if either is missing, so an elicitation raised outside a tool call fails rather than prompting.
capabilities:
  - elicitation
  - elicitation.form
  - elicitation.url
clients:
  - goose
specVersions:
  - 2025-11-25
  - 2026-07-28
sources:
  - url: https://github.com/aaif-goose/goose
    title: crates/goose/src/agents/mcp_client.rs
    commit: "c5e5929a"
    path: crates/goose/src/agents/mcp_client.rs:497-560
    date: 2026-08-23
status: current
lastVerified: 2026-08-23
---

# goose only answers elicitation raised inside a tool call

goose implements elicitation in both modes, form and URL. The cell is `full`. What it does not do is answer an elicitation that is not attached to a tool call.

`create_elicitation` resolves two things from the request context before it can prompt anyone: a session id, and a tool-call request id. Either missing is an error, not a fallback:

```rust
let session_id = self.resolve_session_id(&context.extensions).await
    .ok_or_else(|| ErrorData::new(
        ErrorCode::INTERNAL_ERROR,
        "Could not resolve session id for elicitation request", None))?;
let tool_call_request_id =
    self.resolve_tool_call_request_id(&session_id, &context.extensions)?;
```

Both feed `action_required.request_and_wait(...)`, which is how goose attaches a pending prompt to the tool call the user is already watching. There is nowhere to put a prompt that belongs to no tool call, so the request fails with `INTERNAL_ERROR`.

For a server author this rules out one pattern: eliciting during connection setup, or at any point outside a tool invocation, to gather configuration up front. Fold that into the first tool call instead.

## Two smaller details

The timeout is fixed at 300 seconds and is not configurable. A prompt nobody answers fails the tool call after five minutes.

URL mode is flattened into the form path. Rather than passing the URL through as its own request type, goose builds `{"url": url}` and hands it to the same prompt mechanism that receives a form's requested schema. It works, but a client-side renderer distinguishing the two modes is choosing on the shape of that object, not on the request type.

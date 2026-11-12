---
id: opencode-retries-tools-list-without-output-schema
title: opencode retries tools/list with outputSchema stripped when the SDK rejects one
kind: idiosyncrasy
summary: If the SDK's validation of a tools/list result fails in a way that looks schema-related, opencode re-requests the page against a result schema with outputSchema omitted. The match is a regex over the error message, so the fallback both misses and over-fires.
capabilities:
  - tools
clients:
  - opencode
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/anomalyco/opencode
    title: packages/opencode/src/mcp/catalog.ts, listTools and isOutputSchemaValidationError
    commit: 7cde8329
    path: packages/opencode/src/mcp/catalog.ts:14-16,143-165
    date: 2026-08-24
status: current
lastVerified: 2026-08-24
---

# opencode retries tools/list with outputSchema stripped when the SDK rejects one

`outputSchema` arrived in `2025-06-18`. The TypeScript SDK validates it, and a server whose `outputSchema` contains a `$ref` the validator cannot resolve makes the whole `tools/list` page fail — not just the offending tool.

opencode catches that and retries the same request against a tolerant result schema:

```ts
const TolerantListToolsResultSchema = ListToolsResultSchema.extend({
  tools: ToolSchema.omit({ outputSchema: true }).array(),
})
```

The retry drops `outputSchema` from every tool on the page, not only the one that failed. Tools that had a valid output schema come back without it, so structured output is lost for the whole page whenever any tool on it has a schema the SDK dislikes.

## The match is on error text

The fallback fires based on a regex over the error message:

```ts
/can't resolve reference|resolves to more than one schema|outputSchema|schema.*reference|reference.*schema/i
```

That is a guess about wording the SDK is under no obligation to keep. It fails in both directions. An SDK release that rephrases a resolution error stops matching, and `tools/list` fails outright for a server that used to work. In the other direction `schema.*reference` is loose enough to catch validation failures that have nothing to do with `outputSchema`, and the retry then silently returns tools whose input schemas were the actual problem.

Either way the client's behaviour is pinned to the phrasing of a dependency's error strings, which is not something a version pin protects.

## Why this exists

The pressure is real. A server with one malformed `outputSchema` renders its entire tool catalog unusable to a strictly validating client, and the user sees a server that will not connect rather than a tool that will not validate. Retrying is a reasonable local fix.

The general version of the problem belongs upstream: `tools/list` validation is all-or-nothing when it could be per-tool, and a client wanting to skip one bad tool has to either drop a field for every tool or write its own parser. opencode chose the first. Whether the SDK should offer a per-tool degradation mode is worth raising there.

---
id: kilocode-runs-opencodes-mcp-client-behind-every-surface
title: Kilo Code is built on opencode now, and one MCP client serves the CLI, VS Code and JetBrains
kind: misconception
summary: Kilo Code started as a Cline fork. At 278edf3a its MCP client is opencode's, with Kilo's edits marked kilocode_change. The VS Code and JetBrains extensions spawn `kilo serve` and have no MCP client of their own. main ships a patched SDK 1.32.1; the v2 branch uses the split SDK.
capabilities:
  - transports.stdio
  - transports.streamableHttp
  - roots
clients:
  - kilocode
  - opencode
  - cline
specVersions:
  - 2025-11-25
sources:
  - url: https://github.com/Kilo-Org/kilocode
    title: packages/opencode/src/mcp/index.ts, CLIENT_OPTIONS and createClient
    commit: 278edf3a
    path: packages/opencode/src/mcp/index.ts:56-67,108-114
    date: 2026-11-10
  - url: https://github.com/Kilo-Org/kilocode
    title: packages/kilo-vscode/src/services/cli-backend/server-manager.ts, spawning the CLI backend
    commit: 278edf3a
    path: packages/kilo-vscode/src/services/cli-backend/server-manager.ts:100-129
    date: 2026-11-10
  - url: https://github.com/Kilo-Org/kilocode
    title: KiloBackendCliManager.kt, spawning the CLI backend from JetBrains
    commit: 278edf3a
    path: packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt:157
    date: 2026-11-10
  - url: https://github.com/Kilo-Org/kilocode
    title: packages/opencode/package.json, the SDK pin
    commit: 278edf3a
    path: packages/opencode/package.json:109
    date: 2026-11-10
  - url: https://github.com/Kilo-Org/kilocode/tree/v2
    title: v2 branch, packages/core/package.json and packages/client/package.json
    commit: 35c99113
    path: packages/core/package.json:106-108
    date: 2026-11-10
status: current
lastVerified: 2026-11-10
related:
  - opencode-declares-only-roots
  - opencode-patches-its-sdk-for-session-recovery
---

# Kilo Code is built on opencode now, and one MCP client serves the CLI, VS Code and JetBrains

`BATCH-PLAN.md` put Kilo Code with Roo Code in a "Cline lineage" batch. The code at `278edf3a` does not support that. Kilo's MCP client is opencode's: `packages/opencode/src/mcp/index.ts` is opencode's file with 78 `kilocode_change` markers. The capability object keeps opencode's commented-out `sampling`, `elicitation` and `tasks`, each still linking to an `anomalyco/opencode` issue, so Kilo declares `roots` and nothing else, as opencode does.

There is one MCP implementation. The VS Code extension spawns the CLI as `kilo serve --port 0` and reaches MCP through the generated SDK client (`client.mcp.status`). The JetBrains backend spawns the same command. Neither extension creates an MCP `Client`. Capability rows hold for every surface, as with Hermes and unlike Cline. The wire name is `kilo`.

Kilo's additions are local to the connection layer:

- `--rm` injected into `docker run` and `podman run` server commands.
- A child environment for local servers rebuilt without Kilo's backend credentials.
- A drained stderr pipe so a verbose server cannot block.
- A pre-connect OAuth token refresh and CIMD, covered in [[kilocode-adds-cimd-and-pre-connect-token-refresh]].
- MCP Apps plumbing behind `KILO_EXPERIMENTAL_MCP_APPS`, without declaring the extension.

Code Mode moved the other way. opencode routes MCP tools through its `execute` script tool by default. Kilo makes Code Mode opt-in through `KILO_EXPERIMENTAL_CODE_MODE` or `experimental.code_mode`, so the direct tool path is Kilo's default.

The SDK has split from upstream. Kilo's `main` pins `@modelcontextprotocol/sdk` 1.32.1 with opencode's session-recovery patch carried forward. Upstream opencode has moved to `@modelcontextprotocol/client` 2.4.0. Kilo's README says new features go to the `v2` branch, which at `35c99113` depends on `@modelcontextprotocol/client`, `core` and `server` 2.3.1 with its own patch against the client package. That makes this read a read of the shipping release. The next Kilo read should start from `v2` once it becomes the default branch.

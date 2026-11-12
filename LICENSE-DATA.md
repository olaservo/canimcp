# Data and writing licence

The registry and evidence under `data/`, the research notes under `research/`, the generated cards under `cards/`, and the probe captures under `probe/runs/` are licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) (CC BY 4.0). Code everywhere else in the repo is under the MIT licence in `LICENSE`.

Short excerpts quoted from MCP clients, SDKs and other projects stay under their own licences. Each one cites the repository and commit it came from. The probe captures record what each client sent to a mock model and a fixture server, and include the client's own tool descriptions and prompts as it sent them. Some captures made on Windows have the operator's own skills removed from the system prompt and a placeholder in their place, as `probe/README.md` describes.

Telemetry under `data/observed/` is derived from the Hugging Face dataset `evalstate/mcp-clients` at the revision recorded in each file, and follows that dataset's terms.

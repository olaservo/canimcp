# About canimcp

canimcp is a registry of Model Context Protocol clients. It records what each client supports, the evidence for each claim, and the protocol revision the claim applies to.

## Where the data comes from

- Source reads. A client's code is read at a pinned commit, and the entry cites the commit and the file paths.
- The probe. A real client runs against an instrumented fixture MCP server and a mock model, and the record says what the client sent to the model. The captures for every run are in the repository under `probe/runs/`.
- Telemetry. Counts derived from the Hugging Face dataset `evalstate/mcp-clients`, at the revision recorded in the data file.
- Declarations. What a client sends in `initialize.capabilities`, or what a curated list says about it.

No client source is copied here. Entries quote short excerpts with the repository and commit they came from.

## Corrections

The registry, the notes and this site are built from one public repository, <https://github.com/olaservo/canimcp>. To report an error or a client that has changed, open an issue there with the client version and what you saw. A correction that cites a commit or a capture is the quickest to apply.

## Licence

The registry and evidence under `/data`, the research notes and the client pages are licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). The code that builds them is MIT licensed. Telemetry under `/data/observed` follows the terms of the dataset it is derived from.

## For agents

[`/llms.txt`](/llms.txt) lists every page and data file. Each page is available as Markdown by appending `.md` to its URL or by sending `Accept: text/markdown`. The JSON Schemas for the data are served at the URLs in their `$id` fields, under `/schemas`.

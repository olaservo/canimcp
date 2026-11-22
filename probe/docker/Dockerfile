# syntax=docker/dockerfile:1.7
# Linux image for probe runs of codex, goose and opencode. On Windows these three find the
# user profile through the OS and list the operator's skills whatever HOME says, so their
# captures are made here instead. Build context is probe/ (see compose.yaml).
#
# Defaults reproduce the pins of the stripped Windows captures: goose built at 4facf56,
# opencode built at a98e3fa plus the npm 2.2.6 install, codex 0.169.0-alpha.3 from npm.

ARG NODE_IMAGE=node:24-trixie-slim

# goose: built from source, as on Windows. rust-toolchain.toml at the pin names 1.99.0.
FROM rust:1.99-trixie AS goose
ARG GOOSE_COMMIT=4facf56cbab049142809d9afa4648ebe6823ba80
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential cmake pkg-config libssl-dev libdbus-1-dev libclang-dev \
      protobuf-compiler libprotobuf-dev ca-certificates git \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /src
RUN git init -q . && git remote add origin https://github.com/aaif-goose/goose.git \
    && git fetch -q --depth 1 origin "$GOOSE_COMMIT" && git checkout -q FETCH_HEAD
ENV CARGO_REGISTRIES_CRATES_IO_PROTOCOL=sparse
RUN cargo build --release -p goose-cli --bin goose && cp target/release/goose /goose

# opencode: built from source at the pin with the bun its package.json names.
FROM oven/bun:1.4.4 AS opencode
ARG OPENCODE_COMMIT=a98e3fa7a1a6073f27e39ba0eee8cc13ec8ab438
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates git \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /src
RUN git init -q . && git remote add origin https://github.com/anomalyco/opencode.git \
    && git fetch -q --depth 1 origin "$OPENCODE_COMMIT" && git checkout -q FETCH_HEAD
RUN bun install
WORKDIR /src/packages/cli
RUN OPENCODE_VERSION="0.0.0-$(echo "$OPENCODE_COMMIT" | cut -c1-7)" OPENCODE_CHANNEL=local \
      bun run script/build.ts --single --skip-install --skip-web-ui \
    && cp dist/*linux-x64/bin/opencode /opencode

FROM ${NODE_IMAGE}
# Runtime libraries from goose's own Dockerfile, under their trixie names.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates libssl3t64 libdbus-1-3 libgomp1 libxcb1 git \
    && rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /canimcp/probe

COPY --chown=node package.json package-lock.json ./
RUN npm ci

COPY --chown=node hosts/codex/package.json hosts/codex/package-lock.json hosts/codex/
COPY --chown=node hosts/opencode/package.json hosts/opencode/package-lock.json hosts/opencode/
# CODEX_VERSION installs another release over the pinned one, for the discover-first runs.
ARG CODEX_VERSION=
RUN cd hosts/codex && npm ci && if [ -n "$CODEX_VERSION" ]; then npm install --no-save "@openai/codex@$CODEX_VERSION"; fi
RUN cd hosts/opencode && npm ci

COPY --chown=node --from=goose /goose hosts/goose/bin/goose
COPY --chown=node --from=opencode /opencode hosts/opencode/bin/opencode

COPY --chown=node . .
RUN npm run build && mkdir -p runs

# Scratch goes to /tmp/canimcp-probe, outside HOME (lib/operator-guard.ts).
ENV NO_COLOR=1
ENTRYPOINT ["node", "dist/runner.js"]

# syntax=docker/dockerfile:1.7
# Linux image for probe runs of codex, goose, opencode and Kilo Code. On Windows these find the
# user profile through the OS and list the operator's skills whatever HOME says, so their
# captures are made here instead. Build context is probe/ (see compose.yaml).
#
# Defaults reproduce the Linux records of 2026-11-26: goose built at d1438fd,
# opencode built at 82d8fc5, codex 0.174.0-alpha.7 from npm over the 0.169.0-alpha.3 manifest.
# OpenClaw reads the account home from the OS (os.userInfo) as well as HOME, so it runs here too.

ARG NODE_IMAGE=node:24-trixie-slim

# goose: built from source, as on Windows. rust-toolchain.toml at the pin names 1.99.0.
FROM rust:1.99-trixie AS goose
ARG GOOSE_COMMIT=d1438fde28d6669e0f34cbd2ae90c5fbe903f8d1
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
ARG OPENCODE_COMMIT=82d8fc5bec961043e47b4d2d3fcd03667f40148a
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

# openclaw: built from source at the pin with the pnpm its package.json names and the bun its
# own Dockerfile copies in. The control UI is not built; the probe runs `openclaw agent exec`.
FROM oven/bun:1.4.4 AS bun
FROM node:24-trixie AS openclaw
ARG OPENCLAW_COMMIT=b607eb7b6915c6fa830e23768fc767bfbe0ce4b3
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /openclaw
RUN git init -q . && git remote add origin https://github.com/openclaw/openclaw.git \
    && git fetch -q --depth 1 origin "$OPENCLAW_COMMIT" && git checkout -q FETCH_HEAD
RUN corepack enable && CI=true pnpm install --frozen-lockfile \
      --config.supportedArchitectures.os=linux --config.supportedArchitectures.libc=glibc
RUN OPENCLAW_RUN_NODE_SKIP_DTS_BUILD=1 NODE_OPTIONS=--max-old-space-size=8192 \
      pnpm_config_verify_deps_before_run=false pnpm build:docker \
    && node openclaw.mjs --version
RUN echo "$OPENCLAW_COMMIT" > .canimcp-commit

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
ARG CODEX_VERSION=0.174.0-alpha.7
RUN cd hosts/codex && npm ci && if [ -n "$CODEX_VERSION" ]; then npm install --no-save "@openai/codex@$CODEX_VERSION"; fi
RUN cd hosts/opencode && npm ci
# Kilo Code from npm: @kilocode/cli 7.8.40 is the CLI at the research pin 3c7f2659 (hosts/kilocode/package.json).
# The adapter runs the platform package's binary, so the postinstall is not needed.
COPY --chown=node hosts/kilocode/package.json hosts/kilocode/package-lock.json hosts/kilocode/
ARG KILOCODE_VERSION=
RUN cd hosts/kilocode && npm ci --ignore-scripts && if [ -n "$KILOCODE_VERSION" ]; then npm install --no-save --ignore-scripts "@kilocode/cli@$KILOCODE_VERSION"; fi

COPY --chown=node --from=goose /goose hosts/goose/bin/goose
COPY --chown=node --from=opencode /opencode hosts/opencode/bin/opencode
COPY --chown=node --from=openclaw /openclaw hosts/openclaw/bin/openclaw

# The conformance suite and its scenario servers, for bridge runs inside the container
# (compose service `conformance`).
COPY --chown=node conformance/package.json conformance/package-lock.json conformance/
RUN cd conformance && npm ci

COPY --chown=node . .
RUN npm run build && mkdir -p runs

# Scratch goes to /tmp/canimcp-probe, outside HOME (lib/operator-guard.ts).
ENV NO_COLOR=1
ENTRYPOINT ["node", "dist/runner.js"]

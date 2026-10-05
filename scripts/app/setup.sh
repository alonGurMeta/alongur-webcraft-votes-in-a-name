#!/usr/bin/env bash
# scripts/app/setup.sh — install / provision app dependencies INSIDE app-runner.
# Runs from /workspace. Referenced by app.toml [app].setup.
set -euo pipefail
cd /workspace

# Harden network installs for locked-down eval substrates (VMVM/DES leased VMs).
# Inside the compose network the container resolves through Docker's embedded DNS
# (127.0.0.11), which drops queries under the burst of parallel connections a
# fresh install opens — surfacing as EAI_AGAIN and npm's "Exit handler never
# called!" crash. Capping sockets and adding retries makes the install ride out
# the transient failures. Harmless on an open network. Env-scoped so it applies
# to npm regardless of which manager branch runs below.
export npm_config_maxsockets="${npm_config_maxsockets:-5}"
export npm_config_fetch_retries="${npm_config_fetch_retries:-5}"
export npm_config_fetch_retry_mintimeout="${npm_config_fetch_retry_mintimeout:-2000}"
export npm_config_fetch_retry_maxtimeout="${npm_config_fetch_retry_maxtimeout:-60000}"

# Install deps with whichever package manager the repo locks to. corepack (enabled
# in environment/Dockerfile) supplies the pinned pnpm/yarn; npm ships with node.
# The `|| <non-frozen>` fallback covers a lockfile that drifted from package.json.
if [ -f pnpm-lock.yaml ]; then
  corepack enable >/dev/null 2>&1 || true
  pnpm install --frozen-lockfile || pnpm install
  lock=pnpm-lock.yaml
elif [ -f yarn.lock ]; then
  corepack enable >/dev/null 2>&1 || true
  yarn install --immutable || yarn install
  lock=yarn.lock
else
  npm ci || npm install
  lock=package-lock.json
fi

# A persisted build-cache volume (docker-compose: app_build_cache on .next)
# survives across runs, so a dependency/framework bump can leave stale entries
# that surface at RUNTIME as routes 404ing or blank renders — NOT a build
# failure, so easy to misdiagnose (this bit the Spree pilot on a Next bump).
# Clear the cache CONTENTS (the dir is a volume mountpoint; can't rm it) only
# when the lockfile changed, so unchanged runs still reuse the cache. (.vite is
# defensive — no Vite cache volume ships by default, but harmless if one is added.)
sig=$(sha1sum "$lock" 2>/dev/null | awk '{print $1}')
if [ "$sig" != "$(cat .next/.deps-sig 2>/dev/null)" ]; then
  for c in .next .vite; do [ -d "$c" ] && find "$c" -mindepth 1 -delete 2>/dev/null || true; done
  mkdir -p .next && printf '%s' "$sig" > .next/.deps-sig
fi

# Backend too? install it here as well, e.g.:
#   (cd api && npm ci)
#   (cd backend && bundle install)      # or: pip install -r requirements.txt

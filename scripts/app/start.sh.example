#!/usr/bin/env bash
# scripts/app/start.sh — start the app process(es) INSIDE app-runner, serving on
# [app].port. Runs from /workspace. Referenced by app.toml [app].start.
set -euo pipefail
cd /workspace

# Be restart-safe: a second `start` must not collide with a stale process.
# Kill any prior dev server before relaunching. Example (front-end only):
pkill -f '[n]ext dev'      2>/dev/null || true
pkill -f '[v]ite'          2>/dev/null || true
pkill -f '[w]ebpack serve' 2>/dev/null || true

# Serve with the repo's package manager (corepack provides pnpm/yarn). Adjust the
# script name if yours isn't "dev" — e.g. minipaint serves via "npm run server",
# a webpack app might use "serve", etc. This is exactly what app.toml [app].start
# overrides when inference guesses wrong.
if   [ -f pnpm-lock.yaml ]; then exec pnpm run dev
elif [ -f yarn.lock      ]; then exec yarn dev
else                             exec npm run dev
fi

# A full-stack app must still use this one container. If it needs multiple local
# processes, replace the exec above with a supervisor that starts them inside
# app-runner and fails when any required process exits. Do not add Compose services.

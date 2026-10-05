#!/usr/bin/env bash
# start.sh — bring this app up per app.toml and leave it running (the "go").
# Thin wrapper over the one resolver. Pairs with verify.sh / stop.sh:
#   ./start.sh          → resolve app.toml, compose up, wait for health, KEEP running
#   ./verify.sh         → same, but health-check then tear down (conformance check)
#   ./verify.sh --plan  → just print the resolved plan, run nothing
#   ./stop.sh [--wipe]  → stop the stack (--wipe also removes data volumes)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$ROOT/verify.sh" --keep "$@"

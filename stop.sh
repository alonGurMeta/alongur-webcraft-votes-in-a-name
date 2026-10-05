#!/usr/bin/env bash
# stop.sh — stop the stack. `--wipe` also removes data volumes (next start reseeds).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [ "${1:-}" = "--wipe" ]; then
  echo "==> Stopping stack and wiping data volumes ..."
  docker compose down -v --remove-orphans
else
  echo "==> Stopping stack (data volumes preserved) ..."
  docker compose down --remove-orphans
fi

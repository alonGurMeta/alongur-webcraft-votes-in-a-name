#!/usr/bin/env bash
# scripts/app/seed.sh — load declarative state from data/ into the store.
# Runs from /workspace. Referenced by app.toml [app].seed. Must be idempotent.
set -euo pipefail
cd /workspace

# Keep the DATA in data/ and this script a thin importer, so a research harness
# can override state by swapping data/ and re-running seed. Examples:
#   psql "$DATABASE_URL" -f data/schema.sql -f data/seed.sql
#   node scripts/import.mjs data/catalog.json

[ -d data ] || { echo "no data/ to seed — skipping"; exit 0; }
echo "TODO: import data/ into the store (idempotently)"

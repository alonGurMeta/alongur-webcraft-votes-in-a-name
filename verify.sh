#!/usr/bin/env bash
# verify.sh — resolve and exercise this repo's OS-Docker operational contract.
#
# Docker is the single substrate: the app runs as `docker compose` (a no-backend
# app is just the one app-runner service). This reads the lifecycle from app.toml
# (then package.json, then defaults); compose owns services / health / networking
# / volumes. The repo is bind-mounted at /workspace and the lifecycle commands are
# driven into the app-runner container via `docker compose exec`.
#
#   ./verify.sh          resolve → compose up → setup/build/seed → start →
#                        wait for [app].health at the front door → tear down
#   ./verify.sh --keep   same, but leave the stack running (used by ./start.sh)
#   ./verify.sh --plan   just print the resolved plan; run nothing
#   ./verify.sh --prod   use the [app.production] profile (alias for --profile production)
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT" || exit 1

# Collapse BuildKit's per-layer output to a single line once the image is cached
# (the common case on repeat runs). Errors still print. NOTE: this also quiets
# the FIRST/cold build — minutes of silence while the app-runner image builds —
# so set BUILDKIT_PROGRESS=plain to watch it (or =auto to only go verbose in CI).
export BUILDKIT_PROGRESS="${BUILDKIT_PROGRESS:-quiet}"

PLAN_ONLY=0; KEEP=0
# Profile selects a config layer: dev (default) or a named [app.<profile>] section
# (e.g. production). Set it with --profile <name> (--prod is an alias for
# --profile production) or the WEBCRAFT_PROFILE env var.
PROFILE="${WEBCRAFT_PROFILE:-}"
while [ $# -gt 0 ]; do
  case "$1" in
    --plan) PLAN_ONLY=1 ;;
    --keep) KEEP=1 ;;
    --prod) PROFILE=production ;;
    --profile) PROFILE="${2:-}"; [ -z "$PROFILE" ] && { echo "--profile needs a name (e.g. --profile production)"; exit 1; }; shift ;;
    --profile=*) PROFILE="${1#--profile=}"; [ -z "$PROFILE" ] && { echo "--profile needs a name (e.g. --profile=production)"; exit 1; }; shift 0 ;;
    *) echo "unknown arg: $1"; exit 1 ;;
  esac
  shift
done
[ -z "$PROFILE" ] && PROFILE=dev
export WEBCRAFT_PROFILE="$PROFILE"

say()  { printf '\033[1m%s\033[0m\n' "$*"; }
info() { printf '  %s\n' "$*"; }
warn() { printf '  \033[33m! %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓ %s\033[0m\n' "$*"; }
die()  { printf '\033[31m✗ %s\033[0m\n' "$1"; exit "${2:-1}"; }

toml_get() {
  local file=$1 section=$2 key=$3
  [ -f "$file" ] || return 1
  awk -v sec="[$section]" -v key="$key" '
    /^\[/ { in_sec = ($0 ~ "^\\" sec "[ \t]*$") }
    in_sec && $0 ~ "^[ \t]*" key "[ \t]*=" {
      sub(/^[^=]*=[ \t]*/, ""); sub(/[ \t]*#.*/, ""); gsub(/^["'\'']|["'\'']$/, ""); print; exit
    }' "$file"
}
pkg_script() {
  [ -f package.json ] || return 1
  if command -v node >/dev/null 2>&1; then
    node -e "try{const s=require('./package.json').scripts||{};if(s['$1'])process.stdout.write(s['$1'])}catch(e){}"
  elif command -v jq >/dev/null 2>&1; then
    jq -r '.scripts["'"$1"'"] // empty' package.json
  fi
}
has_script() { [ -n "$(pkg_script "$1")" ]; }

# The app-runner service in docker-compose.yml (override with $APP_SERVICE).
SVC="${APP_SERVICE:-app-runner}"

say "Resolving operational contract"
[ -f app.toml ] || die "app.toml is required for AWS hosting"
info "app.toml: present"

# Lifecycle resolution: [app.<profile>] overrides base [app], then package.json, then
# default. pget returns a field for the ACTIVE profile, falling back to base [app] (never
# to another profile -- production must not inherit dev's commands).
pget() {
  local key=$1 v=""
  v=$(toml_get app.toml "app.$PROFILE" "$key")
  [ -z "$v" ] && v=$(toml_get app.toml app "$key")
  printf '%s' "$v"
}
SETUP=$(pget setup)
if [ -z "$SETUP" ]; then
  if has_script setup; then
    SETUP="npm run setup"
  elif [ -f package.json ]; then
    SETUP="npm ci || npm install"
  fi
fi
BUILD=$(pget build)          # NO inferred default -- runs only if declared (or inferred prod, below)
SEED=$(pget seed);  [ -z "$SEED" ] && { has_script seed && SEED="npm run seed"; }
PORT=$(pget port);   [ -z "$PORT" ] && PORT=3000
HEALTH=$(pget health); [ -z "$HEALTH" ] && HEALTH="/"

# START is profile-aware:
#  - dev (default): [app.dev].start ?? [app].start ?? npm start/dev, then front-door-bound
#    (0.0.0.0:$PORT) when INFERRED (an author-declared start always wins).
#  - any other profile (e.g. production): [app.<profile>].start (author owns it; may branch
#    on the forwarded WEBCRAFT_PROFILE), else INFER a prod server for known
#    frameworks (next/vite), else BAIL. We never fall back to the dev start -- you asked for
#    a non-dev profile, so silently serving dev would be a lie. The harness never fixes app
#    build issues (e.g. vendor your own fonts): a failed build is a repo bug, surfaced here.
START=""; START_EXPLICIT=""
if [ "$PROFILE" = dev ]; then
  START=$(pget start); [ -n "$START" ] && START_EXPLICIT=1
  [ -z "$START" ] && { has_script start && START="npm start"; }
  [ -z "$START" ] && { has_script dev && START="npm run dev"; }
  if [ -z "$START_EXPLICIT" ] && [ -n "$START" ] && [ -f package.json ]; then
    case "$(cat package.json)" in
      *'"next"'*)                                      START="$START -- -H 0.0.0.0 -p $PORT" ;;
      *'"react-scripts"'*)                             START="HOST=0.0.0.0 PORT=$PORT $START" ;;
      *'"vite"'*|*'"webpack"'*|*'"@vue/cli-service"'*) START="$START -- --host 0.0.0.0 --port $PORT" ;;
    esac
  fi
else
  START=$(toml_get app.toml "app.$PROFILE" start)
  if [ -n "$START" ]; then
    info "profile $PROFILE: [app.$PROFILE] start"
  elif [ -f package.json ] && grep -q '"next"' package.json; then
    BUILD=${BUILD:-npm run build}; START="npx next start -H 0.0.0.0 -p $PORT"; info "profile $PROFILE: inferred next (build + next start)"
  elif [ -f package.json ] && grep -q '"vite"' package.json; then
    BUILD=${BUILD:-npm run build}; START="npx vite preview --host 0.0.0.0 --port $PORT"; info "profile $PROFILE: inferred vite (build + vite preview)"
  else
    die "--profile $PROFILE: no [app.$PROFILE] path for this repo. Declare [app.$PROFILE] start (a command that serves your $PROFILE build), or use a next/vite app. Dev is the default -- drop --prod/--profile to run dev." 2
  fi
fi
API_BASE=$(toml_get app.toml app.api base) || true

echo; say "Resolved plan"
info "service: $SVC (app-runner)"
  info "profile: $PROFILE"
info "setup  : ${SETUP:-<none>}"
info "build  : ${BUILD:-<none>}"
info "seed   : ${SEED:-<none>}"
info "start  : ${START:-<none>}"
info "port   : $PORT (container-internal)"
info "health : GET $HEALTH"
info "api    : ${API_BASE:-<none>}"
echo
[ "$PLAN_ONLY" = 1 ] && { say "Plan-only; stopping."; exit 0; }

[ -f docker-compose.yml ] || [ -f compose.yaml ] || [ -f docker-compose.yaml ] || \
  die "no docker-compose.yml — copy docker-compose.yml.example (Docker is the substrate)" 1
command -v docker >/dev/null 2>&1 || die "Docker is required" 1
docker info >/dev/null 2>&1 || die "Docker is not running" 1

compose_port() { docker compose port "$SVC" "$PORT" 2>/dev/null | head -1 | awk -F: '{print $NF}'; }
runner_exec() {
  local label=$1 cmd=$2; [ -n "$cmd" ] || return 0
  say "$label: $cmd"
  docker compose exec -T -e APP_PUBLIC_URL="$APP_URL" -e WEBCRAFT_PROFILE="${WEBCRAFT_PROFILE:-dev}" "$SVC" bash -lc "cd /workspace && $cmd"
}
wait_health() {
  say "Waiting for health: ${APP_URL}${HEALTH}"
  for _ in $(seq 1 180); do
    curl -fsS -o /dev/null "${APP_URL}${HEALTH}" 2>/dev/null && { ok "healthy"; return 0; }
    sleep 2
  done
  return 1
}

CLEANUP=":"; trap '[ "$KEEP" = 1 ] || eval "$CLEANUP"' EXIT

say "Starting app-runner and services"
docker compose up -d --build --remove-orphans "$SVC" || { docker compose logs --tail=120; die "compose up failed" 2; }
CLEANUP="docker compose down -v --remove-orphans >/dev/null 2>&1 || true"

HOST_PORT=$(compose_port); [ -n "$HOST_PORT" ] || die "could not discover published host port for $PORT" 3
APP_URL="http://localhost:${HOST_PORT}"; info "front door: $APP_URL"

runner_exec "Setup" "$SETUP" || die "setup failed" 2
runner_exec "Build" "$BUILD" || die "build failed" 2
runner_exec "Seed"  "$SEED"  || die "seed failed" 2

if [ -n "$START" ]; then
  say "Start: $START"
  docker compose exec -T -d -e APP_PUBLIC_URL="$APP_URL" -e WEBCRAFT_PROFILE="${WEBCRAFT_PROFILE:-dev}" "$SVC" \
    bash -lc "cd /workspace && mkdir -p /tmp/webcraft && rm -f /tmp/webcraft/app.log && exec bash -lc '$START' >/tmp/webcraft/app.log 2>&1"
fi

if ! wait_health; then
  warn "app log tail"; docker compose exec -T "$SVC" bash -lc 'tail -160 /tmp/webcraft/app.log 2>/dev/null || true'
  die "health check failed" 3
fi

echo; ok "verify complete"
info "URL: ${APP_URL}${HEALTH}"
[ -n "$API_BASE" ] && info "API base: ${APP_URL}${API_BASE}"
[ "$KEEP" = 1 ] && info "Stop: ./stop.sh"

# Exit explicitly 0 on success. Without this the script's status is that of the
# last command above — `[ "$KEEP" = 1 ]` is false on a plain (non --keep) run, so
# a passing conformance check would misreport failure to any CI/eval harness.
exit 0

# environment/Dockerfile.example — copy to environment/Dockerfile.
#
# The app-runner image: the OS + language TOOLCHAIN your app needs. Your source
# is bind-mounted at /workspace at run time (see docker-compose.yml), so this
# image holds tools, not code. Docker is the single substrate — every Web Craft
# app runs as `docker compose`; a no-backend app is just this one service.
#
# Pin versions. Commit your lockfile. Determinism is the whole point.

FROM node:22-slim

# The default front-end app needs NO extra OS packages: node:22-slim already
# ships node, npm, corepack, and bash, and node bundles its own CA store (so npm
# over HTTPS works with no ca-certificates package). We deliberately do NOT run
# apt here. A build-time `apt-get` HARD-FAILS on locked-down eval substrates
# (VMVM/DES leased VMs, hardened devservers) whose build sandbox sits behind an
# HTTPS-only proxy that can't reach the Debian mirrors — turning a clean build
# into a failure for packages the app never needed. Keeping the default image
# apt-free lets it build anywhere.
#
# Need system packages (a backend toolchain, image libs, a db client)? Uncomment
# the block below. It passes the build-time proxy in via build args so apt can
# reach the network on proxied substrates (SETUP.md → build-time egress); on an
# open network the args are simply empty and it still works. Or swap the base
# image (ruby:/python:/golang:) and layer Node on.
#
# ARG http_proxy
# ARG https_proxy
# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y ca-certificates curl git && \
#     rm -rf /var/lib/apt/lists /var/cache/apt/archives

# corepack ships with node — enable it so pnpm/yarn are available without a global
# install. scripts/app/setup.sh detects the repo's lockfile and uses the matching
# manager; corepack fetches the exact version pinned in package.json's
# "packageManager" field, keeping installs deterministic.
RUN corepack enable

WORKDIR /workspace

# Container-internal front door. Keep in sync with [app].port.
EXPOSE 3000

# The app-runner idles; verify.sh drives the lifecycle (setup/seed/start from
# app.toml) into it via `docker compose exec`. Do NOT hardcode the app start
# here — that lives in scripts/app/start.sh so a harness can re-run it.
CMD ["bash", "-lc", "sleep infinity"]

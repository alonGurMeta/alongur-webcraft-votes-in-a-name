# Web Craft Template

Starter repo for the Web Craft hackathon track. Use this template to create your submission.

## Quick Start

1. Click "Use this template" → "Create a new repository"
2. Set owner to `codimango`, name it `{your-username}-webcraft`, set to Internal
3. Clone your new repo and start building
4. Copy `site.toml.example` to `site.toml` and fill in your details

## Required Files

- `site.toml` — Submission manifest, incl. the required walkthrough-video link (`[site.prd].walkthrough_video`) ([schema reference](https://www.multimango.com/admin/aai-hackathons/web-craft))
- `app.toml` — AWS lifecycle manifest. The `[app]` table is required; its fields are optional and default through package inference.
- `docker-compose.yml` — Exactly one application service, named `app-runner`.
- `environment/Dockerfile` — Image definition for `app-runner`.
- `PRD.md` — 1–4 page product requirements doc
- `SETUP.md` — The operational contract (how to provision / run / seed / health-check). The setup *is* the contract; see the section below.
- `.env.example` — Environment variable placeholders (never commit real secrets)
- `screenshots/` — Add both home-page previews: `screenshots/home-desktop.png` (1440×900) and
  `screenshots/home-mobile.png` (390×844), referenced from `site.toml` with `route = "/"`. Codimango
  Smart Capture can provide the preview when repository screenshots are unavailable.

## Operational Contract (makes your site reusable)

This describes **how to stand up and drive the app** so it can be run
reproducibly and reused as an evaluation substrate. **Docker is the single
substrate:** every app runs as exactly one Compose service, `app-runner`. Front
end, backend, workers, and local persistence must be merged into that container;
sidecars are not accepted. The template ships the environment. Next.js and Vite
production starts resolve by inference; other stacks must declare
`[app.production].start`. See **`SETUP.md`** for the full spec.

The template ships these operational files with working defaults:

- `docker-compose.yml` — the one-service `app-runner` substrate. Do not add database, cache, API, worker, proxy, or other sidecars. Copy from `docker-compose.yml.example`.
- `environment/Dockerfile` — the app-runner image (OS + toolchain). Copy from `environment/Dockerfile.example`.
- `app.toml` — the lifecycle manifest (setup / build / start / test / seed / port / health). Copy from `app.toml.example`.
- `scripts/app/{setup,seed,start}.sh` — optional lifecycle scripts `app.toml` can point at. Copy from the `*.example` alongside them.
- `data/` — declarative seed data, if your app has any (the seam a harness overrides). Create it when needed.

Run it:

- `./verify.sh --plan` — print what will run (and whether inference guessed your setup)
- `./start.sh` — compose up per `app.toml`, wait for health, and leave it running
- `./verify.sh` — same, but health-check then tear down (conformance check)
- `./stop.sh [--wipe]` — stop the stack (`--wipe` also drops data volumes)

## Full Guide

See the [Web Craft track guide](https://www.multimango.com/admin/aai-hackathons/web-craft) for complete instructions, field reference, and submission checklist.

## Dev by default; `--prod` when you want a production view

`wcvm up` runs the **dev server** — that's the default (HMR, fast iteration). Pass **`--prod`**
(`wcvm up --prod` / `./verify.sh --prod`) when you want a **production build + serve** instead:
no HMR/compile churn or unstyled flashes, representative of a real deploy. Handy for demos,
screenshots, and eval — purely opt-in.

- **Next / Vite** get a `production` profile for free (`next build` + `next start`; `vite build` + `vite preview`).
- **Any other single-container stack** (custom, webpack/static): add an **`[app.production]`** section
  whose keys override base `[app]` (e.g. `build` + a `start` that serves your production build). It may
  branch on the `WEBCRAFT_PROFILE` env the harness forwards (see spreecommerce). Your
  base `[app]`/`[app.dev]` start stays as-is.
- **No production profile?** `--prod` **errors** — it won't silently serve dev, because you asked for
  prod. Dev is the default; just drop `--prod`. (`--profile <name>` selects any named profile.)

The harness stays thin and **does not fix app build issues** — that's the repo's job, and a
failed prod build is surfaced loudly for a human to fix (not papered over). Common gotcha:
`next/font/google` (and similar) **fetch at build time**, which the locked-down eval VM blocks —
so `next build` fails there even though `next dev` tolerates it. **Vendor your fonts**
(`next/font/local` + a committed `.woff2`, or the `geist` package) — a repo change, not a harness one.

# AGENTS.md

Single entry point for any agent or human working with this repo — no plugin or
external tool required to understand it. Two parts:

1. **Running & driving this app** — the in-repo runbook for the operational contract.
2. **Implementation standards** — how to write changes well (authoring time).

---

## Running & driving this app  (in-repo runbook)

This repo conforms to the Web Craft **operational contract**. Everything needed to
stand up and drive it ships *in the repo* — you do not need any plugin, skill, or
private tooling. (Full spec + rationale: `SETUP.md`. Declared commands: `app.toml`.)

**Docker is the single substrate and WebCraft 2.0 accepts one container only.**
The app runs as the sole `app-runner` Compose service. Merge front end, backend,
workers, and local persistence into that application container; do not add
sidecars. The container is the environment for dev, CI, and eval alike — there
is no host/bare-metal path.

### Run it

| Command | What it does |
| --- | --- |
| `./verify.sh --plan` | Print the resolved plan (did inference guess your setup right?) — runs nothing. |
| `./verify.sh` | Bring the stack up, run setup/build/seed, wait for health, then **tear down** — the conformance check. |
| `./start.sh` | Same, but **leave it running** (the "go"). |
| `./stop.sh [--wipe]` | Stop the stack (`--wipe` also drops data volumes). |

Requires Docker. Nothing else — the toolchain is baked into `environment/Dockerfile`.

### Where the truth lives

- **`app.toml`** — the required lifecycle manifest: `setup` / `build` / `seed` /
  `start` / `test` / `port` / `health`, plus optional `[app.api]` (`base` /
  `spec`). All fields inside `[app]` are optional; unset ones are inferred from
  `package.json`, then defaults. `build` runs **only if declared**.
- **`docker-compose.yml`** — the substrate: exactly one service named
  `app-runner`. Database, cache, API, worker, proxy, and other sidecar services
  are not accepted.
- **`app.toml`** has no container topology. Do not add `services`, `containers`,
  or sidecar declarations; its commands all run inside `app-runner`.
- **`scripts/app/{setup,seed,start}.sh`** — optional lifecycle scripts `app.toml`
  points at.
- **`scripts/app/package.json`** — scopes the bundled CommonJS static server
  independently from the application's root Node module type. Keep it whenever
  `scripts/app/serve-static.js` is used.

### The front door (how a harness reaches the app)

- `[app].port` is the **container-internal** port (default 3000). The host port is
  **ephemeral and discovered** — never fixed — so parallel runs don't collide:
  `docker compose port app-runner <port>` (this is what `verify.sh` does).
- Hosted Fargate maps valid privileged ports (`1-1023`) to `8080` and overrides
  `PORT`; an application declaring a privileged port must honor that override.
- `[app].health` is the one readiness URL that means "the whole stack is drivable."
- **Prefer `[app.api]` for driving/asserting** — it is deterministic and keeps
  browser assets and API traffic on the one application origin. Reach for
  UI-driving (browser / computer-use) only when the task is inherently visual.

### Boundary (read this)

This runbook is **floor-only**: it describes how to *run and drive* the app and
says nothing about rewards, oracles, pass/fail tests, or grading. **Tests and reward
functions are supplied by the evaluation harness at run time and are never committed
to this repo.** A site author may add optional smoke/build checks; feature tests that
define a task are the harness's to inject. Keep this repo a clean, reusable substrate.

---

## Implementation standards  (authoring time)

Standards agents should follow when making changes in this repository.

### Core Principle

Prefer a smaller complete site over a larger broken one. Cutting scope is acceptable.
Shipping broken scope is not.

### Code Quality Rules

| Area | Agent instruction |
| --- | --- |
| Route/component structure | Keep a clean mapping between routes and user-visible pages. Avoid unclear routing, overloaded entry points, or components with mixed page responsibilities. |
| No dead ends | Do not leave broken links, placeholder sections, empty states with no purpose, or half-removed features in the claimed scope of the work. |
| Animation implementation | Organize animation logic so it can be iterated on and maintained. Avoid spaghetti inline styles or scattered timing logic with no structure. |
| Scope discipline | Do not introduce unnecessary complexity for features that were intentionally cut or deferred. |
| Semantic HTML | Use proper heading hierarchy, landmark elements, buttons for actions, links for navigation, and accessible markup by default. |
| Responsive implementation | Build layouts with grid, flex, and media queries so breakpoints work intentionally across screen sizes. |

### Maintainability Rules

| Area | Agent instruction |
| --- | --- |
| Dead code | Do not leave commented-out blocks, unreachable branches, unused imports, or components that are defined but never rendered. |
| Duplicated code | Extract repeated logic into shared utilities, components, or tokens instead of copying the same implementation across files. |
| Large god files/classes | Split files that grow beyond roughly 500 lines or mix unrelated concerns. Prefer focused modules over monoliths. |
| Hardcoded magic values | Replace unexplained inline numbers, colors, breakpoints, spacing values, and repeated strings with named constants or design tokens where appropriate. |
| Tight coupling | Keep components composable. Avoid circular imports, sibling-aware components, and deep child mutations of global state. |
| Missing tests | Add or update **smoke/build** tests when changing non-trivial behavior (routing, state, animations). Do **not** author feature/acceptance tests that define an eval task — those are harness-injected (see the Boundary above). |

### Accessibility & Responsiveness Rules

| Area | Agent instruction |
| --- | --- |
| Accessibility | Provide alt text where needed, maintain keyboard access, include ARIA only when semantic HTML is insufficient, preserve visible focus states, and keep contrast at or above WCAG-friendly levels. |
| Responsive design | Avoid fixed widths that break on mobile, ensure touch targets are at least 44px when interactive, prevent horizontal overflow, and keep text readable on small screens. |
| Multilingual readiness | Avoid hardcoded left-to-right assumptions, avoid embedding important text in images, account for longer translations, and ensure the document language is declared with `lang`. |

### Integrity & Security Rules

AI-assisted changes must remain readable, attributable, and safe. Do not introduce
code that obscures behavior, hides provenance, or adds risk without explicit justification.

| Area | Agent instruction |
| --- | --- |
| Obfuscated code | Do not introduce unreadable variable names, encoded strings, or intentionally obscured logic. Code should be easy to inspect and explain. |
| Minified code | Do not commit `.min.js` files or bundled artifacts as source unless the repository explicitly requires them and the reason is documented. |
| Generated bundles | Do not commit `dist/`, `build/`, or `node_modules/` output unless the repository workflow explicitly depends on it. |
| Copied code | Do not paste large external code blocks without verifying they fit the stack, style, and licensing constraints of the project. |
| Copyright / licensing | Only use assets, fonts, libraries, and snippets with licensing that is compatible with the project. |
| Third-party assets | Document the source and usage of externally sourced images, video, fonts, or embeds when they are added. |
| Network calls | Keep external requests explicit and intentional. Do not add analytics, tracking, beaconing, or undocumented third-party calls silently. |
| External email recipients | Replace legitimate recipient or contact addresses from the source site with clearly fake, non-deliverable addresses under `example.invalid`, including visible text, `mailto:` links, form configuration, and backend code. Mock submission behavior without sending email, and verify no real external recipient or live email delivery integration remains before MSL testing. |
| Unsafe script patterns | Avoid `eval()`, `new Function()`, `document.write()`, dynamic script injection, and unsafe `innerHTML`, especially with user-controlled data. |
| Secrets | Never commit API keys, tokens, passwords, private credentials, or secret-bearing config values. |

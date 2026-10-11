# Votes in a name — setup

This is a self-contained React and Vite port of the Diagram Chasing interactive article. Docker is the only supported runtime substrate. No environment variables or external services are needed at runtime.

## Run and verify

Use `./start.sh` to build the single `app-runner` container, install dependencies, and leave the application running. The command prints the ephemeral host URL. Use `./stop.sh` to stop it.

Run `./verify.sh` for the complete WebCraft conformance check; it starts the container, waits for the declared health endpoint, and tears it down. `./verify.sh --plan` prints the resolved lifecycle without running it.

## Assets and replication notes

The illustrations, fonts, face/crowd sprites, analysis datasets, and name-matching algorithm were sourced from the original MIT-licensed project and are kept locally rather than hotlinked. Original artwork is published under CC BY-SA 4.0. The Svelte components were not used at runtime: their behavior was ported into React components and React-managed canvas visualizations. The source has no backend; the replica likewise makes no runtime network calls.

The retained journey includes the illustrated scrolling introduction, editorial masthead and article sections, number-format toggle, algorithm comparison table, state barcode chart, interactive name similarity lab, change-pattern explorer, histogram, references, and close-election table. Source and author links are explicit normal navigation; the application makes no background requests to them.

## Deployment

Push the repository to Codimango and use the managed WebCraft AWS deployment. `app.toml`, `docker-compose.yml`, and `environment/Dockerfile` describe the single `app-runner` service.

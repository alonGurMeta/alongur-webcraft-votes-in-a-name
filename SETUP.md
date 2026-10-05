# Votes in a name — setup

This is a self-contained Vite replica of the Diagram Chasing interactive article. It requires Node 22+ and npm. No environment variables or external services are needed at runtime.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production

```bash
npm ci
npm run build
node scripts/app/serve-static.js --dir dist --port 3000 --spa
```

The WebCraft container contract can also be checked with `./verify.sh --prod`.

## Assets and replication notes

The illustrations and fonts in `public/assets/` were sourced from the original article and are kept locally rather than hotlinked. They include the polling-place scenes, title logo, poster strip, editorial break illustration, award badge, Asap, and Alkatra. Application code and interactions were implemented specifically for this replica. The source has no backend; the replica likewise makes no runtime network calls.

The retained journey includes the illustrated scrolling introduction, editorial masthead and article sections, number-format toggle, interactive name similarity lab, method cards, impact statistic, and close-election table. External links from the source were intentionally omitted so the experience stays self-contained.

## Deployment

Push the repository to Codimango and use the managed WebCraft AWS deployment. `app.toml`, `docker-compose.yml`, and `environment/Dockerfile` describe the single `app-runner` service.

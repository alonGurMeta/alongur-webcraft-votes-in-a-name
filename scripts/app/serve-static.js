#!/usr/bin/env node
/**
 * Minimal production static file server — Node built-ins only, no dependencies.
 *
 * Why this exists: a repo whose production output is a directory of static files needs
 * *something* to serve it, and the eval VM has no reliable network egress at image-build
 * or app-start time (only during `setup`). Depending on a downloaded server (`npx serve`,
 * a global install in the Dockerfile) fails there. This file is committed, so production
 * serving works offline, deterministically, and identically on any host.
 *
 *   node scripts/app/serve-static.js [--dir .] [--port 3000] [--host 0.0.0.0] [--spa]
 *                                    [--proxy /prefix=http://target:port[,strip]] ...
 *
 * --spa    falls back to index.html for unknown paths (client-side routing).
 * --proxy  forwards a path prefix to a backend, so the browser talks to ONE origin (the
 *          production equivalent of a dev server's proxy table). Repeatable. Append
 *          `,strip` to remove the prefix before forwarding:
 *            --proxy /api=http://backend:8080            ->  /api/x  =>  backend /api/x
 *            --proxy /tiles=http://tiles:8080,strip      ->  /tiles/x =>  tiles   /x
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--")) return argv[i + 1];
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  return eq ? eq.slice(name.length + 3) : dflt;
};
const argAll = (name) => {
  const out = [];
  argv.forEach((a, i) => {
    if (a === `--${name}` && argv[i + 1] && !argv[i + 1].startsWith("--")) out.push(argv[i + 1]);
    else if (a.startsWith(`--${name}=`)) out.push(a.slice(name.length + 3));
  });
  return out;
};

const ROOT = path.resolve(arg("dir", "."));
const PORT = parseInt(arg("port", process.env.PORT || "3000"), 10);
const HOST = arg("host", "0.0.0.0");
const SPA = argv.includes("--spa");

// [{ prefix, target: URL, strip }] — longest prefix wins.
const PROXIES = argAll("proxy")
  .map((spec) => {
    const eq = spec.indexOf("=");
    if (eq === -1) throw new Error(`--proxy needs <prefix>=<target>, got: ${spec}`);
    const prefix = spec.slice(0, eq);
    let rest = spec.slice(eq + 1);
    let strip = false;
    if (rest.endsWith(",strip")) { strip = true; rest = rest.slice(0, -",strip".length); }
    return { prefix: prefix.replace(/\/$/, ""), target: new URL(rest), strip };
  })
  .sort((a, b) => b.prefix.length - a.prefix.length);

const TYPES = {
  ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
  ".map": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm", ".mp3": "audio/mpeg", ".mp4": "video/mp4",
  ".pbf": "application/x-protobuf", ".mvt": "application/x-protobuf",
  ".webmanifest": "application/manifest+json", ".xml": "application/xml",
};

const send = (res, code, body, headers = {}) => {
  res.writeHead(code, { "content-length": Buffer.byteLength(body), ...headers });
  res.end(body);
};

const serveFile = (res, file, stat) => {
  const ext = path.extname(file).toLowerCase();
  const isHtml = ext === ".html" || ext === ".htm";
  res.writeHead(200, {
    "content-type": TYPES[ext] || "application/octet-stream",
    "content-length": stat.size,
    // Hashed build assets are immutable; HTML must revalidate so deploys are picked up.
    "cache-control": isHtml ? "no-cache" : "public, max-age=3600",
    "last-modified": stat.mtime.toUTCString(),
  });
  fs.createReadStream(file).pipe(res);
};

const matchProxy = (pathname) =>
  PROXIES.find((p) => pathname === p.prefix || pathname.startsWith(p.prefix + "/"));

const proxyRequest = (req, res, route, pathname, search) => {
  const upstreamPath = (route.strip ? pathname.slice(route.prefix.length) || "/" : pathname) + search;
  const headers = { ...req.headers, host: route.target.host };
  delete headers["accept-encoding"]; // avoid re-encoding surprises; upstream may still compress
  const up = http.request(
    {
      protocol: route.target.protocol,
      hostname: route.target.hostname,
      port: route.target.port || 80,
      method: req.method,
      path: upstreamPath,
      headers,
    },
    (upRes) => {
      res.writeHead(upRes.statusCode || 502, upRes.headers);
      upRes.pipe(res);
    }
  );
  up.on("error", (e) =>
    send(res, 502, `Bad Gateway: ${route.prefix} -> ${route.target.origin} (${e.code || e.message})`));
  req.pipe(up);
};

http
  .createServer((req, res) => {
    let pathname, search;
    try {
      const u = new URL(req.url, "http://localhost");
      pathname = decodeURIComponent(u.pathname);
      search = u.search || "";
    } catch {
      return send(res, 400, "Bad Request");
    }

    const route = matchProxy(pathname);
    if (route) return proxyRequest(req, res, route, pathname, search);

    // Resolve inside ROOT only (no traversal).
    let file = path.resolve(ROOT, "." + pathname);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return send(res, 403, "Forbidden");

    fs.stat(file, (err, stat) => {
      if (!err && stat.isDirectory()) {
        file = path.join(file, "index.html");
        return fs.stat(file, (e2, s2) => (e2 ? notFound(res, req) : serveFile(res, file, s2)));
      }
      if (err) return notFound(res, req);
      serveFile(res, file, stat);
    });
  })
  .listen(PORT, HOST, () => {
    const p = PROXIES.map((r) => `${r.prefix}->${r.target.origin}${r.strip ? " (strip)" : ""}`).join(", ");
    console.log(`serving ${ROOT} on http://${HOST}:${PORT}${SPA ? " (spa)" : ""}${p ? " | proxy: " + p : ""}`);
  });

function notFound(res, req) {
  if (SPA && !path.extname(req.url.split("?")[0])) {
    const index = path.join(ROOT, "index.html");
    return fs.stat(index, (e, s) => (e ? send(res, 404, "Not Found") : serveFile(res, index, s)));
  }
  send(res, 404, "Not Found");
}

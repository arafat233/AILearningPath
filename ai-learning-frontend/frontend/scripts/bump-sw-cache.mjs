// postbuild hook: bump the service worker's CACHE constant to a unique
// per-build value so every deploy auto-invalidates stale browser caches.
// Replaces the previous "manually edit sw.js before deploy" footgun.
//
// Format: stellar-<git-short-sha>-<YYYY-MM-DD>  (e.g. stellar-b3769555-2026-05-12)
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swPath = path.resolve(__dirname, "../dist/sw.js");

if (!fs.existsSync(swPath)) {
  console.warn(`[bump-sw-cache] dist/sw.js not found at ${swPath} — skipping (was vite build run?)`);
  process.exit(0);
}

let sha = "nogit";
try {
  sha = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
} catch {
  // Not in a git repo (e.g. shipped tarball) — fall back to timestamp
  sha = String(Date.now()).slice(-8);
}

const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const cacheName = `stellar-${sha}-${date}`;

let content = fs.readFileSync(swPath, "utf8");
const before = content;
content = content.replace(/const CACHE = "[^"]+"/, `const CACHE = "${cacheName}"`);

if (before === content) {
  console.warn(`[bump-sw-cache] no CACHE constant matched in sw.js — pattern may have drifted`);
  process.exit(1);
}

fs.writeFileSync(swPath, content);
console.log(`[bump-sw-cache] sw.js → CACHE = "${cacheName}"`);

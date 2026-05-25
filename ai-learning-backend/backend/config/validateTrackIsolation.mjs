/**
 * Track Isolation Validator
 *
 * Catches the exact bug class that broke /api/v1/ncert routes today:
 * a route uses req.user.id in its controller but has NO auth middleware
 * on the route definition, so req.user is undefined and the actAsChild
 * swap never fires. Effect: defaults to anonymous / CBSE, leaks data
 * across boards/users.
 *
 * Static scan — no DB required. Reports each route line that touches
 * authenticated state but isn't guarded.
 *
 * Usage:
 *   node config/validateTrackIsolation.mjs           # report, exit 0/1
 *   node config/validateTrackIsolation.mjs --verbose # show clean routes too
 *
 * Exit code: 0 = clean, 1 = unguarded auth-touching routes found
 *            (wire into CI to block PRs that introduce the bug class)
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function walkJsFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkJsFiles(full));
    else if (name.endsWith(".js")) out.push(full);
  }
  return out;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, "..");
const ROUTES_DIR     = resolve(ROOT, "routes");
const CONTROLLERS_DIR = resolve(ROOT, "controllers");

const verbose = process.argv.includes("--verbose");

// ── Known intentionally-public route prefixes ────────────────────────────
// Anything matching one of these patterns is allowed to skip auth without
// triggering a violation. Update this list when you intentionally add a
// new public endpoint.
const ALLOWED_UNAUTHED = [
  /^\/api\/auth\/(register|login|refresh|forgot-password|reset-password|google)/,
  /^\/api\/webhooks/,
  /^\/api\/public\//,
  /^\/api\/payment\/plans$/,
  /^\/api\/company\/login$/,
  /share\/:token/,           // public share-link routes
  /\/co-study\/:token/,
  /\/public\/:slug/,
  /\/vapid-public-key$/,
];

// Route lines matching this are NOT data-touching, so unauthed is fine.
// Currently empty — every other endpoint should require some form of auth.

// ── Step 1: Index which controller functions touch req.user / req.parentUserId
function indexControllers() {
  const userTouchingFns = new Set();
  const files = walkJsFiles(CONTROLLERS_DIR);

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    // Match exported async function or const fn that uses req.user
    const fnRegex = /export\s+(?:async\s+)?(?:const|function)\s+(\w+)/g;
    let m;
    while ((m = fnRegex.exec(text)) !== null) {
      const fnName = m[1];
      // Heuristic: find the function body (next 4000 chars). If it references
      // req.user.id, req.user?.id, or req.parentUserId, mark it as touching.
      const startIdx = m.index;
      const body = text.slice(startIdx, startIdx + 6000);
      if (/req\.user\??\.id|req\.parentUserId/.test(body)) {
        userTouchingFns.add(fnName);
      }
    }
  }
  return userTouchingFns;
}

// ── Step 2: Parse each route file and check every r.METHOD line
const ROUTE_DEFN = /^\s*r\.(get|post|put|patch|delete)\(\s*(['"`])([^'"`]+)\2(.*?)$/;

function checkRouteFile(path, userTouchingFns) {
  const text   = readFileSync(path, "utf8");
  const lines  = text.split(/\r?\n/);
  const issues = [];

  // Detect blanket guards at the top of the file: r.use(auth) / r.use(adminAuth)
  const blanketAuth = /\br\.use\(\s*(auth|adminAuth|optionalAuth)\b/.test(text);

  // The mounted prefix in server.js — we resolve it later when reporting.
  const fileBase = path.split(/[\\/]/).pop().replace(/Routes\.js$/, "");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(ROUTE_DEFN);
    if (!m) continue;
    const [, method, , routePath, rest] = m;

    // What handlers appear in the middleware chain? We look for known guard names
    const hasAuth = /\b(auth|adminAuth|optionalAuth|companyAuth)\b/.test(rest);

    // Identify the controller function called (last comma-separated identifier
    // that isn't a guard or `validate(...)`)
    const candidates = rest
      .split(/[,()]/)
      .map((s) => s.trim())
      .filter((s) => s && !/^(auth|adminAuth|optionalAuth|companyAuth|validate|.+Limiter)$/.test(s));
    const handler = candidates[candidates.length - 1] || "";

    const guarded     = hasAuth || blanketAuth;
    const userTouches = userTouchingFns.has(handler);
    const isAllowed   = ALLOWED_UNAUTHED.some((re) => re.test(`/api/${fileBase}${routePath}`));

    if (!guarded && userTouches && !isAllowed) {
      issues.push({
        file:    path.split(/[\\/]/).slice(-2).join("/"),
        line:    i + 1,
        method:  method.toUpperCase(),
        route:   routePath,
        handler,
      });
    } else if (verbose) {
      issues.push({
        ok:     true,
        file:   path.split(/[\\/]/).slice(-2).join("/"),
        line:   i + 1,
        method: method.toUpperCase(),
        route:  routePath,
        handler,
        guarded,
      });
    }
  }
  return issues;
}

// ── Run ──────────────────────────────────────────────────────────────────

const userTouchingFns = indexControllers();
console.log(`Indexed ${userTouchingFns.size} controller fns that touch req.user / req.parentUserId\n`);

const routeFiles = readdirSync(ROUTES_DIR)
  .filter((f) => f.endsWith(".js"))
  .map((f) => resolve(ROUTES_DIR, f));

let totalBad = 0;
const allIssues = [];

for (const file of routeFiles) {
  const issues = checkRouteFile(file, userTouchingFns);
  const bad = issues.filter((i) => !i.ok);
  if (bad.length > 0) totalBad += bad.length;
  allIssues.push(...issues);
}

if (totalBad === 0) {
  console.log("✓ All user-context routes are guarded by an auth middleware.");
  if (verbose) {
    const ok = allIssues.filter((i) => i.ok);
    console.log(`\nVerbose: ${ok.length} routes inspected and verified OK.`);
  }
  process.exit(0);
} else {
  console.error(`✗ Found ${totalBad} unguarded route(s) that read req.user:\n`);
  for (const i of allIssues.filter((x) => !x.ok)) {
    console.error(`  ${i.file}:${i.line}  ${i.method} ${i.route}  →  ${i.handler}`);
  }
  console.error(
    "\nFix: add `auth` (or `optionalAuth` for personalised-public routes) to the route definition.\n" +
    "If the route is intentionally public, add its pattern to ALLOWED_UNAUTHED in this validator."
  );
  process.exit(1);
}

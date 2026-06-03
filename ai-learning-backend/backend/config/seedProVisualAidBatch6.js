/**
 * seedProVisualAidBatch6.js — fix the 4 panel-instead-of-diagram visual_aids
 * that auditVisualAids.mjs surfaced (broader keyword scan than batch5):
 * m4_t2 (constructor lifecycle timeline), m19_t4 (timeout/fallback timeline),
 * m22_t5 (Gatling report dashboard), m27_t2 (Spring GraphQL flow).
 * Sets teaching.visual_aid.svg. Idempotent.
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.13)", "rgba(255,159,10,0.14)", "rgba(191,90,242,0.11)", "rgba(255,69,58,0.13)", "rgba(142,142,147,0.13)"];
const STRK = ["rgba(10,132,255,0.5)", "rgba(48,209,88,0.55)", "rgba(255,159,10,0.6)", "rgba(191,90,242,0.5)", "rgba(255,69,58,0.55)", "rgba(142,142,147,0.5)"];
const ARR = "rgba(140,140,148,0.95)", RED = "rgba(255,69,58,0.9)", GRN = "rgba(40,170,80,0.95)";
const PLOT = ["#0a84ff", "#1f9f4a", "#ff9f0a"];
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;font-family:ui-sans-serif,system-ui" fill="currentColor"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${ARR}"/></marker></defs>${inner}</svg>`;
const box = (x, y, w, h, ci, rx = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`;
const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" font-weight="${o.w || 400}" text-anchor="${o.a || "start"}" opacity="${o.o ?? 1}"${o.fill ? ` fill="${o.fill}"` : ""}${o.mono ? ' font-family="ui-monospace,Menlo,monospace"' : ""}>${esc(t)}</text>`;
const arr = (x1, y1, x2, y2, l) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ARR}" marker-end="url(#ah)"/>` + (l ? txt((x1 + x2) / 2, (y1 + y2) / 2 - 3, l, { a: "middle", s: 9, o: 0.8 }) : "");
const title = (x, t) => txt(x, 15, t, { w: 700, s: 12.5, o: 0.88 });
const lbox = (x, y, w, h, t, ci, o = {}) => box(x, y, w, h, ci) + txt(x + w / 2, y + h / 2 + 4, t, { a: "middle", mono: o.mono, s: o.s || 10, w: o.w || 600 });

function m4_t2() {
  let g = title(14, "Constructor — object lifecycle");
  g += box(20, 40, 200, 70, 5) + txt(120, 36, "1. new Product(...)", { a: "middle", s: 9, o: 0.6 }) + txt(32, 64, "id=0", { mono: true, s: 9, o: 0.6 }) + txt(32, 80, "name=null", { mono: true, s: 9, o: 0.6 }) + txt(32, 96, "stock=0 price=0", { mono: true, s: 9, o: 0.6 });
  g += arr(220, 75, 260, 75);
  g += box(260, 40, 220, 70, 1) + txt(370, 36, "2. constructor body runs", { a: "middle", s: 9, o: 0.6 }) + txt(272, 64, "id=101", { mono: true, s: 9 }) + txt(272, 80, "name=\"Mouse\"", { mono: true, s: 9 }) + txt(272, 96, "stock=45 price=599.99", { mono: true, s: 9 });
  g += arr(480, 75, 520, 75);
  g += box(520, 40, 220, 70, 0) + txt(630, 36, "3. reference returned", { a: "middle", s: 9, o: 0.6 }) + txt(532, 70, "Product p", { mono: true, s: 9.5 }) + txt(620, 70, "→ object", { s: 9, o: 0.6 }) + txt(532, 92, "(a 'this' is wired up)", { s: 8.5, o: 0.6 });
  g += txt(20, 140, "new allocates a zeroed object → the constructor initializes its fields → the reference is handed back.", { s: 9, o: 0.8 });
  return svg(760, 156, g);
}

function m19_t4() {
  let g = title(14, "Timeout & Fallback");
  g += txt(20, 38, "without timeout:", { s: 9.5, w: 600, fill: RED });
  g += box(140, 30, 480, 16, 4, 4) + txt(150, 42, "thread BLOCKED until server times out", { s: 8.5 }) + txt(628, 42, "30s", { s: 9, fill: RED });
  g += txt(20, 72, "@TimeLimiter(2s):", { s: 9.5, w: 600, fill: GRN });
  g += box(140, 64, 70, 16, 0, 4) + txt(214, 76, "TimeoutException → fallback at 2.001s", { s: 8.5 }) + txt(560, 76, "2.1s ✓", { s: 9, fill: GRN });
  g += txt(20, 108, "fallback tiers (fastest → richest):", { s: 9.5, w: 600 });
  ["static default", "cached value", "degraded call", "queue for retry"].forEach((t, i) => g += lbox(40 + i * 168, 118, 158, 26, t, 2, { s: 8.5 }));
  g += txt(20, 164, "Fail fast: free the thread at the deadline, return a fallback instead of blocking the whole pool.", { s: 9, o: 0.75 });
  return svg(760, 180, g);
}

function m22_t5() {
  let g = title(14, "Gatling load-test report");
  const panel = (x, y, w, h, t) => box(x, y, w, h, 5) + txt(x + 8, y + 15, t, { s: 9, w: 600 });
  const spark = (x, y, w, h, pts, c) => `<polyline points="${pts.map((p, i) => `${(x + i * (w / (pts.length - 1))).toFixed(1)},${(y + h - p * h).toFixed(1)}`).join(" ")}" fill="none" stroke="${c}" stroke-width="2"/>`;
  g += panel(20, 30, 350, 80, "users over time");
  g += spark(34, 46, 300, 50, [0, .5, 1, 1, 1, 1, 1], PLOT[0]) + txt(300, 56, "ramp→100", { s: 8, o: 0.6 });
  g += panel(390, 30, 350, 80, "response time p50/p95/p99");
  g += spark(404, 46, 300, 50, [.3, .32, .3, .31, .3, .32, .3], PLOT[1]) + txt(660, 100, "stable", { s: 8, fill: GRN });
  g += txt(404, 70, "p50 45ms · p95 120ms · p99 195ms", { s: 8, o: 0.7 });
  g += panel(20, 122, 350, 60, "throughput");
  g += txt(34, 158, "≈ 498 req/s (steady)", { s: 10, mono: true });
  g += panel(390, 122, 350, 60, "summary");
  g += txt(404, 150, "total 14,940 · KO 3 (0.02%)", { s: 9.5, mono: true }) + txt(404, 168, "✓ SLA met (p99 < 200ms)", { s: 9, fill: GRN });
  return svg(760, 196, g);
}

function m27_t2() {
  let g = title(14, "Spring for GraphQL — request flow");
  const stages = [["HTTP client", 0], ["POST /graphql", 5], ["Spring Web", 0], ["GraphQL Engine", 3], ["@Controller", 1]];
  stages.forEach(([t, ci], i) => { const x = 14 + i * 150; g += lbox(x, 44, 138, 32, t, ci, { s: 9 }); if (i < 4) g += arr(x + 138, 60, x + 150, 60); });
  g += txt(14, 100, "GraphQL Engine parses the query + validates it against the schema, then dispatches each field to a", { s: 9, o: 0.8 });
  g += txt(14, 116, "@QueryMapping / @SchemaMapping method (product, products, searchProducts). One endpoint, typed resolvers.", { s: 9, o: 0.8 });
  return svg(760, 132, g);
}

const SPECS = { java_m4_t2: m4_t2, java_m19_t4: m19_t4, java_m22_t5: m22_t5, java_m27_t2: m27_t2 };

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  let n = 0;
  for (const [topicId, fn] of Object.entries(SPECS)) {
    const s = fn();
    const r = await T.updateOne({ topicId, "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": s } });
    console.log((r.matchedCount ? "✅" : "✗") + ` ${topicId} (${s.length}b)`);
    if (r.matchedCount) n++;
  }
  console.log(`— ${n} set.`);
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });

/**
 * seedProVisualAidShapes.js — re-author the visual_aids whose description calls
 * for a specific LITERAL shape the generic panels couldn't express:
 *
 *   • STATE MACHINE (boxes + labeled transition arrows, incl. back-edges):
 *       m19_t1, m15_t4 (circuit breaker CLOSED↔OPEN↔HALF-OPEN),
 *       m10_t1 (thread lifecycle), m24_t3 (saga steps + compensation)
 *   • CURVE GRAPH (curves plotted on X/Y axes):
 *       m29_t1 (six Big-O growth curves), m25_t4 (load/stress/soak),
 *       m3_t5 (String O(N²) vs StringBuilder O(N))
 *   • VENN (overlapping/nested circles):
 *       m9_t3 (bounded type params: Number ∩ Comparable)
 *
 * Overwrites teaching.visual_aid.svg for those topics. Idempotent.
 * Usage: node config/seedProVisualAidShapes.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.13)", "rgba(255,159,10,0.14)", "rgba(191,90,242,0.11)", "rgba(255,69,58,0.12)"];
const STRK = ["rgba(10,132,255,0.55)", "rgba(48,209,88,0.55)", "rgba(255,159,10,0.65)", "rgba(191,90,242,0.55)", "rgba(255,69,58,0.6)"];
const PLOT = ["#0a84ff", "#1f9f4a", "#ff9f0a", "#bf5af2", "#ff453a", "#5e5ce6"];
const ARR = "rgba(140,140,148,0.9)";
const RED = "rgba(255,69,58,0.85)";

const svg = (w, h, inner) =>
  `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
  + `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${ARR}"/></marker>`
  + `<marker id="ahr" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${RED}"/></marker></defs>${inner}</svg>`;

const TITLE = (cx, t) => `<text x="${cx}" y="14" text-anchor="middle" font-size="12" font-weight="700" opacity="0.85">${esc(t)}</text>`;
// state box: title + optional small subtitle
const SB = (cx, cy, w, h, t, sub, ci = 0) =>
  `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="10" fill="${TINT[ci]}" stroke="${STRK[ci]}" stroke-width="1.5"/>`
  + `<text x="${cx}" y="${cy + (sub ? -2 : 4)}" text-anchor="middle" font-size="12" font-weight="700">${esc(t)}</text>`
  + (sub ? `<text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="8.5" opacity="0.7">${esc(sub)}</text>` : "");
// straight transition arrow + label
const A = (x1, y1, x2, y2, l, dy = -3, red = false) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${red ? RED : ARR}"${red ? ' stroke-dasharray="4 3"' : ""} marker-end="url(#${red ? "ahr" : "ah"})"/>`
  + (l ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + dy}" text-anchor="middle" font-size="8.5" font-weight="600" opacity="${red ? 0.85 : 0.8}"${red ? ` fill="${RED}"` : ""}>${esc(l)}</text>` : "");
// curved transition arrow (quadratic) + label at apex
const CA = (x1, y1, x2, y2, qx, qy, l, red = false) =>
  `<path d="M${x1},${y1} Q${qx},${qy} ${x2},${y2}" fill="none" stroke="${red ? RED : ARR}"${red ? ' stroke-dasharray="4 3"' : ""} marker-end="url(#${red ? "ahr" : "ah"})"/>`
  + (l ? `<text x="${qx}" y="${qy + 1}" text-anchor="middle" font-size="8.5" font-weight="600" opacity="${red ? 0.9 : 0.8}"${red ? ` fill="${RED}"` : ""}>${esc(l)}</text>` : "");
// plain axes (origin bottom-left)
const AXES = (ox, oy, pw, ph) =>
  `<line x1="${ox}" y1="${oy}" x2="${ox + pw}" y2="${oy}" stroke="${ARR}" marker-end="url(#ah)"/>`
  + `<line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - ph}" stroke="${ARR}" marker-end="url(#ah)"/>`;
const POLY = (pts, c, dash = false) => `<polyline points="${pts}" fill="none" stroke="${c}" stroke-width="2"${dash ? ' stroke-dasharray="4 3"' : ""}/>`;
const L2 = (v) => Math.log(v) / Math.log(2);
// sample fn(x) for x in [0,1] → pixel points; y is fraction of plot height (0..1, clipped)
const curvePts = (ox, oy, pw, ph, fn, n = 44) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const x = i / n; const y = Math.min(1.02, Math.max(0, fn(x))); out.push(`${(ox + x * pw).toFixed(1)},${(oy - y * ph).toFixed(1)}`); }
  return out.join(" ");
};

// ─────────────────────────── STATE MACHINES ───────────────────────────

// m19_t1 / m15_t4 — circuit breaker: CLOSED → OPEN → HALF-OPEN → CLOSED (+ HALF-OPEN → OPEN)
function circuitBreaker() {
  let g = TITLE(380, "Circuit breaker — state machine");
  // CLOSED (top-left), OPEN (top-right), HALF-OPEN (bottom-center)
  g += SB(150, 64, 200, 50, "CLOSED", "business as usual", 1);
  g += SB(610, 64, 200, 50, "OPEN", "fast fail · 0ms fallback", 4);
  g += SB(380, 196, 210, 50, "HALF-OPEN", "probe: 3 test calls", 2);
  // CLOSED → OPEN
  g += A(250, 58, 510, 58, "failure rate ≥ 50%", -6);
  // OPEN → HALF-OPEN  (curve down-left)
  g += CA(560, 88, 470, 178, 540, 150, "after wait 30s");
  // HALF-OPEN → CLOSED (recovered) — curve up-left
  g += CA(290, 188, 165, 89, 200, 150, "3 tests pass");
  // HALF-OPEN → OPEN (still broken)
  g += CA(485, 188, 600, 89, 580, 165, "any test fails", true);
  // sliding-window note under CLOSED
  g += `<text x="150" y="104" text-anchor="middle" font-size="8" opacity="0.6">window: 6 fail / 4 ok</text>`;
  return svg(760, 232, g);
}

// m10_t1 — thread lifecycle state machine
function threadLifecycle() {
  let g = TITLE(380, "Thread lifecycle");
  g += SB(95, 56, 130, 42, "NEW", null, 3);
  g += SB(320, 56, 150, 42, "RUNNABLE", null, 0);
  g += SB(660, 56, 160, 42, "TERMINATED", null, 1);
  g += SB(175, 192, 150, 42, "BLOCKED", "lock wait", 2);
  g += SB(380, 192, 150, 42, "WAITING", "wait()/join()", 2);
  g += SB(600, 192, 168, 42, "TIMED_WAITING", "sleep(t)", 2);
  // forward path
  g += A(160, 56, 245, 56, "start()", -6);
  g += A(395, 56, 580, 56, "run() ends", -6);
  // RUNNABLE ↔ BLOCKED
  g += CA(285, 74, 200, 171, 220, 135, "monitor");
  g += CA(215, 171, 300, 74, 295, 140, "acquired", false);
  // RUNNABLE ↔ WAITING
  g += A(345, 77, 372, 171, "wait()", 12);
  g += A(400, 171, 360, 77, "notify()", -14);
  // RUNNABLE ↔ TIMED_WAITING
  g += CA(360, 74, 575, 171, 510, 120, "sleep(ms)");
  g += CA(620, 171, 380, 76, 470, 150, "timeout", false);
  return svg(760, 230, g);
}

// m24_t3 — saga: forward steps (top) with red compensation lane (bottom) right→left
function saga() {
  let g = TITLE(380, "Saga — forward steps + compensation rollback");
  const xs = [110, 300, 490, 680], cy = 60, half = 75, bot = cy + 22, lane = 150;
  const names = ["Order", "Inventory", "Payment", "Notify"];
  names.forEach((n, i) => { g += SB(xs[i], cy, 150, 44, `STEP ${i + 1}`, n, 0); });
  // forward "ok" arrows between boxes
  for (let i = 0; i < 3; i++) g += A(xs[i] + half, cy, xs[i + 1] - half, cy, "ok →", -6);
  // each box drops a red stub into the compensation lane
  for (let i = 0; i < 4; i++) g += `<line x1="${xs[i]}" y1="${bot}" x2="${xs[i]}" y2="${lane}" stroke="${RED}" stroke-dasharray="3 3"/>`;
  // single red lane flowing right → left = rollback order
  g += A(xs[3], lane, xs[0], lane, null, 0, true);
  g += `<text x="395" y="143" text-anchor="middle" font-size="9" font-weight="600" fill="${RED}">on failure → compensate each completed step, right → left</text>`;
  return svg(760, 174, g);
}

// ─────────────────────────── CURVE GRAPHS ───────────────────────────

// m29_t1 — six Big-O growth curves + legend
function bigO() {
  const ox = 48, oy = 214, pw = 350, ph = 176;
  let g = TITLE(225, "Big-O growth: operations vs input size n");
  g += AXES(ox, oy, pw, ph);
  g += `<text x="${ox + pw}" y="${oy + 14}" text-anchor="end" font-size="8.5" opacity="0.65">n →</text>`;
  g += `<text x="${ox - 4}" y="${oy - ph - 4}" text-anchor="middle" font-size="8.5" opacity="0.65">ops</text>`;
  const curves = [
    { lab: "O(2ⁿ)", ex: "All Subsets", c: PLOT[4], fn: (x) => 0.05 + Math.min(1.05, (Math.pow(2, x * 7) - 1) / Math.pow(2, 6.1)) },
    { lab: "O(n²)", ex: "Bubble Sort", c: PLOT[3], fn: (x) => 0.05 + 0.97 * x * x },
    { lab: "O(n log n)", ex: "Merge Sort", c: PLOT[2], fn: (x) => 0.05 + 0.6 * (x * L2(x * 99 + 1)) / L2(100) },
    { lab: "O(n)", ex: "Linear Search", c: PLOT[1], fn: (x) => 0.05 + 0.5 * x },
    { lab: "O(log n)", ex: "Binary Search", c: PLOT[0], fn: (x) => 0.05 + 0.2 * L2(x * 99 + 1) / L2(100) },
    { lab: "O(1)", ex: "HashMap.get()", c: PLOT[5], fn: () => 0.05 },
  ];
  curves.forEach((cv) => { g += POLY(curvePts(ox, oy, pw, ph, cv.fn), cv.c); });
  // legend (right)
  const lx = 430; let ly = 44;
  curves.forEach((cv) => {
    g += `<line x1="${lx}" y1="${ly}" x2="${lx + 18}" y2="${ly}" stroke="${cv.c}" stroke-width="2.5"/>`;
    g += `<text x="${lx + 24}" y="${ly + 3.5}" font-size="10" font-weight="700">${esc(cv.lab)}</text>`;
    g += `<text x="${lx + 24}" y="${ly + 15}" font-size="8.5" opacity="0.65">${esc(cv.ex)}</text>`;
    ly += 28;
  });
  g += `<text x="380" y="232" text-anchor="middle" font-size="9" opacity="0.75">At n=100: O(n²)=10,000 ops  vs  O(n log n)=664 ops</text>`;
  return svg(760, 246, g);
}

// generic single mini-chart for the load/stress/soak trio
function miniChart(ox, baseY, pw, ph, title, polys, caption) {
  let g = `<text x="${ox + pw / 2}" y="${baseY - ph - 10}" text-anchor="middle" font-size="11" font-weight="700">${esc(title)}</text>`;
  g += AXES(ox, baseY, pw, ph);
  polys.forEach((p) => { g += POLY(p.pts, p.c, p.dash); });
  if (caption) g += `<text x="${ox + pw / 2}" y="${baseY + 16}" text-anchor="middle" font-size="8.5" opacity="0.7">${esc(caption)}</text>`;
  return g;
}

// m25_t4 — load / stress / soak
function perfTests() {
  let g = TITLE(380, "Load · Stress · Soak — p99 over time");
  const ph = 112, baseY = 178, pw = 200;
  // Load: ramp to plateau, flat p99
  g += miniChart(40, baseY, pw, ph, "Load test", [
    { pts: curvePts(40, baseY, pw, ph, (x) => (x < 0.25 ? 0.1 + x / 0.25 * 0.62 : 0.72), 40), c: PLOT[0] },
  ], "ramp → flat · p99 stable");
  // Stress: staircase then explosion
  const stress = (x) => x < 0.25 ? 0.22 : x < 0.45 ? 0.4 : x < 0.65 ? 0.58 : 0.58 + (x - 0.65) / 0.35 * 0.44;
  g += miniChart(285, baseY, pw, ph, "Stress test", [
    { pts: curvePts(285, baseY, pw, ph, stress, 48), c: PLOT[3] },
    { pts: curvePts(285, baseY, pw, ph, (x) => x < 0.7 ? 0.04 : 0.04 + (x - 0.7) / 0.3 * 0.6, 48), c: PLOT[4], dash: true },
  ], "staircase → breaking point");
  g += `<text x="455" y="78" font-size="8" fill="${RED}" opacity="0.85">errors↑</text>`;
  // Soak: slow creeping rise (leak)
  g += miniChart(530, baseY, pw, ph, "Soak test", [
    { pts: curvePts(530, baseY, pw, ph, (x) => 0.4 + 0.45 * x, 40), c: PLOT[2] },
  ], "flat load · p99 creeps = leak");
  return svg(760, 210, g);
}

// m3_t5 — String O(N²) vs StringBuilder O(N)
function stringPerf() {
  const ox = 60, oy = 196, pw = 420, ph = 150;
  let g = TITLE(310, "Time vs N — concat in a loop");
  g += AXES(ox, oy, pw, ph);
  g += `<text x="${ox + pw}" y="${oy + 14}" text-anchor="end" font-size="9" opacity="0.65">N →</text>`;
  g += `<text x="${ox - 6}" y="${oy - ph - 2}" text-anchor="middle" font-size="9" opacity="0.65">time</text>`;
  g += POLY(curvePts(ox, oy, pw, ph, (x) => 0.05 + 0.92 * x * x), PLOT[4]); // String quadratic
  g += POLY(curvePts(ox, oy, pw, ph, (x) => 0.05 + 0.3 * x), PLOT[1]);       // StringBuilder linear
  // legend
  g += `<line x1="${ox + 250}" y1="60" x2="${ox + 270}" y2="60" stroke="${PLOT[4]}" stroke-width="2.5"/><text x="${ox + 276}" y="63.5" font-size="10" font-weight="700">String + : O(N²)</text>`;
  g += `<line x1="${ox + 250}" y1="80" x2="${ox + 270}" y2="80" stroke="${PLOT[1]}" stroke-width="2.5"/><text x="${ox + 276}" y="83.5" font-size="10" font-weight="700">StringBuilder: O(N)</text>`;
  g += `<text x="${ox + 360}" y="100" text-anchor="middle" font-size="8.5" opacity="0.65">each + makes a new object</text>`;
  return svg(620, 234, g);
}

// ─────────────────────────── VENN ───────────────────────────

// m9_t3 — bounded type params: Number ∩ Comparable
function boundedVenn() {
  let g = TITLE(300, "<T extends Number & Comparable<T>>");
  // universe
  g += `<rect x="22" y="30" width="556" height="232" rx="14" fill="none" stroke="${ARR}" stroke-dasharray="5 4"/>`;
  g += `<text x="36" y="50" font-size="10" font-weight="600" opacity="0.6">All reference types &lt;T&gt;</text>`;
  // circle A — extends Number (blue)
  g += `<circle cx="245" cy="150" r="112" fill="${TINT[0]}" stroke="${STRK[0]}" stroke-width="1.5"/>`;
  g += `<text x="170" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${PLOT[0]}">extends Number</text>`;
  // circle B — Comparable (green)
  g += `<circle cx="385" cy="160" r="104" fill="${TINT[1]}" stroke="${STRK[1]}" stroke-width="1.5"/>`;
  g += `<text x="470" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="${PLOT[1]}">extends Comparable&lt;T&gt;</text>`;
  // members only-Number (left)
  g += `<text x="160" y="150" text-anchor="middle" font-size="9.5" opacity="0.75">AtomicInteger</text>`;
  g += `<text x="160" y="166" text-anchor="middle" font-size="9.5" opacity="0.75">(Number, not</text>`;
  g += `<text x="160" y="180" text-anchor="middle" font-size="9.5" opacity="0.75">Comparable)</text>`;
  // members only-Comparable (right)
  g += `<text x="470" y="155" text-anchor="middle" font-size="9.5" opacity="0.75">String</text>`;
  g += `<text x="470" y="170" text-anchor="middle" font-size="9.5" opacity="0.75">LocalDate</text>`;
  // intersection — accepted set
  g += `<text x="315" y="138" text-anchor="middle" font-size="10" font-weight="700">Integer · Double</text>`;
  g += `<text x="315" y="153" text-anchor="middle" font-size="10" font-weight="700">Long · BigDecimal</text>`;
  g += `<text x="315" y="170" text-anchor="middle" font-size="8.5" opacity="0.7">✓ accepted (∩)</text>`;
  // rule note
  g += `<text x="300" y="284" text-anchor="middle" font-size="9" opacity="0.7">Multiple bounds: class first, then interfaces, joined by &amp;</text>`;
  return svg(600, 298, g);
}

const SPECS = {
  java_m19_t1: circuitBreaker(),
  java_m15_t4: circuitBreaker(),
  java_m10_t1: threadLifecycle(),
  java_m24_t3: saga(),
  java_m29_t1: bigO(),
  java_m25_t4: perfTests(),
  java_m3_t5: stringPerf(),
  java_m9_t3: boundedVenn(),
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  let n = 0, missing = 0;
  for (const [topicId, s] of Object.entries(SPECS)) {
    if (!/^<svg/.test(s)) { console.error(`✗ ${topicId}: bad svg`); continue; }
    const r = await T.updateOne({ topicId, "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": s } });
    if (r.matchedCount === 0) { console.error(`✗ ${topicId}: missing`); missing++; } else { n++; }
  }
  console.log(`✅ shape visual_aids: ${n} set${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });

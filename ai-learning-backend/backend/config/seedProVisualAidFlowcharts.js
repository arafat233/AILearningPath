/**
 * seedProVisualAidFlowcharts.js — re-author the visual_aids whose description
 * calls for a FLOWCHART with diamond decision boxes (not rectangle panels).
 * Diamonds = decisions, rounded rects = actions, arrows carry yes/no labels.
 * Overwrites teaching.visual_aid.svg for those topics. Idempotent.
 *
 * Covers: m1_t4 (if/else/switch), m1_t5 (for/while/do-while loops),
 * m30_t5 + m30_5_t5 + m5_t5 (decision cascades).
 *
 * Usage: node config/seedProVisualAidFlowcharts.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.12)", "rgba(255,159,10,0.13)", "rgba(191,90,242,0.11)"];
const STRK = ["rgba(10,132,255,0.5)", "rgba(48,209,88,0.5)", "rgba(255,159,10,0.6)", "rgba(191,90,242,0.5)"];
const ARR = "rgba(140,140,148,0.9)";

const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
  + `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${ARR}"/></marker></defs>${inner}</svg>`;
// rounded rect (action)
const R = (cx, cy, w, h, t, ci = 0) => `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="8" fill="${TINT[ci]}" stroke="${STRK[ci]}"/><text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" font-weight="600">${esc(t)}</text>`;
// diamond (decision)
const D = (cx, cy, w, h, t, ci = 2) => `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/><text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="10" font-weight="600">${esc(t)}</text>`;
// straight arrow with optional label
const A = (x1, y1, x2, y2, l, dx = 6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ARR}" marker-end="url(#ah)"/>${l ? `<text x="${(x1 + x2) / 2 + dx}" y="${(y1 + y2) / 2 - 1}" font-size="9" font-weight="600" opacity="0.8">${esc(l)}</text>` : ""}`;
// elbow back-arrow (loop): from (x1,y1) out to xMid, up to y2, into (x2,y2)
const BACK = (x1, y1, xMid, y2, x2, l) => `<path d="M${x1},${y1} L${xMid},${y1} L${xMid},${y2} L${x2},${y2}" fill="none" stroke="${ARR}" marker-end="url(#ah)"/>${l ? `<text x="${xMid - 4}" y="${(y1 + y2) / 2}" text-anchor="end" font-size="9" opacity="0.75">${esc(l)}</text>` : ""}`;
const TITLE = (cx, t) => `<text x="${cx}" y="13" text-anchor="middle" font-size="11.5" font-weight="700" opacity="0.85">${esc(t)}</text>`;

// ── m1_t4 — if/else, else-if chain, switch ──
function ifElseSwitch() {
  let g = "";
  // Column 1: if / else (xA=125)
  g += TITLE(125, "if / else");
  g += D(125, 58, 122, 44, "condition?");
  g += A(96, 74, 70, 108, "true", -8) + A(154, 74, 182, 108, "false");
  g += R(70, 124, 86, 30, "then", 0) + R(182, 124, 86, 30, "else", 3);
  // Column 2: else-if chain (left diamonds at x=320, run boxes at x=458)
  g += TITLE(380, "else-if chain");
  g += D(320, 54, 110, 38, "cond 1?") + A(375, 54, 415, 54, "T") + R(458, 54, 80, 28, "do A", 0);
  g += A(320, 73, 320, 100, "F");
  g += D(320, 120, 110, 38, "cond 2?") + A(375, 120, 415, 120, "T") + R(458, 120, 80, 28, "do B", 0);
  g += A(320, 139, 320, 166, "F");
  g += R(320, 184, 116, 30, "else (default)", 3);
  // Column 3: switch (xC=635)
  g += TITLE(635, "switch (value)");
  g += R(635, 50, 120, 28, "switch (x)", 1);
  g += A(635, 64, 567, 100) + A(635, 64, 635, 100) + A(635, 64, 703, 100);
  g += R(567, 116, 62, 28, "case A", 0) + R(635, 116, 62, 28, "case B", 0) + R(703, 116, 62, 28, "case C", 0);
  g += A(635, 130, 635, 162) + R(635, 180, 120, 28, "default", 3);
  return svg(760, 214, g);
}

// ── m1_t5 — for / while / do-while loop flowcharts ──
function loops() {
  let g = "";
  // for (xA=120): init → cond? →(true) body → update → back to cond; (false)→done
  g += TITLE(120, "for");
  g += R(120, 38, 92, 26, "init", 1) + A(120, 51, 120, 76);
  g += D(120, 100, 104, 42, "cond?") + A(174, 100, 214, 100, "false") + `<text x="218" y="104" font-size="10" opacity="0.7">done</text>`;
  g += A(120, 121, 120, 150, "true");
  g += R(120, 168, 92, 26, "body", 0) + A(120, 181, 120, 206);
  g += R(120, 224, 92, 26, "update", 1);
  g += BACK(74, 224, 38, 100, 68, "loop");
  // while (xB=400): cond? →(true) body → back; (false)→done
  g += TITLE(400, "while");
  g += D(400, 70, 104, 42, "cond?") + A(454, 70, 494, 70, "false") + `<text x="498" y="74" font-size="10" opacity="0.7">done</text>`;
  g += A(400, 91, 400, 122, "true");
  g += R(400, 140, 92, 26, "body", 0);
  g += BACK(354, 140, 320, 70, 348, "loop");
  // do-while (xC=660): body → cond? →(true) back to body; (false)→done  (runs ≥ once)
  g += TITLE(660, "do-while");
  g += R(660, 44, 92, 26, "body", 0) + A(660, 57, 660, 86);
  g += D(660, 110, 104, 42, "cond?") + A(714, 110, 748, 110, "F");
  g += BACK(606, 110, 572, 44, 614, "true");
  g += `<text x="572" y="170" font-size="10" opacity="0.7">runs at least once</text>`;
  return svg(760, 262, g);
}

// ── decision cascade: diamonds (no↓ to next, yes→outcome) ──
function cascade(title, rows) {
  const top = 28, step = 56, dx = 195, rx = 470;
  let g = `<text x="14" y="14" font-size="11.5" font-weight="700" opacity="0.85">${esc(title)}</text>`;
  rows.forEach((r, i) => {
    const cy = top + i * step;
    g += D(dx, cy, 200, 40, r.q) + A(dx + 100, cy, rx - 92, cy, "yes") + R(rx, cy, 200, 32, r.ans, 0);
    if (i < rows.length - 1) g += A(dx, cy + 20, dx, cy + step - 20, "no");
  });
  return svg(760, top + rows.length * step, g);
}

const SPECS = {
  java_m1_t4: ifElseSwitch(),
  java_m1_t5: loops(),
  java_m30_t5: cascade("Which array pattern?", [
    { q: "pair / triplet?", ans: "Two Pointers" },
    { q: "contiguous subarray?", ans: "Sliding Window" },
    { q: "range-sum query?", ans: "Prefix Sum" },
    { q: "3 value categories?", ans: "Dutch National Flag" },
    { q: "max running sum?", ans: "Kadane's" },
  ]),
  java_m30_5_t5: cascade("Which 2D-grid technique?", [
    { q: "shortest path?", ans: "BFS" },
    { q: "connected component?", ans: "DFS / flood fill" },
    { q: "min cost over all paths?", ans: "Grid DP" },
    { q: "grid is sorted?", ans: "Binary Search" },
    { q: "just visit in order?", ans: "Traversal" },
  ]),
  java_m5_t5: cascade("Comparable or Comparator?", [
    { q: "one obvious natural order?", ans: "Comparable (compareTo)" },
    { q: "multiple / flexible orders?", ans: "Comparator (external)" },
    { q: "need both?", ans: "Comparable + Comparators" },
  ]),
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
  console.log(`✅ flowchart visual_aids: ${n} set${missing ? `, ${missing} missing` : ""}.`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });

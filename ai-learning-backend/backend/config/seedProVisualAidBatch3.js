/**
 * seedProVisualAidBatch3.js — faithful, per-topic diagrams for the audit
 * MISMATCHES (briefs that describe a specific shape but currently render as
 * text-in-boxes / prose). Each function is authored from THAT topic's brief —
 * no generic stamping. Idempotent; sets teaching.visual_aid.svg.
 *
 * Run: node config/seedProVisualAidBatch3.js [topicId ...]   (no args = all)
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// tints: 0 blue 1 green 2 orange 3 purple 4 red 5 gray
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.13)", "rgba(255,159,10,0.14)", "rgba(191,90,242,0.11)", "rgba(255,69,58,0.13)", "rgba(142,142,147,0.13)"];
const STRK = ["rgba(10,132,255,0.5)", "rgba(48,209,88,0.55)", "rgba(255,159,10,0.6)", "rgba(191,90,242,0.5)", "rgba(255,69,58,0.55)", "rgba(142,142,147,0.5)"];
const ARR = "rgba(140,140,148,0.95)", RED = "rgba(255,69,58,0.9)", GRN = "rgba(40,170,80,0.95)";
const FG = { g: "rgba(40,170,80,0.95)", r: "rgba(255,69,58,0.9)" };

const svg = (w, h, inner) =>
  `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
  + `<defs>`
  + `<marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${ARR}"/></marker>`
  + `<marker id="ahr" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${RED}"/></marker>`
  + `<marker id="ahg" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${GRN}"/></marker>`
  + `</defs>${inner}</svg>`;

const box = (x, y, w, h, ci, rx = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`;
const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" font-weight="${o.w || 400}" text-anchor="${o.a || "start"}" opacity="${o.o ?? 1}"${o.fill ? ` fill="${o.fill}"` : ""}${o.mono ? ' font-family="ui-monospace,Menlo,monospace"' : ""}>${esc(t)}</text>`;
const arr = (x1, y1, x2, y2, k = "", l) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${k === "r" ? RED : k === "g" ? GRN : ARR}"${k === "d" ? ' stroke-dasharray="4 3"' : ""} marker-end="url(#${k === "r" ? "ahr" : k === "g" ? "ahg" : "ah"})"/>` + (l ? txt((x1 + x2) / 2, (y1 + y2) / 2 - 3, l, { a: "middle", s: 9, o: 0.8 }) : "");
const title = (x, t) => txt(x, 15, t, { w: 700, s: 12.5, o: 0.88 });
// a labeled value cell
const vcell = (x, y, w, h, val, ci, o = {}) => box(x, y, w, h, ci) + txt(x + w / 2, y + h / 2 + 4, val, { a: "middle", mono: true, s: o.s || 12, w: o.w || 700, fill: o.fill });

// ── m2_t5 — factorial(4) call stack vs iterative ──
function m2_t5() {
  let g = title(14, "Call stack — factorial(4)");
  const frames = [
    ["factorial(0)", "base case → returns 1", 1],
    ["factorial(1)", "↳ 1 × 1 = 1", 0],
    ["factorial(2)", "↳ 2 × 1 = 2", 0],
    ["factorial(3)", "↳ 3 × 2 = 6", 0],
    ["factorial(4)", "↳ 4 × 6 = 24", 0],
  ];
  const x = 40, w = 210, h = 34, top = 36, step = 40;
  frames.forEach(([nm, ret, ci], i) => {
    const y = top + i * step;
    g += box(x, y, w, h, ci) + txt(x + 12, y + 21, nm, { mono: true, s: 11.5, w: 700 });
    g += txt(x + w + 12, y + 21, ret, { s: 10, fill: i === 0 ? GRN : undefined, o: i === 0 ? 1 : 0.8 });
    if (i > 0) g += arr(x + w + 150, y + 6, x + w + 150, y - step + 28, "g"); // value bubbles up
  });
  g += txt(40, top + 5 * step + 6, "↑ frames called top-to-bottom (4→0), then pop bottom-up as each returns", { s: 9.5, o: 0.7 });
  g += txt(40, top + 5 * step + 22, "deeper recursion = more stack frames = O(n) stack space", { s: 9.5, o: 0.7 });
  // iterative (right)
  g += txt(470, 36, "Iterative — no stack growth", { w: 700, s: 11, fill: GRN });
  g += box(470, 46, 260, 96, 1);
  g += txt(484, 70, "long r = 1;", { mono: true, s: 10.5 });
  g += txt(484, 90, "for (int i = 2; i <= 4; i++)", { mono: true, s: 10.5 });
  g += txt(496, 108, "r *= i;", { mono: true, s: 10.5 });
  g += txt(484, 130, "r → 24", { mono: true, s: 11, w: 700, fill: GRN });
  g += txt(470, 162, "one frame · O(1) space", { s: 9.5, o: 0.7 });
  return svg(760, 232, g);
}

// ── m3_t1 — array of 5 boxes, indices, OOB, iteration styles ──
function m3_t1() {
  let g = title(14, "int[] scores — zero-indexed");
  const vals = [85, 90, 78, 92, 88];
  const x0 = 40, w = 92, h = 44, y = 44;
  vals.forEach((v, i) => {
    const x = x0 + i * (w + 6);
    g += txt(x + w / 2, y - 8, `scores[${i}]`, { a: "middle", s: 9.5, o: 0.65, mono: true });
    g += vcell(x, y, w, h, String(v), 0);
    g += txt(x + w / 2, y + h + 16, `index ${i}`, { a: "middle", s: 9.5, o: 0.7 });
  });
  g += txt(40, 132, "Zero-indexed: first element is index 0, last is length − 1 = 4.", { s: 10.5, o: 0.85 });
  // OOB panel
  g += box(40, 146, 320, 40, 4);
  g += txt(54, 171, "scores[5]  ✗  ArrayIndexOutOfBoundsException", { mono: true, s: 10.5, fill: RED, w: 600 });
  // iteration styles
  g += box(380, 146, 350, 40, 5);
  g += txt(394, 164, "for (int i=0; i<scores.length; i++)  scores[i]", { mono: true, s: 9.5 });
  g += txt(394, 179, "for (int s : scores)  // for-each, read-only", { mono: true, s: 9.5, o: 0.8 });
  return svg(760, 200, g);
}

// ── m3_t2 — linear vs binary search + two-pointer reversal ──
function m3_t2() {
  let g = title(14, "Linear vs Binary search");
  // LEFT linear
  g += txt(30, 36, "Linear — find 17 (checks each, O(n))", { s: 10.5, w: 600 });
  const lin = [[5, "r"], [12, "r"], [3, "r"], [8, "r"], [17, "g"], [22, "5"]];
  lin.forEach(([v, k], i) => {
    const x = 30 + i * 54;
    g += vcell(x, 48, 48, 36, String(v), k === "g" ? 1 : k === "r" ? 4 : 5, { s: 11 });
    g += txt(x + 24, 98, k === "g" ? "✓" : k === "r" ? "✗" : "", { a: "middle", s: 12, fill: k === "g" ? GRN : RED, w: 700 });
  });
  // RIGHT binary
  g += txt(400, 36, "Binary — sorted, halves each step, O(log n)", { s: 10.5, w: 600 });
  const bin = [3, 5, 8, 12, 17, 22];
  bin.forEach((v, i) => {
    const x = 400 + i * 54;
    const hit = v === 17, mid = v === 12;
    g += vcell(x, 48, 48, 36, String(v), hit ? 1 : mid ? 2 : 5, { s: 11 });
    if (mid) g += txt(x + 24, 98, "mid → low, go right", { a: "middle", s: 8.5, o: 0.7 });
    if (hit) g += txt(x + 24, 98, "mid ✓", { a: "middle", s: 9, fill: GRN, w: 700 });
  });
  g += txt(400, 112, "[17,22] → mid 17 = match", { s: 9, o: 0.7 });
  g += txt(30, 130, "Binary requires sorted input; linear does not.", { s: 9.5, o: 0.7 });
  // two-pointer reversal
  g += txt(30, 158, "Two-pointer reversal — swap ends, move inward", { s: 10.5, w: 600 });
  const rev = [1, 2, 3, 4, 5];
  rev.forEach((v, i) => {
    const x = 30 + i * 54;
    g += vcell(x, 170, 48, 36, String(v), 0, { s: 11 });
  });
  g += txt(30 + 24, 220, "L", { a: "middle", s: 11, w: 700, fill: GRN });
  g += txt(30 + 4 * 54 + 24, 220, "R", { a: "middle", s: 11, w: 700, fill: GRN });
  g += arr(54, 226, 30 + 1 * 54, 226, "g") + arr(30 + 4 * 54, 226, 30 + 3 * 54 + 24, 226, "g");
  g += txt(360, 192, "swap(L,R), then L++  R−−  until they meet", { s: 9.5, o: 0.75 });
  return svg(760, 238, g);
}

// ── m3_t3 — 3×4 grid + row-major / column-major traversal ──
function m3_t3() {
  let g = title(14, "2-D array  grid[row][col]");
  const ox = 110, oy = 46, cw = 60, ch = 38;
  for (let c = 0; c < 4; c++) g += txt(ox + c * cw + cw / 2, oy - 8, `Col ${c}`, { a: "middle", s: 9, o: 0.6 });
  for (let r = 0; r < 3; r++) {
    g += txt(ox - 12, oy + r * ch + ch / 2 + 4, `Row ${r}`, { a: "end", s: 9, o: 0.6 });
    for (let c = 0; c < 4; c++) g += vcell(ox + c * cw, oy + r * ch, cw - 4, ch - 4, String(r * 4 + c + 1), 0, { s: 11 });
  }
  g += txt(ox + 4 * cw + 18, oy + 18, "grid[row][col]", { mono: true, s: 11, w: 700 });
  g += txt(ox + 4 * cw + 18, oy + 36, "row first, then column", { s: 9.5, o: 0.7 });
  // traversals
  const drawMini = (gx, label, order, colMajor) => {
    let s = txt(gx, 188, label, { s: 10, w: 600 });
    const mw = 26, mh = 20, my = 196;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      s += box(gx + c * mw, my + r * mh, mw - 3, mh - 3, 5, 4) + txt(gx + c * mw + (mw - 3) / 2, my + r * mh + 14, String(r * 4 + c + 1), { a: "middle", s: 8, o: 0.7 });
    }
    // arrow path
    if (!colMajor) for (let r = 0; r < 3; r++) s += arr(gx + 2, my + r * mh + 8, gx + 3 * mw + 8, my + r * mh + 8, "g");
    else for (let c = 0; c < 4; c++) s += arr(gx + c * mw + 11, my + 2, gx + c * mw + 11, my + 2 * mh + 14, "g");
    s += txt(gx, my + 3 * mh + 14, order, { s: 8.5, o: 0.7, mono: true });
    return s;
  };
  g += drawMini(40, "Row-major (left→right, top→bottom)", "1,2,3,4,5,6,7…", false);
  g += drawMini(410, "Column-major (top→bottom, left→right)", "1,5,9,2,6,10…", true);
  return svg(760, 268, g);
}

// UML-style class box: header bar + field/method lines
const uml = (x, y, w, h, header, lines, ci) =>
  box(x, y, w, h, ci) + `<line x1="${x}" y1="${y + 22}" x2="${x + w}" y2="${y + 22}" stroke="${STRK[ci]}"/>`
  + txt(x + w / 2, y + 15, header, { a: "middle", w: 700, s: 11 })
  + lines.map((l, i) => txt(x + 10, y + 38 + i * 15, l, { s: 9.5, mono: true, o: 0.85 })).join("");

// ── m4_t5 — static (class-level) vs instance memory ──
function m4_t5() {
  let g = title(14, "Static (class-level) vs instance memory");
  g += uml(30, 42, 220, 110, "Product (class)", ["static int count = 3", "  ↑ ONE shared counter", "static final", "  MAX_PRICE = 99999"], 1);
  const inst = [["p1", "id=101", "Mouse"], ["p2", "id=102", "Keyboard"], ["p3", "id=103", "Monitor"]];
  inst.forEach((o, i) => {
    const y = 44 + i * 40;
    g += box(440, y, 250, 34, 0) + txt(454, y + 21, `${o[0]}   ${o[1]}   name=${o[2]}`, { mono: true, s: 10.5 });
    g += arr(438, y + 17, 254, 80); // each object → the one shared counter
  });
  g += txt(255, 76, "← all 3 share", { s: 8.5, o: 0.6 });
  g += txt(30, 176, "Product.getCount()  → called on the CLASS          p1.getPrice()  → called on an OBJECT", { s: 10, o: 0.8 });
  return svg(760, 196, g);
}

// ── m4_t6 — composition UML + module-4 concept stack ──
function m4_t6() {
  let g = title(14, "Composition — has-a relationships (UML)");
  g += uml(60, 40, 150, 58, "Customer", ["id, name"], 0);
  g += uml(300, 40, 180, 74, "Order", ["customer", "items : LineItem[]", "total()"], 3);
  g += uml(300, 162, 180, 64, "LineItem", ["qty", "product"], 2);
  g += uml(560, 162, 150, 58, "Product", ["name, price"], 1);
  g += arr(300, 76, 212, 76) + txt(216, 72, "1  has-a", { s: 9, o: 0.8 });
  g += arr(390, 114, 390, 162) + txt(396, 142, "1..*  has-many", { s: 9, o: 0.8 });
  g += arr(480, 192, 560, 192) + txt(498, 186, "1  has-a", { s: 9, o: 0.8 });
  g += txt(20, 256, "builds up:", { s: 9.5, w: 600, o: 0.75 });
  const cs = ["4.1 Class", "4.2 Ctor", "4.3 Encap", "4.4 Methods", "4.5 Static", "4.6 Compose"];
  let x = 88; cs.forEach((c, i) => { g += box(x, 244, 96, 22, 5, 5) + txt(x + 48, 259, c, { a: "middle", s: 8.5 }); if (i < cs.length - 1) g += arr(x + 96, 255, x + 104, 255); x += 104; });
  return svg(760, 282, g);
}

// ── m5_t3 — abstract class hierarchy + Template Method ──
function m5_t3() {
  let g = title(14, "Abstract class + Template Method");
  g += uml(60, 40, 190, 54, "abstract Shape", ["area()       ← abstract", "printInfo()   concrete"], 3);
  g += uml(30, 152, 150, 46, "Circle", ["area() ✓"], 1);
  g += uml(210, 152, 150, 46, "Rectangle", ["area() ✓"], 1);
  g += arr(140, 94, 105, 152) + arr(180, 94, 285, 152);
  g += txt(30, 218, "✗ new Shape()      ✓ new Circle()", { s: 9.5, fill: RED, w: 600 });
  g += txt(30, 234, "printInfo() calls area() → runs the subclass's version", { s: 9, o: 0.7 });
  g += txt(410, 36, "Template Method — parent defines WHEN, child defines HOW", { s: 9.5, w: 600 });
  g += uml(440, 46, 250, 76, "abstract Pipeline", ["process() {", "  read(); validate();", "  transform(); }"], 0);
  g += uml(410, 152, 140, 46, "CsvPipeline", ["steps ✓"], 1);
  g += uml(570, 152, 140, 46, "JsonPipeline", ["steps ✓"], 1);
  g += arr(520, 122, 480, 152) + arr(610, 122, 640, 152);
  return svg(760, 250, g);
}

// ── m5_t4 — abstract class vs interface + multi-interface + compareTo ──
function m5_t4() {
  let g = title(14, "Abstract class vs Interface");
  g += box(30, 38, 340, 110, 3) + txt(200, 56, "abstract class", { a: "middle", w: 700, s: 11 });
  ["✓ state (fields)", "✓ constructors", "✓ concrete + abstract methods", "extends ONE"].forEach((l, i) => g += txt(48, 80 + i * 17, l, { s: 10 }));
  g += box(390, 38, 340, 110, 0) + txt(560, 56, "interface", { a: "middle", w: 700, s: 11 });
  [["✗ no instance fields", 1], ["✗ no constructors", 1], ["abstract by default (+ default)", 0], ["implements MANY", 0]].forEach(([l, red], i) => g += txt(408, 80 + i * 17, l, { s: 10, fill: red ? RED : undefined }));
  // Employee extends one + implements many
  g += uml(40, 168, 150, 40, "Employee", ["extends AbstractEmployee"], 3);
  ["Comparable", "Serializable", "Loggable"].forEach((n, i) => {
    const x = 250 + i * 165;
    g += box(x, 174, 150, 28, 1, 14) + txt(x + 75, 192, n, { a: "middle", s: 10, w: 600 });
    g += arr(190, 188, x - 4, 188, "", i === 0 ? "implements" : "");
  });
  // compareTo contract
  g += txt(40, 236, "compareTo() contract:", { s: 10, w: 600 });
  [["negative", "this comes first", 4], ["zero", "equal", 5], ["positive", "this comes second", 1]].forEach(([k, v, ci], i) => {
    const x = 210 + i * 180;
    g += box(x, 224, 170, 30, ci) + txt(x + 10, 243, `${k} → ${v}`, { s: 9.5, mono: true });
  });
  return svg(760, 268, g);
}

const SPECS = {
  java_m2_t5: m2_t5, java_m3_t1: m3_t1, java_m3_t2: m3_t2, java_m3_t3: m3_t3,
  java_m4_t5: m4_t5, java_m4_t6: m4_t6, java_m5_t3: m5_t3, java_m5_t4: m5_t4,
};

async function run() {
  const only = process.argv.slice(2);
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  let n = 0;
  for (const [topicId, fn] of Object.entries(SPECS)) {
    if (only.length && !only.includes(topicId)) continue;
    const s = fn();
    if (!/^<svg/.test(s)) { console.error(`✗ ${topicId}: bad svg`); continue; }
    const r = await T.updateOne({ topicId, "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": s } });
    console.log((r.matchedCount ? "✅" : "✗") + ` ${topicId} (${s.length}b)`);
    if (r.matchedCount) n++;
  }
  console.log(`— ${n} set.`);
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });

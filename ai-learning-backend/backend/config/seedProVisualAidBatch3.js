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

// diamond (decision)
const D = (cx, cy, w, h, t, ci = 2) => `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>` + txt(cx, cy + 3.5, t, { a: "middle", s: 9, w: 600 });
// horizontal bar (for O(n) vs O(1))
const bar = (x, y, w, h, ci, lbl) => box(x, y, w, h, ci, 4) + txt(x + w + 8, y + h / 2 + 4, lbl, { s: 9, o: 0.8 });

// ── m6_t1 — manual array vs ArrayList + resize + hierarchy ──
function m6_t1() {
  let g = title(14, "ArrayList — dynamic array over a backing array");
  g += txt(30, 36, "Manual array (painful)", { s: 10, w: 600 });
  ["85", "90", "78", "∅", "∅"].forEach((v, i) => g += vcell(30 + i * 58, 44, 52, 32, v, i > 2 ? 4 : 5, { s: 11 }));
  g += txt(30, 92, "count = 3 (you track it) · fixed size · null slots", { s: 9, fill: RED, o: 0.85 });
  g += txt(420, 36, "ArrayList (clean)", { s: 10, w: 600, fill: GRN });
  ["85", "90", "78"].forEach((v, i) => g += vcell(420 + i * 58, 44, 52, 32, v, 1, { s: 11 }));
  g += txt(420, 92, "size() = 3 · grows itself · add(95) auto-boxes int→Integer", { s: 9, o: 0.8 });
  // resize
  g += txt(30, 118, "backing array doubles when full:", { s: 9.5, o: 0.8 });
  g += txt(250, 118, "4 → 8 → 16 …", { mono: true, s: 10, w: 700, fill: GRN });
  // hierarchy
  const hb = (x, y, t, ci) => box(x, y, 124, 26, ci) + txt(x + 62, y + 17, t, { a: "middle", s: 10, w: 600 });
  g += hb(40, 150, "Iterable", 5) + arr(164, 163, 196, 163);
  g += hb(196, 150, "Collection", 5) + arr(320, 163, 352, 163);
  g += hb(352, 150, "List", 0) + arr(476, 163, 508, 163);
  g += hb(508, 150, "ArrayList", 1);
  g += arr(400, 176, 360, 200) + arr(420, 176, 520, 200);
  g += hb(300, 202, "LinkedList", 5) + hb(470, 202, "Vector", 5);
  g += txt(40, 248, 'List<String> names = new ArrayList<>()   // interface reference → implementation', { mono: true, s: 9.5, o: 0.75 });
  return svg(760, 264, g);
}

// ── m6_t2 — HashMap buckets + hashing + O(n) vs O(1) ──
function m6_t2() {
  let g = title(14, "HashMap — buckets + hashCode()");
  g += txt(30, 40, "buckets[]", { s: 10, w: 600 });
  for (let i = 0; i < 8; i++) g += vcell(30 + i * 42, 48, 38, 30, String(i), i === 3 ? 0 : 5, { s: 10, w: 500 });
  g += box(30, 110, 110, 30, 1) + txt(85, 130, '"Mouse"', { a: "middle", mono: true, s: 10.5 });
  g += arr(140, 125, 200, 125) + box(200, 110, 150, 30, 2) + txt(275, 130, "hashCode() % 8 = 3", { a: "middle", mono: true, s: 9.5 });
  g += arr(160, 110, 156, 80, "g"); // into bucket 3
  g += txt(120, 100, "→ bucket 3 (chain on collision)", { s: 9, o: 0.7 });
  // perf
  g += txt(440, 40, "lookup cost (n = 1000)", { s: 10, w: 600 });
  g += bar(440, 52, 250, 18, 4, "ArrayList.contains() — O(n) ≈ 500 cmp");
  g += bar(440, 78, 16, 18, 1, "HashMap.get() — O(1) ≈ 1 jump");
  g += txt(440, 130, "patterns: frequency count · grouping · lookup table", { s: 9.5, o: 0.75 });
  return svg(760, 156, g);
}

// ── m6_t3 — Collections triangle + perf bars + set-operation Venns ──
function m6_t3() {
  let g = title(14, "Set & the Collections triangle");
  const tb = (x, t, sub, ci) => box(x, 36, 200, 50, ci) + txt(x + 100, 56, t, { a: "middle", w: 700, s: 11 }) + txt(x + 100, 74, sub, { a: "middle", s: 9, o: 0.7 });
  g += tb(30, "List", "ordered · duplicates", 0);
  g += tb(280, "Map", "key → value", 3);
  g += tb(530, "Set", "unique · O(1) lookup", 1);
  g += txt(380, 104, "together cover ~90% of data-structure needs · HashSet is backed by a HashMap (dummy values)", { a: "middle", s: 9, o: 0.7 });
  // perf bars
  g += bar(30, 120, 300, 16, 4, "List.contains() — O(n)");
  g += bar(30, 144, 14, 16, 1, "Set.contains() — O(1)");
  // venns
  const vn = (cx, lbl, mode) => {
    let s = `<circle cx="${cx - 14}" cy="210" r="26" fill="${mode === "diff" ? TINT[0] : TINT[0]}" stroke="${STRK[0]}"/>`;
    s += `<circle cx="${cx + 14}" cy="210" r="26" fill="${mode === "diff" ? "none" : TINT[1]}" stroke="${STRK[1]}"/>`;
    if (mode === "inter") s += txt(cx, 214, "∩", { a: "middle", s: 14, w: 700 });
    if (mode === "diff") s += txt(cx - 18, 214, "A−B", { a: "middle", s: 9, w: 700 });
    s += txt(cx, 252, lbl, { a: "middle", s: 9.5, w: 600 });
    return s;
  };
  g += vn(120, "Union (all)", "union") + vn(380, "Intersection", "inter") + vn(640, "Difference", "diff");
  return svg(760, 268, g);
}

// ── m6_t4 — iterator state machine + utilities toolbox + stream pipeline ──
function m6_t4() {
  let g = title(14, "Iterating: iterator loop · utilities · streams");
  // iterator loop
  g += txt(30, 38, "Iterator", { s: 10, w: 600 });
  g += D(110, 70, 110, 40, "hasNext?") + arr(165, 70, 230, 70, "", "yes");
  g += box(230, 56, 90, 28, 0) + txt(275, 74, "next()", { a: "middle", mono: true, s: 10 });
  g += arr(320, 70, 360, 70) + box(360, 56, 110, 28, 1) + txt(415, 74, "[remove()]", { a: "middle", mono: true, s: 9.5 });
  g += `<path d="M415,84 L415,118 L110,118 L110,92" fill="none" stroke="${ARR}" marker-end="url(#ah)"/>` + txt(260, 132, "loop", { a: "middle", s: 9, o: 0.7 });
  g += txt(30, 150, "for-each = same loop, but no safe remove()", { s: 9, o: 0.7 });
  // toolbox
  g += txt(490, 38, "Collections toolbox", { s: 10, w: 600 });
  [["Sort", "sort, reverse"], ["Extremes", "min, max"], ["Counts", "frequency"], ["Protect", "unmodifiable*"]].forEach(([h, m], i) => {
    const x = 490 + (i % 2) * 130, y = 48 + Math.floor(i / 2) * 40;
    g += box(x, y, 122, 34, 5) + txt(x + 8, y + 15, h, { s: 9.5, w: 700 }) + txt(x + 8, y + 28, m, { s: 8.5, o: 0.7, mono: true });
  });
  // stream pipeline
  g += txt(30, 176, "Stream pipeline", { s: 10, w: 600 });
  ["list", "filter", "map", "collect"].forEach((s, i) => {
    const x = 130 + i * 130;
    g += box(x, 164, 100, 26, i === 0 ? 5 : i === 3 ? 1 : 0) + txt(x + 50, 181, s, { a: "middle", mono: true, s: 10 });
    if (i < 3) g += arr(x + 100, 177, x + 130, 177);
  });
  return svg(760, 202, g);
}

// ── m7_t1 — try/catch/finally control flow + Throwable hierarchy ──
function m7_t1() {
  let g = title(14, "try / catch / finally — control flow");
  const col = (x, head, rows) => {
    let s = txt(x + 70, 36, head, { a: "middle", s: 10, w: 600 });
    rows.forEach((r, i) => { const y = 46 + i * 34; s += box(x, y, 140, 26, r[1]) + txt(x + 70, y + 17, r[0], { a: "middle", s: 9.5 }); if (i < rows.length - 1) s += arr(x + 70, y + 26, x + 70, y + 32); });
    return s;
  };
  g += col(30, "no exception", [["try ✓ runs fully", 1], ["catch skipped", 5], ["finally", 2], ["continue", 1]]);
  g += col(300, "caught", [["try ✗ (jumps)", 0], ["catch handles", 3], ["finally", 2], ["continue", 1]]);
  g += col(570, "uncaught", [["try ✗ (jumps)", 0], ["finally still runs", 2], ["program crashes", 4]]);
  // hierarchy
  g += txt(30, 200, "Throwable", { s: 10, w: 700 });
  g += arr(60, 206, 120, 224) + arr(70, 206, 320, 224);
  g += box(120, 226, 180, 26, 4) + txt(210, 243, "Error (don't catch)", { a: "middle", s: 9.5 });
  g += box(320, 226, 200, 26, 0) + txt(420, 243, "Exception (handle these)", { a: "middle", s: 9.5 });
  g += txt(540, 243, "stack trace: read bottom-up ↑ to find YOUR code", { s: 9, o: 0.7 });
  return svg(760, 264, g);
}

// ── m7_t3 — exception hierarchy + custom-vs-builtin decision flowchart ──
function m7_t3() {
  let g = title(14, "Custom exceptions — hierarchy + when to create");
  // hierarchy (left)
  g += box(40, 40, 220, 28, 0) + txt(150, 58, "PaymentException (checked)", { a: "middle", s: 9.5, w: 600 });
  g += arr(90, 68, 70, 96) + arr(210, 68, 230, 96);
  g += box(20, 98, 150, 28, 3) + txt(95, 116, "CardDeclined", { a: "middle", s: 9.5 });
  g += box(180, 98, 160, 28, 3) + txt(260, 116, "PaymentTimeout", { a: "middle", s: 9.5 });
  g += txt(40, 150, "catch order: specific first, base last", { s: 9, o: 0.7 });
  g += txt(40, 168, "fields final · ctors (msg) & (msg, cause)", { s: 9, o: 0.7 });
  // decision flowchart (right)
  g += txt(410, 36, "Custom or built-in?", { s: 10, w: 600 });
  g += D(520, 70, 200, 40, "catch it by name?") + arr(620, 70, 690, 70, "g", "yes") + box(690, 58, 60, 26, 1) + txt(720, 75, "custom", { a: "middle", s: 9 });
  g += arr(520, 90, 520, 110, "", "no");
  g += D(520, 130, 200, 40, "carries domain data?") + arr(620, 130, 690, 130, "g", "yes") + box(690, 118, 60, 26, 1) + txt(720, 135, "custom", { a: "middle", s: 9 });
  g += arr(520, 150, 520, 170, "", "no");
  g += D(520, 190, 200, 40, "programmer error?") + arr(620, 190, 660, 190, "", "yes") + box(660, 176, 96, 28, 2) + txt(708, 193, "IllegalArg", { a: "middle", s: 9 });
  g += arr(520, 210, 520, 232, "", "else") + box(440, 232, 160, 26, 5) + txt(520, 249, "RuntimeException", { a: "middle", s: 9 });
  return svg(760, 268, g);
}

// ── m7_t4 — fail fast/slow + defensive copy + validate gate ──
function m7_t4() {
  let g = title(14, "Defensive programming");
  // fail fast vs slow
  g += txt(30, 38, "Fail slow", { s: 10, w: 600, fill: RED });
  for (let i = 0; i < 4; i++) g += box(30, 46 + i * 22, 120, 18, 5, 4) + txt(36, 59 + i * 22, `m${i + 1}() …`, { mono: true, s: 8.5, o: 0.7 });
  g += txt(30, 152, "NPE 4 calls deep, no clue", { s: 8.5, fill: RED });
  g += txt(190, 38, "Fail fast", { s: 10, w: 600, fill: GRN });
  g += box(190, 46, 130, 20, 1, 4) + txt(196, 60, "entry()", { mono: true, s: 8.5 });
  g += txt(190, 80, "✗ NPE at the gate", { s: 8.5, fill: GRN }) + txt(190, 94, 'with clear message', { s: 8.5, o: 0.7 });
  // defensive copy
  g += txt(360, 38, "Defensive copy", { s: 10, w: 600 });
  g += box(360, 46, 120, 24, 4) + txt(366, 62, "WRONG", { s: 8.5, w: 700, fill: RED });
  g += txt(360, 84, "caller list ──┐", { mono: true, s: 8.5, o: 0.8 });
  g += txt(360, 98, "field = items ┘ same box", { mono: true, s: 8.5, o: 0.8 });
  g += box(560, 46, 180, 24, 1) + txt(566, 62, "CORRECT", { s: 8.5, w: 700, fill: GRN });
  g += txt(560, 84, "field = new ArrayList<>(items)", { mono: true, s: 8.5, o: 0.85 });
  g += txt(560, 98, "→ two independent boxes", { mono: true, s: 8.5, o: 0.7 });
  // validate gate
  g += txt(30, 134, "Guard clauses + validation boundary", { s: 10, w: 600 });
  g += box(30, 144, 150, 30, 4) + txt(105, 163, "external input", { a: "middle", s: 9 });
  g += arr(180, 159, 230, 159) + box(230, 144, 150, 30, 2) + txt(305, 163, "VALIDATE HERE", { a: "middle", s: 9, w: 700 });
  g += arr(380, 159, 430, 159) + box(430, 144, 150, 30, 1) + txt(505, 163, "internal logic (trusted)", { a: "middle", s: 8.5 });
  g += txt(30, 192, "guard clauses: return early on bad input → flat code, no nested-if pyramid", { s: 9, o: 0.7 });
  return svg(760, 208, g);
}

// circle node (thread/worker)
const circ = (cx, cy, r, t, ci) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>` + txt(cx, cy + 3, t, { a: "middle", s: 8.5, w: 600 });

// ── m9_t4 — wildcards / PECS ──
function m9_t4() {
  let g = title(14, "Wildcards — PECS (Producer Extends, Consumer Super)");
  g += txt(30, 38, "Invariant: List<Integer>, List<Number>, List<Object> are UNRELATED", { s: 10, w: 600 });
  ["List<Integer>", "List<Number>", "List<Object>"].forEach((t, i) => g += box(30 + i * 175, 46, 165, 28, 5) + txt(30 + i * 175 + 82, 64, t, { a: "middle", mono: true, s: 10 }));
  g += txt(560, 64, "✗ no subtyping", { s: 9, fill: RED });
  // extends
  g += box(30, 92, 350, 96, 0) + txt(45, 110, "? extends Number  → PRODUCER", { s: 10, w: 700, fill: "#0a84ff" });
  g += txt(45, 128, "accepts List<Integer|Double|Long|Number>", { mono: true, s: 9, o: 0.8 });
  g += arr(45, 150, 200, 150, "g", "READ as Number (data OUT)");
  g += txt(45, 178, "✗ cannot add() — compiler blocks writes", { s: 9, fill: RED });
  // super
  g += box(390, 92, 340, 96, 1) + txt(405, 110, "? super Integer  → CONSUMER", { s: 10, w: 700, fill: GRN });
  g += txt(405, 128, "accepts List<Integer|Number|Object>", { mono: true, s: 9, o: 0.8 });
  g += arr(560, 150, 405, 150, "g", "add Integer (data IN)");
  g += txt(405, 178, "reading gives back only Object", { s: 9, o: 0.7 });
  g += txt(30, 210, "PECS: data flows OUT → extends · data flows IN → super", { s: 10, w: 700 });
  return svg(760, 226, g);
}

// ── m9_t5 — generic interface patterns + Spring Data chain ──
function m9_t5() {
  let g = title(14, "Generic interfaces — reusable patterns");
  const pats = [["Repository<T,ID>", "save/find/delete", "+ default exists()"], ["Mapper<S,T>", "mapTo / mapFrom", "+ mapAllTo()"], ["Strategy<T>", "apply() + name()", "swap algorithms"], ["Builder<T>", "build()", "fluent construction"]];
  pats.forEach(([h, a, b], i) => {
    const x = 24 + i * 184;
    g += box(x, 40, 174, 70, i % 4) + txt(x + 87, 60, h, { a: "middle", mono: true, s: 10, w: 700 });
    g += txt(x + 12, 80, a, { mono: true, s: 9, o: 0.85 }) + txt(x + 12, 96, b, { s: 8.5, o: 0.65 });
  });
  g += txt(30, 142, "Spring Data hierarchy you now understand:", { s: 10, w: 600 });
  const ch = (x, t) => box(x, 152, 180, 28, 3) + txt(x + 90, 170, t, { a: "middle", mono: true, s: 9.5 });
  g += ch(40, "CrudRepository<T,ID>") + arr(220, 166, 252, 166);
  g += ch(252, "JpaRepository<T,ID>") + arr(432, 166, 464, 166);
  g += ch(464, "UserRepository") + txt(560, 196, "extends → inherits all CRUD", { s: 9, o: 0.7 });
  return svg(760, 206, g);
}

// ── m10_t3 — ExecutorService thread pool factory ──
function m10_t3() {
  let g = title(14, "ExecutorService — thread pool");
  g += txt(40, 38, "task queue", { s: 9.5, o: 0.7, a: "middle" });
  ["task A", "task B", "task C"].forEach((t, i) => g += box(20, 46 + i * 34, 110, 26, 2) + txt(75, 63 + i * 34, t, { a: "middle", mono: true, s: 9.5 }));
  g += arr(132, 86, 180, 86);
  g += txt(250, 38, "worker pool (N threads)", { s: 9.5, o: 0.7, a: "middle" });
  [0, 1, 2].forEach((i) => g += circ(220 + i * 70, 86, 28, "T" + (i + 1), 0));
  g += arr(360, 86, 410, 86) + txt(385, 78, "→", { a: "middle", s: 9, o: 0 });
  g += txt(520, 38, "Future<T> results", { s: 9.5, o: 0.7, a: "middle" });
  [0, 1, 2].forEach((i) => g += `<circle cx="${500 + i * 80}" cy="86" r="26" fill="${TINT[1]}" stroke="${STRK[1]}"/>` + txt(500 + i * 80, 89, "Fut" + (i + 1), { a: "middle", s: 8.5, w: 600 }));
  g += txt(440, 134, "Future.get() blocks the caller until its bubble fills with a result", { s: 9, o: 0.75 });
  g += txt(40, 132, "threads pull → run → return → pull again", { s: 9, o: 0.7 });
  g += txt(20, 168, "shutdown(): stop intake, finish the queue     shutdownNow(): cancel queued + interrupt running", { s: 9.5, o: 0.8 });
  return svg(760, 188, g);
}

// ── m11_t1 — NIO Path decomposition + Files toolbox ──
function m11_t1() {
  let g = title(14, "NIO — Path & Files");
  g += box(250, 36, 260, 30, 0) + txt(380, 56, 'Path.of("data/orders.csv")', { a: "middle", mono: true, s: 10.5, w: 600 });
  const lab = (x, y, m, r) => { g += arr(380, 66, x, y); g += txt(x, y + 14, m, { a: "middle", mono: true, s: 9, w: 600 }) + txt(x, y + 28, r, { a: "middle", s: 8.5, o: 0.7 }); };
  lab(150, 84, "getParent()", '→ "data"');
  lab(380, 92, "getFileName()", '→ "orders.csv"');
  lab(620, 84, 'resolve("backup")', '→ "data/backup"');
  g += txt(30, 142, "Files toolbox:", { s: 10, w: 600 });
  ["readAllLines", "writeString", "copy", "move", "walk", "exists"].forEach((t, i) => g += box(140 + i * 100, 130, 94, 24, 5, 5) + txt(187 + i * 100, 147, t, { a: "middle", mono: true, s: 8.5 }));
  g += txt(30, 178, "StandardOpenOption: CREATE · APPEND · TRUNCATE   |   new Path replaces old File API", { s: 9.5, o: 0.75 });
  return svg(760, 196, g);
}

// ── m11_t2 — decorator stream stack ──
function m11_t2() {
  let g = title(14, "Buffered I/O — the decorator stack");
  // nested boxes (read side)
  g += box(120, 50, 380, 90, 0) + txt(132, 44, "BufferedReader — 8 KB buffer, readLine()", { s: 9, w: 600, fill: "#0a84ff" });
  g += box(150, 70, 320, 56, 3) + txt(162, 66, "InputStreamReader — bytes → chars (encoding)", { s: 9, w: 600, fill: "#a44bd6" });
  g += box(180, 90, 260, 30, 5) + txt(310, 110, "FileInputStream — raw bytes", { a: "middle", s: 9.5, mono: true });
  g += arr(30, 105, 118, 105, "", "") + txt(30, 96, "raw bytes", { s: 8.5, o: 0.7 });
  g += arr(502, 105, 600, 105, "g") + txt(606, 108, "String line", { s: 9.5, w: 600, fill: GRN });
  g += txt(120, 162, "Output mirrors it: String → PrintWriter → BufferedWriter → OutputStreamWriter → FileOutputStream", { s: 9, o: 0.75 });
  g += txt(120, 182, "3 sources to wrap: file · socket.getInputStream() · System.in", { s: 9, o: 0.75 });
  return svg(760, 200, g);
}

// ── m11_t3 — CSV state machine + Jackson + pipeline ──
function m11_t3() {
  let g = title(14, "CSV parsing & Jackson");
  // state machine
  g += txt(30, 38, "CSV parse — 2 modes", { s: 10, w: 600 });
  g += box(30, 46, 120, 32, 0) + txt(90, 66, "NORMAL", { a: "middle", s: 10, w: 700 });
  g += box(230, 46, 120, 32, 2) + txt(290, 66, "QUOTED", { a: "middle", s: 10, w: 700 });
  g += arr(150, 56, 230, 56, "", 'on "') + arr(230, 70, 150, 70, "", 'on "');
  g += txt(30, 96, '"Dell, 27",18999  →  2 fields (comma inside quotes is literal)', { mono: true, s: 9, o: 0.8 });
  // jackson
  g += txt(420, 38, "Jackson ObjectMapper", { s: 10, w: 600 });
  g += box(420, 46, 100, 30, 1) + txt(470, 66, "JSON", { a: "middle", mono: true, s: 10 });
  g += arr(520, 55, 580, 55, "", "readValue") + arr(580, 68, 520, 68, "", "writeValue");
  g += box(580, 46, 120, 30, 0) + txt(640, 66, "POJO", { a: "middle", mono: true, s: 10 });
  // pipeline
  g += txt(30, 128, "Transform pipeline:", { s: 10, w: 600 });
  ["CSV file", "BufferedReader", "parseCSVLine", "ObjectNode", "ArrayNode", "JSON file"].forEach((s, i) => {
    const x = 30 + i * 122;
    g += box(x, 138, 112, 26, i === 0 ? 5 : i === 5 ? 1 : 0) + txt(x + 56, 155, s, { a: "middle", mono: true, s: 8.5 });
    if (i < 5) g += arr(x + 112, 151, x + 122, 151);
  });
  return svg(760, 180, g);
}

// ── m11_t4 — HttpClient request/response lifecycle ──
function m11_t4() {
  let g = title(14, "HttpClient — request / response lifecycle");
  g += box(20, 40, 110, 30, 0) + txt(75, 60, "client code", { a: "middle", s: 9.5 });
  g += arr(130, 55, 175, 55, "", "send()");
  g += box(175, 40, 120, 30, 3) + txt(235, 60, "HttpClient", { a: "middle", s: 9.5, w: 600 });
  g += arr(295, 55, 360, 55, "", "network");
  g += box(360, 40, 100, 30, 5) + txt(410, 60, "server", { a: "middle", s: 9.5 });
  // request / response boxes
  g += box(20, 86, 340, 58, 0) + txt(32, 102, "Request:  GET/POST · URI · headers · body", { s: 9, w: 600 });
  g += txt(32, 120, ".uri() → .GET()/.POST() → .header() → .timeout() → .build()", { mono: true, s: 8.5, o: 0.8 });
  g += box(380, 86, 350, 58, 1) + txt(392, 102, "Response:  statusCode · headers · body (JSON)", { s: 9, w: 600 });
  g += txt(392, 120, "response.body() → mapper.readValue() → Java object", { mono: true, s: 8.5, o: 0.8 });
  // status ranges
  ["2xx success", "4xx client error", "5xx server error"].forEach((t, i) => g += box(20 + i * 175, 156, 165, 26, [1, 2, 4][i]) + txt(20 + i * 175 + 82, 173, t, { a: "middle", s: 9.5, w: 600 }));
  return svg(760, 196, g);
}

// ── m12_t1 — JUnit lifecycle timeline + AAA + report ──
function m12_t1() {
  let g = title(14, "JUnit 5 — test lifecycle");
  g += box(30, 40, 130, 28, 0) + txt(95, 58, "@BeforeAll (once)", { a: "middle", s: 9 });
  g += arr(160, 54, 190, 54);
  // per-test group
  g += `<rect x="192" y="34" width="380" height="40" rx="8" fill="none" stroke="${STRK[5]}" stroke-dasharray="4 3"/>`;
  g += txt(382, 30, "for each @Test", { a: "middle", s: 8.5, o: 0.6 });
  ["@BeforeEach", "@Test", "@AfterEach"].forEach((t, i) => { const x = 200 + i * 122; g += box(x, 40, 112, 28, [0, 1, 2][i]) + txt(x + 56, 58, t, { a: "middle", s: 9 }); if (i < 2) g += arr(x + 112, 54, x + 122, 54); });
  g += arr(572, 54, 602, 54) + box(602, 40, 130, 28, 2) + txt(667, 58, "@AfterAll (once)", { a: "middle", s: 9 });
  // AAA
  g += txt(30, 100, "Arrange-Act-Assert:", { s: 10, w: 600 });
  ["Arrange (setup)", "Act (call method)", "Assert (verify)"].forEach((t, i) => g += box(180 + i * 185, 88, 175, 24, [0, 1, 2][i]) + txt(180 + i * 185 + 87, 105, t, { a: "middle", s: 9 }));
  // report
  g += txt(30, 140, "report:  ✓ pass   ✓ pass   ✗ fail (assertion message)", { s: 9.5 });
  g += txt(30, 162, "layout: src/main/java  mirrored by  src/test/java", { s: 9, o: 0.7 });
  return svg(760, 178, g);
}

// ── m12_t4 — testing I/O: @TempDir, mock HttpClient, string surrogates ──
function m12_t4() {
  let g = title(14, "Testing I/O & HTTP without the real thing");
  g += txt(30, 38, "@TempDir lifecycle", { s: 10, w: 600 });
  ["create temp dir", "@BeforeEach", "@Test writes/reads", "@AfterEach", "auto-delete (even on fail)"].forEach((t, i) => { const x = 30 + i * 142; g += box(x, 46, 132, 26, i === 4 ? 1 : 0) + txt(x + 66, 63, t, { a: "middle", s: 8 }); if (i < 4) g += arr(x + 132, 59, x + 142, 59); });
  g += txt(30, 96, "Mock HttpClient", { s: 10, w: 600 });
  g += box(30, 104, 150, 26, 3) + txt(105, 121, "when(client.send())", { a: "middle", mono: true, s: 8.5 });
  g += arr(180, 117, 220, 117, "", "returns") + box(220, 104, 200, 26, 1) + txt(320, 121, "mock 200 + JSON body", { a: "middle", s: 8.5 });
  g += arr(420, 117, 460, 117) + box(460, 104, 150, 26, 0) + txt(535, 121, "ApiClient parses", { a: "middle", s: 8.5 });
  g += txt(30, 152, "String surrogates: String→StringReader→BufferedReader (in) · PrintWriter→StringWriter→String (out) — no filesystem", { s: 9, o: 0.75 });
  return svg(760, 172, g);
}

// ── m12_t5 — TDD red/green/refactor cycle ──
function m12_t5() {
  let g = title(14, "TDD — Red · Green · Refactor");
  const C = (cx, cy, t, sub, ci) => `<circle cx="${cx}" cy="${cy}" r="42" fill="${TINT[ci]}" stroke="${STRK[ci]}" stroke-width="1.5"/>` + txt(cx, cy - 2, t, { a: "middle", s: 12, w: 700 }) + txt(cx, cy + 14, sub, { a: "middle", s: 8, o: 0.7 });
  g += C(170, 80, "RED", "test fails", 4);
  g += C(330, 170, "GREEN", "min code", 1);
  g += C(170, 170, "REFACTOR", "improve", 0);
  g += arr(205, 100, 300, 150, "", "write min code");
  g += arr(288, 178, 215, 178, "", "improve");
  g += arr(160, 132, 168, 122, "", "next test");
  g += txt(250, 128, "repeat 2–5 min", { a: "middle", s: 8.5, o: 0.6 });
  g += txt(430, 70, "RED:  @Test discount_qty10()  // no impl yet", { mono: true, s: 9, fill: RED });
  g += txt(430, 92, "GREEN:  double disc(int n){ return 0.10; }  // fake", { mono: true, s: 9, fill: GRN });
  g += txt(430, 114, "REFACTOR:  if(n>=50)0.20; if(n>=10)0.10; else 0", { mono: true, s: 9 });
  g += txt(430, 150, "Triangulation:", { s: 9.5, w: 600 });
  g += txt(430, 168, "1 test → fake passes", { s: 9, o: 0.75 });
  g += txt(430, 184, "2 tests → real logic forced", { s: 9, o: 0.75 });
  return svg(760, 220, g);
}

// ── m13_t1 — Spring Boot startup pipeline + DI ──
function m13_t1() {
  let g = title(14, "Spring Boot — startup & dependency injection");
  ["main()", "run()", "context", "@ComponentScan", "@Autowired", "auto-config", "Tomcat :8080"].forEach((s, i) => { const x = 24 + i * 105; g += box(x, 40, 98, 26, i === 6 ? 1 : 0) + txt(x + 49, 57, s, { a: "middle", mono: true, s: 8.5 }); if (i < 6) g += arr(x + 98, 53, x + 105, 53); });
  g += txt(30, 86, "Started in 2.3s", { s: 9, fill: GRN, w: 600 });
  // DI
  g += box(290, 110, 180, 34, 1) + txt(380, 131, "@Service OrderService", { a: "middle", s: 9.5, w: 600 });
  g += box(40, 110, 200, 30, 0) + txt(140, 130, "@Repository OrderRepo", { a: "middle", s: 9 });
  g += box(40, 152, 200, 30, 0) + txt(140, 172, "@Service EmailSvc", { a: "middle", s: 9 });
  g += arr(240, 125, 288, 125, "g", "injected") + arr(240, 167, 288, 140, "g");
  g += txt(490, 131, "Spring creates all three and wires them together", { s: 9, o: 0.75 });
  return svg(760, 198, g);
}

// ── m13_t4 — validation/exception request flow + status table ──
function m13_t4() {
  let g = title(14, "Validation & exception handling");
  g += box(20, 44, 120, 28, 0) + txt(80, 62, "request", { a: "middle", s: 9 });
  g += arr(140, 58, 175, 58) + box(175, 44, 130, 28, 0) + txt(240, 62, "@Valid body", { a: "middle", s: 9 });
  g += D(360, 58, 110, 40, "valid?");
  g += arr(415, 58, 470, 58, "g", "pass") + box(470, 44, 130, 28, 1) + txt(535, 62, "controller → 200", { a: "middle", s: 9 });
  g += arr(360, 78, 360, 104, "r", "fail");
  g += box(180, 106, 420, 28, 4) + txt(390, 124, "MethodArgumentNotValidException → @ControllerAdvice → 400 + field errors", { a: "middle", s: 8.5 });
  // status table
  g += txt(30, 162, "exception → status:", { s: 10, w: 600 });
  [["…NotValid", "400"], ["NotFound", "404"], ["Duplicate", "409"], ["BusinessRule", "422"], ["Exception", "500"]].forEach(([e, s], i) => { const x = 170 + i * 118; g += box(x, 150, 110, 26, 5) + txt(x + 8, 167, `${e} → ${s}`, { mono: true, s: 8.5 }); });
  return svg(760, 188, g);
}

// ── m14_t3 — cache hit/miss + annotation table ──
function m14_t3() {
  let g = title(14, "Spring Cache — @Cacheable");
  g += txt(30, 38, "Request 1 (cold)", { s: 9.5, w: 600 });
  ["@Cacheable", "MISS", "DB query", "store", "return"].forEach((t, i) => { const x = 30 + i * 110; g += box(x, 46, 100, 26, i === 1 ? 4 : 0) + txt(x + 50, 63, t, { a: "middle", s: 8.5 }); if (i < 4) g += arr(x + 100, 59, x + 110, 59); });
  g += txt(30, 92, "Request 2 (same key)", { s: 9.5, w: 600 });
  ["@Cacheable", "HIT", "return cached (no DB)"].forEach((t, i) => { const x = 30 + i * 150; g += box(x, 100, 140, 26, i === 1 ? 1 : 0) + txt(x + 70, 117, t, { a: "middle", s: 8.5 }); if (i < 2) g += arr(x + 140, 113, x + 150, 113); });
  g += txt(500, 117, "DB queries: 1 per N requests", { s: 9, fill: GRN });
  // annotations
  g += txt(30, 152, "annotations:", { s: 10, w: 600 });
  [["@Cacheable", "read · skip on hit"], ["@CachePut", "always run + update"], ["@CacheEvict", "remove · re-fetch next"]].forEach(([h, d], i) => { const x = 130 + i * 205; g += box(x, 140, 195, 30, [1, 2, 4][i]) + txt(x + 8, 154, h, { mono: true, s: 9, w: 700 }) + txt(x + 8, 166, d, { s: 8, o: 0.7 }); });
  return svg(760, 184, g);
}

// ── m14_t5 — actuator endpoints + health aggregation + meters ──
function m14_t5() {
  let g = title(14, "Actuator & production observability");
  g += box(30, 44, 110, 30, 3) + txt(85, 63, "Application", { a: "middle", s: 9.5, w: 600 });
  ["/health UP", "/info", "/metrics", "/loggers", "/prometheus"].forEach((t, i) => { const x = 180 + i * 112; g += box(x, 44, 104, 30, i === 0 ? 1 : 0) + txt(x + 52, 63, t, { a: "middle", mono: true, s: 8.5 }); g += arr(140, 59, x - 2, 59); });
  g += txt(180, 92, "k8s probes → /health/liveness, /readiness", { s: 8.5, o: 0.7 });
  // health aggregation
  g += txt(30, 124, "Health:", { s: 10, w: 600 });
  ["DB", "DiskSpace", "Ping", "Payment(custom)"].forEach((t, i) => g += box(90 + i * 130, 112, 122, 26, 5) + txt(90 + i * 130 + 61, 129, t, { a: "middle", s: 8.5 }));
  g += txt(620, 129, "any DOWN → DOWN", { s: 8.5, fill: RED });
  // meters
  g += txt(30, 168, "Micrometer:", { s: 10, w: 600 });
  [["Counter", "orders.placed 15234 (↑)"], ["Gauge", "orders.active 42 (now)"], ["Timer", "p50 45ms p95 120ms"]].forEach(([h, d], i) => { const x = 120 + i * 210; g += box(x, 156, 200, 26, [1, 0, 2][i]) + txt(x + 8, 173, `${h}: ${d}`, { mono: true, s: 8 }); });
  return svg(760, 196, g);
}

// linked-list node [val|next]
const llnode = (x, y, val, ci = 0) => box(x, y, 60, 28, ci) + `<line x1="${x + 40}" y1="${y}" x2="${x + 40}" y2="${y + 28}" stroke="${STRK[ci]}"/>` + txt(x + 20, y + 19, String(val), { a: "middle", mono: true, s: 11, w: 700 }) + txt(x + 50, y + 19, "•", { a: "middle", s: 13 });

// ── m31_t1 — String pool & immutability ──
function m31_t1() {
  let g = title(14, "String pool & immutability");
  g += box(250, 40, 130, 30, 1) + txt(315, 60, 'pool: "hello"', { a: "middle", mono: true, s: 10, w: 600 });
  g += box(40, 40, 90, 24, 0) + txt(85, 57, "s1", { a: "middle", s: 9 }) + arr(130, 52, 248, 52, "g");
  g += box(40, 72, 90, 24, 0) + txt(85, 89, "s2", { a: "middle", s: 9 }) + arr(130, 84, 248, 60, "g");
  g += txt(150, 50, "literals share →", { s: 8, o: 0.6 });
  g += box(450, 40, 230, 30, 4) + txt(565, 60, 'new String("hello") → separate heap obj', { a: "middle", mono: true, s: 8.5 });
  g += txt(40, 124, "s1 == s2  ✓ same reference   ·   new String → ==  ✗, use .equals() for content", { s: 9.5 });
  g += txt(40, 150, "StringBuilder: internal char[] buffer doubles when full → amortized O(1) append", { s: 9.5, o: 0.8 });
  return svg(760, 168, g);
}

// ── m31_t2 — KMP LPS array + search jump ──
function m31_t2() {
  let g = title(14, "KMP — LPS array + skip on mismatch");
  g += txt(30, 38, "LPS for pattern AABAAB:", { s: 9.5, w: 600 });
  const pat = ["A", "A", "B", "A", "A", "B"], lps = [0, 1, 0, 1, 2, 3];
  pat.forEach((c, i) => { g += vcell(40 + i * 56, 46, 50, 26, c, 0, { s: 11 }); g += txt(40 + i * 56 + 25, 90, "lps=" + lps[i], { a: "middle", s: 8.5, o: 0.7 }); });
  g += txt(30, 124, "Search text AABAABAAB: mismatch at j=5 → j = lps[4] = 2 (i stays, never re-scan text)", { s: 9.5 });
  g += txt(30, 148, "→ match found at position 3.  Time O(n + m).", { s: 9.5, fill: GRN });
  return svg(760, 164, g);
}

// ── m32_t1 — linked list basics + dummy head ──
function m32_t1() {
  let g = title(14, "Linked list — node, dummy head, insert/delete");
  g += llnode(30, 44, "dmy", 3) + arr(91, 58, 120, 58);
  ["1", "2", "3"].forEach((v, i) => { const x = 120 + i * 90; g += llnode(x, 44, v, 0); if (i < 2) g += arr(x + 61, 58, x + 90, 58); });
  g += txt(390, 58, "→ null", { s: 10, o: 0.7 });
  g += txt(30, 100, "delete node 2:  prev.next = curr.next   (skip over 2)", { mono: true, s: 9.5 });
  g += txt(30, 122, "insert after 1: newNode.next = curr.next;  curr.next = newNode", { mono: true, s: 9.5 });
  g += txt(30, 148, "dummy head removes the special-case for deleting/inserting at the front.", { s: 9, o: 0.7 });
  return svg(760, 164, g);
}

// ── m32_t3 — linked list reversal steps ──
function m32_t3() {
  let g = title(14, "Linked list reversal — prev / curr / next");
  const steps = [["Step 0", [["1", 0], ["2", 5], ["3", 5]], "prev=null curr=1"], ["Step 1", [["1", 1], ["2", 0], ["3", 5]], "1.next=null prev=1 curr=2"], ["Step 2", [["1", 1], ["2", 1], ["3", 0]], "2.next=1 prev=2 curr=3"], ["Step 3", [["1", 1], ["2", 1], ["3", 1]], "3.next=2 prev=3 → return 3"]];
  steps.forEach((s, si) => {
    const y = 40 + si * 42;
    g += txt(20, y + 19, s[0], { s: 9, w: 600 });
    s[1].forEach((n, i) => g += llnode(90 + i * 80, y, n[0], n[1]));
    g += txt(360, y + 19, s[2], { mono: true, s: 8.5, o: 0.8 });
  });
  g += txt(20, 218, "Result: 3 → 2 → 1 → null", { s: 10, w: 700, fill: GRN });
  return svg(760, 232, g);
}

// ── m32_t4 — Floyd cycle detection ──
function m32_t4() {
  let g = title(14, "Floyd's cycle detection (tortoise & hare)");
  [1, 2, 3, 4, 5].forEach((v, i) => { const x = 60 + i * 90; g += llnode(x, 50, v, i === 2 ? 2 : 0); if (i < 4) g += arr(x + 61, 64, x + 90, 64); });
  // cycle back-edge 5 -> 3
  g += `<path d="M481,78 L481,110 L240,110 L240,80" fill="none" stroke="${ARR}" marker-end="url(#ah)"/>` + txt(360, 124, "cycle: 5 → 3", { a: "middle", s: 9, o: 0.7 });
  g += txt(40, 150, "Phase 1: slow +1 / fast +2 → meet inside cycle (node 4).", { s: 9.5 });
  g += txt(40, 170, "Phase 2: reset slow to head, both +1 → meet at entry (node 3).", { s: 9.5 });
  g += txt(40, 190, "Phase 3: loop from entry → cycle length = 3.", { s: 9.5, fill: GRN });
  return svg(760, 206, g);
}

// ── m32_t5 — merge K sorted lists with min-heap ──
function m32_t5() {
  let g = title(14, "Merge K sorted lists — min-heap");
  [["[1, 4, 7]", 0], ["[2, 5, 8]", 0], ["[3, 6, 9]", 0]].forEach(([l, ci], i) => g += box(30, 42 + i * 34, 130, 26, ci) + txt(95, 59 + i * 34, l, { a: "middle", mono: true, s: 10 }));
  g += arr(160, 76, 200, 76, "", "heads");
  g += box(200, 56, 150, 40, 2) + txt(275, 72, "min-heap {1,2,3}", { a: "middle", mono: true, s: 9 }) + txt(275, 88, "extract 1, push 4", { a: "middle", s: 8, o: 0.7 });
  g += arr(350, 76, 390, 76, "g");
  g += box(390, 56, 340, 40, 1) + txt(560, 80, "output: 1 2 3 4 5 6 7 8 9", { a: "middle", mono: true, s: 11, w: 700 });
  g += txt(30, 156, "N = 9 extractions, each O(log K) → O(N log K).", { s: 9.5, o: 0.8 });
  return svg(760, 172, g);
}

// ── m33_t3 — queue FIFO + BFS level-order ──
function m33_t3() {
  let g = title(14, "Queue — FIFO + BFS level-order");
  g += txt(30, 40, "poll() ← head", { s: 9, o: 0.7 });
  ["A", "B", "C", "D"].forEach((v, i) => g += vcell(150 + i * 60, 32, 54, 30, v, 5, { s: 11 }));
  g += txt(400, 40, "tail ← offer()", { s: 9, o: 0.7 });
  g += arr(150, 80, 110, 80, "g") + txt(70, 84, "out", { s: 8.5 }) + arr(420, 80, 460, 80, "g") + txt(466, 84, "in", { s: 8.5 });
  // BFS tree
  g += txt(30, 116, "BFS level-order uses a queue:", { s: 9.5, w: 600 });
  const tn = (x, y, t) => `<circle cx="${x}" cy="${y}" r="15" fill="${TINT[0]}" stroke="${STRK[0]}"/>` + txt(x, y + 4, t, { a: "middle", s: 9, w: 600 });
  g += tn(380, 132, "1") + arr(370, 144, 320, 158) + arr(390, 144, 440, 158);
  g += tn(310, 168, "2") + tn(450, 168, "3");
  g += arr(300, 180, 270, 194) + arr(320, 180, 350, 194) + arr(440, 180, 410, 194) + arr(460, 180, 490, 194);
  ["4", "5", "6", "7"].forEach((v, i) => g += tn(260 + i * 80, 200, v));
  g += txt(560, 150, "L0: [1]", { mono: true, s: 9, o: 0.8 }) + txt(560, 168, "L1: [2,3]", { mono: true, s: 9, o: 0.8 }) + txt(560, 186, "L2: [4,5,6,7]", { mono: true, s: 9, o: 0.8 });
  return svg(760, 226, g);
}

// ── m29_t2 — merge sort recursion tree ──
function m29_t2() {
  let g = title(14, "Merge sort recursion tree → O(n log n)");
  const nd = (x, y, t, ci) => box(x - 38, y, 76, 24, ci) + txt(x, y + 16, t, { a: "middle", mono: true, s: 9 });
  g += nd(360, 34, "T(n)", 0);
  g += arr(345, 58, 270, 76) + arr(375, 58, 450, 76);
  g += nd(260, 78, "T(n/2)", 0) + nd(450, 78, "T(n/2)", 0);
  [180, 320, 390, 530].forEach((x, i) => { g += arr([260, 260, 450, 450][i] + (i % 2 ? 15 : -15), 102, x, 120); g += nd(x, 122, "T(n/4)", 0); });
  g += txt(380, 162, "… down to T(1) leaves …", { a: "middle", s: 9, o: 0.6 });
  g += txt(620, 50, "each level = n work", { s: 9, o: 0.8 });
  g += txt(620, 90, "log n levels deep", { s: 9, o: 0.8 });
  g += txt(620, 130, "n × log n", { s: 10, w: 700, fill: GRN });
  return svg(760, 180, g);
}

// ── m29_t3 — space complexity: stacks + table ──
function m29_t3() {
  let g = title(14, "Space complexity — recursion depth = stack space");
  g += txt(30, 38, "binarySearch(16): 4 frames = O(log n)", { s: 9.5, w: 600 });
  for (let i = 0; i < 4; i++) g += box(30, 46 + i * 24, 180, 20, 0) + txt(40, 60 + i * 24, `frame ${i + 1}: lo, hi, mid`, { mono: true, s: 8 });
  g += txt(300, 38, "fib(n): depth n = O(n)", { s: 9.5, w: 600, fill: RED });
  for (let i = 0; i < 6; i++) g += box(300 + i * 14, 46 + i * 14, 120, 18, 4) + txt(308 + i * 14, 59 + i * 14, `fib(${6 - i})`, { mono: true, s: 7.5 });
  // table
  g += txt(30, 158, "Algorithm                    Time            Space", { mono: true, s: 9, w: 700 });
  [["Iterative binary search", "O(log n)", "O(1)"], ["Recursive binary search", "O(log n)", "O(log n)"], ["Merge sort", "O(n log n)", "O(n)"], ["Heapsort (in-place)", "O(n log n)", "O(1)"]].forEach((r, i) => g += txt(30, 176 + i * 16, r[0].padEnd(28) + r[1].padEnd(15) + r[2], { mono: true, s: 8.5, o: 0.85 }));
  return svg(760, 256, g);
}

// ── m29_t4 — best/worst/avg table + amortized bars ──
function m29_t4() {
  let g = title(14, "Best / Worst / Average & amortized");
  g += txt(30, 38, "Algorithm        Best      Worst     Avg", { mono: true, s: 9, w: 700 });
  [["Quicksort", "n log n", "n²", "n log n"], ["Binary search", "1", "log n", "log n"], ["Linear search", "1", "n", "n"], ["HashMap get", "1", "n", "1"]].forEach((r, i) => {
    const y = 56 + i * 18;
    g += txt(30, y, r[0].padEnd(16), { mono: true, s: 8.5 });
    [r[1], r[2], r[3]].forEach((v, j) => g += txt(170 + j * 78, y, v, { mono: true, s: 8.5, fill: v === "n²" || v === "n" ? RED : (v === "1" ? GRN : undefined) }));
  });
  // amortized bars
  g += txt(420, 38, "ArrayList add() — amortized O(1)", { s: 9.5, w: 600 });
  const resize = { 2: 2, 4: 4, 8: 8, 16: 16 };
  for (let i = 1; i <= 16; i++) { const h = (resize[i] || 1) * 4; const x = 420 + (i - 1) * 18; g += box(x, 150 - h, 12, h, resize[i] ? 4 : 1, 2); }
  g += txt(420, 168, "resizes at 2,4,8,16 · total = 2n · per op = O(1)", { s: 8.5, o: 0.75 });
  return svg(760, 184, g);
}

// ── m30_t1 — two pointers inward ──
function m30_t1() {
  let g = title(14, "Two pointers — inward, O(n)");
  const a = [1, 3, 5, 7, 9, 11];
  a.forEach((v, i) => g += vcell(40 + i * 86, 50, 78, 38, String(v), i === 0 || i === 5 ? 1 : 5, { s: 12 }));
  g += txt(40 + 39, 104, "lo", { a: "middle", s: 11, w: 700, fill: GRN }) + txt(40 + 5 * 86 + 39, 104, "hi", { a: "middle", s: 11, w: 700, fill: GRN });
  g += arr(40 + 39, 112, 40 + 86 + 39, 112, "g") + arr(40 + 5 * 86 + 39, 112, 40 + 4 * 86 + 39, 112, "g");
  g += txt(30, 140, "target 12: lo(1)+hi(11)=12 → FOUND.   target 14: 12<14 → lo++; 3+11=14 → FOUND.", { s: 9, o: 0.85 });
  g += txt(30, 160, "lo and hi together cross the array once → at most n steps → O(n).", { s: 9, o: 0.7 });
  return svg(760, 176, g);
}

// helper: draw an r×c grid at (ox,oy) with valFn(r,c)->{v,ci}
const grid = (ox, oy, rows, cols, cw, ch, valFn) => {
  let s = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const o = valFn(r, c) || {}; s += vcell(ox + c * cw, oy + r * ch, cw - 4, ch - 4, o.v != null ? String(o.v) : "", o.ci ?? 5, { s: 10 }); }
  return s;
};

// ── m30_5_t1 — spiral matrix ──
function m30_5_t1() {
  let g = title(14, "Matrix spiral traversal");
  const ox = 60, oy = 44, cw = 50;
  g += grid(ox, oy, 3, 3, cw, cw, (r, c) => ({ v: r * 3 + c + 1, ci: r === 0 ? 0 : 5 }));
  // spiral arrows around outer ring
  g += arr(ox + 8, oy + 22, ox + 2 * cw + 8, oy + 22, "g", "→ top");
  g += arr(ox + 2 * cw + 22, oy + 30, ox + 2 * cw + 22, oy + 2 * cw + 8, "g");
  g += arr(ox + 2 * cw + 8, oy + 2 * cw + 22, ox + 8, oy + 2 * cw + 22, "g");
  g += arr(ox - 6, oy + 2 * cw + 8, ox - 6, oy + cw, "g");
  g += txt(ox + 3 * cw + 30, oy + 30, "→ ↓ ← ↑ then shrink:", { s: 9.5, w: 600 });
  g += txt(ox + 3 * cw + 30, oy + 50, "top++ · right-- · bottom-- · left++", { mono: true, s: 9, o: 0.8 });
  g += txt(ox + 3 * cw + 30, oy + 70, "repeat for inner ring", { s: 9, o: 0.7 });
  return svg(760, 200, g);
}

// ── m30_5_t2 — grid BFS / DFS islands ──
function m30_5_t2() {
  let g = title(14, "Grid BFS / DFS — islands & flood fill");
  const land = { "0,0": 1, "0,1": 1, "1,1": 1, "3,3": 1, "3,4": 1 };
  const ox = 40, oy = 44, cw = 36;
  g += grid(ox, oy, 4, 5, cw, cw, (r, c) => land[`${r},${c}`] ? { v: 1, ci: 1 } : { v: 0, ci: 5 });
  g += txt(ox + 5 * cw + 20, oy + 14, "BFS: ripple out level by level (queue)", { s: 9, o: 0.85 });
  g += txt(ox + 5 * cw + 20, oy + 40, "DFS: dive deep then backtrack (stack/recursion)", { s: 9, o: 0.85 });
  g += txt(ox + 5 * cw + 20, oy + 66, "visited[][] stops revisiting · count connected 1s = islands", { s: 9, o: 0.7 });
  g += txt(ox, oy + 4 * cw + 18, "two islands of 1s above", { s: 9, fill: GRN });
  return svg(760, 220, g);
}

// ── m30_5_t3 — grid DP ──
function m30_5_t3() {
  let g = title(14, "Grid DP — each cell pulls from above + left");
  const ox = 60, oy = 44, cw = 54;
  const dp = [[1, 1, 1], [1, 2, 3], [1, 3, 6]];
  g += grid(ox, oy, 3, 3, cw, cw, (r, c) => ({ v: dp[r][c], ci: r === 0 || c === 0 ? 5 : 0 }));
  // arrows into center cell (1,1) and (2,2)
  g += arr(ox + cw + 24, oy + cw - 4, ox + cw + 24, oy + cw + 8, "g") + arr(ox + cw - 4, oy + cw + 24, ox + cw + 8, oy + cw + 24, "g");
  g += txt(ox + 3 * cw + 24, oy + 24, "dp[r][c] = dp[r-1][c] + dp[r][c-1]", { mono: true, s: 9 });
  g += txt(ox + 3 * cw + 24, oy + 48, "(unique paths). Edit distance:", { s: 9, o: 0.8 });
  g += txt(ox + 3 * cw + 24, oy + 66, "min(match ↖, insert ←, delete ↑) + 1", { mono: true, s: 8.5, o: 0.75 });
  return svg(760, 200, g);
}

// ── m30_5_t4 — 2D binary search ──
function m30_5_t4() {
  let g = title(14, "2D binary search in a sorted matrix");
  g += txt(30, 38, "Pattern 1 — flatten r×c → length r·c, binary search with /c, %c", { s: 9.5, w: 600 });
  for (let i = 0; i < 12; i++) g += vcell(30 + i * 44, 46, 40, 24, String((i + 1) * 3), i === 5 ? 1 : 5, { s: 9 });
  g += txt(30, 100, "Pattern 2 — start TOP-RIGHT, eliminate a row or column each step:", { s: 9.5, w: 600 });
  const ox = 60, oy = 110, cw = 40;
  g += grid(ox, oy, 4, 4, cw, cw, (r, c) => ({ v: r * 10 + c * 3, ci: (r === 0 && c === 3) ? 2 : 5 }));
  g += txt(ox + 4 * cw + 20, oy + 24, "target < cell → ← (drop column)", { s: 9, o: 0.8 });
  g += txt(ox + 4 * cw + 20, oy + 48, "target > cell → ↓ (drop row)", { s: 9, o: 0.8 });
  g += txt(ox + 4 * cw + 20, oy + 72, "O(m + n)", { s: 10, w: 700, fill: GRN });
  return svg(760, 280, g);
}

// sparkline: pts are 0..1 fractions of height
const spark = (x, y, w, h, pts, c) => `<polyline points="${pts.map((p, i) => `${(x + i * (w / (pts.length - 1))).toFixed(1)},${(y + h - p * h).toFixed(1)}`).join(" ")}" fill="none" stroke="${c}" stroke-width="2"/>`;

// ── m20_t4 — Grafana incident dashboard (4 panels) ──
function m20_t4() {
  let g = title(14, "Grafana dashboard — incident at 7pm");
  const panel = (x, y, w, h, t) => box(x, y, w, h, 5) + txt(x + 8, y + 15, t, { s: 9, w: 600 });
  g += panel(20, 30, 350, 90, "payment rate");
  g += spark(34, 50, 250, 50, [.8, .82, .79, .81, .8, .3, .1], "#1f9f4a") + txt(300, 80, "drops 7pm", { s: 8, fill: RED });
  g += panel(390, 30, 350, 90, "p99 latency");
  g += spark(404, 50, 250, 50, [.2, .18, .22, .2, .9, .95, .8], "#ff9f0a") + txt(670, 60, "2.8s spike", { s: 8, fill: "#ff9f0a" });
  g += panel(20, 130, 350, 90, "error rate (gauge)");
  g += `<rect x="34" y="170" width="320" height="16" rx="8" fill="${TINT[4]}"/><rect x="34" y="170" width="240" height="16" rx="8" fill="${RED}"/>` + txt(34, 205, "0.2% → 15%", { s: 9, fill: RED });
  g += panel(390, 130, 350, 90, "circuit breakers");
  g += txt(404, 175, "payment-cb", { mono: true, s: 10 }) + box(540, 162, 80, 22, 4) + txt(580, 178, "OPEN", { a: "middle", s: 9, w: 700, fill: RED });
  return svg(760, 232, g);
}

// ── m22_t1 — JVM heap regions + GC pauses ──
function m22_t1() {
  let g = title(14, "JVM heap & garbage collection");
  g += box(30, 44, 300, 56, 1) + txt(180, 38, "Young gen", { a: "middle", s: 8.5, o: 0.6 }) + txt(110, 76, "Eden (new objects)", { a: "middle", s: 9.5 });
  g += box(250, 50, 70, 44, 2) + txt(285, 76, "S0 S1", { a: "middle", s: 9 });
  g += box(360, 44, 200, 56, 0) + txt(460, 76, "Old Gen (promoted)", { a: "middle", s: 9.5 });
  g += arr(110, 100, 110, 116, "", "Minor GC") + arr(330, 72, 358, 72, "", "promote") + txt(460, 116, "Major GC = STOP-THE-WORLD", { a: "middle", s: 8.5, fill: RED });
  // timeline
  g += txt(30, 150, "untuned:", { s: 9.5, w: 600 });
  [0, 1, 2].forEach(i => g += box(110 + i * 90, 134, 14, 28, 4));
  g += txt(30, 188, "G1GC tuned:", { s: 9.5, w: 600, fill: GRN });
  for (let i = 0; i < 12; i++) g += box(110 + i * 26, 178, 8, 12, 1);
  g += txt(420, 150, "tall STW pauses every ~30s", { s: 8.5, fill: RED });
  g += txt(420, 188, "many tiny incremental collections", { s: 8.5, fill: GRN });
  return svg(760, 204, g);
}

// ── m22_t2 — Seq Scan vs Index Scan ──
function m22_t2() {
  let g = title(14, "Seq Scan vs Index Scan");
  g += txt(30, 40, "Seq Scan — reads all 50M rows", { s: 10, w: 600, fill: RED });
  for (let i = 0; i < 10; i++) g += box(30 + i * 32, 48, 28, 22, i === 4 ? 1 : 4) + (i !== 4 ? `<line x1="${32 + i * 32}" y1="50" x2="${56 + i * 32}" y2="68" stroke="${RED}"/>` : "");
  g += txt(360, 64, "4.2s", { s: 11, w: 700, fill: RED });
  g += txt(30, 104, "Index Scan — B-tree jumps to matches", { s: 10, w: 600, fill: GRN });
  g += box(110, 112, 90, 26, 0) + txt(155, 129, "root", { a: "middle", s: 9 });
  g += arr(140, 138, 100, 158) + arr(170, 138, 210, 158);
  g += box(40, 158, 110, 24, 5) + txt(95, 174, "node", { a: "middle", s: 8.5 }) + box(170, 158, 110, 24, 1) + txt(225, 174, "23 rows ✓", { a: "middle", s: 8.5, fill: GRN });
  g += txt(360, 130, "0.3ms  (≈16000× faster)", { s: 11, w: 700, fill: GRN });
  return svg(760, 196, g);
}

// ── m22_t4 — L1 Caffeine + L2 Redis + hit rates ──
function m22_t4() {
  let g = title(14, "L1 + L2 cache hierarchy");
  g += box(20, 44, 80, 28, 3) + txt(60, 62, "Request", { a: "middle", s: 9 }) + arr(100, 58, 130, 58);
  [["L1 Caffeine", "30s · 1000 · 0.1ms"], ["L2 Redis", "5min · shared · 1ms"], ["DB", "5ms · source"]].forEach(([h, d], i) => { const x = 130 + i * 205; g += box(x, 44, 190, 32, [1, 0, 5][i]) + txt(x + 95, 58, h, { a: "middle", s: 9, w: 600 }) + txt(x + 95, 70, d, { a: "middle", s: 7.5, o: 0.7 }); if (i < 2) g += arr(x + 190, 60, x + 205, 60, "", "miss"); });
  g += txt(30, 100, "hit returns immediately; miss populates the level(s) above. mutex on miss → no stampede.", { s: 9, o: 0.75 });
  g += txt(30, 130, "hit rate by level:", { s: 10, w: 600 });
  [["L1 40%", .4, 1], ["L2 55%", .55, 0], ["DB 5%", .05, 4]].forEach(([l, f, ci], i) => { const y = 124 + i * 0; const x = 150 + i * 200; g += bar(x, 124, 120 * f + 16, 16, ci, l); });
  return svg(760, 156, g);
}

// ── m24_t2 — event sourcing log + replay + snapshot ──
function m24_t2() {
  let g = title(14, "Event sourcing — PAY-001 (append-only log)");
  const ev = ["PaymentInitiated(5000)", "ProcessingStarted(B123)", "BankTimeout", "PaymentFailed(timeout)"];
  ev.forEach((e, i) => { const x = 20 + i * 185; g += box(x, 44, 172, 30, 0) + txt(x + 86, 63, e, { a: "middle", mono: true, s: 8 }); if (i < 3) g += arr(x + 172, 59, x + 185, 59); });
  g += txt(20, 100, "replay events → current state:", { s: 9.5 });
  g += box(250, 88, 120, 24, 4) + txt(310, 105, "FAILED", { a: "middle", s: 9.5, w: 700, fill: RED });
  g += txt(400, 105, "temporal query: state at t=2 → PROCESSING", { s: 9, o: 0.75 });
  g += txt(20, 138, "snapshot optimization: after N events, store state so replay starts from the snapshot (not event 0)", { s: 9, o: 0.7 });
  return svg(760, 154, g);
}

// ── m25_t1 — Testcontainers vs H2 ──
function m25_t1() {
  let g = title(14, "Testcontainers — real dependencies in tests");
  g += txt(30, 38, "H2 in-memory (fake)", { s: 10, w: 600, fill: RED });
  ["Java test", "H2 DB", "✗ H2 ≠ PostgreSQL → prod bug"].forEach((t, i) => { const x = 30 + i * 165; g += box(x, 46, 155, 28, i === 2 ? 4 : 0) + txt(x + 77, 64, t, { a: "middle", s: 8.5, fill: i === 2 ? RED : undefined }); if (i < 2) g += arr(x + 155, 60, x + 165, 60); });
  g += txt(30, 96, "Testcontainers (real)", { s: 10, w: 600, fill: GRN });
  ["Java test", "Docker daemon", "PostgreSQL container", "real JDBC ✓"].forEach((t, i) => { const x = 30 + i * 178; g += box(x, 104, 168, 28, i === 3 ? 1 : 0) + txt(x + 84, 122, t, { a: "middle", s: 8.5 }); if (i < 3) g += arr(x + 168, 118, x + 178, 118); });
  g += txt(30, 152, "same version as prod · @BeforeAll start / @AfterAll stop · static @Container = reuse across tests", { s: 9, o: 0.75 });
  return svg(760, 168, g);
}

// ── m25_t2 — Pact contract testing ──
function m25_t2() {
  let g = title(14, "Contract testing with Pact");
  g += box(20, 50, 180, 50, 0) + txt(110, 70, "Consumer (Flipkart)", { a: "middle", s: 9.5, w: 600 }) + txt(110, 88, "@PactConsumerTest", { a: "middle", mono: true, s: 8 });
  g += box(560, 50, 180, 50, 1) + txt(650, 70, "Provider (Razorpay)", { a: "middle", s: 9.5, w: 600 }) + txt(650, 88, "@PactProviderTest", { a: "middle", mono: true, s: 8 });
  g += box(310, 48, 140, 54, 3) + txt(380, 68, "Pact Broker", { a: "middle", s: 9.5, w: 600 }) + txt(380, 86, "can-i-deploy?", { a: "middle", s: 8, o: 0.7 });
  g += arr(200, 66, 308, 66, "", "pact.json") + arr(560, 66, 452, 66, "", "verify");
  g += txt(30, 134, "Consumer CI → generate pact → Broker.   Provider CI → download + verify real API → Broker.", { s: 9, o: 0.8 });
  g += txt(30, 154, "breaking change → Provider CI fails BEFORE deploy (can-i-deploy = red).", { s: 9, fill: RED });
  return svg(760, 170, g);
}

// ── m25_t5 — chaos engineering cycle ──
function m25_t5() {
  let g = title(14, "Chaos engineering — experiment cycle");
  g += `<circle cx="200" cy="118" r="34" fill="${TINT[3]}" stroke="${STRK[3]}"/>` + txt(200, 114, "Spring", { a: "middle", s: 9, w: 600 }) + txt(200, 127, "app", { a: "middle", s: 9, w: 600 });
  const nodes = [[200, 44, "1 Steady state", 1], [310, 86, "2 Hypothesize", 0], [290, 168, "3 Inject ⚡", 4], [110, 168, "4 Observe", 2], [90, 86, "5 Improve", 1]];
  nodes.forEach(([x, y, t, ci]) => g += box(x - 55, y - 13, 110, 26, ci) + txt(x, y + 4, t, { a: "middle", s: 8.5, w: 600 }));
  for (let i = 0; i < 5; i++) { const a = nodes[i], b = nodes[(i + 1) % 5]; g += arr((a[0] + b[0]) / 2 - (b[0] - a[0]) * 0.2, (a[1] + b[1]) / 2 - (b[1] - a[1]) * 0.2, (a[0] + b[0]) / 2 + (b[0] - a[0]) * 0.2, (a[1] + b[1]) / 2 + (b[1] - a[1]) * 0.2); }
  g += txt(420, 70, "Chaos Monkey for Spring Boot:", { s: 9.5, w: 600 });
  g += box(420, 82, 300, 30, 5) + txt(430, 101, "@Service bean", { mono: true, s: 9 });
  g += arr(540, 97, 600, 97, "r", "inject latency / exceptions");
  g += txt(420, 140, "agent randomly adds latency or throws into method calls to test resilience.", { s: 9, o: 0.7 });
  return svg(760, 200, g);
}

// ── m15_t2 — Feign proxy generation + call lifecycle ──
function m15_t2() {
  let g = title(14, "Feign — generated proxy + call lifecycle");
  ["@FeignClient interface", "Feign reads annotations", "generates proxy", "real HTTP call"].forEach((t, i) => { const x = 24 + i * 185; g += box(x, 42, 174, 30, i === 3 ? 1 : 0) + txt(x + 87, 61, t, { a: "middle", s: 9 }); if (i < 3) g += arr(x + 174, 57, x + 185, 57); });
  g += txt(30, 92, "OrderService injects the interface and calls methods as if they were local.", { s: 9, o: 0.75 });
  // lifecycle
  ["getQuote('TCS')", "build URL", "HTTP GET", "JSON", "→ StockQuote"].forEach((t, i) => { const x = 24 + i * 148; g += box(x, 112, 138, 26, [3, 0, 0, 0, 1][i]) + txt(x + 69, 129, t, { a: "middle", mono: true, s: 8.5 }); if (i < 4) g += arr(x + 138, 125, x + 148, 125); });
  g += txt(30, 164, "error path: 404 response → ErrorDecoder → SymbolNotFoundException", { s: 9, fill: RED });
  return svg(760, 180, g);
}

// ── m16_t1 — Kafka partitions/consumer groups + REST vs Kafka ──
function m16_t1() {
  let g = title(14, "Kafka — partitions, consumer groups");
  g += box(20, 44, 90, 28, 2) + txt(65, 62, "Producer", { a: "middle", s: 9 }) + arr(110, 58, 145, 58);
  g += box(145, 36, 230, 80, 5) + txt(260, 32, "topic order-events (7-day retention)", { a: "middle", s: 8, o: 0.6 });
  ["P0", "P1", "P2"].forEach((p, i) => { g += box(155, 44 + i * 24, 210, 20, 0) + txt(165, 58 + i * 24, p + "  [0][1][2][3] offsets", { mono: true, s: 8 }); });
  g += arr(375, 70, 410, 70);
  g += box(410, 40, 150, 32, 1) + txt(485, 60, "notif-svc: 3 consumers", { a: "middle", s: 8.5 });
  g += box(410, 80, 150, 32, 3) + txt(485, 100, "analytics: 1 consumer", { a: "middle", s: 8.5 });
  // rest vs kafka
  g += txt(30, 146, "REST chain: 150+200+180 = 530ms · SMS down → order FAILS", { s: 9, fill: RED });
  g += txt(30, 166, "Kafka: 1 publish (5ms), 3 services read in parallel = 25ms · SMS down → buffered", { s: 9, fill: GRN });
  return svg(760, 184, g);
}

// ── m17_t2 — N+1 vs JOIN FETCH timeline + fix decision ──
function m17_t2() {
  let g = title(14, "The N+1 query problem");
  g += txt(30, 38, "N+1:", { s: 10, w: 600, fill: RED });
  g += box(70, 30, 60, 16, 0) + txt(100, 42, "orders", { a: "middle", s: 8 });
  for (let i = 0; i < 12; i++) g += box(140 + i * 22, 30, 18, 16, 4);
  g += txt(420, 42, "1 + N = 101 queries · 300ms", { s: 9, fill: RED });
  g += txt(30, 70, "JOIN FETCH:", { s: 10, w: 600, fill: GRN });
  g += box(120, 62, 300, 16, 1) + txt(270, 74, "SELECT o.*, u.* … JOIN", { a: "middle", mono: true, s: 8.5 });
  g += txt(430, 74, "1 query · 25ms", { s: 9, fill: GRN });
  g += txt(30, 110, "fix by relationship:", { s: 10, w: 600 });
  [["@ManyToOne", "JOIN FETCH / @EntityGraph"], ["@OneToMany small", "JOIN FETCH DISTINCT"], ["@OneToMany large", "@BatchSize"], ["many assoc.", "DTO projection"]].forEach(([a, b], i) => { const x = 30 + (i % 2) * 370, y = 122 + Math.floor(i / 2) * 30; g += box(x, y, 360, 26, 5) + txt(x + 10, y + 17, `${a} → ${b}`, { mono: true, s: 8.5 }); });
  return svg(760, 196, g);
}

// ── m17_t3 — HikariCP pool + composite index leftmost prefix ──
function m17_t3() {
  let g = title(14, "Connection pool + index optimization");
  g += txt(30, 38, "HikariCP — 10 slots", { s: 10, w: 600 });
  for (let i = 0; i < 10; i++) g += box(30 + i * 40, 46, 34, 24, i < 10 ? 4 : 1);
  g += txt(30, 88, "all 10 active → request 11 waits in queue → connection-timeout → exception if none freed", { s: 9, o: 0.75 });
  g += txt(30, 122, "Composite index (user_id, status, created_at) — leftmost-prefix rule:", { s: 10, w: 600 });
  [["WHERE user_id=?", 1, "✓"], ["user_id=? AND status=?", 1, "✓"], ["WHERE status=? (no prefix)", 4, "✗"]].forEach(([q, ci, mk], i) => { const x = 30 + i * 245; g += box(x, 134, 235, 28, ci) + txt(x + 10, 152, `${mk}  ${q}`, { mono: true, s: 8.5 }); });
  g += txt(30, 184, "Seq Scan (no index) → Index Scan (with index): up to 16000× faster", { s: 9, fill: GRN });
  return svg(760, 200, g);
}

// ── m17_t4 — @ManyToMany join table + cascade matrix ──
function m17_t4() {
  let g = title(14, "JPA relationships — join table & cascades");
  g += box(30, 44, 130, 34, 0) + txt(95, 65, "Product", { a: "middle", s: 10, w: 600 });
  g += box(300, 44, 180, 34, 5) + txt(390, 60, "product_categories", { a: "middle", mono: true, s: 9 }) + txt(390, 74, "product_id · category_id", { a: "middle", s: 7.5, o: 0.7 });
  g += box(620, 44, 130, 34, 1) + txt(685, 65, "Category", { a: "middle", s: 10, w: 600 });
  g += arr(160, 61, 298, 61, "", "@JoinTable") + arr(480, 61, 618, 61, "", "mappedBy");
  // cascade matrix
  g += txt(30, 110, "Cascade safety:", { s: 10, w: 600 });
  const cols = ["PERSIST", "MERGE", "REMOVE", "ALL"];
  cols.forEach((c, i) => g += txt(250 + i * 110, 110, c, { a: "middle", s: 8.5, o: 0.7 }));
  [["@OneToMany", [1, 1, 1, 1]], ["@ManyToMany", [1, 1, 4, 4]], ["@ManyToOne", [1, 1, 4, 4]]].forEach(([r, cells], ri) => {
    const y = 120 + ri * 28;
    g += txt(40, y + 17, r, { mono: true, s: 8.5 });
    cells.forEach((ci, i) => g += box(200 + i * 110, y, 100, 24, ci) + txt(250 + i * 110, y + 16, ci === 4 ? "✗" : "✓", { a: "middle", s: 10, w: 700, fill: ci === 4 ? RED : GRN }));
  });
  g += txt(30, 208, "@ManyToMany + REMOVE deletes the SHARED entity.   @Embeddable = columns in same table (no extra query).", { s: 8.5, o: 0.7 });
  return svg(760, 222, g);
}

// ── m18_t2 — multi-level cache + stampede + redis structures ──
function m18_t2() {
  let g = title(14, "Cache-aside, multi-level & stampede");
  g += box(20, 44, 90, 28, 3) + txt(65, 62, "Request", { a: "middle", s: 9 }) + arr(110, 58, 140, 58);
  [["L1 Caffeine", "1ms · 100"], ["L2 Redis", "0.3ms · 1M"], ["L3 Postgres", "15ms · ∞"]].forEach(([h, d], i) => { const x = 140 + i * 200; g += box(x, 44, 185, 30, [1, 0, 5][i]) + txt(x + 92, 58, h, { a: "middle", s: 9, w: 600 }) + txt(x + 92, 70, d, { a: "middle", s: 7.5, o: 0.7 }); if (i < 2) g += arr(x + 185, 59, x + 200, 59, "", "miss"); });
  g += txt(30, 100, "hit → return; miss → fetch from next level, populate the ones above", { s: 9, o: 0.75 });
  g += txt(30, 130, "Stampede: TTL=0 → 50k simultaneous misses → DB (20 conns) saturates → mutex SETNX: 1 rebuilds, rest wait 50ms", { s: 9, fill: RED });
  g += txt(30, 160, "Redis types: String=value · Hash=fields · List=feed · SortedSet=leaderboard · Set=unique ids", { s: 9, o: 0.8 });
  return svg(760, 176, g);
}

// ── m18_t4 — Redis distributed lock + idempotency key ──
function m18_t4() {
  let g = title(14, "Redis distributed lock + idempotency");
  g += txt(30, 38, "5 instances fire @Scheduled at once → SETNX:", { s: 10, w: 600 });
  for (let i = 0; i < 5; i++) { const x = 30 + i * 145; const win = i === 0; g += box(x, 46, 135, 32, win ? 1 : 5) + txt(x + 67, 62, "instance " + (i + 1), { a: "middle", s: 9 }) + txt(x + 67, 74, win ? "SETNX→true ✓ runs" : "SETNX→false skip", { a: "middle", s: 7.5, fill: win ? GRN : undefined, o: win ? 1 : 0.6 }); }
  g += txt(30, 98, "winner runs settlement → DELETE lock:settlement:today → next day all 5 compete again", { s: 9, o: 0.75 });
  // idempotency
  g += txt(30, 130, "Idempotency key (X-Idempotency-Key: abc123):", { s: 10, w: 600 });
  ["check idem:result", "miss → process", "store result (24h)"].forEach((t, i) => { const x = 30 + i * 150; g += box(x, 138, 140, 26, [0, 2, 1][i]) + txt(x + 70, 155, t, { a: "middle", s: 8.5 }); if (i < 2) g += arr(x + 140, 151, x + 150, 151); });
  g += txt(500, 155, "retry → HIT → cached result (no double charge)", { s: 9, fill: GRN });
  return svg(760, 180, g);
}

const SPECS = {
  java_m2_t5: m2_t5, java_m3_t1: m3_t1, java_m3_t2: m3_t2, java_m3_t3: m3_t3,
  java_m4_t5: m4_t5, java_m4_t6: m4_t6, java_m5_t3: m5_t3, java_m5_t4: m5_t4,
  java_m6_t1: m6_t1, java_m6_t2: m6_t2, java_m6_t3: m6_t3, java_m6_t4: m6_t4,
  java_m7_t1: m7_t1, java_m7_t3: m7_t3, java_m7_t4: m7_t4,
  java_m9_t4: m9_t4, java_m9_t5: m9_t5, java_m10_t3: m10_t3,
  java_m11_t1: m11_t1, java_m11_t2: m11_t2, java_m11_t3: m11_t3, java_m11_t4: m11_t4,
  java_m12_t1: m12_t1, java_m12_t4: m12_t4, java_m12_t5: m12_t5,
  java_m13_t1: m13_t1, java_m13_t4: m13_t4, java_m14_t3: m14_t3, java_m14_t5: m14_t5,
  java_m15_t2: m15_t2, java_m16_t1: m16_t1, java_m17_t2: m17_t2, java_m17_t3: m17_t3,
  java_m17_t4: m17_t4, java_m18_t2: m18_t2, java_m18_t4: m18_t4,
  java_m20_t4: m20_t4, java_m22_t1: m22_t1, java_m22_t2: m22_t2, java_m22_t4: m22_t4,
  java_m24_t2: m24_t2, java_m25_t1: m25_t1, java_m25_t2: m25_t2, java_m25_t5: m25_t5,
  java_m29_t2: m29_t2, java_m29_t3: m29_t3, java_m29_t4: m29_t4, java_m30_t1: m30_t1,
  java_m30_5_t1: m30_5_t1, java_m30_5_t2: m30_5_t2, java_m30_5_t3: m30_5_t3, java_m30_5_t4: m30_5_t4,
  java_m31_t1: m31_t1, java_m31_t2: m31_t2, java_m32_t1: m32_t1, java_m32_t3: m32_t3,
  java_m32_t4: m32_t4, java_m32_t5: m32_t5, java_m33_t3: m33_t3,
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

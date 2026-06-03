/**
 * seedProVisualAidBatch5.js — re-author the 34 visual_aids that had a generic
 * early-batch "text-in-boxes" SVG (from seedProVisualAidSvgsBatch.js) even
 * though their brief describes a real diagram (flow / arrows / before-after).
 * Each authored from its own brief; sets teaching.visual_aid.svg. Idempotent.
 *
 * Run: node config/seedProVisualAidBatch5.js [topicId ...]   (no args = all)
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.13)", "rgba(255,159,10,0.14)", "rgba(191,90,242,0.11)", "rgba(255,69,58,0.13)", "rgba(142,142,147,0.13)"];
const STRK = ["rgba(10,132,255,0.5)", "rgba(48,209,88,0.55)", "rgba(255,159,10,0.6)", "rgba(191,90,242,0.5)", "rgba(255,69,58,0.55)", "rgba(142,142,147,0.5)"];
const ARR = "rgba(140,140,148,0.95)", RED = "rgba(255,69,58,0.9)", GRN = "rgba(40,170,80,0.95)";

const svg = (w, h, inner) =>
  `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;font-family:ui-sans-serif,system-ui" fill="currentColor">`
  + `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${ARR}"/></marker>`
  + `<marker id="ahr" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${RED}"/></marker>`
  + `<marker id="ahg" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${GRN}"/></marker></defs>${inner}</svg>`;
const box = (x, y, w, h, ci, rx = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`;
const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" font-weight="${o.w || 400}" text-anchor="${o.a || "start"}" opacity="${o.o ?? 1}"${o.fill ? ` fill="${o.fill}"` : ""}${o.mono ? ' font-family="ui-monospace,Menlo,monospace"' : ""}>${esc(t)}</text>`;
const arr = (x1, y1, x2, y2, k = "", l, dx = 0) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${k === "r" ? RED : k === "g" ? GRN : ARR}"${k === "d" ? ' stroke-dasharray="4 3"' : ""} marker-end="url(#${k === "r" ? "ahr" : k === "g" ? "ahg" : "ah"})"/>` + (l ? txt((x1 + x2) / 2 + dx, (y1 + y2) / 2 - 3, l, { a: "middle", s: 9, o: 0.8 }) : "");
const curve = (x1, y1, x2, y2, qx, qy, k = "") => `<path d="M${x1},${y1} Q${qx},${qy} ${x2},${y2}" fill="none" stroke="${k === "g" ? GRN : ARR}" marker-end="url(#${k === "g" ? "ahg" : "ah"})"/>`;
const title = (x, t) => txt(x, 15, t, { w: 700, s: 12.5, o: 0.88 });
const vcell = (x, y, w, h, val, ci, o = {}) => box(x, y, w, h, ci) + txt(x + w / 2, y + h / 2 + 4, String(val), { a: "middle", mono: true, s: o.s || 11, w: o.w || 700, fill: o.fill });
const lbox = (x, y, w, h, t, ci, o = {}) => box(x, y, w, h, ci) + txt(x + w / 2, y + h / 2 + 4, t, { a: "middle", mono: o.mono, s: o.s || 10, w: o.w || 600 });

// ── m2_t1 — methods flow + reuse + before/after ──
function m2_t1() {
  let g = title(14, "Methods — reusable, called from many places");
  g += box(24, 36, 140, 116, 3) + txt(94, 54, "main()", { a: "middle", mono: true, s: 11, w: 700 });
  ["showHeader()", "showContent()", "showFooter()"].forEach((c, i) => g += txt(36, 80 + i * 22, c, { mono: true, s: 9 }));
  const defs = [["showHeader", 73], ["showContent", 105], ["showFooter", 137]];
  defs.forEach(([nm, y], i) => { g += arr(164, 80 + i * 22, 316, y) + lbox(316, y - 15, 150, 30, nm, 0, { mono: true, s: 9.5 }); });
  g += lbox(560, 90, 140, 30, "showDivider", 1, { mono: true, s: 9.5 });
  g += arr(466, 105, 558, 105, "g") + curve(466, 137, 558, 116, 540, 150, "g");
  g += txt(560, 138, "← reusable: called", { s: 8.5, o: 0.7 }) + txt(560, 150, "  from 2 places", { s: 8.5, o: 0.7 });
  // before / after
  g += box(24, 176, 350, 60, 4) + txt(36, 194, "BEFORE", { s: 9.5, w: 700, fill: RED }) + txt(36, 212, "80-line main() — all logic crammed in", { s: 9.5 }) + txt(36, 228, "hard to read, impossible to reuse", { s: 8.5, o: 0.65 });
  g += box(390, 176, 346, 60, 1) + txt(402, 194, "AFTER", { s: 9.5, w: 700, fill: GRN }) + txt(402, 212, "8-line main() calling 5 named methods", { s: 9.5 }) + txt(402, 228, "same program — far clearer, reusable", { s: 8.5, o: 0.65 });
  return svg(760, 248, g);
}
// ── m2_t2 — parameters in / return out ──
function m2_t2() {
  let g = title(14, "Parameters in → method → return out");
  g += box(300, 44, 170, 56, 0) + txt(385, 70, "calculateTax(...)", { a: "middle", mono: true, s: 10, w: 700 }) + txt(385, 86, "method body", { a: "middle", s: 8.5, o: 0.6 });
  g += arr(120, 60, 298, 60, "g", "income: double", -10) + arr(120, 84, 298, 84, "g", "rate: double", -6);
  g += txt(40, 64, "params IN", { s: 9, w: 600, fill: GRN }) + txt(40, 88, "(type + name)", { s: 8, o: 0.6 });
  g += arr(470, 72, 640, 72, "g", "double", 0) + txt(648, 76, "return OUT", { s: 9, w: 600, fill: GRN });
  g += txt(300, 124, "called from main:  double tax = calculateTax(50000, 0.2);", { mono: true, a: "middle", s: 9.5 });
  // old vs new
  g += box(24, 142, 350, 56, 4) + txt(36, 160, "OLD WAY", { s: 9, w: 700, fill: RED }) + txt(36, 177, "class-level static variables", { s: 9 }) + txt(36, 192, "→ data leaks everywhere", { s: 8.5, o: 0.65 });
  g += box(390, 142, 346, 56, 1) + txt(402, 160, "NEW WAY", { s: 9, w: 700, fill: GRN }) + txt(402, 177, "parameters in, return out", { s: 9 }) + txt(402, 192, "→ data flows cleanly, no hidden state", { s: 8.5, o: 0.65 });
  return svg(760, 212, g);
}
// ── m2_t3 — overloading: dispatch by type & count ──
function m2_t3() {
  let g = title(14, "Method overloading — same name, different signature");
  const sigs = [["add(int, int)", 0], ["add(double, double)", 1], ["add(int, int, int)", 2]];
  sigs.forEach(([s, ci], i) => g += lbox(40 + i * 240, 36, 220, 32, s, ci, { mono: true, s: 10 }));
  const calls = [["add(5, 3)", 0], ["add(2.5, 1.5)", 1], ["add(1, 2, 3)", 2]];
  calls.forEach(([c, ci], i) => { const x = 40 + i * 240; g += lbox(x + 30, 96, 160, 28, c, 5, { mono: true, s: 10 }); g += arr(x + 110, 94, 40 + i * 240 + 110, 70, ""); });
  g += txt(380, 146, "Java picks the overload by argument TYPES and COUNT — never the return type.", { a: "middle", s: 9.5, o: 0.85 });
  g += box(24, 162, 712, 44, 4) + txt(40, 180, "✗ NOT VALID:", { s: 9.5, w: 700, fill: RED }) + txt(150, 180, "int  foo()   and   double foo()   — differ ONLY in return type", { mono: true, s: 9.5 }) + txt(40, 198, "compiler error: methods must differ in parameters, not just what they return.", { s: 8.5, o: 0.7 });
  return svg(760, 220, g);
}
// ── m2_t4 — variable scope nesting + lifetime ──
function m2_t4() {
  let g = title(14, "Variable scope & lifetime");
  g += box(24, 36, 420, 130, 0) + txt(36, 54, "Class scope — static fields (whole class sees)", { s: 9.5, w: 600 });
  g += box(48, 64, 372, 92, 1) + txt(60, 82, "Method scope — params + locals (this method)", { s: 9.5, w: 600 });
  g += box(72, 92, 324, 56, 2) + txt(84, 110, "Block scope — loop / if variables", { s: 9.5, w: 600 }) + txt(84, 128, "(gone when the { } closes)", { s: 8.5, o: 0.65 });
  g += txt(470, 70, "inner can see outer ↑", { s: 9.5, fill: GRN });
  g += txt(470, 92, "outer CANNOT see inner ↓", { s: 9.5, fill: RED });
  g += txt(470, 120, "a variable 'falls out of scope'", { s: 9, o: 0.7 }) + txt(470, 134, "when its block closes", { s: 9, o: 0.7 });
  // lifetime timeline
  g += txt(24, 188, "lifetime:", { s: 9.5, w: 600 });
  g += box(90, 178, 200, 18, 0, 4) + txt(96, 191, "static: whole program", { s: 8.5 });
  g += box(300, 178, 150, 18, 1, 4) + txt(306, 191, "local: while method runs", { s: 8.5 });
  g += box(460, 178, 130, 18, 2, 4) + txt(466, 191, "block: inside { }", { s: 8.5 });
  return svg(760, 208, g);
}

// ── m3_t4 — String pool, identity, immutability ──
function m3_t4() {
  let g = title(14, "Strings — pool, identity (==) vs equals, immutability");
  g += box(250, 36, 150, 36, 1) + txt(325, 58, 'pool: "hello"', { a: "middle", mono: true, s: 10, w: 600 });
  g += lbox(40, 36, 70, 24, "a", 0, { mono: true }) + arr(110, 48, 248, 50, "g");
  g += lbox(40, 70, 70, 24, "b", 0, { mono: true }) + arr(110, 82, 248, 64, "g");
  g += lbox(470, 36, 240, 36, 'c = new String("hello")', 4, { mono: true, s: 9 });
  g += txt(40, 116, "a == b  → true  (same pooled object)", { mono: true, s: 9.5, fill: GRN });
  g += txt(40, 134, "a == c  → false (c is a separate object)", { mono: true, s: 9.5, fill: RED });
  g += txt(40, 152, "a.equals(c) → true  (same contents)", { mono: true, s: 9.5, fill: GRN });
  // immutability
  g += txt(430, 110, "immutability:", { s: 9.5, w: 600 });
  g += lbox(430, 122, 130, 26, '"hello"', 5, { mono: true }) + txt(445, 144, "(greyed, GC'd)", { s: 7.5, o: 0.5 });
  g += arr(560, 135, 600, 135, "g", "toUpperCase()") + lbox(600, 122, 120, 26, '"HELLO" (new)', 1, { mono: true, s: 9 });
  return svg(760, 172, g);
}
// ── m4_t3 — encapsulation: private vault + public doors ──
function m4_t3() {
  let g = title(14, "Encapsulation — private data behind public methods");
  g += box(40, 36, 280, 130, 0) + txt(180, 54, "BankAccount", { a: "middle", s: 11, w: 700 });
  g += box(70, 66, 220, 50, 4) + txt(180, 84, "🔒 PRIVATE", { a: "middle", s: 9, w: 700, fill: RED }) + txt(180, 100, "holderName, balance", { a: "middle", mono: true, s: 9 });
  g += txt(180, 138, "PUBLIC doors:", { a: "middle", s: 8.5, o: 0.7 }) + txt(180, 154, "getBalance() · setBalance() · getName()", { a: "middle", mono: true, s: 8 });
  g += arr(420, 70, 322, 90, "r", "direct access") + txt(430, 66, "✗ COMPILATION ERROR", { s: 9, fill: RED, w: 600 });
  g += arr(420, 140, 322, 140, "g", "via setter") + txt(430, 122, "external code enters", { s: 9, o: 0.8 }) + txt(430, 136, "only through public doors", { s: 9, o: 0.8 });
  g += txt(40, 192, "Public fields: anyone writes anything (even balance = −50000).  Setter has a validation gate that rejects bad values.", { s: 9, o: 0.8 });
  return svg(760, 206, g);
}
// ── m8_t2 — functional interfaces ──
function m8_t2() {
  let g = title(14, "Functional interfaces — the core four");
  const fi = [["Predicate<T>", "T → boolean", "test() — filter", 0], ["Function<T,R>", "T → R", "apply() — transform", 1], ["Consumer<T>", "T → void", "accept() — act", 2], ["Supplier<T>", "() → T", "get() — produce", 3]];
  fi.forEach(([n, io, use, ci], i) => { const x = 24 + i * 184; g += box(x, 36, 174, 64, ci) + txt(x + 87, 54, n, { a: "middle", mono: true, s: 10, w: 700 }) + txt(x + 87, 72, io, { a: "middle", mono: true, s: 9.5 }) + txt(x + 87, 90, use, { a: "middle", s: 8.5, o: 0.7 }); });
  g += txt(24, 134, "Composition:", { s: 9.5, w: 600 });
  g += txt(120, 134, "isAdult.and(hasLicence)  →  combined Predicate", { mono: true, s: 9 });
  g += txt(120, 154, "parseInt.andThen(toHex)  →  chained Function (output feeds next)", { mono: true, s: 9 });
  g += txt(24, 178, "Method refs:  String::length (instance),  Integer::parseInt (static),  User::new (constructor).", { mono: true, s: 8.5, o: 0.75 });
  return svg(760, 194, g);
}
// ── m9_t1 — generic class Box<T> ──
function m9_t1() {
  let g = title(14, "Generic class — Box<T>");
  g += box(40, 36, 230, 70, 3) + txt(155, 54, "class Box<T> {", { a: "middle", mono: true, s: 10, w: 700 }) + txt(52, 72, "T item;  T get(){...}", { mono: true, s: 9 }) + txt(52, 90, "set(T x){...}  }", { mono: true, s: 9 });
  g += txt(300, 50, "T is substituted at use:", { s: 9.5, w: 600 });
  ["Box<String>", "Box<Integer>", "Box<Product>"].forEach((t, i) => g += lbox(300 + i * 150, 62, 140, 28, t, 0, { mono: true, s: 9 }));
  g += box(40, 122, 340, 56, 4) + txt(52, 140, "Object container", { s: 9, w: 600, fill: RED }) + txt(52, 157, "needs casts → ClassCastException at runtime", { s: 8.5 }) + txt(52, 172, "(error only shows up when it crashes)", { s: 8, o: 0.6 });
  g += box(396, 122, 340, 56, 1) + txt(408, 140, "Box<T> generic", { s: 9, w: 600, fill: GRN }) + txt(408, 157, "no casts → wrong type is a COMPILE error", { s: 8.5 }) + txt(408, 172, "Pair<A,B>.swap() returns Pair<B,A>", { mono: true, s: 8, o: 0.6 });
  return svg(760, 192, g);
}
// ── m9_t2 — generic methods ──
function m9_t2() {
  let g = title(14, "Generic methods — <T> declared on the method");
  g += box(40, 40, 680, 28, 5) + txt(54, 59, "public static <T> T firstOf(List<T> list) { return list.get(0); }", { mono: true, s: 10 });
  g += txt(120, 88, "<T> declares the type param", { s: 9, fill: "#0a84ff" }) + arr(135, 78, 175, 70, "");
  g += txt(380, 88, "T used as return type AND parameter type", { s: 9, fill: "#0a84ff" });
  g += txt(40, 124, "Inference: firstOf(List<String>)  →  compiler sets T = String  →  returns String, no cast.", { mono: true, s: 9 });
  g += box(40, 142, 340, 44, 0) + txt(52, 160, "method-level <T>", { s: 9, w: 600 }) + txt(52, 176, "one method needs a type param", { s: 8.5, o: 0.7 });
  g += box(396, 142, 340, 44, 1) + txt(408, 160, "class-level <T>", { s: 9, w: 600 }) + txt(408, 176, "the whole class is parameterized", { s: 8.5, o: 0.7 });
  return svg(760, 200, g);
}
// ── m10_t2 — synchronization: race, lock, volatile ──
function m10_t2() {
  let g = title(14, "Synchronization — race, lock, visibility");
  g += txt(24, 36, "Race condition (counter++ = read/add/write):", { s: 9.5, w: 600 });
  g += lbox(40, 46, 130, 24, "A: read 6", 0, { s: 8.5 }) + lbox(180, 46, 130, 24, "A: write 7", 0, { s: 8.5 });
  g += lbox(40, 74, 130, 24, "B: read 6", 2, { s: 8.5 }) + lbox(180, 74, 130, 24, "B: write 7", 2, { s: 8.5 });
  g += txt(330, 64, "expected 8, got 7 — a lost update", { s: 9, fill: RED });
  g += txt(24, 116, "synchronized:", { s: 9.5, w: 600 }) + lbox(120, 106, 130, 24, "A holds lock", 1, { s: 8.5 }) + lbox(260, 106, 150, 24, "B BLOCKED → waits", 4, { s: 8.5 });
  g += txt(24, 152, "volatile:", { s: 9.5, w: 600 }) + txt(110, 152, "without → each thread caches its own copy (stale).  with → all read/write main memory.", { s: 9, o: 0.8 });
  g += txt(24, 178, "synchronized = atomicity + visibility · volatile = visibility only (no atomic compound ops).", { s: 8.5, o: 0.7 });
  return svg(760, 194, g);
}
// ── m10_t5 — CompletableFuture ──
function m10_t5() {
  let g = title(14, "CompletableFuture — non-blocking pipelines");
  g += txt(24, 36, "Blocking Future:", { s: 9.5, w: 600, fill: RED });
  [0, 1, 2].forEach(i => { const y = 44 + i * 16; g += box(120, y, 40, 12, 1, 3) + box(160, y, 180, 12, 4, 3); });
  g += txt(345, 64, "long BLOCKED waits · latency = sum", { s: 8.5, fill: RED });
  g += txt(24, 110, "CompletableFuture:", { s: 9.5, w: 600, fill: GRN });
  ["supplyAsync", "thenApply", "thenAccept"].forEach((s, i) => { const x = 150 + i * 150; g += lbox(x, 100, 130, 24, s, 1, { mono: true, s: 8.5 }); if (i < 2) g += arr(x + 130, 112, x + 150, 112, "g"); });
  g += txt(150, 142, "stages auto-trigger, nothing blocks · latency = active work only", { s: 8.5, fill: GRN });
  g += txt(24, 172, "allOf: fan out N tasks in parallel → converge → one thenRun.  sequential = sum(N), parallel = max(N).", { s: 9, o: 0.8 });
  return svg(760, 188, g);
}

// chain of labelled boxes connected by arrows
const flow = (y, items, h = 28) => { let s = "", x = 24; items.forEach((it, i) => { const w = it.w || 120; s += lbox(x, y, w, h, it.t, it.ci ?? 0, { mono: it.mono, s: it.s || 9 }); if (i < items.length - 1) { s += arr(x + w, y + h / 2, x + w + 14, y + h / 2, it.k || "", it.l); } x += w + 14 + (it.gap || 0); }); return s; };

// ── m20_t1 — observability metrics pipeline ──
function m20_t1() {
  let g = title(14, "Observability — the metrics pipeline");
  g += flow(40, [{ t: "Spring app", ci: 0, w: 100 }, { t: "Micrometer", ci: 3, w: 110 }, { t: "/actuator/prometheus", ci: 5, w: 160, mono: true, s: 8 }, { t: "Prometheus", ci: 2, w: 110, l: "scrape 15s" }, { t: "Grafana", ci: 1, w: 100 }]);
  g += txt(640, 58, "4 panels:", { s: 8.5, o: 0.6 }) + txt(640, 72, "rate · p99 · errors · pool", { s: 8, o: 0.6 });
  g += flow(96, [{ t: "alert: p99 > 500ms", ci: 4, w: 160, s: 8.5 }, { t: "PagerDuty", ci: 4, w: 110, k: "r" }, { t: "on-call engineer", ci: 0, w: 130, k: "r" }]);
  g += txt(24, 150, "Three pillars of observability:  Metrics (this topic) · Traces (T20.2) · Logs (T20.3).", { s: 9, o: 0.8 });
  return svg(760, 166, g);
}
// ── m20_t3 — structured logging ──
function m20_t3() {
  let g = title(14, "Structured logging");
  g += box(24, 36, 220, 60, 4) + txt(36, 54, "Unstructured", { s: 9, w: 600, fill: RED }) + txt(36, 72, "plain text blob —", { s: 8.5 }) + txt(36, 86, "grep-only, hard to parse", { s: 8.5, o: 0.7 });
  g += box(258, 36, 230, 60, 1) + txt(270, 54, "Structured JSON", { s: 9, w: 600, fill: GRN }) + txt(270, 72, '{"level":"INFO","userId":42,', { mono: true, s: 8 }) + txt(270, 86, ' "msg":"paid"} — queryable', { mono: true, s: 8 });
  g += box(502, 36, 234, 60, 0) + txt(514, 54, "Loki / ELK query", { s: 9, w: 600 }) + txt(514, 72, "filter by json fields:", { s: 8.5 }) + txt(514, 86, "{userId=42, level=ERROR}", { mono: true, s: 8 });
  g += flow(120, [{ t: "request", ci: 0, w: 90 }, { t: "MDC filter (+requestId, +userId)", ci: 2, w: 230, s: 8.5 }, { t: "controller → service", ci: 0, w: 150, s: 8.5 }]);
  g += txt(24, 168, "MDC puts requestId/userId in thread context → every log line on that request includes it automatically.", { s: 9, o: 0.8 });
  return svg(760, 182, g);
}
// ── m21_t1 — multi-stage docker build ──
function m21_t1() {
  let g = title(14, "Multi-stage Docker build for Spring Boot");
  g += box(24, 36, 330, 70, 2) + txt(36, 54, "Stage 1 — builder (JDK 21)", { s: 9.5, w: 600 }) + txt(36, 74, "Maven compiles → JAR", { mono: true, s: 9 }) + txt(36, 90, "layertools extracts layers", { mono: true, s: 9 });
  g += arr(354, 71, 392, 71, "", "copy layers");
  g += box(420, 36, 316, 70, 1) + txt(432, 54, "Stage 2 — runtime (JRE 21-alpine)", { s: 9.5, w: 600 }) + txt(432, 74, "4 COPY: deps / loader / snapshot / app", { mono: true, s: 8.5 }) + txt(432, 90, "final image 180MB (vs 450MB w/ JDK)", { s: 8.5, fill: GRN });
  g += txt(24, 138, "docker-compose:", { s: 9.5, w: 600 });
  g += flow(150, [{ t: "app", ci: 0, w: 80 }, { t: "postgres ✓health", ci: 5, w: 130, l: "depends_on", s: 8.5 }, { t: "redis ✓health", ci: 5, w: 120, s: 8.5 }, { t: "zipkin", ci: 5, w: 90, s: 8.5 }]);
  return svg(760, 188, g);
}
// ── m21_t2 — k8s deployment + service ──
function m21_t2() {
  let g = title(14, "Kubernetes — Deployment + Service");
  g += box(24, 40, 180, 70, 5) + txt(114, 60, "ClusterIP Service", { a: "middle", s: 9.5, w: 600 }) + txt(114, 78, "internal IP", { a: "middle", s: 8.5, o: 0.6 }) + txt(114, 94, "round-robin →", { a: "middle", s: 8.5, o: 0.7 });
  ["pod (node 1)", "pod (node 2)", "pod (node 3)"].forEach((p, i) => { g += lbox(280, 40 + i * 26, 180, 22, p, 0, { s: 8.5 }); g += arr(204, 75, 278, 51 + i * 26, ""); });
  g += txt(490, 56, "label app: payment-service", { mono: true, s: 8.5, o: 0.7 });
  g += txt(490, 80, "Rolling update:", { s: 9, w: 600 });
  g += txt(490, 96, "new pod → readiness ✓ → old pod terminated", { s: 8.5, o: 0.8 });
  g += txt(24, 138, "3 replicas spread across nodes; the Service load-balances internal traffic to healthy pods.", { s: 9, o: 0.8 });
  return svg(760, 154, g);
}
// ── m21_t3 — configmap + secret ──
function m21_t3() {
  let g = title(14, "ConfigMap & Secret — config outside the image");
  g += flow(44, [{ t: "ConfigMap", ci: 0, w: 110 }, { t: "mounted file /app/config/application.yml", ci: 5, w: 280, s: 8.5 }, { t: "Spring reads", ci: 1, w: 110, s: 9 }]);
  g += flow(86, [{ t: "Secret", ci: 4, w: 110 }, { t: "env var SPRING_DATASOURCE_PASSWORD", ci: 5, w: 280, mono: true, s: 7.5 }, { t: "injected", ci: 1, w: 110, s: 9 }]);
  g += txt(24, 134, "Same image tag across environments — only the ConfigMap/Secret values differ:", { s: 9, o: 0.85 });
  ["dev", "staging", "prod"].forEach((e, i) => g += lbox(40 + i * 150, 144, 130, 24, e + " values", 3, { s: 9 }));
  return svg(760, 184, g);
}
// ── m21_t4 — CI/CD github actions ──
function m21_t4() {
  let g = title(14, "CI/CD — GitHub Actions pipeline");
  g += flow(52, [{ t: "git push", ci: 0, w: 100 }, { t: "test (unit ∥ integration)", ci: 2, w: 190, l: "trigger", s: 8.5 }, { t: "build-push → GHCR", ci: 1, w: 170, s: 8.5 }, { t: "deploy-staging", ci: 3, w: 140, s: 8.5 }]);
  g += txt(24, 96, "jobs run in dependency order (test → build → deploy); test's unit + integration run in parallel.", { s: 9, o: 0.8 });
  g += txt(24, 120, "🔒 secrets on GHCR login + kubectl steps · Environment 'staging' is an approval gate before deploy.", { s: 9, o: 0.8 });
  g += txt(24, 144, "deploy step: kubectl set image → rollout status (waits for healthy).", { mono: true, s: 8.5, o: 0.7 });
  return svg(760, 160, g);
}
// ── m21_t5 — blue-green & canary ──
function m21_t5() {
  let g = title(14, "Blue-green & canary deployments");
  g += txt(24, 38, "Blue-green:", { s: 9.5, w: 600 });
  g += lbox(120, 30, 110, 24, "blue v1 (live)", 0, { s: 8.5 }) + lbox(120, 60, 110, 24, "green v2 (idle)", 1, { s: 8.5 });
  g += lbox(260, 44, 90, 24, "Service", 5, { s: 9 }) + arr(232, 42, 258, 50, "") + curve(232, 72, 258, 60, 250, 80, "");
  g += arr(305, 44, 305, 30, "g", "kubectl patch → green");
  g += txt(420, 50, "old blue kept running → instant rollback", { s: 8.5, o: 0.75 });
  g += txt(24, 110, "Canary:", { s: 9.5, w: 600 });
  g += lbox(110, 102, 90, 24, "Ingress", 5, { s: 9 });
  g += arr(200, 108, 250, 100, "g", "95%") + lbox(250, 90, 110, 22, "stable (0.1% err)", 1, { s: 8 });
  g += arr(200, 118, 250, 130, "", "5%") + lbox(250, 122, 110, 22, "canary (5% err)", 4, { s: 8 });
  g += txt(380, 116, "watch error rate → rollback if canary > 2%.", { s: 8.5, o: 0.8 });
  return svg(760, 150, g);
}

// ── m23_t1 — JWT auth flow ──
function m23_t1() {
  let g = title(14, "JWT authentication");
  g += flow(40, [{ t: "Client", ci: 0, w: 90 }, { t: "POST /auth/token (credentials)", ci: 5, w: 220, mono: true, s: 8 }, { t: "Auth Server", ci: 3, w: 110, l: "" }, { t: "returns JWT", ci: 1, w: 110, s: 9 }]);
  g += flow(86, [{ t: "GET /api (Bearer JWT)", ci: 0, w: 160, mono: true, s: 8 }, { t: "Security filter: validate signature (JWK)", ci: 2, w: 250, s: 8.5 }, { t: "SecurityContext", ci: 1, w: 120, s: 8.5 }, { t: "Controller", ci: 0, w: 100, s: 9 }]);
  g += txt(24, 128, "Controller reads @AuthenticationPrincipal Jwt → merchant_id → queries DB for that merchant only.", { s: 9, o: 0.8 });
  g += txt(24, 150, "Forged JWT → signature validation fails → 401 Unauthorized (never reaches the controller).", { s: 9, fill: RED });
  return svg(760, 166, g);
}
// ── m24_t4 — strangler fig migration ──
function m24_t4() {
  let g = title(14, "Strangler Fig — gradual legacy migration");
  g += box(24, 40, 150, 90, 5) + txt(99, 60, "Legacy ODIN", { a: "middle", s: 10, w: 700 }) + txt(99, 78, "monolith", { a: "middle", s: 8.5, o: 0.6 }) + txt(99, 110, "(shrinks over time)", { a: "middle", s: 8, o: 0.55 });
  g += box(214, 40, 170, 90, 2) + txt(299, 58, "Proxy / Router", { a: "middle", s: 9.5, w: 600 }) + txt(299, 76, "feature-flag % split:", { a: "middle", s: 8, o: 0.7 }) + txt(299, 92, "wk1 0% → wk4 10%", { a: "middle", mono: true, s: 8 }) + txt(299, 106, "→ m3 50% → m6 100%", { a: "middle", mono: true, s: 8 });
  ["OrderService", "TradeService", "PositionService"].forEach((s, i) => g += lbox(430, 40 + i * 32, 180, 26, s, 1, { s: 8.5 }));
  g += arr(174, 70, 212, 70, "") + arr(384, 85, 428, 85, "g");
  g += txt(24, 152, "Dark launch: shadow traffic hits BOTH systems → compare outputs for equality before cutting over.", { s: 9, o: 0.8 });
  return svg(760, 168, g);
}
// ── m24_t5 — bulkhead & sidecar ──
function m24_t5() {
  let g = title(14, "Bulkhead (isolation) & Sidecar (co-process)");
  g += box(24, 40, 350, 92, 0) + txt(199, 58, "Payment service — isolated thread pools", { a: "middle", s: 9.5, w: 600 });
  g += lbox(40, 70, 100, 26, "HDFC ×40", 4, { s: 8.5 }) + lbox(150, 70, 100, 26, "VISA ×40", 1, { s: 8.5 }) + lbox(260, 70, 100, 26, "KYC ×20", 1, { s: 8.5 });
  g += txt(40, 116, "HDFC gateway slow → fills HDFC pool only; VISA/KYC unaffected. 41st HDFC call → BulkheadFullException.", { s: 8, o: 0.75 });
  g += box(396, 40, 340, 92, 3) + txt(566, 58, "Kubernetes Pod (shared volume + localhost)", { a: "middle", s: 9, w: 600 });
  ["payment-service", "Fluent-Bit (logs)", "Envoy (traffic)", "Vault Agent (secrets)"].forEach((c, i) => g += lbox(410 + (i % 2) * 165, 70 + Math.floor(i / 2) * 30, 158, 24, c, 5, { s: 8 }));
  return svg(760, 146, g);
}
// ── m25_t3 — mutation testing ──
function m25_t3() {
  let g = title(14, "Mutation testing (PITest)");
  g += lbox(40, 60, 130, 40, "source code", 0, { s: 9.5 });
  ["boundary <→≤", "negate cond", "return value", "remove call"].forEach((mu, i) => { const y = 38 + i * 26; g += arr(170, 80, 230, y + 11, ""); g += lbox(230, y, 150, 22, mu, 2, { s: 8 }); g += arr(380, y + 11, 430, y + 11, i % 2 ? "g" : "r"); });
  g += lbox(430, 50, 150, 24, "tests FAIL = KILLED ✓", 1, { s: 8 }) + lbox(430, 90, 150, 24, "tests PASS = SURVIVED", 4, { s: 8 });
  g += txt(600, 64, "killed = good", { s: 8.5, fill: GRN }) + txt(600, 104, "survived = test gap", { s: 8.5, fill: RED });
  g += txt(24, 150, "mutation score = killed / (killed + survived).  HTML report breaks it down per class.", { s: 9, o: 0.8 });
  return svg(760, 166, g);
}
// ── m26_t2 — RAG two phases ──
function m26_t2() {
  let g = title(14, "RAG — Retrieval Augmented Generation");
  g += txt(24, 36, "Ingestion (once):", { s: 9.5, w: 600 });
  g += flow(44, [{ t: "PDFs", ci: 5, w: 70, s: 9 }, { t: "DocReader", ci: 0, w: 95, s: 8.5 }, { t: "TextSplitter", ci: 0, w: 100, s: 8.5 }, { t: "Embedding", ci: 3, w: 95, s: 8.5 }, { t: "VectorStore (pgvector)", ci: 1, w: 150, s: 8 }]);
  g += txt(24, 92, "Query (per request):", { s: 9.5, w: 600 });
  g += flow(100, [{ t: "Question", ci: 0, w: 85, s: 9 }, { t: "Embedding", ci: 3, w: 90, s: 8.5 }, { t: "Similarity search", ci: 1, w: 120, s: 8.5 }, { t: "Top-3 chunks", ci: 2, w: 105, s: 8.5 }, { t: "ChatClient → Claude", ci: 0, w: 150, s: 8 }]);
  g += txt(24, 144, "pgvector = Postgres + vector ext · similarity = cosine distance · Top-K=3 most relevant paragraphs into the prompt.", { s: 8.5, o: 0.75 });
  return svg(760, 160, g);
}
// ── m26_t4 — LangChain4j AiServices ──
function m26_t4() {
  let g = title(14, "LangChain4j — declarative AiServices");
  g += flow(44, [{ t: "@SystemMessage/@UserMessage interface", ci: 0, w: 260, s: 8 }, { t: "AiServices.builder()…build()", ci: 3, w: 200, mono: true, s: 8 }, { t: "runtime proxy", ci: 1, w: 120, s: 8.5 }]);
  g += box(24, 92, 350, 44, 5) + txt(36, 110, "Spring AI", { s: 9, w: 600 }) + txt(36, 127, "ChatClient · manual wiring · programmatic", { s: 8.5, o: 0.7 });
  g += box(396, 92, 340, 44, 3) + txt(408, 110, "LangChain4j", { s: 9, w: 600 }) + txt(408, 127, "AiServices interface · declarative · annotations", { s: 8.5, o: 0.7 });
  g += txt(24, 156, "Both target the same models (Anthropic Claude, OpenAI, Ollama) — different style, same result.", { s: 9, o: 0.8 });
  return svg(760, 172, g);
}
// ── m27_t1 — GraphQL one schema many clients ──
function m27_t1() {
  let g = title(14, "GraphQL — one schema, many clients");
  ["Web", "iOS / Android", "Admin"].forEach((c, i) => { g += lbox(24, 40 + i * 34, 120, 26, c, 0, { s: 9 }); g += arr(144, 53 + i * 34, 300, 86, ""); });
  g += box(300, 56, 160, 64, 3) + txt(380, 76, "/graphql endpoint", { a: "middle", s: 9.5, w: 600 }) + txt(380, 94, "type Query {…}", { a: "middle", mono: true, s: 8 }) + txt(380, 108, "type Mutation {…}", { a: "middle", mono: true, s: 8 });
  ["Product DB", "Reviews svc", "Seller DB", "Shipping API"].forEach((d, i) => { g += lbox(580, 40 + i * 30, 156, 24, d, 1, { s: 8.5 }); g += arr(460, 88, 578, 52 + i * 30, ""); });
  g += txt(24, 156, "One schema; each client requests exactly the fields it needs — no over-/under-fetching.", { s: 9, o: 0.8 });
  return svg(760, 172, g);
}
// ── m27_t3 — DataLoader N+1 ──
function m27_t3() {
  let g = title(14, "DataLoader — batching away the N+1 problem");
  g += txt(24, 38, "Naive (N+1):", { s: 9.5, w: 600, fill: RED });
  for (let i = 0; i < 8; i++) g += arr(40 + i * 18, 48, 40 + i * 18, 78, "r");
  g += lbox(40, 80, 160, 22, "DB: 200 queries", 4, { s: 8.5 }) + txt(210, 95, "201 queries · 2500ms", { s: 9, fill: RED });
  g += txt(24, 126, "DataLoader / @BatchMapping:", { s: 9.5, w: 600, fill: GRN });
  g += lbox(40, 136, 150, 22, "200 ids batched", 1, { s: 8.5 }) + arr(190, 147, 260, 147, "g", "one call");
  g += lbox(260, 136, 220, 22, "DB: WHERE id IN (P1…P200)", 1, { mono: true, s: 8 }) + txt(490, 151, "2 queries · 80ms", { s: 9, fill: GRN });
  return svg(760, 172, g);
}

// ── m15_t5 — distributed tracing waterfall ──
function m15_t5() {
  let g = title(14, "Distributed tracing — one trace, many spans");
  g += txt(24, 36, "traceId = abc123", { mono: true, s: 9, fill: "#0a84ff", w: 600 });
  const bars = [["order-service", 40, 480, 0, "3050ms"], ["market-service", 70, 448, 3, "2850ms"], ["db-query  ⚠ BOTTLENECK", 70, 440, 4, "2800ms"], ["payment-service", 510, 24, 1, "150ms"]];
  bars.forEach(([nm, x, w, ci, dur], i) => { const y = 44 + i * 24; g += box(x, y, w, 18, ci, 4) + txt(x + 6, y + 13, nm, { s: 8 }) + txt(x + w + 6, y + 13, dur, { s: 7.5, o: 0.6 }); });
  g += txt(24, 156, "Logs on every service carry [abc123] → search by traceId → interleaved timeline. Zipkin renders this waterfall; the wide db-query span is the bottleneck.", { s: 8.5, o: 0.8 });
  return svg(760, 172, g);
}
// ── m18_t5 — redis pub/sub fan-out ──
function m18_t5() {
  let g = title(14, "Redis Pub/Sub — instant cache invalidation");
  g += lbox(24, 60, 120, 30, "Instance 1", 0, { s: 9 }) + arr(144, 75, 250, 75, "", "PUBLISH P001");
  g += lbox(250, 56, 110, 38, "Redis Pub/Sub", 4, { s: 9, w: 600 });
  ["Inst 2 — evict P001", "Inst 5 — evict P001", "Inst 10 — evict P001"].forEach((t, i) => { g += arr(360, 75, 470, 50 + i * 30, "g"); g += lbox(470, 38 + i * 30, 180, 24, t, 1, { s: 8 }); });
  g += txt(24, 130, "T=0 price updated · T=1ms message delivered to all · T=2ms every L1 cache evicted · next request serves fresh data.", { s: 8.5, o: 0.8 });
  g += txt(24, 152, "Without Pub/Sub: each instance keeps stale data until its TTL expires — up to 29 min of inconsistency.", { s: 8.5, fill: RED });
  return svg(760, 168, g);
}
// ── m27_t5 — testing graphql ──
function m27_t5() {
  let g = title(14, "Testing GraphQL");
  g += flow(44, [{ t: "Test", ci: 0, w: 80 }, { t: "GraphQlTester", ci: 1, w: 130, s: 9 }, { t: "execution engine (resolvers, schema, errors)", ci: 3, w: 290, s: 8 }, { t: "assert fields", ci: 1, w: 110, s: 8.5 }]);
  g += txt(640, 58, "deep ✓", { s: 9, fill: GRN });
  g += flow(86, [{ t: "Test", ci: 0, w: 80 }, { t: "MockMvc", ci: 5, w: 110, s: 9 }, { t: "HTTP layer — status code + raw JSON only", ci: 5, w: 290, s: 8 }]);
  g += txt(540, 100, "shallow (no GraphQL semantics)", { s: 8.5, o: 0.7 });
  g += txt(24, 138, "@GraphQlTest slice: loads only @Controller + schema + @MockBean services — far faster than @SpringBootTest.", { s: 9, o: 0.8 });
  return svg(760, 154, g);
}
// ── m30_t3 — prefix sums ──
function m30_t3() {
  let g = title(14, "Prefix sums — O(1) range queries");
  const nums = [3, 1, 2, 5, 8], pre = [0, 3, 4, 6, 11, 19];
  g += txt(24, 50, "nums:", { s: 9.5, w: 600 });
  nums.forEach((v, i) => g += vcell(90 + i * 64, 38, 58, 26, v, 0));
  g += txt(24, 92, "prefix:", { s: 9.5, w: 600 });
  pre.forEach((v, i) => g += vcell(90 + i * 64, 80, 58, 26, v, 1, { fill: (i === 1 || i === 4) ? RED : undefined }));
  g += txt(24, 124, "prefix[i+1] = prefix[i] + nums[i]", { mono: true, s: 9.5 });
  g += txt(24, 146, "rangeSum(1,3) = prefix[4] − prefix[1] = 11 − 3 = 8   (one subtraction, O(1)).", { mono: true, s: 9.5, fill: GRN });
  return svg(760, 162, g);
}
// ── m30_t4 — dutch national flag ──
function m30_t4() {
  let g = title(14, "Dutch National Flag — 3-way partition");
  const regs = [["0 0 0", 4, "< low"], ["1 1", 5, "low..mid"], ["? ?", 2, "mid..high (process)"], ["2 2 2", 0, "> high"]];
  let x = 40; regs.forEach(([v, ci, lbl]) => { const w = 130; g += box(x, 44, w, 32, ci) + txt(x + w / 2, 64, v, { a: "middle", mono: true, s: 11, w: 700 }) + txt(x + w / 2, 90, lbl, { a: "middle", s: 8, o: 0.6 }); x += w + 8; });
  g += txt(24, 120, "nums[mid]==0 → swap(low,mid), low++ mid++", { mono: true, s: 9 });
  g += txt(24, 138, "nums[mid]==1 → mid++", { mono: true, s: 9 });
  g += txt(24, 156, "nums[mid]==2 → swap(mid,high), high−−   (don't advance mid — recheck swapped value).", { mono: true, s: 9 });
  return svg(760, 170, g);
}
// ── m31_t4 — group anagrams ──
function m31_t4() {
  let g = title(14, "Group anagrams — sorted chars as key");
  g += txt(24, 38, "input:", { s: 9.5, w: 600 });
  ["eat", "tea", "tan", "ate", "nat", "bat"].forEach((w, i) => g += vcell(80 + i * 56, 28, 50, 22, w, 0, { s: 9 }));
  g += txt(24, 78, "sort each → key", { s: 9, o: 0.7 });
  const groups = [["aet", "eat, tea, ate", 1], ["ant", "tan, nat", 2], ["abt", "bat", 3]];
  groups.forEach(([k, v, ci], i) => { const y = 92 + i * 26; g += vcell(80, y, 60, 22, k, ci, { s: 9 }) + arr(140, y + 11, 175, y + 11, "g") + lbox(175, y, 260, 22, "[" + v + "]", ci, { s: 9 }); });
  g += txt(460, 120, "HashMap<sortedKey, List<word>>", { mono: true, s: 8.5, o: 0.75 }) + txt(460, 138, "→ values() = the grouped output", { s: 8.5, o: 0.7 });
  return svg(760, 186, g);
}
// ── m31_t5 — LCS DP table ──
function m31_t5() {
  let g = title(14, "String DP — Longest Common Subsequence");
  const s2 = ["ε", "B", "D", "C", "A", "B"], s1 = ["ε", "A", "B", "C", "B", "D", "A", "B"];
  const dp = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1], [0, 1, 1, 1, 1, 2], [0, 1, 1, 2, 2, 2], [0, 1, 1, 2, 2, 3], [0, 1, 2, 2, 2, 3], [0, 1, 2, 2, 3, 3], [0, 1, 2, 2, 3, 4]];
  const ox = 90, oy = 32, cw = 38, ch = 22;
  s2.forEach((c, j) => g += txt(ox + j * cw + cw / 2, oy - 4, c, { a: "middle", s: 9, o: 0.6 }));
  for (let i = 0; i < 8; i++) { g += txt(ox - 10, oy + i * ch + ch / 2 + 4, s1[i], { a: "end", s: 9, o: 0.6 }); for (let j = 0; j < 6; j++) g += vcell(ox + j * cw, oy + i * ch, cw - 3, ch - 3, dp[i][j], (i === 7 && j === 5) ? 1 : 5, { s: 9 }); }
  g += txt(ox + 6 * cw + 16, oy + 30, "match → diag + 1", { mono: true, s: 8.5, o: 0.85 });
  g += txt(ox + 6 * cw + 16, oy + 48, "no match → max(↑, ←)", { mono: true, s: 8.5, o: 0.85 });
  g += txt(ox + 6 * cw + 16, oy + 72, "answer dp[7][5] = 4 (BCAB)", { s: 9, fill: GRN, w: 600 });
  g += txt(ox + 6 * cw + 16, oy + 96, "Edit Distance & Palindromic", { s: 8.5, o: 0.6 });
  g += txt(ox + 6 * cw + 16, oy + 110, "Subsequence share this shape.", { s: 8.5, o: 0.6 });
  return svg(760, oy + 8 * ch + 16, g);
}
// ── m33_t4 — deque sliding window max ──
function m33_t4() {
  let g = title(14, "Monotonic deque — Sliding Window Maximum (k=3)");
  const arr2 = [1, 3, -1, -3, 5, 3, 6, 7];
  arr2.forEach((v, i) => g += vcell(40 + i * 56, 36, 50, 26, v, [4, 4, 4].includes(i) ? 0 : 0, { s: 10 }));
  g += txt(24, 90, "deque holds indices, values DECREASING front→back. Front = current window max.", { s: 9, o: 0.85 });
  g += txt(24, 112, "• push i: pop smaller values off the BACK first  • pop FRONT if it's outside the window (i−k)", { s: 9, o: 0.8 });
  g += txt(24, 138, "result:", { s: 9.5, w: 600 });
  [3, 3, 5, 5, 6, 7].forEach((v, i) => g += vcell(90 + i * 56, 126, 50, 24, v, 1, { s: 10 }));
  g += txt(90 + 6 * 56 + 10, 143, "→ each index enters/leaves once → O(n).", { s: 8.5, o: 0.7 });
  return svg(760, 164, g);
}

const SPECS = {
  java_m2_t1: m2_t1, java_m2_t2: m2_t2, java_m2_t3: m2_t3, java_m2_t4: m2_t4,
  java_m3_t4: m3_t4, java_m4_t3: m4_t3, java_m8_t2: m8_t2, java_m9_t1: m9_t1, java_m9_t2: m9_t2,
  java_m10_t2: m10_t2, java_m10_t5: m10_t5,
  java_m20_t1: m20_t1, java_m20_t3: m20_t3,
  java_m21_t1: m21_t1, java_m21_t2: m21_t2, java_m21_t3: m21_t3, java_m21_t4: m21_t4, java_m21_t5: m21_t5,
  java_m23_t1: m23_t1, java_m24_t4: m24_t4, java_m24_t5: m24_t5, java_m25_t3: m25_t3,
  java_m26_t2: m26_t2, java_m26_t4: m26_t4, java_m27_t1: m27_t1, java_m27_t3: m27_t3,
  java_m15_t5: m15_t5, java_m18_t5: m18_t5, java_m27_t5: m27_t5, java_m30_t3: m30_t3,
  java_m30_t4: m30_t4, java_m31_t4: m31_t4, java_m31_t5: m31_t5, java_m33_t4: m33_t4,
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

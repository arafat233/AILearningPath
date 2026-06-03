/**
 * seedProVisualAidSvgsBatch.js — author inline SVGs for ALL remaining non-flow
 * visual_aids (the ~55 prose briefs that aren't arrow-flows). Three reusable
 * generators (panels / grid / tree) keep the look consistent; each topic maps to
 * one with distilled content. Sets teaching.visual_aid.svg (rendered first by
 * <VisualAid>); idempotent ($set nested path, description/alt_text preserved).
 *
 * Usage: node config/seedProVisualAidSvgsBatch.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.10)", "rgba(191,90,242,0.10)", "rgba(255,159,10,0.11)"];
const STRK = ["rgba(10,132,255,0.45)", "rgba(48,209,88,0.45)", "rgba(191,90,242,0.5)", "rgba(255,159,10,0.5)"];

// 1–3 labelled columns, each a card with a heading + short lines.
function panels(cols, note) {
  const n = cols.length, W = 760, gap = 14, pad = 12, lineH = 17, headH = 24;
  const colW = Math.floor((W - (n - 1) * gap) / n);
  const maxLines = Math.max(...cols.map((c) => c.lines.length));
  const colH = headH + 8 + maxLines * lineH + 8;
  let g = "";
  cols.forEach((c, i) => {
    const ci = (c.c ?? i) % 4;
    g += `<g transform="translate(${i * (colW + gap)},0)">`
      + `<rect width="${colW}" height="${colH}" rx="10" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`
      + `<text x="${pad}" y="18" font-weight="700" font-size="13">${esc(c.h)}</text>`
      + c.lines.map((ln, j) => `<text x="${pad}" y="${headH + 16 + j * lineH}" font-size="11.5" opacity="0.82">${esc(ln)}</text>`).join("")
      + `</g>`;
  });
  const H = colH + (note ? 22 : 0);
  const nt = note ? `<text x="2" y="${colH + 16}" font-size="11" opacity="0.65">${esc(note)}</text>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;font-family:ui-sans-serif,system-ui" fill="currentColor">${g}${nt}</svg>`;
}

// Matrix of cells. cell = string | {t, sub, fill}.
function grid(matrix, opts = {}) {
  const rows = matrix.length, cols = matrix[0].length, cell = 46, gap = 6;
  const ox = opts.rowLabels ? 58 : 8, oy = opts.colLabels ? 24 : 8;
  let g = "";
  if (opts.colLabels) opts.colLabels.forEach((l, c) => { g += `<text x="${ox + c * (cell + gap) + cell / 2}" y="15" text-anchor="middle" font-size="10" opacity="0.6">${esc(l)}</text>`; });
  matrix.forEach((row, r) => {
    if (opts.rowLabels) g += `<text x="${ox - 8}" y="${oy + r * (cell + gap) + cell / 2 + 4}" text-anchor="end" font-size="10" opacity="0.6">${esc(opts.rowLabels[r])}</text>`;
    row.forEach((v, c) => {
      const o = (v && typeof v === "object") ? v : { t: v };
      g += `<g transform="translate(${ox + c * (cell + gap)},${oy + r * (cell + gap)})">`
        + `<rect width="${cell}" height="${cell}" rx="8" fill="${o.fill || "rgba(10,132,255,0.08)"}" stroke="rgba(120,120,128,0.35)"/>`
        + `<text x="${cell / 2}" y="${cell / 2 + 5}" text-anchor="middle" font-weight="600" font-size="13">${esc(o.t)}</text>`
        + (o.sub != null ? `<text x="${cell / 2}" y="${cell - 5}" text-anchor="middle" font-size="9" opacity="0.6">${esc(o.sub)}</text>` : "")
        + `</g>`;
    });
  });
  const W = Math.max(ox + cols * (cell + gap) + 8, 220), H = oy + rows * (cell + gap) + (opts.note ? 20 : 8);
  const nt = opts.note ? `<text x="${ox}" y="${oy + rows * (cell + gap) + 14}" font-size="11" opacity="0.65">${esc(opts.note)}</text>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;font-family:ui-sans-serif,system-ui" fill="currentColor">${g}${nt}</svg>`;
}

// Root box + child boxes (one level), connectors. child = {label, lines?}.
function tree(root, children, note) {
  const W = 760, boxW = 150, boxH = 40, topY = 8, gapY = 56, cx = W / 2;
  let g = `<g transform="translate(${cx - boxW / 2},${topY})"><rect width="${boxW}" height="${boxH}" rx="10" fill="${TINT[2]}" stroke="${STRK[2]}"/><text x="${boxW / 2}" y="${boxH / 2 + 5}" text-anchor="middle" font-weight="700" font-size="13">${esc(root)}</text></g>`;
  const n = children.length, step = (W - 20) / n, childY = topY + boxH + gapY;
  let maxLines = 0;
  children.forEach((ch, i) => {
    const x = 20 + step * i + step / 2, lines = ch.lines || []; maxLines = Math.max(maxLines, lines.length);
    const h = 34 + lines.length * 14;
    g += `<line x1="${cx}" y1="${topY + boxH}" x2="${x}" y2="${childY}" stroke="rgba(120,120,128,0.5)"/>`
      + `<g transform="translate(${x - boxW / 2},${childY})"><rect width="${boxW}" height="${h}" rx="10" fill="${TINT[0]}" stroke="${STRK[0]}"/>`
      + `<text x="${boxW / 2}" y="19" text-anchor="middle" font-weight="700" font-size="12">${esc(ch.label)}</text>`
      + lines.map((l, j) => `<text x="10" y="${34 + j * 14}" font-size="10" opacity="0.75">${esc(l)}</text>`).join("") + `</g>`;
  });
  const H = childY + 34 + maxLines * 14 + (note ? 20 : 6);
  const nt = note ? `<text x="2" y="${H - 6}" font-size="11" opacity="0.65">${esc(note)}</text>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;font-family:ui-sans-serif,system-ui" fill="currentColor">${g}${nt}</svg>`;
}

const P = (cols, note) => panels(cols, note);
const RED = "rgba(255,69,58,0.12)", GRN = "rgba(48,209,88,0.14)";

const SPECS = {
  // ───── M10 Concurrency ─────
  java_m10_t1: P([
    { h: "Lifecycle states", lines: ["NEW → RUNNABLE → (running)", "→ BLOCKED / WAITING / TIMED_WAITING", "→ TERMINATED"] },
    { h: "start() vs run()", lines: ["start(): new thread + stack", "run(): same thread (no concurrency)"] },
    { h: "Daemon threads", lines: ["non-daemon keeps JVM alive", "daemon killed when main exits"] },
  ]),
  java_m10_t2: P([
    { h: "Race condition", lines: ["A & B do counter++ (read-add-write)", "interleave → lost update", "expected 7, actual 6"] },
    { h: "synchronized", lines: ["A holds the lock (runs)", "B BLOCKED until A exits", "mutual exclusion"] },
    { h: "volatile", lines: ["no volatile: per-thread cached copy", "volatile: read/write main memory", "visibility, not atomicity"] },
  ]),
  java_m10_t3: P([
    { h: "Task queue", lines: ["Runnable/Callable tasks", "wait to be picked up"] },
    { h: "Worker pool (N)", lines: ["threads pull → run → repeat", "reused, not recreated"] },
    { h: "Future + shutdown", lines: ["future.get() blocks for result", "shutdown: finish queue", "shutdownNow: interrupt"] },
  ]),
  java_m10_t4: P([
    { h: "ConcurrentHashMap", lines: ["~16 buckets, lock-striping", "threads on different buckets = no wait", "vs one giant lock"] },
    { h: "BlockingQueue", lines: ["producer adds (blocks if full)", "consumer takes (blocks if empty)"] },
    { h: "Atomic / CAS", lines: ["compare-and-swap = 1 CPU op", "no lock, retry loop", "AtomicInteger.incrementAndGet()"] },
  ]),
  java_m10_t5: P([
    { h: "Blocking Future", lines: ["threads idle in get()", "latency = sum of all waits"] },
    { h: "CompletableFuture", lines: ["supplyAsync → thenApply → thenAccept", "callbacks, no thread blocked"] },
    { h: "allOf fan-out", lines: ["5 branches run in parallel", "latency = max, not sum"] },
  ]),
  // ───── M15 / M17 / M18 / M19 ─────
  java_m15_t5: P([
    { h: "Trace = spans", lines: ["order 3050ms › market 2850ms", "db-query 2800ms = BOTTLENECK", "traceId abc123 links all"] },
    { h: "Log correlation", lines: ["every log carries [abc123]", "search by traceId", "interleave services in time"] },
    { h: "Zipkin", lines: ["waterfall of spans + durations", "hover span → tags & timing"] },
  ]),
  java_m17_t4: P([
    { h: "@ManyToMany", lines: ["join table product_categories", "FKs: product_id, category_id", "addCategory/removeCategory both sides"] },
    { h: "Cascade safety", lines: ["M2M + REMOVE = deletes shared!", "OneToMany + orphanRemoval = ok", "be explicit, never blanket ALL"] },
    { h: "@Embeddable", lines: ["Address columns in Order table", "no extra table, no extra query", "vs @Entity = separate table + join"] },
  ]),
  java_m18_t5: P([
    { h: "Pub/Sub fan-out", lines: ["PUBLISH cache.invalidate P001", "Redis broadcasts to all 10 instances", "every L1 evicts P001"] },
    { h: "Timeline", lines: ["T=0 price updated", "T≈2ms all caches evicted", "next request serves fresh"] },
  ], "Without Pub/Sub: up to 29 min of stale data until TTL expiry."),
  java_m19_t3: P([
    { h: "Ship metaphor", lines: ["hull split into compartments", "one floods, others stay dry"] },
    { h: "Thread-pool bulkheads", lines: ["tracking=100, payment=50, search=50", "tracking full → its fallback fires", "payments' 50 threads untouched"] },
  ]),
  java_m19_t4: P([
    { h: "Timeout", lines: ["no timeout: blocked until 30s", "@TimeLimiter(2s): throws at 2s", "thread freed, 2.1s vs 30s"] },
    { h: "Fallback tiers", lines: ["static default (fastest)", "cached → degraded", "fail fast (surface error)"] },
  ]),
  // ───── M1 / M2 / M3 fundamentals ─────
  java_m1_t4: P([
    { h: "if / else", lines: ["one condition (diamond)", "two paths: true / false"] },
    { h: "else-if chain", lines: ["cascade of conditions", "only the FIRST true runs"] },
    { h: "switch", lines: ["one value → many cases", "default catches the rest"] },
  ]),
  java_m1_t6: P([
    { h: "Scanner methods", lines: ["System.in → Scanner sc", "nextInt() → 42", "nextLine() → \"Aisha Khan\"", "nextDouble() → 19.99"] },
    { h: "The newline bug + fix", lines: ["nextInt() leaves '\\n' in buffer", "next nextLine() returns '' instantly", "fix: extra throwaway nextLine()"] },
  ]),
  java_m2_t1: P([
    { h: "Reusable methods", lines: ["main() calls showHeader/Content/Footer", "showDivider called from two places", "write once, call many"] },
    { h: "Before vs after", lines: ["BEFORE: 80-line main(), all crammed", "AFTER: 8-line main() + 5 methods", "same program, far clearer"] },
  ]),
  java_m2_t2: P([
    { h: "Parameters → return", lines: ["args flow IN (type name)", "value flows OUT (return type)", "assigned to a variable"] },
    { h: "Clean data flow", lines: ["OLD: static vars leak everywhere", "NEW: params in, return out", "directional, predictable"] },
  ]),
  java_m2_t3: P([
    { h: "Overloads (same name)", lines: ["add(int, int)", "add(double, double)", "add(int, int, int)", "picked by arg TYPE + COUNT"] },
    { h: "NOT valid", lines: ["differ only by return type → ✗", "compiler rejects it", "signature = name + params"] },
  ]),
  java_m2_t4: P([
    { h: "Scope nesting", lines: ["Class scope (static fields)", "  ⊃ Method scope (params, locals)", "    ⊃ Block scope (loop/if vars)", "inner sees outer, not vice versa"] },
    { h: "Lifetime", lines: ["created on entry", "destroyed when block closes", "statics live for the program"] },
  ]),
  java_m3_t2: P([
    { h: "Linear search", lines: ["find 17 in [5,12,3,8,17,22]", "check each: no,no,no,no,yes", "O(n), any order"] },
    { h: "Binary search", lines: ["sorted [3,5,8,12,17,22]", "halve each step → mid 12 → right", "O(log n), needs sorted input"] },
  ]),
  // ───── M20–M27 platform ─────
  java_m20_t2: P([
    { h: "Span waterfall", lines: ["POST /payments  2855ms", "  validateCard  3ms", "  callVisa  2800ms  ← RED", "    processCharge 2795ms", "  savePayment 44ms"] },
    { h: "Propagation", lines: ["traceId in X-B3-TraceId header", "log line: traceId=[abc123] (MDC)"] },
  ]),
  java_m21_t5: P([
    { h: "Blue-Green", lines: ["blue=v1 + green=v2 both run", "Service selector → switch to green", "keep blue for instant rollback"] },
    { h: "Canary", lines: ["95% stable, 5% canary", "watch error rate (0.1% vs 5%)", "rollback at 2% threshold"] },
  ]),
  java_m22_t2: P([
    { h: "Seq Scan", lines: ["reads all 50M rows", "most don't match", "≈ 4.2 s"] },
    { h: "Index Scan", lines: ["B-tree jumps to matches", "retrieves 23 rows", "≈ 0.3 ms"] },
  ]),
  java_m22_t5: P([
    { h: "Load profile", lines: ["ramp 0→100 users over 30s", "then hold at 100", "≈ 498 req/s"] },
    { h: "Results", lines: ["p50 45ms · p95 120ms · p99 195ms", "14,940 reqs, KO 3 (0.02%)", "all assertions PASS ✓"] },
  ]),
  java_m24_t4: P([
    { h: "Strangler proxy", lines: ["router splits legacy vs new", "wk1 0% → wk4 10% → m6 100%", "legacy shrinks, new grows"] },
    { h: "Dark launch", lines: ["shadow traffic hits both", "compare outputs for equality"] },
  ]),
  java_m24_t5: P([
    { h: "Bulkhead", lines: ["HDFC=40, VISA=40, KYC=20 pools", "HDFC slow → fills HDFC pool only", "BulkheadFullException on 41st"] },
    { h: "Sidecar (one Pod)", lines: ["main + Fluent-Bit + Envoy + Vault", "shared volume + localhost", "cross-cutting concerns out of app"] },
  ]),
  java_m25_t3: P([
    { h: "Mutations", lines: ["conditional boundary, negate", "return value, remove void call"] },
    { h: "Killed vs survived", lines: ["tests fail = mutant KILLED (good)", "tests pass = SURVIVED (gap)", "score = killed / (killed+survived)"] },
  ]),
  java_m25_t5: P([
    { h: "Chaos cycle", lines: ["1 steady-state baseline", "2 hypothesize (CB opens at 3s)", "3 inject chaos (latency)", "4 observe (CB OPEN, fallbacks)", "5 improve (fix handling)"] },
    { h: "Chaos Monkey", lines: ["agent on @Service beans", "randomly injects latency", "or throws exceptions"] },
  ]),
  java_m26_t4: P([
    { h: "AiServices", lines: ["@SystemMessage / @UserMessage iface", "builder: model + memory + retriever", "runtime proxy implements it"] },
    { h: "Spring AI vs LangChain4j", lines: ["Spring AI: ChatClient, programmatic", "LC4j: declarative @AiService iface", "both → Claude / OpenAI / Ollama"] },
  ]),
  java_m27_t1: P([
    { h: "One endpoint", lines: ["/graphql for all clients", "Web / iOS / Admin send own shapes", "each gets exactly its fields"] },
    { h: "Resolvers", lines: ["Query { product, products }", "Mutation { createProduct, updatePrice }", "fan out to DB / services / APIs"] },
  ]),
  java_m27_t2: P([
    { h: "Request flow", lines: ["POST /graphql → Web layer", "GraphQL engine parses + validates", "against schema.graphqls"] },
    { h: "@Controller", lines: ["@QueryMapping product/products", "@SchemaMapping Product.reviews"] },
    { h: "Reuse beans", lines: ["same @Service / @Repository", "no changes — just @Controller"] },
  ]),
  java_m27_t3: P([
    { h: "N+1 (naive)", lines: ["200 products → 200 queries", "201 queries total", "≈ 2500 ms"] },
    { h: "DataLoader / @BatchMapping", lines: ["batch IN (P1..P200)", "2 queries total", "≈ 80 ms"] },
  ]),
  // ───── M29 complexity ─────
  java_m29_t1: P([
    { h: "Growth at n = 100", lines: ["O(1)  HashMap.get  → 1", "O(log n)  Binary Search → ~7", "O(n)  Linear Search → 100", "O(n log n)  Merge Sort → ~664", "O(n²)  Bubble Sort → 10,000", "O(2ⁿ)  All Subsets → astronomical"] },
  ]),
  java_m29_t2: P([
    { h: "Merge-sort recursion tree", lines: ["T(n) → 2·T(n/2) → 4·T(n/4) → …", "each level does n work (the merge)", "number of levels = log n", "total = n × log n = O(n log n)"] },
  ]),
  java_m29_t4: P([
    { h: "Best / Worst / Average", lines: ["Quicksort  n log n / n² / n log n", "Binary Search  1 / log n / log n", "Linear  1 / n / n", "HashMap  1 / n / 1"] },
    { h: "ArrayList amortized", lines: ["most add() = O(1)", "resize at 2,4,8,16 (doubling)", "total ≈ 2n → O(1) amortized"] },
  ]),
  // ───── M30.5 / M30 / M31 DSA ─────
  java_m30_5_t4: P([
    { h: "Fully sorted matrix", lines: ["flatten to 1-D of size r×c", "binary search [0 .. r·c−1]", "mid → (mid/cols, mid%cols)"] },
    { h: "Row+col sorted", lines: ["start top-right corner", "bigger → go left; smaller → go down", "O(rows + cols)"] },
  ]),
  java_m30_t2: P([
    { h: "Fixed window k=3", lines: ["[2,3,1] = 6", "[3,1,4] = 8", "[1,4,5] = 10 (max)", "add right, drop left"] },
    { h: "Variable window", lines: ["longest substring no-repeat", "expand right; on dup shrink left", "abcabcbb → 3"] },
  ]),
  java_m30_t4: P([
    { h: "Three regions + pointers", lines: ["[0..low-1] = 0s  (settled)", "[low..mid-1] = 1s", "[mid..high] = unknown", "[high+1..] = 2s  (settled)"] },
    { h: "Moves", lines: ["see 0 → swap low,mid; low++ mid++", "see 1 → mid++", "see 2 → swap mid,high; high--"] },
  ]),
  java_m31_t1: P([
    { h: "String pool", lines: ["literals \"hello\" share one object", "new String(\"hello\") = separate heap", "avoid new String"] },
    { h: "== vs equals", lines: ["s1 == s2 → reference identity", "s1.equals(s2) → content", "StringBuilder: doubling char[] buffer"] },
  ]),
  java_m31_t2: P([
    { h: "LPS table (AABAAB)", lines: ["longest proper prefix == suffix", "lps = [0,1,0,1,2,3]"] },
    { h: "KMP search", lines: ["mismatch at j=5 → j = lps[4] = 2", "i never moves back", "match at position 3"] },
  ]),
  java_m31_t5: P([
    { h: "LCS table", lines: ["match → diagonal + 1", "no match → max(above, left)", "ABCBDAB / BDCAB → 4 (BCAB)"] },
    { h: "Edit distance", lines: ["insert / delete / replace", "horse → ros = 3", "dp[i][j] from 3 neighbours"] },
  ]),
  java_m33_t1: P([
    { h: "Stack (LIFO)", lines: ["push 1, 2, 3 (3 on top)", "pop returns 3 first", "top in, top out"] },
    { h: "Balanced parens ([{}])", lines: ["open → push", "close → pop & match", "empty at end = valid"] },
  ]),
  java_m33_t3: P([
    { h: "Queue (FIFO)", lines: ["offer() adds at tail (right)", "poll() removes head (left)", "first in, first out"] },
    { h: "BFS level-order", lines: ["L0: root", "L1: left, right", "L2: grandchildren", "size snapshot per level"] },
  ]),
  // ───── M4 / M5 / M9 OOP ─────
  java_m4_t2: P([
    { h: "Construction timeline", lines: ["1 new → blank object (zeros/null)", "2 constructor body runs → fields set", "3 reference returned to variable"] },
    { h: "Invalid construction", lines: ["new Product(-1, …)", "validate → IllegalArgumentException", "half-built object discarded"] },
  ]),
  java_m4_t3: P([
    { h: "Encapsulated", lines: ["PRIVATE: holderName, balance", "PUBLIC doors: getters / setters", "direct field access → compile error"] },
    { h: "Why", lines: ["public fields: bad values get in (-50000)", "setter has a validation gate", "object controls its own state"] },
  ]),
  java_m4_t5: P([
    { h: "Static vs instance", lines: ["count = 3 (shared, static)", "p1/p2/p3 each own id, name", "all point to the one count"] },
    { h: "Access", lines: ["static: Product.getCount()", "instance: p1.getPrice()", "static final = constant"] },
  ]),
  java_m4_t6: P([
    { h: "Composition (has-a)", lines: ["Order has-a Customer (1)", "Order has-many LineItem (1..*)", "LineItem has-a Product (1)"] },
    { h: "Module 4 stack", lines: ["4.1 Class → 4.2 Constructor", "4.3 Encapsulation → 4.4 Object methods", "4.5 Static → 4.6 Composition"] },
  ]),
  java_m5_t4: P([
    { h: "Abstract class", lines: ["has state (fields), constructors", "concrete + abstract methods", "extends ONE"] },
    { h: "Interface", lines: ["no fields, no constructors", "abstract methods (+ default)", "implements MANY"] },
    { h: "Comparable", lines: ["compareTo → -/0/+", "this-first / equal / this-second"] },
  ]),
  java_m9_t1: P([
    { h: "Box<T>", lines: ["T used as field, param, return", "Box<String>, Box<Integer>, Box<Product>", "one class, many types"] },
    { h: "Object vs generic", lines: ["Object container: casts + ClassCastException", "generic: no casts, wrong type = compile error", "Pair<A,B>.swap() → Pair<B,A>"] },
  ]),
};

// ── grid-based ──
SPECS.java_m3_t1 = grid([["85", "90", "78", "92", "88"].map((t, i) => ({ t, sub: i }))], { note: "scores[0..4]. Zero-indexed: last = length-1. scores[5] → ArrayIndexOutOfBoundsException." });
SPECS.java_m3_t3 = grid([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]].map((r) => r.map((t) => ({ t }))), { rowLabels: ["Row 0", "Row 1", "Row 2"], colLabels: ["Col 0", "Col 1", "Col 2", "Col 3"], note: "grid[row][col]. Row-major: 1,2,3,4,5… · Column-major: 1,5,9,2,6,10…" });
SPECS.java_m30_5_t2 = grid([["1", "1", "0", "0"], ["1", "0", "0", "1"], ["0", "0", "1", "1"]].map((r) => r.map((t) => ({ t, fill: t === "1" ? GRN : "transparent" }))), { note: "'1' = land, '0' = water. BFS/DFS from each unvisited '1' sinks one island; visited[][] stops revisits. Here: 2 islands." });
SPECS.java_m30_5_t3 = grid([[1, 2, 3], [2, 4, 5], [4, 5, 6]].map((r) => r.map((t) => ({ t }))), { note: "dp[r][c] = grid + min(up, left). Fill row by row; bottom-right = min path cost." });
SPECS.java_m30_t3 = grid([
  [{ t: "3" }, { t: "1" }, { t: "2" }, { t: "5" }, { t: "8" }],
  [{ t: "3" }, { t: "4" }, { t: "6" }, { t: "11" }, { t: "19" }],
], { rowLabels: ["nums", "prefix"], note: "prefix[i] = sum of nums[0..i]. rangeSum(1,3) = nums[1]+nums[2]+nums[3] = 8 = prefix[3] − prefix[0] = 11 − 3." });
SPECS.java_m3_t4 = P([
  { h: "String pool", lines: ["a=\"hello\", b=\"hello\" → one pooled object", "c = new String(\"hello\") → separate object", "a==b true · a==c false · a.equals(c) true"] },
  { h: "Immutability", lines: ["s = \"hello\"; s = s.toUpperCase()", "creates a NEW \"HELLO\"", "original \"hello\" stays, awaits GC"] },
]);

// ── tree-based hierarchies ──
SPECS.java_m4_t4 = tree("Object", [
  { label: "Product", lines: ["toString()", "equals()", "hashCode()"] }, { label: "String" }, { label: "Integer" }, { label: "YourClass" },
], "Every class inherits toString/equals/hashCode. Override them — and keep the contract: equal objects ⇒ equal hashCodes.");
SPECS.java_m5_t1 = tree("Animal", [
  { label: "Dog", lines: ["+ breed", "(name, age)"] }, { label: "Cat", lines: ["+ isIndoor", "(name, age)"] }, { label: "Bird", lines: ["+ wingspan", "(name, age)"] },
], "extends: subclass gets Animal's fields + its own. Access: private no · protected yes · public yes.");
SPECS.java_m4_t1 = tree("Dog (class)", [
  { label: "Rex", lines: ["age 3"] }, { label: "Buddy", lines: ["age 5"] }, { label: "Luna", lines: ["age 2"] },
], "Class = blueprint (fields + bark()). new Dog() makes independent objects — vs fragile parallel name/age/breed arrays.");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  let n = 0, missing = 0;
  for (const [topicId, svg] of Object.entries(SPECS)) {
    if (!/^<svg/.test(svg)) { console.error(`✗ ${topicId}: bad svg`); continue; }
    const r = await T.updateOne({ topicId, "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": svg } });
    if (r.matchedCount === 0) { console.error(`✗ ${topicId}: no topic/visual_aid`); missing++; } else { n++; }
  }
  console.log(`✅ batch visual_aid SVGs: ${n} set${missing ? `, ${missing} missing` : ""} (of ${Object.keys(SPECS).length}).`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });

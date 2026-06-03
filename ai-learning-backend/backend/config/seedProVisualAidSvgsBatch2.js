/**
 * seedProVisualAidSvgsBatch2.js — authored SVGs for the 30 structural visual_aids
 * the auto-renderer can't handle (trees, decision lists, multi-part with no
 * (1)/(2)/Left-Right markers). Same panels/grid/tree generators as batch 1.
 * Sets teaching.visual_aid.svg (renders first, overrides auto-panel). Idempotent.
 *
 * Usage: node config/seedProVisualAidSvgsBatch2.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TINT = ["rgba(10,132,255,0.10)", "rgba(48,209,88,0.10)", "rgba(255,159,10,0.11)", "rgba(191,90,242,0.10)"];
const STRK = ["rgba(10,132,255,0.45)", "rgba(48,209,88,0.45)", "rgba(255,159,10,0.5)", "rgba(191,90,242,0.5)"];

function panels(cols, note) {
  const n = cols.length, W = 760, gap = 12, pad = 11, lineH = 16, headH = 22;
  const colW = Math.floor((W - (n - 1) * gap) / n);
  const maxLines = Math.max(...cols.map((c) => c.lines.length));
  const colH = headH + 8 + maxLines * lineH + 8;
  let g = "";
  cols.forEach((c, i) => {
    const ci = (c.c ?? i) % 4;
    g += `<g transform="translate(${i * (colW + gap)},0)">`
      + `<rect width="${colW}" height="${colH}" rx="10" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`
      + `<text x="${pad}" y="17" font-weight="700" font-size="12.5">${esc(c.h)}</text>`
      + c.lines.map((ln, j) => `<text x="${pad}" y="${headH + 15 + j * lineH}" font-size="11" opacity="0.82">${esc(ln)}</text>`).join("")
      + `</g>`;
  });
  const H = colH + (note ? 20 : 0);
  const nt = note ? `<text x="2" y="${colH + 15}" font-size="11" opacity="0.65">${esc(note)}</text>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;font-family:ui-sans-serif,system-ui" fill="currentColor">${g}${nt}</svg>`;
}
function tree(root, children, note) {
  const W = 760, boxW = 168, boxH = 38, topY = 8, gapY = 52, cx = W / 2;
  let g = `<g transform="translate(${cx - boxW / 2},${topY})"><rect width="${boxW}" height="${boxH}" rx="10" fill="${TINT[3]}" stroke="${STRK[3]}"/><text x="${boxW / 2}" y="${boxH / 2 + 5}" text-anchor="middle" font-weight="700" font-size="13">${esc(root)}</text></g>`;
  const n = children.length, step = (W - 16) / n, childY = topY + boxH + gapY;
  let maxLines = 0;
  children.forEach((ch, i) => {
    const x = 16 + step * i + step / 2, lines = ch.lines || []; maxLines = Math.max(maxLines, lines.length);
    const h = 32 + lines.length * 13, ci = (ch.c ?? i) % 4;
    g += `<line x1="${cx}" y1="${topY + boxH}" x2="${x}" y2="${childY}" stroke="rgba(120,120,128,0.5)"/>`
      + `<g transform="translate(${x - boxW / 2},${childY})"><rect width="${boxW}" height="${h}" rx="10" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`
      + `<text x="${boxW / 2}" y="18" text-anchor="middle" font-weight="700" font-size="12">${esc(ch.label)}</text>`
      + lines.map((l, j) => `<text x="9" y="${32 + j * 13}" font-size="10" opacity="0.78">${esc(l)}</text>`).join("") + `</g>`;
  });
  const H = childY + 32 + maxLines * 13 + (note ? 20 : 6);
  const nt = note ? `<text x="2" y="${H - 6}" font-size="11" opacity="0.65">${esc(note)}</text>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;font-family:ui-sans-serif,system-ui" fill="currentColor">${g}${nt}</svg>`;
}
const P = panels;

const SPECS = {
  java_m7_t2: tree("Throwable", [
    { label: "Error (don't catch)", c: 2, lines: ["OutOfMemoryError", "StackOverflowError", "JVM-level, fatal"] },
    { label: "RuntimeException", c: 1, lines: ["UNCHECKED", "NullPointer, ArrayIndexOOB", "compiler optional"] },
    { label: "IOException, SQLException", c: 0, lines: ["CHECKED", "extends Exception", "compiler mandatory"] },
  ], "Extends RuntimeException ⇒ unchecked. else extends Exception ⇒ checked. Recover? catch. Caller has more context? throws."),
  java_m6_t5: tree("What collection?", [
    { label: "Look up by key?", c: 0, lines: ["→ Map", "HashMap / TreeMap", "LinkedHashMap"] },
    { label: "Need uniqueness?", c: 1, lines: ["→ Set", "HashSet / TreeSet", "LinkedHashSet"] },
    { label: "Otherwise", c: 3, lines: ["→ List", "ArrayList (random access)", "LinkedList (ends)"] },
  ], "HashMap/HashSet O(1) · TreeMap/TreeSet O(log n), sorted · ArrayList O(1) get, LinkedList O(1) ends."),
  java_m30_t1: P([
    { h: "Two pointers, inward", lines: ["[1,3,5,7,9,11], target 12", "lo=0 (1) + hi=5 (11) = 12 → FOUND"] },
    { h: "When sum ≠ target", lines: ["sum < target → lo++ (need bigger)", "sum > target → hi-- (need smaller)", "target 14: 1+11<14→lo++; 3+11=14 ✓"] },
  ], "lo and hi together cross the array once → O(n)."),
  java_m1_t5: P([
    { h: "for", lines: ["init → condition → body", "→ update → back to condition", "known count"] },
    { h: "while", lines: ["condition → body → repeat", "may run 0 times", "unknown count"] },
    { h: "do-while", lines: ["body → condition → repeat", "runs at least once", "menus, retries"] },
  ], "Infinite-loop trap: the update never changes the condition → loops forever."),
  java_m5_t3: P([
    { h: "abstract Shape", lines: ["area() — abstract (no body)", "printInfo() — concrete", "cannot: new Shape()  ·  can: new Circle()"] },
    { h: "Template Method", lines: ["process() calls read/validate/transform", "parent defines WHEN (the steps)", "child defines HOW (each step)"] },
  ]),
  java_m5_t5: P([
    { h: "Comparable", lines: ["built INTO the class", "compareTo() — one natural order", "Collections.sort(list)"] },
    { h: "Comparator", lines: ["EXTERNAL objects", "ByName / ByPrice / ByDiscount", "many orders for the same list"] },
  ], "One obvious order → Comparable. Multiple/flexible orders → Comparator. Need both → use both."),
  java_m6_t3: P([
    { h: "List", lines: ["ordered sequence", "allows duplicates", "get by index"] },
    { h: "Map", lines: ["key → value pairs", "O(1) lookup by key"] },
    { h: "Set", lines: ["unique elements", "O(1) contains", "backed by a HashMap"] },
  ], "Set ops: union (all) · intersection (overlap) · difference (A − B). List.contains O(n) vs Set.contains O(1)."),
  java_m8_t2: P([
    { h: "Predicate", c: 0, lines: ["T → boolean", "test()", "filter()"] },
    { h: "Function", c: 1, lines: ["T → R", "apply()", "map()"] },
    { h: "Consumer", c: 2, lines: ["T → void", "accept()", "forEach()"] },
    { h: "Supplier", c: 3, lines: ["() → T", "get()", "lazy / produce"] },
  ], "Compose: predicate.and(other) · function.andThen(next). Method refs: Class::method."),
  java_m9_t2: P([
    { h: "Generic method anatomy", lines: ["public <T> T pick(T a, T b)", "<T> = type-param declaration", "T used in return + params"] },
    { h: "Type inference", lines: ["pass List<String>", "compiler infers T = String", "return is String — no cast"] },
  ], "Method-level <T>: one method is generic. Class-level <T>: the whole class shares the type."),
  java_m9_t5: P([
    { h: "Repository<T,ID>", c: 0, lines: ["save / findById / delete", "default exists()"] },
    { h: "Mapper<S,T>", c: 1, lines: ["mapTo / mapFrom", "default mapAllTo()"] },
    { h: "Strategy<T>", c: 2, lines: ["algorithm() + name()", "swap behaviour"] },
    { h: "Builder<T>", c: 3, lines: ["fluent setters", "build()"] },
  ], "Spring Data chain you now understand: CrudRepository → JpaRepository → UserRepository."),
  java_m11_t4: P([
    { h: "Request", lines: ["method (GET/POST), URI", "headers (Authorization, Content-Type)", "body (for POST/PUT)"] },
    { h: "Response", lines: ["statusCode 2xx/4xx/5xx", "headers (Content-Type, Retry-After)", "body (JSON)"] },
    { h: "Builder + parse", lines: [".uri().GET().header().build()", "send() over the network", "body() → mapper.readValue()"] },
  ], "2xx success · 4xx client error · 5xx server error."),
  java_m19_t1: P([
    { h: "CLOSED", c: 1, lines: ["business as usual", "track sliding window", "≥50% fail → OPEN"] },
    { h: "OPEN", c: 2, lines: ["fast-fail to fallback (0ms)", "wait 30s", "→ HALF-OPEN"] },
    { h: "HALF-OPEN", c: 0, lines: ["probe N test calls", "all pass → CLOSED", "any fail → OPEN"] },
  ], "Without CB: thousands of threads block on a dead dependency. With CB: instant fallback, 0 blocking."),
  java_m20_t1: P([
    { h: "Emit", lines: ["Micrometer in the app", "/actuator/prometheus"] },
    { h: "Scrape", lines: ["Prometheus pulls every 15s", "time-series storage"] },
    { h: "Visualize + alert", lines: ["Grafana dashboards", "p99 > 500ms → PagerDuty"] },
  ], "Three pillars: Metrics (here) · Traces (20.2) · Logs (20.3)."),
  java_m20_t3: P([
    { h: "Unstructured", c: 2, lines: ["plain text blob", "hard to parse/query"] },
    { h: "Structured JSON", c: 1, lines: ["key → value pairs", "machine-readable, queryable"] },
    { h: "MDC context", c: 0, lines: ["filter adds requestId/userId", "every log line carries it", "auto-correlated"] },
  ]),
  java_m21_t1: P([
    { h: "Stage 1 — builder (JDK)", lines: ["mvn compiles the JAR", "layertools extracts layers"] },
    { h: "Stage 2 — runtime (JRE-alpine)", lines: ["COPY deps/loader/snapshot/app", "180 MB (vs 450 MB w/ JDK)"] },
  ], "Compose: app depends_on postgres + redis + zipkin (all healthchecked)."),
  java_m21_t2: P([
    { h: "Deployment", lines: ["3 pods spread across 3 nodes", "label app: payment-service"] },
    { h: "ClusterIP Service", lines: ["stable internal IP", "round-robins to the pods", "rolling update: ready probe → swap"] },
  ]),
  java_m21_t3: P([
    { h: "ConfigMap", lines: ["mounted as a file", "/app/config/application.yml", "non-secret config"] },
    { h: "Secret", lines: ["injected as env var", "SPRING_DATASOURCE_PASSWORD", "kept out of the image"] },
  ], "Same image tag across dev/stage/prod — only the ConfigMap/Secret values differ."),
  java_m21_t4: P([
    { h: "test", lines: ["unit + integration", "(run in parallel)"] },
    { h: "build-push", lines: ["Docker build", "push to GHCR"] },
    { h: "deploy-staging", lines: ["kubectl set image", "rollout status", "env approval gate"] },
  ], "git push → Actions. Jobs chain: test → build-push → deploy-staging."),
  java_m22_t4: P([
    { h: "L1 — Caffeine", c: 1, lines: ["in-process, 30s TTL", "hit ≈ 0.1ms", "~40% of requests"] },
    { h: "L2 — Redis", c: 0, lines: ["shared, 5min TTL", "hit ≈ 1ms, repopulates L1", "~55%"] },
    { h: "DB", c: 2, lines: ["≈ 5ms", "repopulates Redis + L1", "~5% (mutex vs stampede)"] },
  ]),
  java_m23_t1: P([
    { h: "Get a token", lines: ["POST /auth/token (credentials)", "Auth server returns a JWT"] },
    { h: "Use it", lines: ["Authorization: Bearer <jwt>", "filter validates signature (JWK)", "claims → SecurityContext"] },
    { h: "Forged token", c: 2, lines: ["signature check fails", "401 Unauthorized"] },
  ]),
  java_m24_t2: P([
    { h: "Event log (append-only)", lines: ["PaymentInitiated(5000)", "ProcessingStarted(B123)", "BankTimeout → PaymentFailed"] },
    { h: "Rebuild state", lines: ["replay events → current state", "snapshot every N to skip replay", "query 'state at t=2' → PROCESSING"] },
  ]),
  java_m25_t4: P([
    { h: "Load", c: 1, lines: ["ramp to 1000, hold 10min", "p99 stays stable", "verify normal capacity"] },
    { h: "Stress", c: 2, lines: ["100→1000→5000 staircase", "errors + p99 explode at 5000", "find the breaking point"] },
    { h: "Soak", c: 0, lines: ["500 users for 8 hours", "response time creeps up", "= memory-leak signal"] },
  ]),
  java_m26_t2: P([
    { h: "Ingestion (once)", lines: ["PDFs → split into chunks", "EmbeddingModel → vectors", "store in pgvector"] },
    { h: "Query (each request)", lines: ["question → embed → similarity", "top-3 chunks (cosine)", "chunks + question → Claude → answer"] },
  ]),
  java_m27_t5: P([
    { h: "GraphQlTester", lines: ["runs the GraphQL engine", "resolvers + schema + errors", "asserts typed responses"] },
    { h: "@GraphQlTest", lines: ["loads @Controller + schema only", "@MockBean the services", "faster than @SpringBootTest"] },
  ], "MockMvc only checks status + raw JSON; GraphQlTester validates GraphQL semantics."),
  java_m30_5_t5: P([
    { h: "Which 2D technique?", lines: ["shortest path → BFS", "connected component → DFS", "min cost over all paths → DP", "grid is sorted → binary search", "just visit in order → traversal"] },
  ]),
  java_m30_t5: P([
    { h: "Which array pattern?", lines: ["pair / triplet → Two Pointers", "contiguous subarray → Sliding Window", "range query → Prefix Sum", "3 categories → Dutch National Flag", "max sum → Kadane"] },
  ]),
  java_m31_t4: P([
    { h: "Key = sorted letters", lines: ["eat → aet · tea → aet · ate → aet", "tan → ant · nat → ant", "bat → abt"] },
    { h: "Group in a HashMap", lines: ["aet → [eat, tea, ate]", "ant → [tan, nat]", "abt → [bat]"] },
  ]),
  java_m32_t1: P([
    { h: "Node + traversal", lines: ["Node = [ val | next ]", "1 → 2 → 3 → null", "walk: cur = cur.next"] },
    { h: "Dummy head", lines: ["[dummy] → [1] → [2] → [3]", "delete: prev.next = curr.next", "insert: new.next=cur.next; cur.next=new"] },
  ]),
  java_m32_t3: P([
    { h: "Reverse 1 → 2 → 3", lines: ["prev=null, curr=1", "save next; curr.next=prev", "prev=curr; curr=next; repeat"] },
    { h: "Steps", lines: ["1.next=null  (prev=1)", "2.next=1     (prev=2)", "3.next=2     (prev=3) → return 3"] },
  ], "Result: 3 → 2 → 1 → null."),
  java_m32_t4: P([
    { h: "Phase 1 — detect", lines: ["slow +1, fast +2", "if they meet → a cycle exists", "(no meet → fast hits null)"] },
    { h: "Phase 2 — find entry", lines: ["reset slow to head", "advance both by 1", "they meet at the cycle start"] },
  ]),
  java_m33_t4: P([
    { h: "Monotonic deque", lines: ["holds indices, values decreasing", "front = current window max", "pop back while smaller arrives"] },
    { h: "Trace [1,3,-1,-3,5,3,6,7] k=3", lines: ["windows max: 3, 3, 5, 5, 6, 7", "drop indices outside the window", "each index pushed/popped once → O(n)"] },
  ]),
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  let n = 0, missing = 0;
  for (const [topicId, svg] of Object.entries(SPECS)) {
    if (!/^<svg/.test(svg)) { console.error(`✗ ${topicId}: bad svg`); continue; }
    const r = await T.updateOne({ topicId, "teaching.visual_aid": { $exists: true } }, { $set: { "teaching.visual_aid.svg": svg } });
    if (r.matchedCount === 0) { console.error(`✗ ${topicId}: no topic/visual_aid`); missing++; } else { n++; }
  }
  console.log(`✅ batch-2 visual_aid SVGs: ${n} set${missing ? `, ${missing} missing` : ""} (of ${Object.keys(SPECS).length}).`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });

/**
 * seedProVisualAidBatch4.js — visual aids for M34–M51, which were authored
 * WITHOUT a teaching.visual_aid (they have concept_explanation + reflection).
 * Each diagram is authored from the topic name + its reflection.key_takeaways.
 * Writes the FULL teaching.visual_aid object {type, description, alt_text, svg}.
 *
 * Diagram-worthy DSA/structural topics only; pure-narrative topics (behavioral
 * stories, mock-timing, company prep) are intentionally skipped — see
 * JAVA_VISUAL_AID_AUDIT_M34.md. Idempotent.
 *
 * Run: node config/seedProVisualAidBatch4.js [topicId ...]   (no args = all)
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
  + `<marker id="ahg" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="${GRN}"/></marker></defs>${inner}</svg>`;
const box = (x, y, w, h, ci, rx = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>`;
const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" font-weight="${o.w || 400}" text-anchor="${o.a || "start"}" opacity="${o.o ?? 1}"${o.fill ? ` fill="${o.fill}"` : ""}${o.mono ? ' font-family="ui-monospace,Menlo,monospace"' : ""}>${esc(t)}</text>`;
const arr = (x1, y1, x2, y2, k = "", l) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${k === "g" ? GRN : ARR}" marker-end="url(#${k === "g" ? "ahg" : "ah"})"/>` + (l ? txt((x1 + x2) / 2, (y1 + y2) / 2 - 3, l, { a: "middle", s: 9, o: 0.8 }) : "");
const edge = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ARR}" opacity="0.7"/>`;
const title = (x, t) => txt(x, 15, t, { w: 700, s: 12.5, o: 0.88 });
const vcell = (x, y, w, h, val, ci, o = {}) => box(x, y, w, h, ci) + txt(x + w / 2, y + h / 2 + 4, val, { a: "middle", mono: true, s: o.s || 12, w: o.w || 700, fill: o.fill });
const tnode = (cx, cy, t, ci = 0, r = 16) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>` + txt(cx, cy + 4, String(t), { a: "middle", s: 10, w: 600 });
// linked-list node [val|next]
const ll = (x, y, val, ci = 0) => box(x, y, 56, 26, ci) + `<line x1="${x + 38}" y1="${y}" x2="${x + 38}" y2="${y + 26}" stroke="${STRK[ci]}"/>` + txt(x + 19, y + 18, String(val), { a: "middle", mono: true, s: 10, w: 700 }) + txt(x + 47, y + 18, "•", { a: "middle", s: 12 });

// ════════════ M34 — Hash Tables ════════════
function m34_t1() {
  let g = title(14, "HashMap internals — buckets + hashCode()");
  for (let i = 0; i < 8; i++) g += vcell(30 + i * 44, 40, 40, 26, String(i), i === 3 ? 0 : 5, { s: 10, w: 500 });
  g += box(30, 96, 110, 28, 1) + txt(85, 114, '"apple"', { a: "middle", mono: true, s: 10 });
  g += arr(140, 110, 200, 110) + box(200, 96, 150, 28, 2) + txt(275, 114, "hashCode() % 8 = 3", { a: "middle", mono: true, s: 9 });
  g += arr(160, 96, 156, 68, "g");
  g += ll(380, 95, "apple", 0) + arr(436, 108, 466, 108) + ll(466, 95, "grape", 0) + txt(530, 112, "← collision chain", { s: 8.5, o: 0.6 });
  g += txt(30, 150, "O(1) avg · O(n) worst (all collide). getOrDefault(k,0) / merge(k,1,Integer::sum) for safe counting.", { s: 9, o: 0.8 });
  return { svg: svg(760, 168, g), desc: "HashMap stores entries in a bucket array; a key's hashCode() picks the bucket index, collisions chain in a linked list. O(1) average, O(n) worst case. Use getOrDefault/merge for frequency counting.", alt: "HashMap bucket array with hashing and collision chain" };
}
function m34_t2() {
  let g = title(14, "HashMap patterns");
  g += txt(30, 38, "Group Anagrams — sorted chars = key", { s: 10, w: 600 });
  ["eat", "tea", "ate"].forEach((w, i) => g += box(30 + i * 70, 46, 62, 26, 0) + txt(61 + i * 70, 63, w, { a: "middle", mono: true, s: 10 }));
  g += arr(245, 59, 290, 59, "", "sort") + box(290, 46, 70, 26, 2) + txt(325, 63, '"aet"', { a: "middle", mono: true, s: 10 });
  g += arr(360, 59, 400, 59) + box(400, 46, 200, 26, 1) + txt(500, 63, "{eat, tea, ate}", { a: "middle", mono: true, s: 9.5 });
  g += txt(30, 100, "Top K Frequent — freq map → min-heap(size k) → O(n log k)", { s: 9.5, o: 0.85 });
  g += txt(30, 122, "Bijection (Word Pattern / Isomorphic) — needs TWO maps, both directions", { s: 9.5, o: 0.85 });
  return { svg: svg(760, 140, g), desc: "HashMap patterns: Group Anagrams uses sorted chars as the key; Top-K Frequent pairs a frequency map with a size-k min-heap; bijection problems need two maps (both directions).", alt: "HashMap grouping and frequency patterns" };
}
function m34_t3() {
  let g = title(14, "HashSet — dedup, window, intersection");
  g += box(30, 40, 220, 30, 1) + txt(140, 60, "seen.add(n) → false", { a: "middle", mono: true, s: 10 }) + txt(270, 60, "duplicate found!", { s: 9.5, fill: RED });
  g += txt(30, 96, "Sliding window: add new element; when window.size() > k, remove the oldest", { s: 9.5, o: 0.85 });
  g += txt(30, 118, "Intersection: a.retainAll(b)   ·   HashSet = HashMap with dummy values, O(1) ops", { s: 9.5, o: 0.85 });
  return { svg: svg(760, 136, g), desc: "HashSet gives O(1) add/contains. add() returns false if the element is already present (instant duplicate detection). Sliding-window keeps size ≤ k; retainAll computes intersection.", alt: "HashSet duplicate detection and sliding window" };
}
function m34_t4() {
  let g = title(14, "Custom hash keys");
  g += box(30, 40, 110, 28, 0) + txt(85, 58, "(row, col)", { a: "middle", mono: true, s: 9.5 }) + arr(140, 54, 180, 54) + box(180, 40, 120, 28, 1) + txt(240, 58, '"r,c"', { a: "middle", mono: true, s: 10 });
  g += box(30, 80, 110, 28, 0) + txt(85, 98, "anagram", { a: "middle", s: 9.5 }) + arr(140, 94, 180, 94, "", "sort") + box(180, 80, 120, 28, 1) + txt(240, 98, '"aet"', { a: "middle", mono: true, s: 10 });
  g += box(30, 120, 110, 28, 0) + txt(85, 138, "pair (x,y)", { a: "middle", mono: true, s: 9.5 }) + arr(140, 134, 180, 134) + box(180, 120, 240, 28, 1) + txt(300, 138, "(long)x << 32 | y", { a: "middle", mono: true, s: 9.5 });
  g += txt(440, 98, "one key → O(1) HashMap lookup; no separator collisions with the long-pack trick.", { s: 9, o: 0.7 });
  return { svg: svg(760, 164, g), desc: "Build composite keys for HashMap lookups: \"row,col\" for grid cells, sorted chars for anagrams, and (long)x<<32|y to pack a pair into one collision-free key.", alt: "Composite hash key construction" };
}
function m34_t5() {
  let g = title(14, "LRU Cache — HashMap + doubly linked list");
  g += box(30, 44, 150, 70, 0) + txt(105, 40, "HashMap key→node", { a: "middle", s: 9, o: 0.6 }) + txt(105, 70, "k1 → •", { a: "middle", mono: true, s: 9 }) + txt(105, 88, "k2 → •", { a: "middle", mono: true, s: 9 }) + txt(105, 106, "k3 → •", { a: "middle", mono: true, s: 9 });
  g += txt(220, 40, "doubly linked list (recency order)", { s: 9, o: 0.6 });
  g += box(220, 60, 90, 30, 1) + txt(265, 79, "head MRU", { a: "middle", s: 8.5 });
  ["k1", "k2"].forEach((k, i) => g += box(330 + i * 110, 60, 90, 30, 5) + txt(375 + i * 110, 79, k, { a: "middle", mono: true, s: 9 }) + arr(310 + i * 110, 75, 330 + i * 110, 75));
  g += arr(530, 75, 550, 75) + box(550, 60, 90, 30, 4) + txt(595, 79, "tail LRU", { a: "middle", s: 8.5 });
  g += txt(30, 138, "get(k): move node to head.   put(k,v): add at head; if full, evict tail.   All O(1).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 156, g), desc: "LRU cache = HashMap(key→node) + doubly linked list ordered by recency. get() moves the node to the head (most-recently-used); put() adds at head and evicts the tail when full. O(1) get and put.", alt: "LRU cache: hashmap plus doubly linked list" };
}

// ════════════ M35 — Trees & BST ════════════
// standard 7-node binary tree coords (root 1)
const TREE = { 1: [380, 36], 2: [250, 90], 3: [510, 90], 4: [180, 146], 5: [320, 146], 6: [440, 146], 7: [580, 146] };
function bintree(labels, colorFn) {
  let g = "";
  g += edge(380, 36, 250, 90) + edge(380, 36, 510, 90) + edge(250, 90, 180, 146) + edge(250, 90, 320, 146) + edge(510, 90, 440, 146) + edge(510, 90, 580, 146);
  for (const k of [1, 2, 3, 4, 5, 6, 7]) { const [x, y] = TREE[k]; g += tnode(x, y, labels[k], colorFn ? colorFn(k) : 0); }
  return g;
}
function m35_t1() {
  let g = title(14, "Tree traversals");
  g += bintree({ 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7" });
  g += txt(30, 186, "Inorder (L,node,R):  4 2 5 1 6 3 7", { mono: true, s: 9.5 });
  g += txt(30, 204, "Level-order (BFS):   1 | 2 3 | 4 5 6 7   (size-snapshot per level)", { mono: true, s: 9.5 });
  g += txt(30, 222, "Zigzag:              1 | 3 2 | 4 5 6 7   (alternate direction)", { mono: true, s: 9.5 });
  return { svg: svg(760, 236, g), desc: "Binary tree traversals: inorder (left, node, right) → 4 2 5 1 6 3 7; level-order BFS uses a per-level size snapshot; zigzag alternates direction each level.", alt: "Binary tree with inorder, level-order, zigzag traversals" };
}
function m35_t2() {
  let g = title(14, "Lowest Common Ancestor (LCA)");
  g += bintree({ 1: "3", 2: "5", 3: "1", 4: "6", 5: "2", 6: "0", 7: "8" }, (k) => k === 2 ? 1 : (k === 4 || k === 5 ? 2 : 0));
  g += txt(180, 174, "p", { a: "middle", s: 11, w: 700, fill: GRN }) + txt(320, 174, "q", { a: "middle", s: 11, w: 700, fill: "#ff9f0a" });
  g += txt(30, 200, "node 5 is the LCA of 6 and 2: both subtrees return non-null → this node is the answer.", { s: 9.5, o: 0.85 });
  g += txt(30, 220, "if root == p || root == q → return root.", { mono: true, s: 9, o: 0.7 });
  return { svg: svg(760, 234, g), desc: "Lowest Common Ancestor: recurse left and right; if both return non-null, the current node is the LCA. If root equals p or q, return root. Here node 5 is the LCA of 6 and 2.", alt: "Binary tree highlighting lowest common ancestor" };
}
function m35_t3() {
  let g = title(14, "BST operations — validate & delete");
  g += bintree({ 1: "8", 2: "3", 3: "10", 4: "1", 5: "6", 6: "9", 7: "14" });
  g += txt(30, 186, "Validate: pass a (lo, hi) range down — not just compare with parent.", { s: 9.5, o: 0.85 });
  g += txt(30, 206, "Delete a 2-child node: replace with inorder successor (leftmost of right subtree).", { s: 9.5, o: 0.85 });
  g += txt(30, 226, "Kth smallest: inorder, stop at k.   BST LCA / search: use ordering → O(h).", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 240, g), desc: "BST (left < node < right). Validate by passing a (lo,hi) range down. Delete a node with two children by replacing it with its inorder successor (leftmost of the right subtree). Kth-smallest = inorder stop at k.", alt: "Binary search tree with validation and deletion rules" };
}
function m35_t4() {
  let g = title(14, "Tree path sum (target = 20)");
  g += bintree({ 1: "5", 2: "4", 3: "8", 4: "11", 5: "·", 6: "·", 7: "·" }, (k) => (k === 1 || k === 2 || k === 4) ? 1 : 5);
  g += txt(30, 186, "Highlighted root→leaf path 5 → 4 → 11 sums to 20 ✓ — subtract target at each node, check ==0 at the leaf.", { s: 9, o: 0.85 });
  g += txt(30, 206, "Path Sum II: backtrack — add node, recurse, then remove last.", { s: 9.5, o: 0.8 });
  g += txt(30, 226, "Path Sum III: prefix-sum HashMap during DFS; put(0,1); undo on the way back.", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 240, g), desc: "Root-to-leaf path sum: subtract the target at each node and check ==0 at a leaf. Path Sum II backtracks the current path; Path Sum III uses a prefix-sum HashMap during DFS (put(0,1), undo on return).", alt: "Binary tree with a highlighted root-to-leaf path" };
}
function m35_t5() {
  let g = title(14, "Trie — prefix tree (cat, car, card)");
  g += tnode(60, 90, "•", 5);
  g += edge(76, 90, 150, 90) + tnode(166, 90, "c", 0);
  g += edge(182, 90, 250, 90) + tnode(266, 90, "a", 0);
  g += edge(282, 84, 350, 60) + tnode(366, 60, "t", 1) + txt(366, 44, "end", { a: "middle", s: 8, fill: GRN });
  g += edge(282, 96, 350, 120) + tnode(366, 120, "r", 1) + txt(330, 124, "end", { a: "end", s: 8, fill: GRN });
  g += edge(382, 120, 450, 120) + tnode(466, 120, "d", 1) + txt(466, 148, "end", { a: "middle", s: 8, fill: GRN });
  g += txt(540, 80, "node: Trie[26] ch; boolean end", { mono: true, s: 8.5, o: 0.75 });
  g += txt(540, 100, "insert / search / startsWith", { s: 9, o: 0.75 });
  g += txt(540, 116, "all O(m), m = word length", { s: 9, o: 0.7 });
  return { svg: svg(760, 176, g), desc: "A trie (prefix tree) stores words character by character; shared prefixes share nodes. 'end' marks a complete word. Insert, search, and startsWith are all O(m) where m is the word length. Here: cat, car, card.", alt: "Trie prefix tree for cat, car, card" };
}

// ════════════ M36 — Heaps ════════════
function m36_t1() {
  let g = title(14, "Heap — complete binary tree + array");
  const H = { 1: [330, 40, "2"], 2: [260, 90, "4"], 3: [400, 90, "5"], 4: [220, 140, "8"], 5: [300, 140, "7"], 6: [370, 140, "6"], 7: [440, 140, "9"] };
  g += edge(330, 40, 260, 90) + edge(330, 40, 400, 90) + edge(260, 90, 220, 140) + edge(260, 90, 300, 140) + edge(400, 90, 370, 140) + edge(400, 90, 440, 140);
  for (const k of [1, 2, 3, 4, 5, 6, 7]) g += tnode(H[k][0], H[k][1], H[k][2], 1);
  g += txt(520, 70, "min-heap:", { s: 9.5, w: 600 }) + txt(520, 86, "parent ≤ children", { s: 9, o: 0.75 });
  [2, 4, 5, 8, 7, 6, 9].forEach((v, i) => g += vcell(190 + i * 50, 170, 46, 26, String(v), 5, { s: 10 }) + txt(190 + i * 50 + 23, 210, String(i), { a: "middle", s: 8, o: 0.6 }));
  g += txt(30, 234, "offer/poll O(log n) · peek O(1) · parent=(i-1)/2, children=2i+1, 2i+2 · max-heap = reverseOrder()", { s: 9, o: 0.8 });
  return { svg: svg(760, 248, g), desc: "A heap is a complete binary tree (min-heap: every parent ≤ its children) stored in an array — parent at (i-1)/2, children at 2i+1/2i+2. PriorityQueue is a min-heap by default; offer/poll are O(log n), peek O(1).", alt: "Min-heap as binary tree and array" };
}
function m36_t2() {
  let g = title(14, "K largest — min-heap of size k (k=3)");
  g += edge(140, 50, 100, 95) + edge(140, 50, 180, 95);
  g += tnode(140, 50, "5", 1) + tnode(100, 95, "8", 1) + tnode(180, 95, "9", 1);
  g += txt(140, 130, "min on top = kth largest", { a: "middle", s: 9, o: 0.7 });
  g += box(300, 38, 130, 28, 0) + txt(365, 56, "incoming num", { a: "middle", s: 9 });
  g += arr(430, 52, 480, 52, "", "offer") + box(480, 38, 240, 28, 4) + txt(600, 56, "if size > k → poll() smallest", { a: "middle", s: 9 });
  g += txt(300, 100, "Top-K Frequent: freq map → min-heap size k → O(n log k)", { s: 9.5, o: 0.85 });
  g += txt(300, 122, "K Closest: max-heap size k on distance², evict farthest", { s: 9.5, o: 0.85 });
  return { svg: svg(760, 150, g), desc: "To keep the K largest, maintain a min-heap of size k: offer each element, and when size exceeds k poll the smallest. The heap's top is the kth largest. O(n log k).", alt: "Min-heap of size k for K-largest" };
}
function m36_t3() {
  let g = title(14, "Priority-queue design");
  g += txt(30, 38, "Lazy deletion:", { s: 10, w: 600 });
  g += box(150, 28, 200, 24, 5) + txt(160, 44, "removed = {x: true} in HashMap", { mono: true, s: 8.5 });
  g += txt(30, 64, "on poll(): skip elements marked removed (avoids O(n) heap removal)", { s: 9, o: 0.8 });
  g += txt(30, 96, "Task Scheduler — idle math:", { s: 10, w: 600 });
  g += box(220, 86, 360, 26, 2) + txt(400, 103, "(maxFreq − 1)·(n + 1) + maxCount  vs  tasks.length", { a: "middle", mono: true, s: 9 });
  g += txt(30, 132, "Reorganize String: always place the highest-frequency char ≠ the last one placed.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 148, g), desc: "PQ design tricks: lazy deletion marks entries removed in a HashMap and skips them on poll (avoids O(n) removal). Task Scheduler computes idle slots as (maxFreq-1)·(n+1)+maxCount. Reorganize String greedily places the most frequent char that differs from the last.", alt: "Priority queue lazy deletion and task scheduler" };
}
function m36_t4() {
  let g = title(14, "K-way merge — heap of list heads");
  [["[1, 4, 7]"], ["[2, 5, 8]"], ["[3, 6, 9]"]].forEach(([l], i) => g += box(30, 42 + i * 32, 120, 24, 0) + txt(90, 58 + i * 32, l, { a: "middle", mono: true, s: 9.5 }));
  g += arr(150, 74, 195, 74, "", "heads");
  g += box(195, 54, 140, 40, 1) + txt(265, 70, "min-heap {1,2,3}", { a: "middle", mono: true, s: 9 }) + txt(265, 86, "extract 1 → push 4", { a: "middle", s: 8, o: 0.7 });
  g += arr(335, 74, 380, 74, "g") + box(380, 54, 340, 40, 1) + txt(550, 78, "merged: 1 2 3 4 5 6 7 8 9", { a: "middle", mono: true, s: 11, w: 700 });
  g += txt(30, 150, "Push all heads; repeatedly extract the min and push that list's next. O(N log K).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 166, g), desc: "Merge K sorted lists with a min-heap: push all heads, then repeatedly extract the minimum and push the next node from that list. O(N log K). Same idea for K-closest points and kth-smallest in a sorted matrix.", alt: "K-way merge using a min-heap of heads" };
}
function m36_t5() {
  let g = title(14, "Meeting Rooms II — min-heap of end times");
  // intervals on a timeline
  const iv = [[40, 200, "A"], [120, 320, "B"], [260, 440, "C"]];
  iv.forEach(([x1, x2, lbl], i) => { const y = 40 + i * 26; g += box(x1, y, x2 - x1, 18, [0, 2, 1][i], 4) + txt(x1 + 6, y + 13, lbl, { s: 9, w: 600 }); });
  g += txt(30, 128, "Sort by start; min-heap of end times. If earliest end ≤ next start → reuse room, else add one.", { s: 9.5, o: 0.85 });
  g += txt(30, 150, "max simultaneous overlaps (here 3) = rooms needed. Also: Car Pooling, IPO (two heaps).", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 166, g), desc: "Meeting Rooms II: sort intervals by start, keep a min-heap of end times. The peak number of overlapping intervals equals the rooms needed. The min-heap reuses a room when its earliest end ≤ the next start.", alt: "Overlapping intervals with a min-heap of end times" };
}

// ════════════ M37 — Graphs ════════════
const GNODES = { 0: [120, 60], 1: [260, 50], 2: [260, 130], 3: [400, 60], 4: [400, 140] };
function m37_t1() {
  let g = title(14, "Graph — adjacency list, BFS, DFS");
  g += edge(120, 60, 260, 50) + edge(120, 60, 260, 130) + edge(260, 50, 400, 60) + edge(260, 130, 400, 140) + edge(260, 50, 260, 130);
  for (const k of [0, 1, 2, 3, 4]) g += tnode(GNODES[k][0], GNODES[k][1], k, 0);
  g += txt(480, 50, "adjacency list:", { s: 9.5, w: 600 });
  ["0: [1,2]", "1: [0,2,3]", "2: [0,1,4]"].forEach((l, i) => g += txt(480, 70 + i * 16, l, { mono: true, s: 9, o: 0.8 }));
  g += txt(30, 180, "BFS (queue): 0 1 2 3 4 — shortest path in unweighted graphs", { mono: true, s: 9.5 });
  g += txt(30, 200, "DFS (stack/recursion): 0 1 3 2 4 — cycle detection, components, topo order", { mono: true, s: 9.5 });
  return { svg: svg(760, 214, g), desc: "Graphs are stored as an adjacency list (List<List<Integer>>, O(V+E) space). BFS uses a queue and finds shortest paths in unweighted graphs; DFS uses recursion/stack for cycle detection, connected components, and topological order.", alt: "Graph with adjacency list, BFS and DFS orders" };
}
function m37_t2() {
  let g = title(14, "BFS vs DFS + grid flooding");
  const land = { "0,0": 1, "0,1": 1, "2,2": 1, "2,3": 1 };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) g += vcell(30 + c * 34, 40 + r * 34, 30, 30, land[`${r},${c}`] ? "1" : "0", land[`${r},${c}`] ? 1 : 5, { s: 10 });
  g += txt(220, 56, "BFS = queue (FIFO) → level by level → shortest path (unweighted)", { s: 9.5, o: 0.85 });
  g += txt(220, 80, "DFS = stack / recursion → go deep → cycles, components, topo order", { s: 9.5, o: 0.85 });
  g += txt(220, 104, "Islands / flood fill: BFS or DFS over the grid, O(m·n), mark visited", { s: 9.5, o: 0.85 });
  g += txt(30, 168, "two islands of 1s above (count connected components)", { s: 9, fill: GRN });
  return { svg: svg(760, 182, g), desc: "BFS (queue, FIFO) explores level-by-level → shortest path in unweighted graphs. DFS (stack/recursion) goes deep → cycle detection, components, topo order. Grid problems (islands, flood fill, walls-and-gates) run BFS/DFS over cells, O(m·n).", alt: "Grid islands with BFS versus DFS" };
}
function m37_t3() {
  let g = title(14, "Topological sort — Kahn's (indegree)");
  const N = { 0: [80, 90], 1: [220, 50], 2: [220, 130], 3: [360, 90] };
  g += arr(98, 84, 204, 56) + arr(98, 96, 204, 124) + arr(238, 56, 346, 84) + arr(238, 124, 346, 96);
  for (const k of [0, 1, 2, 3]) g += tnode(N[k][0], N[k][1], k, 0);
  g += txt(430, 60, "indegree: 0→0, 1→1, 2→1, 3→2", { mono: true, s: 9, o: 0.8 });
  g += txt(430, 80, "queue 0-indegree → process → decrement neighbors", { s: 9, o: 0.8 });
  g += txt(430, 100, "order: 0, 1, 2, 3", { mono: true, s: 9.5, fill: GRN, w: 600 });
  g += txt(30, 180, "If processed count < n → there's a cycle (Course Schedule canFinish = count == n).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 196, g), desc: "Topological sort (Kahn's BFS): start from nodes with indegree 0, process them, decrement neighbors' indegrees, repeat. If fewer than n nodes get processed, the graph has a cycle. (DFS post-order reversed also works.)", alt: "DAG with Kahn's topological sort" };
}
function m37_t4() {
  let g = title(14, "Shortest path — Dijkstra / Bellman-Ford / Floyd");
  const N = { 0: [80, 70], 1: [220, 45], 2: [220, 115], 3: [360, 80] };
  g += arr(98, 66, 204, 50) + txt(150, 48, "4", { s: 8.5, o: 0.7 }) + arr(98, 76, 204, 110) + txt(150, 102, "1", { s: 8.5, o: 0.7 });
  g += arr(238, 52, 346, 74) + txt(300, 56, "1", { s: 8.5, o: 0.7 }) + arr(238, 112, 346, 90) + txt(300, 108, "5", { s: 8.5, o: 0.7 });
  for (const k of [0, 1, 2, 3]) g += tnode(N[k][0], N[k][1], k, 0);
  g += txt(430, 55, "Dijkstra: min-heap, relax dist[v]; no neg edges; O((V+E)log V)", { s: 9, o: 0.85 });
  g += txt(430, 80, "Bellman-Ford: relax all edges V−1×; negatives OK; O(VE)", { s: 9, o: 0.85 });
  g += txt(430, 105, "Floyd-Warshall: dp[i][j]=min(…, dp[i][k]+dp[k][j]); all-pairs O(V³)", { s: 9, o: 0.85 });
  g += txt(30, 178, "Relax: if dist[u] + w(u,v) < dist[v] then update dist[v].", { mono: true, s: 9, o: 0.7 });
  return { svg: svg(760, 192, g), desc: "Shortest path: Dijkstra (min-heap, relax edges, no negative weights, O((V+E)log V)); Bellman-Ford (relax all edges V-1 times, handles negatives, O(VE)); Floyd-Warshall (DP, all-pairs, O(V³)). Relaxation: dist[u]+w < dist[v] → update.", alt: "Weighted graph with shortest-path algorithm comparison" };
}
function m37_t5() {
  let g = title(14, "MST — Kruskal + Union-Find");
  g += txt(30, 38, "edges sorted by weight:", { s: 9.5, w: 600 });
  [["A-B 1", 1], ["C-D 2", 1], ["B-C 3", 1], ["A-C 4", 4]].forEach(([e, ci], i) => { const x = 30 + i * 130; g += box(x, 46, 120, 28, ci) + txt(x + 60, 64, e, { a: "middle", mono: true, s: 9.5 }); });
  g += txt(30, 96, "take edge if endpoints not already connected (union-find); skip if it forms a cycle.", { s: 9.5, o: 0.85 });
  g += txt(30, 118, "A-B ✓  C-D ✓  B-C ✓  A-C ✗ (cycle).   Kruskal O(E log E) · Prim = min-heap.", { s: 9.5, o: 0.8 });
  g += txt(30, 140, "Union-Find: find() with path compression + union by rank → near-O(1).", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 156, g), desc: "Kruskal's MST: sort edges by weight, add each edge if its endpoints aren't already connected (checked via union-find), skip edges that would form a cycle. O(E log E). Union-Find with path compression + union by rank is near-O(1).", alt: "Kruskal MST with union-find cycle check" };
}

// diamond helper
const D = (cx, cy, w, h, t, ci = 2) => `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" fill="${TINT[ci]}" stroke="${STRK[ci]}"/>` + txt(cx, cy + 3.5, t, { a: "middle", s: 9, w: 600 });

// ════════════ M38 — Sorting ════════════
function m38_t1() {
  let g = title(14, "Comparison sorts — merge / quick / heap");
  g += txt(30, 38, "Sort        Time              Space     Stable  Notes", { mono: true, s: 9, w: 700 });
  [["Merge", "O(n log n)", "O(n)", "yes", "linked lists, external", 1], ["Quick", "O(n log n)/O(n²)", "O(log n)", "no", "fastest in practice", 2], ["Heap", "O(n log n)", "O(1)", "no", "in-place", 0]].forEach((r, i) => {
    const y = 52 + i * 26; g += box(28, y, 700, 22, r[5], 5);
    g += txt(36, y + 15, r[0].padEnd(11) + r[1].padEnd(18) + r[2].padEnd(10) + r[3].padEnd(8) + r[4], { mono: true, s: 8.5 });
  });
  g += txt(30, 150, "Merge sort splits in half, sorts each, merges — the recursion tree is log n deep with n work per level.", { s: 9, o: 0.75 });
  return { svg: svg(760, 166, g), desc: "The three comparison sorts: Merge (O(n log n), stable, O(n) space — good for linked lists/external); Quick (O(n log n) avg, O(n²) worst, in-place-ish, fastest in practice); Heap (O(n log n), O(1) space, unstable).", alt: "Comparison of merge, quick, and heap sort" };
}
function m38_t2() {
  let g = title(14, "Non-comparison sorts");
  g += txt(30, 38, "Counting sort (ints in [0,k]):", { s: 10, w: 600 });
  g += txt(30, 60, "input [2,5,3,2] → count[] → prefix sum → place (stable) → O(n+k)", { mono: true, s: 9, o: 0.85 });
  [2, 5, 3, 2].forEach((v, i) => g += vcell(30 + i * 40, 70, 36, 24, String(v), 0, { s: 10 }));
  g += arr(200, 82, 240, 82) + txt(250, 86, "count occurrences → prefix → output", { s: 9, o: 0.7 });
  g += txt(30, 124, "Radix: sort by each digit LSD→MSD with stable counting → O(d·(n+k))", { s: 9.5, o: 0.85 });
  g += txt(30, 146, "Bucket: distribute into buckets, sort each, concatenate → O(n) average", { s: 9.5, o: 0.85 });
  return { svg: svg(760, 162, g), desc: "Non-comparison sorts beat O(n log n) using key structure: Counting sort (ints in [0,k], count + prefix sum, O(n+k), stable); Radix (digit by digit LSD→MSD via counting, O(d(n+k))); Bucket (distribute, sort each, concat, O(n) avg).", alt: "Counting, radix, and bucket sort" };
}
function m38_t3() {
  let g = title(14, "Merge intervals — sort by start");
  [[40, 180, "1–3", 0], [120, 320, "2–6", 0], [400, 520, "8–10", 1]].forEach(([x1, x2, l, ci], i) => { const y = 38 + i * 26; g += box(x1, y, x2 - x1, 18, ci, 4) + txt(x1 + 6, y + 13, l, { s: 9, w: 600 }); });
  g += arr(560, 60, 600, 60, "g");
  g += box(600, 38, 130, 44, 1) + txt(665, 56, "[1,6]", { a: "middle", mono: true, s: 10 }) + txt(665, 72, "[8,10]", { a: "middle", mono: true, s: 10 });
  g += txt(30, 130, "Sort by start; merge when prev.end ≥ curr.start (overlapping). Insert Interval: find left/right bounds, merge.", { s: 9.5, o: 0.85 });
  g += txt(30, 152, "Largest Number: custom comparator (b+a).compareTo(a+b).", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 168, g), desc: "Merge intervals: sort by start time, then merge any interval whose start ≤ the previous end. [1,3]+[2,6] overlap → [1,6]; [8,10] stays separate. Sorting first is the key enabler for most interval problems.", alt: "Overlapping intervals being merged" };
}
function m38_t4() {
  let g = title(14, "Custom comparators & multi-key sort");
  g += box(30, 40, 700, 28, 5) + txt(40, 58, "Comparator.comparingInt(a -> a[0]).thenComparingInt(a -> a[1])", { mono: true, s: 9.5 });
  g += txt(30, 92, "[[1,2],[1,1],[0,5]]", { mono: true, s: 10 }) + arr(170, 88, 220, 88, "", "sort") + txt(230, 96, "[[0,5],[1,1],[1,2]]  (by 1st, ties by 2nd)", { mono: true, s: 10 });
  g += txt(30, 128, "(a,b) -> a[0]-b[0] for int[]; .thenComparing(g) chains keys; .reversed() flips. TimSort is stable.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 144, g), desc: "Custom sorting: comparators define order. Chain keys with comparingInt(...).thenComparingInt(...) to sort by first field, breaking ties by the second. .reversed() flips; Arrays.sort/Collections.sort on objects (TimSort) is stable.", alt: "Multi-key comparator sorting" };
}
function m38_t5() {
  let g = title(14, "Which sort to use?");
  [["objects, need stable order", "Arrays.sort → TimSort", 1], ["primitive array, raw speed", "Arrays.sort → dual-pivot quicksort", 2], ["linked list (no random access)", "merge sort", 0], ["small integer range [0,k]", "counting / radix sort", 3]].forEach(([q, a, ci], i) => {
    const y = 40 + i * 32; g += box(30, y, 300, 26, 5) + txt(40, y + 17, q, { s: 9 }) + arr(332, y + 13, 372, y + 13, "g") + box(372, y, 340, 26, ci) + txt(382, y + 17, a, { mono: true, s: 9 });
  });
  return { svg: svg(760, 184, g), desc: "Choosing a sort: objects needing stability → Arrays.sort (TimSort); primitive arrays for speed → Arrays.sort (dual-pivot quicksort); linked lists → merge sort (no O(1) random access); small integer ranges → counting/radix.", alt: "Decision guide for which sort to use" };
}

// ════════════ M39 — Binary Search ════════════
function m39_t1() {
  let g = title(14, "Binary search template");
  [1, 3, 5, 7, 9, 11, 13].forEach((v, i) => g += vcell(40 + i * 70, 44, 62, 34, String(v), i === 3 ? 2 : 0, { s: 11 }));
  g += txt(40 + 31, 96, "lo", { a: "middle", s: 9, w: 700, fill: GRN }) + txt(40 + 3 * 70 + 31, 96, "mid", { a: "middle", s: 9, w: 700, fill: "#ff9f0a" }) + txt(40 + 6 * 70 + 31, 96, "hi", { a: "middle", s: 9, w: 700, fill: GRN });
  g += txt(30, 130, "while (lo <= hi) { m = lo + (hi-lo)/2; ... }   — avoids overflow.", { mono: true, s: 9.5 });
  g += txt(30, 152, "not found → return lo (insert position) or −1.   first occurrence: on match, hi = m−1 (keep going left).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 168, g), desc: "Binary search on a sorted array: while(lo<=hi), m=lo+(hi-lo)/2 (overflow-safe). Return lo as the insert position when not found. For the first occurrence, on a match set hi=m-1 to keep searching left.", alt: "Binary search with lo/mid/hi pointers" };
}
function m39_t2() {
  let g = title(14, "Binary search on the ANSWER space");
  g += box(30, 50, 700, 30, 5);
  g += `<rect x="30" y="50" width="350" height="30" rx="8" fill="${TINT[4]}" stroke="${STRK[4]}"/>` + txt(205, 70, "infeasible", { a: "middle", s: 10, fill: RED });
  g += `<rect x="380" y="50" width="350" height="30" rx="8" fill="${TINT[1]}" stroke="${STRK[1]}"/>` + txt(555, 70, "feasible", { a: "middle", s: 10, fill: GRN });
  g += txt(380, 100, "↑ find the minimum X where f(X) becomes feasible", { a: "middle", s: 9.5 });
  g += txt(30, 132, "f(X) must be monotonic: feasible at X ⇒ feasible at X+1. Binary-search the answer range, not the array.", { s: 9.5, o: 0.85 });
  g += txt(30, 154, "Koko eating speed · Split Array Largest Sum · Capacity to Ship.", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 170, g), desc: "Search-on-answer: when the array index isn't the search target, binary-search the answer range [lo,hi]. Define a monotonic feasibility f(X) (feasible at X ⇒ feasible at X+1) and find the minimum feasible X. Used in Koko, Split Array, Ship Capacity.", alt: "Binary search over a feasibility answer space" };
}
function m39_t3() {
  let g = title(14, "Rotated sorted array");
  [4, 5, 6, 7, 0, 1, 2].forEach((v, i) => g += vcell(40 + i * 70, 44, 62, 34, String(v), i < 4 ? 0 : 1, { s: 11 }));
  g += txt(40 + 1.5 * 70, 96, "left half sorted", { a: "middle", s: 9, fill: "#0a84ff" }) + txt(40 + 5 * 70, 96, "right half sorted", { a: "middle", s: 9, fill: GRN });
  g += txt(30, 130, "At any mid, one half is always sorted: if a[lo] ≤ a[mid] → left sorted, else right sorted.", { s: 9.5, o: 0.85 });
  g += txt(30, 152, "Check whether target lies in the sorted half → search there, else the other. Find Min / Find Peak: same idea.", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 168, g), desc: "In a rotated sorted array, splitting at mid always leaves one half fully sorted: if a[lo] ≤ a[mid] the left half is sorted, otherwise the right. Decide which sorted half holds the target and recurse there. Same trick finds the min/peak.", alt: "Rotated sorted array with one sorted half" };
}
function m39_t4() {
  let g = title(14, "2D binary search — staircase from top-right");
  const ox = 40, oy = 44, cw = 44;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) g += vcell(ox + c * cw, oy + r * cw, cw - 4, cw - 4, String(r * 10 + c * 3), (r === 0 && c === 3) ? 2 : 5, { s: 9 });
  g += txt(ox + 4 * cw + 20, oy + 24, "start top-right:", { s: 9.5, w: 600 });
  g += txt(ox + 4 * cw + 20, oy + 44, "target < cell → move LEFT", { s: 9, o: 0.8 });
  g += txt(ox + 4 * cw + 20, oy + 62, "target > cell → move DOWN", { s: 9, o: 0.8 });
  g += txt(ox + 4 * cw + 20, oy + 84, "O(m + n)", { s: 10, w: 700, fill: GRN });
  g += txt(ox + 4 * cw + 20, oy + 116, "Fully sorted matrix → flatten,", { s: 9, o: 0.7 });
  g += txt(ox + 4 * cw + 20, oy + 132, "index/cols = row, index%cols = col.", { mono: true, s: 8.5, o: 0.7 });
  return { svg: svg(760, 220, g), desc: "Row+column sorted matrix: start at the top-right corner — if the target is smaller move left, if larger move down. Each step eliminates a row or column, O(m+n). A fully sorted matrix can be flattened and binary-searched with index/cols, index%cols.", alt: "2D matrix search starting from top-right" };
}
function m39_t5() {
  let g = title(14, "Binary search — pattern picker");
  [["sorted array, exact/insert", "classic lo≤hi template", 0], ["answer is monotone, not in array", "search on answer space", 1], ["rotated sorted array", "find sorted half, recurse", 2], ["sorted matrix", "top-right staircase / flatten", 3]].forEach(([q, a, ci], i) => {
    const y = 40 + i * 32; g += box(30, y, 300, 26, 5) + txt(40, y + 17, q, { s: 9 }) + arr(332, y + 13, 372, y + 13, "g") + box(372, y, 340, 26, ci) + txt(382, y + 17, a, { s: 9 });
  });
  return { svg: svg(760, 184, g), desc: "Binary-search pattern picker: exact/insert on a sorted array → classic lo≤hi template; monotone answer not in the array → search on answer space; rotated array → find the sorted half and recurse; sorted matrix → top-right staircase or flatten.", alt: "Binary search pattern decision guide" };
}

// ════════════ M40 — Backtracking ════════════
function m40_t1() {
  let g = title(14, "Backtracking — choose / explore / undo");
  g += tnode(380, 44, "[ ]", 5);
  g += edge(360, 56, 250, 96) + edge(400, 56, 510, 96);
  g += tnode(250, 110, "choose a", 0, 22) + tnode(510, 110, "choose b", 0, 22);
  g += edge(250, 132, 200, 168) + edge(250, 132, 300, 168);
  g += tnode(200, 180, "leaf", 1, 18) + tnode(300, 180, "leaf", 1, 18);
  g += arr(228, 168, 268, 124, "", "undo");
  g += txt(560, 110, "1. choose (add)", { s: 9.5, o: 0.85 }) + txt(560, 128, "2. recurse (explore)", { s: 9.5, o: 0.85 }) + txt(560, 146, "3. undo (remove last)", { s: 9.5, o: 0.85 });
  g += txt(30, 214, "base case: condition met → add a COPY of the current path to results, then backtrack.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 228, g), desc: "Backtracking is choose → recurse → undo. Add a choice, explore deeper, then remove it to restore state before trying the next branch. At a base case, add a copy of the current path to results. The recursion forms a tree of partial solutions.", alt: "Backtracking decision tree with choose/explore/undo" };
}
function m40_t2() {
  let g = title(14, "Subsets / permutations / combinations");
  g += tnode(380, 40, "[ ]", 5, 14);
  g += edge(370, 50, 280, 84) + edge(390, 50, 480, 84);
  g += tnode(280, 96, "+1", 0, 14) + tnode(480, 96, "skip 1", 5, 14);
  g += edge(272, 108, 220, 140) + edge(288, 108, 340, 140) + edge(472, 108, 430, 140) + edge(488, 108, 540, 140);
  ["[1,2]", "[1]", "[2]", "[ ]"].forEach((l, i) => g += tnode([220, 340, 430, 540][i], 152, l, 1, 16));
  g += txt(30, 188, "Subsets: add at EVERY node → 2ⁿ.   Permutations: used[] flags → n!.   Combinations: start index (i+1) → C(n,k).", { s: 9.5, o: 0.85 });
  return { svg: svg(760, 204, g), desc: "Subsets/permutations/combinations are all backtracking over an include/exclude (or selection) tree. Subsets add the current path at every node (2ⁿ). Permutations track a used[] array (n!). Combinations advance a start index to avoid duplicates (C(n,k)).", alt: "Subset include/exclude decision tree" };
}
function m40_t3() {
  let g = title(14, "N-Queens — constraint satisfaction");
  const ox = 40, oy = 40, cw = 38, qs = { 0: 1, 1: 3, 2: 0, 3: 2 };
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) g += box(ox + c * cw, oy + r * cw, cw - 2, cw - 2, (qs[r] === c) ? 1 : 5, 4) + (qs[r] === c ? txt(ox + c * cw + cw / 2 - 1, oy + r * cw + cw / 2 + 4, "♛", { a: "middle", s: 14, fill: GRN }) : "");
  g += txt(ox + 4 * cw + 24, oy + 20, "no two queens share:", { s: 9.5, w: 600 });
  g += txt(ox + 4 * cw + 24, oy + 40, "• a column", { s: 9, o: 0.8 });
  g += txt(ox + 4 * cw + 24, oy + 58, "• a diagonal: |r1−r2| == |c1−c2|", { mono: true, s: 8.5, o: 0.8 });
  g += txt(30, oy + 4 * cw + 20, "Sudoku: check row, column, and 3×3 box — box index 3*(r/3)+i/3, 3*(c/3)+i%3.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, oy + 4 * cw + 36, g), desc: "N-Queens places one queen per row, backtracking when a placement conflicts: same column or same diagonal (|r1-r2|==|c1-c2|). Sudoku is the same idea, validating row, column, and 3×3 box at each cell.", alt: "4x4 N-Queens board with non-attacking queens" };
}
function m40_t4() {
  let g = title(14, "Word Search — grid backtracking (\"ABCCED\")");
  const grid2 = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]];
  const path = { "0,0": 1, "0,1": 1, "0,2": 1, "1,2": 1, "2,2": 1, "2,1": 1 };
  const ox = 40, oy = 40, cw = 40;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) g += vcell(ox + c * cw, oy + r * cw, cw - 3, cw - 3, grid2[r][c], path[`${r},${c}`] ? 1 : 5, { s: 11 });
  g += txt(ox + 4 * cw + 24, oy + 16, "DFS from each cell, 4 directions.", { s: 9.5, o: 0.85 });
  g += txt(ox + 4 * cw + 24, oy + 36, "mark board[r][c]='#' while visiting,", { mono: true, s: 8.5, o: 0.8 });
  g += txt(ox + 4 * cw + 24, oy + 52, "restore it on the way back.", { s: 9, o: 0.8 });
  g += txt(ox + 4 * cw + 24, oy + 74, "base: index == word.length → true.", { mono: true, s: 8.5, o: 0.75 });
  return { svg: svg(760, oy + 3 * cw + 24, g), desc: "Word Search: DFS from each cell in 4 directions, matching the word char by char. Mark the cell '#' while it's on the current path and restore it when backtracking. Success when the index reaches word length.", alt: "Grid with a highlighted word-search backtracking path" };
}
function m40_t5() {
  let g = title(14, "Backtracking patterns");
  [["Subsets", "add path at EVERY node", "O(2ⁿ)"], ["Permutations", "used[] selection flags", "O(n!)"], ["Combinations", "start index (i+1)", "O(C(n,k))"], ["Constraint (N-Queens/Sudoku)", "validate + prune early", "varies"]].forEach((r, i) => {
    const y = 40 + i * 30; g += box(30, y, 700, 26, [1, 0, 3, 2][i]) + txt(40, y + 17, r[0].padEnd(30) + r[1].padEnd(26) + r[2], { mono: true, s: 9 });
  });
  g += txt(30, 172, "Every variant is choose → recurse → undo; prune the moment a partial solution becomes invalid.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 188, g), desc: "All backtracking is choose → recurse → undo. Subsets add the path at every node (2ⁿ); permutations use used[] flags (n!); combinations advance a start index (C(n,k)); constraint problems validate and prune early.", alt: "Backtracking pattern summary table" };
}

// ════════════ M41 — Dynamic Programming ════════════
function m41_t1() {
  let g = title(14, "DP — memoization vs tabulation");
  g += txt(30, 38, "Memoization (top-down): recursion + cache", { s: 10, w: 600 });
  g += tnode(120, 70, "f(5)", 0, 16) + edge(108, 82, 80, 110) + edge(132, 82, 160, 110) + tnode(80, 122, "f(4)", 0, 14) + tnode(160, 122, "f(3)", 5, 14);
  g += txt(190, 126, "← cache hit (skip recompute)", { s: 8.5, fill: GRN });
  g += txt(420, 38, "Tabulation (bottom-up): fill table", { s: 10, w: 600 });
  [0, 1, 1, 2, 3, 5].forEach((v, i) => g += vcell(420 + i * 40, 56, 36, 24, String(v), 1, { s: 10 }));
  g += txt(420, 100, "dp[i] = dp[i-1] + dp[i-2], from base cases up", { mono: true, s: 8.5, o: 0.8 });
  g += txt(30, 168, "DP needs OPTIMAL SUBSTRUCTURE + OVERLAPPING SUBPROBLEMS. Both compute each subproblem once.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 184, g), desc: "Dynamic programming applies when a problem has optimal substructure + overlapping subproblems. Memoization (top-down) caches recursion results; tabulation (bottom-up) fills a table from base cases. Both solve each subproblem exactly once.", alt: "Memoization recursion tree vs tabulation table" };
}
function m41_t2() {
  let g = title(14, "1D DP — House Robber");
  const nums = [2, 7, 9, 3, 1], dp = [2, 7, 11, 11, 12];
  g += txt(30, 38, "nums:", { s: 9.5, w: 600 });
  nums.forEach((v, i) => g += vcell(90 + i * 70, 30, 62, 24, String(v), 5, { s: 10 }));
  g += txt(30, 76, "dp:", { s: 9.5, w: 600 });
  dp.forEach((v, i) => g += vcell(90 + i * 70, 68, 62, 28, String(v), 1, { s: 11 }));
  g += txt(30, 124, "dp[i] = max(dp[i-1],  dp[i-2] + nums[i])   — rob this house or skip it.", { mono: true, s: 9.5 });
  g += txt(30, 146, "Answer dp[n-1] = 12.   O(n) time, O(1) space (keep two vars). Coin Change / LIS / Jump Game = same shape.", { s: 9, o: 0.75 });
  return { svg: svg(760, 162, g), desc: "1D DP example House Robber: dp[i] = max(dp[i-1], dp[i-2] + nums[i]) — either skip this house (keep dp[i-1]) or rob it (dp[i-2] + value). O(n) time, O(1) space with two rolling variables. Coin Change, LIS, and Jump Game share this 1D shape.", alt: "House Robber 1D DP array fill" };
}
function m41_t3() {
  let g = title(14, "2D DP — Edit Distance (cat → cut)");
  const a = ["", "c", "u", "t"], b = ["", "c", "a", "t"];
  const dp = [[0, 1, 2, 3], [1, 0, 1, 2], [2, 1, 1, 2], [3, 2, 2, 1]];
  const ox = 120, oy = 50, cw = 42;
  for (let c = 0; c < 4; c++) g += txt(ox + c * cw + cw / 2, oy - 6, a[c] || "ε", { a: "middle", s: 9, o: 0.6 });
  for (let r = 0; r < 4; r++) { g += txt(ox - 12, oy + r * cw + cw / 2 + 4, b[r] || "ε", { a: "end", s: 9, o: 0.6 }); for (let c = 0; c < 4; c++) g += vcell(ox + c * cw, oy + r * cw, cw - 4, cw - 4, String(dp[r][c]), (r === 3 && c === 3) ? 1 : 5, { s: 10 }); }
  g += txt(ox + 4 * cw + 20, oy + 30, "match → dp[i-1][j-1]", { mono: true, s: 8.5, o: 0.85 });
  g += txt(ox + 4 * cw + 20, oy + 50, "mismatch → 1 + min(↖ ← ↑)", { mono: true, s: 8.5, o: 0.85 });
  g += txt(ox + 4 * cw + 20, oy + 76, "answer = bottom-right = 1", { s: 9, fill: GRN });
  return { svg: svg(760, oy + 4 * cw + 24, g), desc: "2D DP example Edit Distance: dp[i][j] = edits to turn the first i chars of one string into the first j of another. On a char match copy the diagonal; on a mismatch take 1 + min(insert ←, delete ↑, replace ↖). Grid Paths and Knapsack share the 2D-table shape.", alt: "Edit-distance 2D DP table" };
}
function m41_t4() {
  let g = title(14, "Interval DP — dp[i][j] over a range");
  const ox = 120, oy = 50, cw = 40;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g += vcell(ox + j * cw, oy + i * cw, cw - 4, cw - 4, j >= i ? "·" : "", j >= i ? (j === 3 && i === 0 ? 1 : 5) : 5, { s: 9 });
  for (let i = 0; i < 4; i++) { g += txt(ox - 10, oy + i * cw + cw / 2 + 4, "i" + i, { a: "end", s: 8, o: 0.6 }); g += txt(ox + i * cw + cw / 2, oy - 6, "j" + i, { a: "middle", s: 8, o: 0.6 }); }
  g += txt(ox + 4 * cw + 20, oy + 24, "dp[i][j] = best over range [i, j]", { mono: true, s: 8.5, o: 0.85 });
  g += txt(ox + 4 * cw + 20, oy + 44, "fill by increasing length (j − i)", { s: 9, o: 0.8 });
  g += txt(ox + 4 * cw + 20, oy + 64, "answer = dp[0][n-1] (top-right)", { s: 9, fill: GRN });
  g += txt(30, oy + 4 * cw + 20, "Burst Balloons: dp[i][j] = max coins, choosing the LAST balloon to pop in (i,j). Matrix Chain = min multiplications.", { s: 9, o: 0.75 });
  return { svg: svg(760, oy + 4 * cw + 36, g), desc: "Interval DP defines dp[i][j] as the optimum over the sub-range [i,j], filled by increasing length so smaller ranges are ready first; the answer is dp[0][n-1]. Burst Balloons picks the last balloon to pop in a range; Matrix Chain minimizes multiplications.", alt: "Interval DP upper-triangular table" };
}
function m41_t5() {
  let g = title(14, "DP pattern categories");
  [["1D sequence", "House Robber · LIS · Coin Change · Jump Game", 1], ["2D grid", "Unique Paths · Minimum Path Sum", 0], ["two strings", "Edit Distance · LCS · Wildcard Match", 3], ["interval / tree", "Burst Balloons · Matrix Chain · Tree DP", 2]].forEach((r, i) => {
    const y = 40 + i * 32; g += box(30, y, 160, 26, r[2]) + txt(40, y + 17, r[0], { s: 9.5, w: 600 }) + box(200, y, 530, 26, 5) + txt(212, y + 17, r[1], { mono: true, s: 9 });
  });
  g += txt(30, 178, "Recognize the shape → pick the state. Define dp meaning, base case, transition, answer cell.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 194, g), desc: "DP problems cluster into recognizable shapes: 1D sequences (House Robber, LIS, Coin Change), 2D grids (Unique Paths, Min Path Sum), two-string tables (Edit Distance, LCS), and interval/tree DP (Burst Balloons, Matrix Chain). Recognizing the shape tells you the state.", alt: "Dynamic programming pattern categories" };
}

// ════════════ M41.5 — Greedy & Intervals ════════════
function m41_5_t1() {
  let g = title(14, "Greedy — locally optimal choices");
  ["pick best now", "best now", "best now", "= global optimum?"].forEach((t, i) => { const x = 30 + i * 175; g += box(x, 44, 160, 30, i === 3 ? 2 : 1) + txt(x + 80, 63, t, { a: "middle", s: 9.5 }); if (i < 3) g += arr(x + 160, 59, x + 175, 59); });
  g += txt(30, 100, "Only correct WITH the greedy-choice property + optimal substructure. Prove via an exchange argument.", { s: 9.5, o: 0.85 });
  g += txt(30, 122, "No proof? Fall back to DP.   Two competing constraints → two passes (L→R then R→L), take the max (Candy).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 138, g), desc: "Greedy takes the locally optimal choice at each step. It only yields the global optimum when the problem has the greedy-choice property and optimal substructure — prove it with an exchange argument, else fall back to DP. Two competing constraints often need two passes (L→R then R→L).", alt: "Greedy locally-optimal choice chain" };
}
function m41_5_t2() {
  let g = title(14, "Intervals — choose the sort key");
  g += box(30, 42, 340, 30, 0) + txt(45, 61, "sort by START → merge / insert", { s: 9.5, w: 600 });
  g += box(390, 42, 340, 30, 1) + txt(405, 61, "sort by END → max non-overlap / min arrows", { s: 9.5, w: 600 });
  g += txt(30, 100, "Greedy 'earliest finish time' keeps the most intervals. Sweep line: +1 on each start, −1 on each end.", { s: 9.5, o: 0.85 });
  g += txt(30, 122, "Insert Interval = three linear phases: before · merge overlapping · after.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 138, g), desc: "Interval problems hinge on the sort key: sort by start for merge/insert; sort by end for maximum non-overlapping intervals or minimum arrows (greedy earliest-finish keeps the most). Sweep line adds +1 at starts and −1 at ends. Insert Interval has three linear phases.", alt: "Interval sort-key decision" };
}

// ════════════ M43 — System Design ════════════
function m43_t1() {
  let g = title(14, "System design framework");
  ["Requirements", "Estimation", "API", "Data Model", "Core Algo", "Scale"].forEach((s, i) => { const x = 18 + i * 124; g += box(x, 44, 114, 30, i % 6) + txt(x + 57, 63, s, { a: "middle", s: 9 }); if (i < 5) g += arr(x + 114, 59, x + 124, 59); });
  g += txt(30, 102, "Capacity: daily ÷ 86400 = per-second; add ~10× peak buffer.", { s: 9.5, o: 0.85 });
  g += txt(30, 124, "Always separate functional (what it does) from non-functional (latency, availability, scale) requirements.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 140, g), desc: "System-design framework, in order: clarify Requirements → Estimation → API → Data Model → Core Algorithm → Scale. Estimate capacity as daily/86400 per second with a ~10× peak buffer, and always split functional from non-functional requirements.", alt: "System design framework pipeline" };
}
function m43_t2() {
  let g = title(14, "Scalability patterns");
  g += txt(30, 38, "Cache-aside:", { s: 9.5, w: 600 });
  ["app", "cache (miss)", "DB", "→ fill cache"].forEach((t, i) => { const x = 130 + i * 130; g += box(x, 28, 118, 24, i === 2 ? 0 : 5) + txt(x + 59, 44, t, { a: "middle", s: 8.5 }); if (i < 3) g += arr(x + 118, 40, x + 130, 40); });
  g += txt(30, 80, "Write-through:", { s: 9.5, w: 600 });
  g += box(130, 70, 280, 24, 1) + txt(270, 86, "write to cache AND DB (synchronous)", { a: "middle", s: 8.5 });
  g += txt(30, 122, "Message queue:", { s: 9.5, w: 600 });
  ["producer", "queue", "consumer"].forEach((t, i) => { const x = 130 + i * 150; g += box(x, 112, 138, 24, 2) + txt(x + 69, 128, t, { a: "middle", s: 8.5 }); if (i < 2) g += arr(x + 138, 124, x + 150, 124); });
  g += txt(450, 128, "decouple · absorb spikes · async", { s: 8.5, o: 0.7 });
  return { svg: svg(760, 152, g), desc: "Scalability patterns: cache-aside (app checks cache, on miss reads DB then fills cache — simple, flexible); write-through (write cache and DB synchronously — consistent, slower writes); message queues (decouple services, absorb traffic spikes, enable async).", alt: "Cache-aside, write-through, and message queue patterns" };
}
function m43_t3() {
  let g = title(14, "Database design");
  g += txt(30, 44, "Normalize to 3NF (no transitive deps)", { s: 9.5 }) + arr(330, 40, 380, 40, "", "reads") + box(380, 30, 280, 24, 2) + txt(520, 46, "denormalize intentionally", { a: "middle", s: 9 });
  g += txt(30, 82, "Indexing: high selectivity (unique) → B-tree.  Range queries → covering index.", { s: 9.5, o: 0.85 });
  g += txt(30, 104, "Avoid N+1: use JOINs or batch loading — never loop queries inside an ORM.", { s: 9.5, fill: RED });
  g += txt(30, 130, "Pagination: keyset (WHERE id > last) scales better than OFFSET for deep pages.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 146, g), desc: "Database design: normalize to 3NF then denormalize intentionally for read-heavy paths. Index by selectivity (unique → B-tree, range → covering index). Avoid the N+1 problem with JOINs/batch loading. Prefer keyset over OFFSET pagination for deep pages.", alt: "Database design principles" };
}
function m43_t4() {
  let g = title(14, "API design");
  [["200", 1], ["201", 1], ["400", 2], ["401", 2], ["403", 2], ["404", 2], ["429", 2], ["500", 4]].forEach(([c, ci], i) => g += box(30 + i * 88, 40, 80, 26, ci) + txt(70 + i * 88, 57, c, { a: "middle", mono: true, s: 10, w: 600 }));
  g += txt(30, 96, "Idempotency key: client UUID → server deduplicates on retry. Critical for payments.", { s: 9.5, o: 0.85 });
  g += txt(30, 118, "Versioning: /v1/path (common, testable) vs header-based (cleaner, harder to test).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 134, g), desc: "API design: use correct REST status codes (2xx success, 4xx client error incl. 429 rate-limit, 5xx server). Idempotency keys (client-generated UUID, server dedups on retry) are critical for payments. Version via /v1/ path (common, testable) or headers (cleaner).", alt: "REST status codes and API design" };
}
function m43_t5() {
  let g = title(14, "Canonical architecture");
  const row = [["client", 3], ["load balancer", 5], ["app servers", 0], ["cache", 1], ["DB", 0]];
  row.forEach(([t, ci], i) => { const x = 14 + i * 150; g += box(x, 44, 138, 32, ci) + txt(x + 69, 64, t, { a: "middle", s: 9.5 }); if (i < 4) g += arr(x + 138, 60, x + 150, 60); });
  g += box(488, 96, 138, 30, 2) + txt(557, 115, "queue (async)", { a: "middle", s: 9 }) + arr(450, 76, 540, 96, "", "publish");
  g += txt(30, 158, "35-min round: 5 clarify · 5 estimate · 5 API · 10 data + core · 10 scale.", { s: 9.5, o: 0.85 });
  g += txt(30, 180, "Trade-off language: \"We chose X over Y because Z, accepting trade-off W.\"", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 196, g), desc: "The canonical system-design diagram: client → load balancer → app servers → cache → DB, with a queue for async work. Budget a 35-minute round as 5 clarify / 5 estimate / 5 API / 10 data+core / 10 scale, and frame every decision as an explicit trade-off.", alt: "Canonical web architecture: client, LB, app, cache, DB, queue" };
}

// bit-cell row
const bits = (x, y, arr, ci = 0, cw = 30) => arr.map((b, i) => vcell(x + i * cw, y, cw - 3, 24, String(b), b === 1 ? ci : 5, { s: 11 })).join("");

// ════════════ M47 — Bitwise ════════════
function m47_t1() {
  let g = title(14, "Bitwise operators (a=1100, b=1010)");
  g += txt(30, 44, "a", { s: 10, w: 700 }) + bits(60, 32, [1, 1, 0, 0], 0);
  g += txt(30, 76, "b", { s: 10, w: 700 }) + bits(60, 64, [1, 0, 1, 0], 0);
  const ops = [["a & b", [1, 0, 0, 0], "AND"], ["a | b", [1, 1, 1, 0], "OR"], ["a ^ b", [0, 1, 1, 0], "XOR"]];
  ops.forEach(([l, r, nm], i) => { const y = 100 + i * 30; g += txt(220, y + 14, l, { mono: true, s: 9.5, w: 600 }) + bits(290, y, r, 1) + txt(420, y + 14, nm, { s: 9, o: 0.6 }); });
  g += txt(560, 90, "~x : flip all bits", { mono: true, s: 9, o: 0.8 });
  g += txt(560, 110, "x << k : ×2ᵏ", { mono: true, s: 9, o: 0.8 });
  g += txt(560, 130, "x >> k : ÷2ᵏ", { mono: true, s: 9, o: 0.8 });
  g += txt(560, 150, ">>> : unsigned shift", { mono: true, s: 9, o: 0.8 });
  return { svg: svg(760, 200, g), desc: "Bitwise operators on binary: AND (1 where both 1), OR (1 where either), XOR (1 where they differ), NOT ~ (flip all). Shifts: x<<k multiplies by 2ᵏ, x>>k divides (arithmetic), >>> is the unsigned right shift.", alt: "Bitwise AND/OR/XOR on binary numbers" };
}
function m47_t2() {
  let g = title(14, "Bit-manipulation tricks");
  [["x & (x - 1)", "clears the lowest set bit"], ["x & (-x)", "isolates the lowest set bit"], ["x | (1 << i)", "set bit i"], ["x & ~(1 << i)", "clear bit i"], ["x ^ (1 << i)", "toggle bit i"], ["(x >> i) & 1", "test bit i"]].forEach((r, i) => { const y = 36 + i * 22; g += txt(40, y + 12, r[0].padEnd(16), { mono: true, s: 10, w: 600 }) + txt(220, y + 12, "→ " + r[1], { s: 9.5, o: 0.8 }); });
  return { svg: svg(760, 176, g), desc: "Core bit tricks: x&(x-1) clears the lowest set bit; x&(-x) isolates it; 1<<i builds a mask to set (|), clear (&~), toggle (^), or test ((x>>i)&1) bit i.", alt: "Bit manipulation trick reference" };
}
function m47_t3() {
  let g = title(14, "Power of 2 & bit counting");
  g += box(30, 40, 700, 30, 1) + txt(45, 60, "isPowerOfTwo:  x > 0 && (x & (x - 1)) == 0   // exactly one bit set", { mono: true, s: 10 });
  g += txt(30, 96, "8 = 1000, 8-1 = 0111, 8 & 7 = 0000 ✓", { mono: true, s: 9.5, fill: GRN });
  g += box(30, 112, 700, 30, 2) + txt(45, 132, "count set bits (Brian Kernighan):  while (x != 0) { x &= x - 1; count++; }", { mono: true, s: 10 });
  g += txt(30, 162, "each iteration removes one set bit → loops exactly popcount(x) times.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 178, g), desc: "A power of two has exactly one set bit, so x>0 && (x&(x-1))==0. Brian Kernighan's bit count repeatedly clears the lowest set bit (x &= x-1), looping exactly popcount(x) times.", alt: "Power-of-two check and bit counting" };
}
function m47_t4() {
  let g = title(14, "XOR — Single Number & Missing Number");
  g += txt(30, 40, "Identities:", { s: 10, w: 600 }) + txt(120, 40, "a ^ a = 0    a ^ 0 = a    XOR is commutative", { mono: true, s: 9.5, o: 0.85 });
  g += box(30, 56, 350, 34, 1) + txt(45, 77, "Single Number: XOR all → pairs cancel", { s: 9.5 });
  g += txt(45, 92, "[4,1,2,1,2] → 4", { mono: true, s: 9, fill: GRN });
  g += box(400, 56, 330, 34, 0) + txt(415, 77, "Missing Number: XOR(0..n) ^ XOR(arr)", { s: 9.5 });
  g += txt(415, 92, "the unmatched index = missing", { s: 9, o: 0.7 });
  g += txt(30, 124, "O(n) time, O(1) space — no extra set or sorting needed.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 140, g), desc: "XOR identities (a^a=0, a^0=a) solve duplicate problems in O(1) space: XOR every element and the pairs cancel, leaving the Single Number. Missing Number = XOR(0..n) ^ XOR(array) leaves the one unmatched value.", alt: "XOR for single number and missing number" };
}
function m47_t5() {
  let g = title(14, "Swap, masks & flags");
  g += box(30, 40, 280, 30, 1) + txt(45, 60, "XOR swap:  a^=b; b^=a; a^=b;", { mono: true, s: 9.5 });
  g += box(330, 40, 400, 30, 0) + txt(345, 60, "mask: set 1<<i · clear ~(1<<i) · toggle ^(1<<i)", { mono: true, s: 9 });
  g += txt(30, 100, "Flags: combine permissions with OR (READ | WRITE), check membership with AND (flags & WRITE).", { s: 9.5, o: 0.85 });
  g += txt(30, 122, "A single int packs up to 32 boolean options — compact, fast set operations.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 138, g), desc: "Practical bitwise: XOR swap exchanges two values without a temp. Masks set/clear/toggle individual bits. Flag enums combine options with OR (READ|WRITE) and test them with AND — one int packs up to 32 booleans.", alt: "XOR swap, bit masks, and flag enums" };
}

// ════════════ M48 — Recursion & D&C patterns ════════════
function m48_t1() {
  let g = title(14, "Recursion template");
  g += box(30, 40, 340, 30, 4) + txt(45, 60, "base case: smallest input → return directly", { s: 9.5 });
  g += box(30, 80, 340, 30, 0) + txt(45, 100, "recursive case: reduce → recurse → combine", { s: 9.5 });
  g += tnode(560, 56, "f(n)", 0, 18) + edge(545, 70, 510, 100) + edge(575, 70, 610, 100) + tnode(510, 112, "f(n-1)", 0, 16) + tnode(610, 112, "…", 5, 14);
  g += txt(30, 140, "Every recursion needs a base case (stops) and a recursive case that moves toward it.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 156, g), desc: "Recursion has two parts: a base case that returns directly on the smallest input, and a recursive case that reduces the problem, recurses, and combines results. Without progress toward the base case it never terminates.", alt: "Recursion template: base case and recursive case" };
}
function m48_t2() {
  let g = title(14, "Power set via bitmask (n = 3)");
  for (let m = 0; m < 8; m++) {
    const x = 30 + (m % 4) * 180, y = 40 + Math.floor(m / 4) * 40;
    const b = m.toString(2).padStart(3, "0");
    const subset = [0, 1, 2].filter(i => (m >> i) & 1).join(",");
    g += box(x, y, 168, 30, 0) + txt(x + 10, y + 19, b, { mono: true, s: 10, w: 700 }) + txt(x + 60, y + 19, "→ {" + subset + "}", { mono: true, s: 9.5, o: 0.8 });
  }
  g += txt(30, 140, "Iterate masks 0 … 2ⁿ−1; bit i set → element i is in the subset. 2ⁿ subsets total.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 156, g), desc: "The power set of n elements has 2ⁿ subsets. Iterate every bitmask from 0 to 2ⁿ-1; for each, element i is included when bit i is set. (Backtracking include/exclude is the recursive equivalent.)", alt: "Power set enumerated by bitmask" };
}
function m48_t3() {
  let g = title(14, "Permutations vs combinations");
  g += box(30, 44, 340, 56, 0) + txt(200, 64, "Permutations — ORDER matters", { a: "middle", s: 10, w: 600 });
  g += txt(200, 84, "(1,2) ≠ (2,1) · n! · used[] flags", { a: "middle", mono: true, s: 9 });
  g += box(390, 44, 340, 56, 1) + txt(560, 64, "Combinations — order does NOT matter", { a: "middle", s: 10, w: 600 });
  g += txt(560, 84, "{1,2} = {2,1} · C(n,k) · start index", { a: "middle", mono: true, s: 9 });
  g += txt(30, 134, "Both are backtracking; the difference is whether you reuse earlier elements (start index) and track order.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 150, g), desc: "Permutations care about order ((1,2)≠(2,1)), count n!, and track a used[] array. Combinations ignore order ({1,2}={2,1}), count C(n,k), and use a start index to avoid revisiting earlier elements. Both are backtracking.", alt: "Permutations versus combinations" };
}
function m48_t4() {
  let g = title(14, "Divide & conquer");
  g += tnode(380, 44, "problem", 0, 22);
  g += edge(360, 60, 250, 96) + edge(400, 60, 510, 96);
  g += tnode(250, 110, "half", 3, 20) + tnode(510, 110, "half", 3, 20);
  g += arr(280, 124, 360, 150, "g") + arr(480, 124, 400, 150, "g");
  g += box(300, 150, 160, 26, 1) + txt(380, 167, "combine results", { a: "middle", s: 9.5 });
  g += txt(560, 100, "split → conquer", { s: 9, o: 0.75 }) + txt(560, 118, "→ combine", { s: 9, o: 0.75 });
  g += txt(30, 204, "Merge Sort, Quick Sort, Binary Search, Karatsuba. T(n) = a·T(n/b) + f(n) (Master Theorem).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 220, g), desc: "Divide & conquer splits a problem into independent subproblems, solves each recursively, and combines the results — Merge Sort, Quick Sort, Binary Search, Karatsuba. The cost follows T(n)=a·T(n/b)+f(n) (Master Theorem).", alt: "Divide and conquer: split, conquer, combine" };
}
function m48_t5() {
  let g = title(14, "Pruning & early termination");
  g += tnode(380, 44, "root", 5, 16);
  g += edge(366, 56, 280, 92) + edge(394, 56, 480, 92);
  g += tnode(280, 104, "ok", 1, 16) + tnode(480, 104, "invalid", 4, 18);
  g += txt(520, 108, "✗ prune — stop exploring", { s: 9, fill: RED });
  g += edge(266, 116, 220, 150) + edge(294, 116, 340, 150) + tnode(220, 162, "…", 1, 12) + tnode(340, 162, "…", 1, 12);
  g += txt(30, 200, "Cut a branch the moment a partial solution breaks a constraint or can't beat the best-so-far (bound).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 216, g), desc: "Pruning cuts a recursion branch the moment a partial solution violates a constraint or can't beat the best result so far (bounding). It keeps backtracking/D&C tractable by skipping whole subtrees — e.g. N-Queens conflicts, branch-and-bound.", alt: "Recursion tree with a pruned invalid branch" };
}

// ════════════ M49 — Modern Java ════════════
function m49_t1() {
  let g = title(14, "Records — immutable data carriers");
  g += box(30, 42, 290, 30, 3) + txt(45, 62, "record Point(int x, int y) { }", { mono: true, s: 10, w: 600 });
  g += arr(320, 57, 360, 57, "", "auto-generates");
  ["canonical constructor", "x() and y() accessors", "equals() + hashCode()", "toString()"].forEach((t, i) => g += box(380 + (i % 2) * 180, 42 + Math.floor(i / 2) * 34, 172, 28, 1) + txt(380 + (i % 2) * 180 + 86, 60 + Math.floor(i / 2) * 34, t, { a: "middle", s: 9 }));
  g += txt(30, 130, "Fields are final, no setters — a transparent, immutable data carrier. Great for DTOs and value objects.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 146, g), desc: "A record declares an immutable data carrier in one line; the compiler generates the canonical constructor, component accessors (x(), y()), equals/hashCode, and toString. Fields are final with no setters — ideal for DTOs and value objects.", alt: "Record auto-generating its members" };
}
function m49_t2() {
  let g = title(14, "var — local-variable type inference");
  g += box(30, 42, 420, 30, 0) + txt(45, 62, "var list = new ArrayList<String>();", { mono: true, s: 10 });
  g += arr(450, 57, 490, 57) + box(490, 42, 240, 30, 1) + txt(610, 62, "inferred: ArrayList<String>", { a: "middle", mono: true, s: 9 });
  g += txt(30, 100, "✓ allowed: local variables WITH an initializer (and for-loop variables).", { s: 9.5, fill: GRN });
  g += txt(30, 122, "✗ not allowed: fields, method params/returns, or var x = null (no type to infer).", { s: 9.5, fill: RED });
  return { svg: svg(760, 138, g), desc: "var lets the compiler infer a local variable's static type from its initializer (it's still strongly typed, not dynamic). Allowed for locals with an initializer and loop variables; not for fields, parameters/returns, or null initializers.", alt: "var type inference example" };
}
function m49_t3() {
  let g = title(14, "Text blocks — multi-line strings");
  g += box(30, 40, 360, 96, 5) + txt(44, 58, '"""', { mono: true, s: 11, fill: "#0a84ff" }) + txt(44, 78, '  {', { mono: true, s: 10 }) + txt(44, 96, '    "name": "Aisha"', { mono: true, s: 10 }) + txt(44, 114, '  }', { mono: true, s: 10 }) + txt(44, 132, '"""', { mono: true, s: 11, fill: "#0a84ff" });
  g += txt(420, 60, "preserves newlines", { s: 9.5, o: 0.85 });
  g += txt(420, 82, "strips incidental indentation", { s: 9.5, o: 0.85 });
  g += txt(420, 104, "no escaping quotes", { s: 9.5, o: 0.85 });
  g += txt(420, 126, "great for JSON / SQL / HTML literals", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 152, g), desc: "Text blocks (\"\"\" ... \"\"\") hold multi-line string literals: newlines are preserved, incidental leading indentation is stripped, and inner quotes need no escaping — perfect for embedding JSON, SQL, or HTML.", alt: "Java text block syntax" };
}
function m49_t4() {
  let g = title(14, "Sealed classes — a restricted hierarchy");
  g += box(250, 40, 260, 28, 3) + txt(380, 59, "sealed interface Shape", { a: "middle", mono: true, s: 10, w: 600 });
  g += edge(310, 68, 180, 104) + edge(380, 68, 380, 104) + edge(450, 68, 580, 104);
  ["Circle", "Square", "Triangle"].forEach((t, i) => g += box([120, 320, 520][i], 104, 120, 28, 1) + txt([180, 380, 580][i], 123, t, { a: "middle", s: 9.5 }));
  g += txt(30, 162, "permits ONLY the listed subtypes; each must be final, sealed, or non-sealed.", { s: 9.5, o: 0.85 });
  g += txt(30, 184, "→ switch over a sealed type is exhaustive — no default branch needed.", { s: 9.5, fill: GRN });
  return { svg: svg(760, 200, g), desc: "A sealed type explicitly permits only a fixed set of subtypes (each final, sealed, or non-sealed). This closes the hierarchy, so a switch over a sealed type is exhaustive — the compiler knows every case and no default is required.", alt: "Sealed interface with permitted subtypes" };
}
function m49_t5() {
  let g = title(14, "Pattern matching — instanceof & switch");
  g += box(30, 42, 700, 28, 0) + txt(45, 61, "if (obj instanceof String s) { use s directly }   // no cast needed", { mono: true, s: 9.5 });
  g += txt(30, 96, "switch (shape) {", { mono: true, s: 9.5 });
  g += txt(60, 114, "case Circle c    -> c.radius();", { mono: true, s: 9.5 });
  g += txt(60, 132, "case Square sq   -> sq.side();", { mono: true, s: 9.5 });
  g += txt(60, 150, "}  // exhaustive when Shape is sealed — no default", { mono: true, s: 9, fill: GRN });
  return { svg: svg(760, 166, g), desc: "Pattern matching binds and tests in one step: instanceof String s casts automatically into s. switch patterns (case Circle c -> ...) replace instanceof chains and become exhaustive (no default) when the type is sealed.", alt: "instanceof and switch pattern matching" };
}

// ════════════ M50 — Engineering Hygiene ════════════
function m50_t1() {
  let g = title(14, "Build lifecycle — Maven / Gradle");
  ["validate", "compile", "test", "package", "verify", "install", "deploy"].forEach((s, i) => { const x = 14 + i * 107; g += box(x, 50, 98, 28, i % 6) + txt(x + 49, 69, s, { a: "middle", s: 9 }); if (i < 6) g += arr(x + 98, 64, x + 107, 64); });
  g += txt(30, 110, "pom.xml (Maven) or build.gradle (Gradle) declare dependencies, plugins, and the build.", { s: 9.5, o: 0.85 });
  g += txt(30, 132, "Each phase runs all earlier phases first — `mvn package` also compiles + tests.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 148, g), desc: "Maven/Gradle run an ordered build lifecycle: validate → compile → test → package → verify → install → deploy. Each phase implies the earlier ones (mvn package compiles + tests first). pom.xml / build.gradle declare dependencies and plugins.", alt: "Maven build lifecycle phases" };
}
function m50_t2() {
  let g = title(14, "Git — branch, rebase, merge");
  // main line
  [0, 1, 2].forEach(i => { g += tnode(80 + i * 90, 60, "", 0, 12); if (i < 2) g += edge(92 + i * 90, 60, 158 + i * 90, 60); });
  g += txt(40, 64, "main", { a: "end", s: 9, o: 0.7 });
  // feature branch off commit 1
  g += edge(170, 70, 220, 110);
  [0, 1].forEach(i => { g += tnode(220 + i * 90, 120, "", 1, 12); if (i < 1) g += edge(232 + i * 90, 120, 298 + i * 90, 120); });
  g += txt(180, 124, "feature", { a: "end", s: 9, o: 0.7 });
  g += arr(320, 110, 360, 70, "", "rebase / merge");
  g += txt(440, 70, "merge: combine histories (merge commit)", { s: 9, o: 0.8 });
  g += txt(440, 90, "rebase: replay feature commits onto latest main (linear history)", { s: 9, o: 0.8 });
  g += txt(30, 160, "Resolve conflicts at the overlapping hunks, then continue. Pull = fetch + merge/rebase.", { s: 9.5, o: 0.7 });
  return { svg: svg(760, 176, g), desc: "Git branches diverge from a commit; merge combines the two histories with a merge commit, while rebase replays the feature commits onto the latest main for a linear history. Conflicts are resolved at overlapping hunks before continuing.", alt: "Git branch with merge versus rebase" };
}
function m50_t3() {
  let g = title(14, "IntelliJ productivity");
  [["Shift Shift", "Search Everywhere"], ["Ctrl/Cmd B", "Go to definition"], ["Alt Enter", "Quick fix / intention"], ["Cmd/Ctrl Alt L", "Reformat code"], ["Shift F6", "Rename (refactor)"], ["Cmd/Ctrl D", "Duplicate line"], ["Alt F7", "Find usages"], ["Ctrl/Cmd /", "Comment line"]].forEach(([k, d], i) => {
    const x = 30 + (i % 2) * 360, y = 40 + Math.floor(i / 2) * 30;
    g += box(x, y, 130, 24, 0) + txt(x + 65, y + 16, k, { a: "middle", mono: true, s: 8.5, w: 600 }) + txt(x + 140, y + 16, d, { s: 9, o: 0.8 });
  });
  return { svg: svg(760, 180, g), desc: "High-leverage IntelliJ shortcuts: Shift-Shift (Search Everywhere), Cmd/Ctrl-B (go to definition), Alt-Enter (quick fix), Cmd/Ctrl-Alt-L (reformat), Shift-F6 (rename refactor), Alt-F7 (find usages). Learning these removes most mouse use.", alt: "IntelliJ keyboard shortcut reference" };
}
function m50_t4() {
  let g = title(14, "Dependency management");
  g += tnode(120, 60, "app", 3, 20);
  g += edge(110, 76, 70, 110) + edge(130, 76, 180, 110);
  g += tnode(60, 122, "libA", 0, 18) + tnode(190, 122, "libB", 0, 18);
  g += edge(70, 138, 110, 168) + edge(180, 138, 140, 168);
  g += tnode(125, 180, "libC", 4, 18) + txt(160, 184, "← version conflict", { s: 9, fill: RED });
  g += txt(320, 90, "transitive deps pulled automatically", { s: 9.5, o: 0.85 });
  g += txt(320, 112, "conflict (libC 1.0 vs 2.0) → 'nearest wins'", { s: 9.5, o: 0.85 });
  g += txt(320, 134, "scopes: compile · test · provided · runtime", { mono: true, s: 9, o: 0.8 });
  g += txt(320, 160, "lock versions; run `mvn dependency:tree` to inspect.", { s: 9, o: 0.7 });
  return { svg: svg(760, 210, g), desc: "Build tools pull transitive dependencies automatically, forming a tree. When two paths need different versions of the same library, the 'nearest wins' rule resolves it. Use scopes (compile/test/provided) and inspect with dependency:tree.", alt: "Dependency tree with a version conflict" };
}
function m50_t5() {
  let g = title(14, "Standard project structure");
  const rows2 = [["project/", 0], ["  pom.xml  (or build.gradle)", 1], ["  src/main/java/      ← production code", 0], ["  src/main/resources/ ← config, static", 0], ["  src/test/java/      ← tests (mirror packages)", 0], ["  target/  (or build/) ← compiled output", 1]];
  rows2.forEach(([t, ci], i) => { const y = 42 + i * 22; g += box(30, y, 420, 18, ci, 4) + txt(40, y + 13, t, { mono: true, s: 8.5 }); });
  g += txt(470, 80, "convention over configuration:", { s: 9.5, w: 600 });
  g += txt(470, 100, "tools find code by its standard path", { s: 9, o: 0.8 });
  g += txt(470, 120, "test packages mirror main packages", { s: 9, o: 0.8 });
  return { svg: svg(760, 180, g), desc: "Standard Maven/Gradle layout: src/main/java for production code, src/main/resources for config, src/test/java for tests (mirroring the main packages), and target/ or build/ for compiled output. Convention over configuration lets tools locate everything by its standard path.", alt: "Standard Maven project directory structure" };
}

// ════════════ M42 / M44 / M51 — structural process diagrams ════════════
function m42_t1() {
  let g = title(14, "Coding-interview framework");
  ["Clarify", "Examples", "Approach", "Code", "Test"].forEach((s, i) => { const x = 24 + i * 148; g += box(x, 46, 138, 30, i % 5) + txt(x + 69, 65, s, { a: "middle", s: 9.5 }); if (i < 4) g += arr(x + 138, 61, x + 148, 61); });
  g += txt(30, 100, "Approach = brute force first, then optimize. State time & space before coding.", { s: 9.5, o: 0.85 });
  g += txt(30, 122, "Think aloud · communicate trade-offs · drive the conversation. The process scores as much as the answer.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 138, g), desc: "A reliable coding-interview framework: Clarify the problem → walk Examples → state an Approach (brute force, then optimize, with complexity) → Code → Test. Think aloud and communicate trade-offs — the process is scored as much as the final solution.", alt: "Coding interview framework pipeline" };
}
function m42_t3() {
  let g = title(14, "Communicating time complexity");
  ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"].forEach((c, i) => { const x = 24 + i * 122; g += box(x, 46, 112, 30, i < 2 ? 1 : i < 4 ? 2 : 4) + txt(x + 56, 65, c, { a: "middle", mono: true, s: 10, w: 600 }); if (i < 5) g += txt(x + 116, 66, "<", { a: "middle", s: 11, o: 0.5 }); });
  g += txt(30, 100, "State BOTH time and space, and justify it: \"one pass → O(n); the HashMap adds O(n) space.\"", { s: 9.5, o: 0.85 });
  g += txt(30, 122, "Derive from structure: nested loops → multiply; halving → log; recursion depth → stack space.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 138, g), desc: "Fluent complexity talk: know the ladder O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ), always state time AND space, and justify it from the code's structure (nested loops multiply, halving gives log, recursion depth = stack space).", alt: "Big-O complexity ladder" };
}
function m44_t1() {
  let g = title(14, "STAR method");
  [["Situation", "context / background", 0], ["Task", "your responsibility", 3], ["Action", "what YOU did (specific)", 1], ["Result", "quantified impact", 2]].forEach(([h, d, ci], i) => { const x = 18 + i * 184; g += box(x, 46, 172, 50, ci) + txt(x + 86, 66, h, { a: "middle", s: 11, w: 700 }) + txt(x + 86, 84, d, { a: "middle", s: 8.5, o: 0.7 }); if (i < 3) g += arr(x + 172, 71, x + 184, 71); });
  g += txt(30, 124, "Spend most time on ACTION (your specific contribution) and RESULT (numbers: latency −40%, ₹2L saved).", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 140, g), desc: "STAR structures behavioral answers: Situation (context) → Task (your responsibility) → Action (what YOU specifically did) → Result (quantified impact). Spend most of the answer on Action and Result, with concrete numbers.", alt: "STAR method four steps" };
}
function m51_t1() {
  let g = title(14, "Anatomy of a good PR description");
  [["Title", "concise, imperative — what it does"], ["What", "summary of the change"], ["Why", "context / linked ticket"], ["How to test", "steps for the reviewer"], ["Screens / Risks", "visuals + rollback notes"]].forEach(([h, d], i) => { const y = 40 + i * 26; g += box(30, y, 140, 22, 0) + txt(40, y + 15, h, { s: 9, w: 600 }) + txt(180, y + 15, d, { s: 9, o: 0.8 }); });
  g += txt(30, 178, "Keep PRs small and single-concern — easy to review, easy to revert.", { s: 9.5, o: 0.75 });
  return { svg: svg(760, 194, g), desc: "A good PR description has: a concise imperative Title, What changed, Why (context/ticket), How to test, and Screenshots/Risks. Keep each PR small and focused on one concern so it's easy to review and to revert.", alt: "Pull request description structure" };
}
function m51_t2() {
  let g = title(14, "Code review flow");
  ["open PR", "reviewer reads", "comments", "author addresses", "approve → merge"].forEach((s, i) => { const x = 14 + i * 150; g += box(x, 46, 140, 30, i === 4 ? 1 : 0) + txt(x + 70, 65, s, { a: "middle", s: 9 }); if (i < 4) g += arr(x + 140, 61, x + 150, 61); });
  g += arr(530, 76, 200, 90, "", "request changes → loop");
  g += txt(30, 122, "Giving: be kind & specific, distinguish blocking from nit, ask questions not commands.", { s: 9.5, o: 0.85 });
  g += txt(30, 144, "Receiving: critique is about the code, not you; thank reviewers; push back with reasons.", { s: 9.5, o: 0.8 });
  return { svg: svg(760, 160, g), desc: "Code review flow: open PR → reviewer reads → leaves comments → author addresses → approve & merge (looping back on requested changes). Give feedback that's kind, specific, and labels blocking vs nit; receive it as being about the code, not you.", alt: "Code review workflow" };
}
function m51_t4() {
  let g = title(14, "Commit message anatomy (Conventional Commits)");
  g += box(30, 42, 560, 26, 0) + txt(44, 60, "feat(auth): add Google OAuth login", { mono: true, s: 10, w: 600 });
  g += txt(600, 60, "← type(scope): subject", { s: 8.5, o: 0.6 });
  g += txt(44, 92, "(blank line)", { s: 8.5, o: 0.5 });
  g += box(30, 100, 560, 26, 5) + txt(44, 118, "Body: what changed and WHY (wrap at 72 chars).", { mono: true, s: 9 });
  g += box(30, 132, 560, 26, 5) + txt(44, 150, "Footer: BREAKING CHANGE: …   ·   Refs #123", { mono: true, s: 9 });
  g += txt(30, 184, "Subject ≤ 50 chars, imperative mood (\"add\", not \"added\"). Types: feat · fix · docs · refactor · test · chore.", { s: 9, o: 0.75 });
  return { svg: svg(760, 200, g), desc: "Conventional commit format: a 'type(scope): subject' line (≤50 chars, imperative), a blank line, a body explaining what and why (wrapped at 72), and a footer for BREAKING CHANGE or issue refs. Types: feat, fix, docs, refactor, test, chore.", alt: "Conventional commit message structure" };
}

const SPECS = {
  java_m34_t1: m34_t1, java_m34_t2: m34_t2, java_m34_t3: m34_t3, java_m34_t4: m34_t4, java_m34_t5: m34_t5,
  java_m35_t1: m35_t1, java_m35_t2: m35_t2, java_m35_t3: m35_t3, java_m35_t4: m35_t4, java_m35_t5: m35_t5,
  java_m36_t1: m36_t1, java_m36_t2: m36_t2, java_m36_t3: m36_t3, java_m36_t4: m36_t4, java_m36_t5: m36_t5,
  java_m37_t1: m37_t1, java_m37_t2: m37_t2, java_m37_t3: m37_t3, java_m37_t4: m37_t4, java_m37_t5: m37_t5,
  java_m38_t1: m38_t1, java_m38_t2: m38_t2, java_m38_t3: m38_t3, java_m38_t4: m38_t4, java_m38_t5: m38_t5,
  java_m39_t1: m39_t1, java_m39_t2: m39_t2, java_m39_t3: m39_t3, java_m39_t4: m39_t4, java_m39_t5: m39_t5,
  java_m40_t1: m40_t1, java_m40_t2: m40_t2, java_m40_t3: m40_t3, java_m40_t4: m40_t4, java_m40_t5: m40_t5,
  java_m41_t1: m41_t1, java_m41_t2: m41_t2, java_m41_t3: m41_t3, java_m41_t4: m41_t4, java_m41_t5: m41_t5,
  java_m41_5_t1: m41_5_t1, java_m41_5_t2: m41_5_t2,
  java_m43_t1: m43_t1, java_m43_t2: m43_t2, java_m43_t3: m43_t3, java_m43_t4: m43_t4, java_m43_t5: m43_t5,
  java_m47_t1: m47_t1, java_m47_t2: m47_t2, java_m47_t3: m47_t3, java_m47_t4: m47_t4, java_m47_t5: m47_t5,
  java_m48_t1: m48_t1, java_m48_t2: m48_t2, java_m48_t3: m48_t3, java_m48_t4: m48_t4, java_m48_t5: m48_t5,
  java_m49_t1: m49_t1, java_m49_t2: m49_t2, java_m49_t3: m49_t3, java_m49_t4: m49_t4, java_m49_t5: m49_t5,
  java_m50_t1: m50_t1, java_m50_t2: m50_t2, java_m50_t3: m50_t3, java_m50_t4: m50_t4, java_m50_t5: m50_t5,
  java_m42_t1: m42_t1, java_m42_t3: m42_t3, java_m44_t1: m44_t1,
  java_m51_t1: m51_t1, java_m51_t2: m51_t2, java_m51_t4: m51_t4,
};

async function run() {
  const only = process.argv.slice(2);
  await mongoose.connect(process.env.MONGO_URI);
  const T = mongoose.connection.collection("protopics");
  let n = 0;
  for (const [topicId, fn] of Object.entries(SPECS)) {
    if (only.length && !only.includes(topicId)) continue;
    const { svg: s, desc, alt } = fn();
    if (!/^<svg/.test(s)) { console.error(`✗ ${topicId}: bad svg`); continue; }
    const r = await T.updateOne({ topicId }, { $set: { "teaching.visual_aid": { type: "diagram", description: desc, alt_text: alt, svg: s } } });
    console.log((r.matchedCount ? "✅" : "✗") + ` ${topicId} (${s.length}b)`);
    if (r.matchedCount) n++;
  }
  console.log(`— ${n} set.`);
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });

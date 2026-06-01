/**
 * recursionTree — call-TREE step generator (distinct from recursion.js, which
 * is a call-STACK animator). Renders the recursion as a branching tree so the
 * learner sees the *shape* of the computation:
 *
 *   • naive fib(n)      — exponential blow-up; the same subtree recomputed many
 *                         times (the motivation for DP).
 *   • memoised fib(n)   — identical tree, but repeat calls become "memo hit"
 *                         leaves that never expand. The whole point of DP.
 *   • subsets(nums)     — backtracking decision tree (include / exclude at each
 *                         index); leaves are the 2ⁿ subsets.
 *
 * Two-phase build:
 *   1. Simulate execution, building the full node list (parent links) AND an
 *      ordered event log of (nodeId, state, line, note).
 *   2. Lay out the final tree once (stable x,y), then replay the event log into
 *      cumulative frames — each frame carries every node discovered so far with
 *      its current state, so positions never jump.
 *
 * Frame shape:
 *   {
 *     nodes: [{ id, parentId, label, sublabel, x, y, state }],
 *     activeId, code, activeLine,
 *     stats: { calls, memoHits, treeSize },
 *     step: { description, detail }
 *   }
 *
 * Node states: "default" | "active" | "returning" | "memo-hit" | "pruned"
 */

// ── Demo registry ─────────────────────────────────────────────────────────────

const DEMOS = {
  fib_naive: {
    label: "Fibonacci (naive) — exponential",
    defaultN: 5, range: [2, 6],
    build: buildFibNaive,
  },
  fib_memo: {
    label: "Fibonacci (memoised) — DP",
    defaultN: 6, range: [2, 9],
    build: buildFibMemo,
  },
  subsets: {
    label: "Subsets — backtracking tree",
    defaultN: 3, range: [2, 4],
    build: buildSubsets,
  },
};

export const DEMO_IDS      = Object.keys(DEMOS);
export const DEMO_LABELS   = Object.fromEntries(Object.entries(DEMOS).map(([k, v]) => [k, v.label]));
export const DEMO_DEFAULTS = Object.fromEntries(Object.entries(DEMOS).map(([k, v]) => [k, v.defaultN]));
export const DEMO_RANGES   = Object.fromEntries(Object.entries(DEMOS).map(([k, v]) => [k, v.range]));

export function generateRecursionTreeSteps(demoId, n) {
  const demo = DEMOS[demoId] || DEMOS.fib_naive;
  const [lo, hi] = demo.range;
  const safeN = Math.max(lo, Math.min(hi, Number.isFinite(n) ? n : demo.defaultN));
  return demo.build(safeN);
}

// ── Shared layout (N-ary, leaf-packed) ───────────────────────────────────────

function layout(nodesById, rootId) {
  let leafX = 0;
  function assign(id, depth) {
    const node = nodesById[id];
    node.y = depth;
    const kids = node.childIds;
    if (!kids || kids.length === 0) {
      node.x = leafX++;
      return;
    }
    kids.forEach((cid) => assign(cid, depth + 1));
    node.x = (nodesById[kids[0]].x + nodesById[kids[kids.length - 1]].x) / 2;
  }
  assign(rootId, 0);
}

// Builds frames from an event log. Each event = { id, state, line, note }.
// `revealOn` set means the node becomes visible at its first event.
function framesFromLog(nodesById, rootId, code, events, statKey) {
  layout(nodesById, rootId);

  // Global extent of the FULL tree so positions never shift between frames.
  const allNodes = Object.values(nodesById);
  const extent = {
    maxX: Math.max(...allNodes.map((nd) => nd.x), 0),
    maxY: Math.max(...allNodes.map((nd) => nd.y), 0),
  };

  const frames = [];
  const visible = new Set();
  const stateById = {};
  let calls = 0, memoHits = 0;

  for (const ev of events) {
    visible.add(ev.id);
    stateById[ev.id] = ev.state;
    if (ev.state === "active") calls++;
    if (ev.state === "memo-hit") memoHits++;

    const nodes = [...visible].map((id) => {
      const nd = nodesById[id];
      return {
        id,
        parentId: nd.parentId,
        label: nd.label,
        sublabel: nd.sublabel || "",
        x: nd.x, y: nd.y,
        state: stateById[id] || "default",
      };
    });

    frames.push({
      nodes,
      extent,
      activeId: ev.id,
      code,
      activeLine: ev.line,
      stats: { calls, memoHits, treeSize: visible.size },
      step: ev.note,
    });
  }
  return frames;
}

// ── Demo 1: naive fibonacci ───────────────────────────────────────────────────

function buildFibNaive(n) {
  const code = `int fib(int n) {
  if (n < 2) return n;       // base case
  return fib(n-1) + fib(n-2); // two recursive calls
}`;
  const nodesById = {};
  const events = [];
  let counter = 0;
  const id = () => `f${counter++}`;

  function rec(arg, parentId) {
    const myId = id();
    nodesById[myId] = { parentId, label: `fib(${arg})`, sublabel: "", childIds: [] };
    if (parentId) nodesById[parentId].childIds.push(myId);

    events.push({ id: myId, state: "active", line: 1, note: {
      description: `Call fib(${arg}).`,
      detail: arg < 2 ? "Base case ahead." : "Will branch into two calls.",
    }});

    let result;
    if (arg < 2) {
      result = arg;
      nodesById[myId].sublabel = `= ${result}`;
      events.push({ id: myId, state: "returning", line: 1, note: {
        description: `Base case: fib(${arg}) = ${arg}.`, detail: "Return immediately.",
      }});
    } else {
      const a = rec(arg - 1, myId);
      const b = rec(arg - 2, myId);
      result = a + b;
      nodesById[myId].sublabel = `= ${result}`;
      events.push({ id: myId, state: "returning", line: 2, note: {
        description: `fib(${arg}) = fib(${arg - 1}) + fib(${arg - 2}) = ${a} + ${b} = ${result}.`,
        detail: "Combine the two child results.",
      }});
    }
    return result;
  }

  const total = rec(n, null);
  // Final summary frame
  const frames = framesFromLog(nodesById, "f0", code, events);
  const last = frames[frames.length - 1];
  frames.push({
    ...last,
    activeId: null,
    step: {
      description: `fib(${n}) = ${total}. Tree has ${last.stats.treeSize} nodes — many subtrees are recomputed.`,
      detail: "Notice how fib(2), fib(1) appear again and again. This redundancy is what memoisation eliminates.",
    },
  });
  return frames;
}

// ── Demo 2: memoised fibonacci ────────────────────────────────────────────────

function buildFibMemo(n) {
  const code = `int fib(int n, Map<Integer,Integer> memo) {
  if (n < 2) return n;                 // base case
  if (memo.containsKey(n)) return memo.get(n); // memo hit
  int r = fib(n-1, memo) + fib(n-2, memo);
  memo.put(n, r);                      // cache it
  return r;
}`;
  const nodesById = {};
  const events = [];
  let counter = 0;
  const id = () => `f${counter++}`;
  const memo = new Map();

  function rec(arg, parentId) {
    const myId = id();
    nodesById[myId] = { parentId, label: `fib(${arg})`, sublabel: "", childIds: [] };
    if (parentId) nodesById[parentId].childIds.push(myId);

    if (arg < 2) {
      nodesById[myId].sublabel = `= ${arg}`;
      events.push({ id: myId, state: "active",    line: 1, note: { description: `Call fib(${arg}).`, detail: "" } });
      events.push({ id: myId, state: "returning", line: 1, note: { description: `Base case: return ${arg}.`, detail: "" } });
      return arg;
    }

    if (memo.has(arg)) {
      const cached = memo.get(arg);
      nodesById[myId].sublabel = `↺ ${cached}`;
      events.push({ id: myId, state: "memo-hit", line: 2, note: {
        description: `fib(${arg}) already in memo → return ${cached}.`,
        detail: "No expansion — this is the DP saving. The subtree is never built.",
      }});
      return cached;
    }

    events.push({ id: myId, state: "active", line: 0, note: { description: `Call fib(${arg}).`, detail: "Not memoised yet — compute it." } });
    const a = rec(arg - 1, myId);
    const b = rec(arg - 2, myId);
    const r = a + b;
    memo.set(arg, r);
    nodesById[myId].sublabel = `= ${r}`;
    events.push({ id: myId, state: "returning", line: 4, note: {
      description: `fib(${arg}) = ${a} + ${b} = ${r}. Cache it.`,
      detail: `memo[${arg}] = ${r}.`,
    }});
    return r;
  }

  const total = rec(n, null);
  const frames = framesFromLog(nodesById, "f0", code, events);
  const last = frames[frames.length - 1];
  frames.push({
    ...last,
    activeId: null,
    step: {
      description: `fib(${n}) = ${total} in just ${last.stats.treeSize} nodes (${last.stats.memoHits} memo hits).`,
      detail: "Compare to the naive tree: memoisation collapses the exponential tree into a near-linear one.",
    },
  });
  return frames;
}

// ── Demo 3: subsets (backtracking) ────────────────────────────────────────────

function buildSubsets(n) {
  const nums = Array.from({ length: n }, (_, i) => i + 1); // [1,2,...,n]
  const code = `void backtrack(int i, List<Integer> cur) {
  if (i == nums.length) { add(cur); return; } // leaf: a subset
  backtrack(i+1, cur);          // EXCLUDE nums[i]
  cur.add(nums[i]);
  backtrack(i+1, cur);          // INCLUDE nums[i]
  cur.remove(cur.size()-1);     // undo (backtrack)
}`;
  const nodesById = {};
  const events = [];
  let counter = 0;
  const id = () => `n${counter++}`;

  function rec(i, cur, parentId, edgeLabel) {
    const myId = id();
    const label = i === 0 ? "[]" : `[${cur.join(",")}]`;
    nodesById[myId] = { parentId, label: edgeLabel ? `${edgeLabel}: ${label}` : label, sublabel: "", childIds: [] };
    if (parentId) nodesById[parentId].childIds.push(myId);

    events.push({ id: myId, state: "active", line: 0, note: {
      description: `backtrack(i=${i}, cur=[${cur.join(",")}]).`,
      detail: i === nums.length ? "Reached a leaf." : `Decide for nums[${i}] = ${nums[i]}.`,
    }});

    if (i === nums.length) {
      nodesById[myId].sublabel = "✓ subset";
      events.push({ id: myId, state: "returning", line: 1, note: {
        description: `Leaf: record subset [${cur.join(",")}].`, detail: "One of the 2ⁿ subsets.",
      }});
      return;
    }

    // EXCLUDE branch
    rec(i + 1, cur, myId, "skip");
    // INCLUDE branch
    cur.push(nums[i]);
    rec(i + 1, cur, myId, `+${nums[i]}`);
    cur.pop(); // undo

    events.push({ id: myId, state: "returning", line: 5, note: {
      description: `Done both branches at i=${i}. Undo choice (backtrack).`,
      detail: "The 'remove' step restores state for the parent.",
    }});
  }

  rec(0, [], null, "");
  const frames = framesFromLog(nodesById, "n0", code, events);
  const last = frames[frames.length - 1];
  const leafCount = Object.values(nodesById).filter((nd) => nd.childIds.length === 0).length;
  frames.push({
    ...last,
    activeId: null,
    step: {
      description: `Explored all ${leafCount} subsets of [${nums.join(",")}] (2^${n} = ${2 ** n}).`,
      detail: "Each root-to-leaf path is one include/exclude decision sequence.",
    },
  });
  return frames;
}

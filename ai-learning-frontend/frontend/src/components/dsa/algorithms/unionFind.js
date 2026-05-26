/**
 * unionFind — Disjoint Set Union with path compression + union by rank.
 *
 * Used by M37-T5 (Graph Synthesis — MST, Kruskal, Union-Find Applications).
 *
 * Frame shape:
 *   {
 *     parent: number[], rank: number[],
 *     activeNodes: number[],         // nodes touched by current op
 *     pathToRoot: number[],          // for find — node, parent, ..., root
 *     currentOp: string,
 *     phase: 'init'|'find-walk'|'compress'|'union-roots'|'union-link'|'union-same'|'done',
 *     step: { description, detail }
 *   }
 */

export const UNION_FIND_CODE = `// DSU with path compression + union by rank
class DSU {
  int[] parent, rank;

  DSU(int n) {
    parent = new int[n];
    rank   = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
  }

  int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
    return parent[x];
  }

  boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;                         // already connected
    if (rank[ra] < rank[rb])       parent[ra] = rb;
    else if (rank[ra] > rank[rb])  parent[rb] = ra;
    else                         { parent[rb] = ra; rank[ra]++; }
    return true;
  }
}`;

export const LINE_BY_PHASE = { init: 8, "find-walk": 12, compress: 12, "union-roots": 17, "union-link": 19, "union-same": 18, done: 22 };

export const DEMO_OPS = [
  { type: "union", a: 0, b: 1 },
  { type: "union", a: 2, b: 3 },
  { type: "union", a: 4, b: 5 },
  { type: "union", a: 1, b: 2 },
  { type: "find",  a: 3 },
  { type: "union", a: 5, b: 0 },
  { type: "find",  a: 4 },
];

// Returns a fresh seed for `n` nodes (rendered as singleton sets).
export function initialDSU(n) {
  return {
    parent: Array.from({ length: n }, (_, i) => i),
    rank:   new Array(n).fill(0),
  };
}

function findPath(parent, x) {
  const path = [];
  let cur = x;
  while (parent[cur] !== cur) {
    path.push(cur);
    cur = parent[cur];
  }
  path.push(cur);
  return path;   // last element is root
}

export function generateUnionFindSteps(n, ops) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank   = new Array(n).fill(0);
  const frames = [];

  const snap = (activeNodes, pathToRoot, currentOp, phase, step) => frames.push({
    parent: [...parent], rank: [...rank],
    activeNodes: [...activeNodes],
    pathToRoot: [...pathToRoot],
    currentOp, phase, step,
  });

  snap([], [], null, "init", {
    description: `Initialize DSU with ${n} singleton sets.`,
    detail: "parent[i] = i (every node is its own root). rank[i] = 0.",
  });

  for (const op of ops) {
    if (op.type === "find") {
      const path = findPath(parent, op.a);
      const root = path[path.length - 1];
      snap(path, path, `find(${op.a})`, "find-walk", {
        description: `find(${op.a}) — walk parent pointers to root.`,
        detail: `Path: ${path.join(" → ")}. Root = ${root}.`,
      });
      let compressed = false;
      for (const x of path) {
        if (x !== root && parent[x] !== root) {
          parent[x] = root;
          compressed = true;
        }
      }
      if (compressed) {
        snap(path, path, `find(${op.a})`, "compress", {
          description: `Path compression — every walked node now points directly to root ${root}.`,
          detail: "Amortises future find() to ~O(α(n)) per call.",
        });
      }
    } else if (op.type === "union") {
      const pathA = findPath(parent, op.a);
      const pathB = findPath(parent, op.b);
      const ra = pathA[pathA.length - 1];
      const rb = pathB[pathB.length - 1];
      snap([...pathA, ...pathB], [...pathA, ...pathB], `union(${op.a}, ${op.b})`, "union-roots", {
        description: `union(${op.a}, ${op.b}) — find both roots first.`,
        detail: `Root of ${op.a} = ${ra}. Root of ${op.b} = ${rb}.`,
      });
      // Path-compress both walks (canonical DSU)
      for (const x of pathA) if (x !== ra) parent[x] = ra;
      for (const x of pathB) if (x !== rb) parent[x] = rb;

      if (ra === rb) {
        snap([ra], [], `union(${op.a}, ${op.b})`, "union-same", {
          description: "Same root — already in the same set.",
          detail: "No-op (returns false).",
        });
      } else {
        let newRoot, newChild, rankChanged = false;
        if (rank[ra] < rank[rb])      { newRoot = rb; newChild = ra; }
        else if (rank[ra] > rank[rb]) { newRoot = ra; newChild = rb; }
        else                          { newRoot = ra; newChild = rb; rank[ra]++; rankChanged = true; }
        parent[newChild] = newRoot;
        snap([newRoot, newChild], [], `union(${op.a}, ${op.b})`, "union-link", {
          description: `Link ${newChild} → ${newRoot} (union by rank).`,
          detail: rankChanged ? `Ranks were equal → rank[${newRoot}] incremented to ${rank[newRoot]}.` : `Shorter tree under taller.`,
        });
      }
    }
  }

  snap([], [], null, "done", {
    description: "All ops applied.",
    detail: `Final parent: [${parent.join(", ")}]. rank: [${rank.join(", ")}].`,
  });
  return frames;
}

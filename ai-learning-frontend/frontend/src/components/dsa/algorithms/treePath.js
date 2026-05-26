/**
 * treePath — root-to-leaf path-sum DFS.
 *
 * Used by M35-T4 (Tree Path Problems — Path Sum, Max Path, Prefix Technique).
 *
 * Animates DFS with the current path stack visible; when reaching a
 * leaf, checks if the cumulative sum equals the target; valid paths
 * are collected and shown.
 *
 * Frame shape:
 *   {
 *     tree: TreeNode (with state per value),
 *     currentValue: number | null,
 *     pathValues: number[],          // root → current node
 *     pathSum: number,
 *     target: number,
 *     validPaths: number[][],        // collected so far
 *     phase: 'init'|'enter'|'leaf-match'|'leaf-miss'|'return'|'done',
 *     step: { description, detail }
 *   }
 */

export const TREE_PATH_CODE = `// All root-to-leaf paths summing to target
List<List<Integer>> pathSum(Node root, int target) {
  List<List<Integer>> out = new ArrayList<>();
  dfs(root, target, new ArrayDeque<>(), out);
  return out;
}

void dfs(Node n, int remain, Deque<Integer> path, List<List<Integer>> out) {
  if (n == null) return;
  path.push(n.value);
  remain -= n.value;
  if (n.left == null && n.right == null && remain == 0)
    out.add(new ArrayList<>(reverse(path)));
  dfs(n.left,  remain, path, out);
  dfs(n.right, remain, path, out);
  path.pop();                              // backtrack
}`;

export const LINE_BY_PHASE = { init: 4, enter: 10, "leaf-match": 13, "leaf-miss": 12, return: 16, done: 5 };

function markTree(tree, byValue) {
  if (!tree) return null;
  return {
    value: tree.value,
    left:  markTree(tree.left,  byValue),
    right: markTree(tree.right, byValue),
    state: byValue[tree.value] || "default",
  };
}

export function generateTreePathSteps(tree, target) {
  const frames = [];
  const validPaths = [];
  const successValues = new Set();

  function snap(activeValue, pathValues, pathSum, phase, step) {
    const byValue = {};
    for (const v of successValues) byValue[v] = "found";
    for (const v of pathValues) byValue[v] = byValue[v] || "active";
    if (activeValue != null) byValue[activeValue] = phase === "leaf-match" ? "found" : "compare";
    frames.push({
      tree: markTree(tree, byValue),
      currentValue: activeValue,
      pathValues: [...pathValues],
      pathSum,
      target,
      validPaths: validPaths.map((p) => [...p]),
      phase,
      step,
    });
  }

  function dfs(node, path, sum) {
    if (!node) return;
    const newPath = [...path, node.value];
    const newSum = sum + node.value;
    snap(node.value, newPath, newSum, "enter", {
      description: `Visit node ${node.value}. Path: [${newPath.join(", ")}], sum so far = ${newSum}.`,
      detail: node.left == null && node.right == null
        ? `Leaf reached. ${newSum === target ? `Matches target ${target} ✓` : `Doesn't match target ${target}.`}`
        : "Descend into children.",
    });
    if (node.left == null && node.right == null) {
      if (newSum === target) {
        validPaths.push([...newPath]);
        for (const v of newPath) successValues.add(v);
        snap(node.value, newPath, newSum, "leaf-match", {
          description: `Valid path found: [${newPath.join(" → ")}] sums to ${target}.`,
          detail: `Total valid paths so far: ${validPaths.length}.`,
        });
      } else {
        snap(node.value, newPath, newSum, "leaf-miss", {
          description: `Sum ${newSum} ≠ target ${target}. Skip.`,
          detail: "",
        });
      }
      return;
    }
    if (node.left)  dfs(node.left,  newPath, newSum);
    if (node.right) dfs(node.right, newPath, newSum);
    snap(node.value, newPath, newSum, "return", {
      description: `Backtrack from ${node.value} — pop from path.`,
      detail: `Path becomes [${path.join(", ") || "(empty)"}].`,
    });
  }

  snap(null, [], 0, "init", {
    description: `Find all root-to-leaf paths summing to ${target}.`,
    detail: "DFS with a path stack. Push on enter, pop on return.",
  });
  if (tree) dfs(tree, [], 0);
  snap(null, [], 0, "done", {
    description: `Done — ${validPaths.length} path${validPaths.length === 1 ? "" : "s"} found.`,
    detail: validPaths.length > 0
      ? validPaths.map((p) => `[${p.join(" → ")}]`).join("; ")
      : "No path sums to the target.",
  });
  return frames;
}

export function buildPathDemoTree() {
  const n = (v, l = null, r = null) => ({ value: v, left: l, right: r, state: "default" });
  //         5
  //       /   \
  //      4     8
  //     /     / \
  //    11    13  4
  //   /  \      / \
  //  7    2    5   1
  return n(5,
    n(4, n(11, n(7), n(2))),
    n(8, n(13), n(4, n(5), n(1))),
  );
}

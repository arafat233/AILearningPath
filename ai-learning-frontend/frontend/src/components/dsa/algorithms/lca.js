/**
 * lca — Lowest Common Ancestor on a binary tree, recursive variant.
 *
 * Used by M35-T2 (Binary Tree Problems — LCA, Balance, Path Sum, Max Path).
 *
 * Recurrence:
 *   lca(null, p, q) = null
 *   lca(node, p, q) = node                if node is p or q
 *   L = lca(node.left,  p, q)
 *   R = lca(node.right, p, q)
 *   lca(node, p, q) = node                if L && R     (split point)
 *                   = L || R              otherwise     (both in one subtree)
 *
 * Frame shape:
 *   {
 *     tree: marked TreeNode,
 *     activeValue: number | null,
 *     phase: 'enter'|'match'|'recurse-L'|'recurse-R'|'return'|'lca-found'|'done',
 *     callStack: number[],          // values along the current recursion path
 *     p: number, q: number,
 *     lca: number | null,
 *     step: { description, detail }
 *   }
 */

export const LCA_CODE = `// Lowest Common Ancestor (binary tree, recursive)
Node lca(Node root, int p, int q) {
  if (root == null) return null;
  if (root.value == p || root.value == q) return root;
  Node L = lca(root.left,  p, q);
  Node R = lca(root.right, p, q);
  if (L != null && R != null) return root;   // p and q in different subtrees
  return L != null ? L : R;                  // both in one subtree (or neither)
}`;

function markTree(tree, byValue) {
  if (!tree) return null;
  return {
    value: tree.value,
    left:  markTree(tree.left,  byValue),
    right: markTree(tree.right, byValue),
    state: byValue[tree.value] || "default",
  };
}

export function generateLCASteps(tree, p, q) {
  const frames = [];
  const found = new Set();  // values "returned non-null" so far — coloured permanently

  function snap(activeValue, phase, callStack, lca, step) {
    const byValue = {};
    for (const v of found) byValue[v] = "found";
    for (const v of callStack) byValue[v] = byValue[v] || "active";
    if (activeValue != null) byValue[activeValue] = phase === "lca-found" ? "found" : "compare";
    if (lca != null) byValue[lca] = "found";
    if (p != null) byValue[p] = byValue[p] === "found" ? "found" : byValue[p] || "new";
    if (q != null) byValue[q] = byValue[q] === "found" ? "found" : byValue[q] || "new";
    frames.push({
      tree: markTree(tree, byValue),
      activeValue, phase,
      callStack: [...callStack],
      p, q, lca,
      step,
    });
  }

  function rec(node, stack) {
    if (!node) {
      snap(null, "return", stack, null, {
        description: "Reached null — return null.",
        detail: "",
      });
      return null;
    }
    snap(node.value, "enter", [...stack, node.value], null, {
      description: `lca(node ${node.value}, ${p}, ${q})`,
      detail: node.value === p || node.value === q
        ? `Node value matches ${node.value === p ? "p" : "q"} — return self immediately.`
        : "Recurse into left and right subtrees.",
    });
    if (node.value === p || node.value === q) {
      found.add(node.value);
      snap(node.value, "match", [...stack, node.value], null, {
        description: `Matched target ${node.value}. Return this node up.`,
        detail: "Recursive caller will see this as non-null.",
      });
      return node;
    }

    const newStack = [...stack, node.value];
    snap(node.value, "recurse-L", newStack, null, {
      description: `${node.value}: recurse into left = ${node.left?.value ?? "null"}.`,
      detail: "",
    });
    const L = rec(node.left, newStack);

    snap(node.value, "recurse-R", newStack, null, {
      description: `${node.value}: left returned ${L?.value ?? "null"}. Recurse into right = ${node.right?.value ?? "null"}.`,
      detail: "",
    });
    const R = rec(node.right, newStack);

    if (L && R) {
      found.add(node.value);
      snap(node.value, "lca-found", newStack, node.value, {
        description: `Both subtrees returned non-null — node ${node.value} is the LCA.`,
        detail: `Left returned ${L.value}, right returned ${R.value}. ${p} and ${q} split at this node.`,
      });
      return node;
    }

    const ret = L || R;
    if (ret) found.add(node.value);
    snap(node.value, "return", newStack, null, {
      description: `Return ${ret?.value ?? "null"} upward from node ${node.value}.`,
      detail: L && !R ? "Right was null." : R && !L ? "Left was null." : "Both subtrees null — no targets here.",
    });
    return ret;
  }

  snap(null, "enter", [], null, {
    description: `Find LCA of ${p} and ${q}.`,
    detail: "Recursive search; on the way back up, the first node whose left+right both return non-null is the LCA.",
  });
  const result = rec(tree, []);
  snap(null, "done", [], result?.value ?? null, {
    description: result ? `LCA = ${result.value}.` : `LCA not found — at least one of ${p}, ${q} missing.`,
    detail: "",
  });
  return frames;
}

// Same demo tree as TreeTraversalSandbox so learners can compare animations.
export function buildLCADemoTree() {
  const n = (v, l = null, r = null) => ({ value: v, left: l, right: r, state: "default" });
  //          5
  //        /   \
  //       3     8
  //      / \   / \
  //     1   4 7   9
  //      \         \
  //       2         10
  return n(5,
    n(3, n(1, null, n(2)), n(4)),
    n(8, n(7), n(9, null, n(10))),
  );
}

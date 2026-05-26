/**
 * treeTraversals — step generators for all 4 traversal orders.
 *
 * Used by M35-T1 (Tree Traversals — Inorder, Level-Order, Zigzag, Diameter).
 *
 * Five orders supported:
 *   - inorder         left → root → right
 *   - preorder        root → left → right
 *   - postorder       left → right → root
 *   - level-order     BFS, top-down
 *   - zigzag          BFS, alternating L→R and R→L per level
 *
 * Frame shape:
 *   {
 *     tree: TreeNode,        // tree with `state` on each node
 *     currentValue: number | null,
 *     visited: number[],     // values visited so far (in traversal order)
 *     containerLabel: 'call stack' | 'queue' | null,
 *     container: string[],   // human-readable container view (BFS only)
 *     step: { description, detail }
 *   }
 */

export const INORDER_CODE = `// Inorder traversal (left → root → right)
void inorder(Node n, List<Integer> out) {
  if (n == null) return;
  inorder(n.left, out);
  out.add(n.value);
  inorder(n.right, out);
}`;

export const PREORDER_CODE = `// Preorder traversal (root → left → right)
void preorder(Node n, List<Integer> out) {
  if (n == null) return;
  out.add(n.value);
  preorder(n.left, out);
  preorder(n.right, out);
}`;

export const POSTORDER_CODE = `// Postorder traversal (left → right → root)
void postorder(Node n, List<Integer> out) {
  if (n == null) return;
  postorder(n.left, out);
  postorder(n.right, out);
  out.add(n.value);
}`;

export const LEVEL_ORDER_CODE = `// Level-order traversal (BFS via queue)
List<Integer> levelOrder(Node root) {
  List<Integer> out = new ArrayList<>();
  if (root == null) return out;
  Deque<Node> q = new ArrayDeque<>();
  q.add(root);
  while (!q.isEmpty()) {
    Node n = q.poll();
    out.add(n.value);
    if (n.left  != null) q.add(n.left);
    if (n.right != null) q.add(n.right);
  }
  return out;
}`;

export const ZIGZAG_CODE = `// Zigzag traversal (BFS, alternating direction per level)
List<List<Integer>> zigzag(Node root) {
  List<List<Integer>> out = new ArrayList<>();
  if (root == null) return out;
  Deque<Node> q = new ArrayDeque<>();
  q.add(root);
  boolean ltr = true;
  while (!q.isEmpty()) {
    int size = q.size();
    LinkedList<Integer> level = new LinkedList<>();
    for (int i = 0; i < size; i++) {
      Node n = q.poll();
      if (ltr) level.addLast(n.value);
      else     level.addFirst(n.value);
      if (n.left  != null) q.add(n.left);
      if (n.right != null) q.add(n.right);
    }
    out.add(level);
    ltr = !ltr;
  }
  return out;
}`;

// Mark every node with a state by value (cheap: assumes unique values).
function markTree(tree, stateByValue) {
  if (!tree) return null;
  return {
    value: tree.value,
    left:  markTree(tree.left,  stateByValue),
    right: markTree(tree.right, stateByValue),
    state: stateByValue[tree.value] || "default",
  };
}

function snap(tree, currentValue, visited, container, containerLabel, step) {
  const stateByValue = {};
  for (const v of visited) stateByValue[v] = "found";
  if (currentValue != null) stateByValue[currentValue] = "compare";
  return {
    tree: markTree(tree, stateByValue),
    currentValue,
    visited: [...visited],
    container: [...container],
    containerLabel,
    step,
  };
}

function dfsTraversal(tree, order /* 'in'|'pre'|'post' */) {
  const frames = [];
  const visited = [];

  function rec(n, path) {
    if (!n) return;
    if (order === "pre") {
      visited.push(n.value);
      frames.push(snap(tree, n.value, visited, [...path, n.value], "call stack",
        { description: `Visit ${n.value} (root before subtrees).`, detail: `Order so far: ${visited.join(" → ")}` }));
      rec(n.left,  [...path, n.value]);
      rec(n.right, [...path, n.value]);
    } else if (order === "in") {
      rec(n.left, [...path, n.value]);
      visited.push(n.value);
      frames.push(snap(tree, n.value, visited, [...path, n.value], "call stack",
        { description: `Visit ${n.value} (after left subtree).`, detail: `Order so far: ${visited.join(" → ")}` }));
      rec(n.right, [...path, n.value]);
    } else { // post
      rec(n.left,  [...path, n.value]);
      rec(n.right, [...path, n.value]);
      visited.push(n.value);
      frames.push(snap(tree, n.value, visited, [...path, n.value], "call stack",
        { description: `Visit ${n.value} (after both subtrees).`, detail: `Order so far: ${visited.join(" → ")}` }));
    }
  }

  frames.push(snap(tree, null, [], [], "call stack",
    { description: `${order === "in" ? "Inorder" : order === "pre" ? "Preorder" : "Postorder"} from the root.`, detail: "" }));
  rec(tree, []);
  frames.push(snap(tree, null, visited, [], "call stack",
    { description: "Done.", detail: `Final order: ${visited.join(" → ")}` }));
  return frames;
}

function bfsTraversal(tree, zigzag) {
  const frames = [];
  if (!tree) return [snap(null, null, [], [], "queue", { description: "Empty tree.", detail: "" })];
  const visited = [];
  const queue = [tree];

  frames.push(snap(tree, null, [], queue.map((n) => n.value), "queue",
    { description: zigzag ? "Zigzag (level-order with alternating direction)." : "Level-order (BFS).", detail: "" }));

  let ltr = true;
  while (queue.length > 0) {
    const size = queue.length;
    const levelValues = [];
    for (let i = 0; i < size; i++) {
      const n = queue.shift();
      if (ltr) levelValues.push(n.value);
      else     levelValues.unshift(n.value);
      visited.push(n.value);
      if (n.left)  queue.push(n.left);
      if (n.right) queue.push(n.right);
      frames.push(snap(tree, n.value, visited, queue.map((x) => x.value), "queue",
        { description: `Dequeue ${n.value}.`, detail: zigzag ? `Level direction: ${ltr ? "L→R" : "R→L"}. Visited: ${visited.join(" → ")}.` : `Visited: ${visited.join(" → ")}.` }));
    }
    if (zigzag) ltr = !ltr;
  }

  frames.push(snap(tree, null, visited, [], "queue",
    { description: "Done.", detail: `Final order: ${visited.join(" → ")}` }));
  return frames;
}

export const ORDER_CODE = {
  inorder:     INORDER_CODE,
  preorder:    PREORDER_CODE,
  postorder:   POSTORDER_CODE,
  "level-order": LEVEL_ORDER_CODE,
  zigzag:      ZIGZAG_CODE,
};

export function generateTraversalSteps(tree, order) {
  if (order === "inorder")     return dfsTraversal(tree, "in");
  if (order === "preorder")    return dfsTraversal(tree, "pre");
  if (order === "postorder")   return dfsTraversal(tree, "post");
  if (order === "level-order") return bfsTraversal(tree, false);
  if (order === "zigzag")      return bfsTraversal(tree, true);
  return [];
}

// Standard demo tree used by the sandbox.
export function buildDemoTree() {
  // Returns:
  //         1
  //       /   \
  //      2     3
  //     / \   / \
  //    4   5 6   7
  const n = (v, l = null, r = null) => ({ value: v, left: l, right: r, state: "default" });
  return n(1, n(2, n(4), n(5)), n(3, n(6), n(7)));
}

/**
 * TreeSandbox — interactive BST insert + animated search.
 *
 * Used by M35-T1 (Tree Traversals). Insert grows the BST (left if <, right
 * if >=); Search animates the path from root, comparing each node, lighting
 * it as 'compare' and finally 'found' or 'not-found'.
 */
import { useRef, useState } from "react";
import TreeVisualizer from "../TreeVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";

const TREE_CODE = `class Node {
  int value;
  Node left, right;
  Node(int v) { this.value = v; }
}

class BST {
  Node root;

  void insert(int v) {
    root = insertRec(root, v);
  }
  Node insertRec(Node n, int v) {
    if (n == null) return new Node(v);
    if (v < n.value) n.left  = insertRec(n.left,  v);
    else             n.right = insertRec(n.right, v);
    return n;
  }

  boolean search(int v) {
    Node n = root;
    while (n != null) {
      if (n.value == v) return true;
      n = v < n.value ? n.left : n.right;
    }
    return false;
  }
}`;

// Pure helpers
function bstInsert(root, value) {
  if (!root) return { value, left: null, right: null, state: "new" };
  if (value < root.value) return { ...root, left:  bstInsert(root.left,  value) };
  return                       { ...root, right: bstInsert(root.right, value) };
}

function clearStates(root) {
  if (!root) return null;
  return { ...root, state: "default", left: clearStates(root.left), right: clearStates(root.right) };
}

function setStateAt(root, target, state) {
  if (!root) return null;
  if (root.value === target) return { ...root, state };
  if (target < root.value)   return { ...root, left:  setStateAt(root.left,  target, state) };
  return                            { ...root, right: setStateAt(root.right, target, state) };
}

const seed = () => {
  let t = null;
  for (const v of [50, 30, 70, 20, 40, 60, 80]) t = bstInsert(t, v);
  return clearStates(t);
};

export default function TreeSandbox() {
  const [root, setRoot] = useState(seed());
  const [value, setValue] = useState("");
  const [explanation, setExplanation] = useState(
    "Try insert(35) or search(40). BST rule: left < node ≤ right."
  );
  const [busy, setBusy] = useState(false);
  const cancelRef = useRef(false);

  const handleInsert = () => {
    if (busy) return;
    const v = Number(value);
    if (!Number.isFinite(v)) {
      setExplanation("Enter a number to insert.");
      return;
    }
    const next = bstInsert(clearStates(root), v);
    setRoot(next);
    setExplanation(`insert(${v}) — added as a new ${v < (root?.value ?? v) ? "left" : "right"}-subtree leaf.`);
    setValue("");
    setTimeout(() => setRoot((r) => clearStates(r)), 600);
  };

  const handleSearch = async () => {
    if (busy) return;
    const v = Number(value);
    if (!Number.isFinite(v)) {
      setExplanation("Enter a number to search for.");
      return;
    }
    setBusy(true);
    cancelRef.current = false;

    let curr = clearStates(root);
    setRoot(curr);

    let node = curr;
    while (node) {
      if (cancelRef.current) break;
      const lit = setStateAt(curr, node.value, "compare");
      setRoot(lit);
      setExplanation(`Compare ${v} with ${node.value} — ${v === node.value ? "equal!" : v < node.value ? "go left" : "go right"}.`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 600));
      if (node.value === v) {
        const found = setStateAt(curr, node.value, "found");
        setRoot(found);
        setExplanation(`Found ${v}!`);
        setBusy(false);
        return;
      }
      node = v < node.value ? node.left : node.right;
      curr = lit;
    }
    setRoot(clearStates(curr));
    setExplanation(`${v} not found in the tree.`);
    setBusy(false);
  };

  const handleReset = () => {
    cancelRef.current = true;
    setBusy(false);
    setRoot(seed());
    setExplanation("Tree reset to [50, 30, 70, 20, 40, 60, 80].");
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !busy && handleInsert()}
          placeholder="value"
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-32"
        />
        <button onClick={handleInsert} disabled={busy} className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Insert</button>
        <button onClick={handleSearch} disabled={busy} className="px-4 py-2 bg-blue-700  hover:bg-blue-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Search</button>
        <button onClick={handleReset}                 className="px-4 py-2 bg-zinc-700  hover:bg-zinc-600                     rounded-lg text-sm font-medium text-white transition">Reset</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <TreeVisualizer root={root} />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[340px]"><code>{TREE_CODE}</code></pre>
      </div>

      <ExplanationPanel text={explanation} />
    </div>
  );
}

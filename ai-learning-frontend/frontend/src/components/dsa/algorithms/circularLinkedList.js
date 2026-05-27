/**
 * circularLinkedList — step generators for a circular singly-linked list.
 *
 * From the D2 parity checklist. Distinct from regular LL because the
 * tail's .next points back to head — there is no null terminator.
 * Traversal must check `curr === head` to stop, not `curr == null`.
 *
 * Two ops:
 *   generateCLLIntroSteps(values)      — build CLL + traverse-with-termination
 *   generateCLLInsertHeadSteps(...)    — insert at head with tail fix-up
 */

let _uid = 0;
const uid = () => `c${_uid++}`;

export const CLL_TRAVERSE_CODE = `// Traverse a circular linked list
void traverse(Node head) {
  if (head == null) return;
  Node curr = head;
  do {
    visit(curr.value);
    curr = curr.next;
  } while (curr != head);    // termination: returned to head
}`;

export const CLL_INSERT_HEAD_CODE = `// Insert at head of a circular linked list
Node insertHead(Node head, int value) {
  Node n = new Node(value);
  if (head == null) {
    n.next = n;              // single-node CLL points to itself
    return n;
  }
  Node tail = head;
  while (tail.next != head) tail = tail.next;
  n.next = head;
  tail.next = n;             // tail now points to new head
  return n;
}`;

function buildCircular(values) {
  _uid = 0;
  return values.map((v, i) => ({
    id: uid(),
    value: v,
    state: "default",
    next: (i + 1) % values.length,
  }));
}

function snap(nodes, currentIdx, phase, step) {
  return {
    nodes: nodes.map((n, i) => ({ ...n, state: i === currentIdx ? "active" : n.state })),
    currentIdx,
    phase,
    step,
  };
}

export function generateCLLTraverseSteps(values) {
  const frames = [];
  if (values.length === 0) {
    return [snap([], -1, "init", { description: "Empty list — return.", detail: "" })];
  }
  const nodes = buildCircular(values);

  frames.push(snap(nodes, -1, "init", {
    description: `Build CLL: ${values.join(" → ")} → (back to ${values[0]}).`,
    detail: "Tail's next points to head — no null terminator.",
  }));

  // Single traverse
  let curr = 0;
  let visited = 0;
  do {
    frames.push(snap(nodes, curr, "visit", {
      description: `Visit nodes[${curr}].value = ${nodes[curr].value}.`,
      detail: `${visited + 1}/${nodes.length} visited so far.`,
    }));
    curr = nodes[curr].next;
    visited++;
    if (curr !== 0) {
      frames.push(snap(nodes, curr, "advance", {
        description: `curr = curr.next → nodes[${curr}] (value ${nodes[curr].value}).`,
        detail: `Check: curr === head (idx 0)? No, continue.`,
      }));
    } else {
      frames.push(snap(nodes, curr, "terminate", {
        description: "curr.next brought us back to head.",
        detail: `Loop terminates after visiting all ${nodes.length} nodes.`,
      }));
    }
  } while (curr !== 0 && visited < nodes.length);

  frames.push(snap(nodes, -1, "done", {
    description: "Traversal complete.",
    detail: `Visited ${visited} nodes (= list length).`,
  }));
  return frames;
}

export function generateCLLInsertHeadSteps(values, value) {
  const frames = [];
  const nodes = buildCircular(values);

  frames.push(snap(nodes, -1, "init", {
    description: `insertHead(${value}) on a CLL of length ${values.length}.`,
    detail: "Need to find the tail (whose next = head), update it to point to new node.",
  }));

  if (values.length === 0) {
    const single = [{ id: uid(), value, state: "new", next: 0 }];
    single[0].next = 0; // points to itself
    frames.push(snap(single, 0, "create", {
      description: `Empty list → create node, point it to itself.`,
      detail: "CLL with 1 node always has node.next = node.",
    }));
    frames.push(snap(single.map((n) => ({ ...n, state: "default" })), -1, "done", {
      description: "Done. head = new node.",
      detail: "",
    }));
    return frames;
  }

  // Walk to tail (whose next === 0/head)
  let tail = 0;
  while (nodes[tail].next !== 0) tail = nodes[tail].next;
  frames.push(snap(nodes, tail, "find-tail", {
    description: `Walk until tail.next === head (idx 0). Found tail at idx ${tail}.`,
    detail: "",
  }));

  // Insert new node — shift all indices by +1, new node at index 0
  const shifted = nodes.map((n) => ({ ...n, next: n.next + 1, state: "default" }));
  const newNode = { id: uid(), value, state: "new", next: 1 };
  const result = [newNode, ...shifted];
  // The old tail's next pointer (now at index tail+1 in result) should point to 0 (new head)
  result[tail + 1].next = 0;

  frames.push(snap(result, 0, "create", {
    description: `Create new node with value ${value}. newNode.next = old head.`,
    detail: "",
  }));
  frames.push(snap(result, tail + 1, "link-tail", {
    description: `Set oldTail.next = newNode (idx 0).`,
    detail: "CLL property preserved: tail.next still points to head.",
  }));

  const finalNodes = result.map((n) => ({ ...n, state: "default" }));
  frames.push(snap(finalNodes, -1, "done", {
    description: "Done. New head is at idx 0.",
    detail: `CLL: ${finalNodes.map((n) => n.value).join(" → ")} → (back to ${finalNodes[0].value}).`,
  }));
  return frames;
}

export const LINE_BY_PHASE_TRAVERSE = { init: 4, visit: 6, advance: 7, terminate: 8, done: 9 };
export const LINE_BY_PHASE_INSERT_HEAD = { init: 3, create: 4, "find-tail": 9, "link-tail": 11, done: 12 };

export const DEMO_VALUES = [10, 20, 30, 40];

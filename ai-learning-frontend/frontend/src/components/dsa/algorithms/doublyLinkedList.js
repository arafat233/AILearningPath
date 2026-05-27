/**
 * doublyLinkedList — step generators for a doubly-linked list.
 *
 * From the D2 parity checklist (log2base2 covers DLL as a distinct
 * data structure; Stellar didn't until now). Each node has BOTH a
 * prev and a next pointer — every operation has to maintain both.
 *
 * Three ops:
 *   generateDLLIntroSteps(values)             — build a DLL from values
 *   generateDLLInsertHeadSteps(values, value) — insert at head
 *   generateDLLInsertTailSteps(values, value) — insert at tail
 *   generateDLLDeleteSteps(values, pos)       — delete at position
 *
 * Frame:
 *   {
 *     nodes: [{id, value, state, prev: idx|null, next: idx|null}],
 *     phase: 'init'|'create'|'link-next'|'link-prev'|'unlink'|'done',
 *     step: { description, detail }
 *   }
 *
 * `prev`/`next` are array indices into `nodes` (not node ids) for easy
 * SVG arrow rendering.
 */

let _uid = 0;
const uid = () => `d${_uid++}`;

export const DLL_INTRO_CODE = `// Doubly Linked List node
class DLLNode {
  int value;
  DLLNode prev, next;
}

class DLL {
  DLLNode head, tail;

  void append(int v) {
    DLLNode n = new DLLNode();
    n.value = v;
    if (tail == null) {
      head = tail = n;
    } else {
      n.prev = tail;
      tail.next = n;
      tail = n;
    }
  }
}`;

export const DLL_INSERT_HEAD_CODE = `// Insert at head of a DLL
void insertHead(int v) {
  DLLNode n = new DLLNode();
  n.value = v;
  if (head == null) {
    head = tail = n;
    return;
  }
  n.next = head;
  head.prev = n;
  head = n;
}`;

export const DLL_DELETE_CODE = `// Delete at position in a DLL
void deleteAt(int pos) {
  DLLNode n = head;
  for (int i = 0; i < pos && n != null; i++) n = n.next;
  if (n == null) return;
  if (n.prev != null) n.prev.next = n.next;
  else head = n.next;
  if (n.next != null) n.next.prev = n.prev;
  else tail = n.prev;
}`;

function buildNodes(values) {
  _uid = 0;
  return values.map((v, i) => ({
    id: uid(),
    value: v,
    state: "default",
    prev: i === 0 ? null : i - 1,
    next: i === values.length - 1 ? null : i + 1,
  }));
}

function snap(nodes, phase, step) {
  return {
    nodes: nodes.map((n) => ({ ...n })),
    phase,
    step,
  };
}

export function generateDLLIntroSteps(values) {
  const frames = [];
  const nodes = [];
  _uid = 0;

  frames.push(snap(nodes, "init", {
    description: `Build a doubly linked list from [${values.join(", ")}].`,
    detail: "Each node has prev and next. Append at tail: link both directions.",
  }));

  for (let i = 0; i < values.length; i++) {
    const newNode = {
      id: uid(),
      value: values[i],
      state: "new",
      prev: i === 0 ? null : i - 1,
      next: null,
    };
    nodes.push(newNode);
    if (i > 0) nodes[i - 1].next = i;

    frames.push(snap(nodes, "create", {
      description: `Create node for ${values[i]}.`,
      detail: i === 0 ? "First node — becomes both head and tail." : `Set newNode.prev = tail (idx ${i - 1}).`,
    }));

    if (i > 0) {
      frames.push(snap(nodes, "link-next", {
        description: `Link prev tail (idx ${i - 1}) .next → new node (idx ${i}).`,
        detail: "Now both pointers connect the two nodes.",
      }));
    }

    nodes[i].state = "default";
  }

  frames.push(snap(nodes, "done", {
    description: "DLL built.",
    detail: `${nodes.length} node${nodes.length === 1 ? "" : "s"}. head → idx 0, tail → idx ${nodes.length - 1}.`,
  }));
  return frames;
}

export function generateDLLInsertHeadSteps(values, value) {
  const frames = [];
  const nodes = buildNodes(values);

  frames.push(snap(nodes, "init", {
    description: `insertHead(${value}).`,
    detail: "New node's next = old head; old head's prev = new node; head = new node.",
  }));

  // Insert new node at index 0 (visually rendered as new head)
  const newNode = { id: uid(), value, state: "new", prev: null, next: 0 };
  // Bump all existing indices' prev/next references by +1.
  const shifted = nodes.map((n) => ({
    ...n,
    prev: n.prev == null ? null : n.prev + 1,
    next: n.next == null ? null : n.next + 1,
  }));
  if (shifted.length > 0) shifted[0].prev = 0;
  const result = [newNode, ...shifted];

  frames.push(snap(result, "create", {
    description: "Create new node with value " + value + ".",
    detail: "prev = null (will become new head).",
  }));

  if (shifted.length > 0) {
    frames.push(snap(result, "link-next", {
      description: "Link newNode.next → old head.",
      detail: "",
    }));
    frames.push(snap(result, "link-prev", {
      description: "Link oldHead.prev → newNode.",
      detail: "Both pointers wired.",
    }));
  }

  // Mark newNode as default for final frame
  const finalNodes = result.map((n, i) => ({ ...n, state: "default" }));
  frames.push(snap(finalNodes, "done", {
    description: "Done. head now points to the new node.",
    detail: `DLL: ${finalNodes.map((n) => n.value).join(" ⇄ ")}.`,
  }));
  return frames;
}

export function generateDLLDeleteSteps(values, pos) {
  const frames = [];
  const nodes = buildNodes(values);

  if (pos < 0 || pos >= values.length) {
    frames.push(snap(nodes, "init", {
      description: `Invalid position ${pos} for length-${values.length} list.`,
      detail: "No deletion.",
    }));
    return frames;
  }

  frames.push(snap(nodes, "init", {
    description: `deleteAt(${pos}) (node value = ${values[pos]}).`,
    detail: "Walk to position, then re-wire prev.next and next.prev around the deleted node.",
  }));

  // Mark target
  const marked = nodes.map((n, i) => ({ ...n, state: i === pos ? "delete" : "default" }));
  frames.push(snap(marked, "unlink", {
    description: `Found node at position ${pos}.`,
    detail: `Will re-link node ${pos - 1 >= 0 ? pos - 1 : "(null prev)"} and node ${pos + 1 < values.length ? pos + 1 : "(null next)"}.`,
  }));

  // Remove and re-index
  const removed = marked.filter((_, i) => i !== pos);
  const reIdxed = removed.map((n, i) => ({
    ...n,
    state: "default",
    prev: i === 0 ? null : i - 1,
    next: i === removed.length - 1 ? null : i + 1,
  }));
  frames.push(snap(reIdxed, "done", {
    description: `Deleted node ${pos}. DLL is now ${reIdxed.length} node${reIdxed.length === 1 ? "" : "s"} long.`,
    detail: `DLL: ${reIdxed.map((n) => n.value).join(" ⇄ ")}.`,
  }));
  return frames;
}

export const LINE_BY_PHASE_DLL = { init: 13, create: 14, "link-next": 17, "link-prev": 16, unlink: 7, done: 21 };

export const DEMO_VALUES = [10, 20, 30, 40];

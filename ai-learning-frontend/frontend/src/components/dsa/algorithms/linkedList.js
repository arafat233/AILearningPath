/**
 * linkedList — step generators for linked-list operations.
 *
 * Ported verbatim from dsalearn/lib/algorithms/linkedList.ts. The only
 * changes from source are:
 *   - Removed TS-only imports of `ListNode` and `Step` (consumed via
 *     duck typing now)
 *   - Stripped type annotations from function signatures
 *   - The `Step` shape is documented in components/dsa/types.js
 *
 * Three operations exposed:
 *   generateLLIntroSteps(values)            — building the list node-by-node
 *   generateLLInsertSteps(values, data, pos) — insert at position
 *   generateLLDeleteSteps(values, pos)       — delete at position
 *
 * Each returns an array of LinkedListFrame: { nodes, step }.
 */

let _id = 0
const uid = () => `n${_id++}`

export const LL_INTRO_CODE = `// Linked List Node structure
class Node {
  constructor(data) {
    this.data = data
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.head = null
  }

  append(data) {
    const newNode = new Node(data)
    if (!this.head) {
      this.head = newNode
      return
    }
    let curr = this.head
    while (curr.next !== null) {
      curr = curr.next     // traverse to end
    }
    curr.next = newNode    // link new node
  }
}`

export const LL_INSERT_CODE = `function insertAtPosition(head, data, pos) {
  const newNode = new Node(data)

  if (pos === 0) {
    newNode.next = head    // point to old head
    return newNode         // new head
  }

  let curr = head
  let i = 0
  while (curr !== null && i < pos - 1) {
    curr = curr.next       // traverse
    i++
  }

  newNode.next = curr.next // link forward
  curr.next = newNode      // link backward
  return head
}`

export const LL_DELETE_CODE = `function deleteAtPosition(head, pos) {
  if (pos === 0) {
    return head.next       // skip head
  }

  let curr = head
  let i = 0
  while (curr !== null && i < pos - 1) {
    curr = curr.next       // traverse
    i++
  }

  curr.next = curr.next.next  // skip node
  return head
}`

export function generateLLIntroSteps(values) {
  _id = 0
  const frames = []
  const built = []

  frames.push({
    nodes: [],
    step: {
      type: 'highlight',
      description: 'A linked list is a chain of nodes. Each node has data and a pointer to the next node.',
      detail: 'Unlike arrays, nodes are NOT stored in contiguous memory.',
      codeLine: 1,
    },
  })

  for (let i = 0; i < values.length; i++) {
    const newNode = { id: uid(), value: values[i], state: 'new' }
    built.push(newNode)

    frames.push({
      nodes: built.map((n, idx) => ({
        ...n,
        state: idx === built.length - 1 ? 'new' : 'default',
      })),
      step: {
        type: 'insert',
        description: `Creating node with data = ${values[i]}`,
        detail: i === 0
          ? 'This becomes the head of the list.'
          : `Traversing to the last node, then curr.next = newNode`,
        codeLine: i === 0 ? 13 : 22,
      },
    })

    // Settle
    frames.push({
      nodes: built.map(n => ({ ...n, state: 'default' })),
      step: {
        type: 'traverse',
        description: `List now has ${built.length} node${built.length > 1 ? 's' : ''}.`,
        detail: 'Head → ' + built.map(n => n.value).join(' → ') + ' → NULL',
        codeLine: 23,
      },
    })
  }

  return frames
}

export function generateLLInsertSteps(values, insertVal, pos) {
  _id = 0
  const frames = []
  const nodes = values.map(v => ({ id: uid(), value: v, state: 'default' }))

  frames.push({
    nodes: nodes.map(n => ({ ...n })),
    step: {
      type: 'highlight',
      description: `Insert ${insertVal} at position ${pos}.`,
      detail: 'We need to re-wire the next pointers around the new node.',
      codeLine: 1,
    },
  })

  if (pos === 0) {
    const newNode = { id: uid(), value: insertVal, state: 'new' }
    frames.push({
      nodes: [newNode, ...nodes],
      step: {
        type: 'insert',
        description: `Inserting at head: newNode.next = head`,
        detail: 'The new node becomes the new head.',
        codeLine: 5,
      },
    })
    frames.push({
      nodes: [{ ...newNode, state: 'default' }, ...nodes],
      step: {
        type: 'sorted',
        description: `Done! ${insertVal} is now the new head.`,
        codeLine: 6,
      },
    })
    return frames
  }

  // Traverse to pos-1
  for (let i = 0; i < Math.min(pos - 1, nodes.length - 1); i++) {
    frames.push({
      nodes: nodes.map((n, idx) => ({ ...n, state: idx === i ? 'active' : 'default' })),
      step: {
        type: 'traverse',
        description: `Traversing: at node ${i} (value=${nodes[i].value})`,
        detail: `Moving curr to next. Need to reach position ${pos - 1}.`,
        codeLine: 11,
      },
    })
  }

  const insertAfter = Math.min(pos - 1, nodes.length - 1)
  const newNode = { id: uid(), value: insertVal, state: 'new' }
  const newNodes = [
    ...nodes.slice(0, insertAfter + 1),
    newNode,
    ...nodes.slice(insertAfter + 1),
  ]

  frames.push({
    nodes: newNodes.map((n, idx) => ({
      ...n,
      state: idx === insertAfter + 1 ? 'new' : idx === insertAfter ? 'active' : 'default',
    })),
    step: {
      type: 'insert',
      description: `newNode.next = curr.next; curr.next = newNode`,
      detail: `Linking ${insertVal} between position ${insertAfter} and ${insertAfter + 1}.`,
      codeLine: 16,
    },
  })

  frames.push({
    nodes: newNodes.map(n => ({ ...n, state: 'default' })),
    step: {
      type: 'sorted',
      description: `Done! ${insertVal} inserted at position ${pos}.`,
      detail: 'All pointers correctly updated.',
      codeLine: 17,
    },
  })

  return frames
}

export function generateLLDeleteSteps(values, pos) {
  _id = 0
  const frames = []
  const nodes = values.map(v => ({ id: uid(), value: v, state: 'default' }))

  frames.push({
    nodes: nodes.map(n => ({ ...n })),
    step: {
      type: 'highlight',
      description: `Delete node at position ${pos} (value = ${values[pos] ?? '?'}).`,
      detail: 'We re-wire the previous node\'s next pointer to skip the deleted node.',
      codeLine: 1,
    },
  })

  if (pos === 0) {
    const deleted = nodes[0]
    frames.push({
      nodes: nodes.map((n, i) => ({ ...n, state: i === 0 ? 'delete' : 'default' })),
      step: {
        type: 'delete',
        description: `Deleting head node (value = ${deleted.value})`,
        detail: 'Return head.next as the new head.',
        codeLine: 3,
      },
    })
    frames.push({
      nodes: nodes.slice(1).map(n => ({ ...n, state: 'default' })),
      step: {
        type: 'sorted',
        description: `Done! Node ${deleted.value} removed. New head = ${nodes[1]?.value ?? 'NULL'}.`,
        codeLine: 3,
      },
    })
    return frames
  }

  // Traverse
  for (let i = 0; i < pos - 1 && i < nodes.length - 1; i++) {
    frames.push({
      nodes: nodes.map((n, idx) => ({ ...n, state: idx === i ? 'active' : 'default' })),
      step: {
        type: 'traverse',
        description: `Traversing: at node ${i} (value=${nodes[i].value})`,
        detail: `Need to reach position ${pos - 1} to re-wire.`,
        codeLine: 8,
      },
    })
  }

  const prevIdx = Math.min(pos - 1, nodes.length - 1)
  const delIdx = Math.min(pos, nodes.length - 1)

  frames.push({
    nodes: nodes.map((n, idx) => ({
      ...n,
      state: idx === delIdx ? 'delete' : idx === prevIdx ? 'active' : 'default',
    })),
    step: {
      type: 'delete',
      description: `Marking node ${delIdx} (value=${nodes[delIdx].value}) for deletion.`,
      detail: `curr.next = curr.next.next — skipping the node.`,
      codeLine: 11,
    },
  })

  const result = nodes.filter((_, i) => i !== delIdx)
  frames.push({
    nodes: result.map(n => ({ ...n, state: 'default' })),
    step: {
      type: 'sorted',
      description: `Done! Node ${nodes[delIdx].value} removed from position ${pos}.`,
      detail: 'Memory freed, pointers updated.',
      codeLine: 11,
    },
  })

  return frames
}

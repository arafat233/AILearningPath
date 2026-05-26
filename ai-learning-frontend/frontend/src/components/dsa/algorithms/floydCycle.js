/**
 * floydCycle — Floyd's tortoise-and-hare cycle detection on a linked list.
 *
 * Used by M32-T4 (Cycle Detection — Floyd's Algorithm). Wired to M32-T2
 * as well because two-pointer technique IS what makes this work.
 *
 * Frame shape:
 *   {
 *     nodes: {id, value}[],   // node list (positions are layout-implicit)
 *     cycleEntryIdx: number | null,  // node index where last node loops to
 *     slow: number,           // index of slow pointer
 *     fast: number,           // index of fast pointer (-1 if past end)
 *     phase: 'init' | 'advance' | 'meet' | 'no-cycle',
 *     step: { description, detail }
 *   }
 */

export const FLOYD_CYCLE_CODE = `// Floyd's cycle detection (tortoise & hare)
boolean hasCycle(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;          // 1 step
    fast = fast.next.next;     // 2 steps
    if (slow == fast) return true;
  }
  return false;
}`;

/**
 * @param {{value:number}[]} values  Node values for the linked list
 * @param {number|null} cycleEntryIdx  Index where the LAST node's .next loops back
 *                                       (or null for no cycle)
 */
export function generateFloydSteps(values, cycleEntryIdx) {
  const n = values.length;
  const nodes = values.map((v, i) => ({ id: `n${i}`, value: v }));

  // Build next() helper based on cycleEntryIdx
  const next = (idx) => {
    if (idx < 0)              return -1;
    if (idx < n - 1)          return idx + 1;
    if (cycleEntryIdx == null) return -1;
    return cycleEntryIdx;
  };

  const frames = [];
  let slow = 0, fast = 0;

  frames.push({
    nodes, cycleEntryIdx, slow, fast, phase: "init",
    step: {
      description: "Initialize slow and fast pointers at head.",
      detail: cycleEntryIdx == null
        ? "List has no cycle. Fast will reach null."
        : `List has a cycle: tail loops back to index ${cycleEntryIdx}.`,
    },
  });

  // Step loop — bound by 2n to prevent runaway in case of bug
  for (let guard = 0; guard < 2 * n + 4; guard++) {
    const slowNext = next(slow);
    const fastNext1 = next(fast);
    const fastNext2 = fastNext1 < 0 ? -1 : next(fastNext1);

    if (fast < 0 || fastNext1 < 0) {
      frames.push({
        nodes, cycleEntryIdx, slow, fast: -1, phase: "no-cycle",
        step: {
          description: "Fast pointer reached end of list.",
          detail: "No cycle — return false.",
        },
      });
      return frames;
    }

    slow = slowNext;
    fast = fastNext2;

    frames.push({
      nodes, cycleEntryIdx, slow, fast, phase: "advance",
      step: {
        description: `Advance: slow → node ${slow} (value ${nodes[slow].value}), fast → node ${fast >= 0 ? fast : "null"}${fast >= 0 ? ` (value ${nodes[fast].value})` : ""}.`,
        detail: "Slow moves 1, fast moves 2.",
      },
    });

    if (fast < 0) {
      frames.push({
        nodes, cycleEntryIdx, slow, fast: -1, phase: "no-cycle",
        step: {
          description: "Fast reached null.",
          detail: "No cycle — return false.",
        },
      });
      return frames;
    }

    if (slow === fast) {
      frames.push({
        nodes, cycleEntryIdx, slow, fast, phase: "meet",
        step: {
          description: `Slow and fast met at node ${slow} (value ${nodes[slow].value}).`,
          detail: "Cycle confirmed — return true.",
        },
      });
      return frames;
    }
  }

  // Shouldn't reach here, but if it does just emit a terminal frame.
  frames.push({
    nodes, cycleEntryIdx, slow, fast, phase: "no-cycle",
    step: { description: "Step limit reached.", detail: "" },
  });
  return frames;
}

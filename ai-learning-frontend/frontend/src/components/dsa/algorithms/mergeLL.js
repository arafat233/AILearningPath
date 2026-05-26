/**
 * mergeLL — merge two sorted linked lists with two pointers.
 *
 * Used by M32-T5 (Merge and Sort Linked Lists).
 *
 * Frame shape:
 *   {
 *     listA: number[], listB: number[],
 *     ptrA: number, ptrB: number,        // -1 once exhausted
 *     merged: number[],
 *     activeNode: 'A'|'B'|null,
 *     phase: 'init'|'compare'|'pick-A'|'pick-B'|'flush-A'|'flush-B'|'done',
 *     step: { description, detail }
 *   }
 */

export const MERGE_LL_CODE = `// Merge two sorted linked lists
ListNode merge(ListNode a, ListNode b) {
  ListNode dummy = new ListNode(0);
  ListNode tail = dummy;
  while (a != null && b != null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else                    { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = (a != null) ? a : b;       // append remainder
  return dummy.next;
}`;

export const LINE_BY_PHASE = { init: 3, compare: 6, "pick-A": 6, "pick-B": 7, "flush-A": 10, "flush-B": 10, done: 11 };

export function generateMergeLLSteps(listA, listB) {
  const frames = [];
  let i = 0, j = 0;
  const merged = [];

  frames.push({
    listA, listB, ptrA: 0, ptrB: 0, merged: [],
    activeNode: null, phase: "init",
    step: {
      description: `Merge sorted lists A and B with a single pass.`,
      detail: "Maintain two pointers; pick the smaller head each step.",
    },
  });

  while (i < listA.length && j < listB.length) {
    frames.push({
      listA, listB, ptrA: i, ptrB: j, merged: [...merged],
      activeNode: null, phase: "compare",
      step: {
        description: `Compare A[${i}] = ${listA[i]} with B[${j}] = ${listB[j]}.`,
        detail: listA[i] <= listB[j] ? `A is ≤ — take A[${i}].` : `B is smaller — take B[${j}].`,
      },
    });
    if (listA[i] <= listB[j]) {
      merged.push(listA[i]);
      frames.push({
        listA, listB, ptrA: i, ptrB: j, merged: [...merged],
        activeNode: "A", phase: "pick-A",
        step: { description: `Append A[${i}] = ${listA[i]} to merged.`, detail: `merged = [${merged.join(", ")}].` },
      });
      i++;
    } else {
      merged.push(listB[j]);
      frames.push({
        listA, listB, ptrA: i, ptrB: j, merged: [...merged],
        activeNode: "B", phase: "pick-B",
        step: { description: `Append B[${j}] = ${listB[j]} to merged.`, detail: `merged = [${merged.join(", ")}].` },
      });
      j++;
    }
  }

  while (i < listA.length) {
    merged.push(listA[i]);
    frames.push({
      listA, listB, ptrA: i, ptrB: -1, merged: [...merged],
      activeNode: "A", phase: "flush-A",
      step: { description: `B exhausted — flush remaining of A. Append A[${i}] = ${listA[i]}.`, detail: "" },
    });
    i++;
  }
  while (j < listB.length) {
    merged.push(listB[j]);
    frames.push({
      listA, listB, ptrA: -1, ptrB: j, merged: [...merged],
      activeNode: "B", phase: "flush-B",
      step: { description: `A exhausted — flush remaining of B. Append B[${j}] = ${listB[j]}.`, detail: "" },
    });
    j++;
  }

  frames.push({
    listA, listB, ptrA: -1, ptrB: -1, merged: [...merged],
    activeNode: null, phase: "done",
    step: { description: "Done.", detail: `merged = [${merged.join(", ")}]. O(n + m) total.` },
  });
  return frames;
}

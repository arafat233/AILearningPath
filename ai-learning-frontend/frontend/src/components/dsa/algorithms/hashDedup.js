/**
 * hashDedup — Dedup an array using a HashSet (preserve first-seen order).
 *
 * Used by M34-T3 (HashSet Applications — Dedup, Intersection, Sliding Window).
 *
 * Canonical pattern: HashSet for O(1) "have I seen this?" check. The
 * animation makes the "set grows monotonically" property visible —
 * once a value enters, it never leaves.
 *
 * Frame shape:
 *   {
 *     input: any[],
 *     currentIdx: number,
 *     setValues: any[],          // ordered by first-insertion for stable rendering
 *     output: any[],
 *     decision: 'kept'|'duplicate' | null,
 *     phase: 'init'|'check'|'kept'|'duplicate'|'done',
 *     step: { description, detail }
 *   }
 */

export const HASH_DEDUP_CODE = `// Dedup preserving first-seen order
List<Integer> dedup(int[] arr) {
  Set<Integer> seen = new HashSet<>();
  List<Integer> out = new ArrayList<>();
  for (int x : arr) {
    if (seen.add(x)) {     // .add() returns true iff x was NEW
      out.add(x);
    }
  }
  return out;
}`;

export const LINE_BY_PHASE = { init: 3, check: 6, kept: 7, duplicate: 6, done: 10 };

export function generateDedupSteps(input) {
  const seen = new Set();
  const setValues = [];
  const output = [];
  const frames = [];

  frames.push({
    input: [...input], currentIdx: -1,
    setValues: [...setValues], output: [...output],
    decision: null, phase: "init",
    step: {
      description: `Dedup ${input.length} values while preserving first-seen order.`,
      detail: "HashSet gives us O(1) membership test. .add() returns true only if the value wasn't present.",
    },
  });

  for (let i = 0; i < input.length; i++) {
    const v = input[i];
    const wasSeen = seen.has(v);
    frames.push({
      input: [...input], currentIdx: i,
      setValues: [...setValues], output: [...output],
      decision: null, phase: "check",
      step: {
        description: `Check arr[${i}] = ${JSON.stringify(v)}: in set?`,
        detail: wasSeen ? `Yes — duplicate, skip.` : `No — new value, add to set and output.`,
      },
    });
    if (!wasSeen) {
      seen.add(v);
      setValues.push(v);
      output.push(v);
      frames.push({
        input: [...input], currentIdx: i,
        setValues: [...setValues], output: [...output],
        decision: "kept", phase: "kept",
        step: {
          description: `Kept ${JSON.stringify(v)}. Set now has ${setValues.length} values.`,
          detail: `output = [${output.map((x) => JSON.stringify(x)).join(", ")}].`,
        },
      });
    } else {
      frames.push({
        input: [...input], currentIdx: i,
        setValues: [...setValues], output: [...output],
        decision: "duplicate", phase: "duplicate",
        step: {
          description: `Skipped ${JSON.stringify(v)} (duplicate of earlier index).`,
          detail: `output unchanged.`,
        },
      });
    }
  }

  frames.push({
    input: [...input], currentIdx: input.length,
    setValues: [...setValues], output: [...output],
    decision: null, phase: "done",
    step: {
      description: `Done — kept ${output.length} unique value${output.length === 1 ? "" : "s"} out of ${input.length}.`,
      detail: `O(n) total. Order in output matches first-occurrence order in input.`,
    },
  });
  return frames;
}

export const DEMO_DEDUP = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9];

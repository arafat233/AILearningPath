/**
 * customHash — composite-key hashing for 2D grid coordinates.
 *
 * Used by M34-T4 (Custom Hash Keys — Composite Keys, 2D Grid, Tuple Hashing).
 *
 * Demonstrates: how Java's `hash(31 * row + col) % capacity` distributes
 * 2D points across buckets. Visually contrasted against a naive
 * "use only row" hash that collides everything.
 *
 * Frame shape:
 *   {
 *     points: [{row, col, value}],
 *     pointIdx: number,                   // active insert
 *     hashMode: 'naive'|'composite',
 *     hashWork: string,
 *     buckets: ({row, col, value, state}[]|null)[],
 *     capacity: number,
 *     phase: 'init'|'insert'|'done',
 *     step: { description, detail }
 *   }
 */

export const CUSTOM_HASH_CODE = `// Hashing a composite key (row, col)
class Point { int row, col; }

int hash(Point p, int cap) {
  // Combine via Java's 31x recipe — different rows AND different cols
  // both move the bucket. Naive "row % cap" would put every cell in a
  // row into the same bucket.
  int h = 31 * p.row + p.col;
  return ((h % cap) + cap) % cap;
}`;

function hashOf(row, col, capacity, mode) {
  if (mode === "naive") {
    return ((row % capacity) + capacity) % capacity;
  }
  const h = 31 * row + col;
  return ((h % capacity) + capacity) % capacity;
}

export function generateCustomHashSteps(points, capacity, mode) {
  const buckets = Array.from({ length: capacity }, () => null);
  const frames = [];

  frames.push({
    points: [...points], pointIdx: -1, hashMode: mode,
    hashWork: null,
    buckets: buckets.map((c) => c ? c.map((e) => ({ ...e, state: "default" })) : null),
    capacity, phase: "init",
    step: {
      description: mode === "naive"
        ? `Naive hash: idx = row % ${capacity}. Every point in the same row collides.`
        : `Composite hash: idx = (31 * row + col) % ${capacity}.`,
      detail: "Insert each point; watch collision chains grow.",
    },
  });

  for (let i = 0; i < points.length; i++) {
    const { row, col, value } = points[i];
    const idx = hashOf(row, col, capacity, mode);
    const hashWork = mode === "naive"
      ? `hash(${row}, ${col}) = ${row} % ${capacity} = ${idx}`
      : `hash(${row}, ${col}) = (31 * ${row} + ${col}) % ${capacity} = ${31 * row + col} % ${capacity} = ${idx}`;
    const newEntry = { row, col, value, state: "new" };
    buckets[idx] = [newEntry, ...(buckets[idx] || [])];
    frames.push({
      points: [...points], pointIdx: i, hashMode: mode,
      hashWork,
      buckets: buckets.map((c, bi) => c ? c.map((e, ei) => ({ ...e, state: bi === idx && ei === 0 ? "new" : "default" })) : null),
      capacity, phase: "insert",
      step: {
        description: `Insert (${row}, ${col}) at bucket ${idx}.`,
        detail: buckets[idx].length > 1
          ? `Collision — bucket ${idx} already had ${buckets[idx].length - 1} entr${buckets[idx].length - 1 === 1 ? "y" : "ies"}.`
          : "Bucket was empty.",
      },
    });
  }

  const collisions = buckets.filter((c) => c && c.length > 1).length;
  frames.push({
    points: [...points], pointIdx: points.length, hashMode: mode,
    hashWork: null,
    buckets: buckets.map((c) => c ? c.map((e) => ({ ...e, state: "default" })) : null),
    capacity, phase: "done",
    step: {
      description: `Done — ${collisions} bucket${collisions === 1 ? "" : "s"} with collisions.`,
      detail: mode === "naive"
        ? "Naive hash clumps badly. Look how many entries share each row's bucket."
        : "Composite hash spreads better — different rows AND different cols both shift the bucket.",
    },
  });
  return frames;
}

// Default grid of points — 3x3 grid + a few extras to show spread.
export const DEMO_POINTS = [
  { row: 0, col: 0, value: "a" }, { row: 0, col: 1, value: "b" }, { row: 0, col: 2, value: "c" },
  { row: 1, col: 0, value: "d" }, { row: 1, col: 1, value: "e" }, { row: 1, col: 2, value: "f" },
  { row: 2, col: 0, value: "g" }, { row: 2, col: 1, value: "h" }, { row: 2, col: 2, value: "i" },
];

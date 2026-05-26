/**
 * hashTable — step generators for separate-chaining hash table.
 *
 * Operations:
 *   generateHashPutSteps(table, key, value)  — hash, walk chain, insert/update
 *   generateHashGetSteps(table, key)         — hash, walk chain, return value
 *
 * Why separate chaining (not open addressing): chaining is the variant
 * Java's HashMap uses (pre-tree-bucket optimization) and makes collisions
 * visually obvious — two entries in the same row. Open addressing
 * (linear probing) is a different topic for a later lesson.
 *
 * Frame shape:
 *   {
 *     buckets: ({key,value,state}[] | null)[],
 *     activeBucket: number | null,
 *     activeEntryIdx: number | null,
 *     hashWork: string | null,   // "hash('alice') = 1234567 % 8 = 7" — shown above table
 *     step: { description, detail }
 *   }
 */

export const HASH_PUT_CODE = `// HashMap.put with separate chaining
V put(K key, V value) {
  int idx = hash(key) % capacity;     // 1. hash to bucket
  Node n = buckets[idx];
  while (n != null) {                 // 2. walk chain
    if (n.key.equals(key)) {
      V old = n.value;
      n.value = value;                // 3a. update existing
      return old;
    }
    n = n.next;
  }
  buckets[idx] = new Node(key, value, buckets[idx]);  // 3b. prepend
  size++;
  return null;
}`;

export const HASH_GET_CODE = `// HashMap.get with separate chaining
V get(K key) {
  int idx = hash(key) % capacity;     // 1. hash to bucket
  Node n = buckets[idx];
  while (n != null) {                 // 2. walk chain
    if (n.key.equals(key)) return n.value;  // hit
    n = n.next;
  }
  return null;                        // miss
}`;

// Java-style String.hashCode() emulation: deterministic, simple, well-known.
export function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  }
  return h;
}

const cloneBuckets = (b) =>
  b.map((chain) => (chain ? chain.map((e) => ({ ...e, state: "default" })) : null));

const frame = (buckets, activeBucket, activeEntryIdx, hashWork, step) => ({
  buckets: cloneBuckets(buckets).map((chain, bi) => {
    if (!chain) return null;
    return chain.map((e, ei) => ({
      ...e,
      state: bi === activeBucket && ei === activeEntryIdx ? e.state : "default",
    }));
  }),
  activeBucket,
  activeEntryIdx,
  hashWork,
  step,
});

// Helper to mark an entry with a specific state on a snapshot.
function markEntry(buckets, bi, ei, state) {
  return buckets.map((chain, b) => {
    if (b !== bi || !chain) return chain ? chain.map((e) => ({ ...e, state: "default" })) : null;
    return chain.map((e, i) => ({ ...e, state: i === ei ? state : "default" }));
  });
}

export function generateHashPutSteps(table, key, value) {
  const capacity = table.capacity;
  const buckets  = table.buckets.map((c) => (c ? c.map((e) => ({ ...e })) : null));
  const frames = [];

  const h    = hashCode(key);
  const idx  = ((h % capacity) + capacity) % capacity;
  const hashWork = `hash("${key}") = ${h} → ${h} mod ${capacity} = ${idx}`;

  frames.push({
    buckets: cloneBuckets(buckets),
    activeBucket: idx,
    activeEntryIdx: null,
    hashWork,
    step: {
      description: `put("${key}", ${JSON.stringify(value)})`,
      detail: `Hash to bucket ${idx}. Walk chain to check for existing key.`,
    },
  });

  let chain = buckets[idx];
  if (chain) {
    // Walk chain looking for the key
    for (let i = 0; i < chain.length; i++) {
      frames.push({
        buckets: markEntry(buckets, idx, i, "compare"),
        activeBucket: idx,
        activeEntryIdx: i,
        hashWork,
        step: {
          description: `Compare with bucket[${idx}][${i}].key = "${chain[i].key}".`,
          detail: chain[i].key === key
            ? `Match — update value from ${JSON.stringify(chain[i].value)} to ${JSON.stringify(value)}.`
            : `Not equal (${chain[i].key} ≠ ${key}). Continue.`,
        },
      });
      if (chain[i].key === key) {
        chain[i].value = value;
        frames.push({
          buckets: markEntry(buckets, idx, i, "found"),
          activeBucket: idx,
          activeEntryIdx: i,
          hashWork,
          step: {
            description: `Updated bucket[${idx}][${i}].value = ${JSON.stringify(value)}.`,
            detail: "Size unchanged — this was an update, not an insert.",
          },
        });
        return frames;
      }
    }
  }

  // Insert at head of chain
  const newEntry = { key, value, state: "new" };
  buckets[idx] = [newEntry, ...(chain || [])];
  frames.push({
    buckets: markEntry(buckets, idx, 0, "new"),
    activeBucket: idx,
    activeEntryIdx: 0,
    hashWork,
    step: {
      description: `Insert new node at head of bucket[${idx}].`,
      detail: chain && chain.length > 0
        ? `Collision — bucket already had ${chain.length} entr${chain.length === 1 ? "y" : "ies"}. New entry chains in front.`
        : "Bucket was empty.",
    },
  });
  frames.push({
    buckets: cloneBuckets(buckets),
    activeBucket: idx,
    activeEntryIdx: null,
    hashWork,
    step: {
      description: `Done — bucket[${idx}] now has ${buckets[idx].length} entr${buckets[idx].length === 1 ? "y" : "ies"}.`,
      detail: `Size +1.`,
    },
  });
  return frames;
}

export function generateHashGetSteps(table, key) {
  const capacity = table.capacity;
  const buckets  = table.buckets.map((c) => (c ? c.map((e) => ({ ...e })) : null));
  const frames = [];

  const h    = hashCode(key);
  const idx  = ((h % capacity) + capacity) % capacity;
  const hashWork = `hash("${key}") = ${h} → ${h} mod ${capacity} = ${idx}`;

  frames.push({
    buckets: cloneBuckets(buckets),
    activeBucket: idx,
    activeEntryIdx: null,
    hashWork,
    step: {
      description: `get("${key}")`,
      detail: `Hash to bucket ${idx}. Walk chain.`,
    },
  });

  const chain = buckets[idx];
  if (!chain || chain.length === 0) {
    frames.push({
      buckets: cloneBuckets(buckets),
      activeBucket: idx,
      activeEntryIdx: null,
      hashWork,
      step: { description: `Bucket ${idx} is empty.`, detail: "Returns null." },
    });
    return frames;
  }

  for (let i = 0; i < chain.length; i++) {
    frames.push({
      buckets: markEntry(buckets, idx, i, "compare"),
      activeBucket: idx,
      activeEntryIdx: i,
      hashWork,
      step: {
        description: `Compare with bucket[${idx}][${i}].key = "${chain[i].key}".`,
        detail: chain[i].key === key
          ? `Match — return ${JSON.stringify(chain[i].value)}.`
          : `Not equal. Continue.`,
      },
    });
    if (chain[i].key === key) {
      frames.push({
        buckets: markEntry(buckets, idx, i, "found"),
        activeBucket: idx,
        activeEntryIdx: i,
        hashWork,
        step: {
          description: `Returns ${JSON.stringify(chain[i].value)}.`,
          detail: `Walked ${i + 1} link${i === 0 ? "" : "s"} in the chain.`,
        },
      });
      return frames;
    }
  }

  frames.push({
    buckets: cloneBuckets(buckets),
    activeBucket: idx,
    activeEntryIdx: null,
    hashWork,
    step: {
      description: `Walked entire chain (${chain.length} links) — no match.`,
      detail: "Returns null.",
    },
  });
  return frames;
}

// Seed a small table to start the demo with.
export function buildInitialTable(capacity = 8) {
  const buckets = Array.from({ length: capacity }, () => null);
  const seed = [
    ["alice", 25], ["bob", 30], ["carol", 28],
    ["dave", 35], ["eve", 22],
  ];
  for (const [k, v] of seed) {
    const h = hashCode(k);
    const idx = ((h % capacity) + capacity) % capacity;
    buckets[idx] = [{ key: k, value: v, state: "default" }, ...(buckets[idx] || [])];
  }
  return { capacity, buckets };
}

/**
 * lru — Least-Recently-Used cache step generator.
 *
 * Used by M34-T5 (Hash Table Synthesis — LRU, Random Set, SnapshotArray).
 *
 * Two structures kept in sync:
 *   - HashMap: key → node (O(1) lookup)
 *   - Doubly-linked list: head = most-recent, tail = least-recent
 *
 * Frame shape:
 *   {
 *     capacity: number,
 *     order: {key, value, state}[],       // head (most-recent) first
 *     mapKeys: (string|number)[],         // keys currently in map (for the hash view)
 *     activeKey: string|number|null,
 *     lastOp: string,
 *     evicted: {key, value} | null,
 *     hit: boolean | null,                // for get() ops
 *     phase: 'init'|'get-hit'|'get-miss'|'put-update'|'put-insert'|'evict'|'done',
 *     step: { description, detail }
 *   }
 */

export const LRU_CODE = `// LRU cache: HashMap + Doubly-Linked List
class LRUCache<K, V> {
  Map<K, Node<K, V>> map = new HashMap<>();
  Node<K, V> head, tail;   // sentinels
  int cap, size;

  V get(K key) {
    Node<K, V> n = map.get(key);
    if (n == null) return null;
    moveToHead(n);
    return n.value;
  }

  void put(K key, V value) {
    Node<K, V> n = map.get(key);
    if (n != null) { n.value = value; moveToHead(n); return; }
    n = new Node<>(key, value);
    map.put(key, n);
    addToHead(n);
    if (++size > cap) {
      Node<K, V> lru = tail.prev;
      removeNode(lru);
      map.remove(lru.key);
      size--;
    }
  }
}`;

export const LINE_BY_PHASE = { init: 5, "get-hit": 10, "get-miss": 9, "put-update": 16, "put-insert": 19, evict: 22, done: 27 };

export const DEMO_OPS = [
  { type: "put", key: 1, value: "A" },
  { type: "put", key: 2, value: "B" },
  { type: "put", key: 3, value: "C" },
  { type: "get", key: 1 },                // touches 1 → most-recent
  { type: "put", key: 4, value: "D" },    // capacity 3 → evicts 2 (LRU)
  { type: "get", key: 2 },                // miss
  { type: "put", key: 5, value: "E" },    // evicts 3
  { type: "get", key: 4 },                // hit, moves 4 to head
];

export function generateLRUSteps(capacity, ops) {
  let order = [];   // [{key, value}] head-first
  const frames = [];

  const snap = (activeKey, lastOp, evicted, hit, phase, step) => frames.push({
    capacity,
    order: order.map((e) => ({ ...e, state: e.key === activeKey ? "compare" : "default" })),
    mapKeys: order.map((e) => e.key),
    activeKey, lastOp, evicted, hit, phase, step,
  });

  snap(null, null, null, null, "init", {
    description: `LRU cache, capacity = ${capacity}.`,
    detail: "Head = most-recently-used. Eviction removes from tail.",
  });

  for (const op of ops) {
    if (op.type === "get") {
      const entry = order.find((e) => e.key === op.key);
      if (entry) {
        snap(op.key, `get(${op.key}) = ${JSON.stringify(entry.value)}`, null, true, "get-hit", {
          description: `get(${op.key}) HIT — value = ${JSON.stringify(entry.value)}.`,
          detail: "Move node to head (most recent).",
        });
        order = [entry, ...order.filter((e) => e.key !== op.key)];
        snap(op.key, `get(${op.key}) = ${JSON.stringify(entry.value)}`, null, true, "get-hit", {
          description: `${op.key} promoted to head.`,
          detail: `DLL: [${order.map((e) => `${e.key}:${JSON.stringify(e.value)}`).join(" ⇄ ")}].`,
        });
      } else {
        snap(null, `get(${op.key}) = null`, null, false, "get-miss", {
          description: `get(${op.key}) MISS — not in cache.`,
          detail: "Returns null. No change to order.",
        });
      }
    } else if (op.type === "put") {
      const existing = order.find((e) => e.key === op.key);
      if (existing) {
        existing.value = op.value;
        order = [existing, ...order.filter((e) => e.key !== op.key)];
        snap(op.key, `put(${op.key}, ${JSON.stringify(op.value)})`, null, null, "put-update", {
          description: `put(${op.key}, ${JSON.stringify(op.value)}) — key exists, update + move to head.`,
          detail: `DLL: [${order.map((e) => `${e.key}:${JSON.stringify(e.value)}`).join(" ⇄ ")}].`,
        });
      } else {
        const newEntry = { key: op.key, value: op.value };
        order = [newEntry, ...order];
        snap(op.key, `put(${op.key}, ${JSON.stringify(op.value)})`, null, null, "put-insert", {
          description: `put(${op.key}, ${JSON.stringify(op.value)}) — insert as new head.`,
          detail: `DLL: [${order.map((e) => `${e.key}:${JSON.stringify(e.value)}`).join(" ⇄ ")}].`,
        });
        if (order.length > capacity) {
          const lru = order[order.length - 1];
          order = order.slice(0, -1);
          snap(op.key, `evict ${lru.key}`, lru, null, "evict", {
            description: `Cache exceeds capacity — evict LRU (tail) = ${lru.key}.`,
            detail: `Remove from map AND DLL. New tail: ${order[order.length - 1].key}.`,
          });
        }
      }
    }
  }

  snap(null, null, null, null, "done", {
    description: "Done.",
    detail: `Final DLL: [${order.map((e) => `${e.key}:${JSON.stringify(e.value)}`).join(" ⇄ ")}].`,
  });
  return frames;
}

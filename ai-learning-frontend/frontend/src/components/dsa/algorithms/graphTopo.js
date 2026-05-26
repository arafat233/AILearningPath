/**
 * graphTopo — Kahn's topological sort step generator.
 *
 * Used by M37-T3 (Topological Sort — Kahn's BFS, DFS Post-Order, Course
 * Schedule).
 *
 * Algorithm:
 *   1. Compute in-degree for every node.
 *   2. Queue all 0-in-degree nodes.
 *   3. Dequeue, append to order, decrement in-degree of each successor.
 *      If a successor hits 0, enqueue it.
 *
 * Uses a directed graph (separate from the M37-T1 undirected DEFAULT_GRAPH).
 */

export const TOPO_CODE = `// Kahn's topological sort
List<String> topoSort(Map<String, List<String>> adj) {
  Map<String, Integer> inDeg = new HashMap<>();
  for (String u : adj.keySet()) inDeg.put(u, 0);
  for (var e : adj.entrySet()) for (String v : e.getValue()) inDeg.merge(v, 1, Integer::sum);
  Deque<String> q = new ArrayDeque<>();
  for (var e : inDeg.entrySet()) if (e.getValue() == 0) q.add(e.getKey());
  List<String> order = new ArrayList<>();
  while (!q.isEmpty()) {
    String u = q.poll();
    order.add(u);
    for (String v : adj.get(u)) {
      if (inDeg.merge(v, -1, Integer::sum) == 0) q.add(v);
    }
  }
  return order.size() == adj.size() ? order : List.of();  // cycle if mismatch
}`;

export const LINE_BY_PHASE = { init: 7, dequeue: 10, edge: 13, done: 16 };

// A small course-prerequisite-style DAG.
export const TOPO_GRAPH = {
  nodes: [
    { id: "CS101", x:  80, y:  60 },
    { id: "CS201", x: 280, y:  60 },
    { id: "MA101", x:  80, y: 200 },
    { id: "MA201", x: 280, y: 200 },
    { id: "CS301", x: 480, y:  60 },
    { id: "DSA",   x: 480, y: 200 },
    { id: "ML",    x: 660, y: 130 },
  ],
  // directed edges: [from, to]
  edges: [
    ["CS101", "CS201"],
    ["CS101", "DSA"],
    ["MA101", "MA201"],
    ["MA101", "DSA"],
    ["CS201", "CS301"],
    ["MA201", "DSA"],
    ["CS301", "ML"],
    ["DSA",   "ML"],
  ],
};

function adjMap(graph) {
  const adj = {};
  for (const n of graph.nodes) adj[n.id] = [];
  for (const [u, v] of graph.edges) adj[u].push(v);
  return adj;
}

function initialEdgeStates(graph) {
  const e = {};
  for (const [u, v] of graph.edges) e[`${u}->${v}`] = "default";
  return e;
}

function initialNodeStates(graph) {
  const n = {};
  for (const node of graph.nodes) n[node.id] = "default";
  return n;
}

export function generateTopoSteps(graph) {
  const adj = adjMap(graph);
  const inDeg = {};
  for (const n of graph.nodes) inDeg[n.id] = 0;
  for (const [, v] of graph.edges) inDeg[v]++;

  const ns = initialNodeStates(graph);
  const es = initialEdgeStates(graph);
  const frames = [];

  const queue = Object.keys(inDeg).filter((k) => inDeg[k] === 0);
  for (const id of queue) ns[id] = "queued";

  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    nodeLabels: { ...inDeg },        // displayed below node name
    queue: [...queue],
    order: [],
    phase: "init",
    step: {
      description: "Compute in-degree of every node.",
      detail: `0-in-degree nodes (no prerequisites): [${queue.join(", ")}]. Enqueue all.`,
    },
  });

  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    ns[u] = "visiting";
    order.push(u);
    frames.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      nodeLabels: { ...inDeg },
      queue: [...queue],
      order: [...order],
      phase: "dequeue",
      step: {
        description: `Dequeue ${u}, add to topological order.`,
        detail: `For each outgoing edge ${u}→v, decrement inDeg[v].`,
      },
    });

    for (const v of adj[u]) {
      inDeg[v]--;
      es[`${u}->${v}`] = "tree";
      frames.push({
        nodeStates: { ...ns },
        edgeStates: { ...es },
        nodeLabels: { ...inDeg },
        queue: [...queue],
        order: [...order],
        phase: "edge",
        step: {
          description: `Edge ${u} → ${v}: inDeg[${v}] now ${inDeg[v]}.`,
          detail: inDeg[v] === 0 ? `inDeg[${v}] hit 0 — enqueue ${v}.` : "Still has prerequisites.",
        },
      });
      if (inDeg[v] === 0) {
        queue.push(v);
        ns[v] = "queued";
      }
    }

    ns[u] = "visited";
  }

  const cycle = order.length !== graph.nodes.length;
  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    nodeLabels: { ...inDeg },
    queue: [],
    order: [...order],
    phase: "done",
    step: {
      description: cycle ? "Cycle detected!" : "Topological sort complete.",
      detail: cycle
        ? `Only ${order.length} of ${graph.nodes.length} nodes ordered — graph has a cycle.`
        : `Order: ${order.join(" → ")}.`,
    },
  });

  return frames;
}

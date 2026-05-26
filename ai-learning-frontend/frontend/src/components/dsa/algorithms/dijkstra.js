/**
 * dijkstra — single-source shortest paths step generator.
 *
 * Used by M37-T4 (Shortest Path — Dijkstra, Bellman-Ford, Floyd-Warshall).
 * Standard greedy: pick the unvisited node with min tentative distance,
 * relax its outgoing edges.
 *
 * Uses a small weighted directed graph distinct from the M37-T1 + topo
 * graphs so the three look different at a glance.
 */

export const DIJKSTRA_CODE = `// Dijkstra (single-source shortest path)
Map<String, Integer> dijkstra(
    Map<String, List<Edge>> adj, String src) {
  Map<String, Integer> dist = new HashMap<>();
  for (String u : adj.keySet()) dist.put(u, Integer.MAX_VALUE);
  dist.put(src, 0);
  PriorityQueue<Pair> pq = new PriorityQueue<>(Comparator.comparingInt(p -> p.dist));
  pq.add(new Pair(src, 0));
  Set<String> visited = new HashSet<>();
  while (!pq.isEmpty()) {
    Pair p = pq.poll();
    if (!visited.add(p.node)) continue;
    for (Edge e : adj.get(p.node)) {
      int nd = p.dist + e.weight;
      if (nd < dist.get(e.to)) {
        dist.put(e.to, nd);
        pq.add(new Pair(e.to, nd));
      }
    }
  }
  return dist;
}`;

export const LINE_BY_PHASE = { init: 6, pop: 11, relax: 16, reject: 15, done: 21 };

export const DIJKSTRA_GRAPH = {
  nodes: [
    { id: "A", x:  80, y:  60 },
    { id: "B", x: 280, y:  60 },
    { id: "C", x: 480, y:  60 },
    { id: "D", x: 180, y: 200 },
    { id: "E", x: 380, y: 200 },
    { id: "F", x: 580, y: 200 },
    { id: "G", x: 380, y: 320 },
  ],
  // directed weighted edges: [from, to, weight]
  edges: [
    ["A", "B", 4],
    ["A", "D", 2],
    ["B", "C", 3],
    ["B", "E", 5],
    ["D", "E", 1],
    ["D", "B", 1],
    ["C", "F", 2],
    ["E", "C", 1],
    ["E", "F", 6],
    ["E", "G", 4],
    ["F", "G", 2],
  ],
};

function adjMap(graph) {
  const adj = {};
  for (const n of graph.nodes) adj[n.id] = [];
  for (const [u, v, w] of graph.edges) adj[u].push({ to: v, weight: w });
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

const INF = "∞";

function distLabels(dist) {
  const out = {};
  for (const k of Object.keys(dist)) out[k] = dist[k] === Infinity ? INF : String(dist[k]);
  return out;
}

export function generateDijkstraSteps(graph, src) {
  const adj = adjMap(graph);
  const dist = {};
  for (const n of graph.nodes) dist[n.id] = Infinity;
  dist[src] = 0;
  const visited = new Set();
  const ns = initialNodeStates(graph);
  const es = initialEdgeStates(graph);
  const frames = [];

  ns[src] = "queued";
  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    nodeLabels: distLabels(dist),
    pqSnapshot: [`${src}(0)`],
    visited: [],
    phase: "init",
    step: {
      description: `Dijkstra from ${src}. All distances start at ∞ except dist[${src}] = 0.`,
      detail: "Repeat: pop the unvisited node with smallest tentative distance, relax its outgoing edges.",
    },
  });

  while (true) {
    // Pick unvisited node with smallest dist
    let u = null, best = Infinity;
    for (const id of Object.keys(dist)) {
      if (visited.has(id)) continue;
      if (dist[id] < best) { best = dist[id]; u = id; }
    }
    if (u == null || best === Infinity) break;

    visited.add(u);
    ns[u] = "visiting";
    frames.push({
      nodeStates: { ...ns },
      edgeStates: { ...es },
      nodeLabels: distLabels(dist),
      pqSnapshot: pqFrom(dist, visited),
      visited: [...visited],
      phase: "pop",
      step: {
        description: `Pop ${u} (dist = ${dist[u]}) — smallest unvisited.`,
        detail: `Relax outgoing edges from ${u}.`,
      },
    });

    for (const { to, weight } of adj[u]) {
      const nd = dist[u] + weight;
      const ek = `${u}->${to}`;
      if (nd < dist[to]) {
        const oldDist = dist[to];
        dist[to] = nd;
        es[ek] = "tree";
        if (!visited.has(to)) ns[to] = "queued";
        frames.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          nodeLabels: distLabels(dist),
          pqSnapshot: pqFrom(dist, visited),
          visited: [...visited],
          phase: "relax",
          step: {
            description: `Edge ${u}→${to} (weight ${weight}): new tentative = ${nd}.`,
            detail: oldDist === Infinity
              ? `${nd} < ∞ → update dist[${to}] = ${nd}.`
              : `${nd} < ${oldDist} → improve dist[${to}] from ${oldDist} to ${nd}.`,
          },
        });
      } else {
        const prev = es[ek];
        es[ek] = "rejected";
        frames.push({
          nodeStates: { ...ns },
          edgeStates: { ...es },
          nodeLabels: distLabels(dist),
          pqSnapshot: pqFrom(dist, visited),
          visited: [...visited],
          phase: "reject",
          step: {
            description: `Edge ${u}→${to} (weight ${weight}): tentative = ${nd}.`,
            detail: `${nd} ≥ ${dist[to]} → no improvement.`,
          },
        });
        // Restore prior so a rejected edge doesn't stay red after future steps.
        es[ek] = prev === "tree" ? "tree" : "default";
      }
    }

    ns[u] = "visited";
  }

  frames.push({
    nodeStates: { ...ns },
    edgeStates: { ...es },
    nodeLabels: distLabels(dist),
    pqSnapshot: [],
    visited: [...visited],
    phase: "done",
    step: {
      description: "Done.",
      detail: `Final distances: ${Object.entries(dist).map(([k, v]) => `${k}=${v === Infinity ? "∞" : v}`).join(", ")}.`,
    },
  });

  return frames;
}

function pqFrom(dist, visited) {
  return Object.entries(dist)
    .filter(([id]) => !visited.has(id))
    .filter(([, v]) => v !== Infinity)
    .sort((a, b) => a[1] - b[1])
    .map(([id, v]) => `${id}(${v})`);
}

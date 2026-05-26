/**
 * GraphVisualizer — SVG renderer for fixed-layout graphs.
 *
 * Originally built for M37-T1 (undirected BFS/DFS). Extended for M37-T3
 * topological sort (directed + node labels showing in-degree) and M37-T4
 * Dijkstra (directed + edge weights + node distance labels).
 *
 * Props:
 *   graph         { nodes: [{id, x, y}], edges: [[u, v]] | [[u, v, weight]] }
 *   nodeStates    { id: 'default'|'queued'|'visiting'|'visited' }
 *   edgeStates    { 'u-v' or 'u->v': 'default'|'tree'|'rejected' }
 *   nodeLabels?   { id: string|number }     — small caption below node (in-deg / distance)
 *   directed?     boolean                    — draw arrowheads, use 'u->v' edge keys
 *   width? / height?
 */
import { motion } from "framer-motion";
import { edgeKey as undirectedEdgeKey } from "./algorithms/graph.js";

const NODE_COLOR = {
  default:  { fill: "#1a1a1a",   stroke: "#2a2a2a", text: "#ccc"    },
  queued:   { fill: "#3b82f618", stroke: "#3b82f6", text: "#60a5fa" },
  visiting: { fill: "#f59e0b18", stroke: "#f59e0b", text: "#fbbf24" },
  visited:  { fill: "#00c89618", stroke: "#00c896", text: "#00c896" },
};

const EDGE_COLOR = {
  default:  { stroke: "#2a2a2a", width: 1.5, dash: "" },
  tree:     { stroke: "#00c896", width: 2.5, dash: "" },
  rejected: { stroke: "#ef4444", width: 1.5, dash: "4 3" },
};

const NODE_RADIUS = 22;

export default function GraphVisualizer({
  graph,
  nodeStates = {},
  edgeStates = {},
  nodeLabels = null,
  directed = false,
  width = 720,
  height = 380,
}) {
  const posOf = Object.fromEntries(graph.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));

  // For directed graphs, shorten the line so the arrowhead lands on the
  // node border, not the centre.
  const shortenedEnd = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return { x: b.x, y: b.y };
    const t = (len - NODE_RADIUS - 4) / len;
    return { x: a.x + dx * t, y: a.y + dy * t };
  };

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker id="arrow-default"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2a2a2a" />
          </marker>
          <marker id="arrow-tree"     viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#00c896" />
          </marker>
          <marker id="arrow-rejected" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Edges first so nodes draw on top */}
        {graph.edges.map((e, i) => {
          const [u, v, w] = e;
          const a = posOf[u]; const b = posOf[v];
          if (!a || !b) return null;
          const ek = directed ? `${u}->${v}` : undirectedEdgeKey(u, v);
          const st = edgeStates[ek] || "default";
          const c  = EDGE_COLOR[st] || EDGE_COLOR.default;
          const end = directed ? shortenedEnd(a, b) : b;
          const mid = { x: (a.x + end.x) / 2, y: (a.y + end.y) / 2 };
          return (
            <g key={`e-${i}`}>
              <line
                x1={a.x} y1={a.y} x2={end.x} y2={end.y}
                stroke={c.stroke}
                strokeWidth={c.width}
                strokeDasharray={c.dash}
                markerEnd={directed ? `url(#arrow-${st})` : undefined}
              />
              {w != null && (
                <g>
                  <rect x={mid.x - 12} y={mid.y - 9} width={24} height={16} rx={3} fill="#0f0f0f" stroke={c.stroke} strokeWidth={1} />
                  <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#d4d4d4">{w}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((n, i) => {
          const st = nodeStates[n.id] || "default";
          const c  = NODE_COLOR[st] || NODE_COLOR.default;
          return (
            <motion.g
              key={`n-${n.id}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            >
              <circle cx={n.x} cy={n.y} r={NODE_RADIUS} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              <text
                x={n.x} y={n.y + 5}
                textAnchor="middle"
                fill={c.text}
                fontSize={13}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {n.id}
              </text>
              {nodeLabels && nodeLabels[n.id] != null && (
                <text
                  x={n.x} y={n.y + NODE_RADIUS + 14}
                  textAnchor="middle"
                  fill="#60a5fa"
                  fontSize={11}
                  fontFamily="monospace"
                >
                  {nodeLabels[n.id]}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * UnionFindVisualizer — forest renderer for Disjoint Set Union state.
 *
 * Built for M37-T5. Walks the parent array to find roots, builds a child
 * map, lays each root's subtree out with a simple recursive position
 * function, and packs all root trees into a single SVG.
 *
 * Props:
 *   { parent: number[], rank: number[],
 *     activeNodes?: number[], pathToRoot?: number[],
 *     width?: number, height?: number }
 */
import { motion } from "framer-motion";

const NODE_R = 18;
const LAYER_GAP = 60;

const NODE_COLOR = {
  default: { fill: "#1a1a1a",   stroke: "#2a2a2a", text: "#ccc"    },
  active:  { fill: "#f59e0b18", stroke: "#f59e0b", text: "#fbbf24" },
  root:    { fill: "#00c89618", stroke: "#00c896", text: "#00c896" },
  pathRoot: { fill: "#3b82f618", stroke: "#3b82f6", text: "#60a5fa" },
};

// Walks the parent array → returns { roots: number[], children: Record<number, number[]> }.
function buildForest(parent) {
  const children = {};
  for (let i = 0; i < parent.length; i++) children[i] = [];
  const roots = [];
  for (let i = 0; i < parent.length; i++) {
    if (parent[i] === i) roots.push(i);
    else                 children[parent[i]].push(i);
  }
  // sort children for deterministic layout
  for (const k of Object.keys(children)) children[k].sort((a, b) => a - b);
  return { roots, children };
}

// Count leaves under a node (for proportional width).
function leafCount(node, children) {
  const c = children[node];
  if (!c || c.length === 0) return 1;
  return c.reduce((sum, child) => sum + leafCount(child, children), 0);
}

function layoutTree(root, children, leftLeaves, slotWidth) {
  const positioned = [];
  function place(node, depth, lefts) {
    const c = children[node] || [];
    const selfLeaves = c.length === 0 ? 1 : c.reduce((s, ch) => s + leafCount(ch, children), 0);
    const x = (lefts + selfLeaves / 2) * slotWidth;
    const y = 36 + depth * LAYER_GAP;
    positioned.push({ id: node, x, y, depth });
    let acc = lefts;
    for (const ch of c) {
      place(ch, depth + 1, acc);
      acc += leafCount(ch, children);
    }
  }
  place(root, 0, leftLeaves);
  return positioned;
}

export default function UnionFindVisualizer({
  parent = [],
  rank = [],
  activeNodes = [],
  pathToRoot = [],
  width = 720,
  height = 320,
}) {
  if (parent.length === 0) {
    return <div className="w-full h-32 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl text-[#444] text-sm">No nodes</div>;
  }
  const { roots, children } = buildForest(parent);
  const totalLeaves = roots.reduce((sum, r) => sum + leafCount(r, children), 0);
  const slot = width / Math.max(totalLeaves, 1);

  const activeSet = new Set(activeNodes);
  const pathSet   = new Set(pathToRoot);

  let positioned = [];
  let leftLeaves = 0;
  for (const r of roots) {
    positioned = positioned.concat(layoutTree(r, children, leftLeaves, slot));
    leftLeaves += leafCount(r, children);
  }
  const byId = Object.fromEntries(positioned.map((p) => [p.id, p]));

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Edges */}
        {positioned.flatMap(({ id }) => {
          const childPositions = (children[id] || []).map((c) => byId[c]).filter(Boolean);
          return childPositions.map((c, k) => (
            <line
              key={`e-${id}-${k}`}
              x1={byId[id].x} y1={byId[id].y}
              x2={c.x} y2={c.y}
              stroke={pathSet.has(c.id) ? "#3b82f6" : "#2a2a2a"}
              strokeWidth={pathSet.has(c.id) ? 2 : 1.5}
            />
          ));
        })}

        {/* Nodes */}
        {positioned.map(({ id, x, y, depth }, i) => {
          const isRoot   = parent[id] === id;
          const inPath   = pathSet.has(id);
          const isActive = activeSet.has(id) && !inPath;
          const colorKey = inPath ? "pathRoot" : isActive ? "active" : isRoot ? "root" : "default";
          const c = NODE_COLOR[colorKey];
          return (
            <motion.g
              key={id}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={NODE_R} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              <text x={x} y={y + 5} textAnchor="middle" fill={c.text} fontSize={12} fontWeight="bold" fontFamily="monospace">{id}</text>
              {isRoot && rank[id] != null && (
                <text x={x} y={y - NODE_R - 4} textAnchor="middle" fill="#00c896" fontSize={10} fontFamily="monospace">r={rank[id]}</text>
              )}
            </motion.g>
          );
        })}
      </svg>
      <div className="px-4 py-2 border-t border-zinc-800 flex gap-4 text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-[#00c896] inline-block" /> root (parent[i]=i)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-[#3b82f6] inline-block" /> find path</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-amber-500 inline-block" /> active in op</span>
        <span className="text-emerald-400 ml-2">r=N above root shows rank</span>
      </div>
    </div>
  );
}

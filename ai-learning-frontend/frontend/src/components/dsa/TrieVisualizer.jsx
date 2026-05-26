/**
 * TrieVisualizer — SVG renderer for a prefix tree (N-ary children per
 * node, single character on each edge into a node).
 *
 * Built for M35-T5 (Trie). TreeVisualizer can't handle N-ary children
 * or per-edge labels, so this is a sibling primitive.
 *
 * Node shape:
 *   { id, label, isWord, children: { [char]: node }, state }
 *
 * Layout: depth = depth in tree; horizontal position = leaf order.
 */
import { motion } from "framer-motion";

const NODE_COLOR = {
  default:   { fill: "#1a1a1a",   stroke: "#2a2a2a", text: "#ccc"    },
  active:    { fill: "#f59e0b18", stroke: "#f59e0b", text: "#fbbf24" },
  new:       { fill: "#00c89618", stroke: "#00c896", text: "#00c896" },
  found:     { fill: "#00c89618", stroke: "#00c896", text: "#00c896" },
  "not-found": { fill: "#ef444418", stroke: "#ef4444", text: "#f87171" },
};

const NODE_R = 18;
const LAYER_GAP = 64;

// Walk the trie to compute (x, y) for every node. We do a leaf-first pass
// to count leaves under each subtree, then distribute horizontal width
// proportionally. This avoids collisions even on lopsided tries.
function layout(root, width) {
  const positioned = [];

  function leafCount(n) {
    const childKeys = Object.keys(n.children);
    if (childKeys.length === 0) return 1;
    let c = 0;
    for (const k of childKeys) c += leafCount(n.children[k]);
    return c;
  }
  const total = leafCount(root);
  const slot  = width / Math.max(total, 1);

  function place(n, depth, leftLeaves) {
    const childKeys = Object.keys(n.children).sort();
    const childLeafCounts = childKeys.map((k) => leafCount(n.children[k]));
    const selfLeaves = childKeys.length === 0 ? 1 : childLeafCounts.reduce((a, b) => a + b, 0);
    const x = (leftLeaves + selfLeaves / 2) * slot;
    const y = 40 + depth * LAYER_GAP;
    positioned.push({ node: n, x, y, depth });

    let acc = leftLeaves;
    for (let k = 0; k < childKeys.length; k++) {
      place(n.children[childKeys[k]], depth + 1, acc);
      acc += childLeafCounts[k];
    }
  }
  place(root, 0, 0);
  return positioned;
}

export default function TrieVisualizer({ root, width = 720, height = 320 }) {
  if (!root) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
        <span className="text-[#444] text-sm">Empty trie</span>
      </div>
    );
  }
  const positioned = layout(root, width);
  const byId = Object.fromEntries(positioned.map((p) => [p.node.id, p]));

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Edges with character labels */}
        {positioned.flatMap(({ node }) => {
          return Object.keys(node.children).map((ch) => {
            const child = node.children[ch];
            const parent = byId[node.id];
            const c      = byId[child.id];
            if (!c) return null;
            const mx = (parent.x + c.x) / 2;
            const my = (parent.y + c.y) / 2;
            return (
              <g key={`${node.id}-${child.id}`}>
                <line x1={parent.x} y1={parent.y} x2={c.x} y2={c.y} stroke="#2a2a2a" strokeWidth={1.5} />
                <rect x={mx - 9} y={my - 9} width={18} height={16} rx={3} fill="#0f0f0f" stroke="#2a2a2a" />
                <text x={mx} y={my + 4} textAnchor="middle" fill="#fbbf24" fontSize={11} fontFamily="monospace" fontWeight="bold">{ch}</text>
              </g>
            );
          });
        })}

        {/* Nodes */}
        {positioned.map(({ node, x, y }, i) => {
          const c = NODE_COLOR[node.state] || NODE_COLOR.default;
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={NODE_R} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              {node.isWord && (
                <circle cx={x} cy={y} r={NODE_R + 4} fill="none" stroke="#00c896" strokeWidth={1.5} strokeDasharray="3 2" />
              )}
              <text x={x} y={y + 4} textAnchor="middle" fill={c.text} fontSize={11} fontFamily="monospace">
                {node.label === "·" ? "·" : ""}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <div className="px-4 py-2 border-t border-zinc-800 flex gap-4 text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-zinc-700 inline-block" /> node</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-[#00c896] border-dashed inline-block" /> word end</span>
        <span className="text-amber-400 ml-2">edge label = character</span>
      </div>
    </div>
  );
}

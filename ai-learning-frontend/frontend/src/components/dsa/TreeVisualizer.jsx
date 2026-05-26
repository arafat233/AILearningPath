/**
 * TreeVisualizer — SVG tree layout for BST + binary tree operations.
 *
 * Ported from dsalearn/components/visualizers/TreeVisualizer.tsx:
 *   - Dropped `'use client'`
 *   - Stripped TS `TreeNode` / `PositionedNode` / `Props` interfaces
 *   - Renamed `.tsx` → `.jsx`
 *
 * The layout walks the tree recursively, halving the horizontal gap at each
 * depth. After positioning, x-coords are normalised to fit the viewBox so
 * deeply unbalanced trees still render inside the panel.
 *
 * @typedef {object} TreeNode
 * @property {number} value
 * @property {TreeNode=} left
 * @property {TreeNode=} right
 * @property {('default'|'active'|'found'|'new'|'compare')=} state
 */
import { motion } from "framer-motion";

function positionNodes(node, x, y, gap, depth, result, parentX, parentY) {
  if (!node) return;
  result.push({ node, x, y, parentX, parentY });
  const childGap = gap / 2;
  const childY = y + 70;
  if (node.left)  positionNodes(node.left,  x - gap, childY, childGap, depth + 1, result, x, y);
  if (node.right) positionNodes(node.right, x + gap, childY, childGap, depth + 1, result, x, y);
}

const NODE_COLOR = {
  default: { fill: "#1a1a1a",   stroke: "#2a2a2a", text: "#ccc"    },
  active:  { fill: "#f59e0b18", stroke: "#f59e0b", text: "#fbbf24" },
  found:   { fill: "#00c89618", stroke: "#00c896", text: "#00c896" },
  new:     { fill: "#00c89618", stroke: "#00c896", text: "#00c896" },
  compare: { fill: "#3b82f618", stroke: "#3b82f6", text: "#60a5fa" },
};

/**
 * @param {{ root?: TreeNode, width?: number, height?: number }} props
 */
export default function TreeVisualizer({ root, width = 560, height = 320 }) {
  if (!root) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
        <span className="text-[#444] text-sm">Empty tree</span>
      </div>
    );
  }

  const positioned = [];
  positionNodes(root, width / 2, 48, width / 4, 0, positioned);

  const minX = Math.min(...positioned.map((p) => p.x));
  const maxX = Math.max(...positioned.map((p) => p.x));
  const padding = 40;
  const scale = (width - padding * 2) / Math.max(maxX - minX, 1);
  const normalize = (x) => (x - minX) * scale + padding;

  return (
    <div className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Edges first so nodes draw on top */}
        {positioned
          .filter((p) => p.parentX !== undefined)
          .map((p, i) => (
            <motion.line
              key={`edge-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x1={normalize(p.parentX)}
              y1={p.parentY}
              x2={normalize(p.x)}
              y2={p.y}
              stroke="#2a2a2a"
              strokeWidth={1.5}
            />
          ))}

        {/* Nodes */}
        {positioned.map((p, i) => {
          const state = p.node.state ?? "default";
          const c = NODE_COLOR[state] || NODE_COLOR.default;
          const nx = normalize(p.x);

          return (
            <motion.g
              key={`node-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              style={{ transformOrigin: `${nx}px ${p.y}px` }}
            >
              <circle cx={nx} cy={p.y} r={22} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              <text
                x={nx}
                y={p.y + 5}
                textAnchor="middle"
                fill={c.text}
                fontSize={13}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {p.node.value}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

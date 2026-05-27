/**
 * DoublyLinkedListVisualizer — horizontal DLL with prev and next arrows.
 *
 * Built for D2. Adapted from LinkedListVisualizer to render BOTH
 * directions of pointer between every pair of adjacent nodes.
 *
 * Props:
 *   { nodes: [{id, value, state, prev, next}] }
 *
 * Each node renders as [prev | data | next] with arrows between nodes
 * going both ways. The first node's prev = null shows as ⊥; same for
 * the last node's next.
 */
import { motion, AnimatePresence } from "framer-motion";

const NODE_STYLE = {
  default: { border: "#2a2a2a", text: "#ccc",    bg: "#1a1a1a"    },
  active:  { border: "#f59e0b", text: "#fbbf24", bg: "#f59e0b18" },
  new:     { border: "#00c896", text: "#00c896", bg: "#00c89618" },
  delete:  { border: "#ef4444", text: "#f87171", bg: "#ef444418" },
};

export default function DoublyLinkedListVisualizer({ nodes = [] }) {
  return (
    <div className="w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max mx-auto w-fit">
        <div className="flex flex-col items-center mr-2">
          <span className="text-[10px] text-blue-400 font-bold font-mono">head</span>
          <span className="text-blue-400 text-xs">↓</span>
        </div>

        <AnimatePresence mode="popLayout">
          {nodes.map((node, i) => {
            const style = NODE_STYLE[node.state] || NODE_STYLE.default;
            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center"
              >
                {/* DLL node: [prev | data | next] */}
                <div
                  className="flex rounded-lg overflow-hidden border-2 h-14"
                  style={{ borderColor: style.border, background: style.bg }}
                >
                  <div className="w-8 flex items-center justify-center text-[10px]" style={{ color: "#555" }}>
                    {node.prev == null ? "⊥" : "•"}
                  </div>
                  <div
                    className="w-12 flex items-center justify-center font-bold font-mono text-base border-x"
                    style={{ color: style.text, borderColor: style.border }}
                  >
                    {node.value}
                  </div>
                  <div className="w-8 flex items-center justify-center text-[10px]" style={{ color: "#555" }}>
                    {node.next == null ? "⊥" : "•"}
                  </div>
                </div>

                {/* Bidirectional arrows to next node */}
                {i < nodes.length - 1 && (
                  <div className="flex flex-col items-center mx-1 gap-0.5">
                    <div className="flex items-center">
                      <div className="w-6 h-px bg-[#444]" />
                      <span className="text-[#444] text-[11px]">▶</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#444] text-[11px]">◀</span>
                      <div className="w-6 h-px bg-[#444]" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="flex flex-col items-center ml-2">
          <span className="text-[10px] text-purple-400 font-bold font-mono">tail</span>
          <span className="text-purple-400 text-xs">↓</span>
        </div>
      </div>
      <div className="mt-3 text-[10px] text-zinc-600 font-mono">
        each node = [prev | data | next] · ⊥ = null pointer · ▶/◀ = .next/.prev arrows
      </div>
    </div>
  );
}

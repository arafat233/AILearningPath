/**
 * VariablePanel — table of variable name → value with state per row.
 *
 * Built for D1.4 (log2base2 parity — show execution state per frame).
 * Used alongside HighlightedCode so the learner sees code + state.
 *
 * Each variable: { name, value, state?, type?, changed?: boolean }
 * - state: 'default' | 'active' | 'just-set' | 'reference'
 * - type: 'int' | 'String' | 'Object' | etc. (display-only)
 * - changed: brief flash when the value updates
 */
import { motion, AnimatePresence } from "framer-motion";

const STATE_STYLE = {
  default:   "bg-[#1a1a1a] border-[#2a2a2a] text-[#d4d4d4]",
  active:    "bg-amber-500/15 border-amber-500 text-amber-200",
  "just-set": "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
  reference: "bg-purple-500/15 border-purple-500 text-purple-200",
};

export default function VariablePanel({ vars = [], title = "variables", emptyText = "no variables" }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-3">
      <div className="text-[10px] uppercase tracking-widest text-[#555] font-mono mb-1.5">{title}</div>
      {vars.length === 0 ? (
        <div className="text-[12px] text-zinc-600 italic px-1">{emptyText}</div>
      ) : (
        <div className="space-y-1">
          <AnimatePresence>
            {vars.map((v) => (
              <motion.div
                key={v.name}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2 px-2 py-1 rounded border text-[12px] font-mono ${STATE_STYLE[v.state] || STATE_STYLE.default}`}
              >
                {v.type && <span className="text-[10px] text-zinc-500 shrink-0">{v.type}</span>}
                <span className="font-bold">{v.name}</span>
                <span className="text-zinc-500">=</span>
                <span className="flex-1 truncate">{formatValue(v.value)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function formatValue(v) {
  if (v == null) return "null";
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

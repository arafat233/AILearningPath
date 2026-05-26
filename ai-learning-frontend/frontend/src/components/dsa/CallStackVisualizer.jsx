/**
 * CallStackVisualizer — vertical stack of recursion frames.
 *
 * Built for D1.2 (log2base2 parity — recursion call-stack visualization).
 *
 * Each frame is rendered as a card with:
 *   - function signature (e.g., "factorial(3)")
 *   - locals: { name → value }
 *   - status badge: active | waiting | returning
 *   - return value (when status is 'returning')
 *
 * Top of stack = top of the visual stack (newest frame). Frames slide
 * in from the right when pushed, fade up-and-out when popped.
 *
 * Props:
 *   { frames: [{call, locals, status, returnValue?}], maxFrames?: number }
 */
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLE = {
  active:    { border: "border-amber-500",   bg: "bg-amber-500/10",  badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  waiting:   { border: "border-zinc-700",    bg: "bg-zinc-900",      badge: "bg-zinc-800 text-zinc-400 border-zinc-700" },
  returning: { border: "border-[#00c896]",   bg: "bg-[#00c896]/10",  badge: "bg-[#00c896]/20 text-[#00c896] border-[#00c896]/40" },
};

const STATUS_LABEL = {
  active: "executing",
  waiting: "waiting for callee",
  returning: "returning",
};

export default function CallStackVisualizer({ frames = [], maxFrames = 8 }) {
  // Render top frame first; reverse the array so the newest is visually on top.
  const display = [...frames].slice(-maxFrames).reverse();

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-[#555] font-mono">call stack ({frames.length} frame{frames.length === 1 ? "" : "s"})</span>
        <span className="text-[10px] text-zinc-600 font-mono">top ↑</span>
      </div>
      <div className="flex flex-col gap-1.5 min-h-[80px]">
        <AnimatePresence mode="popLayout">
          {display.length === 0 ? (
            <div className="text-[#444] italic text-[12px] text-center py-4">empty stack</div>
          ) : display.map((f, i) => {
            const st = STATUS_STYLE[f.status] || STATUS_STYLE.waiting;
            const isTop = i === 0;
            return (
              <motion.div
                key={f.id || `${f.call}-${frames.length - i}`}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.22 }}
                className={`border-2 rounded-lg px-3 py-2 ${st.border} ${st.bg} ${isTop ? "shadow-lg shadow-amber-500/10" : "opacity-80"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[13px] font-bold text-zinc-100">{f.call}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${st.badge}`}>{STATUS_LABEL[f.status] || f.status}</span>
                </div>
                {f.locals && Object.keys(f.locals).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Object.entries(f.locals).map(([k, v]) => (
                      <span key={k} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        <span className="text-zinc-500">{k}=</span><span>{formatValue(v)}</span>
                      </span>
                    ))}
                  </div>
                )}
                {f.status === "returning" && f.returnValue !== undefined && (
                  <div className="mt-1.5 text-[11px] font-mono text-[#00c896]">
                    <span className="text-zinc-500">return </span>{formatValue(f.returnValue)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="text-[10px] text-zinc-700 font-mono text-center mt-2">↓ bottom (base case will fire here when reached)</div>
    </div>
  );
}

function formatValue(v) {
  if (v == null) return "null";
  if (typeof v === "string") return `"${v}"`;
  if (Array.isArray(v)) return `[${v.join(",")}]`;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

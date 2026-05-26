/**
 * HighlightedCode — read-only code block with active-line highlight.
 *
 * Built for D1.3 (log2base2 parity — propagate per-frame line highlight
 * to every visualizer). Lightweight alternative to Monaco: lines are
 * just <div>s with conditional background. No syntax highlighting (the
 * 14 sandboxes already render syntax-free code), just line presence.
 *
 * Props:
 *   { code: string, activeLine?: number (1-indexed), title?: string, height?: string }
 *
 * Active line: 1-indexed. Pass -1 / null / undefined for no highlight.
 */
import { useEffect, useRef } from "react";

export default function HighlightedCode({ code = "", activeLine = -1, title = null, height = "340px" }) {
  const ref = useRef(null);

  // Scroll active line into view if it goes off-screen.
  useEffect(() => {
    if (!ref.current || !activeLine || activeLine < 1) return;
    const el = ref.current.querySelector(`[data-line="${activeLine}"]`);
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [activeLine]);

  const lines = code.split("\n");

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1e1e1e] flex flex-col" style={{ height }}>
      {title && (
        <div className="px-3 py-1.5 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-[#555] font-mono">{title}</div>
      )}
      <div ref={ref} className="flex-1 overflow-auto py-2">
        {lines.map((line, i) => {
          const lineNo = i + 1;
          const active = lineNo === activeLine;
          return (
            <div
              key={i}
              data-line={lineNo}
              className={`px-4 py-0 flex items-start gap-3 ${active ? "bg-amber-500/15 border-l-2 border-amber-500" : "border-l-2 border-transparent"}`}
            >
              <span className={`text-[10px] font-mono select-none shrink-0 w-6 text-right pt-[3px] ${active ? "text-amber-400" : "text-zinc-600"}`}>{lineNo}</span>
              <pre className={`text-[12px] font-mono whitespace-pre m-0 leading-tight ${active ? "text-amber-200" : "text-[#d4d4d4]"}`}><code>{line || " "}</code></pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}

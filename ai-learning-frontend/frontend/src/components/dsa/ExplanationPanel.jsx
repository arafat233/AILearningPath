/**
 * ExplanationPanel — single-line text panel describing what the current
 * step is doing. Ported from dsa-visualizer 2/src/components/ExplanationPanel.tsx.
 */
export default function ExplanationPanel({ text }) {
  return (
    <div className="w-full px-5 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 text-sm min-h-[48px] flex items-center">
      <span className="text-zinc-500 mr-2 text-xs font-semibold uppercase tracking-wider">Step</span>
      {text || "Generate an array and press Sort to begin."}
    </div>
  );
}

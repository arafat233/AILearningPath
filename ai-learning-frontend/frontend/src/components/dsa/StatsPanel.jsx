/**
 * StatsPanel — live comparison/swap counts + time/space complexity card.
 * Ported from dsa-visualizer 2/src/components/StatsPanel.tsx.
 */
export default function StatsPanel({ comparisons = 0, swaps = 0, timeComplexity, spaceComplexity, description }) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex gap-4">
        <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-center min-w-[100px]">
          <div className="text-2xl font-bold font-mono text-amber-400">{comparisons}</div>
          <div className="text-xs text-zinc-500 mt-1">Comparisons</div>
        </div>
        <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-center min-w-[100px]">
          <div className="text-2xl font-bold font-mono text-blue-400">{swaps}</div>
          <div className="text-xs text-zinc-500 mt-1">Swaps / Writes</div>
        </div>
      </div>

      {timeComplexity && (
        // min-w-0 on phones so the card shrinks to fit instead of forcing
        // horizontal scroll; restore the comfortable 300px floor at sm+ (640px).
        <div className="flex-1 min-w-0 sm:min-w-[300px] px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex flex-wrap gap-4 text-sm mb-2">
            <span className="text-zinc-500">Time:</span>
            <span className="text-green-400 font-mono">Best {timeComplexity.best}</span>
            <span className="text-yellow-400 font-mono">Avg {timeComplexity.average}</span>
            <span className="text-red-400 font-mono">Worst {timeComplexity.worst}</span>
            <span className="text-zinc-500 ml-2">Space:</span>
            <span className="text-blue-400 font-mono">{spaceComplexity}</span>
          </div>
          {description && <p className="text-zinc-400 text-xs leading-relaxed">{description}</p>}
        </div>
      )}
    </div>
  );
}

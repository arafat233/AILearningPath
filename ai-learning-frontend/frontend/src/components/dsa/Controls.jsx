/**
 * Controls — playback toolbar for the sorting sandbox.
 *
 * Ported from dsa-visualizer 2/src/components/Controls.tsx:
 *   - Dropped 'use client'
 *   - Stripped TS Props interface (kept as JSDoc)
 *   - .tsx → .jsx
 */

const SIZES = [8, 12, 16, 24, 32];

/**
 * @param {{
 *   isSorting: boolean, isPaused: boolean, isStepMode: boolean,
 *   arraySize: number, speed: number,
 *   selectedAlgoId: string, algoOptions: {id: string, name: string}[],
 *   onAlgoChange: (id: string) => void,
 *   onSizeChange: (n: number) => void,
 *   onSpeedChange: (n: number) => void,
 *   onGenerate: () => void,
 *   onStart: () => void,
 *   onPause: () => void,
 *   onStop: () => void,
 *   onNextStep: () => void,
 *   onToggleStepMode: () => void,
 * }} props
 */
export default function Controls({
  isSorting, isPaused, isStepMode,
  arraySize, speed, selectedAlgoId, algoOptions,
  onAlgoChange, onSizeChange, onSpeedChange,
  onGenerate, onStart, onPause, onStop, onNextStep, onToggleStepMode,
}) {
  const delayLabel = speed <= 50 ? "Fast" : speed <= 150 ? "Medium" : speed <= 400 ? "Slow" : "Very Slow";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={selectedAlgoId}
        onChange={(e) => onAlgoChange(e.target.value)}
        disabled={isSorting}
        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white disabled:opacity-40 cursor-pointer"
      >
        {algoOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>

      <select
        value={arraySize}
        onChange={(e) => onSizeChange(Number(e.target.value))}
        disabled={isSorting}
        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white disabled:opacity-40 cursor-pointer"
      >
        {SIZES.map((s) => <option key={s} value={s}>Size: {s}</option>)}
      </select>

      <div className="w-px h-6 bg-zinc-700" />

      <button
        onClick={onGenerate}
        disabled={isSorting}
        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition disabled:opacity-40"
      >
        New Array
      </button>

      {!isSorting ? (
        <button
          onClick={onStart}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition"
        >
          {isStepMode ? "Init Steps" : "▶ Sort"}
        </button>
      ) : (
        <button
          onClick={onPause}
          disabled={isStepMode}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition disabled:opacity-40"
        >
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </button>
      )}

      <button
        onClick={onStop}
        disabled={!isSorting}
        className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-sm font-medium text-white transition disabled:opacity-40"
      >
        ⏹ Stop
      </button>

      <button
        onClick={onNextStep}
        disabled={!isSorting || !isStepMode}
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-sm font-medium text-white transition disabled:opacity-40"
      >
        Step →
      </button>

      <button
        onClick={onToggleStepMode}
        disabled={isSorting}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 border ${
          isStepMode
            ? "border-purple-500 bg-purple-900/40 text-purple-300"
            : "border-zinc-600 bg-transparent text-zinc-400 hover:border-zinc-400"
        }`}
      >
        {isStepMode ? "Step Mode ON" : "Step Mode"}
      </button>

      <div className="w-px h-6 bg-zinc-700" />

      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-400">Speed:</span>
        <input
          type="range"
          min={30}
          max={700}
          step={10}
          value={700 - speed + 30}
          onChange={(e) => onSpeedChange(700 - Number(e.target.value) + 30)}
          className="w-24 accent-blue-500"
        />
        <span className="text-zinc-300 w-20">{delayLabel}</span>
      </div>
    </div>
  );
}

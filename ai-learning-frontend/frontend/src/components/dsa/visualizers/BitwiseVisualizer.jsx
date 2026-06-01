/**
 * BitwiseVisualizer — renders two 8-bit registers and a result row.
 *
 * Props:
 *   frame  — a step frame from generateBitwiseSteps()
 *   opSymbol — e.g. "&", "|", "^", "~"
 */

const BIT_STATE = {
  null:  "bg-zinc-800 border-zinc-700 text-zinc-600",
  0:     "bg-zinc-800 border-zinc-600 text-zinc-300",
  1:     "bg-blue-900/60 border-blue-500 text-blue-200",
};

function BitCell({ value, highlight, small }) {
  const base = small ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-[13px]";
  const state = value === null ? BIT_STATE.null : value === 1 ? BIT_STATE[1] : BIT_STATE[0];
  const hl = highlight ? "ring-2 ring-yellow-400 scale-110 z-10 relative" : "";
  return (
    <div className={`${base} ${state} ${hl} border rounded font-mono font-bold flex items-center justify-center transition-all duration-200 select-none`}>
      {value === null ? "·" : value}
    </div>
  );
}

function RegisterRow({ label, bits, highlightIndex, color = "text-zinc-400" }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-16 text-right text-[12px] font-mono font-bold shrink-0 ${color}`}>{label}</span>
      <div className="flex gap-1">
        {bits.map((bit, i) => (
          <BitCell key={i} value={bit} highlight={i === highlightIndex} />
        ))}
      </div>
      <span className="text-[11px] text-zinc-500 font-mono">
        {bits.every(b => b !== null) ? parseInt(bits.join(""), 2) : ""}
      </span>
    </div>
  );
}

export default function BitwiseVisualizer({ frame }) {
  if (!frame) return null;

  const { aBits, bBits, rBits, bitIndex, op, a, b, result, description, phase } = frame;

  // Bit position labels (7 down to 0, MSB first)
  const bitLabels = Array.from({ length: 8 }, (_, i) => 7 - i);

  const opColor = {
    AND:    "text-green-400",
    OR:     "text-blue-400",
    XOR:    "text-purple-400",
    LSHIFT: "text-orange-400",
    RSHIFT: "text-orange-400",
    NOT_A:  "text-red-400",
  }[op] || "text-zinc-300";

  const opSymbol = { AND: "&", OR: "|", XOR: "^", LSHIFT: "<<1", RSHIFT: ">>1", NOT_A: "~a" }[op] || op;

  return (
    <div className="font-mono space-y-4 p-4">
      {/* Bit position labels */}
      <div className="flex items-center gap-3">
        <span className="w-16 shrink-0" />
        <div className="flex gap-1">
          {bitLabels.map((l) => (
            <div key={l} className="w-9 text-center text-[9px] text-zinc-600">{l}</div>
          ))}
        </div>
        <span className="text-[10px] text-zinc-600">dec</span>
      </div>

      {/* Row A */}
      <RegisterRow
        label={`a = ${a}`}
        bits={aBits}
        highlightIndex={bitIndex}
        color="text-zinc-200"
      />

      {/* Operator row */}
      {op !== "LSHIFT" && op !== "RSHIFT" && op !== "NOT_A" && (
        <RegisterRow
          label={`b = ${b}`}
          bits={bBits}
          highlightIndex={bitIndex}
          color="text-zinc-200"
        />
      )}

      {/* Divider with op symbol */}
      <div className="flex items-center gap-3">
        <span className={`w-16 text-right text-[13px] font-bold shrink-0 ${opColor}`}>{opSymbol}</span>
        <div className="flex-1 border-t border-zinc-600" />
      </div>

      {/* Result row */}
      <RegisterRow
        label={result !== null ? `= ${result}` : "result"}
        bits={rBits}
        highlightIndex={phase === "compute" ? bitIndex : -1}
        color={opColor}
      />

      {/* Description */}
      {description && (
        <div className="text-[11px] text-zinc-400 bg-zinc-900/60 rounded px-3 py-2 border border-zinc-700">
          {description}
        </div>
      )}
    </div>
  );
}

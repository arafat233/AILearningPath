/**
 * Bitwise step generator for BitwiseSandbox.
 *
 * Returns an array of frames, each describing one step of a bitwise operation.
 * Frame shape: { phase, a, b, op, result, bitIndex, aBits, bBits, rBits, description }
 *   - aBits / bBits / rBits: arrays of 8 numbers (MSB first)
 *   - bitIndex: which bit is being highlighted (-1 = none, final = -1 too)
 *   - phase: "init" | "compute" | "done"
 */

function toBits(n, width = 8) {
  const bits = [];
  for (let i = width - 1; i >= 0; i--) bits.push((n >> i) & 1);
  return bits; // MSB first
}

function fromBits(bits) {
  return bits.reduce((acc, b, i) => acc | (b << (bits.length - 1 - i)), 0);
}

export const OPERATIONS = [
  { id: "AND",  label: "AND  (&)",  symbol: "&"  },
  { id: "OR",   label: "OR  (|)",   symbol: "|"  },
  { id: "XOR",  label: "XOR  (^)",  symbol: "^"  },
  { id: "LSHIFT", label: "Left Shift (<<1)", symbol: "<<" },
  { id: "RSHIFT", label: "Right Shift (>>1)", symbol: ">>" },
  { id: "NOT_A",  label: "NOT A  (~)", symbol: "~"  },
];

export const CODE = {
  AND:    "int result = a & b;",
  OR:     "int result = a | b;",
  XOR:    "int result = a ^ b;",
  LSHIFT: "int result = a << 1;",
  RSHIFT: "int result = a >> 1;",
  NOT_A:  "int result = ~a & 0xFF;",
};

export const LINE_BY_PHASE = {
  init:    0,
  compute: 0,
  done:    0,
};

export function generateBitwiseSteps(a, b, opId) {
  a = Math.max(0, Math.min(255, a));
  b = Math.max(0, Math.min(255, b));

  const aBits = toBits(a);
  const bBits = toBits(b);
  const frames = [];

  const push = (phase, bitIndex, rBits, description) => {
    frames.push({
      phase, a, b, op: opId,
      aBits: [...aBits],
      bBits: [...bBits],
      rBits: rBits ? [...rBits] : new Array(8).fill(null),
      bitIndex, description,
      result: rBits ? fromBits(rBits.map(x => x ?? 0)) : null,
    });
  };

  // Opening frame
  push("init", -1, null, `a = ${a} (${a.toString(2).padStart(8, "0")}b), b = ${b} (${b.toString(2).padStart(8, "0")}b)`);

  if (opId === "AND" || opId === "OR" || opId === "XOR") {
    const rBits = new Array(8).fill(null);
    for (let i = 0; i < 8; i++) {
      let r;
      if (opId === "AND")      r = aBits[i] & bBits[i];
      else if (opId === "OR")  r = aBits[i] | bBits[i];
      else                     r = aBits[i] ^ bBits[i];
      rBits[i] = r;
      const desc = opId === "AND"
        ? `bit[${7-i}]: ${aBits[i]} & ${bBits[i]} = ${r}`
        : opId === "OR"
        ? `bit[${7-i}]: ${aBits[i]} | ${bBits[i]} = ${r}`
        : `bit[${7-i}]: ${aBits[i]} ^ ${bBits[i]} = ${r} ${aBits[i]===bBits[i]?"(same→0)":"(diff→1)"}`;
      push("compute", i, [...rBits], desc);
    }
    push("done", -1, rBits, `Result = ${fromBits(rBits)} (${fromBits(rBits).toString(2).padStart(8,"0")}b)`);

  } else if (opId === "LSHIFT") {
    const shifted = (a << 1) & 0xFF;
    const rBits = toBits(shifted);
    for (let i = 0; i < 8; i++) {
      const partial = new Array(8).fill(null);
      for (let j = 0; j <= i; j++) partial[j] = rBits[j];
      push("compute", i, partial, `Shift left: each bit moves one position left (LSB filled with 0)`);
    }
    push("done", -1, rBits, `Result = ${shifted} (${shifted.toString(2).padStart(8,"0")}b) — top bit dropped, 0 inserted at right`);

  } else if (opId === "RSHIFT") {
    const shifted = (a >> 1) & 0xFF;
    const rBits = toBits(shifted);
    for (let i = 7; i >= 0; i--) {
      const partial = new Array(8).fill(null);
      for (let j = 7; j >= i; j--) partial[j] = rBits[j];
      push("compute", i, partial, `Shift right: each bit moves one position right (MSB filled with 0)`);
    }
    push("done", -1, rBits, `Result = ${shifted} (${shifted.toString(2).padStart(8,"0")}b) — bottom bit dropped, 0 inserted at left`);

  } else if (opId === "NOT_A") {
    const notA = (~a) & 0xFF;
    const rBits = toBits(notA);
    for (let i = 0; i < 8; i++) {
      const partial = new Array(8).fill(null);
      for (let j = 0; j <= i; j++) partial[j] = rBits[j];
      push("compute", i, partial, `bit[${7-i}]: ~${aBits[i]} = ${rBits[i]}`);
    }
    push("done", -1, rBits, `~${a} & 0xFF = ${notA} (${notA.toString(2).padStart(8,"0")}b)`);
  }

  return frames;
}

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// Renders text with $...$ inline and $$...$$ block math.
// Falls back gracefully on bad expressions (returns raw text).
export default function MathText({ text, className = "" }) {
  if (!text) return null;
  const parts = parse(text);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.type === "inline") return <SafeMath key={i} math={p.value} block={false} />;
        if (p.type === "block")  return <SafeMath key={i} math={p.value} block />;
        return <span key={i}>{p.value}</span>;
      })}
    </span>
  );
}

function SafeMath({ math, block }) {
  try {
    return block ? <BlockMath math={math} /> : <InlineMath math={math} />;
  } catch {
    return <span className="font-mono text-[0.9em] bg-[#FFCC02]/15 px-1 rounded">{block ? `$$${math}$$` : `$${math}$`}</span>;
  }
}

// Tokenize on $$...$$ first, then $...$. Naive but covers the common content shapes.
function parse(text) {
  const out = [];
  let i = 0;
  const len = text.length;
  while (i < len) {
    // Block: $$...$$
    if (text[i] === "$" && text[i + 1] === "$") {
      const end = text.indexOf("$$", i + 2);
      if (end !== -1) {
        out.push({ type: "block", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // Inline: $...$  (avoid trailing $ with no closer)
    if (text[i] === "$") {
      const end = text.indexOf("$", i + 1);
      if (end !== -1 && end - i > 1 && !/^\s*$/.test(text.slice(i + 1, end))) {
        out.push({ type: "inline", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // plain run until next $
    let j = i;
    while (j < len && text[j] !== "$") j++;
    out.push({ type: "text", value: text.slice(i, j) });
    i = j;
  }
  return out;
}

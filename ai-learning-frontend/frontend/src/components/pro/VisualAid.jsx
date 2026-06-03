/**
 * VisualAid — renders a ProTopic's teaching.visual_aid as an actual visual,
 * not the raw illustrator brief. Three tiers, best-first:
 *
 *   1. block.svg          → authored inline SVG (for diagrams a flow can't express:
 *                           memory layouts, hierarchies, trees…). Rendered as-is.
 *   2. arrow-flow text     → auto-parsed pipeline ("A → B → C") rendered as boxes +
 *                           arrows + keyword icons. Covers ~114 pro_java topics with
 *                           zero re-authoring (parses the existing `description`).
 *   3. fallback            → styled concept card (the description as prose).
 *
 * block shape: { type?, description?, alt_text?, svg? }
 */

// Pull a clean "A → B → C" stage list out of a prose description, or null.
function parseFlow(desc) {
  if (!desc) return null;
  const norm = desc.replace(/⟶|➜|➔|➝|⇒|->|=>/g, "→");
  if (!norm.includes("→")) return null;
  const parts = norm.split("→").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  // First chunk carries a lead-in ("Show the pipeline: HelloWorld.java") — keep the tail.
  parts[0] = parts[0].split(/:\s*/).pop().split(/(?<=[.!?])\s+/).pop().trim();
  // Last chunk carries trailing prose ("Output. Arrows indicate…") — keep up to the first sentence end.
  const last = parts.length - 1;
  parts[last] = parts[last].split(/(?<=[.!?])\s/)[0].replace(/[.!?]+$/, "").trim();
  const stages = parts.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  // Sanity: 2–8 stages, none absurdly long (else it's prose, not a flow).
  if (stages.length < 2 || stages.length > 8) return null;
  if (stages.some((s) => s.length > 40)) return null;
  return stages;
}

function iconFor(label) {
  const s = label.toLowerCase();
  if (/javac|compil/.test(s)) return "⚙️";
  if (/\.class|bytecode/.test(s)) return "🧬";
  if (/jvm|\bvm\b|runtime|\bjava\b(?!\.)/.test(s)) return "☕";
  if (/output|terminal|console|stdout|print|result/.test(s)) return "🖥️";
  if (/\.java\b|source|\.txt|\bfile\b|\.json|\.xml/.test(s)) return "📄";
  if (/queue/.test(s)) return "📥";
  if (/stack/.test(s)) return "📚";
  if (/heap|priority/.test(s)) return "⛰️";
  if (/tree|node|root|leaf/.test(s)) return "🌳";
  if (/db|database|\bsql\b|mongo|table/.test(s)) return "🗄️";
  if (/request|http|\bapi\b|client|browser/.test(s)) return "🌐";
  if (/server|backend|service/.test(s)) return "🖧";
  if (/cache|redis/.test(s)) return "⚡";
  if (/thread|worker|async|pool/.test(s)) return "🧵";
  if (/error|exception|fail|catch/.test(s)) return "⚠️";
  if (/hash|map|index|key/.test(s)) return "🔑";
  if (/sort|order/.test(s)) return "↕️";
  return "▸";
}

function FlowDiagram({ stages }) {
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-y-3 py-1">
      {stages.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center justify-start text-center px-2" style={{ width: 104 }}>
            <div className="w-12 h-12 rounded-2xl bg-apple-purple/10 border border-apple-purple/25 flex items-center justify-center text-[22px] shrink-0">
              {iconFor(label)}
            </div>
            <span className="text-[11px] font-semibold text-[var(--label)] mt-1.5 leading-tight break-words">{label}</span>
          </div>
          {i < stages.length - 1 && (
            <span className="text-apple-purple text-[20px] font-bold px-0.5 self-start mt-3.5">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function VisualAid({ block }) {
  if (!block) return null;
  const stages = block.svg ? null : parseFlow(block.description);

  return (
    <div className="card p-5 border-l-4 border-apple-purple bg-apple-purple/5">
      <p className="text-[11px] font-bold tracking-wider uppercase text-apple-purple mb-3">
        {block.type || "Visual aid"}
      </p>

      {block.svg ? (
        <div className="flex justify-center overflow-x-auto" dangerouslySetInnerHTML={{ __html: block.svg }} />
      ) : stages ? (
        <FlowDiagram stages={stages} />
      ) : (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-apple-purple/10 flex items-center justify-center shrink-0">
            <span className="text-apple-purple text-[18px]">▦</span>
          </div>
          <p className="text-[14px] text-[var(--label)] leading-relaxed flex-1">{block.description}</p>
        </div>
      )}

      {/* Caption: for flow/svg, show the description as the explanatory caption. */}
      {(block.svg || stages) && block.description && (
        <p className="text-[12px] text-apple-gray mt-3 leading-relaxed">{block.description}</p>
      )}
      {block.alt_text && <p className="sr-only">{block.alt_text}</p>}
    </div>
  );
}

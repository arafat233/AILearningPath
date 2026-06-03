/**
 * TemplatePanel — reusable per-pattern code skeletons for the exercise editor
 * (Track-2 "code template library", DSA Animator parity). Shows the Java
 * skeleton(s) for the current exercise's `pattern`, with Copy and Insert-into-
 * editor. Renders nothing if the pattern has no templates.
 */
import { useState } from "react";
import TEMPLATES from "../../data/proCodeTemplates";

const humanize = (p) => (p || "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default function TemplatePanel({ pattern, onInsert }) {
  const list = TEMPLATES[pattern];
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(-1);
  if (!list || list.length === 0) return null;

  const copy = (code, idx) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(-1), 1500);
    }).catch(() => {});
  };

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-apple-gray6 transition-colors"
      >
        <span className="text-[12px] font-semibold text-[var(--label)]">
          📋 Templates · {humanize(pattern)}
          <span className="ml-1.5 text-[11px] text-apple-gray3 font-normal">{list.length} skeleton{list.length > 1 ? "s" : ""}</span>
        </span>
        <span className="text-apple-gray3 text-[14px]">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="border-t border-apple-gray5 divide-y divide-apple-gray5">
          {list.map((t, idx) => (
            <div key={idx} className="p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-apple-gray">{t.title}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => copy(t.code, idx)}
                    className="text-[11px] px-2 py-1 rounded-full bg-[var(--fill)] text-apple-gray hover:text-apple-blue transition-colors"
                  >
                    {copied === idx ? "Copied!" : "Copy"}
                  </button>
                  {onInsert && (
                    <button
                      onClick={() => onInsert(t.code)}
                      className="text-[11px] px-2 py-1 rounded-full bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20 font-semibold transition-colors"
                    >
                      Insert
                    </button>
                  )}
                </div>
              </div>
              <pre className="p-3 rounded-lg overflow-x-auto text-[12px] leading-[1.5] bg-[#1e1e1e] text-[#d4d4d4]"
                style={{ fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                <code>{t.code}</code>
              </pre>
            </div>
          ))}
          <p className="px-3 py-2 text-[10px] text-apple-gray3 italic">Starting points, not solutions — adapt to the problem.</p>
        </div>
      )}
    </div>
  );
}

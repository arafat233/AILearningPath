import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNcertTopicContent, evaluateExplanation, listNcertTopics, listNcertChapters,
         getStudiedTopics, toggleNcertStudied, getNcertNote, saveNcertNote,
         getTopicMastery, startTopic, submitAnswer, recordAdaptiveAttempt,
         getPaperQuestions } from "../services/api";

const S = { mono: { fontFamily: "ui-monospace, 'SF Mono', monospace" } };

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@keyframes ntv-in   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes ntv-pop  { 0%{transform:scale(.92);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
@keyframes ntv-flip { 0%{transform:rotateY(0)} 100%{transform:rotateY(180deg)} }
@keyframes ntv-shake{ 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
.ntv-in    { animation: ntv-in   0.25s ease both }
.ntv-pop   { animation: ntv-pop  0.3s  ease both }
.ntv-shake { animation: ntv-shake 0.4s ease both }
.ntv-btn:hover  { filter:brightness(0.93) }
.ntv-btn:active { transform:scale(0.97) }
`;
function injectCss() {
  if (document.getElementById("ntv-styles")) return;
  const el = document.createElement("style");
  el.id = "ntv-styles"; el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}

function sanitizeSvg(svg) {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<svg /, '<svg style="max-width:100%;height:auto;display:block;margin:0 auto" ');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Mode selector ───────────────────────────────────────────────────────── */
function ModeSelector({ mode, onChange }) {
  return (
    <div style={{ display:"flex", background:"#F5F5F7", borderRadius:"14px", padding:"4px", gap:"4px" }}>
      {[
        { key:"quick", icon:"⚡", label:"Quick · 5 min",  sub:"Core concepts only"  },
        { key:"deep",  icon:"📖", label:"Deep · 20 min", sub:"Full mastery path"    },
      ].map(({ key, icon, label, sub }) => (
        <button key={key} onClick={() => onChange(key)} className="ntv-btn"
          style={{ flex:1, padding:"10px 16px", borderRadius:"10px", border:"none", cursor:"pointer",
            transition:"all 0.15s", textAlign:"left",
            background: mode===key ? "#FFFFFF" : "transparent",
            boxShadow:  mode===key ? "0 2px 8px rgba(0,0,0,0.10)" : "none" }}>
          <div style={{ fontSize:"13px", fontWeight:700, color: mode===key ? "#1D1D1F" : "#86868B" }}>{icon} {label}</div>
          <div style={{ fontSize:"11px", color: mode===key ? "#86868B" : "#AEAEB2", marginTop:"2px" }}>{sub}</div>
        </button>
      ))}
    </div>
  );
}

/* ── Progress bar ────────────────────────────────────────────────────────── */
function ProgressBar({ done, total }) {
  if (!total) return null;
  const pct = Math.round((done / total) * 100);
  const fin = done >= total;
  return (
    <div style={{ background: fin ? "#F0FFF4" : "#F5F5F7", borderRadius:"12px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
      <div style={{ flex:1 }}>
        <div style={{ height:"6px", background:"#E5E5EA", borderRadius:"3px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background: fin ? "#34C759" : "#007AFF", borderRadius:"3px", transition:"width 0.4s ease" }} />
        </div>
      </div>
      <span style={{ fontSize:"12px", fontWeight:700, color: fin ? "#34C759" : "#007AFF", flexShrink:0 }}>
        {fin ? "✓ All done!" : `${done} / ${total} examples`}
      </span>
    </div>
  );
}

/* ── Collapsible section ─────────────────────────────────────────────────── */
function Section({ title, accent, defaultOpen=false, badge, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <button onClick={() => setOpen(o => !o)} className="ntv-btn"
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 28px", textAlign:"left", cursor:"pointer", background:"none", border:"none" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <h2 style={{ fontSize:"16px", fontWeight:700, color: accent||"#1D1D1F", margin:0 }}>{title}</h2>
          {badge && <span style={{ fontSize:"11px", fontWeight:700, background: accent ? accent+"22":"#F5F5F7", color: accent||"#86868B", padding:"2px 8px", borderRadius:"20px" }}>{badge}</span>}
        </div>
        <span style={{ color:"#AEAEB2", fontSize:"18px", flexShrink:0, transform: open?"rotate(90deg)":"none", transition:"transform 0.15s", lineHeight:1 }}>›</span>
      </button>
      {open && <div style={{ padding:"0 28px 28px", borderTop:"1px solid #F2F2F7" }}>{children}</div>}
    </div>
  );
}

/* ── Hook card ───────────────────────────────────────────────────────────── */
function HookCard({ text }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#1C1C1E 0%,#2C2C2E 100%)", borderRadius:"20px", padding:"36px 40px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"8px", left:"24px", fontSize:"80px", lineHeight:1, color:"#FFFFFF0D", fontFamily:"Georgia,serif", userSelect:"none" }}>"</div>
      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#FF9F0A", marginBottom:"16px" }}>Think about this…</p>
      <p style={{ fontSize:"16px", color:"#FFFFFF", lineHeight:1.8, margin:0, fontStyle:"italic", position:"relative" }}>{text}</p>
    </div>
  );
}

/* ── Plain-English card ──────────────────────────────────────────────────── */
function PlainEnglishCard({ text }) {
  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#007AFF,#5856D6)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>💬</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>In Plain English</span>
      </div>
      <div style={{ padding:"24px 28px" }}>
        <p style={{ fontSize:"15px", color:"#1D1D1F", lineHeight:1.8, margin:0 }}>{text}</p>
      </div>
    </div>
  );
}

/* ── Real-world cards ────────────────────────────────────────────────────── */
const ANCHOR_COLORS = [
  { bg:"#EEF4FF", accent:"#007AFF" },
  { bg:"#F0FFF4", accent:"#34C759" },
  { bg:"#FFF5F0", accent:"#FF6B00" },
  { bg:"#F5F0FF", accent:"#AF52DE" },
];
function RealWorldCards({ anchors }) {
  if (!anchors?.length) return null;
  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#34C759,#30D158)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🌍</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Real-World Examples</span>
      </div>
      <div style={{ padding:"20px 28px", display:"grid", gridTemplateColumns: anchors.length>1?"1fr 1fr":"1fr", gap:"12px" }}>
        {anchors.map((a, i) => {
          const { bg, accent } = ANCHOR_COLORS[i % ANCHOR_COLORS.length];
          return (
            <div key={i} style={{ background:bg, borderRadius:"14px", padding:"16px 18px" }}>
              <p style={{ fontSize:"13px", fontWeight:700, color:accent, marginBottom:"6px" }}>{a.scenario}</p>
              <p style={{ fontSize:"13px", color:"#3A3A3C", lineHeight:1.6, margin:0 }}>{a.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Central-idea pullquote ──────────────────────────────────────────────── */
function CentralIdeaCard({ text }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#EEF4FF 0%,#F0EEFF 100%)", borderRadius:"20px", padding:"32px 36px", borderLeft:"5px solid #007AFF" }}>
      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#007AFF", marginBottom:"14px" }}>💡 The Central Idea</p>
      <p style={{ fontSize:"17px", fontWeight:600, color:"#1D1D1F", lineHeight:1.7, margin:0 }}>{text}</p>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   INTERACTIVE FEATURES (Deep mode)
══════════════════════════════════════════════════════════════════════════ */

/* ── Feature 6: Confidence ping (after each section) ────────────────────── */
function ConfidencePing({ sectionKey, value, onRate }) {
  if (value) {
    const map = { low:"😕 Still fuzzy", mid:"🤔 Kind of", high:"💪 Got it!" };
    return (
      <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 0" }}>
        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background: value==="high"?"#34C759":value==="mid"?"#FF9500":"#FF3B30", flexShrink:0 }} />
        <span style={{ fontSize:"12px", color:"#86868B" }}>You marked: {map[value]}</span>
        <button onClick={() => onRate(sectionKey, null)} style={{ fontSize:"11px", color:"#AEAEB2", background:"none", border:"none", cursor:"pointer", padding:0 }}>change</button>
      </div>
    );
  }
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", borderTop:"1px solid #F2F2F7", marginTop:"8px" }}>
      <span style={{ fontSize:"12px", color:"#AEAEB2", marginRight:"4px" }}>How clear was this?</span>
      {[["low","😕"],["mid","🤔"],["high","💪"]].map(([k, icon]) => (
        <button key={k} onClick={() => onRate(sectionKey, k)} className="ntv-btn"
          style={{ padding:"5px 12px", borderRadius:"20px", border:"1px solid #E5E5EA", background:"#FAFAFA", fontSize:"13px", cursor:"pointer" }}>
          {icon}
        </button>
      ))}
    </div>
  );
}

/* ── Feature 5: Formula blanks (MCQ fill-in) ─────────────────────────────── */
function FormulaBlanks({ formulas, state, onAnswer }) {
  if (!formulas?.length) return null;

  // Split each formula: everything before the last token is prefix, last token is the answer
  const items = formulas.map(f => {
    const s = typeof f === "string" ? f : JSON.stringify(f);
    const tokens = s.trim().split(/\s+/);
    const answer = tokens[tokens.length - 1].replace(/[^a-zA-Z0-9≤≥<>]/g, "");
    const prefix = tokens.slice(0, -1).join(" ");
    // Generate 3 wrong choices by mutating the answer slightly
    const wrongs = answer.length <= 2
      ? [answer.replace(/[a-z]/, c => String.fromCharCode(c.charCodeAt(0)+1)),
         answer.replace(/[a-z]/, c => String.fromCharCode(c.charCodeAt(0)+2)),
         answer + "²"]
      : [answer.split("").reverse().join(""), answer + "k", "0"];
    return { s, prefix, answer, choices: shuffle([answer, ...wrongs.slice(0,3)]) };
  });

  const allCorrect = items.every((it, i) => state[i]?.correct);

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#5856D6,#AF52DE)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🧩</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Formula Builder</span>
        {allCorrect && <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>✓ All correct!</span>}
      </div>
      <div style={{ padding:"20px 28px", display:"flex", flexDirection:"column", gap:"16px" }}>
        <p style={{ fontSize:"13px", color:"#86868B", margin:"0 0 4px" }}>Complete each formula by choosing the missing term.</p>
        {items.map((it, i) => {
          const picked = state[i]?.picked;
          const correct = state[i]?.correct;
          return (
            <div key={i}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
                <code style={{ fontSize:"16px", ...S.mono, color:"#1D1D1F", fontWeight:600 }}>{it.prefix}</code>
                {picked ? (
                  <span style={{ fontSize:"16px", ...S.mono, fontWeight:700, color: correct?"#34C759":"#FF3B30",
                    background: correct?"#F0FFF4":"#FFF0F0", padding:"4px 12px", borderRadius:"8px", border:`2px solid ${correct?"#34C759":"#FF3B30"}` }}>
                    {picked}
                    {correct ? " ✓" : ` ✗ (${it.answer})`}
                  </span>
                ) : (
                  <span style={{ fontSize:"16px", ...S.mono, color:"#AEAEB2", borderBottom:"2px dashed #AEAEB2", padding:"0 12px" }}>___</span>
                )}
              </div>
              {!picked && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                  {it.choices.map(c => (
                    <button key={c} onClick={() => onAnswer(i, c, c===it.answer)} className="ntv-btn"
                      style={{ padding:"8px 18px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#FAFAFA",
                        fontSize:"14px", ...S.mono, fontWeight:600, cursor:"pointer", color:"#1D1D1F" }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {allCorrect && (
          <div className="ntv-pop" style={{ borderTop:"1px solid #F2F2F7", paddingTop:"16px", marginTop:"4px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#5856D6", marginBottom:"12px" }}>
              🎉 Formulas unlocked — your reference sheet
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {formulas.map((f, i) => (
                <div key={i} style={{ background:"#F5F0FF", borderRadius:"10px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
                  <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#5856D6", color:"#fff",
                    fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
                  <code style={{ fontSize:"15px", ...S.mono, color:"#1D1D1F", fontWeight:600 }}>
                    {typeof f === "string" ? f : JSON.stringify(f)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature 4: Error hunt ───────────────────────────────────────────────── */
function ErrorHunt({ example, wrongStepIdx, misconceptionHint, onComplete }) {
  const [picked, setPicked] = useState(null);
  const rawSteps = example?.steps?.length ? example.steps
    : (example?.steps_compressed||[]).map((s,i)=>({ step_number:i+1, action:s }));

  if (!rawSteps?.length || wrongStepIdx == null) return null;

  const handlePick = (idx) => {
    if (picked != null) return;
    setPicked(idx);
    if (idx === wrongStepIdx) onComplete(true);
    else onComplete(false);
  };

  const isRevealed = picked != null;
  const gotIt = picked === wrongStepIdx;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#FF3B30,#FF6B6B)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🕵️</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Error Hunt</span>
      </div>
      <div style={{ padding:"20px 28px" }}>
        <p style={{ fontSize:"14px", fontWeight:600, color:"#1D1D1F", marginBottom:"4px" }}>
          {example.problem}
        </p>
        <p style={{ fontSize:"13px", color:"#86868B", marginBottom:"16px" }}>
          One step below contains a mistake. Tap to identify it.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {rawSteps.map((step, si) => {
            const isWrong   = si === wrongStepIdx;
            const isPicked  = picked === si;
            let bg = "#F5F5F7", border = "2px solid transparent", textCol = "#1D1D1F";
            if (isRevealed) {
              if (isWrong)  { bg="#FFF5F5"; border="2px solid #FF3B30"; textCol="#FF3B30"; }
              if (!isWrong) { bg="#F0FFF4"; border="2px solid #34C759"; }
            }
            if (isPicked && !isWrong) { bg="#FFF0F0"; }
            return (
              <button key={si} onClick={() => handlePick(si)} disabled={isRevealed} className="ntv-btn"
                style={{ background:bg, border, borderRadius:"12px", padding:"12px 16px", cursor: isRevealed?"default":"pointer",
                  textAlign:"left", display:"flex", gap:"10px", alignItems:"flex-start" }}>
                <span style={{ width:"22px", height:"22px", borderRadius:"50%",
                  background: isRevealed&&isWrong?"#FF3B30": isRevealed?"#34C759":"#007AFF",
                  color:"#fff", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {isRevealed ? (isWrong ? "✗" : "✓") : si+1}
                </span>
                <div>
                  <p style={{ fontSize:"12px", color:"#86868B", margin:"3px 0 4px" }}>{step.action}</p>
                  {step.computation && (
                    <p style={{ fontSize:"15px", ...S.mono, color:textCol, fontWeight:600, margin:0 }}>
                      {isWrong && isRevealed
                        ? step._wrong_computation || step.computation
                        : step.computation}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {isRevealed && (
          <div className="ntv-pop" style={{ marginTop:"16px", background: gotIt?"#F0FFF4":"#FFF0F0",
            borderRadius:"12px", padding:"14px 18px", borderLeft:`4px solid ${gotIt?"#34C759":"#FF3B30"}` }}>
            <p style={{ fontSize:"13px", fontWeight:700, color: gotIt?"#34C759":"#FF3B30", marginBottom:"6px" }}>
              {gotIt ? "🎯 Exactly right!" : "Not quite — step " + (wrongStepIdx+1) + " was the mistake."}
            </p>
            {misconceptionHint && (
              <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>
                <strong>Why it's wrong:</strong> {misconceptionHint}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature 3: Active recall flip cards ─────────────────────────────────── */
function RecallCards({ cards, ratings, onRate }) {
  const [idx, setIdx]       = useState(0);
  const [flipped, setFlip]  = useState(false);

  if (!cards?.length) return null;
  const card    = cards[idx];
  const total   = cards.length;
  const rated   = Object.keys(ratings).length;
  const gotCount = Object.values(ratings).filter(Boolean).length;

  const next = () => { setFlip(false); setTimeout(() => setIdx(i => Math.min(i+1, total-1)), 200); };
  const prev = () => { setFlip(false); setTimeout(() => setIdx(i => Math.max(i-1, 0)), 200); };

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(90deg,#FF9500,#FFCC00)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span>🃏</span>
        <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Recall Cards</span>
        <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>{idx+1}/{total}</span>
      </div>
      <div style={{ padding:"24px 28px" }}>
        {/* Progress dots */}
        <div style={{ display:"flex", gap:"5px", marginBottom:"16px" }}>
          {cards.map((_,i) => (
            <div key={i} onClick={() => { setFlip(false); setTimeout(()=>setIdx(i),200); }}
              style={{ width:"8px", height:"8px", borderRadius:"50%", cursor:"pointer",
                background: ratings[i]===true?"#34C759": ratings[i]===false?"#FF3B30": i===idx?"#007AFF":"#E5E5EA" }} />
          ))}
        </div>

        {/* Card */}
        <div onClick={() => setFlip(f=>!f)} style={{ cursor:"pointer", minHeight:"120px",
          background: flipped?"#1D1D1F":"#F5F5F7", borderRadius:"16px", padding:"24px",
          transition:"background 0.3s", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
            color: flipped?"rgba(255,255,255,0.5)":"#86868B", marginBottom:"10px" }}>
            {flipped ? "Answer" : "Question — tap to flip"}
          </p>
          <p style={{ fontSize:"15px", fontWeight:600, color: flipped?"#FFFFFF":"#1D1D1F", lineHeight:1.6, margin:0 }}>
            {flipped ? card.answer : card.question}
          </p>
        </div>

        {/* Rate buttons (only after flip) */}
        {flipped && ratings[idx] == null && (
          <div className="ntv-in" style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
            <button onClick={() => onRate(idx, false)} className="ntv-btn"
              style={{ flex:1, padding:"10px", borderRadius:"10px", border:"2px solid #FF3B30",
                background:"#FFF5F5", fontSize:"13px", fontWeight:700, cursor:"pointer", color:"#FF3B30" }}>
              ✗ Missed it
            </button>
            <button onClick={() => onRate(idx, true)} className="ntv-btn"
              style={{ flex:1, padding:"10px", borderRadius:"10px", border:"2px solid #34C759",
                background:"#F0FFF4", fontSize:"13px", fontWeight:700, cursor:"pointer", color:"#34C759" }}>
              ✓ Got it!
            </button>
          </div>
        )}
        {ratings[idx] != null && (
          <div style={{ marginTop:"10px", display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ fontSize:"12px", color: ratings[idx]?"#34C759":"#FF3B30", fontWeight:600 }}>
              {ratings[idx] ? "✓ Marked as got it" : "✗ Marked for review"}
            </span>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"16px" }}>
          <button onClick={prev} disabled={idx===0} className="ntv-btn"
            style={{ padding:"8px 16px", borderRadius:"10px", border:"1px solid #E5E5EA",
              background: idx===0?"#F5F5F7":"#fff", color: idx===0?"#AEAEB2":"#1D1D1F",
              fontSize:"13px", fontWeight:600, cursor: idx===0?"default":"pointer" }}>
            ← Prev
          </button>
          <span style={{ fontSize:"12px", color:"#86868B" }}>{rated}/{total} rated</span>
          <button onClick={next} disabled={idx===total-1} className="ntv-btn"
            style={{ padding:"8px 16px", borderRadius:"10px", border:"1px solid #E5E5EA",
              background: idx===total-1?"#F5F5F7":"#fff", color: idx===total-1?"#AEAEB2":"#1D1D1F",
              fontSize:"13px", fontWeight:600, cursor: idx===total-1?"default":"pointer" }}>
            Next →
          </button>
        </div>

        {/* Summary when all rated */}
        {rated === total && (
          <div className="ntv-pop" style={{ marginTop:"14px", background:"#F5F5F7", borderRadius:"12px", padding:"14px 18px" }}>
            <p style={{ fontSize:"13px", fontWeight:700, color:"#1D1D1F", marginBottom:"4px" }}>
              {gotCount}/{total} correct 🎯
            </p>
            {gotCount < total && (
              <p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>
                {total-gotCount} card{total-gotCount>1?"s":""} to review — go back and re-read those sections.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature 2: Feynman explainer ────────────────────────────────────────── */
function FeynmanBox({ concept, topicName }) {
  const [text, setText]       = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const r = await evaluateExplanation(topicName, text.trim());
      setResult(r.data?.data || r.data);
    } catch {
      setResult({ feedback: "Could not evaluate — check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
      <button onClick={() => setOpen(o=>!o)} className="ntv-btn"
        style={{ width:"100%", background:"linear-gradient(90deg,#34C759,#32D74B)", padding:"12px 28px",
          border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span>🧠</span>
          <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Feynman Challenge</span>
        </div>
        <span style={{ fontSize:"18px", color:"rgba(255,255,255,0.8)", transform: open?"rotate(90deg)":"none", transition:"transform 0.15s" }}>›</span>
      </button>

      {open && (
        <div style={{ padding:"20px 28px" }}>
          {!result ? (
            <>
              <p style={{ fontSize:"14px", color:"#1D1D1F", marginBottom:"6px", fontWeight:600 }}>
                Explain <em>{concept}</em> in your own words — no peeking.
              </p>
              <p style={{ fontSize:"12px", color:"#86868B", marginBottom:"12px" }}>
                Pretend you're teaching a 12-year-old. If you can explain it simply, you understand it.
              </p>
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder="Type your explanation here…"
                style={{ width:"100%", minHeight:"100px", borderRadius:"10px", border:"2px solid #E5E5EA",
                  padding:"12px 14px", fontSize:"14px", color:"#1D1D1F", lineHeight:1.6, resize:"vertical",
                  fontFamily:"-apple-system,sans-serif", outline:"none", boxSizing:"border-box" }}
              />
              <button onClick={submit} disabled={!text.trim()||loading} className="ntv-btn"
                style={{ marginTop:"10px", padding:"10px 24px", borderRadius:"10px", border:"none",
                  background: text.trim()?"#34C759":"#D1D1D6", color:"#fff",
                  fontSize:"13px", fontWeight:700, cursor: text.trim()?"pointer":"default" }}>
                {loading ? "Evaluating…" : "Submit for AI Review →"}
              </button>
            </>
          ) : (
            <div className="ntv-pop">
              {result.score != null && (
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
                  <div style={{ width:"56px", height:"56px", borderRadius:"50%",
                    background: result.score>=7?"#F0FFF4": result.score>=4?"#FFF5F0":"#FFF0F0",
                    border:`3px solid ${result.score>=7?"#34C759": result.score>=4?"#FF9500":"#FF3B30"}`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:"18px", fontWeight:800,
                      color: result.score>=7?"#34C759": result.score>=4?"#FF9500":"#FF3B30" }}>
                      {result.score}/10
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize:"14px", fontWeight:700, color:"#1D1D1F", margin:"0 0 2px" }}>
                      {result.score>=7?"Great explanation!": result.score>=4?"Getting there!":"Needs more work"}
                    </p>
                    <p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>AI evaluation</p>
                  </div>
                </div>
              )}
              {result.feedback && (
                <div style={{ background:"#F5F5F7", borderRadius:"10px", padding:"14px 16px", marginBottom:"12px" }}>
                  <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{result.feedback}</p>
                </div>
              )}
              {result.strong?.length > 0 && (
                <div style={{ marginBottom:"10px" }}>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"#34C759", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>What you got right</p>
                  {result.strong.map((s,i) => <p key={i} style={{ fontSize:"13px", color:"#1D1D1F", margin:"0 0 4px", paddingLeft:"12px" }}>✓ {s}</p>)}
                </div>
              )}
              {result.missing?.length > 0 && (
                <div style={{ marginBottom:"12px" }}>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"#FF9500", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>What to add</p>
                  {result.missing.map((m,i) => <p key={i} style={{ fontSize:"13px", color:"#1D1D1F", margin:"0 0 4px", paddingLeft:"12px" }}>→ {m}</p>)}
                </div>
              )}
              <button onClick={() => { setResult(null); setText(""); }} className="ntv-btn"
                style={{ padding:"8px 18px", borderRadius:"8px", border:"1px solid #E5E5EA",
                  background:"#fff", fontSize:"13px", fontWeight:600, cursor:"pointer", color:"#1D1D1F" }}>
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Feature 1: Interactive worked example with step prediction ──────────── */
function InteractiveWorkedExample({ ex, index, onDone, deepMode }) {
  const rawSteps = ex.steps?.length
    ? ex.steps
    : (ex.steps_compressed||[]).map((s,i) => ({ step_number:i+1, action:s }));

  const stepCount = rawSteps.length;
  // predictions: { stepIdx: 'correct'|'wrong'|null }
  const [predictions, setPredictions] = useState({});
  const [revealed, setRevealed]       = useState(0);
  const isFinal   = revealed > stepCount;
  const hasFinale = ex.verification_after || ex.lesson_from_this_example || ex.answer;

  // Build prediction choices for each step that has a computation
  const allComps = rawSteps.map(s => s.computation).filter(Boolean);

  const choicesFor = useCallback((si) => {
    const correct = rawSteps[si]?.computation;
    if (!correct) return null;
    const others = allComps.filter((_, i) => i !== si);
    const pool   = others.length >= 2 ? others : [
      // fabricate a wrong option by changing first number in correct
      correct.replace(/\d+/, n => String(parseInt(n)+1)),
      correct.replace(/\d+/, n => String(parseInt(n)+2)),
    ];
    return shuffle([correct, ...pool.slice(0,2)]);
  }, [rawSteps, allComps]);

  const needsPrediction = (si) => deepMode && !!rawSteps[si]?.computation && allComps.length >= 2;

  const advance = () => {
    const si = revealed; // about to reveal step at index `revealed`
    if (revealed < stepCount) {
      if (needsPrediction(si) && predictions[si] == null) return; // wait for prediction
      setRevealed(r => r+1);
    } else {
      setRevealed(r => r+1);
      onDone?.(index);
    }
  };

  const predict = (si, choice) => {
    const correct = rawSteps[si]?.computation === choice;
    setPredictions(p => ({ ...p, [si]: correct ? "correct" : "wrong" }));
  };

  return (
    <div style={{ border: isFinal?"2px solid #34C759":"2px solid #E5E5EA", borderRadius:"16px", overflow:"hidden", transition:"border-color 0.3s" }}>
      {/* Header */}
      <div style={{ background: isFinal?"#F0FFF4":"#F5F5F7", padding:"14px 20px", display:"flex", alignItems:"center", gap:"12px", borderBottom:"1px solid #E5E5EA" }}>
        <span style={{ width:"28px", height:"28px", borderRadius:"50%", background: isFinal?"#34C759":"#007AFF",
          color:"#fff", fontSize:"12px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {isFinal ? "✓" : index+1}
        </span>
        <span style={{ fontSize:"13px", fontWeight:700, color: isFinal?"#34C759":"#1D1D1F" }}>
          {isFinal ? "Example complete" : `Example ${index+1}`}
        </span>
        {stepCount>0 && (
          <div style={{ display:"flex", gap:"5px", marginLeft:"auto" }}>
            {rawSteps.map((_,si) => (
              <div key={si} style={{ width:"7px", height:"7px", borderRadius:"50%",
                background: si<revealed ? (predictions[si]==="wrong"?"#FF9500":"#007AFF") : "#D1D1D6",
                transition:"background 0.2s" }} />
            ))}
            {hasFinale && <div style={{ width:"7px", height:"7px", borderRadius:"50%", background: isFinal?"#34C759":"#D1D1D6", transition:"background 0.2s" }} />}
          </div>
        )}
      </div>

      <div style={{ padding:"20px" }}>
        {/* Problem */}
        {ex.problem && (
          <div style={{ background:"#F5F5F7", borderRadius:"12px", padding:"14px 18px", marginBottom:"14px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#86868B", marginBottom:"6px" }}>Problem</p>
            <p style={{ fontSize:"15px", fontWeight:600, color:"#1D1D1F", lineHeight:1.5, margin:0 }}>{ex.problem}</p>
          </div>
        )}
        {ex.thought_process_before_starting && (
          <div style={{ background:"#EEF4FF", borderRadius:"10px", padding:"12px 16px", marginBottom:"14px", borderLeft:"3px solid #007AFF" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>Strategy</p>
            <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{ex.thought_process_before_starting}</p>
          </div>
        )}

        {/* Prediction prompt (shown before the step is revealed) */}
        {revealed < stepCount && needsPrediction(revealed) && predictions[revealed] == null && (
          <div className="ntv-pop" style={{ background:"#FFFBEB", border:"2px solid #FF9F0A", borderRadius:"12px", padding:"16px", marginBottom:"14px" }}>
            <p style={{ fontSize:"13px", fontWeight:700, color:"#FF9F0A", marginBottom:"10px" }}>
              🔮 Predict step {revealed+1} — what's the next computation?
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {choicesFor(revealed)?.map((c,ci) => (
                <button key={ci} onClick={() => predict(revealed, c)} className="ntv-btn"
                  style={{ padding:"10px 14px", borderRadius:"10px", border:"2px solid #E5E5EA",
                    background:"#fff", textAlign:"left", cursor:"pointer", fontSize:"14px", ...S.mono, fontWeight:600, color:"#1D1D1F" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prediction feedback */}
        {revealed < stepCount && predictions[revealed] != null && (
          <div className={predictions[revealed]==="correct" ? "ntv-pop" : "ntv-shake"}
            style={{ background: predictions[revealed]==="correct"?"#F0FFF4":"#FFF0F0",
              borderRadius:"10px", padding:"10px 14px", marginBottom:"12px",
              borderLeft:`3px solid ${predictions[revealed]==="correct"?"#34C759":"#FF3B30"}` }}>
            <span style={{ fontSize:"13px", fontWeight:700, color: predictions[revealed]==="correct"?"#34C759":"#FF3B30" }}>
              {predictions[revealed]==="correct" ? "🎯 Correct prediction!" : "✗ Not quite — see the correct step below."}
            </span>
          </div>
        )}

        {/* Revealed steps */}
        {rawSteps.slice(0, revealed).map((step, si) => (
          <div key={si} className="ntv-in" style={{ marginBottom:"12px" }}>
            <div style={{ display:"flex", gap:"12px" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px", flexShrink:0 }}>
                <span style={{ width:"26px", height:"26px", borderRadius:"50%",
                  background: predictions[si]==="wrong"?"#FF9500":"#007AFF",
                  color:"#fff", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {step.step_number ?? si+1}
                </span>
                {si < revealed-1 && <div style={{ width:"2px", flex:1, background:"#E5E5EA", minHeight:"8px" }} />}
              </div>
              <div style={{ flex:1, paddingBottom:"8px" }}>
                <p style={{ fontSize:"12px", color:"#86868B", margin:"3px 0 6px" }}>{step.action}</p>
                {step.computation && (
                  <div style={{ background:"#F5F5F7", borderRadius:"8px", padding:"10px 14px", marginBottom:"8px" }}>
                    <p style={{ fontSize:"17px", ...S.mono, color:"#1D1D1F", margin:0, fontWeight:600 }}>{step.computation}</p>
                  </div>
                )}
                {step.students_internal_voice && (
                  <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"8px", padding:"8px 12px", display:"flex", gap:"6px" }}>
                    <span style={{ fontSize:"14px", flexShrink:0 }}>💭</span>
                    <p style={{ fontSize:"12px", color:"#78350F", fontStyle:"italic", lineHeight:1.5, margin:0 }}>{step.students_internal_voice}</p>
                  </div>
                )}
                {step.lemma_validity_check && (
                  <p style={{ fontSize:"12px", color:"#34C759", margin:"6px 0 0", display:"flex", gap:"4px" }}>✓ {step.lemma_validity_check}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Final */}
        {isFinal && (
          <div className="ntv-in" style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {ex.verification_after && (
              <div style={{ background:"#F0FFF4", borderRadius:"10px", padding:"12px 14px", borderLeft:"3px solid #34C759" }}>
                <p style={{ fontSize:"11px", fontWeight:700, color:"#34C759", marginBottom:"4px" }}>✓ Verify</p>
                <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.5, margin:0 }}>{ex.verification_after}</p>
              </div>
            )}
            {ex.lesson_from_this_example && (
              <div style={{ background:"#EEF4FF", borderRadius:"10px", padding:"12px 14px", borderLeft:"3px solid #007AFF" }}>
                <p style={{ fontSize:"11px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>💡 Lesson</p>
                <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.5, margin:0 }}>{ex.lesson_from_this_example}</p>
              </div>
            )}
            {ex.answer && (
              <div style={{ background:"#1D1D1F", borderRadius:"10px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize:"11px", fontWeight:800, color:"#34C759", letterSpacing:"1px" }}>ANSWER</span>
                <p style={{ fontSize:"16px", fontWeight:700, color:"#FFFFFF", margin:0, ...S.mono }}>{ex.answer}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        {!isFinal && (
          <div style={{ marginTop:"16px" }}>
            {/* If prediction needed and not yet answered, hide the advance button */}
            {!(revealed < stepCount && needsPrediction(revealed) && predictions[revealed] == null) && (
              <button onClick={advance} className="ntv-btn"
                style={{ padding:"11px 22px", borderRadius:"10px", border:"none", fontSize:"13px", fontWeight:700,
                  cursor:"pointer", transition:"all 0.15s",
                  background: revealed===0?"#007AFF": revealed<stepCount?"#EEF4FF":"#F0FFF4",
                  color:       revealed===0?"#FFFFFF": revealed<stepCount?"#007AFF":"#34C759" }}>
                {revealed===0 ? "Start Solving →"
                  : revealed<stepCount ? `Next Step (${revealed}/${stepCount}) →`
                  : "✓ Show Answer"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Confidence summary (end of page) ────────────────────────────────────── */
function ConfidenceSummary({ confidence, sections }) {
  const weak = sections.filter(s => confidence[s.key] === "low");
  const mid  = sections.filter(s => confidence[s.key] === "mid");
  const good = sections.filter(s => confidence[s.key] === "high");
  const rated = sections.filter(s => confidence[s.key]);
  if (!rated.length) return null;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", padding:"20px 28px" }}>
      <p style={{ fontSize:"14px", fontWeight:700, color:"#1D1D1F", marginBottom:"14px" }}>📊 Your Confidence Summary</p>
      {good.length>0 && (
        <div style={{ marginBottom:"8px" }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#34C759", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>✓ Got it</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {good.map(s => <span key={s.key} style={{ fontSize:"12px", background:"#F0FFF4", color:"#34C759", padding:"3px 10px", borderRadius:"20px", fontWeight:600 }}>{s.label}</span>)}
          </div>
        </div>
      )}
      {mid.length>0 && (
        <div style={{ marginBottom:"8px" }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#FF9500", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>🤔 Kind of</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {mid.map(s => <span key={s.key} style={{ fontSize:"12px", background:"#FFF5F0", color:"#FF9500", padding:"3px 10px", borderRadius:"20px", fontWeight:600 }}>{s.label}</span>)}
          </div>
        </div>
      )}
      {weak.length>0 && (
        <div>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#FF3B30", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>😕 Still fuzzy — review these</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {weak.map(s => <span key={s.key} style={{ fontSize:"12px", background:"#FFF5F5", color:"#FF3B30", padding:"3px 10px", borderRadius:"20px", fontWeight:600 }}>{s.label}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared misconception details ────────────────────────────────────────── */
function MisconceptionDetails({ m }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginTop:"8px" }}>
      {m.why_students_fall_for_this && <p style={{ fontSize:"12px", color:"#86868B", fontStyle:"italic", margin:0 }}>Why it happens: {m.why_students_fall_for_this}</p>}
      {m.concrete_wrong_example && (
        <div style={{ background:"#FFE5E5", borderRadius:"8px", padding:"8px 12px" }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#FF3B30", marginBottom:"2px", letterSpacing:"1px", textTransform:"uppercase" }}>Wrong example</p>
          <p style={{ fontSize:"13px", ...S.mono, color:"#1D1D1F", margin:0 }}>{m.concrete_wrong_example}</p>
        </div>
      )}
      {m.correction && (
        <div style={{ background:"#F0FFF4", borderRadius:"8px", padding:"10px 14px", borderLeft:"3px solid #34C759" }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#34C759", marginBottom:"4px", letterSpacing:"1px", textTransform:"uppercase" }}>Correction</p>
          <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{m.correction}</p>
        </div>
      )}
      {m.how_to_spot_mid_problem && (
        <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"8px", padding:"8px 12px", display:"flex", gap:"6px" }}>
          <span>💡</span>
          <p style={{ fontSize:"12px", color:"#92400E", lineHeight:1.5, margin:0 }}>{m.how_to_spot_mid_problem}</p>
        </div>
      )}
    </div>
  );
}

function MisconceptionCard({ m }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius:"12px", overflow:"hidden", border:"1px solid #FFD5D5" }}>
      <button onClick={() => setOpen(o=>!o)} className="ntv-btn"
        style={{ width:"100%", background:"#FFF5F5", padding:"12px 16px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", textAlign:"left" }}>
        <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#FF3B30", color:"#fff", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✗</span>
        <p style={{ fontSize:"13px", fontWeight:600, color:"#FF3B30", margin:0, lineHeight:1.4, flex:1 }}>{m.wrong_idea}</p>
        <span style={{ fontSize:"12px", color:"#AEAEB2", transform: open?"rotate(90deg)":"none", transition:"transform 0.15s" }}>›</span>
      </button>
      {open && <div style={{ padding:"0 16px 14px", background:"#FFF" }}><MisconceptionDetails m={m} /></div>}
    </div>
  );
}

function MisconceptionChallenge({ m, index }) {
  const [answered, setAnswered] = useState(null);
  return (
    <div style={{ borderRadius:"14px", overflow:"hidden", border: answered==="correct"?"2px solid #34C759": answered==="wrong"?"2px solid #FF3B30":"2px solid #FFD5D5", transition:"border-color 0.2s" }}>
      <div style={{ background: answered==="correct"?"#F0FFF4": answered==="wrong"?"#FFF5F5":"#FFF5F5", padding:"12px 16px", borderBottom:"1px solid #F2F2F7", display:"flex", alignItems:"center", gap:"8px" }}>
        <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#FF3B30", color:"#fff", fontSize:"10px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{index+1}</span>
        <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FF3B30" }}>Misconception Check</span>
        {answered && <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color: answered==="correct"?"#34C759":"#FF3B30" }}>{answered==="correct"?"✓ Correct!":"✗ Wrong answer"}</span>}
      </div>
      <div style={{ padding:"16px" }}>
        <p style={{ fontSize:"13px", color:"#86868B", marginBottom:"8px" }}>Is this statement correct?</p>
        <div style={{ background:"#FFE5E5", borderRadius:"10px", padding:"14px 16px", marginBottom:"14px" }}>
          <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.6, margin:0, fontStyle:"italic" }}>"{m.wrong_idea}"</p>
        </div>
        {!answered && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
            <button onClick={() => setAnswered("wrong")} className="ntv-btn"
              style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#34C759" }}>✓ Yes, correct</button>
            <button onClick={() => setAnswered("correct")} className="ntv-btn"
              style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#FF3B30" }}>✗ No, it's wrong</button>
          </div>
        )}
        {answered==="correct" && <div className="ntv-pop" style={{ background:"#F0FFF4", borderRadius:"10px", padding:"10px 14px", marginBottom:"10px", display:"flex", gap:"8px" }}><span>🎯</span><span style={{ fontSize:"13px", fontWeight:700, color:"#34C759" }}>Correct! That's a common misconception.</span></div>}
        {answered==="wrong"   && <div className="ntv-pop" style={{ background:"#FFF0F0", borderRadius:"10px", padding:"10px 14px", marginBottom:"10px", display:"flex", gap:"8px" }}><span>🤔</span><span style={{ fontSize:"13px", fontWeight:700, color:"#FF3B30" }}>Actually, that statement is wrong.</span></div>}
        {answered && <MisconceptionDetails m={m} />}
      </div>
    </div>
  );
}

function SectionCheckpoint({ misconception, onPass }) {
  const [answered, setAnswered] = useState(null);
  if (answered==="correct") return (
    <div className="ntv-pop" style={{ background:"linear-gradient(135deg,#F0FFF4,#E8F9EE)", borderRadius:"16px", padding:"20px 24px", border:"2px solid #34C759", display:"flex", gap:"14px", alignItems:"center" }}>
      <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:"#34C759", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><span style={{ fontSize:"18px" }}>✓</span></div>
      <div><p style={{ fontSize:"14px", fontWeight:700, color:"#34C759", margin:"0 0 2px" }}>Knowledge check passed!</p><p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>Worked examples unlocked.</p></div>
    </div>
  );
  return (
    <div style={{ background:"linear-gradient(135deg,#FFFBEB,#FFF7E6)", borderRadius:"18px", padding:"24px", border:"2px solid #FF9F0A" }}>
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px" }}>
        <span style={{ fontSize:"20px" }}>🔒</span>
        <div><p style={{ fontSize:"13px", fontWeight:700, color:"#FF9F0A", margin:0 }}>Quick Knowledge Check</p><p style={{ fontSize:"12px", color:"#86868B", margin:0 }}>Answer correctly to unlock worked examples</p></div>
      </div>
      <p style={{ fontSize:"14px", fontWeight:600, color:"#1D1D1F", marginBottom:"12px" }}>Is this statement correct?</p>
      <div style={{ background:"#FFFFFF", borderRadius:"10px", padding:"14px 18px", marginBottom:"14px", border:"1px solid #FDE68A" }}>
        <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.6, margin:0, fontStyle:"italic" }}>"{misconception.wrong_idea}"</p>
      </div>
      {!answered && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
          <button onClick={() => setAnswered("wrong")} className="ntv-btn"
            style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#34C759" }}>✓ Yes, correct</button>
          <button onClick={() => { setAnswered("correct"); setTimeout(onPass,900); }} className="ntv-btn"
            style={{ padding:"12px", borderRadius:"10px", border:"2px solid #E5E5EA", background:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", color:"#FF3B30" }}>✗ No, it's wrong</button>
        </div>
      )}
      {answered==="wrong" && (
        <div className="ntv-pop" style={{ background:"#FFF5F0", borderRadius:"10px", padding:"12px 16px", border:"1px solid #FFD5A0" }}>
          <p style={{ fontSize:"13px", fontWeight:700, color:"#FF9500", marginBottom:"6px" }}>Not quite! Review "In Plain English" above.</p>
          <button onClick={() => setAnswered(null)} className="ntv-btn"
            style={{ background:"#FF9500", color:"#fff", border:"none", borderRadius:"8px", padding:"8px 18px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

/* ── Aha reveal card ────────────────────────────────────────────────────── */
function AhaRevealCard({ text }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#1C1C1E 0%,#2C1D3E 100%)", borderRadius:"20px", padding:"32px 36px", borderLeft:"5px solid #BF5AF2" }}>
      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#BF5AF2", marginBottom:"14px" }}>🔑 The Aha Moment</p>
      <p style={{ fontSize:"16px", color:"#FFFFFF", lineHeight:1.8, margin:0 }}>{text}</p>
    </div>
  );
}

/* ── Visual description toggle (under each diagram) ─────────────────────── */
function VisualDescToggle({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop:"12px", borderTop:"1px solid #F2F2F7", paddingTop:"8px" }}>
      <button onClick={() => setOpen(o=>!o)} className="ntv-btn"
        style={{ background:"none", border:"none", cursor:"pointer", fontSize:"11px", color:"#AEAEB2", padding:0, display:"flex", alignItems:"center", gap:"4px" }}>
        📝 Text description {open ? "▲" : "▼"}
      </button>
      {open && <p style={{ fontSize:"12px", color:"#86868B", lineHeight:1.7, marginTop:"8px", margin:"8px 0 0" }}>{text}</p>}
    </div>
  );
}

/* ── Video player ────────────────────────────────────────────────────────── */
function VideoPlayer({ hooks, diagrams }) {
  const moments  = hooks?.visual_moments || [];
  const totalSec = hooks?.video_target_length_seconds || 240;

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [idx,     setIdx]     = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [voice,   setVoice]   = useState(false);

  const voiceRef      = useRef(false);
  voiceRef.current    = voice;
  const lastSpokenRef = useRef(-1);

  const cur      = moments[idx] ?? null;
  const hasVoice = typeof window !== "undefined" && "speechSynthesis" in window;

  const getSvg = useCallback((m) => {
    const hit = m?.what_happens_on_screen?.match(/\(([a-z0-9_]+)\)/i);
    return hit ? (diagrams || []).find(d => d.id === hit[1]) ?? null : null;
  }, [diagrams]);

  const curSvg = cur ? getSvg(cur) : null;

  const speak = useCallback((text) => {
    if (!voiceRef.current || !hasVoice) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92; u.pitch = 1;
    window.speechSynthesis.speak(u);
  }, [hasVoice]);

  // Auto-advance slides based on timestamp gaps
  useEffect(() => {
    if (!playing || !moments.length) return;
    if (idx >= moments.length - 1) {
      const remaining = Math.max(2, totalSec - (cur?.timestamp_seconds ?? 0));
      const t = setTimeout(() => setPlaying(false), remaining * 1000);
      return () => clearTimeout(t);
    }
    const gap = Math.max(1, (moments[idx + 1]?.timestamp_seconds ?? 0) - (cur?.timestamp_seconds ?? 0));
    const t = setTimeout(() => setIdx(i => i + 1), gap * 1000);
    return () => clearTimeout(t);
  }, [playing, idx]);

  // Real-time elapsed ticker
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setElapsed(e => Math.min(e + 1, totalSec)), 1000);
    return () => clearInterval(iv);
  }, [playing]);

  // Speak & sync elapsed when slide changes
  useEffect(() => {
    if (lastSpokenRef.current === idx) return;
    lastSpokenRef.current = idx;
    if (cur) { speak(cur.narration); setElapsed(cur.timestamp_seconds); }
  }, [idx, cur, speak]);

  // Cancel speech when voice toggled off
  useEffect(() => { if (!voice) window.speechSynthesis?.cancel(); }, [voice]);

  // Cleanup on unmount
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const play  = () => { setStarted(true); setPlaying(true); };
  const pause = () => { setPlaying(false); window.speechSynthesis?.cancel(); };
  const seek  = (newIdx) => {
    window.speechSynthesis?.cancel();
    lastSpokenRef.current = -1;
    setIdx(Math.max(0, Math.min(newIdx, moments.length - 1)));
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct = totalSec > 0 ? Math.round((elapsed / totalSec) * 100) : 0;

  if (!moments.length) return null;

  /* ── Cover screen (before play) ── */
  if (!started) return (
    <div style={{ background:"linear-gradient(135deg,#1C1C1E 0%,#2C2C2E 100%)", borderRadius:"20px", overflow:"hidden" }}>
      <div style={{ padding:"32px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px" }}>
          <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>
            📽️ Story · {moments.length} scenes · {fmt(totalSec)}
          </span>
          {hasVoice && (
            <button onClick={() => setVoice(v=>!v)} className="ntv-btn"
              style={{ padding:"5px 12px", borderRadius:"20px",
                border:`1px solid ${voice?"#34C759":"rgba(255,255,255,0.2)"}`,
                background: voice?"rgba(52,199,89,0.12)":"transparent",
                color: voice?"#34C759":"rgba(255,255,255,0.45)",
                fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
              🎙️ {voice ? "Voice on" : "Voice off"}
            </button>
          )}
        </div>
        {hooks.opening_hook_5_sec && (
          <div style={{ borderLeft:"3px solid #BF5AF2", paddingLeft:"16px", marginBottom:"28px" }}>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.8)", lineHeight:1.7, margin:0, fontStyle:"italic" }}>
              "{hooks.opening_hook_5_sec}"
            </p>
          </div>
        )}
        <button onClick={play} className="ntv-btn"
          style={{ display:"inline-flex", alignItems:"center", gap:"10px",
            background:"#FFFFFF", color:"#1C1C1E", border:"none", borderRadius:"50px",
            padding:"14px 32px", fontSize:"15px", fontWeight:800, cursor:"pointer",
            boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          ▶ Play Story
        </button>
      </div>
    </div>
  );

  /* ── Player ── */
  return (
    <div style={{ background:"#1C1C1E", borderRadius:"20px", overflow:"hidden" }}>
      {/* Progress bar */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", fontWeight:700, flexShrink:0 }}>
          {idx+1}/{moments.length}
        </span>
        <div style={{ flex:1, height:"3px", background:"rgba(255,255,255,0.08)", borderRadius:"2px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"#BF5AF2", transition:"width 0.8s linear" }} />
        </div>
        <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", fontVariantNumeric:"tabular-nums", flexShrink:0 }}>
          {fmt(elapsed)} / {fmt(totalSec)}
        </span>
        {hasVoice && (
          <button onClick={() => setVoice(v=>!v)} className="ntv-btn"
            style={{ padding:"3px 10px", borderRadius:"20px",
              border:`1px solid ${voice?"#34C759":"rgba(255,255,255,0.15)"}`,
              background: voice?"rgba(52,199,89,0.12)":"transparent",
              color: voice?"#34C759":"rgba(255,255,255,0.3)", fontSize:"11px", cursor:"pointer" }}>
            🎙️
          </button>
        )}
      </div>

      {/* Diagram panel */}
      {curSvg ? (
        <div key={curSvg.id} className="ntv-in"
          style={{ background:"#FFFFFF", padding:"20px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#AEAEB2", letterSpacing:"1.5px", textTransform:"uppercase", margin:"0 0 10px" }}>
            {curSvg.title}
          </p>
          <div style={{ lineHeight:0 }} dangerouslySetInnerHTML={{ __html: sanitizeSvg(curSvg.svg) }} />
        </div>
      ) : (
        <div style={{ minHeight:"56px", display:"flex", alignItems:"center", padding:"14px 24px",
          borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.18)", fontStyle:"italic", lineHeight:1.4 }}>
            {cur?.what_happens_on_screen?.slice(0, 100) || ""}…
          </span>
        </div>
      )}

      {/* Narration text */}
      <div style={{ padding:"24px 28px 12px" }}>
        <p key={idx} className="ntv-in"
          style={{ fontSize:"16px", color:"#FFFFFF", lineHeight:1.8, margin:0, fontWeight:500 }}>
          {cur?.narration}
        </p>
      </div>

      {/* Slide dots */}
      <div style={{ display:"flex", gap:"5px", padding:"10px 28px 14px", flexWrap:"wrap" }}>
        {moments.map((_, i) => (
          <div key={i} onClick={() => seek(i)}
            style={{ height:"4px", borderRadius:"2px", cursor:"pointer", transition:"all 0.2s",
              width: i===idx ? "20px" : "7px",
              background: i < idx ? "#BF5AF2" : i===idx ? "#FFFFFF" : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:"8px", padding:"10px 16px 18px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => seek(idx-1)} disabled={idx===0} className="ntv-btn"
          style={{ padding:"10px 16px", borderRadius:"10px",
            border:"1px solid rgba(255,255,255,0.12)", background:"transparent",
            color: idx===0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.7)",
            fontSize:"13px", fontWeight:600, cursor: idx===0 ? "default" : "pointer" }}>
          ← Prev
        </button>
        <button onClick={playing ? pause : play} className="ntv-btn"
          style={{ flex:1, padding:"11px", borderRadius:"10px", border:"none",
            background: playing ? "rgba(255,59,48,0.12)" : "#FFFFFF",
            color: playing ? "#FF3B30" : "#1C1C1E",
            fontSize:"14px", fontWeight:800, cursor:"pointer" }}>
          {playing ? "⏸ Pause" : "▶ Continue"}
        </button>
        <button onClick={() => seek(idx+1)} disabled={idx===moments.length-1} className="ntv-btn"
          style={{ padding:"10px 16px", borderRadius:"10px",
            border:"1px solid rgba(255,255,255,0.12)", background:"transparent",
            color: idx===moments.length-1 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.7)",
            fontSize:"13px", fontWeight:600, cursor: idx===moments.length-1 ? "default" : "pointer" }}>
          Next →
        </button>
      </div>
    </div>
  );
}

/* ── Closing challenge ───────────────────────────────────────────────────── */
function ClosingChallenge({ question, hint }) {
  const [shown, setShown] = useState(false);
  if (!question) return null;
  return (
    <div style={{ background:"linear-gradient(135deg,#FFFBEB,#FFF7E6)", borderRadius:"18px", padding:"24px 28px", border:"2px solid #FF9F0A" }}>
      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#FF9F0A", marginBottom:"12px" }}>⚡ Challenge Before You Go</p>
      <p style={{ fontSize:"15px", fontWeight:600, color:"#1D1D1F", lineHeight:1.6, margin:"0 0 16px" }}>{question}</p>
      {!shown ? (
        <button onClick={() => setShown(true)} className="ntv-btn"
          style={{ padding:"10px 22px", borderRadius:"10px", border:"2px solid #FF9F0A", background:"transparent",
            color:"#FF9F0A", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
          Show hint
        </button>
      ) : hint ? (
        <div className="ntv-pop" style={{ background:"#FFFFFF", borderRadius:"10px", padding:"12px 16px", border:"1px solid #FDE68A" }}>
          <p style={{ fontSize:"13px", color:"#3A3A3C", lineHeight:1.6, margin:0 }}>{hint}</p>
        </div>
      ) : null}
    </div>
  );
}

/* ── Topic nav bar ───────────────────────────────────────────────────────── */
function TopicNavBar({ prev, next, studied, onToggle, onNavigate }) {
  const truncate = (name) => {
    const words = name.split(" ");
    return words.length > 5 ? words.slice(0,5).join(" ") + "…" : name;
  };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
      <button onClick={() => prev && onNavigate(prev.topicId)} disabled={!prev} className="ntv-btn"
        style={{ padding:"8px 14px", borderRadius:"10px", border:"1px solid #E5E5EA",
          background: prev?"#fff":"#F5F5F7", color: prev?"#1D1D1F":"#AEAEB2",
          fontSize:"12px", fontWeight:600, cursor: prev?"pointer":"default", maxWidth:"180px",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        ‹ {prev ? truncate(prev.name) : "First topic"}
      </button>
      <div style={{ flex:1 }} />
      <button onClick={onToggle} className="ntv-btn"
        style={{ padding:"8px 18px", borderRadius:"10px",
          border:`2px solid ${studied?"#34C759":"#E5E5EA"}`,
          background: studied?"#F0FFF4":"#fff", color: studied?"#34C759":"#86868B",
          fontSize:"13px", fontWeight:700, cursor:"pointer", flexShrink:0 }}>
        {studied ? "✓ Studied" : "Mark as studied"}
      </button>
      <div style={{ flex:1 }} />
      <button onClick={() => next && onNavigate(next.topicId)} disabled={!next} className="ntv-btn"
        style={{ padding:"8px 14px", borderRadius:"10px", border:"1px solid #E5E5EA",
          background: next?"#fff":"#F5F5F7", color: next?"#1D1D1F":"#AEAEB2",
          fontSize:"12px", fontWeight:600, cursor: next?"pointer":"default", maxWidth:"180px",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {next ? truncate(next.name) : "Last topic"} ›
      </button>
    </div>
  );
}

function DerivationPart({ label, val }) {
  if (!val) return null;
  if (typeof val==="string") return (
    <div><p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#86868B", marginBottom:"6px" }}>{label}</p><p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7 }}>{val}</p></div>
  );
  return (
    <div style={{ background:"#F5F5F7", borderRadius:"12px", padding:"16px 20px" }}>
      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#86868B", marginBottom:"12px" }}>{label}</p>
      {val.claim       && <div style={{ marginBottom:"10px" }}><p style={{ fontSize:"12px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>Claim</p><p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7, fontStyle:"italic" }}>{val.claim}</p></div>}
      {val.proof_walkthrough && <div style={{ marginBottom:"10px" }}><p style={{ fontSize:"12px", fontWeight:700, color:"#86868B", marginBottom:"4px" }}>Proof</p><p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7 }}>{val.proof_walkthrough}</p></div>}
      {val.concrete_example  && <div style={{ background:"#EEF4FF", borderRadius:"8px", padding:"10px 14px", marginBottom:"10px" }}><p style={{ fontSize:"12px", fontWeight:700, color:"#007AFF", marginBottom:"4px" }}>Concrete Example</p><p style={{ fontSize:"13px", ...S.mono, color:"#1D1D1F", lineHeight:1.6 }}>{val.concrete_example}</p></div>}
      {val.key_insight  && <div style={{ borderLeft:"3px solid #007AFF", paddingLeft:"12px", marginBottom:"8px" }}><p style={{ fontSize:"13px", fontWeight:700, color:"#007AFF", margin:0 }}>{val.key_insight}</p></div>}
      {val.why_this_matters && <p style={{ fontSize:"13px", color:"#86868B", fontStyle:"italic", margin:0 }}>{val.why_this_matters}</p>}
    </div>
  );
}

/* ── Topic Note + AI evaluator ──────────────────────────────────────────── */
function TopicNote({ topicId, topicName }) {
  const [text,      setText]      = useState("");
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [feedback,  setFeedback]  = useState(null);  // AI evaluation result
  const [evaling,   setEvaling]   = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!topicId) return;
    getNcertNote(topicId)
      .then(r => setText(r.data?.data?.text || ""))
      .catch(() => {});
  }, [topicId]);

  const handleChange = (e) => {
    setText(e.target.value);
    setSaved(false);
    setFeedback(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSaving(true);
      saveNcertNote(topicId, e.target.value)
        .then(() => { setSaved(true); setSaving(false); })
        .catch(() => setSaving(false));
    }, 1500);
  };

  const handleEvaluate = async () => {
    if (!text.trim() || evaling) return;
    setEvaling(true); setFeedback(null);
    try {
      const r = await evaluateExplanation(topicName, text);
      setFeedback(r.data?.data || r.data);
    } catch { setFeedback({ error: true }); }
    finally { setEvaling(false); }
  };

  const score = feedback?.score ?? null;
  const scoreColor = score >= 80 ? "#34C759" : score >= 50 ? "#FF9500" : "#FF3B30";

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", padding:"24px 28px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
        <div>
          <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1D1D1F", margin:0 }}>📝 My Notes</h2>
          <p style={{ fontSize:"12px", color:"#AEAEB2", margin:"3px 0 0" }}>
            Write your own explanation — AI will grade it
          </p>
        </div>
        <span style={{ fontSize:"11px", color: saving?"#FF9500":saved?"#34C759":"#AEAEB2", fontWeight:600 }}>
          {saving ? "Saving…" : saved ? "Saved ✓" : ""}
        </span>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder={`Explain "${topicName}" in your own words…`}
        style={{ width:"100%", minHeight:"120px", padding:"12px 14px", borderRadius:"12px",
          border:"1.5px solid #E5E5EA", fontSize:"14px", lineHeight:1.6, color:"#1D1D1F",
          background:"#FAFAFA", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box",
          outline:"none" }}
        onFocus={e => e.target.style.borderColor = "#007AFF"}
        onBlur={e => e.target.style.borderColor = "#E5E5EA"}
      />

      <button onClick={handleEvaluate} disabled={!text.trim() || evaling} className="ntv-btn"
        style={{ marginTop:"10px", width:"100%", padding:"11px", borderRadius:"11px", border:"none",
          background: text.trim() ? "#5856D6" : "#F2F2F7",
          color: text.trim() ? "#fff" : "#AEAEB2",
          fontWeight:700, fontSize:"13px", cursor: text.trim()?"pointer":"default" }}>
        {evaling ? "Evaluating…" : "Evaluate with AI →"}
      </button>

      {feedback && !feedback.error && (
        <div style={{ marginTop:"14px", background:"#F9F9FF", borderRadius:"14px", padding:"16px 18px",
          border:`1.5px solid ${scoreColor}33` }}>
          {score !== null && (
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
              <span style={{ fontSize:"24px", fontWeight:800, color:scoreColor }}>{score}</span>
              <span style={{ fontSize:"12px", color:"#86868B" }}>/ 100</span>
              <div style={{ flex:1, height:"6px", background:"#E5E5EA", borderRadius:"3px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${score}%`, background:scoreColor, borderRadius:"3px", transition:"width 0.5s ease" }} />
              </div>
            </div>
          )}
          {feedback.feedback && (
            <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.7, margin:0 }}>{feedback.feedback}</p>
          )}
          {feedback.missing?.length > 0 && (
            <div style={{ marginTop:"10px" }}>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#FF9500", margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Could add:</p>
              <ul style={{ margin:0, paddingLeft:"16px" }}>
                {feedback.missing.map((m, i) => (
                  <li key={i} style={{ fontSize:"12px", color:"#3A3A3C", lineHeight:1.6 }}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {feedback?.error && (
        <p style={{ fontSize:"12px", color:"#FF3B30", marginTop:"8px", textAlign:"center" }}>
          Evaluation failed — try again.
        </p>
      )}
    </div>
  );
}

/* ── Mastery Practice widget ─────────────────────────────────────────────── */
function MasteryPractice({ topicId, topicName }) {
  const [mastery,   setMastery]   = useState(null);
  const [phase,     setPhase]     = useState("idle"); // idle | loading | question | revealed | error
  const [question,  setQuestion]  = useState(null);
  const [selected,  setSelected]  = useState(null);  // option index
  const [result,    setResult]    = useState(null);
  const [errMsg,    setErrMsg]    = useState(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!topicId) return;
    getTopicMastery(topicId).then(r => setMastery(r.data)).catch(() => {});
  }, [topicId]);

  // startTopic uses topic NAME (adaptiveService queries by Question.topic field)
  const loadQuestion = async (preloaded) => {
    if (preloaded?.questionText) {
      setQuestion(preloaded); setSelected(null); setResult(null); setErrMsg(null);
      startRef.current = Date.now(); setPhase("question"); return;
    }
    setPhase("loading"); setQuestion(null); setSelected(null); setResult(null); setErrMsg(null);
    try {
      const r = await startTopic(topicName);
      // startTopic returns question directly as r.data (no wrapper object)
      const q = r.data?.questionText ? r.data
              : r.data?.question?.questionText ? r.data.question  // foundation redirect shape
              : null;
      if (!q) { setPhase("error"); setErrMsg("No questions available for this topic yet."); return; }
      setQuestion(q);
      startRef.current = Date.now();
      setPhase("question");
    } catch (e) {
      const msg = e?.response?.data?.error || "No questions available for this topic yet.";
      setErrMsg(msg); setPhase("error");
    }
  };

  const handlePick = async (idx) => {
    if (phase !== "question" || selected !== null) return;
    setSelected(idx);
    const timeTaken = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    try {
      // submitAnswer needs no sessionId — session is keyed by userId in Redis
      const r = await submitAnswer({ selectedOptionIndex: idx, timeTaken });
      const res = r.data;
      setResult(res);
      setPhase("revealed");
      // record to adaptive recommender only if question has a fine-grained questionId
      if (topicId && question?.questionId) {
        recordAdaptiveAttempt({
          topicId, questionId: question.questionId,
          correct: !!res?.isCorrect, timeSec: timeTaken, selectedOptionIndex: idx,
        }).then(() => getTopicMastery(topicId).then(m => setMastery(m.data)).catch(() => {}))
          .catch(() => {});
      }
    } catch { setPhase("revealed"); }
  };

  const DIFF_COLOR = { easy:"#34C759", medium:"#FF9500", hard:"#FF3B30" };
  const mastered  = mastery?.mastery ?? { easy:false, medium:false, hard:false };
  const cur       = mastery?.currentDifficulty ?? "easy";
  const attempts  = mastery?.totalAttempts ?? 0;
  const explanation = result?.aiExplanation || result?.doubtInsight || null;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(135deg,#007AFF 0%,#5856D6 100%)", padding:"20px 24px" }}>
        <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1px", color:"rgba(255,255,255,0.7)", marginBottom:"6px" }}>ADAPTIVE PRACTICE</p>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          {["easy","medium","hard"].map(d => (
            <div key={d} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
              <span style={{ width:"10px", height:"10px", borderRadius:"50%",
                background: mastered[d] ? "#34C759" : d===cur ? DIFF_COLOR[d] : "rgba(255,255,255,0.25)",
                border: !mastered[d] && d!==cur ? "1.5px solid rgba(255,255,255,0.4)" : "none",
                flexShrink:0 }} />
              <span style={{ fontSize:"11px", color: mastered[d]||d===cur ? "#fff" : "rgba(255,255,255,0.5)", fontWeight:600, textTransform:"capitalize" }}>{d}</span>
            </div>
          ))}
          {attempts > 0 && <span style={{ marginLeft:"auto", fontSize:"11px", color:"rgba(255,255,255,0.6)" }}>{attempts} attempt{attempts!==1?"s":""}</span>}
        </div>
      </div>

      <div style={{ padding:"20px 24px" }}>
        {(mastered.easy && mastered.medium && mastered.hard) ? (
          <p style={{ fontSize:"14px", fontWeight:700, color:"#34C759", textAlign:"center", margin:0 }}>
            ✓ Topic fully mastered — all difficulties cleared!
          </p>
        ) : phase === "idle" ? (
          <button onClick={() => loadQuestion(null)} className="ntv-btn"
            style={{ width:"100%", background:DIFF_COLOR[cur]||"#007AFF", color:"#fff", fontWeight:800,
              fontSize:"14px", padding:"13px", borderRadius:"12px", border:"none", cursor:"pointer" }}>
            Try a {cur} question →
          </button>
        ) : phase === "loading" ? (
          <div style={{ textAlign:"center", color:"#AEAEB2", padding:"8px 0" }}>Loading question…</div>
        ) : phase === "error" ? (
          <p style={{ fontSize:"13px", color:"#FF3B30", textAlign:"center", margin:0 }}>{errMsg}</p>
        ) : question ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <p style={{ fontSize:"14px", fontWeight:600, color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{question.questionText}</p>
            {!(question.options?.length) && phase === "question" && (
              <button onClick={() => loadQuestion(null)} className="ntv-btn"
                style={{ background:"#F5F5F7", color:"#AEAEB2", fontWeight:700, fontSize:"13px",
                  padding:"10px", borderRadius:"10px", border:"1.5px solid #E5E5EA", cursor:"pointer" }}>
                Skip →
              </button>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {(question.options||[]).map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect  = result?.correctOptionIndex === i;
                const isWrong    = phase==="revealed" && isSelected && !result?.isCorrect;
                const bg     = phase==="revealed" ? (isCorrect ? "#F0FFF4" : isWrong ? "#FFF5F5" : "#FAFAFA") : isSelected ? "#EEF4FF" : "#F5F5F7";
                const border = phase==="revealed" ? (isCorrect ? "#34C759" : isWrong ? "#FF3B30" : "#E5E5EA") : isSelected ? "#007AFF" : "#E5E5EA";
                return (
                  <button key={i} onClick={() => handlePick(i)} disabled={phase==="revealed"}
                    className="ntv-btn"
                    style={{ textAlign:"left", padding:"10px 14px", borderRadius:"10px", border:`1.5px solid ${border}`,
                      background:bg, fontSize:"13px", color:"#1D1D1F", cursor:phase==="revealed"?"default":"pointer" }}>
                    <span style={{ fontWeight:700, marginRight:"8px", color:"#AEAEB2" }}>{String.fromCharCode(65+i)}.</span>
                    {opt.text}
                    {phase==="revealed" && isCorrect && <span style={{ float:"right", color:"#34C759", fontWeight:700 }}>✓</span>}
                    {phase==="revealed" && isWrong   && <span style={{ float:"right", color:"#FF3B30", fontWeight:700 }}>✗</span>}
                  </button>
                );
              })}
            </div>
            {phase==="revealed" && (
              <div style={{ background:result?.isCorrect?"#F0FFF4":"#FFF5F5", borderRadius:"10px", padding:"10px 14px",
                borderLeft:`3px solid ${result?.isCorrect?"#34C759":"#FF3B30"}` }}>
                <p style={{ fontSize:"13px", fontWeight:700, color:result?.isCorrect?"#34C759":"#FF3B30", margin:"0 0 4px" }}>
                  {result?.isCorrect ? "Correct!" : "Not quite"}
                </p>
                {explanation && <p style={{ fontSize:"12px", color:"#3A3A3C", lineHeight:1.6, margin:0 }}>{explanation}</p>}
              </div>
            )}
            {phase==="revealed" && (
              <button onClick={() => loadQuestion(result?.nextQuestion || null)} className="ntv-btn"
                style={{ background:"#F5F5F7", color:"#1D1D1F", fontWeight:700, fontSize:"13px",
                  padding:"10px", borderRadius:"10px", border:"none", cursor:"pointer" }}>
                Next question →
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ── Paper Practice widget ───────────────────────────────────────────────── */
const DIFF_PILL = { easy: { bg:"#E8F9EE", color:"#34C759" }, medium: { bg:"#FFF4E0", color:"#FF9500" }, hard: { bg:"#FFE5E5", color:"#FF3B30" } };
const TYPE_LABEL = { free_text:"Written", numeric:"Numeric", numeric_range:"Numeric range", fill_blank:"Fill in the blank" };

function PaperPracticeCard({ q, index }) {
  const [revealed, setRevealed] = useState(false);
  const [mark, setMark]         = useState(null); // "got" | "retry"
  const diff = DIFF_PILL[q.difficulty] || DIFF_PILL.medium;
  const steps = q.stepByStep?.length ? q.stepByStep.map(s => s.clean).filter(Boolean)
              : q.solutionSteps?.length ? q.solutionSteps
              : q.correctAnswer ? [q.correctAnswer] : [];

  return (
    <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E5E5EA", overflow:"hidden", marginBottom:"10px",
      opacity: mark === "got" ? 0.6 : 1, transition:"opacity 0.2s" }}>
      {/* Question */}
      <div style={{ padding:"16px 20px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
          <span style={{ fontSize:"11px", fontFamily:"ui-monospace,monospace", color:"#86868B", marginTop:"2px", flexShrink:0, minWidth:"22px" }}>
            Q{index+1}
          </span>
          <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.65, flex:1, margin:0 }}>{q.questionText}</p>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"10px", marginLeft:"32px" }}>
          <span style={{ fontSize:"11px", fontWeight:600, padding:"2px 10px", borderRadius:"20px", background:diff.bg, color:diff.color }}>{q.difficulty}</span>
          {q.marks && <span style={{ fontSize:"11px", color:"#86868B", padding:"2px 8px", background:"#F5F5F7", borderRadius:"20px" }}>{q.marks} mark{q.marks>1?"s":""}</span>}
          <span style={{ fontSize:"11px", color:"#86868B", padding:"2px 8px", background:"#F5F5F7", borderRadius:"20px" }}>{TYPE_LABEL[q.questionType] || q.questionType}</span>
          {q.expectedTime && <span style={{ fontSize:"11px", color:"#86868B", padding:"2px 8px", background:"#F5F5F7", borderRadius:"20px" }}>~{q.expectedTime}s</span>}
        </div>
      </div>

      {/* Show answer toggle */}
      <button onClick={() => setRevealed(r => !r)}
        style={{ width:"100%", padding:"10px 20px", borderTop:"1px solid #F5F5F7", background: revealed ? "#F5F5F7":"transparent",
          display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", border:"none", borderTop:"1px solid #F5F5F7" }}>
        <span style={{ fontSize:"12px", fontWeight:600, color:"#007AFF" }}>{revealed ? "Hide Answer" : "Show Answer"}</span>
        <span style={{ color:"#007AFF", fontSize:"14px", transform: revealed ? "rotate(90deg)":"rotate(0deg)", transition:"transform 0.15s" }}>›</span>
      </button>

      {revealed && (
        <div style={{ padding:"14px 20px 16px", background:"#F9F9FB", borderTop:"1px solid #E5E5EA" }}>
          {steps.length ? (
            <ol style={{ margin:0, paddingLeft:"18px" }}>
              {steps.map((s,i) => (
                <li key={i} style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.7, marginBottom: i<steps.length-1?"6px":0 }}>{s}</li>
              ))}
            </ol>
          ) : (
            <p style={{ fontSize:"13px", color:"#86868B", margin:0 }}>No answer available.</p>
          )}
          {/* Mark as got it / try again */}
          <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
            <button onClick={() => setMark(m => m==="got" ? null : "got")}
              style={{ fontSize:"12px", fontWeight:600, padding:"5px 14px", borderRadius:"20px", border:"none", cursor:"pointer",
                background: mark==="got" ? "#34C759":"#E8F9EE", color: mark==="got" ? "#fff":"#34C759" }}>
              ✓ Got it
            </button>
            <button onClick={() => setMark(m => m==="retry" ? null : "retry")}
              style={{ fontSize:"12px", fontWeight:600, padding:"5px 14px", borderRadius:"20px", border:"none", cursor:"pointer",
                background: mark==="retry" ? "#FF9500":"#FFF4E0", color: mark==="retry" ? "#fff":"#FF9500" }}>
              ↻ Need more practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaperPractice({ topicId }) {
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [open,      setOpen]      = useState(false);

  useEffect(() => {
    if (!topicId) return;
    getPaperQuestions(topicId)
      .then(r => setQuestions(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [topicId]);

  if (!loading && !questions.length) return null;

  return (
    <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:0 }}>
        <div style={{ background:"linear-gradient(135deg,#FF6B35 0%,#FF9500 100%)", padding:"20px 24px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1px", color:"rgba(255,255,255,0.7)", marginBottom:"4px" }}>PAPER PRACTICE</p>
            <p style={{ fontSize:"14px", fontWeight:700, color:"#fff", margin:0 }}>
              {loading ? "Loading…" : `${questions.length} written question${questions.length!==1?"s":""} — attempt on paper`}
            </p>
          </div>
          <span style={{ fontSize:"20px", color:"rgba(255,255,255,0.8)", transform: open?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.2s" }}>›</span>
        </div>
      </button>

      {open && (
        <div style={{ padding:"20px 24px" }}>
          <p style={{ fontSize:"12px", color:"#86868B", marginBottom:"14px", lineHeight:1.5 }}>
            These are written/numeric questions — solve on paper, then tap <strong>Show Answer</strong> to check.
          </p>
          {questions.map((q, i) => <PaperPracticeCard key={q._id || i} q={q} index={i} />)}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function NcertTopicView() {
  const { topicId } = useParams();
  const navigate    = useNavigate();

  const [topic,      setTopic]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [mode,       setMode]       = useState("quick");
  const [cpPassed,   setCpPassed]   = useState(false);
  const [exDone,     setExDone]     = useState(new Set());
  // Deep-mode interactive state
  const [confidence, setConfidence] = useState({});
  const [recallRatings, setRecallRatings] = useState({});
  const [formulaState,  setFormulaState]  = useState({});
  const [errorDone,  setErrorDone]  = useState(false);
  const [siblings,     setSiblings]    = useState([]);
  const [allTopics,    setAllTopics]   = useState([]);
  const [chapterTitle, setChapterTitle] = useState(null);
  const [studied,      setStudied]    = useState(false);
  const [sessionSecs, setSessionSecs] = useState(0);

  useEffect(() => { injectCss(); }, []);

  useEffect(() => {
    getNcertTopicContent(topicId)
      .then(r => setTopic(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [topicId]);

  useEffect(() => {
    setCpPassed(false); setExDone(new Set());
    setConfidence({}); setRecallRatings({}); setErrorDone(false);
    setSessionSecs(0);
  }, [mode]);

  useEffect(() => {
    const iv = setInterval(() => setSessionSecs(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [mode]);

  // Fetch all NCERT topics + chapter list once to derive siblings, prereqMap, and chapter title
  useEffect(() => {
    if (!topic) return;
    listNcertTopics()
      .then(r => {
        const all = r.data?.data || [];
        setAllTopics(all);
        setSiblings(all.filter(t => t.chapterNumber === topic.chapterNumber));
      })
      .catch(() => {});
    // Chapter title (e.g. "Real Numbers") is what Question.topic uses for practice questions
    listNcertChapters()
      .then(r => {
        const chapters = r.data?.data || [];
        const ch = chapters.find(c => c.number === topic.chapterNumber);
        if (ch?.title) setChapterTitle(ch.title);
      })
      .catch(() => {});
  }, [topic]);

  // Load studied status from backend; fall back to localStorage if not authenticated
  useEffect(() => {
    getStudiedTopics()
      .then(r => setStudied((r.data?.data || []).includes(topicId)))
      .catch(() => {
        try {
          const stored = JSON.parse(localStorage.getItem("stellar_studied_topics") || "[]");
          setStudied(stored.includes(topicId));
        } catch { setStudied(false); }
      });
  }, [topicId]);

  const markExDone   = i => setExDone(p => new Set([...p, i]));
  const rateSection  = (key, val) => setConfidence(p => ({ ...p, [key]: val }));
  const rateRecall   = (i, val) => setRecallRatings(p => ({ ...p, [i]: val }));
  const answerFormula = (i, picked, correct) => setFormulaState(p => ({ ...p, [i]: { picked, correct } }));

  const toggleStudied = () => {
    const next = !studied;
    setStudied(next); // optimistic
    toggleNcertStudied(topicId)
      .then(r => setStudied(r.data?.data?.studied ?? next))
      .catch(() => {
        // backend unavailable — persist to localStorage as fallback
        try {
          const stored = JSON.parse(localStorage.getItem("stellar_studied_topics") || "[]");
          const updated = next ? [...new Set([...stored, topicId])] : stored.filter(id => id !== topicId);
          localStorage.setItem("stellar_studied_topics", JSON.stringify(updated));
        } catch { /* ignore */ }
      });
  };

  const currentIdx = siblings.findIndex(s => s.topicId === topicId);
  const prevTopic  = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextTopic  = currentIdx >= 0 && currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;
  // Map prerequisite names → topicIds so they can be linked
  const prereqMap  = Object.fromEntries(allTopics.map(t => [t.name, t.topicId]));

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"256px" }}>
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  if (!topic) return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-10 text-center">
        <p style={{ fontSize:"15px", fontWeight:600, color:"#1D1D1F", marginBottom:"8px" }}>Teaching content not found</p>
        <p style={{ fontSize:"13px", color:"#86868B", marginBottom:"12px" }}>
          Run <code style={{ ...S.mono, background:"#F5F5F7", padding:"2px 8px", borderRadius:"6px" }}>npm run import:ncert</code> in the backend folder.
        </p>
        <button onClick={() => navigate(-1)} className="btn-secondary text-[13px]">← Go Back</button>
      </div>
    </div>
  );

  const tc             = topic.teaching_content ?? {};
  const intuition      = tc.intuition ?? {};
  const derivation     = tc.derivation ?? {};
  const whenToUse      = tc.when_to_use_this_method ?? {};
  const videoHooks     = tc.video_script_hooks ?? {};
  const visualDescs    = Object.values(tc.visual_description ?? {});
  const examples       = Object.values(tc.worked_example ?? {});
  const misconceptions = tc.common_misconceptions ?? [];
  const cpMisconception = misconceptions[0];

  const showExamples = examples.length>0 && (mode==="quick" || cpPassed || !cpMisconception);
  const showLock     = mode==="deep" && !!cpMisconception && !cpPassed && examples.length>0;

  // Build recall cards from formulas + misconceptions
  const recallCards = [
    ...(topic.key_formulas||[]).map(f => ({
      question: `Complete the formula: ${(typeof f==="string"?f:JSON.stringify(f)).split(" ").slice(0,-1).join(" ")} ___`,
      answer:   typeof f==="string" ? f : JSON.stringify(f),
    })),
    ...misconceptions.slice(0,4).map(m => ({
      question: `True or False: "${m.wrong_idea}"`,
      answer:   `False. ${m.correction || "This is a common misconception."}`,
    })),
  ];

  // Error hunt: find first example that actually has steps with computation fields
  const ehExample = examples.find(ex => ex.steps?.some(s => s.computation)) ?? null;
  const ehSteps   = ehExample?.steps || [];
  const wrongIdx  = (() => {
    if (!ehSteps.length) return null;
    const later = ehSteps.findIndex((s, i) => i > 0 && s.computation);
    if (later !== -1) return later;
    const any = ehSteps.findIndex(s => s.computation);
    return any !== -1 ? any : null;
  })();
  const errorHuntExample = ehExample && wrongIdx != null ? {
    ...ehExample,
    steps: ehSteps.map((step, si) =>
      si === wrongIdx
        ? { ...step, _wrong_computation: step.computation.replace(/\d+/, n => String(parseInt(n)+1)) }
        : step
    ),
  } : null;
  const ehHint = misconceptions[1]?.correction || misconceptions[0]?.correction;

  // Sections for confidence summary
  const confidenceSections = [
    { key:"plain",   label:"In Plain English" },
    { key:"real",    label:"Real-World Examples" },
    { key:"central", label:"The Central Idea" },
  ];

  return (
    <div className="max-w-3xl mx-auto"
      style={{ fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", display:"flex", flexDirection:"column", gap:"16px", paddingBottom:"40px" }}>

      <button onClick={() => navigate(-1)}
        style={{ fontSize:"13px", color:"#86868B", display:"flex", alignItems:"center", gap:"4px", cursor:"pointer", background:"none", border:"none", padding:0, alignSelf:"flex-start" }}>
        ‹ Back
      </button>

      {/* ── TOPIC NAV (top) ────────────────────────────────────── */}
      {siblings.length > 1 && (
        <TopicNavBar prev={prevTopic} next={nextTopic} studied={studied}
          onToggle={toggleStudied} onNavigate={id => navigate(`/ncert/topics/${id}`)} />
      )}

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", padding:"32px 32px 28px" }}>
        <p style={{ fontSize:"11px", ...S.mono, color:"#AEAEB2", marginBottom:"8px" }}>{topicId}</p>
        <h1 style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-0.02em", color:"#1D1D1F", lineHeight:1.2, margin:"0 0 20px" }}>{topic.name}</h1>
        {tc.key_takeaway && (
          <div style={{ background:"linear-gradient(135deg,#007AFF,#5856D6)", borderRadius:"12px", padding:"14px 18px", marginBottom:"16px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.7)", marginBottom:"6px" }}>Key Takeaway</p>
            <p style={{ fontSize:"14px", color:"#FFFFFF", lineHeight:1.6, margin:0 }}>{tc.key_takeaway}</p>
          </div>
        )}
        {topic.prerequisite_knowledge?.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", alignItems:"center", marginBottom:"8px" }}>
            <span style={{ fontSize:"11px", color:"#AEAEB2", fontWeight:600 }}>NEEDS:</span>
            {topic.prerequisite_knowledge.map((p,i) => {
              const tid = prereqMap[p];
              return tid ? (
                <button key={i} onClick={() => navigate(`/ncert/topics/${tid}`)} className="ntv-btn"
                  style={{ fontSize:"12px", background:"#EEF4FF", color:"#007AFF", padding:"3px 10px",
                    borderRadius:"20px", fontWeight:600, border:"none", cursor:"pointer" }}>
                  {p} ↗
                </button>
              ) : (
                <span key={i} style={{ fontSize:"12px", background:"#F5F5F7", color:"#3A3A3C", padding:"3px 10px", borderRadius:"20px", fontWeight:500 }}>{p}</span>
              );
            })}
          </div>
        )}
        {topic.key_formulas?.length > 0 && (
          <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:"1px solid #F2F2F7", display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"20px" }}>🧩</span>
            <div>
              <p style={{ fontSize:"13px", fontWeight:700, color:"#5856D6", margin:"0 0 2px" }}>
                {topic.key_formulas.length} key formula{topic.key_formulas.length > 1 ? "s" : ""} — unlock via Formula Builder below
              </p>
              <p style={{ fontSize:"11px", color:"#AEAEB2", margin:0 }}>Complete the interactive quiz to reveal them ↓</p>
            </div>
          </div>
        )}
      </div>

      {/* ── MODE SELECTOR ─────────────────────────────────────── */}
      <ModeSelector mode={mode} onChange={setMode} />

      {/* ── SESSION TIMER ─────────────────────────────────────── */}
      {(() => {
        const target  = mode === "deep" ? 20 * 60 : 5 * 60;
        const pct     = Math.min(100, Math.round((sessionSecs / target) * 100));
        const done    = sessionSecs >= target;
        const fmt     = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
        return (
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"11px", fontWeight:700, color: done?"#34C759":"#AEAEB2", flexShrink:0, fontVariantNumeric:"tabular-nums" }}>
              ⏱ {fmt(sessionSecs)}
            </span>
            <div style={{ flex:1, height:"4px", background:"#F2F2F7", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, borderRadius:"2px", transition:"width 1s linear",
                background: done ? "#34C759" : mode==="deep" ? "#5856D6" : "#007AFF" }} />
            </div>
            <span style={{ fontSize:"11px", fontWeight:600, color:"#AEAEB2", flexShrink:0 }}>
              {done ? "✓ Done!" : (mode==="deep" ? "20:00" : "5:00")}
            </span>
          </div>
        );
      })()}

      {examples.length>0 && <ProgressBar done={exDone.size} total={examples.length} />}

      {/* ── HOOK ──────────────────────────────────────────────── */}
      {intuition.hook && <HookCard text={intuition.hook} />}

      {/* ── IN PLAIN ENGLISH ──────────────────────────────────── */}
      {intuition.elevator_pitch && (
        <>
          <PlainEnglishCard text={intuition.elevator_pitch} />
          {mode==="deep" && <ConfidencePing sectionKey="plain" value={confidence.plain} onRate={rateSection} />}
        </>
      )}

      {/* ── FEYNMAN CHALLENGE — deep only ─────────────────────── */}
      {mode==="deep" && intuition.elevator_pitch && (
        <FeynmanBox concept={intuition.elevator_pitch?.slice(0,80)} topicName={topic.name} />
      )}

      {/* ── REAL-WORLD ────────────────────────────────────────── */}
      {intuition.real_world_anchors?.length>0 && (
        <>
          <RealWorldCards anchors={intuition.real_world_anchors} />
          {mode==="deep" && <ConfidencePing sectionKey="real" value={confidence.real} onRate={rateSection} />}
        </>
      )}

      {/* ── CENTRAL IDEA ──────────────────────────────────────── */}
      {intuition.the_pivot_idea && (
        <>
          <CentralIdeaCard text={intuition.the_pivot_idea} />
          {mode==="deep" && <ConfidencePing sectionKey="central" value={confidence.central} onRate={rateSection} />}
        </>
      )}

      {/* ── AHA MOMENT — deep only ────────────────────────────── */}
      {mode==="deep" && videoHooks.aha_reveal_moment && (
        <AhaRevealCard text={videoHooks.aha_reveal_moment} />
      )}

      {/* ── DIAGRAMS — deep only ──────────────────────────────── */}
      {mode==="deep" && tc.svg_diagrams?.length>0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          {tc.svg_diagrams.map((d, di) => (
            <div key={d.id} style={{ background:"#fff", padding:"28px", borderRadius:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin:"0 0 12px", color:"#1D1D1F", fontWeight:700, fontSize:"16px" }}>{d.title}</h3>
              <div style={{ lineHeight:0 }} dangerouslySetInnerHTML={{ __html: sanitizeSvg(d.svg) }} />
              {visualDescs[di] && <VisualDescToggle text={visualDescs[di]} />}
            </div>
          ))}
        </div>
      )}

      {/* ── FORMULA BLANKS ────────────────────────────────────── */}
      {topic.key_formulas?.length>0 && (
        <FormulaBlanks formulas={topic.key_formulas} state={formulaState} onAnswer={answerFormula} />
      )}

      {/* ── CHECKPOINT — deep only ────────────────────────────── */}
      {mode==="deep" && cpMisconception && !cpPassed && (
        <SectionCheckpoint misconception={cpMisconception} onPass={() => setCpPassed(true)} />
      )}

      {/* ── ERROR HUNT — deep only ────────────────────────────── */}
      {mode==="deep" && errorHuntExample && wrongIdx!=null && (
        <ErrorHunt
          example={errorHuntExample}
          wrongStepIdx={wrongIdx}
          misconceptionHint={ehHint}
          onComplete={ok => setErrorDone(ok)}
        />
      )}

      {/* ── WORKED EXAMPLES ───────────────────────────────────── */}
      {showExamples && (
        <div style={{ background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", overflow:"hidden" }}>
          <div style={{ background:"linear-gradient(90deg,#FF9500,#FF6B00)", padding:"12px 28px", display:"flex", alignItems:"center", gap:"8px" }}>
            <span>📝</span>
            <span style={{ fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#FFFFFF" }}>Worked Examples</span>
            <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.8)" }}>{examples.length} example{examples.length!==1?"s":""}</span>
          </div>
          <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:"16px" }}>
            {examples.map((ex,i) => (
              <InteractiveWorkedExample key={i} ex={ex} index={i} onDone={markExDone} deepMode={mode==="deep"} />
            ))}
          </div>
        </div>
      )}

      {showLock && (
        <div style={{ background:"#F5F5F7", borderRadius:"14px", padding:"18px 24px", display:"flex", alignItems:"center", gap:"12px", opacity:0.6 }}>
          <span style={{ fontSize:"20px" }}>🔒</span>
          <p style={{ fontSize:"13px", color:"#86868B", margin:0 }}>{examples.length} example{examples.length!==1?"s":""} locked — answer the knowledge check above</p>
        </div>
      )}

      {/* ── RECALL CARDS — deep only ──────────────────────────── */}
      {mode==="deep" && recallCards.length>0 && (
        <RecallCards cards={recallCards} ratings={recallRatings} onRate={rateRecall} />
      )}

      {/* ── VIDEO PLAYER — deep only ──────────────────────────── */}
      {mode==="deep" && Object.keys(videoHooks).length>0 && (
        <VideoPlayer hooks={videoHooks} diagrams={tc.svg_diagrams} />
      )}

      {/* ── DERIVATION — deep only ────────────────────────────── */}
      {mode==="deep" && Object.keys(derivation).length>0 && (
        <Section title="🔬 How It Works">
          <div style={{ display:"flex", flexDirection:"column", gap:"16px", marginTop:"16px" }}>
            {Object.entries(derivation).map(([key,val],i) => (
              <DerivationPart key={i} label={key.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())} val={val} />
            ))}
          </div>
        </Section>
      )}

      {/* ── COMMON MISTAKES ───────────────────────────────────── */}
      {misconceptions.length>0 && (
        <Section title="⚠️ Common Mistakes" accent="#FF3B30" badge={`${misconceptions.length}`} defaultOpen={true}>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginTop:"16px" }}>
            {misconceptions.map((m,i) => mode==="deep"
              ? <MisconceptionChallenge key={i} m={m} index={i} />
              : <MisconceptionCard key={i} m={m} />
            )}
          </div>
        </Section>
      )}

      {/* ── DEEP-ONLY SECTIONS ────────────────────────────────── */}
      {mode==="deep" && (
        <>
          {tc.shortcuts_and_tricks?.length>0 && (
            <Section title="⚡ Shortcuts & Tricks" accent="#34C759" badge={`${tc.shortcuts_and_tricks.length}`}>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginTop:"16px" }}>
                {tc.shortcuts_and_tricks.map((s,i) => (
                  <div key={i} style={{ background:"#F0FFF4", border:"1px solid #C6F0D1", borderRadius:"12px", padding:"14px 18px" }}>
                    <p style={{ fontSize:"13px", fontWeight:700, color:"#34C759", marginBottom:"4px" }}>{s.shortcut}</p>
                    {s.rule && <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, marginBottom:"4px" }}>{s.rule}</p>}
                    {s.example && <p style={{ fontSize:"13px", ...S.mono, color:"#3A3A3C", marginBottom:"4px" }}>{s.example}</p>}
                    {s.when_to_use && <div style={{ display:"flex", gap:"6px", marginTop:"4px" }}><span>💡</span><p style={{ fontSize:"12px", color:"#007AFF", fontStyle:"italic", margin:0 }}>{s.when_to_use}</p></div>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {Object.keys(whenToUse).length>0 && (
            <Section title="🎯 When to Use This Method">
              <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginTop:"16px" }}>
                {Object.entries(whenToUse).map(([key, val], i) => {
                  const label   = key.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase());
                  const isAvoid = /instead|not_|neither|avoid/i.test(key);
                  const isDecision = /decision|question/i.test(key);
                  const isSpeed    = /speed|time|step|log/i.test(key);
                  const accent  = isAvoid ? "#FF9500" : isDecision ? "#007AFF" : isSpeed ? "#AF52DE" : "#34C759";
                  const bg      = isAvoid ? "#FFF5F0" : isDecision ? "#EEF4FF" : isSpeed ? "#F5F0FF" : "#F0FFF4";
                  const symbol  = isAvoid ? "✗" : "✓";

                  if (Array.isArray(val) && val.length > 0) return (
                    <div key={i}>
                      <p style={{ fontSize:"11px", fontWeight:700, color:accent, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"8px" }}>{label}</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                        {val.map((item, j) => (
                          <div key={j} style={{ display:"flex", gap:"10px", background:bg, borderRadius:"8px", padding:"9px 12px" }}>
                            <span style={{ color:accent, fontWeight:800, flexShrink:0, fontSize:"13px" }}>{symbol}</span>
                            <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>
                              {typeof item === "string" ? item : item.text || JSON.stringify(item)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                  if (typeof val === "string" && val) return (
                    <div key={i} style={{ background:bg, borderRadius:"10px", padding:"12px 16px" }}>
                      <p style={{ fontSize:"11px", fontWeight:700, color:accent, marginBottom:"6px", letterSpacing:"1px", textTransform:"uppercase" }}>{label}</p>
                      <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{val}</p>
                    </div>
                  );

                  return null;
                })}
              </div>
            </Section>
          )}

          {tc.edge_cases?.length>0 && (
            <Section title="🔍 Edge Cases" badge={`${tc.edge_cases.length}`}>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginTop:"16px" }}>
                {tc.edge_cases.map((e,i) => (
                  <div key={i} style={{ background:"#F5F5F7", borderRadius:"10px", padding:"12px 16px" }}>
                    <p style={{ fontSize:"13px", fontWeight:700, color:"#1D1D1F", marginBottom:"4px" }}>{e.case} <span style={{ color:"#007AFF" }}>→ {e.value}</span></p>
                    {e.reasoning && <p style={{ fontSize:"12px", color:"#86868B", lineHeight:1.6, margin:"0 0 4px" }}>{e.reasoning}</p>}
                    {e.where_it_appears && <p style={{ fontSize:"12px", color:"#007AFF", fontStyle:"italic", margin:0 }}>{e.where_it_appears}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {intuition.wrong_intuitions_to_replace?.length>0 && (
            <Section title="🧠 Wrong Intuitions to Replace">
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginTop:"16px" }}>
                {intuition.wrong_intuitions_to_replace.map((w,i) => (
                  <div key={i} style={{ display:"flex", gap:"10px", background:"#FFF5F5", borderRadius:"10px", padding:"10px 14px" }}>
                    <span style={{ fontWeight:800, color:"#FF3B30" }}>×</span>
                    <p style={{ fontSize:"13px", color:"#1D1D1F", lineHeight:1.6, margin:0 }}>{w}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {intuition.analogy_from_other_domain && (
            <Section title="🌉 Analogy from Another Domain">
              <div style={{ background:"#F5F0FF", borderRadius:"10px", padding:"16px 18px", marginTop:"16px", borderLeft:"3px solid #AF52DE" }}>
                <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.8, margin:0, fontStyle:"italic" }}>{intuition.analogy_from_other_domain}</p>
              </div>
            </Section>
          )}

          {intuition.historical_context && (
            <Section title="📜 Historical Context">
              <p style={{ fontSize:"13px", color:"#86868B", lineHeight:1.8, marginTop:"16px" }}>{intuition.historical_context}</p>
            </Section>
          )}

          {intuition.why_it_matters && (
            <Section title="🚀 Why This Matters">
              <p style={{ fontSize:"14px", color:"#1D1D1F", lineHeight:1.7, marginTop:"16px" }}>{intuition.why_it_matters}</p>
            </Section>
          )}

          {/* ── CONFIDENCE SUMMARY ──────────────────────────────── */}
          <ConfidenceSummary confidence={confidence} sections={confidenceSections} />
        </>
      )}

      {/* ── CLOSING CHALLENGE ─────────────────────────────────── */}
      {videoHooks.closing_question && (
        <ClosingChallenge question={videoHooks.closing_question} hint={videoHooks.transition_to_practice} />
      )}

      {/* ── TOPIC NAV (bottom) ────────────────────────────────── */}
      {siblings.length > 1 && (
        <TopicNavBar prev={prevTopic} next={nextTopic} studied={studied}
          onToggle={toggleStudied} onNavigate={id => navigate(`/ncert/topics/${id}`)} />
      )}

      {/* ── MY NOTES ──────────────────────────────────────────── */}
      <TopicNote topicId={topicId} topicName={topic.name} />

      {/* ── ADAPTIVE PRACTICE ─────────────────────────────────── */}
      {/* practiceTopicName uses the chapter title ("Real Numbers") which matches Question.topic in the DB */}
      <MasteryPractice topicId={topic.topicId} topicName={chapterTitle || topic.name} />

      {/* ── PAPER PRACTICE ────────────────────────────────────── */}
      <PaperPractice topicId={topic.topicId} />
    </div>
  );
}

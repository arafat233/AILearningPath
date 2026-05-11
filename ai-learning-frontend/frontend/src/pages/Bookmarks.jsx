import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBookmarks, toggleBookmark,
  bmGetReviews, bmRate, bmSetMastery, bmSetNote, bmGetDue, bmGetSmart,
  bmListCollections, bmCreateCollection, bmUpdateCollection, bmDeleteCollection,
  bmReorderCollections, bmAddMember, bmRemoveMember,
  bmShareCollection, bmUnshareCollection, bmExportUrl, bmAiSummary,
  bmListTopics, bmUpsertTopic, bmRemoveTopic,
  bmListSections, bmUpsertSection, bmRemoveSection,
  bmBulkRemove, bmBulkMastery,
} from "../services/api";

// localStorage migration helpers — read once, push to server, then ignore
function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

// ── Type derivation ─────────────────────────────────────────────────
function deriveType(q) {
  if (q.shortcut)                                                       return "TIP";
  if (q.isAIGenerated && q.conceptTested)                               return "CONCEPT";
  if (q.questionType === "assertion_reason")                            return "CONCEPT";
  if ((q.difficultyScore || 0) >= 0.68)                                 return "QUESTION";
  if (q.conceptTested?.match(/theorem|formula|law|rule|property/i))    return "CONCEPT";
  return "QUESTION";
}

const TYPE_CONFIG = {
  QUESTION: { gradient: "linear-gradient(90deg,#007AFF 0%,#5AC8FA 100%)", color: "#007AFF", lightBg: "#007AFF14", tag: "· got it wrong first time" },
  CONCEPT:  { gradient: "linear-gradient(90deg,#FF9500 0%,#FFCC02 100%)", color: "#FF9500", lightBg: "#FF950014", tag: "· concept to master" },
  TIP:      { gradient: "linear-gradient(90deg,#34C759 0%,#30D158 100%)", color: "#34C759", lightBg: "#34C75914", tag: "· shortcut tip" },
  DOUBT:    { gradient: "linear-gradient(90deg,#FF3B30 0%,#FF6982 100%)", color: "#FF3B30", lightBg: "#FF3B3014", tag: "· needs review" },
};

const SUBJECT_ACCENT = {
  "Math":           TYPE_CONFIG.QUESTION,
  "Science":        { ...TYPE_CONFIG.CONCEPT, gradient: "linear-gradient(90deg,#34C759 0%,#30D158 100%)", color: "#34C759", lightBg: "#34C75914" },
  "English":        { ...TYPE_CONFIG.CONCEPT, gradient: "linear-gradient(90deg,#FF9500 0%,#FFCC02 100%)", color: "#FF9500", lightBg: "#FF950014" },
  "Social Science": { ...TYPE_CONFIG.TIP,    gradient: "linear-gradient(90deg,#AF52DE 0%,#BF5AF2 100%)", color: "#AF52DE", lightBg: "#AF52DE14" },
  "Hindi":          { ...TYPE_CONFIG.DOUBT,  gradient: "linear-gradient(90deg,#FF3B30 0%,#FF6982 100%)", color: "#FF3B30", lightBg: "#FF3B3014" },
};
function getConfig(q) { return SUBJECT_ACCENT[q.subject] ?? TYPE_CONFIG[deriveType(q)] ?? TYPE_CONFIG.QUESTION; }

const SMART_COLS_DEF = [
  { id: "all",            label: "All saved",          icon: "★" },
  { id: "due",            label: "Due today",          icon: "🔔" },
  { id: "thisWeek",       label: "This week",          icon: "✨" },
  { id: "frequentlyWrong",label: "Frequently wrong",   icon: "⚠️" },
  { id: "forgotten",      label: "Forgotten",          icon: "🌙" },
  { id: "tricky",         label: "Tricky concepts",    icon: "🔥" },
  { id: "concepts",       label: "Concepts & formulas",icon: "🧩" },
  { id: "tips",           label: "Tips & shortcuts",   icon: "⚡" },
  { id: "mastered",       label: "✓ Mastered",         icon: "✓" },
];

const EMOJI_PALETTE = ["📁","📚","🔥","⭐","🎯","🧠","💡","🚀","🧩","⚡","🌙","✨","📌","🔬","🎨","🌍"];
const COLOR_PALETTE = ["#007AFF","#34C759","#FF9500","#AF52DE","#FF3B30","#5AC8FA","#FFCC02","#30D158","#8E8E93","#1C1C1E"];

function timeAgo(date) {
  if (!date) return "recently";
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 120)     return "just now";
  if (diff < 3600)    return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)   return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800)  return "yesterday";
  if (diff < 604800)  return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  return `${Math.floor(diff / 2592000)} months ago`;
}

// ── Card (full + compact + list densities) ─────────────────────────────
function BookmarkCard({ q, density, mastered, review, selected, onSelectToggle, onRemove, onPractice, onToggleMastery, onAddNote, customCols, memberMap, onAddToCollection, onReview }) {
  const type   = deriveType(q);
  const config = getConfig(q);
  const topic  = q.conceptTested || q.topic || q.subject || "—";
  const saved  = timeAgo(q.updatedAt || q.createdAt);
  const note   = review?.note || "";
  const due    = review?.dueAt && new Date(review.dueAt) <= new Date();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft]     = useState(note);
  const addMenuRef = useRef(null);

  useEffect(() => { setNoteDraft(note); }, [note]);
  useEffect(() => {
    if (!showAddMenu) return;
    const h = (e) => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showAddMenu]);

  const gradient = mastered ? "linear-gradient(90deg,#34C759 0%,#30D158 100%)" : config.gradient;
  const inCollections = customCols.filter((c) => memberMap[c._id]?.has(`question::${q._id}`));

  if (density === "list") {
    return (
      <div className={`flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#F2F2F7] hover:bg-[#FAFAFB] transition-colors group ${selected ? "bg-[#007AFF]/5" : ""}`}>
        <input type="checkbox" checked={selected} onChange={onSelectToggle} className="shrink-0 w-3.5 h-3.5 accent-[#007AFF] cursor-pointer" />
        <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: gradient }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#1C1C1E] truncate">{q.questionText}</p>
          <p className="text-[10px] text-[#8E8E93] truncate">{q.subject} · {topic} · saved {saved}{due ? " · due now" : ""}</p>
        </div>
        <button onClick={() => onPractice(q)} className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: config.color }}>Practice</button>
        <button onClick={() => onRemove(q._id)} className="text-[#C7C7CC] hover:text-[#FF3B30] opacity-0 group-hover:opacity-100 text-[14px] leading-none w-5 h-5">×</button>
      </div>
    );
  }

  const compact = density === "compact";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col group transition-all ${mastered ? "border-[#34C759]/25 opacity-80" : selected ? "border-[#007AFF] ring-2 ring-[#007AFF]/20" : "border-[#f0f0f5]"}`}>
      <div className="h-[6px] w-full shrink-0" style={{ background: gradient }} />
      <div className={`${compact ? "p-3.5" : "p-5"} flex flex-col flex-1 gap-0`}>
        {/* Type row + select */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={selected} onChange={onSelectToggle} className="w-3.5 h-3.5 accent-[#007AFF] cursor-pointer" onClick={(e) => e.stopPropagation()} />
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: mastered ? "#34C759" : config.color }}>
              {mastered ? "✓ MASTERED" : type}
            </span>
            {due && !mastered && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#FF3B30]/10 text-[#FF3B30] tracking-wider uppercase">Due</span>
            )}
          </div>
          <button onClick={() => onRemove(q._id)} aria-label="Remove" className="text-[#C7C7CC] hover:text-[#FF3B30] transition-colors opacity-0 group-hover:opacity-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
          </button>
        </div>

        <p className={`${compact ? "text-[14px]" : "text-[16px]"} font-semibold leading-snug mb-2 text-[#1C1C1E]`} style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
          {q.questionText}
        </p>

        {!compact && (q.conceptTested || q.shortcut) && (
          <p className="text-[12px] text-[#8E8E93] leading-relaxed mb-2">
            {q.shortcut ? <span style={{ color: config.color }}>{q.shortcut.slice(0, 100)}</span> : q.conceptTested}
          </p>
        )}

        {/* Note */}
        {editingNote ? (
          <div className="mb-2">
            <textarea
              autoFocus
              maxLength={280}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onBlur={() => { onAddNote(q._id, noteDraft); setEditingNote(false); }}
              onKeyDown={(e) => { if (e.key === "Escape") { setNoteDraft(note); setEditingNote(false); } }}
              placeholder="Why did you save this? (optional)"
              className="w-full text-[12px] leading-snug text-[#3A3A3C] placeholder-[#C7C7CC] bg-[#FAFAFB] border border-[#E5E5EA] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#007AFF] resize-none"
              rows={2}
            />
            <p className="text-[9px] text-[#C7C7CC] mt-0.5">{noteDraft.length}/280 · esc to cancel</p>
          </div>
        ) : note ? (
          <button onClick={() => setEditingNote(true)} className="text-left text-[11px] text-[#3A3A3C] italic mb-2 px-2 py-1.5 rounded-lg bg-[#FFCC02]/8 border-l-2 border-[#FFCC02] hover:bg-[#FFCC02]/15 transition-colors">
            <span className="text-[9px] font-bold text-[#FF9500] tracking-wider uppercase mr-1.5">Note</span>{note}
          </button>
        ) : null}

        {!compact && !editingNote && !note && (
          <button onClick={() => setEditingNote(true)} className="text-left text-[10px] text-[#C7C7CC] hover:text-[#8E8E93] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">+ add note</button>
        )}

        {/* Member chips */}
        {inCollections.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {inCollections.slice(0, 3).map((c) => (
              <span key={c._id} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: `${c.color}14`, color: c.color }}>
                {c.emoji} {c.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#F2F2F7] mt-auto gap-2">
          <span className="text-[11px] text-[#C7C7CC] truncate max-w-[40%]">
            {q.subject || "Math"} · {topic.slice(0, 20)}
          </span>
          <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Review (SM-2 quick rate) */}
            {due && !mastered && (
              <div className="flex items-center gap-0.5 mr-1">
                {[
                  { r: 0, label: "Again", color: "#FF3B30" },
                  { r: 1, label: "Hard",  color: "#FF9500" },
                  { r: 2, label: "Good",  color: "#007AFF" },
                  { r: 3, label: "Easy",  color: "#34C759" },
                ].map((b) => (
                  <button key={b.r} onClick={() => onReview(q._id, b.r)} title={b.label}
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors hover:opacity-80"
                    style={{ background: `${b.color}14`, color: b.color }}>{b.label}</button>
                ))}
              </div>
            )}
            <button onClick={() => onToggleMastery(q._id)} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md transition-all"
              style={{ color: mastered ? "#34C759" : "#8E8E93", background: mastered ? "#34C75914" : "transparent" }}>
              {mastered ? "✓" : "Master"}
            </button>

            {customCols.length > 0 && (
              <div className="relative" ref={addMenuRef}>
                <button onClick={() => setShowAddMenu((v) => !v)} title="Add to collection" className="text-[12px] font-bold text-[#C7C7CC] hover:text-[#007AFF] transition-colors px-1">+</button>
                {showAddMenu && (
                  <div className="absolute bottom-7 right-0 bg-white rounded-xl border border-[#f0f0f5] shadow-lg z-30 overflow-hidden min-w-[180px]">
                    <p className="text-[9px] font-bold text-[#8E8E93] tracking-[0.12em] uppercase px-3 pt-2.5 pb-1">Add to collection</p>
                    {customCols.map((col) => {
                      const inCol = memberMap[col._id]?.has(`question::${q._id}`);
                      return (
                        <button key={col._id}
                          onClick={() => { onAddToCollection(col._id, "question", q._id, inCol); setShowAddMenu(false); }}
                          className={`w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between ${inCol ? "text-[#007AFF] bg-[#007AFF]/5 font-semibold" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"}`}>
                          <span className="truncate">{col.emoji} {col.name}</span>
                          {inCol && <span className="ml-1 text-[#007AFF]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button onClick={() => onPractice(q)} className="text-[11px] font-semibold" style={{ color: config.color }}>Practice →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Topic card ────────────────────────────────────────────────────────
function TopicSavedCard({ item, customCols, memberMap, onRemove, onStudy, onAddToCollection, density, selected, onSelectToggle }) {
  const SUBJECT_COLOR = { "Math": "#007AFF", "Science": "#34C759", "English": "#FF9500", "Social Science": "#AF52DE", "Hindi": "#FF3B30" };
  const color = SUBJECT_COLOR[item.subject] || "#007AFF";
  const gradient = `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`;
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef(null);

  useEffect(() => {
    if (!showAddMenu) return;
    const h = (e) => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showAddMenu]);

  if (density === "list") {
    return (
      <div className={`flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#F2F2F7] hover:bg-[#FAFAFB] transition-colors group ${selected ? "bg-[#007AFF]/5" : ""}`}>
        <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: gradient }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#1C1C1E] truncate">{item.name}</p>
          <p className="text-[10px] text-[#8E8E93]">{item.isLesson ? "AI Lesson" : "Topic"} · {item.subject} · saved {timeAgo(item.savedAt)}</p>
        </div>
        {!item.isLesson && <button onClick={() => onStudy(item)} className="text-[11px] font-semibold opacity-0 group-hover:opacity-100" style={{ color }}>Study</button>}
        <button onClick={() => onRemove(item.topicId)} className="text-[#C7C7CC] hover:text-[#FF3B30] opacity-0 group-hover:opacity-100 text-[14px] w-5 h-5">×</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm overflow-hidden flex flex-col group">
      <div className="h-[6px] w-full shrink-0" style={{ background: gradient }} />
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-1" style={{ color }}>{item.isLesson ? "AI LESSON" : "TOPIC"}</p>
          <p className="text-[14px] font-semibold text-[#1C1C1E] leading-snug truncate">{item.name}</p>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">{item.subject} · saved {timeAgo(item.savedAt)}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {customCols.length > 0 && (
            <div className="relative" ref={addMenuRef}>
              <button onClick={() => setShowAddMenu((v) => !v)} className="text-[14px] font-bold text-[#C7C7CC] hover:text-[#007AFF] transition-colors px-1.5 py-1">+</button>
              {showAddMenu && (
                <div className="absolute bottom-8 right-0 bg-white rounded-xl border border-[#f0f0f5] shadow-lg z-30 overflow-hidden min-w-[180px]">
                  {customCols.map((col) => {
                    const inCol = memberMap[col._id]?.has(`topic::${item.topicId}`);
                    return (
                      <button key={col._id}
                        onClick={() => { onAddToCollection(col._id, "topic", item.topicId, inCol); setShowAddMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between ${inCol ? "text-[#007AFF] bg-[#007AFF]/5 font-semibold" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"}`}>
                        <span className="truncate">{col.emoji} {col.name}</span>{inCol && <span className="text-[#007AFF]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            {!item.isLesson && (
              <button onClick={() => onStudy(item)} className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white" style={{ background: color }}>Study →</button>
            )}
            <button onClick={() => onRemove(item.topicId)} className="px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-[#E5E5EA] text-[#8E8E93] hover:border-[#FF3B30] hover:text-[#FF3B30] transition-colors">Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SECTION_ICON = { hook: "💭", plain: "💬", feynman: "🧠", realworld: "🌍", central: "💡", aha: "🔑", formulas: "🧩", checkpoint: "🔒", errorhunt: "🕵️", workedex: "📝", recall: "🃏", video: "▶️", derivation: "🔬", mistakes: "⚠️", shortcuts: "⚡", whentouse: "🎯", edgecases: "🔍", wrongintuit: "🧠", analogy: "🌉", history: "📜", whymatters: "🚀", challenge: "⚡", notes: "📝", adaptive: "🎯", paper: "📋", diagram: "🖼️" };
const SECTION_COLOR = { hook: "#007AFF", plain: "#34C759", feynman: "#AF52DE", realworld: "#FF9500", central: "#FF9500", aha: "#FF9500", formulas: "#007AFF", checkpoint: "#34C759", errorhunt: "#FF3B30", workedex: "#007AFF", recall: "#AF52DE", video: "#FF3B30", derivation: "#5AC8FA", mistakes: "#FF3B30", shortcuts: "#34C759", whentouse: "#007AFF", edgecases: "#5AC8FA", wrongintuit: "#AF52DE", analogy: "#FF9500", history: "#8E8E93", whymatters: "#FF9500", challenge: "#FF3B30", notes: "#8E8E93", adaptive: "#007AFF", paper: "#8E8E93", diagram: "#5AC8FA" };

function SectionSavedCard({ item, onRemove, onOpen }) {
  const baseKey = (item.sectionKey || item.bmId.split("__").slice(1).join("__") || "").startsWith("diagram") ? "diagram" : (item.sectionKey || item.bmId.split("__").slice(1).join("__") || "notes");
  const icon = SECTION_ICON[baseKey] || "📌";
  const color = SECTION_COLOR[baseKey] || "#8E8E93";
  return (
    <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm overflow-hidden flex flex-col group">
      <div className="h-[4px] w-full shrink-0" style={{ background: `linear-gradient(90deg,${color} 0%,${color}99 100%)` }} />
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] shrink-0" style={{ background: `${color}14` }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1C1C1E] leading-snug">{item.label}</p>
          <p className="text-[11px] text-[#8E8E93] mt-0.5 truncate">{item.topicId} · {timeAgo(item.savedAt)}</p>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onOpen(item)} className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white" style={{ background: color }}>Open →</button>
          <button onClick={() => onRemove(item.bmId)} className="px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-[#E5E5EA] text-[#8E8E93] hover:border-[#FF3B30] hover:text-[#FF3B30] transition-colors">Remove</button>
        </div>
      </div>
    </div>
  );
}

// ── Share modal ─────────────────────────────────────────────────────────
function ShareModal({ collection, onClose, onGenerate, onRevoke, shareUrl, generating }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[20px] font-bold text-[#1C1C1E] mb-1" style={{ fontFamily: "Georgia,serif", fontStyle: "italic" }}>
          Share "{collection.emoji} {collection.name}"
        </h3>
        <p className="text-[13px] text-[#8E8E93] mb-5">Anyone with this link can view your saved questions and topics. Read-only.</p>
        {shareUrl ? (
          <>
            <div className="flex gap-2 mb-3">
              <input readOnly value={shareUrl} className="flex-1 text-[12px] px-3 py-2 rounded-lg border border-[#E5E5EA] bg-[#FAFAFB] text-[#3A3A3C] font-mono" onClick={(e) => e.target.select()} />
              <button onClick={copy} className="px-4 py-2 rounded-lg bg-[#007AFF] text-white text-[12px] font-semibold hover:bg-[#0066CC]">{copied ? "✓" : "Copy"}</button>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[#F2F2F7]">
              <button onClick={onRevoke} className="text-[12px] font-semibold text-[#FF3B30] hover:opacity-70">Revoke link</button>
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#1C1C1E] text-white text-[12px] font-semibold">Done</button>
            </div>
          </>
        ) : (
          <button onClick={onGenerate} disabled={generating} className="w-full px-4 py-3 rounded-xl bg-[#007AFF] text-white text-[13px] font-semibold hover:bg-[#0066CC] disabled:opacity-50">
            {generating ? "Generating…" : "Generate share link"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Edit collection modal ──────────────────────────────────────────────
function EditCollectionModal({ collection, onClose, onSave }) {
  const [name, setName] = useState(collection.name);
  const [emoji, setEmoji] = useState(collection.emoji);
  const [color, setColor] = useState(collection.color);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold text-[#1C1C1E] mb-4">Edit collection</h3>
        <label className="text-[11px] font-bold text-[#8E8E93] tracking-[0.12em] uppercase">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="w-full mt-1 mb-4 px-3 py-2 rounded-lg border border-[#E5E5EA] text-[14px]" />
        <label className="text-[11px] font-bold text-[#8E8E93] tracking-[0.12em] uppercase">Icon</label>
        <div className="grid grid-cols-8 gap-1.5 mt-1 mb-4">
          {EMOJI_PALETTE.map((e) => (
            <button key={e} onClick={() => setEmoji(e)} className={`h-8 rounded-lg text-[18px] hover:bg-[#F2F2F7] ${emoji === e ? "bg-[#007AFF]/10 ring-2 ring-[#007AFF]" : ""}`}>{e}</button>
          ))}
        </div>
        <label className="text-[11px] font-bold text-[#8E8E93] tracking-[0.12em] uppercase">Color</label>
        <div className="grid grid-cols-10 gap-1.5 mt-1 mb-5">
          {COLOR_PALETTE.map((c) => (
            <button key={c} onClick={() => setColor(c)} className={`h-7 rounded-lg ${color === c ? "ring-2 ring-offset-1 ring-[#1C1C1E]" : ""}`} style={{ background: c }} />
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#E5E5EA] text-[12px] font-semibold text-[#3A3A3C]">Cancel</button>
          <button onClick={() => onSave({ name: name.trim() || collection.name, emoji, color })} className="px-4 py-2 rounded-lg bg-[#007AFF] text-white text-[12px] font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Review modal (Due today queue) ─────────────────────────────────────
function ReviewModal({ items, onClose, onRate }) {
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const item = items[idx];

  useEffect(() => { setShowAnswer(false); }, [idx]);

  if (!item) return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-[56px] mb-3">🎉</div>
        <h3 className="text-[22px] font-bold text-[#1C1C1E] mb-2" style={{ fontFamily: "Georgia,serif", fontStyle: "italic" }}>All caught up!</h3>
        <p className="text-[13px] text-[#8E8E93] mb-6">You've reviewed everything due today. Come back tomorrow.</p>
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-[13px] font-semibold">Done</button>
      </div>
    </div>
  );

  const rate = (r) => {
    onRate(item._id, r);
    if (idx + 1 < items.length) setIdx(idx + 1);
    else setIdx(items.length); // shows "all caught up" via items[idx] === undefined
  };

  const correctText = (item.options || []).find((o) => o.logicTag === "correct")?.text;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#8E8E93]">
            Review {idx + 1} of {items.length}
          </p>
          <button onClick={onClose} className="text-[#C7C7CC] hover:text-[#8E8E93] text-[20px] leading-none">×</button>
        </div>
        <div className="h-1 bg-[#F2F2F7] rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-[#007AFF] transition-all duration-300" style={{ width: `${((idx + 1) / items.length) * 100}%` }} />
        </div>

        <p className="text-[18px] font-semibold text-[#1C1C1E] leading-snug mb-4" style={{ fontFamily: "Georgia,serif", fontStyle: "italic" }}>
          {item.questionText}
        </p>
        {item.conceptTested && <p className="text-[12px] text-[#8E8E93] mb-4">{item.conceptTested}</p>}

        {showAnswer && correctText && (
          <div className="bg-[#34C759]/8 border border-[#34C759]/25 rounded-xl px-4 py-3 mb-5">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#34C759] mb-1">Answer</p>
            <p className="text-[14px] text-[#1C1C1E]">{correctText}</p>
          </div>
        )}

        {!showAnswer ? (
          <div className="flex justify-center">
            <button onClick={() => setShowAnswer(true)} className="px-6 py-3 rounded-xl bg-[#007AFF] text-white text-[13px] font-semibold hover:bg-[#0066CC]">
              Show answer
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[11px] text-center text-[#8E8E93] mb-2.5">How well did you remember?</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { r: 0, label: "Again",  desc: "<1 day", color: "#FF3B30" },
                { r: 1, label: "Hard",   desc: "3 days", color: "#FF9500" },
                { r: 2, label: "Good",   desc: "1 week", color: "#007AFF" },
                { r: 3, label: "Easy",   desc: "3 weeks",color: "#34C759" },
              ].map((b) => (
                <button key={b.r} onClick={() => rate(b.r)} className="px-3 py-3 rounded-xl text-[12px] font-semibold transition-all hover:scale-105" style={{ background: `${b.color}14`, color: b.color }}>
                  <div>{b.label}</div>
                  <div className="text-[10px] opacity-70 font-normal mt-0.5">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function Bookmarks() {
  const navigate = useNavigate();

  // Server state
  const [questions, setQuestions]   = useState([]);
  const [reviews, setReviews]       = useState({});
  const [smart, setSmart]           = useState({ due:[], forgotten:[], frequentlyWrong:[], thisWeek:[], mastered:[] });
  const [customCols, setCustomCols] = useState([]);
  const [topicSaved, setTopicSaved] = useState([]);
  const [sectionSaved, setSectionSaved] = useState([]);

  // UI state
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [activeCol, setActiveCol] = useState("all");
  const [sortBy, setSortBy]     = useState("recent");
  const [search, setSearch]     = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [density, setDensity]   = useState(() => localStorage.getItem("stellar_bm_density") || "comfortable");
  const [showCount, setShowCount] = useState(24);
  const [creating, setCreating] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [editingCol, setEditingCol] = useState(null);
  const [shareCol, setShareCol] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [reviewQueue, setReviewQueue] = useState(null);
  const [aiSummary, setAiSummary] = useState({ loading: false, text: null, colId: null });
  const [selected, setSelected] = useState(new Set());
  const [filterChips, setFilterChips] = useState({ subject: "all", difficulty: "all", type: "all" });
  const sortRef = useRef(null);
  const createInputRef = useRef(null);

  useEffect(() => { localStorage.setItem("stellar_bm_density", density); }, [density]);

  // ── Initial load + localStorage migration ────────────────────────────
  useEffect(() => {
    const lsTopic = loadLS("stellar_topic_bookmarks", {});
    const lsSection = loadLS("stellar_section_bookmarks", {});
    const lsCols = loadLS("stellar_collections", []);
    const lsMastery = loadLS("stellar_mastery", {});

    Promise.all([
      getBookmarks().catch(() => ({ data: [] })),
      bmGetReviews().catch(() => ({ data: { data: {} } })),
      bmGetSmart().catch(() => ({ data: { data: smart } })),
      bmListCollections().catch(() => ({ data: { data: [] } })),
      bmListTopics().catch(() => ({ data: { data: [] } })),
      bmListSections().catch(() => ({ data: { data: [] } })),
    ]).then(async ([qs, rv, sm, cols, tops, secs]) => {
      setQuestions(Array.isArray(qs.data) ? qs.data : []);
      setReviews(rv.data?.data || {});
      setSmart(sm.data?.data || smart);
      setCustomCols(cols.data?.data || []);
      setTopicSaved(tops.data?.data || []);
      setSectionSaved(secs.data?.data || []);

      // Migrate localStorage if server is empty
      const serverEmpty = (cols.data?.data?.length || 0) === 0 && (tops.data?.data?.length || 0) === 0;
      if (serverEmpty) {
        try {
          // Migrate topics
          for (const t of Object.values(lsTopic)) {
            await bmUpsertTopic({ topicId: t.topicId, name: t.name, subject: t.subject, isLesson: !!t.isLesson, smartCol: t.smartCol });
          }
          // Migrate sections
          for (const s of Object.values(lsSection)) {
            const sectionKey = s.id ? s.id.split("__").slice(1).join("__") : "";
            await bmUpsertSection({ bmId: s.id, topicId: s.topicId, label: s.label, sectionKey });
          }
          // Migrate collections
          for (const c of lsCols) {
            const r = await bmCreateCollection({ name: c.label, emoji: "📁", color: "#007AFF" });
            const newCol = r.data?.data;
            // Add members — they were stored as plain ID strings (may be question or topic)
            for (const id of c.bookmarkIds || []) {
              const kind = /^[a-f\d]{24}$/i.test(id) ? "question" : "topic";
              await bmAddMember(newCol._id, kind, id).catch(() => {});
            }
          }
          // Migrate mastery
          const masteredIds = Object.keys(lsMastery).filter((k) => lsMastery[k]);
          if (masteredIds.length) await bmBulkMastery(masteredIds, true).catch(() => {});

          // Refetch after migration
          const [c2, t2, s2, r2] = await Promise.all([
            bmListCollections(), bmListTopics(), bmListSections(), bmGetReviews(),
          ]);
          setCustomCols(c2.data?.data || []);
          setTopicSaved(t2.data?.data || []);
          setSectionSaved(s2.data?.data || []);
          setReviews(r2.data?.data || {});

          // Mark migrated
          localStorage.setItem("stellar_bm_migrated", "1");
        } catch (e) { console.warn("Migration error", e); }
      }
    }).catch((err) => {
      setError(err.response?.data?.error || err.message || "Failed to load");
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line

  // refresh smart counts when reviews change
  const refreshSmart = useCallback(() => {
    bmGetSmart().then((r) => setSmart(r.data?.data || smart)).catch(() => {});
  }, [smart]);

  useEffect(() => {
    const h = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (creating) setTimeout(() => createInputRef.current?.focus(), 30); }, [creating]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "/") { e.preventDefault(); setShowSearch(true); }
      if (e.key === "?" ) { e.preventDefault(); alert("Shortcuts:\n  /  Search\n  d  Density toggle\n  r  Review due\n  esc Clear selection"); }
      if (e.key === "d") { setDensity((d) => d === "comfortable" ? "compact" : d === "compact" ? "list" : "comfortable"); }
      if (e.key === "r" && smart.due?.length) { startReview(); }
      if (e.key === "Escape") { setSelected(new Set()); setShowSearch(false); setSearch(""); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [smart.due]); // eslint-disable-line

  // ── Member map (for "is X in collection Y" lookups) ──────────────
  const memberMap = useMemo(() => {
    const m = {};
    for (const c of customCols) {
      const set = new Set();
      for (const ref of c.memberRefs || []) set.add(`${ref.kind}::${ref.refId}`);
      m[c._id] = set;
    }
    return m;
  }, [customCols]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleRemove = async (id) => {
    setQuestions((prev) => prev.filter((x) => x._id !== id));
    setSelected((s) => { const ns = new Set(s); ns.delete(id); return ns; });
    try { await toggleBookmark(id); } catch {}
    refreshSmart();
  };

  const handlePractice = (q) => {
    navigate("/practice", { state: { topic: q.conceptTested || q.topic || q.subject } });
  };

  const handleToggleMastery = async (id) => {
    const cur = !!reviews[id]?.mastered;
    setReviews((r) => ({ ...r, [id]: { ...(r[id] || {}), mastered: !cur, masteredAt: !cur ? new Date() : null } }));
    try { await bmSetMastery(id, !cur); refreshSmart(); } catch {}
  };

  const handleAddNote = async (id, note) => {
    setReviews((r) => ({ ...r, [id]: { ...(r[id] || {}), note } }));
    try { await bmSetNote(id, note); } catch {}
  };

  const handleReview = async (id, rating) => {
    try {
      const r = await bmRate(id, rating);
      setReviews((prev) => ({ ...prev, [id]: r.data?.data }));
      refreshSmart();
    } catch {}
  };

  const handleAddToCollection = async (colId, kind, refId, alreadyIn) => {
    // optimistic
    setCustomCols((prev) => prev.map((c) => {
      if (c._id !== colId) return c;
      const refs = alreadyIn
        ? (c.memberRefs || []).filter((m) => !(m.kind === kind && m.refId === refId))
        : [...(c.memberRefs || []), { kind, refId, addedAt: new Date() }];
      return { ...c, memberRefs: refs };
    }));
    try {
      if (alreadyIn) await bmRemoveMember(colId, kind, refId);
      else await bmAddMember(colId, kind, refId);
    } catch {}
  };

  const handleCreateCollection = async () => {
    const name = newColName.trim();
    if (!name) { setCreating(false); setNewColName(""); return; }
    try {
      const r = await bmCreateCollection({ name, emoji: "📁", color: "#007AFF" });
      const newCol = r.data?.data;
      setCustomCols((prev) => [...prev, newCol]);
      setActiveCol(newCol._id);
    } catch {}
    setCreating(false);
    setNewColName("");
  };

  const handleDeleteCollection = async (colId, e) => {
    e.stopPropagation();
    if (!confirm("Delete this collection? Items inside stay saved.")) return;
    setCustomCols((prev) => prev.filter((c) => c._id !== colId));
    if (activeCol === colId) setActiveCol("all");
    try { await bmDeleteCollection(colId); } catch {}
  };

  const handleEditCollection = async (patch) => {
    const colId = editingCol._id;
    setCustomCols((prev) => prev.map((c) => c._id === colId ? { ...c, ...patch } : c));
    setEditingCol(null);
    try { await bmUpdateCollection(colId, patch); } catch {}
  };

  const handleRemoveTopic = async (topicId) => {
    setTopicSaved((prev) => prev.filter((t) => t.topicId !== topicId));
    try { await bmRemoveTopic(topicId); } catch {}
  };

  const handleStudyTopic = (item) => navigate(`/ncert/topics/${item.topicId}`);

  const handleRemoveSection = async (bmId) => {
    setSectionSaved((prev) => prev.filter((s) => s.bmId !== bmId));
    try { await bmRemoveSection(bmId); } catch {}
  };

  const handleOpenSection = (item) => navigate(`/ncert/topics/${item.topicId}`);

  // Bulk
  const toggleSelect = (id) => setSelected((s) => { const ns = new Set(s); ns.has(id) ? ns.delete(id) : ns.add(id); return ns; });
  const handleBulkRemove = async () => {
    const ids = [...selected];
    if (!ids.length || !confirm(`Remove ${ids.length} bookmark${ids.length===1?"":"s"}?`)) return;
    setQuestions((prev) => prev.filter((q) => !selected.has(q._id)));
    setSelected(new Set());
    try { await bmBulkRemove(ids); refreshSmart(); } catch {}
  };
  const handleBulkMastery = async (mastered) => {
    const ids = [...selected];
    if (!ids.length) return;
    const next = {};
    for (const id of ids) next[id] = { ...(reviews[id] || {}), mastered, masteredAt: mastered ? new Date() : null };
    setReviews((r) => ({ ...r, ...next }));
    setSelected(new Set());
    try { await bmBulkMastery(ids, mastered); refreshSmart(); } catch {}
  };
  const handleBulkAddToCollection = async (colId) => {
    const items = [...selected].map((refId) => ({ kind: "question", refId }));
    if (!items.length) return;
    setCustomCols((prev) => prev.map((c) => {
      if (c._id !== colId) return c;
      const have = new Set((c.memberRefs || []).map((m) => `${m.kind}::${m.refId}`));
      const next = [...(c.memberRefs || [])];
      for (const it of items) {
        const key = `${it.kind}::${it.refId}`;
        if (!have.has(key)) next.push({ ...it, addedAt: new Date() });
      }
      return { ...c, memberRefs: next };
    }));
    try { for (const it of items) await bmAddMember(colId, it.kind, it.refId).catch(() => {}); } catch {}
    setSelected(new Set());
  };

  // Quiz from collection
  const handleQuizCollection = (colId) => navigate("/practice", { state: { collectionId: colId, autoStart: true } });

  // Share
  const openShare = async (col) => {
    setShareCol(col);
    setShareUrl(col.shareToken ? `${window.location.origin}/c/${col.shareToken}` : "");
  };
  const generateShare = async () => {
    setGenerating(true);
    try {
      const r = await bmShareCollection(shareCol._id);
      setShareUrl(r.data?.data?.url);
      setCustomCols((prev) => prev.map((c) => c._id === shareCol._id ? { ...c, shareToken: r.data?.data?.token } : c));
    } catch {} finally { setGenerating(false); }
  };
  const revokeShare = async () => {
    try {
      await bmUnshareCollection(shareCol._id);
      setShareUrl("");
      setCustomCols((prev) => prev.map((c) => c._id === shareCol._id ? { ...c, shareToken: null } : c));
    } catch {}
  };

  // Export
  const exportCol = (colId, format) => {
    const url = bmExportUrl(colId, format);
    // Use fetch with credentials so cookies go through
    fetch(url, { credentials: "include" })
      .then((r) => r.blob().then((b) => ({ blob: b, name: r.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] || "export" })))
      .then(({ blob, name }) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
      })
      .catch(() => {});
  };

  // AI summary
  const loadAiSummary = async (colId) => {
    setAiSummary({ loading: true, text: null, colId });
    try {
      const r = await bmAiSummary(colId);
      setAiSummary({ loading: false, text: r.data?.data?.summary, colId });
    } catch { setAiSummary({ loading: false, text: "Couldn't generate summary right now.", colId }); }
  };

  // Review modal
  const startReview = async () => {
    try {
      const r = await bmGetDue(20);
      setReviewQueue(r.data?.data || []);
    } catch {}
  };

  // ── Derived state ─────────────────────────────────────────────────
  const isCustomCol = (id) => customCols.some((c) => c._id === id);
  const activeColObj = customCols.find((c) => c._id === activeCol);

  const filterByQ = (q) => {
    if (filterChips.subject !== "all" && q.subject !== filterChips.subject) return false;
    if (filterChips.difficulty === "easy"   && (q.difficultyScore || 0) >= 0.4) return false;
    if (filterChips.difficulty === "medium" && ((q.difficultyScore || 0) < 0.4 || (q.difficultyScore || 0) >= 0.7)) return false;
    if (filterChips.difficulty === "hard"   && (q.difficultyScore || 0) < 0.7) return false;
    if (filterChips.type !== "all" && deriveType(q) !== filterChips.type) return false;
    return true;
  };

  const filteredQuestions = useMemo(() => {
    let list = questions.filter(filterByQ);

    if (activeCol === "due")             list = list.filter((q) => smart.due?.includes(q._id));
    else if (activeCol === "thisWeek")   list = list.filter((q) => smart.thisWeek?.includes(q._id));
    else if (activeCol === "frequentlyWrong") list = list.filter((q) => smart.frequentlyWrong?.includes(q._id));
    else if (activeCol === "forgotten")  list = list.filter((q) => smart.forgotten?.includes(q._id));
    else if (activeCol === "tricky")     list = list.filter((q) => (q.difficultyScore || 0) >= 0.65);
    else if (activeCol === "concepts")   list = list.filter((q) => deriveType(q) === "CONCEPT");
    else if (activeCol === "tips")       list = list.filter((q) => deriveType(q) === "TIP");
    else if (activeCol === "mastered")   list = list.filter((q) => reviews[q._id]?.mastered);
    else if (isCustomCol(activeCol)) {
      const set = memberMap[activeCol] || new Set();
      list = list.filter((q) => set.has(`question::${q._id}`));
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((q) =>
        q.questionText?.toLowerCase().includes(s) ||
        q.conceptTested?.toLowerCase().includes(s) ||
        q.topic?.toLowerCase().includes(s) ||
        q.subject?.toLowerCase().includes(s) ||
        reviews[q._id]?.note?.toLowerCase().includes(s)
      );
    }
    if (sortBy === "topic")      list = [...list].sort((a, b) => (a.topic || "").localeCompare(b.topic || ""));
    if (sortBy === "difficulty") list = [...list].sort((a, b) => (b.difficultyScore || 0) - (a.difficultyScore || 0));
    return list;
  }, [questions, activeCol, sortBy, search, reviews, smart, memberMap, customCols, filterChips]); // eslint-disable-line

  const filteredTopics = useMemo(() => {
    if (activeCol === "all" || activeCol === "thisWeek") return topicSaved;
    if (activeCol === "mastered") return topicSaved.filter((t) => reviews[t.topicId]?.mastered);
    if (isCustomCol(activeCol)) {
      const set = memberMap[activeCol] || new Set();
      return topicSaved.filter((t) => set.has(`topic::${t.topicId}`));
    }
    return [];
  }, [topicSaved, activeCol, memberMap, reviews, customCols]); // eslint-disable-line

  const filteredSections = useMemo(() => activeCol === "all" ? sectionSaved : [], [sectionSaved, activeCol]);

  const collectionCounts = useMemo(() => {
    const out = { all: questions.length + topicSaved.length + sectionSaved.length };
    out.due             = smart.due?.length || 0;
    out.thisWeek        = smart.thisWeek?.length || 0;
    out.frequentlyWrong = smart.frequentlyWrong?.length || 0;
    out.forgotten       = smart.forgotten?.length || 0;
    out.tricky          = questions.filter((q) => (q.difficultyScore || 0) >= 0.65).length;
    out.concepts        = questions.filter((q) => deriveType(q) === "CONCEPT").length;
    out.tips            = questions.filter((q) => deriveType(q) === "TIP").length;
    out.mastered        = Object.values(reviews).filter((r) => r?.mastered).length;
    for (const c of customCols) {
      const set = memberMap[c._id] || new Set();
      out[c._id] = set.size;
    }
    return out;
  }, [questions, topicSaved, sectionSaved, smart, reviews, customCols, memberMap]);

  const masteredCount = Object.values(reviews).filter((r) => r?.mastered).length;
  const visible = filteredQuestions.slice(0, showCount);
  const hasMore = filteredQuestions.length > showCount;
  const subjectsForFilter = useMemo(() => [...new Set(questions.map((q) => q.subject).filter(Boolean))], [questions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-[#E5E5EA] border-t-[#007AFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-7 items-start">

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <div className="w-56 shrink-0 space-y-0.5 bg-white rounded-2xl shadow-sm border border-[#f0f0f5] p-3">
        <p className="text-[10px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase px-3 pb-2 pt-1">Collections</p>

        {SMART_COLS_DEF.map((col) => {
          const count = collectionCounts[col.id] || 0;
          const active = activeCol === col.id;
          const isDue = col.id === "due" && count > 0;
          return (
            <button key={col.id}
              onClick={() => { setActiveCol(col.id); setShowCount(24); setSearch(""); setShowSearch(false); }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium transition-all ${
                active ? "bg-[#007AFF] text-white shadow-sm" : isDue ? "text-[#FF3B30] hover:bg-[#FF3B30]/10" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"
              }`}>
              <span className="truncate flex items-center gap-2">
                <span className="text-[12px] opacity-80">{col.icon}</span>
                {col.label}
              </span>
              <span className={`text-[11px] font-bold tabular-nums shrink-0 ${active ? "text-white/75" : isDue ? "text-[#FF3B30]" : "text-[#C7C7CC]"}`}>{count}</span>
            </button>
          );
        })}

        {customCols.length > 0 && (
          <p className="text-[9px] font-bold text-[#C7C7CC] tracking-[0.14em] uppercase px-3 pt-3 pb-0.5">My collections</p>
        )}
        {customCols.map((col) => {
          const count = collectionCounts[col._id] || 0;
          const active = activeCol === col._id;
          return (
            <div key={col._id} className="flex items-center group/row">
              <button
                onClick={() => { setActiveCol(col._id); setShowCount(24); setSearch(""); setShowSearch(false); }}
                className={`flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium transition-all ${active ? "shadow-sm" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"}`}
                style={active ? { background: col.color, color: "#fff" } : {}}>
                <span className="truncate flex items-center gap-1.5">
                  <span>{col.emoji}</span>
                  {col.name}
                </span>
                <span className={`text-[11px] font-bold tabular-nums shrink-0 ${active ? "text-white/75" : "text-[#C7C7CC]"}`}>{count}</span>
              </button>
              <div className="flex items-center gap-0.5 ml-1 transition-all">
                <button onClick={(e) => { e.stopPropagation(); setEditingCol(col); }} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-full text-[#8E8E93] hover:text-[#007AFF] hover:bg-[#007AFF]/10 text-[12px] transition-colors">✎</button>
                <button onClick={(e) => handleDeleteCollection(col._id, e)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-full text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 text-[16px] leading-none transition-colors">×</button>
              </div>
            </div>
          );
        })}

        <div className="pt-2">
          {creating ? (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-[#007AFF]/50 bg-[#007AFF]/5">
              <input ref={createInputRef} type="text" value={newColName} onChange={(e) => setNewColName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateCollection(); if (e.key === "Escape") { setCreating(false); setNewColName(""); } }}
                placeholder="Collection name…" maxLength={60}
                className="flex-1 min-w-0 text-[12px] text-[#1C1C1E] placeholder-[#C7C7CC] outline-none bg-transparent" />
              <button onClick={handleCreateCollection} className="text-[#007AFF] font-bold text-[13px] shrink-0">↵</button>
              <button onClick={() => { setCreating(false); setNewColName(""); }} className="text-[#C7C7CC] hover:text-[#8E8E93] text-[16px] shrink-0">×</button>
            </div>
          ) : (
            <button onClick={() => setCreating(true)} className="w-full flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-[#3A3A3C] bg-[#FAFAFB] hover:bg-[#F2F2F7] hover:text-[#1c1c1e] hover:border-[#1c1c1e] transition-all border border-dashed border-[#8E8E93]">
              <span className="text-[14px] leading-none">+</span>New collection
            </button>
          )}
        </div>

        {/* Mastery progress */}
        {questions.length > 0 && (
          <div className="mt-3 px-3 py-3.5 rounded-xl bg-[#34C759]/8 border border-[#34C759]/20">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] font-bold text-[#34C759] tracking-[0.14em] uppercase">Mastery</p>
              <p className="text-[11px] font-bold text-[#34C759]">{masteredCount}/{questions.length}</p>
            </div>
            <div className="h-1.5 bg-[#34C759]/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#34C759] rounded-full transition-all duration-500" style={{ width: `${questions.length ? (masteredCount / questions.length) * 100 : 0}%` }} />
            </div>
            <p className="text-[10px] text-[#34C759]/70 mt-1.5">{questions.length - masteredCount} still to master</p>
          </div>
        )}

        {/* Shortcuts hint */}
        <div className="mt-1 px-3 py-3 rounded-xl bg-[#F2F2F7]">
          <p className="text-[9px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase mb-1">Shortcuts</p>
          <div className="space-y-0.5 text-[10px] text-[#8E8E93]">
            <div><kbd className="px-1 py-0.5 rounded bg-white border border-[#E5E5EA] font-mono font-bold text-[9px]">/</kbd> search</div>
            <div><kbd className="px-1 py-0.5 rounded bg-white border border-[#E5E5EA] font-mono font-bold text-[9px]">d</kbd> density</div>
            <div><kbd className="px-1 py-0.5 rounded bg-white border border-[#E5E5EA] font-mono font-bold text-[9px]">r</kbd> review due</div>
            <div><kbd className="px-1 py-0.5 rounded bg-white border border-[#E5E5EA] font-mono font-bold text-[9px]">esc</kbd> deselect</div>
          </div>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Headline + controls */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h1 className="text-[30px] font-bold text-[#1C1C1E] leading-tight" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
              {filteredQuestions.length + filteredTopics.length + filteredSections.length}{" "}
              <em style={{ fontStyle: "italic" }}>things</em> worth coming back to
            </h1>
            <p className="text-[13px] text-[#8E8E93] mt-1">Questions, topics, and insights you starred. Your personal study shelf.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            {/* Density */}
            <div className="flex rounded-full bg-white shadow-sm border border-[#f0f0f5] overflow-hidden text-[11px]">
              {["comfortable","compact","list"].map((d) => (
                <button key={d} onClick={() => setDensity(d)} title={d} className={`px-2.5 py-1.5 font-semibold transition-colors ${density === d ? "bg-[#1C1C1E] text-white" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"}`}>
                  {d === "comfortable" ? "▦" : d === "compact" ? "▤" : "≡"}
                </button>
              ))}
            </div>
            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button onClick={() => setShowSort((v) => !v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E5EA] bg-white text-[12px] font-medium text-[#3A3A3C] hover:bg-[#F2F2F7]">
                Sort: {sortBy} <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor" className="text-[#8E8E93]"><path d="M5 7L1 3h8z" /></svg>
              </button>
              {showSort && (
                <div className="absolute top-9 right-0 bg-white rounded-xl border border-[#f0f0f5] shadow-lg z-20 overflow-hidden min-w-[140px]">
                  {[{id:"recent",label:"Most recent"},{id:"topic",label:"By topic"},{id:"difficulty",label:"Hardest first"}].map((opt) => (
                    <button key={opt.id} onClick={() => { setSortBy(opt.id); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${sortBy === opt.id ? "text-[#007AFF] font-semibold bg-[#007AFF]/6" : "text-[#3A3A3C] hover:bg-[#F2F2F7]"}`}>{opt.label}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Search */}
            {showSearch ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#007AFF]/50 bg-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search saved…" className="text-[12px] text-[#1C1C1E] placeholder-[#C7C7CC] outline-none w-32 bg-transparent" />
                <button onClick={() => { setSearch(""); setShowSearch(false); }} className="text-[#C7C7CC] hover:text-[#8E8E93] text-[16px]">×</button>
              </div>
            ) : (
              <button onClick={() => setShowSearch(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E5EA] bg-white text-[12px] font-medium text-[#3A3A3C] hover:bg-[#F2F2F7]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>Search saved
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-4 text-[11px]">
          <span className="text-[10px] font-bold text-[#C7C7CC] tracking-[0.14em] uppercase">Filter</span>
          <select value={filterChips.subject} onChange={(e) => setFilterChips({ ...filterChips, subject: e.target.value })} className="px-2.5 py-1 rounded-full border border-[#E5E5EA] bg-white text-[#3A3A3C] text-[11px] outline-none">
            <option value="all">All subjects</option>
            {subjectsForFilter.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterChips.difficulty} onChange={(e) => setFilterChips({ ...filterChips, difficulty: e.target.value })} className="px-2.5 py-1 rounded-full border border-[#E5E5EA] bg-white text-[#3A3A3C] text-[11px] outline-none">
            <option value="all">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select value={filterChips.type} onChange={(e) => setFilterChips({ ...filterChips, type: e.target.value })} className="px-2.5 py-1 rounded-full border border-[#E5E5EA] bg-white text-[#3A3A3C] text-[11px] outline-none">
            <option value="all">Any type</option>
            <option value="QUESTION">Question</option>
            <option value="CONCEPT">Concept</option>
            <option value="TIP">Tip</option>
          </select>
          {(filterChips.subject !== "all" || filterChips.difficulty !== "all" || filterChips.type !== "all") && (
            <button onClick={() => setFilterChips({ subject: "all", difficulty: "all", type: "all" })} className="text-[10px] text-[#FF3B30] font-semibold hover:opacity-70">Clear</button>
          )}
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-2.5 mb-4 rounded-xl bg-[#1C1C1E] text-white shadow-lg">
            <p className="text-[12px] font-semibold">{selected.size} selected</p>
            <div className="flex items-center gap-1 text-[11px]">
              <button onClick={() => handleBulkMastery(true)} className="px-2.5 py-1 rounded-md bg-[#34C759]/20 hover:bg-[#34C759]/30 text-[#34C759] font-semibold">✓ Master</button>
              <button onClick={() => handleBulkMastery(false)} className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15">Unmaster</button>
              {customCols.length > 0 && (
                <select onChange={(e) => { if (e.target.value) handleBulkAddToCollection(e.target.value); e.target.value = ""; }}
                  className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] border-none outline-none">
                  <option value="">+ Add to…</option>
                  {customCols.map((c) => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
                </select>
              )}
              <button onClick={handleBulkRemove} className="px-2.5 py-1 rounded-md bg-[#FF3B30]/20 hover:bg-[#FF3B30]/30 text-[#FF6982] font-semibold">Delete</button>
              <button onClick={() => setSelected(new Set())} className="px-2.5 py-1 rounded-md text-white/60 hover:text-white">Clear</button>
            </div>
          </div>
        )}

        {/* Due Today CTA */}
        {smart.due?.length > 0 && activeCol !== "due" && (
          <div className="flex items-center justify-between px-4 py-3 mb-4 rounded-2xl bg-gradient-to-r from-[#FF3B30]/8 to-[#FF9500]/8 border border-[#FF3B30]/20">
            <div>
              <p className="text-[13px] font-semibold text-[#FF3B30]">🔔 {smart.due.length} due for review today</p>
              <p className="text-[11px] text-[#FF3B30]/70 mt-0.5">Spaced repetition keeps memory fresh — 5 min now saves an hour later.</p>
            </div>
            <button onClick={startReview} className="px-4 py-2 rounded-xl bg-[#FF3B30] text-white text-[12px] font-semibold hover:bg-[#D32F2F] shrink-0">Start review →</button>
          </div>
        )}

        {/* Custom collection toolbar (Practice / Share / Export / AI summary) */}
        {activeColObj && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 mb-4 rounded-2xl bg-white border border-[#f0f0f5]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[18px]">{activeColObj.emoji}</span>
              <p className="text-[14px] font-semibold text-[#1C1C1E] truncate">{activeColObj.name}</p>
              <span className="text-[11px] text-[#8E8E93]">· {collectionCounts[activeColObj._id] || 0} items</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => handleQuizCollection(activeColObj._id)} className="px-3 py-1.5 rounded-xl bg-[#007AFF] text-white text-[11px] font-semibold hover:bg-[#0066CC]">Quiz me →</button>
              <button onClick={() => loadAiSummary(activeColObj._id)} className="px-3 py-1.5 rounded-xl border border-[#E5E5EA] text-[11px] font-semibold text-[#3A3A3C] hover:bg-[#F2F2F7]">✨ AI summary</button>
              <button onClick={() => openShare(activeColObj)} className="px-3 py-1.5 rounded-xl border border-[#E5E5EA] text-[11px] font-semibold text-[#3A3A3C] hover:bg-[#F2F2F7]">Share</button>
              <div className="relative group">
                <button className="px-3 py-1.5 rounded-xl border border-[#E5E5EA] text-[11px] font-semibold text-[#3A3A3C] hover:bg-[#F2F2F7]">Export ▾</button>
                <div className="absolute right-0 top-9 bg-white rounded-xl border border-[#f0f0f5] shadow-lg z-20 overflow-hidden min-w-[140px] hidden group-hover:block">
                  <button onClick={() => exportCol(activeColObj._id, "md")} className="block w-full text-left px-4 py-2 text-[12px] text-[#3A3A3C] hover:bg-[#F2F2F7]">Markdown (.md)</button>
                  <button onClick={() => exportCol(activeColObj._id, "anki")} className="block w-full text-left px-4 py-2 text-[12px] text-[#3A3A3C] hover:bg-[#F2F2F7]">Anki deck (.csv)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI summary card */}
        {aiSummary.colId && activeColObj && aiSummary.colId === activeColObj._id && (
          <div className="px-4 py-3 mb-4 rounded-2xl bg-gradient-to-r from-[#AF52DE]/6 to-[#007AFF]/6 border border-[#AF52DE]/20">
            <p className="text-[10px] font-bold text-[#AF52DE] tracking-[0.14em] uppercase mb-2">✨ Stellar's take</p>
            {aiSummary.loading ? (
              <p className="text-[12px] text-[#8E8E93]">Thinking…</p>
            ) : (
              <p className="text-[12px] text-[#3A3A3C] whitespace-pre-line leading-relaxed">{aiSummary.text}</p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-xl mb-4">{error}</div>
        )}

        {/* Empty */}
        {filteredQuestions.length === 0 && filteredTopics.length === 0 && filteredSections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F2F2F7] flex items-center justify-center mb-4 text-[26px]">☆</div>
            <p className="text-[17px] font-semibold text-[#1C1C1E] mb-1">{search ? "No results found" : "Nothing saved here yet"}</p>
            <p className="text-[13px] text-[#8E8E93] mb-6 max-w-xs leading-relaxed">
              {search ? "Try a different search term or clear the filter." : activeCol !== "all" ? "No bookmarks in this collection. Hover any card and click + to add it here." : "Tap ☆ on any question in Practice or any topic in Learn to save it here."}
            </p>
            {!search && (
              <div className="flex gap-3">
                {activeCol !== "all" && <button onClick={() => setActiveCol("all")} className="px-5 py-2.5 rounded-xl bg-[#007AFF] text-white text-[13px] font-semibold">View All saved →</button>}
                <button onClick={() => navigate("/practice")} className="px-5 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-[13px] font-semibold">Go to Practice →</button>
              </div>
            )}
          </div>
        )}

        {/* Question grid / list */}
        {visible.length > 0 && (
          <>
            {density === "list" ? (
              <div className="bg-white rounded-2xl border border-[#f0f0f5] overflow-hidden">
                {visible.map((q) => (
                  <BookmarkCard key={q._id} q={q} density="list"
                    selected={selected.has(q._id)} onSelectToggle={() => toggleSelect(q._id)}
                    mastered={!!reviews[q._id]?.mastered} review={reviews[q._id]}
                    onRemove={handleRemove} onPractice={handlePractice}
                    onToggleMastery={handleToggleMastery} onAddNote={handleAddNote}
                    customCols={customCols} memberMap={memberMap}
                    onAddToCollection={handleAddToCollection} onReview={handleReview} />
                ))}
              </div>
            ) : (
              <div className={density === "compact" ? "columns-3 gap-3" : "columns-2 gap-4"}>
                {visible.map((q) => (
                  <div key={q._id} className={`${density === "compact" ? "mb-3" : "mb-4"} break-inside-avoid`}>
                    <BookmarkCard q={q} density={density}
                      selected={selected.has(q._id)} onSelectToggle={() => toggleSelect(q._id)}
                      mastered={!!reviews[q._id]?.mastered} review={reviews[q._id]}
                      onRemove={handleRemove} onPractice={handlePractice}
                      onToggleMastery={handleToggleMastery} onAddNote={handleAddNote}
                      customCols={customCols} memberMap={memberMap}
                      onAddToCollection={handleAddToCollection} onReview={handleReview} />
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 mt-3 pt-4 border-t border-[#F2F2F7]">
              <p className="text-[12px] text-[#8E8E93]">Showing {visible.length} of {filteredQuestions.length}</p>
              {hasMore && <button onClick={() => setShowCount((n) => n + 24)} className="text-[12px] font-semibold text-[#007AFF] hover:opacity-70">· Load more →</button>}
            </div>
          </>
        )}

        {/* Topics */}
        {filteredTopics.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase">Saved Topics & Lessons</p>
                <p className="text-[12px] text-[#8E8E93] mt-0.5">Bookmarked from Learn · click to study</p>
              </div>
              <button onClick={() => navigate("/lessons")} className="text-[12px] font-semibold text-[#007AFF] hover:opacity-70">Browse Learn →</button>
            </div>
            <div className={density === "list" ? "bg-white rounded-2xl border border-[#f0f0f5] overflow-hidden" : "columns-2 gap-4"}>
              {filteredTopics.map((item) => (
                <div key={item.topicId} className={density === "list" ? "" : "mb-4 break-inside-avoid"}>
                  <TopicSavedCard item={item} density={density} customCols={customCols} memberMap={memberMap}
                    onRemove={handleRemoveTopic} onStudy={handleStudyTopic} onAddToCollection={handleAddToCollection} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        {filteredSections.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-bold text-[#8E8E93] tracking-[0.14em] uppercase">Saved Insights</p>
                <p className="text-[12px] text-[#8E8E93] mt-0.5">Sections you starred inside topic pages · {filteredSections.length} saved</p>
              </div>
            </div>
            <div className="columns-2 gap-4">
              {filteredSections.map((item) => (
                <div key={item.bmId} className="mb-4 break-inside-avoid">
                  <SectionSavedCard item={item} onRemove={handleRemoveSection} onOpen={handleOpenSection} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingCol && <EditCollectionModal collection={editingCol} onClose={() => setEditingCol(null)} onSave={handleEditCollection} />}
      {shareCol   && <ShareModal collection={shareCol} onClose={() => setShareCol(null)} onGenerate={generateShare} onRevoke={revokeShare} shareUrl={shareUrl} generating={generating} />}
      {reviewQueue && <ReviewModal items={reviewQueue} onClose={() => { setReviewQueue(null); refreshSmart(); }} onRate={handleReview} />}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import {
  getMyEnrollment,
  joinSchoolByCode,
  createSchool,
  listMySchools,
  getSchoolDetail,
  getDynamicTopics,
  getHomeworkQuestion,
} from "../services/api";

const CHAPTER_NAMES = {
  ch1: "Real Numbers", ch2: "Polynomials", ch3: "Pair of Linear Equations",
  ch4: "Quadratic Equations", ch5: "Arithmetic Progressions", ch6: "Triangles",
  ch7: "Coordinate Geometry", ch8: "Introduction to Trigonometry",
  ch9: "Applications of Trigonometry", ch10: "Circles",
  ch11: "Areas Related to Circles", ch12: "Surface Areas & Volumes",
  ch13: "Statistics", ch14: "Probability",
};

function chapterLabel(topicId) {
  const ch = topicId?.match(/^(ch\d+)/)?.[1];
  return CHAPTER_NAMES[ch] || topicId;
}

// ── Clipboard copy helper ─────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button onClick={copy}
      className="ml-2 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20 transition-colors">
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ── Uniqueness badge ──────────────────────────────────────────────────────────
function UniqueBadge({ guaranteed }) {
  return guaranteed ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-apple-green/10 text-apple-green">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Unique in your school
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-apple-orange/10 text-apple-orange">
      Personal variant
    </span>
  );
}

// ── Question card ─────────────────────────────────────────────────────────────
function QuestionCard({ q }) {
  const [selected, setSelected]   = useState(null);
  const [textAns, setTextAns]     = useState("");
  const [checked, setChecked]     = useState(false);
  const [correct, setCorrect]     = useState(null);

  const isMcq = q.questionType === "mcq";

  const buildOptions = () => {
    if (q.options?.length) return q.options;
    const all = [q.correctAnswer, ...(q.distractors?.map((d) => d.text) || [])];
    return all.slice(0, 4).map((text) => ({ text }));
  };

  const check = () => {
    const ans = isMcq
      ? (selected !== null ? buildOptions()[selected]?.text : null)
      : textAns.trim();
    if (ans === null || ans === "") return;
    setCorrect(String(ans).trim() === String(q.correctAnswer).trim());
    setChecked(true);
  };

  const reset = () => { setSelected(null); setTextAns(""); setChecked(false); setCorrect(null); };

  return (
    <div className="card p-5 space-y-4">
      {/* Meta row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] text-apple-gray font-medium uppercase tracking-wide">
          {chapterLabel(q.topicId)} · {q.difficulty} · {q.marks} mark{q.marks !== 1 ? "s" : ""}
        </span>
        <UniqueBadge guaranteed={q._meta?.uniquenessGuaranteed} />
      </div>

      {/* Question text */}
      <p className="text-[15px] font-medium text-[var(--label)] leading-relaxed">{q.questionText}</p>

      {/* Answer input */}
      {isMcq ? (
        <div className="space-y-2">
          {buildOptions().map((opt, i) => {
            const isSelected = selected === i;
            const isCorrectOpt = checked && opt.text === q.correctAnswer;
            const isWrong = checked && isSelected && opt.text !== q.correctAnswer;
            return (
              <button key={i} disabled={checked} onClick={() => setSelected(i)}
                className={`w-full text-left px-4 py-2.5 rounded-apple-lg border text-[13px] transition-all
                  ${isCorrectOpt ? "border-apple-green bg-apple-green/8 text-apple-green font-medium" :
                    isWrong     ? "border-apple-red bg-apple-red/8 text-apple-red" :
                    isSelected  ? "border-apple-blue bg-apple-blue/8 text-apple-blue" :
                                  "border-[var(--separator)] hover:border-apple-blue/40"}`}>
                {opt.text}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type="text" disabled={checked} value={textAns} onChange={(e) => setTextAns(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Type your answer…"
          className="input w-full" />
      )}

      {/* Result banner */}
      {checked && (
        <div className={`rounded-apple-lg px-4 py-2.5 text-[13px] font-medium
          ${correct ? "bg-apple-green/10 text-apple-green" : "bg-apple-red/10 text-apple-red"}`}>
          {correct ? "Correct!" : `Incorrect. Answer: ${q.correctAnswer}`}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!checked
          ? <button onClick={check} className="btn-primary text-[13px] py-1.5 px-4">Check Answer</button>
          : <button onClick={reset} className="btn-secondary text-[13px] py-1.5 px-4">Try Another</button>
        }
      </div>
    </div>
  );
}

// ── School roster row ─────────────────────────────────────────────────────────
function SchoolCard({ group, onExpand, expanded, detail, loadingDetail }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-[var(--label)]">{group.schoolName}</p>
          <p className="text-[12px] text-apple-gray mt-0.5">
            {group.studentCount ?? group.enrolledStudentIds?.length ?? 0} student
            {(group.studentCount ?? group.enrolledStudentIds?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-apple-gray mb-1">Join code</p>
          <span className="font-mono text-[16px] font-bold tracking-widest text-apple-blue">
            {group.joinCode}
          </span>
          <CopyButton text={group.joinCode} />
        </div>
      </div>

      <button onClick={onExpand}
        className="mt-3 text-[12px] text-apple-blue hover:underline flex items-center gap-1">
        {expanded ? "Hide roster" : "View roster"}
        <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 border-t border-[var(--separator)] pt-3">
          {loadingDetail ? (
            <p className="text-[12px] text-apple-gray">Loading…</p>
          ) : detail?.students?.length ? (
            <div className="space-y-1.5">
              {detail.students.map((s) => (
                <div key={s.userId} className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--label)]">{s.name}</span>
                  <span className="text-apple-gray font-mono text-[11px]">
                    variant #{s.variantIndex} · {s.email}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-apple-gray">No students enrolled yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SchoolGroups() {
  const [tab, setTab] = useState("homework"); // "homework" | "manage"

  // Enrollment state
  const [enrollment, setEnrollment]   = useState(null);  // null = not enrolled
  const [joinCode, setJoinCode]       = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError]     = useState("");

  // Homework state
  const [topics, setTopics]           = useState([]);
  const [topicId, setTopicId]         = useState("");
  const [difficulty, setDifficulty]   = useState("medium");
  const [question, setQuestion]       = useState(null);
  const [hwLoading, setHwLoading]     = useState(false);
  const [hwError, setHwError]         = useState("");
  const [questionKey, setQuestionKey] = useState(0); // force re-mount on new question

  // Manage state
  const [schools, setSchools]         = useState([]);
  const [newName, setNewName]         = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [expandedId, setExpandedId]   = useState(null);
  const [details, setDetails]         = useState({});
  const [detailLoading, setDetailLoading] = useState({});

  // Load on mount
  useEffect(() => {
    getMyEnrollment().then((r) => setEnrollment(r.data.data?.enrolled === false ? null : r.data.data)).catch(() => {});
    getDynamicTopics().then((r) => {
      setTopics(r.data.data || []);
      if (r.data.data?.length) setTopicId(r.data.data[0].topicId);
    }).catch(() => {});
    if (tab === "manage") loadSchools();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "manage") loadSchools();
  }, [tab]);

  const loadSchools = () => {
    listMySchools().then((r) => setSchools(r.data.data || [])).catch(() => {});
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setJoinLoading(true); setJoinError("");
    try {
      const r = await joinSchoolByCode(joinCode.trim().toUpperCase());
      setEnrollment(r.data.data);
      setJoinCode("");
    } catch (e) {
      setJoinError(e.response?.data?.error || "Invalid join code");
    } finally { setJoinLoading(false); }
  };

  const handleGetQuestion = async () => {
    if (!topicId) return;
    setHwLoading(true); setHwError(""); setQuestion(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const r = await getHomeworkQuestion({ topicId, difficulty, assessmentId: `hw_${today}`, slotId: "q1" });
      setQuestion(r.data.data);
      setQuestionKey((k) => k + 1);
    } catch (e) {
      setHwError(e.response?.data?.error || "Could not load question");
    } finally { setHwLoading(false); }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreateLoading(true); setCreateError("");
    try {
      await createSchool(newName.trim());
      setNewName("");
      loadSchools();
    } catch (e) {
      setCreateError(e.response?.data?.error || "Failed to create group");
    } finally { setCreateLoading(false); }
  };

  const toggleRoster = useCallback(async (groupId) => {
    if (expandedId === groupId) { setExpandedId(null); return; }
    setExpandedId(groupId);
    if (details[groupId]) return;
    setDetailLoading((p) => ({ ...p, [groupId]: true }));
    try {
      const r = await getSchoolDetail(groupId);
      setDetails((p) => ({ ...p, [groupId]: r.data.data }));
    } catch { /* ignore */ }
    finally { setDetailLoading((p) => ({ ...p, [groupId]: false })); }
  }, [expandedId, details]);

  // Group topics by chapter for dropdown
  const topicsByChapter = topics.reduce((acc, t) => {
    const ch = t.topicId.match(/^(ch\d+)/)?.[1] || "other";
    if (!acc[ch]) acc[ch] = [];
    acc[ch].push(t);
    return acc;
  }, {});

  const selectedTopicDifficulties = topics.find((t) => t.topicId === topicId)?.difficulties || [];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[var(--label)]">School Groups</h1>
        <p className="text-[13px] text-apple-gray mt-1">
          Unique homework for every student — no two classmates get the same question.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--fill)] rounded-apple-lg w-fit">
        {[["homework", "Homework"], ["manage", "Manage Groups"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all
              ${tab === key ? "bg-[var(--card)] text-[var(--label)] shadow-sm" : "text-apple-gray hover:text-[var(--label)]"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Homework tab ─────────────────────────────────────────── */}
      {tab === "homework" && (
        <div className="space-y-5">
          {/* Enrollment card */}
          {enrollment ? (
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-apple-green/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-apple-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[var(--label)]">{enrollment.schoolName}</p>
                  <p className="text-[12px] text-apple-gray">
                    Slot #{enrollment.variantIndex} · Your questions are unique to your position in the class
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-apple-green/10 text-apple-green text-[11px] font-semibold rounded-full">
                  Enrolled
                </span>
              </div>
            </div>
          ) : (
            <div className="card p-5 space-y-3">
              <p className="text-[14px] font-semibold text-[var(--label)]">Join a School Group</p>
              <p className="text-[12px] text-apple-gray">
                Ask your teacher for the 6-character join code to get school-guaranteed unique homework.
              </p>
              <div className="flex gap-2">
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="ABC123"
                  className="input font-mono tracking-widest uppercase text-center text-[18px] w-36" />
                <button onClick={handleJoin} disabled={joinLoading || !joinCode.trim()}
                  className="btn-primary disabled:opacity-50">
                  {joinLoading ? "Joining…" : "Join"}
                </button>
              </div>
              {joinError && <p className="text-[12px] text-apple-red">{joinError}</p>}
              <p className="text-[11px] text-apple-gray">
                Not in a school group? You'll still get personalised unique questions — just without school-wide deduplication.
              </p>
            </div>
          )}

          {/* Question picker */}
          <div className="card p-5 space-y-4">
            <p className="text-[14px] font-semibold text-[var(--label)]">Get Today's Homework Question</p>

            <div className="grid grid-cols-2 gap-3">
              {/* Topic picker */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-apple-gray">Topic</label>
                <select value={topicId} onChange={(e) => { setTopicId(e.target.value); setQuestion(null); }}
                  className="input w-full text-[13px]">
                  {Object.entries(topicsByChapter).map(([ch, tpls]) => (
                    <optgroup key={ch} label={CHAPTER_NAMES[ch] || ch}>
                      {tpls.map((t) => (
                        <option key={t.topicId} value={t.topicId}>
                          {t.topicId} ({t.difficulties.join("/")})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Difficulty picker */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-apple-gray">Difficulty</label>
                <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setQuestion(null); }}
                  className="input w-full text-[13px]">
                  {["easy", "medium", "hard"].filter((d) =>
                    selectedTopicDifficulties.length === 0 || selectedTopicDifficulties.includes(d)
                  ).map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={handleGetQuestion} disabled={hwLoading || !topicId}
              className="btn-primary w-full disabled:opacity-50">
              {hwLoading ? "Generating…" : "Get My Question"}
            </button>

            {hwError && <p className="text-[12px] text-apple-red">{hwError}</p>}
          </div>

          {/* Question display */}
          {question && <QuestionCard key={questionKey} q={question} />}
        </div>
      )}

      {/* ── Manage tab ───────────────────────────────────────────── */}
      {tab === "manage" && (
        <div className="space-y-5">
          {/* Create form */}
          <div className="card p-5 space-y-3">
            <p className="text-[14px] font-semibold text-[var(--label)]">Create a School Group</p>
            <p className="text-[12px] text-apple-gray">
              Give your class a name. Students join using the generated 6-character code.
            </p>
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Section A — St. Xavier's"
                className="input flex-1" />
              <button onClick={handleCreate} disabled={createLoading || !newName.trim()}
                className="btn-primary disabled:opacity-50">
                {createLoading ? "Creating…" : "Create"}
              </button>
            </div>
            {createError && <p className="text-[12px] text-apple-red">{createError}</p>}
          </div>

          {/* Groups list */}
          {schools.length > 0 ? (
            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-apple-gray uppercase tracking-wide">
                My Groups ({schools.length})
              </p>
              {schools.map((g) => (
                <SchoolCard
                  key={g._id} group={g}
                  expanded={expandedId === g._id}
                  detail={details[g._id]}
                  loadingDetail={!!detailLoading[g._id]}
                  onExpand={() => toggleRoster(g._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-apple-gray text-[13px]">
              No groups yet. Create one above to get started.
            </div>
          )}

          {/* How it works */}
          <div className="rounded-apple-lg bg-apple-blue/5 border border-apple-blue/20 p-4 space-y-2">
            <p className="text-[13px] font-semibold text-apple-blue">How uniqueness works</p>
            <ul className="space-y-1.5">
              {[
                "Each student's slot in the class gets a unique seeded question variant.",
                "Same student, same day → same question (resumable). Different students → different questions.",
                "Powered by a seeded PRNG — no extra API calls, zero cost.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12px] text-apple-gray">
                  <span className="text-apple-blue mt-0.5">·</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sgDashboard, sgSendKudos, sgCreateChallenge, sgPostTeacher, sgReactPost,
  sgCommentPost, sgSetFocus, sgGetPrefs, sgUpdatePrefs, sgReport,
  joinSchoolByCode, createSchool,
} from "../services/api";
import { useAuthStore } from "../store/authStore";

const AVATAR_PALETTE = ["#7c3aed","#f472b6","#fb923c","#34c759","#06b6d4","#a78bfa","#facc15","#fda4af"];
const fmtTimeAgo = (d) => {
  const ms = Date.now() - new Date(d).getTime();
  const h = Math.floor(ms / 3600_000);
  if (h < 1) return `${Math.floor(ms / 60_000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function SchoolGroups() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("week"); // week | month | term
  const [prefs, setPrefs] = useState({ anonymousMode: false, hideRank: false, blockedIds: [], mutedIds: [] });
  const [showPrefs, setShowPrefs] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [kudosTarget, setKudosTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [showCommentFor, setShowCommentFor] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 2500); };

  const refresh = async () => {
    try {
      const r = await sgDashboard();
      setData(r.data?.data);
      const p = await sgGetPrefs();
      setPrefs(p.data?.data || prefs);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []); // eslint-disable-line

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#E5E5EA] border-t-[#7c3aed] rounded-full animate-spin" />
    </div>
  );

  if (!data?.hasGroup) {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl p-10 text-center light-on-gradient" style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3, #fef3c7)" }}>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7c3aed]/70 mb-2">School groups</p>
          <h2 className="text-[32px] font-bold text-[#1c1c1e] mb-2" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
            Find your class.
          </h2>
          <p className="text-[13px] text-[#3A3A3C] mb-6 max-w-md mx-auto">Compete with your classmates, share teacher updates, and beat the class challenge together.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setShowJoin(true)} className="px-5 py-2.5 rounded-full bg-[#1c1c1e] text-white text-[13px] font-bold hover:bg-[#3A3A3C]">Enter join code →</button>
            <button onClick={() => setShowCreate(true)} style={{ background: "#ffffff", color: "#1c1c1e" }} className="px-5 py-2.5 rounded-full border border-[#1c1c1e]/20 text-[13px] font-bold hover:opacity-90">+ Create new class</button>
          </div>
        </div>

        {/* Help card */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#7c3aed] mb-2">If your teacher set one up</p>
            <p className="text-[13px] text-[#3A3A3C]">Ask them for the <span className="font-bold">8-character join code</span> — it looks like <code className="bg-[#F2F2F7] px-1.5 py-0.5 rounded text-[11px]">DPSXB123</code>. Tap "Enter join code" above.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#fb923c] mb-2">If you're the first one in</p>
            <p className="text-[13px] text-[#3A3A3C]">Create a class for your school, then share the code with your classmates. You'll all see each other's progress, challenges, and teacher posts.</p>
          </div>
        </div>

        {showJoin && <JoinModal joinCode={joinCode} setJoinCode={setJoinCode} onClose={() => setShowJoin(false)}
          onJoin={async () => { try { await joinSchoolByCode(joinCode); setShowJoin(false); refresh(); showToast("Joined!"); } catch (e) { showToast(e.response?.data?.error || "Join failed", "err"); } }} />}
        {showCreate && <CreateClassModal onClose={() => setShowCreate(false)}
          onCreate={async (name) => {
            try {
              const r = await createSchool(name);
              const group = r.data?.data || r.data;
              setShowCreate(false);
              refresh();
              showToast(`Created! Share code: ${group?.joinCode || ""}`);
            } catch (e) { showToast(e.response?.data?.error || "Create failed", "err"); }
          }} />}
      </div>
    );
  }

  const { school, stats, leaderboard, challenge, teacherPost, cluster, subjectFocus, inviteLink } = data;
  const rows = leaderboard?.week || [];

  const handleKudos = async (toId, emoji) => {
    try {
      await sgSendKudos({ toId, schoolGroupId: school.groupId, emoji: emoji || "👏", message: "" });
      showToast("Kudos sent 👏");
      setKudosTarget(null);
    } catch { showToast("Failed", "err"); }
  };

  const handlePrefsUpdate = async (patch) => {
    try { const r = await sgUpdatePrefs(patch); setPrefs(r.data?.data || patch); showToast("Updated"); }
    catch { showToast("Failed", "err"); }
  };

  const handleReact = async (postId, emoji) => {
    try { await sgReactPost(postId, emoji); refresh(); } catch {}
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try { await sgCommentPost(postId, commentText); setCommentText(""); setShowCommentFor(null); refresh(); }
    catch {}
  };

  const handleReport = async (reason, note) => {
    try { await sgReport({ targetId: reportTarget, schoolGroupId: school.groupId, reason, note }); setReportTarget(null); showToast("Reported"); }
    catch { showToast("Failed", "err"); }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5 items-start">
      {/* ── Left/center column ── */}
      <div className="lg:col-span-2 space-y-5">

        {/* HERO with cluster (mockup) */}
        <div className="relative rounded-3xl p-7 lg:p-9 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #d4b4f0 0%, #f0a4cc 50%, #fad4a4 100%)" }}>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1c1c1e]/55 mb-2">
            {school.name?.toUpperCase()} · CLASS {school.classCode}
          </p>
          <h1 className="text-[34px] sm:text-[44px] font-bold leading-[1.05] text-[#1c1c1e] tracking-tight mb-5 max-w-xl">
            <em className="not-italic" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontWeight: 700 }}>
              {school.classmateCount} classmates
            </em> are studying with you.
          </h1>
          <div className="flex gap-8 flex-wrap">
            <div>
              <p className="text-[26px] font-bold text-[#1c1c1e] leading-none">{stats.myRank ? <>{stats.myRank}<sup className="text-[12px] ml-0.5">{ordinalSuffix(stats.myRank)}</sup></> : "—"}</p>
              <p className="text-[10px] text-[#1c1c1e]/60 mt-1">your class rank</p>
            </div>
            <div>
              <p className="text-[26px] font-bold text-[#1c1c1e] leading-none">{stats.groupQuestionsToday.toLocaleString()}</p>
              <p className="text-[10px] text-[#1c1c1e]/60 mt-1">group questions today</p>
            </div>
            <div>
              <p className="text-[26px] font-bold text-[#1c1c1e] leading-none">+{stats.myGainThisWeek}</p>
              <p className="text-[10px] text-[#1c1c1e]/60 mt-1">your gain this week</p>
            </div>
          </div>
          {/* Avatar cluster — top right */}
          <div className="absolute right-7 top-6 hidden md:block">
            <ClusterCloud cluster={cluster} you={{ name: user?.name, studying: true }} />
          </div>
        </div>

        {/* LEADERBOARD CARD */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93]">This week's class leaderboard</p>
              <p className="text-[14px] font-semibold text-[#1c1c1e]">
                {school.classCode}{subjectFocus?.subject ? ` · ${subjectFocus.subject} focus week` : ""}
              </p>
            </div>
            <div className="flex gap-1 p-1 bg-[#F2F2F7] rounded-full">
              {["week","month","term"].map((t) => (
                <button key={t} onClick={() => setView(t)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${view === t ? "bg-[#1c1c1e] text-white" : "text-[#8e8e93]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-0">
            {rows.slice(0, 12).map((r, i) => (
              <LeaderboardRow key={r.userId} row={r} rank={i + 1}
                onKudos={() => setKudosTarget(r)} onReport={() => setReportTarget(r.userId)} />
            ))}
            {rows.length === 0 && (
              <p className="text-[12px] text-[#8e8e93] text-center py-6">No activity yet — be the first to practice!</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="space-y-5">

        {/* ACTIVE CLASS CHALLENGE (dark mockup card) */}
        {challenge ? (
          <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(180deg, #1c1c1e, #0a0a0a)" }}>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-3">Active class challenge</p>
            <h3 className="text-[28px] font-bold leading-tight mb-2" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic" }}>
              {challenge.title}
            </h3>
            {challenge.rewardText && <p className="text-[12px] text-white/70 leading-relaxed mb-4">{challenge.rewardText}</p>}
            <div className="space-y-2 mb-3">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${Math.min(100, (challenge.currentCount / challenge.targetCount) * 100)}%`,
                  background: "linear-gradient(90deg, #f472b6, #fb923c)" }} />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-white/60">{challenge.currentCount} / {challenge.targetCount} · {challenge.daysLeft} days left</span>
                <span className="text-[#fb923c] font-bold">You: {challenge.myContribution} contributed</span>
              </div>
            </div>
            <button onClick={() => navigate("/practice")} className="w-full py-2.5 rounded-xl bg-white text-[#1c1c1e] text-[13px] font-bold hover:bg-white/90">
              Solve 5 more →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] text-center">
            <p className="text-[12px] text-[#8e8e93]">No active challenge.</p>
          </div>
        )}

        {/* TEACHER POST */}
        {teacherPost && (
          <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#1c1c1e] text-white text-[11px] font-bold flex items-center justify-center">
                {(teacherPost.teacherName || "T").split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#1c1c1e] leading-tight">{teacherPost.teacherName}</p>
                <p className="text-[11px] text-[#8e8e93]">{teacherPost.teacherRole}</p>
              </div>
            </div>
            <p className="text-[13px] italic text-[#3A3A3C] leading-relaxed mb-3">"{teacherPost.message}"</p>
            <div className="flex items-center justify-between text-[10px] text-[#8e8e93]">
              <span>posted {fmtTimeAgo(teacherPost.at)} · {teacherPost.readCount} read</span>
              <div className="flex gap-2">
                <button onClick={() => handleReact(teacherPost._id, "👍")} className="hover:scale-110">👍</button>
                <button onClick={() => handleReact(teacherPost._id, "❤️")} className="hover:scale-110">❤️</button>
                <button onClick={() => setShowCommentFor(teacherPost._id)} className="text-[#7c3aed] font-semibold">Comment</button>
              </div>
            </div>
            {showCommentFor === teacherPost._id && (
              <div className="mt-3 flex gap-2">
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Reply…" maxLength={280}
                  className="flex-1 text-[12px] px-3 py-1.5 rounded-lg border border-[#E5E5EA] outline-none" />
                <button onClick={() => handleComment(teacherPost._id)} className="px-3 py-1.5 rounded-lg bg-[#7c3aed] text-white text-[11px] font-bold">Send</button>
              </div>
            )}
          </div>
        )}

        {/* INVITE A CLASSMATE */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[13px] font-bold text-[#1c1c1e] mb-1">Invite a classmate</p>
          <p className="text-[11px] text-[#8e8e93] mb-3">Both of you get 2 weeks of Pro free.</p>
          <div className="flex gap-2">
            <input readOnly value={inviteLink}
              className="flex-1 text-[11px] px-3 py-2 rounded-lg border border-[#E5E5EA] bg-[#FAFAFB] font-mono text-[#3A3A3C]"
              onClick={(e) => e.target.select()} />
            <button onClick={() => { navigator.clipboard.writeText(inviteLink); showToast("Link copied"); }}
              className="px-4 py-2 rounded-lg bg-[#1c1c1e] text-white text-[11px] font-bold">Copy</button>
          </div>
        </div>

        {/* PRIVACY / SETTINGS */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">Privacy</p>
          <Toggle label="Anonymous mode" value={prefs.anonymousMode} onChange={(v) => handlePrefsUpdate({ anonymousMode: v })}
            desc="Classmates see 'Anonymous' instead of your name" />
          <Toggle label="Hide my rank" value={prefs.hideRank} onChange={(v) => handlePrefsUpdate({ hideRank: v })}
            desc="Hide your row from the leaderboard" />
        </div>
      </div>

      {/* Modals */}
      {kudosTarget && <KudosModal target={kudosTarget} onClose={() => setKudosTarget(null)} onSend={handleKudos} />}
      {reportTarget && <ReportModal onClose={() => setReportTarget(null)} onSubmit={handleReport} />}
      {showPrefs && <PrefsDrawer prefs={prefs} onUpdate={handlePrefsUpdate} onClose={() => setShowPrefs(false)} />}

      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg text-[12px] font-semibold text-white ${
          toast.kind === "err" ? "bg-[#FF3B30]" : "bg-[#34C759]"
        }`}>{toast.msg}</div>
      )}
    </div>
  );
}

function ordinalSuffix(n) { const s = ["th","st","nd","rd"], v = n % 100; return s[(v - 20) % 10] || s[v] || s[0]; }

function LeaderboardRow({ row, rank, onKudos, onReport }) {
  const sparkPath = useMemo(() => generateSpark(row.totalScore), [row.totalScore]);
  return (
    <div className={`flex items-center gap-3 px-2 py-3 rounded-xl transition-colors hover:bg-[#FAFAFB] group ${row.isMe ? "bg-[#7c3aed]/6" : ""}`}>
      <span className="w-5 text-[12px] text-[#8e8e93]">{rank}</span>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
        style={{ background: rank === 1 ? "#1c1c1e" : AVATAR_PALETTE[rank % AVATAR_PALETTE.length] }}>
        {row.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-[13px] font-semibold text-[#1c1c1e] truncate">{row.name}</p>
          {rank === 1 && <span className="text-[12px]">👑</span>}
          {row.isMe && <span className="text-[10px] text-[#7c3aed] font-bold">you</span>}
        </div>
        <p className="text-[10px] text-[#8e8e93]">{row.streak} day streak · this week ++{row.pointsGained} pts</p>
      </div>
      <svg width="60" height="20" viewBox="0 0 60 20" className="text-[#8e8e93] opacity-50 shrink-0">
        <path d={sparkPath} stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
      <p className="text-[14px] font-bold tabular-nums text-[#1c1c1e] shrink-0">{row.totalScore.toLocaleString()}</p>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!row.isMe && (
          <>
            <button onClick={onKudos} title="Send kudos" className="text-[12px] hover:scale-110">👏</button>
            <button onClick={onReport} title="Report" className="text-[10px] text-[#C7C7CC] hover:text-[#FF3B30]">⚑</button>
          </>
        )}
      </div>
      <span className="text-[#C7C7CC] text-[14px]">›</span>
    </div>
  );
}

function generateSpark(score) {
  const pts = [];
  let seed = score % 100;
  for (let x = 0; x <= 60; x += 6) {
    seed = (seed * 31 + 7) % 100;
    const y = 4 + (seed / 100) * 12;
    pts.push(`${x},${y}`);
  }
  return "M" + pts.join(" L");
}

function ClusterCloud({ cluster, you }) {
  const positions = [
    { x: 90,  y: 0 },
    { x: 160, y: 10 },
    { x: 230, y: 30 },
    { x: 60,  y: 70 },
    { x: 150, y: 95 },
    { x: 245, y: 95 },
  ];
  const initialsYou = (you?.name || "?").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
  return (
    <div className="relative" style={{ width: 290, height: 140 }}>
      {cluster.map((c, i) => {
        const p = positions[i] || { x: 0, y: 0 };
        return (
          <div key={c.userId} className="absolute" style={{ left: p.x, top: p.y }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[11px] font-bold relative shadow"
              style={{ background: c.color }}>
              {c.initials}
              {c.studying && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#34C759] ring-2 ring-white" />}
            </div>
          </div>
        );
      })}
      <div className="absolute" style={{ left: 130, top: 50 }}>
        <div className="w-14 h-14 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold flex items-center justify-center ring-4 ring-white shadow-lg">
          {initialsYou}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange, desc }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-[#F2F2F7] last:border-0">
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#1c1c1e]">{label}</p>
        {desc && <p className="text-[10px] text-[#8e8e93]">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} className="w-10 h-5 rounded-full relative transition-colors shrink-0"
        style={{ background: value ? "#34C759" : "#E5E5EA" }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: value ? "calc(100% - 18px)" : "2px" }} />
      </button>
    </div>
  );
}

function KudosModal({ target, onClose, onSend }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[16px] font-bold text-[#1c1c1e] mb-1">Send kudos to {target.name}</h3>
        <p className="text-[12px] text-[#8e8e93] mb-4">Pick an emoji — quick, public to the class.</p>
        <div className="grid grid-cols-4 gap-2">
          {["👏","🔥","💪","🎯","🙌","⭐","🚀","💡"].map((e) => (
            <button key={e} onClick={() => onSend(target.userId, e)}
              className="aspect-square rounded-xl bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[24px] flex items-center justify-center">{e}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("inappropriate");
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[15px] font-bold text-[#1c1c1e] mb-3">Report classmate</h3>
        <div className="space-y-1 mb-3">
          {["harassment","spam","inappropriate","cheating","other"].map((r) => (
            <label key={r} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#FAFAFB] cursor-pointer">
              <input type="radio" name="rr" checked={reason === r} onChange={() => setReason(r)} className="accent-[#FF3B30]" />
              <span className="text-[12px] text-[#1c1c1e] capitalize">{r}</span>
            </label>
          ))}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional details…" rows={2} maxLength={500}
          className="w-full text-[12px] px-3 py-2 rounded-lg border border-[#E5E5EA] resize-none mb-3" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#E5E5EA] text-[11px] font-semibold">Cancel</button>
          <button onClick={() => onSubmit(reason, note)} className="flex-1 py-2 rounded-lg bg-[#FF3B30] text-white text-[11px] font-bold">Send</button>
        </div>
      </div>
    </div>
  );
}

function PrefsDrawer({ prefs, onUpdate, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[16px] font-bold text-[#1c1c1e]">Class privacy</h3>
        <Toggle label="Anonymous mode" desc="Classmates see 'Anonymous'" value={prefs.anonymousMode} onChange={(v) => onUpdate({ anonymousMode: v })} />
        <Toggle label="Hide my rank" desc="Hide your row entirely" value={prefs.hideRank} onChange={(v) => onUpdate({ hideRank: v })} />
        <button onClick={onClose} className="w-full mt-3 py-2 rounded-lg bg-[#1c1c1e] text-white text-[12px] font-bold">Done</button>
      </div>
    </div>
  );
}

function CreateClassModal({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    await onCreate(name.trim());
    setSubmitting(false);
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[16px] font-bold text-[#1c1c1e] mb-1">Create your class</h3>
        <p className="text-[12px] text-[#8e8e93] mb-4">e.g. "Delhi Public School · Class X-B". You'll get a join code to share.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Class name" maxLength={120}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full text-[14px] px-3 py-2.5 rounded-lg border border-[#E5E5EA] mb-3" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#E5E5EA] text-[12px] font-semibold">Cancel</button>
          <button onClick={submit} disabled={!name.trim() || submitting}
            className="flex-1 py-2 rounded-lg bg-[#1c1c1e] text-white text-[12px] font-bold disabled:opacity-50">
            {submitting ? "Creating…" : "Create →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function JoinModal({ joinCode, setJoinCode, onJoin, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[16px] font-bold text-[#1c1c1e] mb-1">Join your class</h3>
        <p className="text-[12px] text-[#8e8e93] mb-4">Ask your teacher or a classmate for the join code.</p>
        <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ABCD1234" maxLength={12}
          className="w-full text-[18px] font-mono text-center px-3 py-3 rounded-lg border border-[#E5E5EA] uppercase tracking-widest mb-3" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#E5E5EA] text-[12px] font-semibold">Cancel</button>
          <button onClick={onJoin} disabled={!joinCode.trim()} className="flex-1 py-2 rounded-lg bg-[#1c1c1e] text-white text-[12px] font-bold disabled:opacity-50">Join</button>
        </div>
      </div>
    </div>
  );
}

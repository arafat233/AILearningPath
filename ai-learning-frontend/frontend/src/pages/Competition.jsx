import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  compV2Dashboard, compV2CreateRoom, compV2JoinRoom, compV2LeaveRoom, compV2ReadyUp,
  compV2StartMatch, compV2RecordAnswer, compV2FinishMatch, compV2QuickMatch,
  compV2GetRoom, compV2Report,
} from "../services/api";
import { useAuthStore } from "../store/authStore";

const STATES = { LIST: "list", LOBBY: "lobby", COUNTDOWN: "countdown", LIVE: "live", RESULT: "result" };
const TIER_COLOR = { Bronze: "#a16207", Silver: "#94a3b8", Gold: "#eab308", Platinum: "#06b6d4", Diamond: "#a855f7", Master: "#f97316" };

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const initialsOf = (n = "") => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

export default function Competition() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [state, setState] = useState(STATES.LIST);
  const [d, setD] = useState(null);
  const [room, setRoom] = useState(null);     // active lobby/live
  const [match, setMatch] = useState(null);   // questions for live
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReport, setShowReport] = useState(null); // {targetId, matchId}
  const [reactions, setReactions] = useState([]); // floating emoji
  const [muteOpponent, setMuteOpponent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const questionStartRef = useRef(Date.now());

  // Initial dashboard
  const refresh = async () => {
    try { const r = await compV2Dashboard(); setD(r.data?.data); } catch {}
  };
  useEffect(() => { refresh(); }, []);

  // Lobby polling
  useEffect(() => {
    if (state !== STATES.LOBBY || !room?.code) return;
    const id = setInterval(async () => {
      try { const r = await compV2GetRoom(room.code); if (r.data?.data) setRoom(r.data.data); } catch {}
    }, 2000);
    return () => clearInterval(id);
  }, [state, room?.code]);

  // Countdown
  useEffect(() => {
    if (state !== STATES.COUNTDOWN) return;
    if (countdown <= 0) { setState(STATES.LIVE); setTimeLeft(600); questionStartRef.current = Date.now(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [state, countdown]);

  // Live timer
  useEffect(() => {
    if (state !== STATES.LIVE) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current); finish(); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [state]);

  // ── Actions ─────────────────────────────────────────────────────
  const handleQuickMatch = async () => {
    setLoading(true); setError("");
    try {
      const r = await compV2QuickMatch(user?.subject || "Math");
      setRoom(r.data?.data);
      setState(STATES.LOBBY);
    } catch (e) { setError(e.response?.data?.error || "Could not find a match"); }
    finally { setLoading(false); }
  };

  const handleCreate = async (body) => {
    setLoading(true); setError("");
    try {
      const r = await compV2CreateRoom(body);
      setRoom(r.data?.data);
      setShowCreate(false);
      setState(STATES.LOBBY);
    } catch (e) { setError(e.response?.data?.error || "Could not create"); }
    finally { setLoading(false); }
  };

  const handleJoin = async (code) => {
    setLoading(true);
    try {
      const r = await compV2JoinRoom(code);
      setRoom(r.data?.data);
      setState(STATES.LOBBY);
    } catch (e) { setError(e.response?.data?.error || "Could not join"); }
    finally { setLoading(false); }
  };

  const handleStart = async () => {
    if (!room) return;
    setLoading(true);
    try {
      const r = await compV2StartMatch(room.code);
      setMatch(r.data?.data);
      setCurrentIdx(0); setSelected(null); setCountdown(3);
      setState(STATES.COUNTDOWN);
    } catch (e) { setError(e.response?.data?.error || "Couldn't start"); }
    finally { setLoading(false); }
  };

  const handleConfirm = async () => {
    if (selected === null || !match) return;
    const q = match.questions[currentIdx];
    const correctIdx = (q.options || []).findIndex((o) => o.logicTag === "correct");
    const isCorrect = selected === correctIdx;
    const timeTaken = Math.floor((Date.now() - questionStartRef.current) / 1000);
    try { await compV2RecordAnswer(room.code, { questionId: String(q._id), isCorrect, timeTaken }); } catch {}
    if (currentIdx + 1 < match.questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      questionStartRef.current = Date.now();
    } else {
      finish();
    }
  };

  const finish = async () => {
    if (!room) return;
    clearInterval(timerRef.current);
    try {
      const r = await compV2FinishMatch(room.code);
      setResult(r.data?.data);
      setState(STATES.RESULT);
      refresh();
    } catch (e) { setError(e.response?.data?.error || "Submit failed"); setState(STATES.LIST); }
  };

  const sendReaction = (emoji) => {
    if (muteOpponent) return;
    setReactions((rs) => [...rs, { id: Date.now(), emoji }]);
    setTimeout(() => setReactions((rs) => rs.slice(1)), 2000);
  };

  // ── Live screen polling for opponents' scores ───────────────────
  useEffect(() => {
    if (state !== STATES.LIVE || !room?.code) return;
    const id = setInterval(async () => {
      try { const r = await compV2GetRoom(room.code); if (r.data?.data) setRoom(r.data.data); } catch {}
    }, 1500);
    return () => clearInterval(id);
  }, [state, room?.code]);

  // ── COUNTDOWN ──────────────────────────────────────────────────
  if (state === STATES.COUNTDOWN) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
      <div className="text-center space-y-3">
        <p className="text-[14px] font-semibold text-[#8E8E93] uppercase tracking-widest">Get ready · {room?.topic}</p>
        <div key={countdown} className="text-[120px] font-black text-[#1c1c1e] leading-none" style={{ animation: "scaleIn .4s" }}>
          {countdown > 0 ? countdown : "GO!"}
        </div>
        <p className="text-[13px] text-[#8E8E93]">{room?.participants?.length} players · 10 questions · 10 min</p>
        <style>{`@keyframes scaleIn { from { transform: scale(1.6); opacity:0 } to { transform: scale(1); opacity:1 } }`}</style>
      </div>
    </div>
  );

  // ── LIVE MATCH ─────────────────────────────────────────────────
  if (state === STATES.LIVE && match) {
    const q = match.questions[currentIdx];
    const correctIdx = (q.options || []).findIndex((o) => o.logicTag === "correct");
    const me = room?.participants?.find((p) => p.userId === user?._id);
    const others = (room?.participants || []).filter((p) => p.userId !== user?._id);
    const reactionEmojis = ["👍","💪","🔥","🤔","😅","💀"];
    return (
      <div className="space-y-4 max-w-3xl mx-auto relative">
        {/* Floating reactions */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          {reactions.map((r) => (
            <span key={r.id} className="text-[40px] absolute" style={{ animation: "floatUp 2s ease-out forwards" }}>{r.emoji}</span>
          ))}
        </div>
        <style>{`@keyframes floatUp { from { opacity:1; transform: translateY(0) } to { opacity:0; transform: translateY(-80px) } }`}</style>

        {/* Header with live scores */}
        <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5] flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-3">
            <p className="text-[12px] font-bold text-[#8E8E93]">Q{currentIdx + 1}/{match.questions.length}</p>
            <div className="flex-1 h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
              <div className="h-full bg-[#1c1c1e]" style={{ width: `${(currentIdx / match.questions.length) * 100}%` }} />
            </div>
          </div>
          <div className={`text-[16px] font-mono font-bold tabular-nums ${timeLeft < 60 ? "text-[#FF3B30]" : "text-[#1c1c1e]"}`}>{fmt(timeLeft)}</div>
        </div>

        {/* Live scoreboard */}
        <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93] mb-2">Live scores</p>
          <div className="space-y-2">
            <Score p={me} you />
            {others.map((p) => <Score key={p.userId} p={p} />)}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5] shadow-sm">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
            style={{ background: q.difficulty === "hard" ? "#FF3B3014" : q.difficulty === "medium" ? "#FF950014" : "#34C75914",
                     color:      q.difficulty === "hard" ? "#FF3B30"   : q.difficulty === "medium" ? "#FF9500"   : "#34C759" }}>
            {q.difficulty}
          </span>
          <h2 className="text-[16px] font-semibold text-[#1c1c1e] leading-snug mt-3 mb-4">{q.questionText}</h2>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-[14px] transition-all ${selected === i ? "border-[#1c1c1e] bg-[#1c1c1e]/5 font-semibold" : "border-[#E5E5EA] hover:border-[#1c1c1e]/40"}`}>
                <span className="text-[12px] text-[#8E8E93] mr-2">{String.fromCharCode(65 + i)}.</span>{opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Reactions + actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {reactionEmojis.map((e) => <button key={e} onClick={() => sendReaction(e)} className="text-[18px] px-2 py-1 rounded-lg hover:bg-[#F2F2F7]">{e}</button>)}
            <button onClick={() => setMuteOpponent((v) => !v)} title={muteOpponent ? "Unmute" : "Mute"} className="px-2 py-1 rounded-lg hover:bg-[#F2F2F7] text-[12px]">{muteOpponent ? "🔇" : "🔊"}</button>
          </div>
          <button onClick={handleConfirm} disabled={selected === null}
            className="px-6 py-2.5 rounded-xl bg-[#1c1c1e] text-white text-[14px] font-bold disabled:opacity-40">
            {currentIdx + 1 < match.questions.length ? "Confirm →" : "Finish →"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────
  if (state === STATES.RESULT && result) {
    const me = result.participants.find((p) => p.userId === user?._id);
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-7 border border-[#f0f0f5] shadow-sm text-center">
          <p className="text-[60px] font-black leading-none mb-2">{me?.rank === 1 ? "🥇" : me?.rank === 2 ? "🥈" : me?.rank === 3 ? "🥉" : `#${me?.rank}`}</p>
          <p className="text-[24px] font-bold text-[#1c1c1e]">{me?.score} pts · {me?.correct}/{me?.answered} correct</p>
          <p className={`text-[14px] font-bold mt-1 ${me?.ratingChange >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"}`}>
            {me?.ratingChange >= 0 ? "+" : ""}{me?.ratingChange} rating
          </p>
        </div>
        {/* Final scoreboard */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93] mb-3">Final scoreboard</p>
          <div className="space-y-1.5">
            {result.participants.map((p) => (
              <div key={p.userId} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${p.userId === user?._id ? "bg-[#7c3aed]/8" : "bg-[#FAFAFB]"}`}>
                <span className="w-6 text-[14px] font-bold text-[#1c1c1e]">{p.rank}</span>
                <div className="w-8 h-8 rounded-full bg-[#1c1c1e] text-white text-[11px] font-bold flex items-center justify-center">{initialsOf(p.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1c1c1e] truncate">{p.name}{p.userId === user?._id ? " (you)" : ""}</p>
                  <p className="text-[11px] text-[#8E8E93]">{p.correct}/{p.answered} · {p.ratingChange >= 0 ? "+" : ""}{p.ratingChange}</p>
                </div>
                <p className="text-[16px] font-bold tabular-nums text-[#1c1c1e]">{p.score}</p>
                {p.userId !== user?._id && (
                  <button onClick={() => setShowReport({ targetId: p.userId, matchId: String(result._id) })} title="Report" className="text-[#C7C7CC] hover:text-[#FF3B30] text-[12px]">⚑</button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setState(STATES.LIST); setRoom(null); setResult(null); }} className="flex-1 py-3 rounded-xl border border-[#E5E5EA] text-[13px] font-semibold">Back to arena</button>
          <button onClick={handleQuickMatch} className="flex-1 py-3 rounded-xl bg-[#1c1c1e] text-white text-[13px] font-semibold">Play again →</button>
        </div>
        {showReport && <ReportModal data={showReport} onClose={() => setShowReport(null)} />}
      </div>
    );
  }

  // ── LOBBY ──────────────────────────────────────────────────────
  if (state === STATES.LOBBY && room) {
    const isHost = room.hostId === user?._id;
    const allReady = room.participants.length >= 2 && room.participants.every((p) => p.ready || p.userId === room.hostId);
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="rounded-2xl p-6 border border-[#f0f0f5] bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93]">Lobby · {room.code}</p>
              <h2 className="text-[20px] font-bold text-[#1c1c1e] mt-1">{room.topic}</h2>
              <p className="text-[12px] text-[#8E8E93]">{room.subject} · {room.difficulty} · {room.participants.length}/{room.capacity}</p>
            </div>
            <button onClick={() => { compV2LeaveRoom(room.code); setState(STATES.LIST); setRoom(null); }}
              className="text-[12px] text-[#FF3B30] font-semibold">Leave</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Array.from({ length: room.capacity }).map((_, i) => {
              const p = room.participants[i];
              return (
                <div key={i} className={`rounded-xl p-3 text-center ${p ? "bg-[#FAFAFB] border border-[#f0f0f5]" : "bg-[#F2F2F7] border border-dashed border-[#C7C7CC]"}`}>
                  {p ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold flex items-center justify-center mx-auto mb-1.5">{initialsOf(p.name)}</div>
                      <p className="text-[12px] font-semibold text-[#1c1c1e] truncate">{p.name}{p.userId === user?._id ? " (you)" : ""}</p>
                      <p className="text-[10px] text-[#8E8E93]">{p.rating}</p>
                      {p.ready ? <span className="text-[10px] text-[#34C759] font-bold">✓ Ready</span> : <span className="text-[10px] text-[#8E8E93]">Waiting</span>}
                    </>
                  ) : <p className="text-[10px] text-[#C7C7CC] mt-3">Waiting…</p>}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-[#8E8E93] text-center mt-3">Share code <span className="font-mono font-bold text-[#1c1c1e]">{room.code}</span> with friends</p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => compV2ReadyUp(room.code)} className="flex-1 py-2.5 rounded-xl border border-[#E5E5EA] text-[13px] font-semibold">Ready ✓</button>
            {isHost && (
              <button onClick={handleStart} disabled={!allReady || loading}
                className="flex-1 py-2.5 rounded-xl bg-[#1c1c1e] text-white text-[13px] font-semibold disabled:opacity-40">Start match →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── LIST (main arena) ──────────────────────────────────────────
  return (
    <div className="space-y-5">
      {error && <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-xl">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Hero card (mockup-matching) */}
        <div className="lg:col-span-2 rounded-3xl p-7 lg:p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #d4b4f0 0%, #f0a4cc 50%, #fad4a4 100%)" }}>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1c1c1e]/60 mb-3">Weekly arena · resets Sunday</p>
          <h1 className="text-[36px] sm:text-[44px] font-bold leading-[1.1] text-[#1c1c1e] mb-3 tracking-tight">
            You're <em className="font-bold not-italic" style={{ fontFamily: "Georgia,'Times New Roman',serif", fontStyle: "italic", fontWeight: 700 }}>#{d?.arena?.rank ?? "—"}</em> this week.
          </h1>
          <p className="text-[14px] text-[#1c1c1e]/70 mb-5 max-w-md">
            {d?.arena?.rank === 1 ? "Top of the leaderboard. Defend it." :
             d?.arena?.rank ? `${(d.leaderboard[0]?.points || 0) - (d.arena.weeklyPoints || 0)} points behind first. Two solid sessions could do it.` :
             "Play your first match to enter the arena."}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleQuickMatch} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1c1e] text-white text-[13px] font-bold hover:opacity-90 disabled:opacity-50">
              ▶ Quick match
            </button>
            <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-full bg-white text-[#1c1c1e] text-[13px] font-bold hover:bg-white/90">Create room</button>
            <button onClick={() => setShowHistory(true)} className="px-4 py-2.5 rounded-full bg-white/40 backdrop-blur-sm text-[#1c1c1e] text-[12px] font-semibold">📜 History</button>
          </div>
        </div>

        {/* Arena stats sidebar */}
        <div className="bg-white rounded-3xl p-5 border border-[#f0f0f5] space-y-4">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93]">Your arena</p>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Points" value={d?.arena?.weeklyPoints ?? 0} color="#1c1c1e" />
            <Stat label="Rank"   value={d?.arena?.rank ? `#${d.arena.rank}` : "—"} color="#7c3aed" />
            <Stat label="Wins"   value={d?.arena?.wins ?? 0} color="#34C759" />
            <Stat label="Accuracy" value={d?.arena?.accuracy != null ? `${d.arena.accuracy}%` : "—"} color="#1c1c1e" />
          </div>
          {/* Tier badge */}
          {d?.arena?.tier && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: `${TIER_COLOR[d.arena.tier.name]}14` }}>
              <span className="text-[16px]">{d.arena.tier.name === "Bronze" ? "🥉" : d.arena.tier.name === "Silver" ? "🥈" : d.arena.tier.name === "Gold" ? "🥇" : "💎"}</span>
              <div>
                <p className="text-[11px] font-bold" style={{ color: TIER_COLOR[d.arena.tier.name] }}>{d.arena.tier.name}</p>
                <p className="text-[10px] text-[#8E8E93]">{d.arena.rating} rating</p>
              </div>
            </div>
          )}
          {/* Win streak */}
          {(d?.arena?.winStreak ?? 0) > 0 && (
            <div className="px-3 py-2.5 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/20">
              <p className="text-[12px] font-bold text-[#FF9500]">🔥 {d.arena.winStreak}-match win streak</p>
              {d.arena.winStreak < 10 && <p className="text-[10px] text-[#FF9500]/70 mt-0.5">{10 - d.arena.winStreak} more for the "Unstoppable" badge.</p>}
            </div>
          )}
          {d?.arena?.beginnerProtection && (
            <p className="text-[10px] text-[#8E8E93]">🛡 Beginner protection: matched only with similar new players.</p>
          )}
        </div>
      </div>

      {/* Champion + daily quests */}
      <div className="grid md:grid-cols-2 gap-4">
        {d?.champion && (
          <div className="rounded-2xl p-4 border border-[#FFCC02]/30" style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#a16207] mb-1">👑 Champion of the week</p>
            <p className="text-[14px] font-bold text-[#1c1c1e]">{d.champion.name}</p>
            <p className="text-[11px] text-[#8E8E93]">{d.champion.points} points · rating {d.champion.rating}</p>
          </div>
        )}
        {d?.quests?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-[#f0f0f5]">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8E8E93] mb-2">Daily quests</p>
            <div className="space-y-2">
              {d.quests.map((q) => (
                <div key={q.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] ${q.completed ? "text-[#34C759] line-through" : "text-[#1c1c1e]"}`}>{q.label}</p>
                    <div className="h-1 bg-[#F2F2F7] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#34C759]" style={{ width: `${(q.progress / q.target) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#FF9500]">+{q.rewardXP}XP</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Class weekly leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] font-bold text-[#1c1c1e]">Class {user?.grade || "10"} · weekly leaderboard</p>
            <p className="text-[11px] text-[#8E8E93]">{(d?.leaderboard?.length || 0).toLocaleString()} students</p>
          </div>
          <div className="space-y-1">
            {(d?.leaderboard || []).slice(0, 7).map((row) => (
              <div key={row.userId} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${row.isYou ? "bg-[#7c3aed]/15 ring-1 ring-[#7c3aed]/50 shadow-sm" : "bg-[#FAFAFB] border border-[#f0f0f5] hover:bg-[#F2F2F7] hover:border-[#E5E5EA]"}`}>
                <span className={`w-5 text-[13px] font-semibold ${row.isYou ? "text-[#7c3aed]" : "text-[#1c1c1e]"}`}>{row.rank}</span>
                {row.rank === 1 ? <span className="text-[14px]">👑</span> : <div className="w-8 h-8 rounded-full bg-[#1c1c1e] text-white text-[10px] font-bold flex items-center justify-center">{initialsOf(row.name)}</div>}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1c1c1e] truncate">{row.name}{row.isYou ? " (you)" : ""}</p>
                  <p className="text-[10px] text-[#8E8E93]">~{row.matchesPlayed} matches</p>
                </div>
                <p className="text-[14px] font-bold tabular-nums text-[#1c1c1e]">{row.points.toLocaleString()}</p>
                {row.delta > 0 ? <span className="text-[10px] font-bold text-[#34C759] w-7 text-right">↑{row.delta}</span> :
                  row.delta < 0 ? <span className="text-[10px] font-bold text-[#FF3B30] w-7 text-right">↓{Math.abs(row.delta)}</span> :
                  <span className="text-[10px] text-[#C7C7CC] w-7 text-right">—</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Open rooms */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[14px] font-bold text-[#1c1c1e] mb-4">Open rooms</p>
          <div className="space-y-2">
            {(d?.rooms || []).slice(0, 6).map((r) => (
              <div key={r._id} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl hover:bg-[#FAFAFB]">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1c1c1e] truncate flex items-center gap-1.5">
                    {r.topic}
                    {r.participants.length === r.capacity - 1 && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />}
                  </p>
                  <p className="text-[10px] text-[#8E8E93] font-mono">{r.code} · {r.participants.length}/{r.capacity} · {r.difficulty}</p>
                </div>
                <button onClick={() => handleJoin(r.code)}
                  className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full ${r.participants.length < r.capacity ? "bg-[#1c1c1e] text-white" : "bg-[#F2F2F7] text-[#8E8E93]"}`}>
                  {r.participants.length < r.capacity ? "Join" : "Lobby"}
                </button>
              </div>
            ))}
            {(d?.rooms?.length ?? 0) === 0 && (
              <p className="text-[12px] text-[#8E8E93] text-center py-3">No open rooms · be the first</p>
            )}
            <button onClick={() => setShowCreate(true)} className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAFB] border border-dashed border-[#8E8E93] text-[12px] font-semibold text-[#3A3A3C] hover:bg-[#F2F2F7] hover:border-[#1c1c1e] hover:text-[#1c1c1e] transition-colors">+ Create room</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} onCreate={handleCreate} loading={loading} />}
      {showHistory && <HistoryModal items={d?.history || []} onClose={() => setShowHistory(false)} />}
      {showReport && <ReportModal data={showReport} onClose={() => setShowReport(null)} />}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-[#8E8E93]">{label}</p>
      <p className="text-[22px] font-bold leading-none mt-1" style={{ color }}>{value}</p>
    </div>
  );
}

function Score({ p, you }) {
  if (!p) return null;
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${you ? "bg-[#7c3aed]/8" : "bg-[#FAFAFB]"}`}>
      <div className="w-7 h-7 rounded-full bg-[#1c1c1e] text-white text-[10px] font-bold flex items-center justify-center">{(p.name || "?").slice(0, 2).toUpperCase()}</div>
      <p className="flex-1 text-[12px] font-semibold text-[#1c1c1e] truncate">{p.name}{you ? " (you)" : ""}</p>
      <p className="text-[12px] text-[#8E8E93]">{p.correct || 0}/{p.answered || 0}</p>
      <p className="text-[14px] font-bold tabular-nums text-[#1c1c1e]">{p.score || 0}</p>
    </div>
  );
}

function CreateRoomModal({ onClose, onCreate, loading }) {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Math");
  const [difficulty, setDifficulty] = useState("medium");
  const [capacity, setCapacity] = useState(4);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold text-[#1c1c1e] mb-4">Create room</h3>
        <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8E8E93]">Topic</label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Quadratic Equations"
          className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-[#E5E5EA] text-[14px]" />
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8E8E93]">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full mt-1 px-2 py-2 rounded-lg border border-[#E5E5EA] text-[12px]">
              {["Math","Science","English","Social Science","Hindi"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8E8E93]">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full mt-1 px-2 py-2 rounded-lg border border-[#E5E5EA] text-[12px]">
              <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#8E8E93]">Capacity</label>
            <select value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} className="w-full mt-1 px-2 py-2 rounded-lg border border-[#E5E5EA] text-[12px]">
              {[2, 4, 6, 8].map((c) => <option key={c} value={c}>{c} players</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[#E5E5EA] text-[12px] font-semibold">Cancel</button>
          <button onClick={() => onCreate({ topic, subject, difficulty, capacity })} disabled={!topic.trim() || loading}
            className="flex-1 py-2.5 rounded-lg bg-[#1c1c1e] text-white text-[12px] font-semibold disabled:opacity-50">
            {loading ? "Creating…" : "Create →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryModal({ items, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold text-[#1c1c1e] mb-4">Match history</h3>
        {items.length === 0 ? <p className="text-[13px] text-[#8E8E93] text-center py-6">No matches yet.</p> :
          <div className="space-y-2">
            {items.map((m) => {
              const me = m.participants[0];
              return (
                <div key={m._id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAFB]">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#1c1c1e] truncate">{m.topic}</p>
                    <p className="text-[10px] text-[#8E8E93]">{m.subject} · {new Date(m.endedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-[#1c1c1e]">{me?.score} pts · #{me?.rank}</p>
                    <p className={`text-[10px] font-bold ${(me?.ratingChange || 0) >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"}`}>{(me?.ratingChange || 0) >= 0 ? "+" : ""}{me?.ratingChange}</p>
                  </div>
                </div>
              );
            })}
          </div>
        }
        <button onClick={onClose} className="w-full mt-4 py-2.5 rounded-lg bg-[#1c1c1e] text-white text-[12px] font-semibold">Close</button>
      </div>
    </div>
  );
}

function ReportModal({ data, onClose }) {
  const [reason, setReason] = useState("cheating");
  const [note, setNote] = useState("");
  const submit = async () => {
    try { await compV2Report({ ...data, reason, note }); onClose(); } catch {}
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[16px] font-bold text-[#1c1c1e] mb-1">Report opponent</h3>
        <p className="text-[12px] text-[#8E8E93] mb-4">Reviewed by mods within 48h.</p>
        <div className="space-y-1 mb-3">
          {[
            { id: "cheating",  label: "Suspected cheating" },
            { id: "bad_sport", label: "Bad sportsmanship" },
            { id: "afk",       label: "AFK / didn't play" },
            { id: "other",     label: "Other" },
          ].map((r) => (
            <label key={r.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#FAFAFB] cursor-pointer">
              <input type="radio" name="report-reason" checked={reason === r.id} onChange={() => setReason(r.id)} className="accent-[#FF3B30]" />
              <span className="text-[12px] text-[#1c1c1e]">{r.label}</span>
            </label>
          ))}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional details…" rows={2} maxLength={500}
          className="w-full text-[12px] px-3 py-2 rounded-lg border border-[#E5E5EA] resize-none mb-3" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#E5E5EA] text-[12px] font-semibold">Cancel</button>
          <button onClick={submit} className="flex-1 py-2 rounded-lg bg-[#FF3B30] text-white text-[12px] font-semibold">Send report</button>
        </div>
      </div>
    </div>
  );
}

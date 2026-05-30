import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { getRoomQuestions, liveRoomTheme, liveRoomFriends } from "../services/api";
import MathText from "../components/MathTextLazy";

// Respect prefers-reduced-motion
const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
// Color-blind friendly answer markers
const ANSWER_SHAPES = ["●", "■", "▲", "◆"];

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";
const REACTIONS = ["👍","🔥","💪","🤯","😅","💀"];
const POWER_UPS = [
  { id: "fifty_fifty", label: "50:50",   icon: "⚖️", desc: "Remove 2 wrong options" },
  { id: "freeze",      label: "Freeze",  icon: "🧊", desc: "Freeze rivals 5s" },
  { id: "double",      label: "2× pts",  icon: "💎", desc: "Double next answer" },
];

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const initials = (n = "") => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

export default function LiveRoom() {
  const { user, token } = useAuthStore();
  const location = useLocation();
  const prefilledRoom = new URLSearchParams(location.search).get("room") || "";

  const [phase, setPhase]   = useState("lobby"); // lobby | waiting | game | result
  const [roomId, setRoomId] = useState("");
  const [inputRoom, setInputRoom] = useState(prefilledRoom);
  const [topic, setTopic]   = useState("Mathematics");
  const [difficulty, setDifficulty] = useState("mixed");
  const [qCount, setQCount] = useState(8);
  const [secsPerQ, setSecsPerQ] = useState(15);
  const [isPublic, setIsPublic] = useState(true);

  const [players, setPlayers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [finalRanks, setFinalRanks] = useState([]);
  const [error, setError] = useState("");
  const [loadingQ, setLoadingQ] = useState(false);

  // v2 state
  const [chatLog, setChatLog] = useState([]);   // [{name, message, at}]
  const [chatInput, setChatInput] = useState("");
  const [reactions, setReactions] = useState([]); // floating
  const [powerUps, setPowerUps] = useState({ fifty_fifty: 1, freeze: 1, double: 1 }); // remaining per match
  const [hiddenOpts, setHiddenOpts] = useState([]); // for 50:50
  const [doubleNext, setDoubleNext] = useState(false);
  const [frozenUntil, setFrozenUntil] = useState(0);
  const [publicRooms, setPublicRooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const [theme, setTheme] = useState(null);
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem("stellar_live_tutorial"));
  const [showReplay, setShowReplay] = useState(false);
  const [muted, setMuted] = useState(new Set()); // muted user ids
  const [reportTarget, setReportTarget] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting | live | reconnecting | offline
  const [antiCheatFlags, setAntiCheatFlags] = useState({});

  // v3 state
  const [typingUsers, setTypingUsers] = useState(new Set()); // userIds currently typing
  const [chatReactions, setChatReactions] = useState({});    // {msgIdx: {emoji: count}}
  const [rematchOffers, setRematchOffers] = useState([]);    // [{userId, name}]
  const [opponentPicks, setOpponentPicks] = useState({});    // {qIdx: {letter: count}}
  const [firstAnswerer, setFirstAnswerer] = useState({});    // {qIdx: name}
  const [streak, setStreak] = useState(0);                   // correct-in-a-row this match
  const [scorePulse, setScorePulse] = useState(0);           // +N float on score
  const [confettiBurst, setConfettiBurst] = useState(false);
  const [topicFlash, setTopicFlash] = useState(false);
  const [colorBlind, setColorBlind] = useState(() => localStorage.getItem("stellar_live_colorblind") === "1");
  const [largeText,  setLargeText]  = useState(() => localStorage.getItem("stellar_live_largetext")  === "1");
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion || localStorage.getItem("stellar_live_reduced") === "1");
  const [voiceActive, setVoiceActive] = useState(false);     // PTT visual stub
  const [selectedOptionForUI, setSelectedOptionForUI] = useState(null); // hover-highlight before commit
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const timerRef  = useRef(null);
  const pulseRef  = useRef(null);
  const scoreRef  = useRef(0);
  const answeredRef = useRef(0);
  const replayRef = useRef([]); // {q, picked, isCorrect, timeMs}
  const startMsRef = useRef(0);

  // Connect
  useEffect(() => {
    const sock = io(SOCKET_URL, { auth: { token } });
    socketRef.current = sock;

    sock.on("connect",       () => setConnectionStatus("live"));
    sock.on("disconnect",    () => setConnectionStatus("reconnecting"));
    sock.on("connect_error", () => setConnectionStatus("offline"));

    sock.on("room_update",  (room) => setPlayers({ ...room.players }));
    sock.on("game_started", ({ questions: qs }) => {
      setQuestions(qs);
      setCurrentIdx(0);
      setPhase("game");
      setPowerUps({ fifty_fifty: 1, freeze: 1, double: 1 });
      replayRef.current = [];
      startQuestionTimer(secsPerQ);
    });
    sock.on("score_update", (ps) => setPlayers({ ...ps }));
    sock.on("game_over", (ranked) => { setFinalRanks(ranked); setPhase("result"); clearInterval(timerRef.current); clearInterval(pulseRef.current); });

    // v2 events
    sock.on("room_chat",       (m) => setChatLog((c) => [...c.slice(-49), m]));
    sock.on("room_reaction",   (r) => {
      if (muted.has(r.userId)) return;
      setReactions((rs) => [...rs, { id: Date.now() + Math.random(), ...r }]);
      setTimeout(() => setReactions((rs) => rs.slice(1)), 2000);
    });
    sock.on("presence_update", ({ userId, status, lastSeen }) => {
      setPlayers((p) => ({ ...p, [userId]: { ...(p[userId] || {}), status, lastSeen } }));
    });
    sock.on("power_up", (p) => {
      if (p.type === "freeze" && p.target === (user.id || user._id)) {
        setFrozenUntil(Date.now() + 5000);
      }
      setChatLog((c) => [...c.slice(-49), { system: true, message: `⚡ ${p.fromName} used ${p.type === "fifty_fifty" ? "50:50" : p.type === "freeze" ? "Freeze" : "2× points"}`, at: Date.now() }]);
    });
    sock.on("anti_cheat_flag", ({ userId, name, reason }) => {
      setAntiCheatFlags((f) => ({ ...f, [userId]: { reason, at: Date.now() } }));
      setChatLog((c) => [...c.slice(-49), { system: true, message: `🚨 ${name} flagged: ${reason.replace(/_/g, " ")}`, at: Date.now() }]);
    });
    sock.on("public_rooms", (list) => setPublicRooms(list));

    // v3 events
    sock.on("opponent_answered", ({ qIdx, optionLetter }) => {
      setOpponentPicks((p) => ({ ...p, [qIdx]: { ...(p[qIdx] || {}), [optionLetter]: ((p[qIdx]?.[optionLetter]) || 0) + 1 } }));
    });
    sock.on("first_answer", ({ qIdx, name }) => setFirstAnswerer((f) => ({ ...f, [qIdx]: name })));
    sock.on("chat_typing", ({ userId: uid }) => {
      setTypingUsers((s) => { const ns = new Set(s); ns.add(uid); return ns; });
      setTimeout(() => setTypingUsers((s) => { const ns = new Set(s); ns.delete(uid); return ns; }), 2000);
    });
    sock.on("chat_reaction", ({ msgIdx, emoji }) => {
      setChatReactions((c) => ({ ...c, [msgIdx]: { ...(c[msgIdx] || {}), [emoji]: ((c[msgIdx]?.[emoji]) || 0) + 1 } }));
    });
    sock.on("rematch_offer", (offer) => setRematchOffers((r) => [...r, offer]));

    // Initial fetches
    liveRoomTheme().then((r) => setTheme(r.data?.data)).catch(() => {});
    liveRoomFriends().then((r) => setFriends(r.data?.data || [])).catch(() => {});

    return () => { sock.disconnect(); clearInterval(timerRef.current); clearInterval(pulseRef.current); };
  }, []); // eslint-disable-line

  // Persist accessibility toggles
  useEffect(() => { localStorage.setItem("stellar_live_colorblind", colorBlind ? "1" : "0"); }, [colorBlind]);
  useEffect(() => { localStorage.setItem("stellar_live_largetext",  largeText  ? "1" : "0"); }, [largeText]);
  useEffect(() => { localStorage.setItem("stellar_live_reduced",    reducedMotion ? "1" : "0"); }, [reducedMotion]);

  // Topic flash on game start + on each new question
  useEffect(() => {
    if (phase !== "game") return;
    setTopicFlash(true);
    const t = setTimeout(() => setTopicFlash(false), 800);
    return () => clearTimeout(t);
  }, [phase, currentIdx]);

  // Player pulse every 5s
  useEffect(() => {
    if (phase !== "waiting" && phase !== "game") return;
    pulseRef.current = setInterval(() => {
      socketRef.current?.emit("player_pulse", { roomId, status: phase === "game" ? (selected ? "done" : "answering") : "idle" });
    }, 5000);
    return () => clearInterval(pulseRef.current);
  }, [phase, roomId, selected]);

  // Refresh public rooms in lobby
  useEffect(() => {
    if (phase !== "lobby") return;
    socketRef.current?.emit("list_public_rooms");
    const id = setInterval(() => socketRef.current?.emit("list_public_rooms"), 5000);
    return () => clearInterval(id);
  }, [phase]);

  const startQuestionTimer = (secs = secsPerQ) => {
    clearInterval(timerRef.current);
    setTimeLeft(secs);
    setHiddenOpts([]);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current); handleTimeUp(); return 0; } return t - 1; });
    }, 1000);
  };

  const handleTimeUp = () => {
    answeredRef.current += 1;
    replayRef.current.push({ q: questions[currentIdx], picked: null, isCorrect: false, timeMs: secsPerQ * 1000 });
    goNext();
  };

  const handleAnswer = (opt, i) => {
    if (selected || frozenUntil > Date.now()) return;
    clearInterval(timerRef.current);
    setSelected(opt.type);
    const isCorrect = opt.type === "correct";
    const baseScore = isCorrect ? Math.max(1, timeLeft) : 0;
    const buzzerBonus = isCorrect && timeLeft <= 2 ? 5 : 0; // #15 buzzer-beater
    const streakMult  = isCorrect ? Math.min(4, 1 + Math.floor(streak / 2)) : 1; // #10
    const score       = (baseScore + buzzerBonus) * (doubleNext ? 2 : 1) * streakMult;
    const optionLetter = String.fromCharCode(65 + i);
    if (isCorrect && score > 0) {
      socketRef.current.emit("submit_score", { roomId, score, qIdx: currentIdx, optionLetter });
      setScorePulse(score);
      setTimeout(() => setScorePulse(0), 1500);
      if (!reducedMotion) { setConfettiBurst(true); setTimeout(() => setConfettiBurst(false), 1200); }
      setStreak((s) => s + 1);
    } else {
      // emit pick anonymously for opponent_answered too (server expects only correct submit; reuse a separate event)
      socketRef.current.emit("submit_score", { roomId, score: 0, qIdx: currentIdx, optionLetter });
      setStreak(0);
    }
    socketRef.current.emit("answer_timing", { roomId, timeMs: (secsPerQ - timeLeft) * 1000 });
    replayRef.current.push({ q: questions[currentIdx], picked: i, isCorrect, timeMs: (secsPerQ - timeLeft) * 1000 });
    setDoubleNext(false);
    answeredRef.current += 1;
    setTimeout(goNext, 1200);
  };

  const goNext = () => {
    setSelected(null);
    if (answeredRef.current >= questions.length) {
      socketRef.current.emit("end_game", { roomId });
    } else {
      setCurrentIdx((i) => i + 1);
      startQuestionTimer(secsPerQ);
    }
  };

  const joinRoom = (codeOverride, opts = {}) => {
    const id = (codeOverride || inputRoom.trim() || Math.random().toString(36).slice(2, 6)).toUpperCase();
    setRoomId(id);
    socketRef.current.emit("join_room", {
      roomId: id, userName: user.name,
      isPublic: opts.isPublic ?? isPublic, topic: opts.topic ?? topic,
    });
    setPhase("waiting");
  };

  const startGame = async () => {
    setLoadingQ(true); setError("");
    try {
      const { data } = await getRoomQuestions(topic, qCount, difficulty === "mixed" ? undefined : difficulty);
      socketRef.current.emit("start_room", { roomId, questions: data });
    } catch { setError("Could not load questions."); }
    finally { setLoadingQ(false); }
  };

  const sendChat = () => {
    const t = chatInput.trim();
    if (!t) return;
    socketRef.current.emit("room_chat", { roomId, message: t });
    setChatInput("");
  };

  const onChatType = (val) => {
    setChatInput(val);
    if (val.trim().length > 0) socketRef.current?.emit("chat_typing", { roomId });
  };

  const reactToMsg = (msgIdx, emoji) => socketRef.current?.emit("chat_reaction", { roomId, msgIdx, emoji });

  const offerRematch = () => socketRef.current?.emit("rematch_offer", { roomId });

  const readQuestionAloud = () => {
    const q = questions[currentIdx];
    if (!q || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(q.questionText.replace(/\$/g, ""));
    u.rate = 1.05;
    window.speechSynthesis.speak(u);
  };

  const sendReaction = (emoji) => socketRef.current.emit("room_reaction", { roomId, emoji });

  const usePower = (type) => {
    if (powerUps[type] <= 0) return;
    setPowerUps((p) => ({ ...p, [type]: p[type] - 1 }));
    socketRef.current.emit("power_up", { roomId, type });
    if (type === "fifty_fifty") {
      const wrongIdx = (questions[currentIdx]?.options || [])
        .map((o, i) => ({ i, t: o.type })).filter((x) => x.t !== "correct").map((x) => x.i);
      const drop = wrongIdx.sort(() => Math.random() - 0.5).slice(0, 2);
      setHiddenOpts(drop);
    }
    if (type === "double") setDoubleNext(true);
  };

  const muteToggle = (uid) => setMuted((s) => { const ns = new Set(s); ns.has(uid) ? ns.delete(uid) : ns.add(uid); return ns; });

  const ackTutorial = () => { localStorage.setItem("stellar_live_tutorial", "1"); setShowTutorial(false); };

  const shareResult = async () => {
    const me = finalRanks.find((p) => p.userId === (user.id || user._id));
    const text = `I just placed ${me?.rank === 1 ? "🥇 1st" : `#${me?.rank}`} in a live Stellar match! ${me?.score} pts.`;
    try {
      if (navigator.share) await navigator.share({ title: "Stellar Live", text, url: window.location.href });
      else await navigator.clipboard.writeText(text + " " + window.location.href);
    } catch {}
  };

  const myId = user.id || user._id;
  const sortedPlayers = useMemo(() => Object.values(players).sort((a, b) => (b.score || 0) - (a.score || 0)), [players]);

  // ── LOBBY ────────────────────────────────────────────────────
  if (phase === "lobby") return (
    <div className="space-y-5">
      {showTutorial && <TutorialModal onClose={ackTutorial} />}

      {/* #15 Theme of the day */}
      {theme && (
        <div className="rounded-2xl p-5 border border-[#7c3aed]/20 light-on-gradient" style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3)" }}>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7c3aed] mb-1">{theme.icon} Today's theme</p>
          <p className="text-[18px] font-bold text-[#1c1c1e]">{theme.topic}</p>
          <p className="text-[12px] text-[#8e8e93]">{theme.subject} · all rooms today</p>
          <button onClick={() => { setTopic(theme.subject); joinRoom(undefined, { topic: theme.subject }); }}
            className="mt-3 px-4 py-2 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold">Join themed room →</button>
        </div>
      )}

      {/* Connection status */}
      <ConnectionPill status={connectionStatus} />

      {error && <div className="bg-[#FF3B30]/8 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px] px-4 py-3 rounded-xl">{error}</div>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Create / Join */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <h2 className="text-[16px] font-bold text-[#1c1c1e] mb-3">Start a room</h2>
          <label className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Room code</label>
          <input value={inputRoom} onChange={(e) => setInputRoom(e.target.value.toUpperCase())} maxLength={6}
            placeholder="Leave blank to create"
            className="w-full mt-1 mb-3 px-3 py-2 rounded-lg border border-[#E5E5EA] text-[14px] font-mono uppercase" />

          {/* Game settings */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[12px]">
                {["Mathematics","Science","English","Social Science","Hindi"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[12px]">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Questions</label>
              <select value={qCount} onChange={(e) => setQCount(parseInt(e.target.value))} className="w-full mt-1 px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[12px]">
                {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Timer</label>
              <select value={secsPerQ} onChange={(e) => setSecsPerQ(parseInt(e.target.value))} className="w-full mt-1 px-2 py-1.5 rounded-lg border border-[#E5E5EA] text-[12px]">
                {[10, 15, 20, 30].map((n) => <option key={n} value={n}>{n}s</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-[12px] text-[#3A3A3C]">
                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-[#1c1c1e]" />
                Public room
              </label>
            </div>
          </div>

          <button onClick={() => joinRoom()} className="w-full py-3 rounded-xl bg-[#1c1c1e] text-white text-[14px] font-bold">
            {inputRoom ? "Join room →" : "Create room →"}
          </button>
        </div>

        {/* Public rooms + friends */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <h2 className="text-[16px] font-bold text-[#1c1c1e] mb-3">Public rooms</h2>
          {publicRooms.length === 0 ? (
            <p className="text-[12px] text-[#8e8e93] text-center py-4">No public rooms right now.</p>
          ) : (
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {publicRooms.map((r) => (
                <div key={r.roomId} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#FAFAFB]">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#1c1c1e] truncate">{r.topic}</p>
                    <p className="text-[10px] text-[#8e8e93]">{r.roomId} · {r.players} players · host {r.hostName}</p>
                  </div>
                  <button onClick={() => joinRoom(r.roomId)} className="px-3 py-1 rounded-full bg-[#1c1c1e] text-white text-[10px] font-bold">Join</button>
                </div>
              ))}
            </div>
          )}

          {/* #12 Friend invite */}
          {friends.length > 0 && (
            <>
              <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mt-4 mb-2">Invite friends</p>
              <div className="flex flex-wrap gap-1.5">
                {friends.slice(0, 6).map((f) => (
                  <span key={f.id} className="text-[11px] px-2 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed]">{f.name.split(" ")[0]}</span>
                ))}
              </div>
              <p className="text-[10px] text-[#8e8e93] mt-2">Create a room and share the code to invite</p>
            </>
          )}
        </div>

        {/* How it works (fills the 3rd column on wide screens) */}
        <div className="rounded-2xl p-5 border border-[#7c3aed]/15 light-on-gradient" style={{ background: "linear-gradient(135deg, #FAFAFB, #F2EBFE)" }}>
          <h2 className="text-[16px] font-bold text-[#1c1c1e] mb-3">How it works</h2>
          <ul className="space-y-2.5 text-[13px] text-[#3A3A3C]">
            <li className="flex gap-2"><span className="text-[14px]">⚡</span><span><strong>Speed = points.</strong> The faster you answer, the more you score.</span></li>
            <li className="flex gap-2"><span className="text-[14px]">🔥</span><span><strong>Streak multiplier.</strong> Get 2 in a row → ×2, 4 in a row → ×3.</span></li>
            <li className="flex gap-2"><span className="text-[14px]">⏱</span><span><strong>Buzzer bonus.</strong> Answer in the last 2 seconds for +5.</span></li>
            <li className="flex gap-2"><span className="text-[14px]">🎯</span><span><strong>Power-ups.</strong> 50:50, Freeze, 2× — one each per match.</span></li>
            <li className="flex gap-2"><span className="text-[14px]">🛡</span><span><strong>Anti-cheat.</strong> Suspiciously fast answers get flagged.</span></li>
          </ul>
          <button onClick={() => { localStorage.removeItem("stellar_live_tutorial"); setShowTutorial(true); }}
            className="mt-4 text-[12px] font-semibold text-[#7c3aed] hover:opacity-70">View full tutorial →</button>
        </div>
      </div>
    </div>
  );

  // ── WAITING ROOM ─────────────────────────────────────────────
  if (phase === "waiting") return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-[#f0f0f5] text-center">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93]">Room code</p>
          <p className="text-[40px] font-black text-[#1c1c1e] tracking-widest mt-1 mb-2 font-mono">{roomId}</p>
          <CopyRoomLink roomId={roomId} />
          <p className="text-[12px] text-[#8e8e93] mt-3">{Object.keys(players).length} player{Object.keys(players).length !== 1 ? "s" : ""}</p>
        </div>

        {/* Players */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">Players</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(players).map((p) => (
              <PlayerChip key={p.userId} p={p} you={p.userId === myId} />
            ))}
          </div>
        </div>

        <button onClick={startGame} disabled={loadingQ || Object.keys(players).length < 1}
          className="w-full py-3 rounded-xl bg-[#1c1c1e] text-white text-[14px] font-bold disabled:opacity-40">
          {loadingQ ? "Loading questions…" : "Start game →"}
        </button>
      </div>

      {/* Chat (#4) */}
      <ChatPanel chatLog={chatLog} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} />
    </div>
  );

  // ── GAME (mockup design) ─────────────────────────────────────
  if (phase === "game") {
    const q = questions[currentIdx];
    if (!q) return <div className="text-[#8e8e93]">Loading…</div>;
    const isFrozen = frozenUntil > Date.now();
    const myRank = sortedPlayers.findIndex((p) => p.userId === myId) + 1;
    const maxScore = Math.max(1, ...sortedPlayers.map((p) => p.score || 0));
    const myAnsweredCount = sortedPlayers.filter((p) => (p.answered || 0) > currentIdx).length;
    const currentOppPicks = opponentPicks[currentIdx] || {};
    const textScale = largeText ? 1.15 : 1;

    return (
      <div className="fixed inset-0 bg-[#FAFAFB] z-40 flex flex-col lg:flex-row" style={{ fontSize: `${textScale}em` }}>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 relative overflow-hidden">
          {/* #4 Confetti burst */}
          {confettiBurst && !reducedMotion && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} className="absolute text-[20px]"
                  style={{
                    left: `${Math.random() * 100}%`, top: "40%",
                    animation: `confetti${i % 3} 1.2s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.2}s`,
                  }}>{["✨","🎉","⭐","💜","💖"][i % 5]}</span>
              ))}
            </div>
          )}
          {/* #5 Slide transition + #2 topic flash */}
          {topicFlash && !reducedMotion && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <p className="text-[24px] font-bold text-[#7c3aed]/70" style={{ animation: "fadeOut 0.8s ease-out forwards" }}>{q.topic || "Question"}</p>
            </div>
          )}
          <style>{`
            @keyframes confetti0 { to { transform: translate(${(Math.random()-.5)*200}px, -200px) rotate(${Math.random()*720}deg); opacity: 0 } }
            @keyframes confetti1 { to { transform: translate(${(Math.random()-.5)*200}px, -240px) rotate(${Math.random()*720}deg); opacity: 0 } }
            @keyframes confetti2 { to { transform: translate(${(Math.random()-.5)*200}px, -160px) rotate(${Math.random()*720}deg); opacity: 0 } }
            @keyframes fadeOut { from { opacity: 1; transform: scale(1.1) } to { opacity: 0; transform: scale(1) } }
            @keyframes floatUp { from { opacity:1; transform: translateY(0) } to { opacity:0; transform: translateY(-80px) } }
            @keyframes scoreFloat { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(-30px) scale(1.4) } }
            @keyframes pulseDot { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
          `}</style>

          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => { socketRef.current?.emit("end_game", { roomId }); setPhase("lobby"); }}
                className="w-9 h-9 rounded-full bg-white border border-[#f0f0f5] flex items-center justify-center text-[#8e8e93] hover:text-[#1c1c1e]">×</button>
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8e8e93]">LIVE · {roomId}</p>
                <p className="text-[14px] font-semibold text-[#1c1c1e]">{topic} · <span className="capitalize">{difficulty}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Connection */}
              <ConnectionPill status={connectionStatus} />
              {/* LIVE pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" style={{ animation: reducedMotion ? "" : "pulseDot 1.2s infinite" }} /> LIVE · {Object.keys(players).length} players
              </div>
              {/* Accessibility menu */}
              <div className="flex gap-0.5 border border-[#E5E5EA] rounded-full overflow-hidden">
                <button onClick={readQuestionAloud} title="Read aloud" className="px-2 py-1 hover:bg-[#F2F2F7] text-[12px]">🔊</button>
                <button onClick={() => setLargeText((v) => !v)} title="Large text" className={`px-2 py-1 text-[12px] ${largeText ? "bg-[#1c1c1e] text-white" : "hover:bg-[#F2F2F7]"}`}>A</button>
                <button onClick={() => setColorBlind((v) => !v)} title="Color-blind shapes" className={`px-2 py-1 text-[12px] ${colorBlind ? "bg-[#1c1c1e] text-white" : "hover:bg-[#F2F2F7]"}`}>◐</button>
                <button onClick={() => setReducedMotion((v) => !v)} title="Reduced motion" className={`px-2 py-1 text-[12px] ${reducedMotion ? "bg-[#1c1c1e] text-white" : "hover:bg-[#F2F2F7]"}`}>⚡</button>
              </div>
            </div>
          </div>

          {/* Question N / Total + giant timer */}
          <div className="text-center mt-12">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8e8e93] mb-2">QUESTION {currentIdx + 1} / {questions.length}</p>
            <div className="relative inline-block">
              <p className="font-bold text-[#7c3aed]" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: "84px", lineHeight: "1" }}>
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
              </p>
              {/* Color underline */}
              <div className="h-[3px] mt-1 mx-auto rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / secsPerQ) * 80}%`, background: timeLeft <= 5 ? "#FF3B30" : timeLeft <= 10 ? "linear-gradient(90deg,#FF9500,#FFCC02)" : "linear-gradient(90deg,#7c3aed,#fbcfe8)" }} />
              {/* Buzzer-beater indicator */}
              {timeLeft <= 2 && timeLeft > 0 && !selected && (
                <p className="text-[10px] font-bold text-[#FF3B30] mt-2" style={{ animation: reducedMotion ? "" : "pulseDot 0.4s infinite" }}>⚡ BUZZER BONUS!</p>
              )}
            </div>
            {streak >= 2 && (
              <p className="text-[12px] font-bold text-[#FF9500] mt-2">🔥 ×{Math.min(4, 1 + Math.floor(streak / 2))} streak multiplier</p>
            )}
            {isFrozen && <p className="text-[12px] font-bold text-[#0066FF] mt-2">🧊 Frozen {Math.ceil((frozenUntil - Date.now()) / 1000)}s</p>}
            {scorePulse > 0 && (
              <p className="absolute text-[24px] font-bold text-[#34C759]" style={{ animation: "scoreFloat 1.5s ease-out forwards", left: "50%" }}>+{scorePulse}</p>
            )}
          </div>

          {/* Question card */}
          <div className="w-full max-w-2xl mt-8 bg-white rounded-3xl p-7 shadow-sm border border-[#f0f0f5]">
            <p className="text-[18px] font-semibold text-[#1c1c1e] leading-snug mb-6">
              <MathText text={q.questionText} className="[&_.katex]:!text-[#7c3aed] [&_.katex]:!font-medium" />
            </p>

            {/* 2×2 option grid (mockup) */}
            <div className="grid grid-cols-2 gap-3">
              {q.options?.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                if (hiddenOpts.includes(i)) return <div key={i} className="px-4 py-3 rounded-xl border border-dashed border-[#E5E5EA] text-[#C7C7CC] text-[12px] italic text-center">— 50:50 —</div>;
                const isSelected = selected !== null && selected === opt.type;
                const isCorrectShown = selected !== null && opt.type === "correct";
                const isWrongShown   = selected !== null && opt.type === selected && opt.type !== "correct";
                let style = "border-[#E5E5EA] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/4 text-[#1c1c1e]";
                if (isCorrectShown) style = "border-[#34C759] bg-[#34C759]/8 text-[#34C759]";
                else if (isWrongShown) style = "border-[#FF3B30] bg-[#FF3B30]/8 text-[#FF3B30]";
                else if (selected !== null) style = "border-[#E5E5EA] text-[#C7C7CC]";
                else if (selectedOptionForUI === i) style = "border-[#7c3aed] bg-[#7c3aed]/8 text-[#7c3aed]";
                const oppCount = currentOppPicks[letter] || 0;
                // Letter badge styling: hover/selected → filled violet, others → gray outlined ring
                const isHovered = !selected && selectedOptionForUI === i;
                const badgeClass = isCorrectShown ? "bg-[#34C759] text-white border-[#34C759]"
                                 : isWrongShown   ? "bg-[#FF3B30] text-white border-[#FF3B30]"
                                 : isHovered      ? "bg-[#7c3aed] text-white border-[#7c3aed]"
                                                  : "bg-white text-[#8E8E93] border-[#E5E5EA]";
                return (
                  <button key={i} onClick={() => handleAnswer(opt, i)} disabled={!!selected || isFrozen}
                    onMouseEnter={() => setSelectedOptionForUI(i)}
                    onMouseLeave={() => setSelectedOptionForUI(null)}
                    className={`relative px-5 py-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${style} ${isFrozen ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${badgeClass}`}>
                        {colorBlind ? ANSWER_SHAPES[i] : letter}
                      </div>
                      <span className="flex-1 text-[18px] font-semibold" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
                        <MathText text={opt.text} />
                      </span>
                    </div>
                    {oppCount > 0 && !selected && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#7c3aed] text-white text-[10px] font-bold flex items-center justify-center" title={`${oppCount} answered`}>{oppCount}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Power-ups + reactions */}
            <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-[#F2F2F7]">
              <div className="flex gap-1">
                {POWER_UPS.map((p) => (
                  <button key={p.id} onClick={() => usePower(p.id)} disabled={powerUps[p.id] <= 0 || selected}
                    title={p.desc} className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[#E5E5EA] disabled:opacity-30 hover:bg-[#FAFAFB]">
                    {p.icon} {powerUps[p.id]}
                  </button>
                ))}
                <button onClick={() => setVoiceActive((v) => !v)} title="Push-to-talk (preview)"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${voiceActive ? "bg-[#FF3B30] text-white border-[#FF3B30]" : "border-[#E5E5EA] text-[#3A3A3C]"}`}>
                  🎙
                </button>
              </div>
              <div className="flex gap-0.5">
                {REACTIONS.map((e) => <button key={e} onClick={() => sendReaction(e)} className="text-[16px] px-1.5 py-1 rounded hover:bg-[#FAFAFB]">{e}</button>)}
              </div>
            </div>

            {/* First answerer badge */}
            {firstAnswerer[currentIdx] && (
              <p className="text-[10px] text-[#8e8e93] text-center mt-2">⚡ <span className="font-bold text-[#7c3aed]">{firstAnswerer[currentIdx]}</span> answered first</p>
            )}
          </div>

          {/* Floating reactions */}
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            {reactions.map((r) => (
              <span key={r.id} className="text-[36px] absolute" style={{ animation: reducedMotion ? "" : "floatUp 2s ease-out forwards" }}>{r.emoji}</span>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="w-full lg:w-[340px] bg-[#FAFAFB] border-l border-[#f0f0f5] flex flex-col p-3 gap-3">
          {/* Live scoreboard — floating rounded card */}
          <div className="bg-white rounded-2xl px-5 pt-5 pb-4 border border-[#f0f0f5] shadow-sm">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] mb-3">LIVE</p>
            <div className="space-y-2.5">
              {sortedPlayers.map((p, i) => {
                const pct = ((p.score || 0) / maxScore) * 100;
                const isMe = p.userId === myId;
                const rivalDelta = isMe ? null : (p.score || 0) - (sortedPlayers.find((x) => x.userId === myId)?.score || 0);
                const isRival = !isMe && Math.abs(i - (myRank - 1)) === 1;
                return (
                  <div key={p.userId} className={`flex items-center gap-2 ${isRival ? "ring-1 ring-[#FF9500]/30 rounded-lg px-2 py-1" : ""}`}>
                    <span className="w-4 text-[12px] font-semibold text-[#8e8e93]">{i + 1}</span>
                    <div className="relative shrink-0">
                      <div className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                        style={{ background: isMe ? "linear-gradient(135deg,#c8b4f0,#f0a4cc)" : "#1c1c1e" }}>
                        {initials(p.userName || p.name)}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-white"
                        style={{ background: p.status === "answering" ? "#FF9500" : p.status === "done" ? "#34C759" : p.status === "disconnected" ? "#FF3B30" : "#C7C7CC" }} />
                    </div>
                    <div className="flex-1 min-w-0 relative">
                      <p className="text-[12px] font-semibold text-[#1c1c1e] truncate">{(p.userName || p.name)?.split(" ")[0]}{isMe ? " (you)" : ""}</p>
                      {/* gradient progress bar (mockup) */}
                      <div className="h-[2px] mt-1 bg-[#F2F2F7] rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: isMe ? "linear-gradient(90deg,#7c3aed,#f0a4cc)" : "linear-gradient(90deg,#3A3A3C,#8E8E93)" }} />
                      </div>
                    </div>
                    <p className="text-[15px] font-bold tabular-nums text-[#1c1c1e] tabular-nums">{p.score || 0}</p>
                    {!isMe && (
                      <button onClick={() => setReportTarget(p.userId)} title="Report" className="text-[10px] text-[#C7C7CC] hover:text-[#FF3B30] opacity-0 hover:opacity-100">⚑</button>
                    )}
                    {antiCheatFlags[p.userId] && <span title="Anti-cheat" className="text-[10px]">🚨</span>}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-[#C7C7CC] mt-3">{myAnsweredCount}/{Object.keys(players).length} answered this question</p>
            {/* #14 Comeback indicator */}
            {(() => {
              const me = sortedPlayers.find((p) => p.userId === myId);
              const ahead = sortedPlayers.find((p, i) => i < myRank - 1);
              if (me && ahead && (ahead.score - me.score) < 30 && currentIdx > questions.length / 2) {
                return <p className="text-[11px] font-bold text-[#FF9500] text-center mt-2">⚡ {ahead.userName?.split(" ")[0]} is closing in…</p>;
              }
              return null;
            })()}
          </div>

          {/* Chat — separate floating card at bottom */}
          <div className="bg-white rounded-2xl border border-[#f0f0f5] shadow-sm flex flex-col flex-1 min-h-[220px] mt-auto">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8e8e93] px-5 pt-4 pb-2">CHAT</p>
            <div className="flex-1 overflow-y-auto px-5 space-y-1.5">
              {chatLog.length === 0 && <p className="text-[11px] text-[#C7C7CC] mt-3">Say hi…</p>}
              {chatLog.map((m, i) => m.system ? (
                <p key={i} className="text-[11px] text-center text-[#8e8e93] italic">{m.message}</p>
              ) : (
                <div key={i} className="text-[12px] group">
                  <span className="font-bold text-[#1c1c1e]">{m.name}:</span> <span className="text-[#3A3A3C]">{m.message}</span>
                  {chatReactions[i] && (
                    <span className="ml-1 inline-flex gap-0.5">
                      {Object.entries(chatReactions[i]).map(([emoji, count]) => (
                        <span key={emoji} className="text-[10px] bg-[#F2F2F7] rounded-full px-1.5 py-0.5">{emoji} {count}</span>
                      ))}
                    </span>
                  )}
                  <span className="ml-1 hidden group-hover:inline-flex gap-0.5">
                    {["👍","❤️","😂"].map((e) => <button key={e} onClick={() => reactToMsg(i, e)} className="text-[10px] hover:scale-110">{e}</button>)}
                  </span>
                </div>
              ))}
              {typingUsers.size > 0 && (
                <p className="text-[10px] italic text-[#8e8e93]">{typingUsers.size === 1 ? "someone" : `${typingUsers.size} people`} typing…</p>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-[#F2F2F7]">
              <input value={chatInput} onChange={(e) => onChatType(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                maxLength={200} placeholder="message…"
                className="flex-1 text-[12px] px-3 py-2 rounded-lg bg-[#F2F2F7] outline-none" />
              <button onClick={sendChat} className="px-2.5 py-1.5 rounded-lg bg-[#1c1c1e] text-white text-[11px] font-bold">→</button>
            </div>
          </div>
        </aside>

        {reportTarget && <ReportModal targetId={reportTarget} onClose={() => setReportTarget(null)} />}
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────
  if (phase === "result") {
    const me = finalRanks.find((p) => p.userId === myId);
    const correctCount = replayRef.current.filter((r) => r.isCorrect).length;
    let bestStreak = 0, run = 0;
    for (const r of replayRef.current) { if (r.isCorrect) { run++; bestStreak = Math.max(bestStreak, run); } else run = 0; }
    const fastest = replayRef.current.filter((r) => r.isCorrect).sort((a, b) => a.timeMs - b.timeMs)[0];
    return (
      <div className="grid lg:grid-cols-3 gap-4"><div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl p-7 border border-[#f0f0f5] text-center">
          <p className="text-[60px] mb-1">{me?.rank === 1 ? "🥇" : me?.rank === 2 ? "🥈" : me?.rank === 3 ? "🥉" : `#${me?.rank}`}</p>
          <p className="text-[24px] font-bold text-[#1c1c1e]">{me?.score} pts</p>
          <p className="text-[12px] text-[#8e8e93] mt-1">{correctCount}/{questions.length} correct</p>
        </div>

        {/* #17 Best moment */}
        {(bestStreak >= 2 || fastest) && (
          <div className="rounded-2xl p-4 border border-[#FF9500]/20 bg-[#FFFBEB]">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#FF9500] mb-1">⭐ Best moments</p>
            {bestStreak >= 2 && <p className="text-[12px] text-[#1c1c1e]">🔥 Best streak: <span className="font-bold">{bestStreak} in a row</span></p>}
            {fastest && <p className="text-[12px] text-[#1c1c1e] mt-0.5">⚡ Fastest correct: <span className="font-bold">{(fastest.timeMs / 1000).toFixed(1)}s</span></p>}
          </div>
        )}

        {/* Final scoreboard */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">Final scoreboard</p>
          <div className="space-y-1.5">
            {finalRanks.map((p) => (
              <div key={p.userId} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${p.userId === myId ? "bg-[#7c3aed]/8" : "bg-[#FAFAFB]"}`}>
                <span className="w-6 text-[14px] font-bold">{p.rank}</span>
                <PlayerChip p={p} mini you={p.userId === myId} />
                <span className="flex-1" />
                <span className="text-[14px] font-bold tabular-nums">{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* #19 Rematch invites */}
        {rematchOffers.length > 0 && (
          <div className="rounded-xl px-4 py-3 bg-[#7c3aed]/8 border border-[#7c3aed]/20 flex items-center justify-between">
            <p className="text-[12px] text-[#7c3aed]"><span className="font-bold">{rematchOffers.map((o) => o.name).join(", ")}</span> wants a rematch</p>
            <button onClick={() => { setRematchOffers([]); setPhase("lobby"); setInputRoom(""); setQuestions([]); scoreRef.current = 0; answeredRef.current = 0; }}
              className="text-[11px] font-bold text-[#7c3aed]">Accept →</button>
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowReplay(true)} className="flex-1 py-2.5 rounded-xl border border-[#E5E5EA] text-[12px] font-semibold">📜 Replay</button>
          <button onClick={shareResult} className="flex-1 py-2.5 rounded-xl border border-[#E5E5EA] text-[12px] font-semibold">↗ Share</button>
          <button onClick={offerRematch} className="flex-1 py-2.5 rounded-xl border border-[#7c3aed] text-[#7c3aed] text-[12px] font-bold">⟳ Rematch</button>
          <button onClick={() => { setPhase("lobby"); setInputRoom(""); setQuestions([]); scoreRef.current = 0; answeredRef.current = 0; }} className="flex-1 py-2.5 rounded-xl bg-[#1c1c1e] text-white text-[12px] font-bold">Play again →</button>
        </div>

        {showReplay && <ReplayModal items={replayRef.current} onClose={() => setShowReplay(false)} />}
        </div>

        {/* Right column: full match scoreboard */}
        <div className="bg-white rounded-2xl p-5 border border-[#f0f0f5]">
          <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] mb-3">All scores</p>
          <div className="space-y-1.5">
            {finalRanks.map((p) => (
              <div key={p.userId} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${p.userId === myId ? "bg-[#7c3aed]/8" : "bg-[#FAFAFB]"}`}>
                <span className="w-5 text-[12px] font-bold">{p.rank}</span>
                <PlayerChip p={p} mini you={p.userId === myId} />
                <span className="flex-1" />
                <span className="text-[12px] font-bold tabular-nums">{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ── Sub-components ─────────────────────────────────────────────────

function PlayerChip({ p, you, mini }) {
  if (!p) return null;
  const statusColor = p.status === "answering" ? "#FF9500" : p.status === "done" ? "#34C759" : p.status === "disconnected" ? "#FF3B30" : "#C7C7CC";
  if (mini) return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative">
        <div className="w-7 h-7 rounded-full bg-[#1c1c1e] text-white text-[10px] font-bold flex items-center justify-center">{initials(p.userName || p.name)}</div>
        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white" style={{ background: statusColor }} />
      </div>
      <p className="text-[12px] font-semibold text-[#1c1c1e] truncate">{(p.userName || p.name)?.split(" ")[0]}{you ? " (you)" : ""}</p>
    </div>
  );
  return (
    <div className="rounded-xl p-3 bg-[#FAFAFB] border border-[#f0f0f5] text-center">
      <div className="relative w-10 h-10 mx-auto mb-1.5">
        <div className="w-10 h-10 rounded-full bg-[#1c1c1e] text-white text-[12px] font-bold flex items-center justify-center">{initials(p.userName || p.name)}</div>
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white" style={{ background: statusColor }} />
      </div>
      <p className="text-[12px] font-semibold text-[#1c1c1e] truncate">{p.userName || p.name}{you ? " (you)" : ""}</p>
      <p className="text-[10px] text-[#8e8e93] capitalize">{p.status || "idle"}</p>
    </div>
  );
}

function CountdownRing({ seconds, max }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, seconds / max));
  const dash = circ * pct;
  const color = seconds <= 5 ? "#FF3B30" : seconds <= 10 ? "#FF9500" : "#34C759";
  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="#F2F2F7" strokeWidth="3" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s linear" }} />
      </svg>
      <p className="absolute inset-0 flex items-center justify-center text-[14px] font-mono font-bold" style={{ color }}>{seconds}</p>
    </div>
  );
}

function ChatPanel({ chatLog, chatInput, setChatInput, sendChat, compact }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#f0f0f5] flex flex-col ${compact ? "h-[480px]" : "h-[400px]"}`}>
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#8e8e93] px-4 py-3 border-b border-[#F2F2F7]">💬 Chat</p>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {chatLog.length === 0 && <p className="text-[11px] text-[#C7C7CC] text-center mt-4">Be nice. Talk smack within reason.</p>}
        {chatLog.map((m, i) => m.system ? (
          <p key={i} className="text-[11px] text-center text-[#8e8e93] italic">{m.message}</p>
        ) : (
          <div key={i} className="text-[12px]">
            <span className="font-bold text-[#1c1c1e]">{m.name}:</span> <span className="text-[#3A3A3C]">{m.message}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-t border-[#F2F2F7]">
        <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChat()}
          maxLength={200} placeholder="Say something…"
          className="flex-1 text-[12px] px-2.5 py-1.5 rounded-lg bg-[#F2F2F7] outline-none" />
        <button onClick={sendChat} className="px-3 py-1.5 rounded-lg bg-[#1c1c1e] text-white text-[11px] font-bold">Send</button>
      </div>
    </div>
  );
}

function ConnectionPill({ status }) {
  const map = {
    connecting:    { label: "Connecting…",  bg: "bg-[#FF9500]/10", text: "text-[#FF9500]", icon: "•" },
    live:          { label: "Live · synced", bg: "bg-[#34C759]/10", text: "text-[#34C759]", icon: "●" },
    reconnecting:  { label: "Reconnecting…", bg: "bg-[#FF9500]/10", text: "text-[#FF9500]", icon: "↻" },
    offline:       { label: "Offline",       bg: "bg-[#FF3B30]/10", text: "text-[#FF3B30]", icon: "✕" },
  };
  const s = map[status] || map.connecting;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span>{s.icon}</span> {s.label}
    </div>
  );
}

function CopyRoomLink({ roomId }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/live?room=${roomId}`;
  const copy = () => navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  return (
    <button onClick={copy} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#7c3aed] border border-[#7c3aed]/30 rounded-full px-3 py-1 hover:bg-[#7c3aed]/8">
      {copied ? "✓ Copied!" : "⎘ Copy invite link"}
    </button>
  );
}

function TutorialModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold text-[#1c1c1e] mb-2">Welcome to Live Room 👋</h3>
        <ul className="text-[13px] text-[#3A3A3C] space-y-2 mb-4">
          <li>• <strong>Speed = points</strong> — answer faster for bonus.</li>
          <li>• <strong>Power-ups</strong>: 50:50, Freeze opponent, Double points.</li>
          <li>• <strong>Chat & react</strong> in real time. Mute or report bad players.</li>
          <li>• <strong>Public rooms</strong> auto-list; private = code-only.</li>
          <li>• <strong>Anti-cheat</strong> flags too-fast answers automatically.</li>
        </ul>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-[#1c1c1e] text-white text-[13px] font-bold">Got it →</button>
      </div>
    </div>
  );
}

function ReplayModal({ items, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold text-[#1c1c1e] mb-3">Match replay</h3>
        <div className="space-y-3">
          {items.map((it, i) => {
            const correct = (it.q?.options || []).find((o) => o.type === "correct");
            return (
              <div key={i} className={`p-3 rounded-xl border ${it.isCorrect ? "border-[#34C759]/30 bg-[#34C759]/5" : "border-[#FF3B30]/30 bg-[#FF3B30]/5"}`}>
                <p className="text-[10px] font-bold text-[#8e8e93] mb-1">Q{i + 1} · {(it.timeMs / 1000).toFixed(1)}s</p>
                <p className="text-[13px] text-[#1c1c1e] mb-1">{it.q?.questionText}</p>
                {it.picked != null && <p className="text-[11px] text-[#8e8e93]">Your answer: {it.q?.options[it.picked]?.text || "—"}</p>}
                <p className="text-[11px] text-[#34C759]">✓ Correct: {correct?.text}</p>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="w-full mt-4 py-2.5 rounded-xl bg-[#1c1c1e] text-white text-[12px] font-bold">Close</button>
      </div>
    </div>
  );
}

function ReportModal({ targetId, onClose }) {
  const [reason, setReason] = useState("cheating");
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[15px] font-bold text-[#1c1c1e] mb-3">Report player</h3>
        <div className="space-y-1 mb-3">
          {["cheating","bad_sport","afk","other"].map((r) => (
            <label key={r} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#FAFAFB] cursor-pointer">
              <input type="radio" name="rr" checked={reason === r} onChange={() => setReason(r)} className="accent-[#FF3B30]" />
              <span className="text-[12px] text-[#1c1c1e] capitalize">{r.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#E5E5EA] text-[11px] font-semibold">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-[#FF3B30] text-white text-[11px] font-semibold">Send</button>
        </div>
      </div>
    </div>
  );
}

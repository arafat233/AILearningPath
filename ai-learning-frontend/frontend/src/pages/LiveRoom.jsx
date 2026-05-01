import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const SOCKET_URL = "http://localhost:5000";

export default function LiveRoom() {
  const { user, token } = useAuthStore();
  const location = useLocation();
  const prefilledRoom = new URLSearchParams(location.search).get("room") || "";
  const [phase, setPhase]         = useState("lobby");   // lobby | game | result
  const [roomId, setRoomId]       = useState("");
  const [inputRoom, setInputRoom] = useState(prefilledRoom);
  const [players, setPlayers]     = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected]   = useState(null);
  const [timeLeft, setTimeLeft]   = useState(15);
  const [finalRanks, setFinalRanks] = useState([]);
  const [error, setError]         = useState("");
  const [loadingQ, setLoadingQ]   = useState(false);

  const socketRef  = useRef(null);
  const timerRef   = useRef(null);
  const scoreRef   = useRef(0);
  const answeredRef = useRef(0);

  useEffect(() => {
    const sock = io(SOCKET_URL, { auth: { token } });
    socketRef.current = sock;

    sock.on("room_update",  (room) => setPlayers({ ...room.players }));
    sock.on("game_started", ({ questions: qs }) => {
      setQuestions(qs);
      setCurrentIdx(0);
      setPhase("game");
      startQuestionTimer();
    });
    sock.on("score_update", (ps) => setPlayers({ ...ps }));
    sock.on("game_over",    (ranked) => { setFinalRanks(ranked); setPhase("result"); clearInterval(timerRef.current); });

    return () => { sock.disconnect(); clearInterval(timerRef.current); };
  }, []);

  const startQuestionTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeUp(); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    answeredRef.current += 1;
    goNext();
  };

  const handleAnswer = (opt) => {
    if (selected) return;
    clearInterval(timerRef.current);
    setSelected(opt.type);

    if (opt.type === "correct") {
      scoreRef.current += Math.max(1, timeLeft); // bonus for speed
      socketRef.current.emit("submit_score", { roomId, userId: user.id || user._id, score: Math.max(1, timeLeft) });
    }

    answeredRef.current += 1;
    setTimeout(() => goNext(), 1200);
  };

  const goNext = () => {
    setSelected(null);
    if (answeredRef.current >= questions.length) {
      socketRef.current.emit("end_game", { roomId });
    } else {
      setCurrentIdx((i) => i + 1);
      startQuestionTimer();
    }
  };

  const joinRoom = () => {
    const id = inputRoom.trim().toUpperCase() || Math.random().toString(36).slice(2, 6).toUpperCase();
    setRoomId(id);
    socketRef.current.emit("join_room", { roomId: id, userId: user.id || user._id, userName: user.name });
    setPhase("waiting");
  };

  const startGame = async () => {
    setLoadingQ(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/competition/room-questions",
        { count: 8 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socketRef.current.emit("start_room", { roomId, questions: data });
    } catch {
      setError("Could not load questions. Make sure backend is running and questions are seeded.");
    } finally {
      setLoadingQ(false);
    }
  };

  // ── LOBBY ─────────────────────────────────────────────
  if (phase === "lobby") return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Live Room</h1>
      <p className="text-sm text-gray-500 mb-6">Compete in real-time with other students.</p>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      <div className="card p-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">Room code (leave blank to create new)</label>
        <input
          className="input mb-4"
          placeholder="e.g. AB12"
          value={inputRoom}
          onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
          maxLength={6}
        />
        <button onClick={joinRoom} className="btn-primary w-full">
          {inputRoom ? "Join Room →" : "Create Room →"}
        </button>
      </div>
    </div>
  );

  // ── WAITING ROOM ──────────────────────────────────────
  if (phase === "waiting") return (
    <div className="max-w-md mx-auto">
      <div className="card p-6 text-center mb-5">
        <p className="text-xs text-gray-400 mb-1">Room Code</p>
        <p className="text-4xl font-bold text-brand-500 tracking-widest mb-3">{roomId}</p>
        <CopyRoomLink roomId={roomId} />
        <p className="text-sm text-gray-500 mt-3">Players: {Object.keys(players).length}</p>
      </div>
      <div className="card p-5 mb-5">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Players</p>
        {Object.values(players).map((p) => (
          <div key={p.userId} className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-700">
              {p.userName?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-gray-700">{p.userName}</span>
          </div>
        ))}
      </div>
      <button onClick={startGame} disabled={loadingQ || Object.keys(players).length < 1} className="btn-primary w-full">
        {loadingQ ? "Loading questions…" : "Start Game →"}
      </button>
    </div>
  );

  // ── GAME ─────────────────────────────────────────────
  if (phase === "game") {
    const q = questions[currentIdx];
    if (!q) return <div className="text-gray-400">Loading…</div>;
    const sorted = Object.values(players).sort((a, b) => b.score - a.score);
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">Question {currentIdx + 1} of {questions.length}</p>
          <div className={`text-lg font-mono font-bold ${timeLeft <= 5 ? "text-red-500" : "text-gray-700"}`}>
            {timeLeft}s
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5">
          <div className="h-1.5 bg-brand-500 rounded-full transition-[width]" style={{ width: `${(timeLeft / 15) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="card p-6 mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-5">{q.questionText}</h2>
          <div className="flex flex-col gap-2">
            {q.options?.map((opt, i) => {
              let style = "border-surface-border hover:border-brand-400 hover:bg-brand-50 text-gray-800";
              if (selected) {
                if (opt.type === "correct") style = "border-green-400 bg-green-50 text-green-800";
                else if (opt.type === selected) style = "border-red-300 bg-red-50 text-red-800";
                else style = "border-surface-border text-gray-400";
              }
              return (
                <button key={i} onClick={() => handleAnswer(opt)} disabled={!!selected}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-[background-color,border-color,color,transform] active:scale-[0.99] ${style}`}>
                  <span className="mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>{opt.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live leaderboard */}
        <div className="card p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Live Scores</p>
          {sorted.map((p, i) => (
            <div key={p.userId} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-700">{i + 1}. {p.userName}</span>
              <span className="text-sm font-medium text-brand-600">{p.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────
  if (phase === "result") return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 text-center mb-5">
        <p className="text-3xl mb-2">🏆</p>
        <h2 className="text-xl font-semibold mb-4">Game Over!</h2>
        <div className="flex flex-col gap-2">
          {finalRanks.map((p) => {
            const isMe = (p.userId === (user.id || user._id));
            return (
              <div key={p.userId} className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${isMe ? "bg-brand-50 border border-brand-200" : "bg-gray-50"}`}>
                <span className="text-sm font-medium">
                  {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : `#${p.rank}`}
                  <span className="ml-2">{p.userName}</span>
                  {isMe && <span className="ml-1 text-brand-500 text-xs">(you)</span>}
                </span>
                <span className="text-sm font-semibold text-gray-700">{p.score} pts</span>
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={() => { setPhase("lobby"); setInputRoom(""); setQuestions([]); scoreRef.current = 0; answeredRef.current = 0; }} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  );

  return null;
}

function CopyRoomLink({ roomId }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/live?room=${roomId}`;
  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
    >
      {copied ? "✓ Copied!" : "⎘ Copy invite link"}
    </button>
  );
}

import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import logger from "./logger.js";
import { sessionGet, sessionSet, sessionDel } from "./redisClient.js";

let io;

const ROOM_TTL = 4 * 60 * 60; // 4 hours

// Per-IP connection rate limit — prevents connection-flood attacks
const connAttempts = new Map(); // ip → { count, resetAt }
const CONN_LIMIT      = 20;       // max new connections per IP per window
const CONN_WINDOW_MS  = 60_000;   // 1 minute window

function checkConnLimit(ip) {
  const now = Date.now();
  let rec = connAttempts.get(ip) || { count: 0, resetAt: now + CONN_WINDOW_MS };
  if (now > rec.resetAt) { rec = { count: 0, resetAt: now + CONN_WINDOW_MS }; }
  rec.count++;
  connAttempts.set(ip, rec);
  return rec.count <= CONN_LIMIT;
}

// Prune stale IP entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of connAttempts) {
    if (now > rec.resetAt) connAttempts.delete(ip);
  }
}, 5 * 60_000);

// Per-user event throttle map — prevents rapid submit_score spam
const lastEventTs = new Map(); // userId:event → timestamp
const SUBMIT_COOLDOWN_MS = 500; // max 2 score submits per second per user

function isThrottled(key) {
  const now = Date.now();
  const last = lastEventTs.get(key) || 0;
  if (now - last < SUBMIT_COOLDOWN_MS) return true;
  lastEventTs.set(key, now);
  return false;
}
const rk = (roomId) => `competition:room:${roomId}`;

const getRoom  = (id)       => sessionGet(rk(id));
const saveRoom = (id, room) => sessionSet(rk(id), room, ROOM_TTL);
const dropRoom = (id)       => sessionDel(rk(id));

// In-memory active room registry for public lobby browser
const activeRooms = new Map(); // roomId → { topic, hostName, players, status, isPublic, createdAt }
function publicizeRoom(roomId, info) { activeRooms.set(roomId, { ...info, updatedAt: Date.now() }); }
function unregisterRoom(roomId) { activeRooms.delete(roomId); }
// Periodic prune (15 min)
setInterval(() => {
  const cutoff = Date.now() - 30 * 60_000;
  for (const [id, r] of activeRooms) if (r.updatedAt < cutoff) activeRooms.delete(id);
}, 5 * 60_000);

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true },
  });

  // Attach Redis adapter when REDIS_URL is present — enables multi-pod broadcasting
  // and survives server restarts (room state persisted separately via sessionGet/Set)
  if (process.env.REDIS_URL) {
    try {
      const pubClient = new Redis(process.env.REDIS_URL, { lazyConnect: false });
      const subClient = pubClient.duplicate();
      io.adapter(createAdapter(pubClient, subClient));
      logger.info("Socket.IO using Redis adapter");
    } catch (err) {
      logger.warn("Socket.IO Redis adapter init failed — falling back to in-memory adapter", { err: err.message });
    }
  }

  // Connection rate limit — must come before auth middleware
  io.use((socket, next) => {
    const ip = socket.handshake.address;
    if (!checkConnLimit(ip)) {
      return next(new Error("Too many connections — try again later"));
    }
    next();
  });

  // JWT auth on every handshake — anonymous connections are rejected
  // Reads token from: httpOnly cookie (browser), auth.token field, or Authorization header
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers?.cookie || "";
    const cookieToken  = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="))
      ?.split("=")?.[1];

    const token =
      cookieToken ||
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) return next(new Error("Authentication required"));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    socket.on("join_room", async ({ roomId, userName, isPublic, topic }) => {
      socket.join(roomId);
      let room = await getRoom(roomId);
      if (!room) {
        room = { players: {}, status: "waiting", questions: [], hostId: userId, isPublic: isPublic !== false, topic: topic || "Mathematics", createdAt: Date.now() };
      }
      room.players[userId] = { userId, userName, score: 0, answered: 0, status: "idle", lastSeen: Date.now() };
      await saveRoom(roomId, room);
      publicizeRoom(roomId, { topic: room.topic, hostName: room.players[room.hostId]?.userName, players: Object.keys(room.players).length, status: room.status, isPublic: room.isPublic });
      io.to(roomId).emit("room_update", room);
    });

    socket.on("list_public_rooms", () => {
      const list = [...activeRooms.entries()]
        .filter(([, r]) => r.isPublic && r.status === "waiting")
        .slice(0, 30)
        .map(([roomId, r]) => ({ roomId, ...r }));
      socket.emit("public_rooms", list);
    });

    socket.on("start_room", async ({ roomId, questions }) => {
      const room = await getRoom(roomId);
      if (!room) return;
      if (room.hostId !== userId) return; // only host can start
      room.status    = "live";
      room.questions = questions;
      await saveRoom(roomId, room);
      io.to(roomId).emit("game_started", { questions });
    });

    // userId comes from JWT — client cannot forge another user's score
    socket.on("submit_score", async ({ roomId, score, qIdx, optionLetter }) => {
      if (isThrottled(`submit:${userId}`)) return; // max 2/s per user
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      room.players[userId].score    += score;
      room.players[userId].answered += 1;
      // Track first-to-answer per question
      room.firstAnswered = room.firstAnswered || {};
      const wasFirst = qIdx != null && room.firstAnswered[qIdx] == null;
      if (wasFirst) {
        room.firstAnswered[qIdx] = userId;
        io.to(roomId).emit("first_answer", { qIdx, userId, name: room.players[userId].userName });
      }
      // Anonymous broadcast of which letter someone picked (without revealing who)
      if (optionLetter) io.to(roomId).emit("opponent_answered", { qIdx, optionLetter });
      await saveRoom(roomId, room);
      io.to(roomId).emit("score_update", room.players);
    });

    socket.on("end_game", async ({ roomId }) => {
      const room = await getRoom(roomId);
      if (!room) return;
      if (room.hostId !== userId) return; // only host can end
      room.status = "finished";
      const ranked = Object.values(room.players)
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ ...p, rank: i + 1 }));
      io.to(roomId).emit("game_over", ranked);
      await dropRoom(roomId);
    });

    // ── Live Room v2 events ──────────────────────────────

    // Chat (max 200 chars, throttled 1/s)
    socket.on("room_chat", async ({ roomId, message }) => {
      if (isThrottled(`chat:${userId}`)) return;
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      const text = String(message || "").slice(0, 200);
      if (!text.trim()) return;
      io.to(roomId).emit("room_chat", {
        userId, name: room.players[userId].userName, message: text, at: Date.now(),
      });
    });

    // Emoji reaction (throttled 2/s)
    socket.on("room_reaction", async ({ roomId, emoji }) => {
      if (isThrottled(`react:${userId}`)) return;
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      io.to(roomId).emit("room_reaction", {
        userId, name: room.players[userId].userName, emoji: String(emoji || "👍").slice(0, 8), at: Date.now(),
      });
    });

    // Player pulse — every 5s; updates lastSeen for status indicator
    socket.on("player_pulse", async ({ roomId, status }) => {
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      room.players[userId].lastSeen = Date.now();
      room.players[userId].status   = ["answering", "done", "idle"].includes(status) ? status : "idle";
      await saveRoom(roomId, room);
      io.to(roomId).emit("presence_update", {
        userId, status: room.players[userId].status, lastSeen: room.players[userId].lastSeen,
      });
    });

    // Power-ups (50:50, freeze, double)
    socket.on("power_up", async ({ roomId, type, targetUserId }) => {
      if (isThrottled(`power:${userId}`)) return;
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      const valid = ["fifty_fifty", "freeze", "double"];
      if (!valid.includes(type)) return;
      // Freeze can only target opponents
      if (type === "freeze" && targetUserId && targetUserId !== userId) {
        io.to(roomId).emit("power_up", { from: userId, fromName: room.players[userId].userName, type, target: targetUserId });
      } else if (type !== "freeze") {
        io.to(roomId).emit("power_up", { from: userId, fromName: room.players[userId].userName, type, target: userId });
      }
    });

    // Typing indicator
    socket.on("chat_typing", ({ roomId }) => {
      socket.to(roomId).emit("chat_typing", { userId });
    });

    // Chat message reaction
    socket.on("chat_reaction", ({ roomId, msgIdx, emoji }) => {
      io.to(roomId).emit("chat_reaction", { userId, msgIdx, emoji });
    });

    // Rematch invite from result screen
    socket.on("rematch_offer", async ({ roomId }) => {
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      io.to(roomId).emit("rematch_offer", { userId, name: room.players[userId].userName });
    });

    // Spectator join — joins room but not added to players
    socket.on("spectate_room", async ({ roomId }) => {
      socket.join(roomId);
      const room = await getRoom(roomId);
      if (room) socket.emit("room_update", room);
    });

    // Anti-cheat: client reports per-question timing; server flags too-fast pattern
    socket.on("answer_timing", async ({ roomId, timeMs }) => {
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      const p = room.players[userId];
      p.timings = p.timings || [];
      p.timings.push(timeMs);
      // Flag if last 3 answers all <2000ms (too fast to be reading)
      if (p.timings.length >= 3 && p.timings.slice(-3).every((t) => t < 2000)) {
        io.to(roomId).emit("anti_cheat_flag", { userId, name: p.userName, reason: "answers_too_fast" });
      }
      await saveRoom(roomId, room);
    });

    socket.on("disconnect", () => {
      logger.debug("Socket disconnected", { userId });
      // Mark all rooms this socket was in with disconnected status
      for (const r of socket.rooms) {
        if (r === socket.id) continue;
        getRoom(r).then(async (room) => {
          if (room?.players[userId]) {
            room.players[userId].status   = "disconnected";
            room.players[userId].lastSeen = Date.now();
            await saveRoom(r, room);
            io.to(r).emit("presence_update", { userId, status: "disconnected", lastSeen: Date.now() });
          }
        }).catch(() => {});
      }
    });
  });
};

export const getIO = () => io;

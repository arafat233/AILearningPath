import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import logger from "./logger.js";
import { sessionGet, sessionSet, sessionDel } from "./redisClient.js";

let io;

const ROOM_TTL = 4 * 60 * 60; // 4 hours
const rk = (roomId) => `competition:room:${roomId}`;

const getRoom  = (id)       => sessionGet(rk(id));
const saveRoom = (id, room) => sessionSet(rk(id), room, ROOM_TTL);
const dropRoom = (id)       => sessionDel(rk(id));

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

    socket.on("join_room", async ({ roomId, userName }) => {
      socket.join(roomId);
      let room = await getRoom(roomId);
      if (!room) {
        room = { players: {}, status: "waiting", questions: [], hostId: userId };
      }
      room.players[userId] = { userId, userName, score: 0, answered: 0 };
      await saveRoom(roomId, room);
      io.to(roomId).emit("room_update", room);
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
    socket.on("submit_score", async ({ roomId, score }) => {
      const room = await getRoom(roomId);
      if (!room?.players[userId]) return;
      room.players[userId].score    += score;
      room.players[userId].answered += 1;
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

    socket.on("disconnect", () => {
      logger.debug("Socket disconnected", { userId });
    });
  });
};

export const getIO = () => io;

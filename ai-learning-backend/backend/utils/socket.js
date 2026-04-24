import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import logger from "./logger.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true },
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

  // In-memory room state (single-instance only — move to Redis adapter for multi-node)
  const rooms = {};

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    socket.on("join_room", ({ roomId, userName }) => {
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = { players: {}, status: "waiting", questions: [] };
      rooms[roomId].players[userId] = { userId, userName, score: 0, answered: 0 };
      io.to(roomId).emit("room_update", rooms[roomId]);
    });

    socket.on("start_room", ({ roomId, questions }) => {
      if (!rooms[roomId]) return;
      rooms[roomId].status = "live";
      rooms[roomId].questions = questions;
      io.to(roomId).emit("game_started", { questions });
    });

    // userId comes from JWT — client cannot forge another user's score
    socket.on("submit_score", ({ roomId, score }) => {
      if (!rooms[roomId]?.players[userId]) return;
      rooms[roomId].players[userId].score += score;
      rooms[roomId].players[userId].answered += 1;
      io.to(roomId).emit("score_update", rooms[roomId].players);
    });

    socket.on("end_game", ({ roomId }) => {
      if (!rooms[roomId]) return;
      rooms[roomId].status = "finished";
      const ranked = Object.values(rooms[roomId].players)
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ ...p, rank: i + 1 }));
      io.to(roomId).emit("game_over", ranked);
      delete rooms[roomId];
    });

    socket.on("disconnect", () => {
      logger.debug("Socket disconnected", { userId });
    });
  });
};

export const getIO = () => io;

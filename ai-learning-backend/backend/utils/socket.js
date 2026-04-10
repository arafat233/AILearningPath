import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "http://localhost:5173", credentials: true } });

  // In-memory room state
  const rooms = {};

  io.on("connection", (socket) => {

    // ── Join a competition room ──────────────────────────────────
    socket.on("join_room", ({ roomId, userId, userName }) => {
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = { players: {}, status: "waiting", questions: [] };
      rooms[roomId].players[userId] = { userId, userName, score: 0, answered: 0 };
      io.to(roomId).emit("room_update", rooms[roomId]);
    });

    // ── Host starts the game ─────────────────────────────────────
    socket.on("start_room", ({ roomId, questions }) => {
      if (!rooms[roomId]) return;
      rooms[roomId].status = "live";
      rooms[roomId].questions = questions;
      io.to(roomId).emit("game_started", { questions });
    });

    // ── Player submits an answer ─────────────────────────────────
    socket.on("submit_score", ({ roomId, userId, score }) => {
      if (!rooms[roomId]?.players[userId]) return;
      rooms[roomId].players[userId].score += score;
      rooms[roomId].players[userId].answered += 1;
      io.to(roomId).emit("score_update", rooms[roomId].players);
    });

    // ── End game ─────────────────────────────────────────────────
    socket.on("end_game", ({ roomId }) => {
      if (!rooms[roomId]) return;
      rooms[roomId].status = "finished";
      const ranked = Object.values(rooms[roomId].players)
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ ...p, rank: i + 1 }));
      io.to(roomId).emit("game_over", ranked);
      delete rooms[roomId];
    });

    socket.on("disconnect", () => {});
  });
};

export const getIO = () => io;

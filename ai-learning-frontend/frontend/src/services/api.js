import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => api.post("/auth/register", data);
export const login    = (data) => api.post("/auth/login", data);

// User / Profile
export const getMe    = ()     => api.get("/user/me");
export const updateMe = (data) => api.put("/user/me", data);

// Topics (loaded from DB)
export const getTopics = () => api.get("/topics");

// Lessons
export const listLessons  = ()       => api.get("/lessons");
export const getLesson    = (topic)  => api.get(`/lessons/${encodeURIComponent(topic)}`);
export const saveProgress = (data)   => api.post("/lessons/progress", data);

// Practice
export const startTopic   = (topicId) => api.post("/practice/start", { topicId });
export const submitAnswer  = (data)   => api.post("/practice/submit", data);

// Analysis
export const getReport = () => api.get("/analysis/report");

// Revision
export const getRevisionDue = ()       => api.get("/revision/due");
export const markRevised    = (topic)  => api.post("/revision/mark", { topic });

// Exam / Competition
export const listExams      = ()       => api.get("/exam/list");
export const startExam      = (examId) => api.post("/exam/start", { examId });
export const submitExam     = (answers)=> api.post("/exam/submit", { answers });
export const getLeaderboard = (examId) => api.get(`/exam/leaderboard/${examId}`);

// Planner
export const getPlan         = ()    => api.get("/planner");
export const markDayComplete = (day) => api.post("/planner/complete", { day });

// AI
export const getAIAdvice    = ()     => api.get("/ai/advice");
export const getAIUsage     = ()     => api.get("/ai/usage");
export const getAICacheStats= ()     => api.get("/ai/cache-stats");

// ── Live Room ─────────────────────────────────────────────
export const getRoomQuestions = (topic, count) =>
  api.post("/competition/room-questions", { topic, count });

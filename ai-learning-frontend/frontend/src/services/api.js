import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({ baseURL: "http://localhost:5001/api" });

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

// Topics (loaded from DB — public, no auth needed)
export const getTopics     = (params) => api.get("/topics", { params });
export const getTopicsMeta = ()       => api.get("/topics/meta");

// Lessons
export const listLessons  = ()       => api.get("/lessons");
export const getLesson    = (topic)  => api.get(`/lessons/${encodeURIComponent(topic)}`);
export const saveProgress = (data)   => api.post("/lessons/progress", data);

// Practice
export const startTopic         = (topicId)    => api.post("/practice/start", { topicId });
export const submitAnswer       = (data)       => api.post("/practice/submit", data);
export const startMixedPractice = (topics)     => api.post("/practice/mixed", { topics });
export const flagQuestion       = (questionId) => api.post("/practice/flag", { questionId });

// Analysis
export const getReport            = ()  => api.get("/analysis/report");
export const getErrorMemory       = ()  => api.get("/analysis/errors");
export const getWeeklyLeaderboard = ()  => api.get("/analysis/weekly-leaderboard");
export const getPrediction        = ()  => api.get("/analysis/predict");

// Revision
export const getRevisionDue     = ()       => api.get("/revision/due");
export const markRevised        = (topic)  => api.post("/revision/mark", { topic });
export const getLastDayRevision = ()       => api.get("/revision/last-day");

// Exam / Competition
export const listExams      = ()       => api.get("/exam/list");
export const startExam      = (examId) => api.post("/exam/start", { examId });
export const submitExam     = (answers)=> api.post("/exam/submit", { answers });
export const getLeaderboard = (examId) => api.get(`/exam/leaderboard/${examId}`);

// Planner
export const getPlan         = ()    => api.get("/planner");
export const markDayComplete = (day) => api.post("/planner/complete", { day });

// AI
export const getAIAdvice         = ()                           => api.get("/ai/advice");
export const getAIUsage          = ()                           => api.get("/ai/usage");
export const getAICacheStats     = ()                           => api.get("/ai/cache-stats");
export const askTutor            = (message, history, topic)   => api.post("/ai/chat", { message, history, topic });
export const evaluateExplanation = (concept, userExplanation)  => api.post("/ai/evaluate-explanation", { concept, userExplanation });
export const getHint             = (questionText, topic)       => api.post("/ai/hint", { questionText, topic });
export const voiceAnswer         = (transcript, subject, topic) => api.post("/ai/voice-answer", { transcript, subject, topic });

// Badges
export const getBadges = () => api.get("/badges");

// Doubt Chat (multi-turn per question)
export const getDoubtThread   = (questionId)          => api.get(`/doubt/${questionId}`);
export const sendDoubtMessage = (questionId, message, topic, subject) =>
  api.post(`/doubt/${questionId}/message`, { message, topic, subject });
export const clearDoubtThread = (questionId)          => api.delete(`/doubt/${questionId}`);

// Admin
export const adminGetStats         = ()                    => api.get("/admin/stats");
export const adminGetUsers         = (params)              => api.get("/admin/users", { params });
export const adminUpdateRole       = (id, role)            => api.put(`/admin/users/${id}/role`, { role });
export const adminGetQuestions     = (params)              => api.get("/admin/questions", { params });
export const adminGetFlagged       = ()                    => api.get("/admin/questions/flagged");
export const adminCreateQuestion   = (data)                => api.post("/admin/questions", data);
export const adminUpdateQuestion   = (id, data)            => api.put(`/admin/questions/${id}`, data);
export const adminDeleteQuestion   = (id)                  => api.delete(`/admin/questions/${id}`);
export const adminUnflagQuestion   = (id)                  => api.put(`/admin/questions/${id}/unflag`);
export const adminGetTopics        = ()                    => api.get("/admin/topics");
export const adminCreateTopic      = (data)                => api.post("/admin/topics", data);
export const adminUpdateTopic      = (id, data)            => api.put(`/admin/topics/${id}`, data);
export const adminDeleteTopic      = (id)                  => api.delete(`/admin/topics/${id}`);

// Portal (parent/teacher)
export const generateInvite        = ()                    => api.post("/portal/generate-invite");
export const linkStudent           = (inviteCode)          => api.post("/portal/link", { inviteCode });
export const getLinkedStudents     = ()                    => api.get("/portal/students");
export const getStudentAnalytics   = (studentId)           => api.get(`/portal/students/${studentId}/analytics`);

// Live Room
export const getRoomQuestions = (topic, count) =>
  api.post("/competition/room-questions", { topic, count });

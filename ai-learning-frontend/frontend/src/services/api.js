import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL:         "http://localhost:5001/api",
  withCredentials: true,
});

// Read CSRF token cookie (set by server on login/register) and send as header
// on every state-changing request so the server can validate it in production.
const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|;\s*)csrf=([^;]+)/);
  return match ? match[1] : null;
};

api.interceptors.request.use((config) => {
  const method = (config.method || "").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = getCsrfToken();
    if (token) config.headers["x-csrf-token"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const is401   = err.response?.status === 401;
    const isGetMe = err.config?.url?.includes("/user/me");
    if (is401 && !isGetMe) useAuthStore.getState().logout();
    return Promise.reject(err);
  }
);

export const register       = (data)            => api.post("/auth/register", data);
export const login          = (data)            => api.post("/auth/login", data);
export const logoutApi      = ()                => api.post("/auth/logout");
export const forgotPassword = (email)           => api.post("/auth/forgot-password", { email });
export const resetPassword  = (token, password) => api.post(`/auth/reset-password/${token}`, { password });

export const getMe      = ()     => api.get("/user/me");
export const updateMe   = (data) => api.put("/user/me", data);
export const deleteMe   = ()     => api.delete("/user/me");

export const getTopics       = (params) => api.get("/topics", { params });
export const getTopicsMeta   = ()       => api.get("/topics/meta");
export const searchTopics    = (q, grade) => api.get("/topics", { params: { q, grade } });
export const toggleBookmark  = (questionId) => api.post(`/user/bookmarks/${questionId}`);
export const getBookmarks    = ()            => api.get("/user/bookmarks");

export const listLessons  = (subject, grade) => api.get("/lessons", { params: { subject, grade } });
export const getLesson    = (topic) => api.get(`/lessons/${encodeURIComponent(topic)}`);
export const saveProgress = (data)  => api.post("/lessons/progress", data);

export const startTopic         = (topicId)    => api.post("/practice/start", { topicId });
export const submitAnswer       = (data)       => api.post("/practice/submit", data);
export const startMixedPractice = (topics)     => api.post("/practice/mixed", { topics });
export const flagQuestion       = (questionId) => api.post("/practice/flag", { questionId });

export const getReport            = () => api.get("/analysis/report");
export const getErrorMemory       = () => api.get("/analysis/errors");
export const getWeeklyLeaderboard = () => api.get("/analysis/weekly-leaderboard");
export const getPrediction        = () => api.get("/analysis/predict");

export const getRevisionDue     = ()      => api.get("/revision/due");
export const markRevised        = (topic) => api.post("/revision/mark", { topic });
export const getLastDayRevision = ()      => api.get("/revision/last-day");

export const listExams      = ()        => api.get("/exam/list");
export const startExam      = (examId)  => api.post("/exam/start", { examId });
export const submitExam     = (answers) => api.post("/exam/submit", { answers });
export const getLeaderboard = (examId)  => api.get(`/exam/leaderboard/${examId}`);

export const getPlan         = ()           => api.get("/planner");
export const markDayComplete = (day)        => api.post("/planner/complete", { day });
export const saveTopicOrder  = (topicOrder) => api.patch("/planner/reorder", { topicOrder });

export const getAIAdvice         = ()                           => api.get("/ai/advice");
export const getAIUsage          = ()                           => api.get("/ai/usage");
export const getAICacheStats     = ()                           => api.get("/ai/cache-stats");
export const askTutor            = (message, history, topic)   => api.post("/ai/chat", { message, history, topic });
export const evaluateExplanation = (concept, userExplanation)  => api.post("/ai/evaluate-explanation", { concept, userExplanation });
export const getHint             = (questionText, topic)       => api.post("/ai/hint", { questionText, topic });
export const voiceAnswer         = (transcript, subject, topic) => api.post("/ai/voice-answer", { transcript, subject, topic });
export const getVoiceHistory     = ()     => api.get("/ai/voice-history");
export const clearVoiceHistory   = ()     => api.delete("/ai/voice-history");

export const getBadges = () => api.get("/badges");

export const submitFeedback    = (data) => api.post("/feedback", data);
export const getNpsEligibility = ()     => api.get("/feedback/nps-eligible");

export const getDoubtThread   = (questionId)                          => api.get(`/doubt/${questionId}`);
export const sendDoubtMessage = (questionId, message, topic, subject) => api.post(`/doubt/${questionId}/message`, { message, topic, subject });
export const clearDoubtThread = (questionId)                          => api.delete(`/doubt/${questionId}`);

export const adminGetStats       = ()          => api.get("/admin/stats");
export const adminGetAnalytics   = ()          => api.get("/admin/analytics");
export const adminGetUsers       = (params)    => api.get("/admin/users", { params });
export const adminUpdateRole     = (id, role)  => api.put(`/admin/users/${id}/role`, { role });
export const adminGetQuestions   = (params)    => api.get("/admin/questions", { params });
export const adminGetFlagged     = ()          => api.get("/admin/questions/flagged");
export const adminCreateQuestion = (data)      => api.post("/admin/questions", data);
export const adminUpdateQuestion = (id, data)  => api.put(`/admin/questions/${id}`, data);
export const adminDeleteQuestion = (id)        => api.delete(`/admin/questions/${id}`);
export const adminUnflagQuestion = (id)        => api.put(`/admin/questions/${id}/unflag`);
export const adminGetTopics      = ()          => api.get("/admin/topics");
export const adminCreateTopic    = (data)      => api.post("/admin/topics", data);
export const adminUpdateTopic    = (id, data)  => api.put(`/admin/topics/${id}`, data);
export const adminDeleteTopic    = (id)        => api.delete(`/admin/topics/${id}`);

export const searchStudents        = (q)          => api.get("/portal/search", { params: { q } });
export const linkStudentDirect     = (studentId)  => api.post("/portal/link-direct", { studentId });
export const removeLinkedStudent   = (studentId)  => api.delete(`/portal/students/${studentId}`);
export const getLinkedStudents     = ()           => api.get("/portal/students");
export const getStudentAnalytics   = (studentId)  => api.get(`/portal/students/${studentId}/analytics`);
export const getStudentDashboard   = (studentId)  => api.get(`/portal/students/${studentId}/dashboard`);
export const getLinkRequests       = ()           => api.get("/portal/requests");
export const respondToLinkRequest  = (id, action) => api.post(`/portal/requests/${id}/respond`, { action });
export const getClassStats         = ()           => api.get("/portal/class-stats");
export const getStudentAttempts    = (studentId, params) => api.get(`/portal/students/${studentId}/attempts`, { params });
export const getStudyReminders     = ()           => api.get("/portal/reminders");
export const setStudyReminder      = (data)       => api.post("/portal/reminders", data);
export const deleteStudyReminder   = (studentId)  => api.delete(`/portal/reminders/${studentId}`);

export const getRoomQuestions = (topic, count) => api.post("/competition/room-questions", { topic, count });

export const getCurriculumSubjects  = ()                                       => api.get("/v1/curriculum/subjects");
export const listCurriculumChapters = (subject = "Mathematics", grade = "10") => api.get("/v1/curriculum", { params: { subject, grade } });
export const getCurriculumChapter   = (chapterNumber, subject = "Mathematics", grade = "10") =>
  api.get(`/v1/curriculum/${chapterNumber}`, { params: { subject, grade } });

export const listNcertChapters    = (subject, grade) => api.get("/v1/ncert/chapters", { params: { subject, grade } });
export const getNcertChapter      = (chapterId)  => api.get(`/v1/ncert/chapters/${chapterId}`);
export const getNcertTopicContent = (topicId)    => api.get(`/v1/ncert/topics/${topicId}`);

export const getPYQTopics    = (params)  => api.get("/v1/pyq/topics", { params });
export const getPYQYears     = (params)  => api.get("/v1/pyq/years",  { params });
export const getPYQs         = (params)  => api.get("/v1/pyq",        { params });
export const getPYQById      = (id)      => api.get(`/v1/pyq/${id}`);

export const getPlans        = ()        => api.get("/v1/payment/plans");
export const getSubscription = ()        => api.get("/v1/payment/subscription");
export const createOrder     = (planKey, couponCode) => api.post("/v1/payment/create-order", { planKey, couponCode });
export const verifyPayment   = (payload)             => api.post("/v1/payment/verify", payload);
export const validateCoupon  = (code, planKey)       => api.post("/v1/payment/validate-coupon", { code, planKey });

export const getVapidKey     = ()    => api.get("/push/vapid-public-key");
export const subscribePush   = (sub) => api.post("/push/subscribe", sub);
export const unsubscribePush = ()    => api.delete("/push/subscribe");

export const getFlags           = ()          => api.get("/flags");

export const adminGetCoupons    = ()          => api.get("/admin/coupons");
export const adminCreateCoupon  = (data)      => api.post("/admin/coupons", data);
export const adminUpdateCoupon  = (id, data)  => api.put(`/admin/coupons/${id}`, data);
export const adminDeleteCoupon  = (id)        => api.delete(`/admin/coupons/${id}`);
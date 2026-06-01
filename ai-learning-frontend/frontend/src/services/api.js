import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

// Read CSRF token cookie (set by server on login/register) and send as header
// on every state-changing request so the server can validate it in production.
const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|;\s*)(?:__Host-)?csrf=([^;]+)/);
  return match ? match[1] : null;
};

api.interceptors.request.use((config) => {
  const method = (config.method || "").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = getCsrfToken();
    if (token) config.headers["x-csrf-token"] = token;
  }
  // When a parent is "viewing as" a child, every data request should be
  // scoped to that child instead of the parent's account. The backend's auth
  // middleware reads this header, verifies ownership, then swaps the actor
  // for the duration of the request. Routes that legitimately need the
  // parent identity (portal, admin, billing, etc.) are skipped server-side.
  const activeChild = useAuthStore.getState().activeChild;
  if (activeChild?._id) {
    config.headers["x-child-id"] = activeChild._id;
  }
  return config;
});

let _refreshing = false;
let _refreshQueue = [];

const flushQueue = (error) => {
  _refreshQueue.forEach((cb) => cb(error));
  _refreshQueue = [];
};

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    const is401    = err.response?.status === 401;
    const isAuth   = original?.url?.includes("/auth/");

    // Network-level failure (keep-alive connection reset) — retry once automatically
    const isNetworkError = !err.response && !original._networkRetry;
    if (isNetworkError) {
      original._networkRetry = true;
      await new Promise((r) => setTimeout(r, 150)); // brief pause for new connection
      return api(original);
    }

    // Don't try to refresh on auth routes or if already retried
    if (!is401 || isAuth || original._retry) {
      if (is401 && !original?.url?.includes("/user/me")) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(err);
    }

    if (_refreshing) {
      // Queue the request until the refresh completes
      return new Promise((resolve, reject) => {
        _refreshQueue.push((error) => {
          if (error) return reject(error);
          original._retry = true;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    _refreshing = true;

    try {
      await api.post("/auth/refresh");   // sets new httpOnly cookies silently
      flushQueue(null);
      return api(original);
    } catch (refreshErr) {
      flushQueue(refreshErr);
      useAuthStore.getState().logout();
      return Promise.reject(refreshErr);
    } finally {
      _refreshing = false;
    }
  }
);

export const register       = (data)            => api.post("/auth/register", data);
export const login          = (data)            => api.post("/auth/login", data);
export const logoutApi      = ()                => api.post("/auth/logout");
export const forgotPassword = (email)           => api.post("/auth/forgot-password", { email });
export const resetPassword  = (token, password) => api.post(`/auth/reset-password/${token}`, { password });

export const getMe          = ()     => api.get("/user/me");
export const updateMe       = (data) => api.put("/user/me", data);
export const deleteMe       = ()     => api.delete("/user/me");
export const getDailyBrief   = ()     => api.get("/user/daily-brief");
export const getStreakStatus = ()     => api.get("/user/streak-status");

// Sidebar nav per active track (school / pro_java / ...).
export const getNav           = ()     => api.get("/user/nav");
export const setActiveTrackApi = (key) => api.patch("/user/active-track", { key });

export const getTopics       = (params) => api.get("/topics", { params });
export const getTopicsMeta   = ()       => api.get("/topics/meta");
export const searchTopics    = (q, grade) => api.get("/topics", { params: { q, grade } });
export const toggleBookmark  = (questionId) => api.post(`/user/bookmarks/${questionId}`);
export const getBookmarks    = ()            => api.get("/user/bookmarks");

// ── Bookmarks v2 — server-side collections, SM-2, share, export, AI summary ──
const bm = "/v1/bookmarks";
export const bmGetReviews        = ()                    => api.get(`${bm}/reviews`);
export const bmRate              = (questionId, rating)  => api.post(`${bm}/reviews/rate`, { questionId, rating });
export const bmSetMastery        = (questionId, mastered)=> api.post(`${bm}/reviews/mastery`, { questionId, mastered });
export const bmSetNote           = (questionId, note)    => api.post(`${bm}/reviews/note`, { questionId, note });
export const bmGetDue            = (limit = 20)          => api.get(`${bm}/due`, { params: { limit } });
export const bmGetSmart          = ()                    => api.get(`${bm}/smart`);

export const bmListCollections   = ()                    => api.get(`${bm}/collections`);
export const bmCreateCollection  = (body)                => api.post(`${bm}/collections`, body);
export const bmUpdateCollection  = (id, patch)           => api.patch(`${bm}/collections/${id}`, patch);
export const bmDeleteCollection  = (id)                  => api.delete(`${bm}/collections/${id}`);
export const bmReorderCollections = (orderedIds)         => api.patch(`${bm}/collections/reorder`, { orderedIds });
export const bmAddMember         = (id, kind, refId)     => api.post(`${bm}/collections/${id}/members`, { kind, refId });
export const bmRemoveMember      = (id, kind, refId)     => api.post(`${bm}/collections/${id}/members/remove`, { kind, refId });
export const bmBulkAddMembers    = (id, items)           => api.post(`${bm}/collections/${id}/members/bulk`, { items });
export const bmShareCollection   = (id)                  => api.post(`${bm}/collections/${id}/share`);
export const bmUnshareCollection = (id)                  => api.delete(`${bm}/collections/${id}/share`);
export const bmGetSharedCollection = (token)             => api.get(`${bm}/share/${token}`);
export const bmExportUrl         = (id, format = "md")   => `${api.defaults.baseURL}${bm}/collections/${id}/export?format=${format}`;
export const bmAiSummary         = (id)                  => api.post(`${bm}/collections/${id}/ai-summary`);

export const bmListTopics        = ()                    => api.get(`${bm}/topics`);
export const bmUpsertTopic       = (body)                => api.post(`${bm}/topics`, body);
export const bmRemoveTopic       = (topicId)             => api.delete(`${bm}/topics/${encodeURIComponent(topicId)}`);
export const bmListSections      = ()                    => api.get(`${bm}/sections`);
export const bmUpsertSection     = (body)                => api.post(`${bm}/sections`, body);
export const bmRemoveSection     = (bmId)                => api.delete(`${bm}/sections/${encodeURIComponent(bmId)}`);

export const bmBulkRemove        = (ids)                 => api.post(`${bm}/bulk/remove`, { ids });
export const bmBulkMastery       = (ids, mastered)       => api.post(`${bm}/bulk/mastery`, { ids, mastered });

export const startCollectionPractice = (collectionId)    => api.post("/practice/start-bookmarks", { collectionId });

// ── Profile v2 ───────────────────────────────────────────────────────
const pv = "/v1/profile";
export const profileGetHeatmap        = ()         => api.get(`${pv}/heatmap`);
export const profileGetSubjects       = ()         => api.get(`${pv}/subjects`);
export const profileGetLevel          = ()         => api.get(`${pv}/level`);
export const profileGetGoalProgress   = ()         => api.get(`${pv}/goal-progress`);
export const profileGetActivity       = ()         => api.get(`${pv}/activity`);
export const profileGetNextBadge      = ()         => api.get(`${pv}/next-badge`);
export const profileGetBestWindow     = ()         => api.get(`${pv}/best-window`);
export const profileGetTimeline       = ()         => api.get(`${pv}/timeline`);
export const profileGetSessions       = ()         => api.get(`${pv}/sessions`);
export const profileRevokeSession     = (id)       => api.delete(`${pv}/sessions/${id}`);
export const profileGetCertificates   = ()         => api.get(`${pv}/certificates`);
export const profileGetClassmateCompare = ()       => api.get(`${pv}/classmate-compare`);
export const profileGetMood           = ()         => api.get(`${pv}/mood`);
export const profileSetMood           = (mood, note = "") => api.post(`${pv}/mood`, { mood, note });
export const profileUpdateSettings    = (patch)    => api.patch(`${pv}/settings`, patch);
export const profileSetPublic         = (patch)    => api.patch(`${pv}/public`, patch);
export const profileSetParentVisibility = (parentId, vis) => api.patch(`${pv}/parent-visibility`, { parentId, ...vis });
export const profileExportUrl         = ()         => `${api.defaults.baseURL}${pv}/export`;
export const profileGetPublic         = (slug)     => api.get(`${pv}/public/${slug}`);

// ── Lessons v2 ───────────────────────────────────────────────────────
const lv = "/v1/lessons-v2";
export const lessonsV2Dashboard   = (subject, grade) => api.get(`${lv}/dashboard`, { params: { subject, grade } });
export const lessonsV2Search      = (q, subject, grade) => api.get(`${lv}/search`, { params: { q, subject, grade } });
export const lessonsV2Diagnostic  = (topicId)        => api.get(`${lv}/diagnostic/${encodeURIComponent(topicId)}`);
export const lessonsV2CoStudy     = (topicId, name)  => api.post(`${lv}/co-study`, { topicId, name });

// ── Analytics v2 ──────────────────────────────────────────────────────
const av = "/v1/analytics-v2";
export const analyticsV2Dashboard = (subject)  => api.get(`${av}/dashboard`, { params: subject ? { subject } : {} });

// ── Dashboard v2 ────────────────────────────────────────────────────
const dv = "/v1/dashboard-v2";
export const dashboardV2Get        = ()                  => api.get(`${dv}/dashboard`);
export const dashboardV2Commit     = (goalMinutes)       => api.post(`${dv}/commitment`, { goalMinutes });
export const dashboardV2Snooze     = (taskId, reason)    => api.post(`${dv}/snooze`, { taskId, reason });
export const dashboardV2Widget     = (patch)             => api.patch(`${dv}/widget`, patch);

// ── Competition v2 ─────────────────────────────────────────────────
const cv = "/v1/competition-v2";
export const compV2Dashboard     = ()                      => api.get(`${cv}/dashboard`);
export const compV2CreateRoom    = (body)                  => api.post(`${cv}/rooms`, body);
export const compV2ListRooms     = ()                      => api.get(`${cv}/rooms`);
export const compV2GetRoom       = (code)                  => api.get(`${cv}/rooms/${code}`);
export const compV2JoinRoom      = (code)                  => api.post(`${cv}/rooms/${code}/join`);
export const compV2LeaveRoom     = (code)                  => api.post(`${cv}/rooms/${code}/leave`);
export const compV2ReadyUp       = (code)                  => api.post(`${cv}/rooms/${code}/ready`);
export const compV2StartMatch    = (code)                  => api.post(`${cv}/rooms/${code}/start`);
export const compV2RecordAnswer  = (code, body)            => api.post(`${cv}/rooms/${code}/answer`, body);
export const compV2FinishMatch   = (code)                  => api.post(`${cv}/rooms/${code}/finish`);
export const compV2QuickMatch    = (subject)               => api.post(`${cv}/quick-match`, { subject });
export const compV2History       = ()                      => api.get(`${cv}/history`);
export const compV2Quests        = ()                      => api.get(`${cv}/quests`);
export const compV2Report        = (body)                  => api.post(`${cv}/report`, body);

// ── Live Room v2 ────────────────────────────────────────────────────
export const liveRoomTheme   = ()    => api.get("/v1/live-room/theme");
export const liveRoomFriends = ()    => api.get("/v1/live-room/friends");

// ── Parent View v2 ─────────────────────────────────────────────────
const pv2 = "/v1/parent";
export const parentDashboardV2  = (childId)        => api.get(`${pv2}/dashboard/${childId}`);
export const parentSetControls  = (childId, patch) => api.patch(`${pv2}/controls/${childId}`, patch);
export const parentSendMessage  = (childId, message) => api.post(`${pv2}/message`, { childId, message });
export const parentCosignGoal   = (childId, goal)  => api.post(`${pv2}/cosign-goal`, { childId, goal });

// ── School Group v2 ──────────────────────────────────────────────────
const sg = "/v1/school-group";
export const sgDashboard         = ()                     => api.get(`${sg}/dashboard`);
export const sgSendKudos         = (body)                 => api.post(`${sg}/kudos`, body);
export const sgCreateChallenge   = (body)                 => api.post(`${sg}/challenge`, body);
export const sgPostTeacher       = (body)                 => api.post(`${sg}/teacher-post`, body);
export const sgReactPost         = (id, emoji)            => api.post(`${sg}/teacher-post/${id}/react`, { emoji });
export const sgCommentPost       = (id, text)             => api.post(`${sg}/teacher-post/${id}/comment`, { text });
export const sgSetFocus          = (body)                 => api.post(`${sg}/subject-focus`, body);
export const sgGetPrefs          = ()                     => api.get(`${sg}/prefs`);
export const sgUpdatePrefs       = (patch)                => api.patch(`${sg}/prefs`, patch);
export const sgReport            = (body)                 => api.post(`${sg}/report`, body);

export const listLessons       = (subject, grade) => api.get("/lessons", { params: { subject, grade } });
export const getLesson         = (topic) => api.get(`/lessons/${encodeURIComponent(topic)}`);
export const saveProgress      = (data)  => api.post("/lessons/progress", data);
export const getCompletedLessons = ()    => api.get("/lessons/completed");

export const startTopic         = (topicId, excludeCurrentId, mode) => api.post("/practice/start", { topicId, ...(excludeCurrentId ? { excludeCurrentId } : {}), ...(mode ? { mode } : {}) });
export const submitAnswer       = (data)       => api.post("/practice/submit", data);
export const startMixedPractice = (topics)     => api.post("/practice/mixed", { topics });
export const flagQuestion           = (questionId) => api.post("/practice/flag", { questionId });
export const reportQuestion         = (questionId, reason, note = "") => api.post("/practice/report", { questionId, reason, note });
export const submitSkipReason       = (questionId, reason) => api.post("/practice/skip-reason", { questionId, reason });
export const submitErrorLabel       = (questionId, label) => api.post("/practice/error-label", { questionId, label });
export const getQuestionStats       = (questionId) => api.get(`/practice/question-stats/${questionId}`);
export const getPeerTime            = (questionId) => api.get(`/practice/peer-time/${questionId}`);
export const getQuestionLineage     = (questionId) => api.get(`/practice/lineage/${questionId}`);
export const startBookmarkPractice = ()           => api.post("/practice/start-bookmarks");
export const startRetryPractice    = (questionIds) => api.post("/practice/start-bookmarks", { questionIds });

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

export const getPlan            = ()              => api.get("/planner");
export const listStudyPlans     = ()              => api.get("/planner/all");
export const getPlanById        = (id)            => api.get(`/planner/${id}`);
export const createStudyPlan    = (data)          => api.post("/planner", data);
export const activatePlan       = (id)            => api.put(`/planner/${id}/activate`);
export const updatePlanSettings = (id, data)      => api.put(`/planner/${id}/settings`, data);
export const deleteStudyPlan    = (id)            => api.delete(`/planner/${id}`);
export const reschedulePlan     = ()              => api.post("/planner/reschedule");
export const smartRebalancePlan      = (pinnedTopics = []) => api.post("/planner/smart-rebalance", { pinnedTopics });
export const getPlannerClassStats    = ()              => api.get("/planner/class-stats");
export const sendPlannerDigestNow    = ()              => api.post("/planner/digest-now");
export const generateShareToken = ()              => api.post("/planner/share");
export const getSharedPlan      = (token)         => api.get(`/planner/share/${token}`);
export const markDayComplete    = (day, planId)   => api.post("/planner/complete", { day, planId });
export const saveTopicOrder     = (order, planId) => api.patch("/planner/reorder", { topicOrder: order, planId });
export const saveDayNote        = (day, note, planId) => api.patch("/planner/note", { day, note, planId });

export const getAIAdvice         = ()                           => api.get("/ai/advice");
export const getAIUsage          = ()                           => api.get("/ai/usage");
export const getAICacheStats     = ()                           => api.get("/ai/cache-stats");
export const getAIMetrics        = ()                           => api.get("/ai/metrics");
export const askTutor            = (message, history, topic, subject) => api.post("/ai/chat", { message, history, topic, subject });
export const saveVoiceTutorNote  = (data)                      => api.post("/ai/save-note", data);
export const getSavedVoiceTutorNotes = ()                      => api.get("/ai/saved-notes");
export const deleteVoiceTutorNote    = (id)                    => api.delete(`/ai/saved-notes/${id}`);
export const evaluateExplanation = (concept, userExplanation)  => api.post("/ai/evaluate-explanation", { concept, userExplanation });
export const getHint             = (questionText, topic)       => api.post("/ai/hint", { questionText, topic });
export const voiceAnswer         = (transcript, subject, topic) => api.post("/ai/voice-answer", { transcript, subject, topic });
export const getVoiceHistory     = ()     => api.get("/ai/voice-history");
export const clearVoiceHistory   = ()     => api.delete("/ai/voice-history");
export const rateAIResponse      = (questionText, mistakeType, subject, rating) =>
  api.post("/ai/feedback", { questionText, mistakeType, subject, rating });

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
export const adminGetRagHealth   = ()          => api.get("/admin/rag-health");
export const adminGetRetention   = ()          => api.get("/admin/retention");
export const adminSendTestEmail  = (to)        => api.post("/admin/send-test-email", { to });
export const adminRunTrialEmails = ()          => api.post("/admin/run-trial-expiry-soon-emails");
export const adminGetCertificates = (params)  => api.get("/admin/certificates", { params });
export const adminUpdateUserPlan  = (id, data) => api.put(`/admin/users/${id}/plan`, data);
export const adminDeleteUser      = (id)       => api.delete(`/admin/users/${id}`);
export const adminGetUserDetail   = (id)       => api.get(`/admin/users/${id}/detail`);

export const getMyGuardians        = ()           => api.get("/portal/my-guardians");
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

export const listNcertChapters    = (subject, grade, board) => api.get("/v1/ncert/chapters", { params: { subject, grade, board } });
export const listAvailableSubjects = (board, grade) => api.get("/v1/ncert/available-subjects", { params: { board, grade } });
export const getNcertChapter      = (chapterId)         => api.get(`/v1/ncert/chapters/${chapterId}`);
export const listNcertTopics      = (chapterNumber, subject, chapterId) => api.get("/v1/ncert/topics", { params: { chapterNumber, subject, chapterId } });
export const getNcertTopicContent = (topicId)           => api.get(`/v1/ncert/topics/${topicId}`);
export const getPaperQuestions    = (topicId)           => api.get(`/v1/ncert/topics/${topicId}/paper-questions`);
export const getMasteryTest       = (topicId, excludeIds = []) =>
  api.get(`/v1/ncert/topics/${topicId}/mastery-test`, { params: { excludeIds: excludeIds.join(",") } });
export const submitMasteryTest    = (topicId, answers) =>
  api.post(`/v1/ncert/topics/${topicId}/mastery-test/submit`, { answers });
export const getStudiedTopics     = ()                  => api.get("/v1/ncert/studied", { params: { _: Date.now() } });
export const toggleNcertStudied   = (topicId)           => api.post(`/v1/ncert/studied/${topicId}`);
export const getNcertNote         = (topicId)           => api.get(`/v1/ncert/notes/${topicId}`);
export const saveNcertNote        = (topicId, text)     => api.put(`/v1/ncert/notes/${topicId}`, { text });

export const getPYQTopics    = (params)  => api.get("/v1/pyq/topics", { params });
export const getPYQYears     = (params)  => api.get("/v1/pyq/years",  { params });
export const getPYQs         = (params)  => api.get("/v1/pyq",        { params });
export const getPYQById      = (id)      => api.get(`/v1/pyq/${id}`);
export const getPYQDashboard = (params)  => api.get("/v1/pyq/dashboard", { params });
export const enrichPYQs      = (body)    => api.post("/v1/pyq/enrich", body);
export const buildPYQMock    = (body)    => api.post("/v1/pyq/mock-from-filters", body);
export const getPYQChapters  = (params)  => api.get("/v1/pyq/chapters", { params });

export const getPlans        = ()        => api.get("/v1/payment/plans");
export const getSubscription = ()        => api.get("/v1/payment/subscription");
export const createOrder     = (planKey, couponCode) => api.post("/v1/payment/create-order", { planKey, couponCode });
export const verifyPayment   = (payload)             => api.post("/v1/payment/verify", payload);
export const validateCoupon  = (code, planKey)       => api.post("/v1/payment/validate-coupon", { code, planKey });

export const getVapidKey     = ()    => api.get("/push/vapid-public-key");
export const subscribePush   = (sub) => api.post("/push/subscribe", sub);
export const unsubscribePush = ()    => api.delete("/push/subscribe");

export const getFlags           = ()          => api.get("/flags");

export const adminGetCoupons             = ()          => api.get("/admin/coupons");
export const adminCreateCoupon           = (data)      => api.post("/admin/coupons", data);
export const adminUpdateCoupon           = (id, data)  => api.put(`/admin/coupons/${id}`, data);
export const adminDeleteCoupon           = (id)        => api.delete(`/admin/coupons/${id}`);
export const adminGetPayments            = (params)    => api.get("/admin/payments", { params });
export const adminRunOnboardingEmails    = ()          => api.post("/admin/run-onboarding-emails");
export const adminRunWeeklyParentEmails  = ()          => api.post("/admin/run-weekly-parent-emails");
export const adminGetFeedback            = ()          => api.get("/feedback");
export const adminGetCouponRedemptions   = (id)        => api.get(`/admin/coupons/${id}/redemptions`);

export const generateMock = (opts) => api.post("/exam/generate-mock", opts);

export const getPublicStats = () => api.get("/public/stats");

export const createChild  = (data)        => api.post("/user/children", data);
export const getChildren  = ()            => api.get("/user/children");
export const updateChild  = (id, patch)   => api.put(`/user/children/${id}`, patch);
export const deleteChild  = (id)          => api.delete(`/user/children/${id}`);

export const getPlacementQuiz   = ()          => api.get("/v1/placement-quiz");
export const getPlacementStatus = ()          => api.get("/v1/placement-quiz/status");
export const scorePlacementQuiz = (answers)   => api.post("/v1/placement-quiz/score", { answers });

export const getNextTopic       = ()          => api.get("/v1/recommender/next-topic");
export const getNextQuestion    = (topicId)   => api.get(`/v1/recommender/next-question/${topicId}`);
export const getTopicMastery    = (topicId)   => api.get(`/v1/recommender/mastery/${topicId}`);
export const recordAdaptiveAttempt = (data)   => api.post("/v1/recommender/record-attempt", data);

export const getMyEnrollment      = ()                         => api.get("/v1/schools/my-enrollment");
export const joinSchoolByCode     = (joinCode)                 => api.post("/v1/schools/join", { joinCode });
export const createSchool         = (schoolName)               => api.post("/v1/schools", { schoolName });
export const listMySchools        = ()                         => api.get("/v1/schools");
export const getSchoolDetail      = (id)                       => api.get(`/v1/schools/${id}`);
export const getDynamicTopics     = ()                         => api.get("/v1/schools/dynamic-topics");
export const getHomeworkQuestion  = (params)                   => api.get("/v1/schools/homework", { params });
export const getHomeworkSet       = (data)                     => api.post("/v1/schools/homework-set", data);

// ── Pro track (PRO_TRACK_PLAN.md §4.4) ──────────────────────────────────────
// All /api/v1/pro/* routes are gated behind PRO_TRACKS_ENABLED_FOR_EMAILS
// on the backend. Frontend calls are otherwise normal — the actAsChild
// header is suppressed for /pro/* because pro routes are in the skip list.
export const proListTracks         = ()                              => api.get("/v1/pro/tracks");
export const proGetTrack           = (trackSlug)                     => api.get(`/v1/pro/tracks/${trackSlug}`);
export const proGetModule          = (trackSlug, moduleId)           => api.get(`/v1/pro/tracks/${trackSlug}/modules/${moduleId}`);
export const proGetTopic           = (topicId)                       => api.get(`/v1/pro/topics/${topicId}`);
export const proListExercises      = (topicId)                       => api.get(`/v1/pro/topics/${topicId}/exercises`);
export const proGetExercise        = (exerciseId)                    => api.get(`/v1/pro/exercises/${exerciseId}`);
export const proSubmitExercise     = (exerciseId, code)              => api.post(`/v1/pro/exercises/${exerciseId}/submit`, { code });
export const proGetProgress        = (trackKey)                      => api.get(`/v1/pro/progress/${trackKey}`);
export const proEnroll             = (trackKey)                      => api.post("/v1/pro/enroll", { trackKey });
// Polymorphic bookmarks — exercise / topic / project. List groups by kind.
export const proToggleExerciseBookmark = (exerciseId)                => api.post(`/v1/pro/exercises/${exerciseId}/bookmark`);
// Projects
export const proGetProject             = (projectId)                  => api.get(`/v1/pro/projects/${projectId}`);
export const proSubmitProject          = (projectId, code, checkedReqs) => api.post(`/v1/pro/projects/${projectId}/submit`, { code, checkedReqs });
export const proToggleProjectBookmark  = (projectId)                  => api.post(`/v1/pro/projects/${projectId}/bookmark`);
export const proToggleTopicBookmark    = (topicId)                   => api.post(`/v1/pro/topics/${topicId}/bookmark`);
export const proListBookmarks          = (trackKey = "pro_java")     => api.get(`/v1/pro/bookmarks`, { params: { trackKey } });
// Back-compat alias (older import name)
export const proToggleBookmark         = proToggleExerciseBookmark;

// ── Pro Interview Simulator ──────────────────────────────────────────────────
const iv = "/v1/pro/interview";
export const interviewListProblems    = (params = {})              => api.get(`${iv}/problems`, { params });
export const interviewCreateSession   = (problemId)                => api.post(`${iv}/sessions`, { problemId });
export const interviewGetSession      = (sessionId)                => api.get(`${iv}/sessions/${sessionId}`);
export const interviewSendMessage     = (sessionId, content, silenceProbe = false) =>
  api.post(`${iv}/sessions/${sessionId}/message`, { content, silenceProbe });
export const interviewEndSession      = (sessionId, code, scratchpad) =>
  api.post(`${iv}/sessions/${sessionId}/end`, { code, scratchpad });
export const interviewListHistory     = ()                         => api.get(`${iv}/history`);

// ── Pro public (free-tier) — no auth required ────────────────────────────────
export const proGetTopicPublic     = (topicId) => api.get(`/public/pro/topics/${topicId}`);
export const proListExercisesPublic = (topicId) => api.get(`/public/pro/topics/${topicId}/exercises`);

// ── Pro Community Discussions (D5.3) ─────────────────────────────────────────
export const proListDiscussions  = (topicId)        => api.get(`/v1/pro/topics/${topicId}/discussions`);
export const proCreateDiscussion = (topicId, body)  => api.post(`/v1/pro/topics/${topicId}/discussions`, { body });
export const proReplyDiscussion  = (threadId, body) => api.post(`/v1/pro/discussions/${threadId}/replies`, { body });
export const proUpvoteDiscussion = (threadId)       => api.post(`/v1/pro/discussions/${threadId}/upvote`);
export const proDeleteDiscussion = (threadId)       => api.delete(`/v1/pro/discussions/${threadId}`);

// ── Pro Pattern Atlas ────────────────────────────────────────────────────────

export const proGetPatternAtlas = (trackKey = "pro_java") =>
  api.get("/v1/pro/pattern-atlas", { params: { trackKey } });

// ── Pro Problem-First Reveal (ROADMAP G) ───────────────────────────────────
export const proRecordReveal  = (topicId) => api.post(`/v1/pro/topics/${topicId}/reveal`);

// ── Pro Spaced Repetition (review queue) ───────────────────────────────────
export const proGetDueReviews = (trackKey = "pro_java") =>
  api.get("/v1/pro/review/due", { params: { trackKey } });
export const proRecordReview  = (topicId, trackKey, rating) =>
  api.post(`/v1/pro/review/${topicId}`, { trackKey, rating });

// ── Pro Tutor ────────────────────────────────────────────────────────────────
export const proTutorAsk        = (exerciseId, studentCode, question) =>
  api.post("/v1/pro/tutor/ask", { exerciseId, studentCode, question });
export const proTutorGetSession = (exerciseId) =>
  api.get(`/v1/pro/tutor/session/${exerciseId}`);
export const proTutorRate       = (sessionId, messageIndex, rating) =>
  api.post(`/v1/pro/tutor/session/${sessionId}/rate`, { messageIndex, rating });

// ── Pro Analytics ────────────────────────────────────────────────────────
export const proAnalyticsDashboard = (trackKey) =>
  api.get("/v1/pro-analytics/dashboard", { params: trackKey ? { trackKey } : {} });
export const proGetCertificate = (trackKey) =>
  api.get("/v1/pro-analytics/certificate", { params: { trackKey } });
export const proGetCertificates = (trackKey) =>
  api.get("/v1/pro-analytics/certificates", { params: { trackKey } });
export const proIssueCertificate = (trackKey, moduleId) =>
  api.post("/v1/pro-analytics/certificates/issue", { trackKey, moduleId });
export const proGetLeaderboard = (trackKey, limit = 20) =>
  api.get("/v1/pro-analytics/leaderboard", { params: { trackKey, limit } });
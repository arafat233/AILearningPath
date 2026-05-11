import * as svc from "../services/bookmarkService.js";

export const getReviews = async (req, res, next) => {
  try { res.json({ data: await svc.getReviewsForUser(req.user.id) }); } catch (e) { next(e); }
};

export const rate = async (req, res, next) => {
  try {
    const { questionId, rating } = req.body;
    res.json({ data: await svc.rateReview(req.user.id, questionId, rating) });
  } catch (e) { next(e); }
};

export const setMastery = async (req, res, next) => {
  try {
    const { questionId, mastered } = req.body;
    res.json({ data: await svc.setMastery(req.user.id, questionId, !!mastered) });
  } catch (e) { next(e); }
};

export const setNote = async (req, res, next) => {
  try {
    const { questionId, note } = req.body;
    res.json({ data: await svc.setNote(req.user.id, questionId, note) });
  } catch (e) { next(e); }
};

export const dueQueue = async (req, res, next) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    res.json({ data: await svc.getDueQuestions(req.user.id, limit) });
  } catch (e) { next(e); }
};

export const smart = async (req, res, next) => {
  try { res.json({ data: await svc.computeSmartCollections(req.user.id) }); } catch (e) { next(e); }
};

// Collections
export const listCols = async (req, res, next) => {
  try { res.json({ data: await svc.listCollections(req.user.id) }); } catch (e) { next(e); }
};
export const createCol = async (req, res, next) => {
  try { res.json({ data: await svc.createCollection(req.user.id, req.body) }); } catch (e) { next(e); }
};
export const updateCol = async (req, res, next) => {
  try { res.json({ data: await svc.updateCollection(req.user.id, req.params.id, req.body) }); } catch (e) { next(e); }
};
export const deleteCol = async (req, res, next) => {
  try { await svc.deleteCollection(req.user.id, req.params.id); res.json({ data: { ok: true } }); } catch (e) { next(e); }
};
export const reorderCols = async (req, res, next) => {
  try { await svc.reorderCollections(req.user.id, req.body.orderedIds || []); res.json({ data: { ok: true } }); } catch (e) { next(e); }
};
export const addToCol = async (req, res, next) => {
  try {
    const { kind, refId } = req.body;
    res.json({ data: await svc.addToCollection(req.user.id, req.params.id, kind, refId) });
  } catch (e) { next(e); }
};
export const removeFromCol = async (req, res, next) => {
  try {
    const { kind, refId } = req.body;
    res.json({ data: await svc.removeFromCollection(req.user.id, req.params.id, kind, refId) });
  } catch (e) { next(e); }
};
export const bulkAddToCol = async (req, res, next) => {
  try {
    res.json({ data: await svc.bulkAddToCollection(req.user.id, req.params.id, req.body.items || []) });
  } catch (e) { next(e); }
};

// Topic / Section bookmarks
export const listTopics = async (req, res, next) => {
  try { res.json({ data: await svc.listTopicBookmarks(req.user.id) }); } catch (e) { next(e); }
};
export const upsertTopic = async (req, res, next) => {
  try { res.json({ data: await svc.upsertTopicBookmark(req.user.id, req.body) }); } catch (e) { next(e); }
};
export const removeTopic = async (req, res, next) => {
  try { await svc.removeTopicBookmark(req.user.id, req.params.topicId); res.json({ data: { ok: true } }); } catch (e) { next(e); }
};
export const listSections = async (req, res, next) => {
  try { res.json({ data: await svc.listSectionBookmarks(req.user.id) }); } catch (e) { next(e); }
};
export const upsertSection = async (req, res, next) => {
  try { res.json({ data: await svc.upsertSectionBookmark(req.user.id, req.body) }); } catch (e) { next(e); }
};
export const removeSection = async (req, res, next) => {
  try { await svc.removeSectionBookmark(req.user.id, req.params.bmId); res.json({ data: { ok: true } }); } catch (e) { next(e); }
};

// Bulk actions
export const bulkRemove = async (req, res, next) => {
  try { res.json({ data: await svc.bulkRemoveQuestions(req.user.id, req.body.ids || []) }); } catch (e) { next(e); }
};
export const bulkMastery = async (req, res, next) => {
  try { res.json({ data: await svc.bulkSetMastery(req.user.id, req.body.ids || [], !!req.body.mastered) }); } catch (e) { next(e); }
};

// Share
export const share = async (req, res, next) => {
  try {
    const token = await svc.generateCollectionShareToken(req.user.id, req.params.id);
    const base = process.env.FRONTEND_URL?.split(",")[0]?.trim() || "http://localhost:5173";
    res.json({ data: { token, url: `${base}/c/${token}` } });
  } catch (e) { next(e); }
};
export const unshare = async (req, res, next) => {
  try { await svc.revokeCollectionShareToken(req.user.id, req.params.id); res.json({ data: { ok: true } }); } catch (e) { next(e); }
};
export const getShared = async (req, res, next) => {
  try { res.json({ data: await svc.getSharedCollection(req.params.token) }); } catch (e) { next(e); }
};

// Export
export const exportCol = async (req, res, next) => {
  try {
    const fmt = req.query.format === "anki" ? "anki" : "md";
    const { mime, filename, body } = await svc.exportCollection(req.user.id, req.params.id, fmt);
    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(body);
  } catch (e) { next(e); }
};

// AI summary
export const aiSummary = async (req, res, next) => {
  try { res.json({ data: { summary: await svc.generateAiSummary(req.user.id, req.params.id) } }); } catch (e) { next(e); }
};

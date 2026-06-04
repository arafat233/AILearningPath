import * as svc from "../services/communityService.js";

const uid = (req) => req.user.id;

export const list = async (req, res, next) => {
  try { res.json({ data: await svc.listPosts(uid(req), req.query) }); } catch (e) { next(e); }
};
export const get = async (req, res, next) => {
  try { res.json({ data: await svc.getPost(uid(req), req.params.id) }); } catch (e) { next(e); }
};
export const create = async (req, res, next) => {
  try { res.status(201).json({ data: await svc.createPost(uid(req), req.body) }); } catch (e) { next(e); }
};
export const edit = async (req, res, next) => {
  try { res.json({ data: await svc.editPost(uid(req), req.params.id, req.body) }); } catch (e) { next(e); }
};
export const remove = async (req, res, next) => {
  try { res.json({ data: await svc.deletePost(uid(req), req.params.id) }); } catch (e) { next(e); }
};
export const upvote = async (req, res, next) => {
  try { res.json({ data: await svc.toggleUpvote(uid(req), req.params.id) }); } catch (e) { next(e); }
};
export const comment = async (req, res, next) => {
  try { res.status(201).json({ data: await svc.addComment(uid(req), req.params.id, req.body.body) }); } catch (e) { next(e); }
};
export const removeComment = async (req, res, next) => {
  try { res.json({ data: await svc.deleteComment(uid(req), req.params.id, req.params.commentId) }); } catch (e) { next(e); }
};
export const report = async (req, res, next) => {
  try { res.json({ data: await svc.reportPost(uid(req), req.params.id, req.body.reason) }); } catch (e) { next(e); }
};
export const tags = async (req, res, next) => {
  try { res.json({ data: await svc.listTags() }); } catch (e) { next(e); }
};

// ── Admin (adminAuth) ──
export const adminReports = async (req, res, next) => {
  try { res.json({ data: await svc.listReported() }); } catch (e) { next(e); }
};
export const adminModerate = async (req, res, next) => {
  try { res.json({ data: await svc.moderate(uid(req), req.params.id, req.body.action) }); } catch (e) { next(e); }
};
export const adminRemove = async (req, res, next) => {
  try { res.json({ data: await svc.adminDelete(uid(req), req.params.id) }); } catch (e) { next(e); }
};

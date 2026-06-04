import * as svc from "../services/noteService.js";

export const create = async (req, res, next) => {
  try { res.status(201).json({ data: await svc.createNote(req.user.id, req.body) }); } catch (e) { next(e); }
};

export const listForItem = async (req, res, next) => {
  try {
    const { kind, refId } = req.params;
    res.json({ data: await svc.listForItem(req.user.id, kind, refId) });
  } catch (e) { next(e); }
};

export const notebook = async (req, res, next) => {
  try { res.json({ data: await svc.listNotebook(req.user.id, req.query) }); } catch (e) { next(e); }
};

export const tags = async (req, res, next) => {
  try { res.json({ data: await svc.listTags(req.user.id) }); } catch (e) { next(e); }
};

export const stats = async (req, res, next) => {
  try { res.json({ data: await svc.getStats(req.user.id) }); } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try { res.json({ data: await svc.updateNote(req.user.id, req.params.id, req.body) }); } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try { res.json({ data: await svc.deleteNote(req.user.id, req.params.id) }); } catch (e) { next(e); }
};

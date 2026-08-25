import * as svc from "../services/uploadService.js";

export async function create(req, res, next) {
  try {
    const result = await svc.createSource(req.user.id, req.body);
    res.status(201).json({ data: result });
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    res.json({ data: await svc.listSources(req.user.id) });
  } catch (err) { next(err); }
}

export async function remove(req, res, next) {
  try {
    res.json({ data: await svc.deleteSource(req.user.id, req.params.id) });
  } catch (err) { next(err); }
}

import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { listCareerPaths, getCareerState, setCareerPath, toggleScholarship } from "../services/careerService.js";

const r = express.Router();

// Roadmaps + the user's chosen path + grade-filtered scholarships, one call
r.get("/", auth, async (req, res, next) => {
  try {
    const state = await getCareerState(req.user.id);
    res.json({ data: { paths: listCareerPaths(), ...state } });
  } catch (e) { next(e); }
});

const pathSchema = Joi.object({ key: Joi.string().max(60).allow(null).required() });
r.put("/path", auth, validate(pathSchema), async (req, res, next) => {
  try { res.json({ data: await setCareerPath(req.user.id, req.body.key) }); } catch (e) { next(e); }
});

const trackSchema = Joi.object({ id: Joi.string().max(60).required() });
r.post("/track", auth, validate(trackSchema), async (req, res, next) => {
  try { res.json({ data: await toggleScholarship(req.user.id, req.body.id) }); } catch (e) { next(e); }
});

export default r;

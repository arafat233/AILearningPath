import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  searchStudents, linkStudentDirect, removeLinkedStudent,
  getLinkedStudents, getStudentAnalytics, getStudentDashboardCtrl,
  getLinkRequests, respondToLinkRequest,
} from "../controllers/portalController.js";

const r = Router();
r.use(auth);

const linkDirectSchema = Joi.object({
  studentId: Joi.string().length(24).hex().required(),
});

const respondSchema = Joi.object({
  action: Joi.string().valid("accept", "reject").required(),
});

r.get("/search",                              searchStudents);
r.post("/link-direct",                        validate(linkDirectSchema), linkStudentDirect);
r.delete("/students/:studentId",              removeLinkedStudent);
r.get("/students",                            getLinkedStudents);
r.get("/students/:studentId/analytics",       getStudentAnalytics);
r.get("/students/:studentId/dashboard",       getStudentDashboardCtrl);
r.get("/requests",                            getLinkRequests);
r.post("/requests/:id/respond",               validate(respondSchema), respondToLinkRequest);

export default r;

import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  searchStudents, linkStudentDirect, removeLinkedStudent,
  getLinkedStudents, getStudentAnalytics, getStudentDashboardCtrl,
} from "../controllers/portalController.js";

const r = Router();
r.use(auth);

const linkDirectSchema = Joi.object({
  studentId: Joi.string().length(24).hex().required(),
});

r.get("/search",                              searchStudents);
r.post("/link-direct",                        validate(linkDirectSchema), linkStudentDirect);
r.delete("/students/:studentId",              removeLinkedStudent);
r.get("/students",                            getLinkedStudents);
r.get("/students/:studentId/analytics",       getStudentAnalytics);
r.get("/students/:studentId/dashboard",       getStudentDashboardCtrl);

export default r;

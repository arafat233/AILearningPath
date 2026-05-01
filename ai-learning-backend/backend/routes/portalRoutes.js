import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { generateInvite, linkStudent, getLinkedStudents, getStudentAnalytics, getStudentDashboardCtrl } from "../controllers/portalController.js";

const r = Router();
r.use(auth);

const linkSchema = Joi.object({
  inviteCode: Joi.string().trim().required(),
});

r.post("/generate-invite",                    generateInvite);
r.post("/link",                               validate(linkSchema), linkStudent);
r.get("/students",                            getLinkedStudents);
r.get("/students/:studentId/analytics",       getStudentAnalytics);
r.get("/students/:studentId/dashboard",       getStudentDashboardCtrl);

export default r;

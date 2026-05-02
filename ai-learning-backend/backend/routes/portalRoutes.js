import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  searchStudents, linkStudentDirect, removeLinkedStudent,
  getLinkedStudents, getStudentAnalytics, getStudentDashboardCtrl,
  getLinkRequests, respondToLinkRequest,
  setStudyReminder, getStudyReminders, deleteStudyReminder,
  getClassStats, getStudentAttempts,
} from "../controllers/portalController.js";

const r = Router();
r.use(auth);

const linkDirectSchema = Joi.object({
  studentId: Joi.string().length(24).hex().required(),
});

const respondSchema = Joi.object({
  action: Joi.string().valid("accept", "reject").required(),
});

const reminderSchema = Joi.object({
  studentId: Joi.string().length(24).hex().required(),
  time:      Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  days:      Joi.array().items(Joi.string().valid("Mon","Tue","Wed","Thu","Fri","Sat","Sun")).optional(),
});

r.get("/search",                              searchStudents);
r.post("/link-direct",                        validate(linkDirectSchema), linkStudentDirect);
r.delete("/students/:studentId",              removeLinkedStudent);
r.get("/students",                            getLinkedStudents);
r.get("/students/:studentId/analytics",       getStudentAnalytics);
r.get("/students/:studentId/dashboard",       getStudentDashboardCtrl);
r.get("/students/:studentId/attempts",        getStudentAttempts);
r.get("/requests",                            getLinkRequests);
r.post("/requests/:id/respond",               validate(respondSchema), respondToLinkRequest);
r.get("/class-stats",                         getClassStats);
r.get("/reminders",                           getStudyReminders);
r.post("/reminders",                          validate(reminderSchema), setStudyReminder);
r.delete("/reminders/:studentId",             deleteStudyReminder);

export default r;

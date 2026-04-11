import { Router } from "express";
import auth from "../middleware/auth.js";
import { generateInvite, linkStudent, getLinkedStudents, getStudentAnalytics } from "../controllers/portalController.js";

const r = Router();
r.use(auth);

r.post("/generate-invite",                    generateInvite);
r.post("/link",                               linkStudent);
r.get("/students",                            getLinkedStudents);
r.get("/students/:studentId/analytics",       getStudentAnalytics);

export default r;

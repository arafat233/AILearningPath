import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createSchool,
  listSchools,
  getSchool,
  enrollStudentById,
  joinByCode,
  myEnrollment,
  getHomeworkQuestion,
  getHomeworkSetForStudent,
  getDynamicTopics,
} from "../controllers/schoolController.js";

const r = Router();

// School group management (teacher/admin)
r.post("/",                           auth, createSchool);
r.get("/",                            auth, listSchools);
r.get("/dynamic-topics",              auth, getDynamicTopics);
r.get("/my-enrollment",               auth, myEnrollment);

// Student self-enrollment
r.post("/join",                       auth, joinByCode);

// Homework retrieval (student)
r.get("/homework",                    auth, getHomeworkQuestion);
r.post("/homework-set",               auth, getHomeworkSetForStudent);

// School group detail + student enrollment (teacher/admin)
r.get("/:schoolGroupId",              auth, getSchool);
r.post("/:schoolGroupId/enroll",      auth, enrollStudentById);

export default r;

import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  listUsers, updateUserRole,
  listQuestions, createQuestion, updateQuestion, deleteQuestion, unflagQuestion, getFlaggedQuestions,
  listTopics, createTopic, updateTopic, deleteTopic,
  getAdminStats,
} from "../controllers/adminController.js";

const r = Router();
r.use(adminAuth); // all admin routes require admin role

// Stats
r.get("/stats",                      getAdminStats);

// Users
r.get("/users",                      listUsers);
r.put("/users/:id/role",             updateUserRole);

// Questions
r.get("/questions",                  listQuestions);
r.get("/questions/flagged",          getFlaggedQuestions);
r.post("/questions",                 createQuestion);
r.put("/questions/:id",              updateQuestion);
r.delete("/questions/:id",           deleteQuestion);
r.put("/questions/:id/unflag",       unflagQuestion);

// Topics
r.get("/topics",                     listTopics);
r.post("/topics",                    createTopic);
r.put("/topics/:id",                 updateTopic);
r.delete("/topics/:id",              deleteTopic);

export default r;

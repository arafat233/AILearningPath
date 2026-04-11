import { Router } from "express";
import Joi from "joi";
import { adminAuth } from "../middleware/adminAuth.js";
import { validate } from "../middleware/validate.js";
import {
  listUsers, updateUserRole,
  listQuestions, createQuestion, updateQuestion, deleteQuestion, unflagQuestion, getFlaggedQuestions,
  listTopics, createTopic, updateTopic, deleteTopic,
  getAdminStats,
} from "../controllers/adminController.js";

const r = Router();
r.use(adminAuth);

const roleSchema = Joi.object({
  role: Joi.string().valid("student", "admin", "parent", "teacher").required(),
});

const questionSchema = Joi.object({
  questionText:  Joi.string().required(),
  topic:         Joi.string().required(),
  subject:       Joi.string().optional(),
  options:       Joi.array().required(),
  solutionSteps: Joi.array().optional(),
  shortcut:      Joi.string().optional().allow(""),
  difficultyScore: Joi.number().min(0).max(1).optional(),
  expectedTime:  Joi.number().optional(),
  marks:         Joi.number().optional(),
}).unknown(true);

const topicSchema = Joi.object({
  name:          Joi.string().required(),
  subject:       Joi.string().required(),
  grade:         Joi.string().optional(),
  examFrequency: Joi.number().optional(),
}).unknown(true);

// Stats
r.get("/stats",                      getAdminStats);

// Users
r.get("/users",                      listUsers);
r.put("/users/:id/role",             validate(roleSchema),     updateUserRole);

// Questions
r.get("/questions",                  listQuestions);
r.get("/questions/flagged",          getFlaggedQuestions);
r.post("/questions",                 validate(questionSchema), createQuestion);
r.put("/questions/:id",              updateQuestion);
r.delete("/questions/:id",           deleteQuestion);
r.put("/questions/:id/unflag",       unflagQuestion);

// Topics
r.get("/topics",                     listTopics);
r.post("/topics",                    validate(topicSchema),    createTopic);
r.put("/topics/:id",                 updateTopic);
r.delete("/topics/:id",              deleteTopic);

export default r;

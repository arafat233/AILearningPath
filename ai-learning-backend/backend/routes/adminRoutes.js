import { Router } from "express";
import Joi from "joi";
import { adminAuth } from "../middleware/adminAuth.js";
import { validate } from "../middleware/validate.js";

import { listUsers, updateUserRole }                                       from "../controllers/admin/adminUserController.js";
import { listQuestions, getFlaggedQuestions, createQuestion,
         updateQuestion, deleteQuestion, unflagQuestion }                  from "../controllers/admin/adminQuestionController.js";
import { listTopics, createTopic, updateTopic, deleteTopic }              from "../controllers/admin/adminTopicController.js";
import { getAdminStats, getAnalytics }                                     from "../controllers/admin/adminStatsController.js";

const r = Router();
r.use(adminAuth);

const roleSchema = Joi.object({
  role: Joi.string().valid("student", "admin", "parent", "teacher").required(),
});

// SEC-10: No .unknown(true) — only explicitly listed fields are allowed through
const questionSchema = Joi.object({
  questionText:    Joi.string().required(),
  topic:           Joi.string().required(),
  subject:         Joi.string().optional(),
  grade:           Joi.string().optional(),
  examBoard:       Joi.string().optional(),
  options:         Joi.array().required(),
  solutionSteps:   Joi.array().optional(),
  shortcut:        Joi.string().optional().allow(""),
  difficultyScore: Joi.number().min(0).max(1).optional(),
  expectedTime:    Joi.number().positive().optional(),
  marks:           Joi.number().min(0).optional(),
  isPYQ:           Joi.boolean().optional(),
  pyqYear:         Joi.number().integer().min(2000).max(2030).optional(),
  questionType:    Joi.string().valid("mcq","case_based","assertion_reason","pyq").optional(),
  difficulty:      Joi.string().valid("easy","medium","hard").optional(),
});

const topicSchema = Joi.object({
  name:          Joi.string().required(),
  subject:       Joi.string().required(),
  grade:         Joi.string().optional(),
  examFrequency: Joi.number().min(0).max(1).optional(),
  estimatedHours: Joi.number().positive().optional(),
  examMarks:     Joi.number().min(0).optional(),
});

// Stats & Analytics
r.get("/stats",                      getAdminStats);
r.get("/analytics",                  getAnalytics);

// Users
r.get("/users",                      listUsers);
r.put("/users/:id/role",             validate(roleSchema),     updateUserRole);

// Questions — SEC-09: validate() added to PUT route
r.get("/questions",                  listQuestions);
r.get("/questions/flagged",          getFlaggedQuestions);
r.post("/questions",                 validate(questionSchema), createQuestion);
r.put("/questions/:id",              validate(questionSchema), updateQuestion);
r.delete("/questions/:id",           deleteQuestion);
r.put("/questions/:id/unflag",       unflagQuestion);

// Topics — SEC-09: validate() added to PUT route
r.get("/topics",                     listTopics);
r.post("/topics",                    validate(topicSchema),    createTopic);
r.put("/topics/:id",                 validate(topicSchema),    updateTopic);
r.delete("/topics/:id",              deleteTopic);

export default r;

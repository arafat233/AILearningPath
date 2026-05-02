import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { getNextTopic, getNextQuestion, getTopicMastery, postRecordAttempt } from "../controllers/recommenderController.js";

const r = Router();

const recordSchema = Joi.object({
  topicId:             Joi.string().required(),
  questionId:          Joi.string().required(),
  correct:             Joi.boolean().required(),
  timeSec:             Joi.number().min(0).max(3600).required(),
  selectedOptionIndex: Joi.number().integer().min(0).max(10).optional(),
  hintsUsed:           Joi.number().integer().min(0).max(10).optional(),
});

r.get("/next-topic",                 auth, getNextTopic);
r.get("/next-question/:topicId",     auth, getNextQuestion);
r.get("/mastery/:topicId",           auth, getTopicMastery);
r.post("/record-attempt",            auth, validate(recordSchema), postRecordAttempt);

export default r;

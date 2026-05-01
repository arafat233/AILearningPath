import express from "express";
import { companyLogin, getStats } from "../controllers/companyController.js";
import { companyAuth } from "../middleware/companyAuth.js";

const r = express.Router();

r.post("/login", companyLogin);
r.get("/stats",  companyAuth, getStats);

export default r;

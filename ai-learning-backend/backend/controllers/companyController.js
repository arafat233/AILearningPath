import jwt      from "jsonwebtoken";
import crypto   from "crypto";
import { getDashboardStats } from "../services/companyService.js";
import { AppError } from "../utils/AppError.js";

const timingSafe = (a, b) => {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false; // different lengths
  }
};

export const companyLogin = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body || {};
    const validEmail = process.env.COMPANY_ADMIN_EMAIL    || "";
    const validPass  = process.env.COMPANY_ADMIN_PASSWORD || "";

    if (!validEmail || !validPass) {
      return next(new AppError("Company admin credentials not configured on this server", 503));
    }

    const emailOk = timingSafe(email,    validEmail);
    const passOk  = timingSafe(password, validPass);

    if (!emailOk || !passOk) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = jwt.sign(
      { role: "company_admin" },
      process.env.COMPANY_JWT_SECRET || process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ data: { token } });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
};

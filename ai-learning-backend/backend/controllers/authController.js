import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, examDate, grade } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new AppError("Email already registered", 409));

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, examDate, grade });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role || "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role || "student" } } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("No account found with this email. Please create an account first.", 404));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new AppError("Incorrect password. Please try again.", 401));

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role || "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role || "student" } } });
  } catch (err) {
    next(err);
  }
};

import jwt from "jsonwebtoken";

export const companyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    jwt.verify(token, process.env.COMPANY_JWT_SECRET || process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

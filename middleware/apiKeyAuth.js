// middleware/apiKeyAuth.js
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const apiKeyAuth = (req, res, next) => {
  const key = req.header("x-api-key");
  const validKey = process.env.API_KEY;
  console.log(key, validKey);
  if (!key || key !== validKey) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or missing API Key" });
  }

  next();
};

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    req.user = decoded; // you now have req.user available
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const hasRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = { apiKeyAuth, hasRole, isAuthenticated };

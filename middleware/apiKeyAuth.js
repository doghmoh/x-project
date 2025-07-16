// middleware/apiKeyAuth.js
const dotenv = require("dotenv");
dotenv.config();

const apiKeyAuth = (req, res, next) => {
  const key = req.header("x-api-key");
  const validKey = process.env.API_KEY;

  if (!key || key !== validKey) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or missing API Key" });
  }

  next();
};

const hasRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = { apiKeyAuth, hasRole };

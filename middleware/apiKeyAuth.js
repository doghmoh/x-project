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

module.exports = apiKeyAuth;

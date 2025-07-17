const express = require("express");
const { login, updatePassword } = require("../../controllers/authController");
const authRotutes = express.Router();

authRotutes.post("/login", login);
authRotutes.put("/", updatePassword);

module.exports = authRotutes;

const express = require("express");
const statsRoutes = express.Router();
const statsController = require("../../controllers/statsController");
statsRoutes.get("/", statsController.getStats);

module.exports = statsRoutes;

const express = require("express");
const backupRoutes = express.Router();
const backupController = require("../../controllers/backupController");
backupRoutes.get("/", backupController.exportDatabaseAsJson);

module.exports = backupRoutes;

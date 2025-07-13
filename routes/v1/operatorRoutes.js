
const express = require('express');
const operatorRoutes = express.Router();
const operatorController = require('../../controllers/operatorController');
const { createOperatorValidator } = require('../../validators/operatorValidator');

operatorRoutes.get('/', operatorController.getAll);
operatorRoutes.post('/', createOperatorValidator, operatorController.create);

module.exports = operatorRoutes;

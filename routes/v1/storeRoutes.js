
const express = require('express');
const storeRoutes = express.Router();
const storeController = require('../../controllers/storeController');
const { createStoreValidator } = require('../../validators/storeValidator');

storeRoutes.get('/', storeController.getAll);
storeRoutes.post('/', createStoreValidator, storeController.create);

module.exports = storeRoutes;

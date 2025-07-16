
const express = require('express');
const storeRoutes = express.Router();
const storeController = require('../../controllers/storeController');
const { createStoreValidator } = require('../../validators/storeValidator');

storeRoutes.get('/', storeController.getAll);
storeRoutes.post('/', createStoreValidator, storeController.create);
storeRoutes.get('/:id', storeController.getOne);
storeRoutes.put('/:id', storeController.update);
storeRoutes.delete('/:id', storeController.delete);

module.exports = storeRoutes;


const express = require('express');
const stockinRoutes = express.Router();
const stockinController = require('../../controllers/stockinController');
const { createStockInValidator } = require('../../validators/stockinValidator');

stockinRoutes.get('/', stockinController.getAll);
stockinRoutes.post('/', createStockInValidator, stockinController.create);
stockinRoutes.get('/:id', stockinController.getOne);
stockinRoutes.put('/:id', stockinController.update);
stockinRoutes.delete('/:id', stockinController.delete);

module.exports = stockinRoutes;

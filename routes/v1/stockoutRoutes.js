
const express = require('express');
const stockoutRoutes = express.Router();
const stockoutController = require('../../controllers/stockoutController');
const { createStockOutValidator } = require('../../validators/stockoutValidator');


stockoutRoutes.get("/export", stockoutController.exportStockOutsCSV);
stockoutRoutes.get('/', stockoutController.getAll);
stockoutRoutes.post('/', createStockOutValidator, stockoutController.create);
stockoutRoutes.get('/:id', stockoutController.getOne);
stockoutRoutes.put('/:id', stockoutController.update);
stockoutRoutes.delete('/:id', stockoutController.delete);

module.exports = stockoutRoutes;

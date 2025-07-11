
const express = require('express');
const productRoutes = express.Router();
const productController = require('../../controllers/productController');
const { createProductValidator } = require('../../validators/productValidator');

productRoutes.get('/', productController.getAll);
productRoutes.post('/', createProductValidator, productController.create);

module.exports = productRoutes;

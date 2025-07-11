
const express = require('express');
const categoryRoutes = express.Router();
const categoryController = require('../../controllers/categoryController');
const { createCategoryValidator } = require('../../validators/categoryValidator');

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.post('/', createCategoryValidator, categoryController.create);

module.exports = categoryRoutes;

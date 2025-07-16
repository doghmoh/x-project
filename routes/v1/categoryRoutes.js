
const express = require('express');
const categoryRoutes = express.Router();
const categoryController = require('../../controllers/categoryController');
const { createCategoryValidator } = require('../../validators/categoryValidator');

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.post('/', createCategoryValidator, categoryController.create);
categoryRoutes.get('/:id', categoryController.getOne);
categoryRoutes.put('/:id', categoryController.update);
categoryRoutes.delete('/:id', categoryController.delete);

module.exports = categoryRoutes;


const express = require('express');
const customerRoutes = express.Router();
const customerController = require('../../controllers/customerController');
const { createCustomerValidator } = require('../../validators/customerValidator');

customerRoutes.get('/', customerController.getAll);
customerRoutes.post('/', createCustomerValidator, customerController.create);
customerRoutes.get('/:id', customerController.getOne);
customerRoutes.put('/:id', customerController.update);
customerRoutes.delete('/:id', customerController.delete);


module.exports = customerRoutes;

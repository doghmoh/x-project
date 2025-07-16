
const { body } = require('express-validator');

exports.createStockOutValidator = [
  body('product').notEmpty().withMessage('Product reference is required'),
  body('customer').notEmpty().withMessage('Customer reference is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('date').notEmpty().withMessage('Date is required')
];

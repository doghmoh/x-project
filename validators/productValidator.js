
const { body } = require('express-validator');

exports.createProductValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('cost_price').isNumeric().withMessage('Cost_price must be a number'),
  body('stock_quantity').isNumeric().withMessage('Stock_quantity must be a number'),
  body('low_stock_threshold').isNumeric().withMessage('Low_stock_threshold must be a number'),
  body('category').notEmpty().withMessage('Category reference is required'),
  body('supplier').notEmpty().withMessage('Supplier reference is required'),
  body('description').notEmpty().withMessage('Description is required')
];


const { body } = require('express-validator');

exports.createProductValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category reference is required')
];

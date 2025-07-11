const { body } = require('express-validator');

exports.createProductValidator = [
  body('name').isString().withMessage('Name must be string'),
  body('price').isNumeric().withMessage('Price must be number'),
  body('category').isString().withMessage('Category must be string')
];
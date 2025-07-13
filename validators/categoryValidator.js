
const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('icon').isString().notEmpty().withMessage('Icon is required')
];

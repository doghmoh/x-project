
const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('name').isString().notEmpty().withMessage('Name is required')
];

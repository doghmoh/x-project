const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('name').isString().withMessage('Name must be string')
];
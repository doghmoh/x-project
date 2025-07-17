
const { body } = require('express-validator');

exports.createSupplierValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('email').isString().notEmpty().withMessage('Email is required'),
  body('country').isString().notEmpty().withMessage('Country is required'),
];

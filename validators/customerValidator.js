
const { body } = require('express-validator');

exports.createCustomerValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('email').isString().notEmpty().withMessage('Email is required'),
  body('address').isString().notEmpty().withMessage('Address is required')
];

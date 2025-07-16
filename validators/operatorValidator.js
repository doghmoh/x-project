
const { body } = require('express-validator');

exports.createOperatorValidator = [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('password').isString().notEmpty().withMessage('Password is required')
];

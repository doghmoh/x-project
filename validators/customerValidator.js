
const { body } = require('express-validator');

exports.createCustomerValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('registre').isString().notEmpty().withMessage('Registre Commerce is required'),
  body('nif').isString().notEmpty().withMessage('NIF is required'),
  body('art').isString().notEmpty().withMessage('ART is required'),
];

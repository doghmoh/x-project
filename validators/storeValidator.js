
const { body } = require('express-validator');

exports.createStoreValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('logo').isString().notEmpty().withMessage('Logo is required'),
  body('email').isString().notEmpty().withMessage('Email is required'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('description').isString().notEmpty().withMessage('Description is required'),
  body('mapsLink').isString().notEmpty().withMessage('MapsLink is required')
];

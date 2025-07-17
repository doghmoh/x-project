const { body, check } = require("express-validator");

exports.createStockOutValidator = [
  body("customer")
    .notEmpty()
    .withMessage("Customer reference is required"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),

  // Validate nested fields
  body("products.*.product")
    .notEmpty()
    .withMessage("Product reference is required"),

  body("products.*.quantity")
    .isNumeric()
    .withMessage("Quantity must be a number"),

  body("products.*.price")
    .isNumeric()
    .withMessage("Price must be a number")
];

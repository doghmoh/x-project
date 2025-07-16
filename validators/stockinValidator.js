const { check, body } = require("express-validator");

exports.createStockInValidator = [
  body("supplier")
    .notEmpty()
    .withMessage("Supplier reference is required"),

  body("date")
    .notEmpty()
    .withMessage("Date is required"),

  body("note")
    .notEmpty()
    .withMessage("Note is required"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),

  check("products.*.product")
    .notEmpty()
    .withMessage("Product reference is required"),

  check("products.*.quantity")
    .isNumeric()
    .withMessage("Quantity must be a number"),

  check("products.*.cost_price")
    .isNumeric()
    .withMessage("Cost_price must be a number"),
];

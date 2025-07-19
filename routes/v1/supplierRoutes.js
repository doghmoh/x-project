const express = require("express");
const supplierRoutes = express.Router();
const supplierController = require("../../controllers/supplierController");
const {
  createSupplierValidator,
} = require("../../validators/supplierValidator");

supplierRoutes.get("/export", supplierController.exportSuppliersCSV);
supplierRoutes.get("/", supplierController.getAll);
supplierRoutes.get("/:id", supplierController.getOne);
supplierRoutes.post("/", createSupplierValidator, supplierController.create);
supplierRoutes.put("/:id", supplierController.update);
supplierRoutes.delete("/:id", supplierController.remove);

module.exports = supplierRoutes;

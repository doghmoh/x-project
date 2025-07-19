const Product = require("../models/Product");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const Customer = require("../models/Customer");
const StockIn = require("../models/StockIn");
const StockOut = require("../models/StockOut");

exports.exportDatabaseAsJson = async (req, res) => {
  try {
    const data = {
      products: await Product.find().lean(),
      categories: await Category.find().lean(),
      customers: await Customer.find().lean(),
      suppliers: await Supplier.find().lean(),
      stockIns: await StockIn.find().lean(),
      stockOuts: await StockOut.find().lean(),
    };

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="database-backup.json"'
    );
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Export error:", err);
    res.status(500).json({ error: "Failed to export database" });
  }
};

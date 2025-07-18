const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const StockOut = require("../models/StockOut");
const StockIn = require("../models/StockIn");

exports.getStats = async (req, res, next) => {
  try {
    const [totalCustomers, totalSuppliers, totalProducts] = await Promise.all([
      Customer.countDocuments(),
      Supplier.countDocuments(),
      Product.countDocuments(),
    ]);

    const [totalSales, totalPurchases] = await Promise.all([
      StockOut.countDocuments(),
      StockIn.countDocuments(),
    ]);

    // Calculate total revenue (StockOut)
    const salesDocs = await StockOut.find();
    const totalRevenue = salesDocs.reduce((sum, sale) => {
      const productTotal = sale.products.reduce((pSum, p) => {
        return pSum + p.price * p.quantity;
      }, 0);
      return sum + productTotal + (sale.timbre || 0);
    }, 0);

    // Calculate total outcome (StockIn)
    const purchaseDocs = await StockIn.find();
    const totalOutcome = purchaseDocs.reduce((sum, purchase) => {
      const productTotal = purchase.products.reduce((pSum, p) => {
        return pSum + p.price * p.quantity;
      }, 0);
      return sum + productTotal;
    }, 0);

    // Low stock products (e.g., less than 5)
    const lowStock = await Product.find({ stock_quantity: { $lte: 5 } })
      .select("_id name stock_quantity")
      .lean();

    res.json({
      totalCustomers,
      totalSuppliers,
      totalProducts,
      totalSales,
      totalPurchases,
      totalRevenue,
      totalOutcome,
      lowStock,
    });
  } catch (error) {
    next(error);
  }
};

const { validationResult } = require("express-validator");
const StockIn = require("../models/StockIn");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { exportToCSV } = require("../utils/exportToCsv");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { supplier, date, note, products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Products array is required and must not be empty." });
    }

    // Validate product IDs
    const productIds = products.map((p) => p.product);
    const invalidIds = productIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      return res
        .status(400)
        .json({ error: "One or more product IDs are invalid.", invalidIds });
    }

    const foundProducts = await Product.find({
      _id: { $in: productIds },
    }).session(session);
    const foundIds = foundProducts.map((p) => p._id.toString());
    const missingIds = productIds.filter(
      (id) => !foundIds.includes(id.toString())
    );
    if (missingIds.length > 0) {
      return res
        .status(404)
        .json({ error: "Some product IDs were not found.", missingIds });
    }

    // ✅ Create StockIn document
    const stockInDoc = await StockIn.create(
      [{ supplier, date, note, products }],
      { session }
    );

    // ✅ Update stock quantities
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock_quantity: item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(stockInDoc[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const query = {};

    // 🔍 Optional search filter
    if (req.query.q) {
      const regex = new RegExp(req.query.q, "i");
      query.$or = [
        { supplier: regex },
        { date: regex }, // Assuming date is stored as a string or can be converted
        // Add any other fields to search below (like supplier name if denormalized)
      ];
    }

    // 📄 Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      StockIn.find(query)
        .populate("supplier products.product")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      StockIn.countDocuments(query),
    ]);

    res.json({
      total: await StockIn.countDocuments(query),
      page,
      limit,
      data,
    });
  } catch (err) {
    next(err);
  }
};
exports.getOne = async (req, res, next) => {
  try {
    const doc = await StockIn.findById(req.params.id).populate(
      "supplier products.product"
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await StockIn.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const doc = await StockIn.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// Export StockIns
exports.exportStockInsCSV = async (req, res) => {
  const data = await StockIn.find()
    .populate("supplier", "name")
    .populate("products.product", "name")
    .lean();
  const transformed = data.flatMap((stockin) =>
    stockin.products.map((p) => ({
      invoice_number: stockin.invoice_number,
      supplier: stockin.supplier?.name || "",
      product: p.product?.name || "",
      quantity: p.quantity,
      cost_price: p.cost_price,
      createdAt: stockin.createdAt,
      updatedAt: stockin.updatedAt,
    }))
  );

  if (!transformed.length) {
    return res.status(200).json({ empty: true });
  }

  exportToCSV(res, transformed, "stockins");
};

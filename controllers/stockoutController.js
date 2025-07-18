const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const StockOut = require("../models/StockOut");
const Product = require("../models/Product");
const { exportToCSV } = require("../utils/exportToCsv");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer, products, timbre } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Products array is required and must not be empty." });
    }

    // ✅ Validate ObjectId format
    const productIds = products.map((p) => p.product);
    const invalidIds = productIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: "One or more product IDs are invalid.",
        invalidIds,
      });
    }

    // ✅ Check that all products exist
    const foundProducts = await Product.find({
      _id: { $in: productIds },
    }).session(session);
    const foundIds = foundProducts.map((p) => p._id.toString());
    const missingIds = productIds.filter(
      (id) => !foundIds.includes(id.toString())
    );
    if (missingIds.length > 0) {
      return res.status(404).json({
        error: "Some product IDs were not found.",
        missingIds,
      });
    }

    // ✅ Check stock availability before creating StockOut
    for (const item of products) {
      const product = foundProducts.find(
        (p) => p._id.toString() === item.product.toString()
      );
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product ID ${item.product}`,
          available: product.stock_quantity,
          requested: item.quantity,
        });
      }
    }

    // ✅ Create StockOut document
    const stockOutDoc = await StockOut.create(
      [{ customer, products, timbre }],
      { session }
    );

    // ✅ Decrease stock
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock_quantity: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(stockOutDoc[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.q) {
      const regex = new RegExp(req.query.q, "i");
      query.$or = [];
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = await StockOut.countDocuments(query);
    const data = await StockOut.find(query)
      .populate("products.product customer")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total: await StockOut.countDocuments(query),
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
    const doc = await StockOut.findById(req.params.id).populate(
      "products.product customer"
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await StockOut.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const doc = await StockOut.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// Export StockOuts
exports.exportStockOutsCSV = async (req, res) => {
  const data = await StockOut.find()
    .populate("customer", "name")
    .populate("products.product", "name")
    .lean();
  const transformed = data.flatMap((stockout) =>
    stockout.products.map((p) => ({
      invoice_number: stockout.invoice_number,
      customer: stockout.customer?.name || "",
      product: p.product?.name || "",
      quantity: p.quantity,
      price: p.price,
      createdAt: stockout.createdAt,
      updatedAt: stockout.updatedAt,
    }))
  );

    if (!transformed.length) {
      return res.status(200).json({ empty: true });
    }

  exportToCSV(res, transformed, "stockouts");
};

const Product = require("../models/Product");
const { validationResult } = require("express-validator");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const allowedFields = [
      "name",
      "price",
      "sku",
      "cost_price",
      "stock_quantity",
      "low_stock_threshold",
      "category",
      "supplier",
      "description",
    ];
    const data = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });
    const doc = await Product.create(data);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.q) {
      const regex = new RegExp(req.query.q, "i");
      query.$or = [{ name: regex }, { price: regex }];
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await Product.find(query)
      .populate("category supplier")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total: await Product.countDocuments(query),
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
    const doc = await Product.findById(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

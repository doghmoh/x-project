const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const { Parser } = require("json2csv");
const { exportToCSV } = require("../utils/exportToCsv");

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

exports.exportProductsCSV = async (req, res) => {
  try {
    const data = await Product.find()
      .populate("category", "name")
      .populate("supplier", "name")
      .lean();

    const transformed = data.map((p) => ({
      name: p.name,
      sku: p.sku,
      price: p.price,
      cost_price: p.cost_price,
      stock_quantity: p.stock_quantity,
      low_stock_threshold: p.low_stock_threshold,
      category: p.category?.name || "",
      supplier: p.supplier?.name || "",
      description: p.description || "",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    if (!transformed.length) {
      return res.status(200).json({ empty: true });
    }

    // Champs explicitement définis
    const fields = [
      "name",
      "sku",
      "price",
      "cost_price",
      "stock_quantity",
      "low_stock_threshold",
      "category",
      "supplier",
      "description",
      "createdAt",
      "updatedAt",
    ];

    exportToCSV(res, transformed, "products", fields);
  } catch (error) {
    console.error("❌ Export produits échoué:", error);
    res.status(500).json({ error: "Erreur lors de l'export des produits" });
    next(error);
  }
};

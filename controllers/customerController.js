const Customer = require("../models/Customer");
const { validationResult } = require("express-validator");
const { exportToCSV } = require("../utils/exportToCsv");

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const allowedFields = [
      "name",
      "phone",
      "email",
      "address",
      "registre",
      "nif",
      "art",
    ];
    const data = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });
    const doc = await Customer.create(data);
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
      query.$or = [];
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total: await Customer.countDocuments(query),
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
    const doc = await Customer.findById(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const doc = await Customer.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// Export Customers
exports.exportCustomersCSV = async (req, res) => {
  const data = await Customer.find().lean();

  if (!data || data.length === 0) {
    return res.status(200).json({ empty: true });
  }

  exportToCSV(res, data, "customers");
};

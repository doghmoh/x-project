
const StockOut = require('../models/StockOut');
const { validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const allowedFields = ["product","customer","quantity","price","date"];
    const data = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });
    const doc = await StockOut.create(data);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      query.$or = [];
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await StockOut.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(data);
  } catch (err) {
    next(err);
  }
};


exports.getOne = async (req, res, next) => {
  try {
    const doc = await StockOut.findById(req.params.id);
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
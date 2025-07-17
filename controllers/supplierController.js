const Supplier = require('../models/Supplier');
const { validationResult } = require('express-validator');

// CREATE
exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const allowedFields = ["name", "phone", "email", "country"];
    const data = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });

    const doc = await Supplier.create(data);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// GET ALL (with search + pagination)
exports.getAll = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      query.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { country: regex }
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Supplier.countDocuments(query);
    const data = await Supplier.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      total,
      page,
      limit,
      data
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE
exports.getOne = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const allowedFields = ["name", "phone", "email", "country", "address"];
    const data = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });

    const supplier = await Supplier.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.remove = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    next(err);
  }
};

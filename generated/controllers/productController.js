const Product = require('../models/Product');

exports.create = async (req, res, next) => {
  try {
    const doc = await Product.create(req.body);
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
      query.$or = [{ name: regex }, { price: regex }];
    }

    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    
    
    res.json(data);
  } catch (err) {
    next(err);
  }
};
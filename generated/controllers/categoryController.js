const Category = require('../models/Category');

exports.create = async (req, res, next) => {
  try {
    const doc = await Category.create(req.body);
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

    
    const data = await Category.find(query);
    
    
    res.json(data);
  } catch (err) {
    next(err);
  }
};
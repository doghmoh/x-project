
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String },
  sku: { type: String, unique: true },
  price: { type: Number },
  cost_price: { type: Number },
  stock_quantity: { type: Number },
  low_stock_threshold: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

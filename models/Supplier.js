
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  country: { type: String },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);

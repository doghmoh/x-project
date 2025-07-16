
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

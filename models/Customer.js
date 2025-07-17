
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  registre : { type: String },
  nif : { type: String },
  art : { type: String },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

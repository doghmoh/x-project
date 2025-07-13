
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  logo: { type: String },
  email: { type: String },
  phone: { type: String },
  description: { type: String },
  mapsLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);

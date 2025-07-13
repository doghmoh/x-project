
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String },
  icon: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

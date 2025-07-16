
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);


const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  username: { type: String },
  role: { type: String },
  password: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Operator', operatorSchema);

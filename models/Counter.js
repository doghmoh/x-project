// models/Counter.js
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);

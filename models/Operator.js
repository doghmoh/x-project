
const e = require('express');
const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  username: { type: String },
  role: { type: String , enum: ['admin', 'user']},
  password: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Operator', operatorSchema);

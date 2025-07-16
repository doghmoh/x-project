const mongoose = require('mongoose');

const stockinSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      cost_price: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('StockIn', stockinSchema);

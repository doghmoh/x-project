const mongoose = require("mongoose");
const Counter = require("./Counter");

const stockinSchema = new mongoose.Schema(
  {
    invoice_number: {
      type: String,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        cost_price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

stockinSchema.pre("save", async function (next) {
  if (this.isNew && !this.invoice_number) {
    const counter = await Counter.findOneAndUpdate(
      { model: "StockIn" },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    // Format: 001, 002, ..., 999
    this.invoice_number = String(counter.count).padStart(3, "0");
  }

  next();
});

module.exports = mongoose.model("StockIn", stockinSchema);

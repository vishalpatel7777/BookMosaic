const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  books: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  ],
  totalPrice: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Completed", "Cancelled"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
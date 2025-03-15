const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
    rate: { type: Number, required: true, min: 1, max: 5 },
    status: { type: String, default: "Thank you for rating the book" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rating", ratingSchema);
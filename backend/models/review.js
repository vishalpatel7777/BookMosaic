const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "books", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
});

module.exports = mongoose.model("review", reviewSchema);
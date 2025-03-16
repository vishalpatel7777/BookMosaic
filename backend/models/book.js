const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    subject: { type: String, required: true },
    genre: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    language: { type: String, required: true },
    image: { type: String, required: true },
    ratings: { type: Number, min: 1, max: 5, default: 0 },
    pdf: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);
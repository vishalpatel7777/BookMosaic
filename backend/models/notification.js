const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "books", required: true },
  title: { type: String, required: true },
  image: { type: String, default: "" },
  author: { type: String, default: "" },
  price: { type: Number, default: 0 },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    genre: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    image: {
      type: String,
      default: "https://www.bing.com/th?id=OIP.S_BEyoTYNIwRpRXmQWtKJAHaHa",
    },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    lastLogin: { type: Date, default: null },
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "books", default: [] },
    ],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "books", default: [] }],
    order: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Orders", default: [] },
    ],
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpiry: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
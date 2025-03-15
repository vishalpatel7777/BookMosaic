const router = require("express").Router();
const Book = require("../models/book");
const Order = require("../models/order");
const { authenticateToken } = require("../routes/userAuth");

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { userId, books, totalAmount } = req.body || {};
    if (!userId || !books || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Books must be a non-empty array" });
    }

    const order = new Order({
      user: userId,
      books,
      totalPrice: totalAmount,
      paymentMethod: "default",
      status: "Pending",
    });

    await order.save();
    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to place order" });
  }
});

module.exports = router;
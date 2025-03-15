const router = require("express").Router();
const User = require("../models/user");
const Rating = require("../models/rating");
const { authenticateToken } = require("../routes/userAuth");

const addRatingsToBooks = async (books) => {
  const ratings = await Rating.aggregate([
    { $group: { _id: "$book", averageRating: { $avg: "$rate" } } },
  ]);

  const ratingsMap = ratings.reduce((acc, { _id, averageRating }) => {
    acc[_id.toString()] = Number(averageRating.toFixed(1)) || 0;
    return acc;
  }, {});

  return books.map((book) => {
    const avgRating = ratingsMap[book._id.toString()] || 0;
    return { ...book.toObject(), ratings: avgRating };
  });
};

router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers || {};
    if (!bookid || !id) {
      return res.status(400).json({ message: "Missing bookid or user id" });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isbookInCart = userData.cart.includes(bookid);
    if (isbookInCart) {
      return res.status(200).json({ message: "book is already in Cart" });
    }

    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "book added to Cart" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/remove-book-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers || {};
    if (!bookid || !id) {
      return res.status(400).json({ message: "Missing bookid or user id" });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isbookInCart = userData.cart.includes(bookid);
    if (isbookInCart) {
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      return res.status(200).json({ message: "book removed from Cart" });
    }

    return res.status(200).json({ message: "book not available in the Cart" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/remove-book-from-cart/:bookid",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid } = req.params || {};
      const { id } = req.headers || {};
      if (!id || !bookid) {
        return res.status(400).json({ message: "Missing user id or bookid" });
      }

      const userData = await User.findById(id);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      return res.json({
        status: "Success",
        message: "book removed successfully from cart",
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post("/clear-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers || {};
    if (!id) {
      return res.status(400).json({ message: "Missing user id" });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(id, { $set: { cart: [] } });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers || {};
    if (!id) {
      return res.status(400).json({ message: "Missing user id" });
    }

    const userData = await User.findById(id).populate("cart");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = userData.cart || [];
    if (cart.length === 0) {
      return res.status(200).json({ message: "No books in cart", data: [] });
    }

    const cartWithRatings = await addRatingsToBooks(cart);
    return res.status(200).json({
      status: "Success",
      data: cartWithRatings,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
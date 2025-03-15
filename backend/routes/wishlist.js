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

router.put("/add-to-wishlist", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers || {};
    if (!bookid || !id) {
      return res.status(400).json({ message: "Missing bookid or user id" });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isbookWishlist = userData.wishlist.includes(bookid);
    if (isbookWishlist) {
      return res.status(409).json({ message: "book is already in wishlist" });
    }

    await User.findByIdAndUpdate(id, { $push: { wishlist: bookid } });
    return res.status(200).json({ message: "book added to wishlist" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/remove-book-from-wishlist", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers || {};
    if (!bookid || !id) {
      return res.status(400).json({ message: "Missing bookid or user id" });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isbookWishlist = userData.wishlist.includes(bookid);
    if (isbookWishlist) {
      await User.findByIdAndUpdate(id, { $pull: { wishlist: bookid } });
      return res.status(200).json({ message: "book removed from wishlist" });
    }

    return res.status(404).json({ message: "book not available in the wishlist" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-all-wishlist", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers || {};
    if (!id) {
      return res.status(400).json({ message: "Missing user id" });
    }

    const userData = await User.findById(id).populate("wishlist");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlist = userData.wishlist || [];
    if (wishlist.length === 0) {
      return res.status(200).json({ message: "No books in wishlist", data: [] });
    }

    const wishlistWithRatings = await addRatingsToBooks(wishlist);
    return res.status(200).json({
      status: "Success",
      data: wishlistWithRatings,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-recent-wishlist", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers || {};
    if (!id) {
      return res.status(400).json({ message: "Missing user id" });
    }

    const userData = await User.findById(id).populate("wishlist");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlist = userData.wishlist || [];
    if (wishlist.length === 0) {
      return res.status(200).json({ message: "No books in wishlist", data: [] });
    }

    const recentThreebooks = wishlist.slice(-3);
    const recentThreebooksWithRatings = await addRatingsToBooks(recentThreebooks);

    return res.status(200).json({
      status: "Success",
      data: recentThreebooksWithRatings,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
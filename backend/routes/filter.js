const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Rating = require("../models/rating");

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

router.get("/get-books-by-genre", async (req, res) => {
  const { genres, limit = 10 } = req.query || {};

  try {
    if (!genres) {
      return res.status(400).json({ message: "Genres parameter is required" });
    }

    const genreArray = genres.split(",").map((genre) => genre.trim());

    const books = await Book.find({ 
      genre: { $in: genreArray.map((g) => new RegExp(g, "i")) }
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 10);

    if (!books || books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found for these genres", data: [] });
    }

    const booksWithRatings = await addRatingsToBooks(books);
    return res.json({
      status: "success",
      data: booksWithRatings,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
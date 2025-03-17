const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const Purchase = require("../models/purchase");
const Review = require("../models/review");
const Rating = require("../models/rating");
const Book = require("../models/book");
const Order = require("../models/order");
const { authenticateToken } = require("../routes/userAuth");
const KNN = require("ml-knn");

router.post("/add-purchase", async (req, res) => {
  try {
    const { user, book, paymentMethod } = req.body || {};
    if (!user || !book || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(user) ||
      !mongoose.Types.ObjectId.isValid(book)
    ) {
      return res.status(400).json({ error: "Invalid user or book ID" });
    }

    const bookData = await Book.findById(book);
    if (!bookData) {
      return res.status(404).json({ error: "Book not found" });
    }

    const purchase = new Purchase({ user, book, paymentMethod });
    await purchase.save();

    const order = new Order({
      user,
      books: [book],
      totalPrice: bookData.price || 0,
      paymentMethod,
    });
    await order.save();

    purchase.order = order._id;
    await purchase.save();

    res.status(201).json({ message: "Purchase recorded successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message || "Failed to record purchase" });
  }
});

router.post("/add-notification", async (req, res) => {
  try {
    const { userId, book, title, image, author, price, description } =
      req.body || {};
    if (!userId || !book) {
      return res.status(400).json({ error: "userId and book are required" });
    }

    const existingNotification = await Notification.findOne({ userId, book });
    if (existingNotification) {
      return res.status(200).json({
        message: "Notification already exists",
        notification: existingNotification,
      });
    }

    const notification = new Notification({
      userId,
      book,
      title: title || "",
      image: image || "",
      author: author || "",
      price: price || 0,
      description: description || "",
    });
    await notification.save();
    res.status(201).json({
      message: "Notification stored successfully",
      notification,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to store notification", details: error.message });
  }
});

router.post("/store-rating", async (req, res) => {
  try {
    const { book, rate, user } = req.body || {};
    if (!book || !rate || !user) {
      return res.status(400).json({ error: "book ID, rating, and user ID are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(user) ||
      !mongoose.Types.ObjectId.isValid(book)
    ) {
      return res.status(400).json({ error: "Invalid user or book ID" });
    }

    const existingRating = await Rating.findOne({ user, book });
    if (existingRating) {
      return res.status(400).json({ error: "You have already rated this book." });
    }

    const rating = new Rating({ book, rate, user });
    await rating.save();
    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to submit rating", details: error.message });
  }
});

router.post("/store-review", async (req, res) => {
  try {
    const { userId, bookId, rating, review } = req.body || {};
    if (!userId || !bookId || !(review || "").trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingReview = await Review.findOne({ userId, bookId });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this book." });
    }

    const newReview = new Review({ userId, bookId, rating: rating || 0, review });
    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to submit review", details: error.message });
  }
});

router.get("/get-notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params || {};
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(notifications || []);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.delete("/delete-notification/:id", async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete notification", details: error.message });
  }
});

router.get("/get-rating/:userId/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params || {};
    if (!userId || !bookId) {
      return res.status(400).json({ error: "userId and bookId are required" });
    }

    const rating = await Rating.findOne({ user: userId, book: bookId });
    res.json(rating || {});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch rating" });
  }
});

router.get("/get-review/:userId/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params || {};
    if (!userId || !bookId) {
      return res.status(400).json({ error: "userId and bookId are required" });
    }

    const review = await Review.findOne({ userId, bookId });
    res.json(review || {});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

router.get("/get-recommended-books", async (req, res) => {
  try {
    const userId = req.headers.id || ""; 

    
    const ratings = await Rating.find().populate("user book");
    const validRatings = ratings.filter((r) => r.user && r.book);
    const allBooks = await Book.find();

    
    const getTopRatedBooksByMaxRating = async (limit = 4, excludeIds = []) => {
      const ratingStats = await Rating.aggregate([
        {
          $match: {
            book: { $nin: excludeIds.map((id) => new mongoose.Types.ObjectId(id)) },
          },
        },
        {
          $group: {
            _id: "$book",
            avgRating: { $avg: "$rate" },
            count: { $sum: 1 },
            latestRating: { $max: "$createdAt" }, 
          },
        },
        { $sort: { avgRating: -1, latestRating: -1 } }, 
        { $limit: limit },
      ]);
      const topBookIds = ratingStats.map((stat) => stat._id);
      let topBooks = await Book.find({ _id: { $in: topBookIds } });
      topBooks = await addRatingsToBooks(topBooks);
      return topBooks.map((book) => {
        const stat = ratingStats.find((s) => s._id.toString() === book._id.toString());
        return {
          ...book,
          avgRating: stat ? stat.avgRating : 0,
          ratingCount: stat ? stat.count : 0,
          latestRating: stat ? stat.latestRating : null,
          isRated: excludeIds.includes(book._id.toString()),
        };
      });
    };

   
    if (!validRatings.length) {
      const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(4);
      const recentBooksWithRatings = await addRatingsToBooks(recentBooks);
      return res.status(200).json({ data: recentBooksWithRatings });
    }

  
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const topRatedBooks = await getTopRatedBooksByMaxRating(4);
      return res.status(200).json({ data: topRatedBooks });
    }

  
    const userRatings = await Rating.find({ user: userId });
    const userRatedBookIds = userRatings.map((r) => r.book.toString());

  
    if (!userRatings.length) {
      const topRatedBooks = await getTopRatedBooksByMaxRating(4);
      return res.status(200).json({ data: topRatedBooks });
    }

    
    const ratedBookStats = await Rating.aggregate([
      {
        $group: {
          _id: "$book",
          avgRating: { $avg: "$rate" },
          count: { $sum: 1 },
          latestRating: { $max: "$createdAt" },
        },
      },
      { $sort: { avgRating: -1, latestRating: -1 } },
    ]);

    let recommendedBooks = [];
    const ratedBookIds = ratedBookStats.map((stat) => stat._id.toString());

   
    let ratedBooks = await Book.find({ _id: { $in: ratedBookIds } });
    ratedBooks = await addRatingsToBooks(ratedBooks);

   
    recommendedBooks = ratedBooks.map((book) => {
      const stat = ratedBookStats.find((s) => s._id.toString() === book._id.toString());
      const userRating = userRatings.find((r) => r.book.toString() === book._id.toString());
      return {
        ...book,
        avgRating: stat ? stat.avgRating : 0,
        ratingCount: stat ? stat.count : 0,
        latestRating: stat ? stat.latestRating : null,
        isRated: userRatedBookIds.includes(book._id.toString()),
        userRating: userRating ? userRating.rate : null,
      };
    }).sort((a, b) => {
      if (b.avgRating === a.avgRating) {
        return new Date(b.latestRating) - new Date(a.latestRating); 
      }
      return b.avgRating - a.avgRating; 
    });

 
    const numRatedBooks = recommendedBooks.length;
    if (numRatedBooks < 4) {
      const remaining = 4 - numRatedBooks;
      const recentBooks = await Book.find({
        _id: { $nin: ratedBookIds.map((id) => new mongoose.Types.ObjectId(id)) },
      })
        .sort({ createdAt: -1 })
        .limit(remaining);
      const recentBooksWithRatings = await addRatingsToBooks(recentBooks);
      recommendedBooks = [
        ...recommendedBooks,
        ...recentBooksWithRatings.map((book) => ({
          ...book,
          avgRating: book.ratings || 0,
          ratingCount: 0,
          latestRating: null,
          isRated: false,
          userRating: null,
        })),
      ].slice(0, 4);
    } else {
      recommendedBooks = recommendedBooks.slice(0, 4);
    }

    res.status(200).json({ data: recommendedBooks });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({
      error: "Failed to fetch recommended books",
      details: error.message,
    });
  }
});

async function addRatingsToBooks(books) {
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
}

module.exports = router;
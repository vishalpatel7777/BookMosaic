const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const Purchase = require("../models/purchase");
const Review = require("../models/Review");
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

router.get("/get-recommended-books", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id || "";
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

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
            maxRating: { $max: "$rate" },
            ratings: { $push: "$rate" },
            count: { $sum: 1 },
          },
        },
        { $sort: { maxRating: -1, count: -1 } },
        { $limit: limit },
      ]);
      const topBookIds = ratingStats.map((stat) => stat._id);
      let topBooks = await Book.find({ _id: { $in: topBookIds } });
      topBooks = await addRatingsToBooks(topBooks);
      return topBooks.map((book) => {
        const stat = ratingStats.find((s) => s._id.toString() === book._id.toString());
        return {
          ...book,
          maxRating: stat ? stat.maxRating : 0,
          individualRatings: stat ? stat.ratings : [],
          isRated: excludeIds.includes(book._id.toString()),
        };
      });
    };

    if (!validRatings.length) {
      const topRatedBooks = await getTopRatedBooksByMaxRating();
      return res.status(200).json({ data: topRatedBooks });
    }

    const userIds = [...new Set(validRatings.map((r) => r.user._id.toString()))];
    const allBookIds = allBooks.map((b) => b._id.toString());

    const X = [];
    const y = [];
    const ratingMap = validRatings.reduce((acc, r) => {
      acc[`${r.user._id}-${r.book._id}`] = r.rate;
      return acc;
    }, {});

    userIds.forEach((uid, userIndex) => {
      allBookIds.forEach((bid, bookIndex) => {
        const rating = ratingMap[`${uid}-${bid}`] || 0;
        X.push([userIndex, bookIndex]);
        y.push(rating);
      });
    });

    const knn = new KNN(X, y, { k: 3 });

    const userRatings = await Rating.find({ user: userId });
    const userRatedBookIds = userRatings.map((r) => r.book.toString());

    const userIndex = userIds.indexOf(userId);
    if (userIndex === -1) {
      const topRatedBooks = await getTopRatedBooksByMaxRating();
      return res.status(200).json({ data: topRatedBooks });
    }

    const predictions = [];
    allBookIds.forEach((bookId, bookIndex) => {
      const predictedRating = knn.predict([[userIndex, bookIndex]])[0];
      const userRating = userRatings.find((r) => r.book.toString() === bookId)?.rate;
      predictions.push({
        bookId,
        predictedRating: userRating || predictedRating,
        isRated: !!userRating,
      });
    });

    predictions.sort((a, b) => b.predictedRating - a.predictedRating);
    const topPredictions = predictions.slice(0, 4);
    const topBookIdsFromKNN = topPredictions.map((p) => p.bookId);

    let recommendedBooks = await getTopRatedBooksByMaxRating(4, userRatedBookIds);

    const allFlat = predictions.every(
      (p) => p.predictedRating === predictions[0].predictedRating
    );
    if (!allFlat) {
      const knnBooks = await Book.find({ _id: { $in: topBookIdsFromKNN } });
      const knnBooksWithRatings = await addRatingsToBooks(knnBooks);
      const blendedBooks = [...knnBooksWithRatings, ...recommendedBooks]
        .reduce((unique, book) => {
          if (!unique.some((b) => b._id.toString() === book._id.toString()))
            unique.push(book);
          return unique;
        }, [])
        .slice(0, 4);
      recommendedBooks = blendedBooks.map((book) => {
        const prediction = topPredictions.find((p) => p.bookId === book._id.toString());
        return {
          ...book,
          predictedRating: prediction ? prediction.predictedRating : book.maxRating || 0,
          isRated: prediction ? prediction.isRated : false,
        };
      });
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
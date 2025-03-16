const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Rating = require("../models/rating");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../routes/userAuth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = "/uploads"; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const addRatingsToBooks = async (books) => {
  const ratings = await Rating.aggregate([
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rate" },
      },
    },
  ]);

  const ratingsMap = ratings.reduce((acc, { _id, averageRating }) => {
    acc[_id.toString()] = Number(averageRating.toFixed(1)) || 0;
    return acc;
  }, {});

  return books.map((book) => {
    const avgRating = ratingsMap[book._id.toString()] || 0;
    return {
      ...book.toObject(),
      ratings: avgRating,
    };
  });
};

router.post(
  "/add-book",
  authenticateToken,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { id } = req.headers || {};
      if (!id) {
        return res.status(400).json({ message: "Missing user ID in headers" });
      }

      const user = await User.findById(id);
      if (!user || user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You are not authorized to add a book" });
      }

      const { title, author, price } = req.body || {};
      if (!title || !author || !price || !req.file) {
        return res
          .status(400)
          .json({ message: "Title, author, price, and PDF are required" });
      }

      const pdfPath = `/uploads/${req.file.filename}`;
      const fullPath = path.join(uploadDir, req.file.filename);
      console.log("PDF saved at:", fullPath); // Log the exact file path
      console.log("File exists after upload:", fs.existsSync(fullPath)); // Check if file exists immediately
      const book = new Book({
        ...(req.body || {}),
        pdf: pdfPath,
      });

      await book.save();
      const bookWithRatings = await addRatingsToBooks([book]);
      return res.status(201).json({
        message: "Book added successfully",
        data: bookWithRatings[0] || {},
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put("/update-book/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers["id"] || "";
    const bookId = req.params.id || "";

    if (!userId || !bookId) {
      return res.status(400).json({ message: "Missing user ID or book ID" });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update a book" });
    }

    const book = await Book.findByIdAndUpdate(
      bookId,
      {
        url: req.body.url || undefined,
        title: req.body.title || undefined,
        author: req.body.author || undefined,
        subject: req.body.subject || undefined,
        genre: req.body.genre || undefined,
        desc: req.body.desc || undefined,
        price: req.body.price || undefined,
        language: req.body.language || undefined,
        image: req.body.image || undefined,
        pdf: req.body.pdf || undefined,
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const bookWithRatings = await addRatingsToBooks([book]);
    return res.status(200).json({
      message: "Book updated successfully",
      data: bookWithRatings[0] || {},
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
    }
});


router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers || {};
    if (!id || !bookid) {
      return res
        .status(400)
        .json({ message: "Missing user ID or book ID in headers" });
    }

    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete a book" });
    }

    const book = await Book.findByIdAndDelete(bookid);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    const booksWithRatings = await addRatingsToBooks(books);
    return res.status(200).json({
      status: "success",
      data: booksWithRatings || [],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    const booksWithRatings = await addRatingsToBooks(books);
    return res.status(200).json({
      status: "success",
      data: booksWithRatings || [],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).json({ message: "Missing book ID in parameters" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const bookWithRatings = await addRatingsToBooks([book]);
    return res.status(200).json({
      status: "success",
      data: bookWithRatings[0] || {},
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-all-books-search", async (req, res) => {
  try {
    const { search } = req.query || {};
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    const booksWithRatings = await addRatingsToBooks(books);
    return res.status(200).json({
      status: "success",
      data: booksWithRatings || [],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/book-stats", async (req, res) => {
  try {
    const topRatedBooks = await Book.find().sort({ ratings: -1 }).limit(5);
    const trendingBooks = await Book.find().sort({ createdAt: -1 }).limit(5);
    const mostPurchasedBooks = await Order.aggregate([
      { $unwind: "$books" },
      { $group: { _id: "$books", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
    ]);

    res.status(200).json({
      topRatedBooks: topRatedBooks || [],
      trendingBooks: trendingBooks || [],
      mostPurchasedBooks: mostPurchasedBooks || [],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
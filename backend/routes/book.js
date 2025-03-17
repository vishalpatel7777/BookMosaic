const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Rating = require("../models/rating");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../routes/userAuth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "S:\learn\client_secret_134344225507-5205ee7138shkmcvvusa8okhf98nv7d5.apps.googleusercontent.com.json", // Replace with your credentials file path
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// Multer setup for temporary storage
const uploadDir = "/tmp"; // Temporary storage before uploading to Google Drive

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Setting upload destination:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60 MB limit
}).single("pdf");

// Function to upload file to Google Drive
const uploadToGoogleDrive = async (filePath, fileName) => {
  const fileMetadata = {
    name: fileName,
    parents: [], // Replace with your folder ID (optional)
  };
  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  // Make the file publicly accessible
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return response.data.webViewLink; // Returns the public URL
};

// Function to add ratings to books
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

// Add Book Route with Google Drive
router.post("/add-book", authenticateToken, (req, res) => {
  console.log("Starting /add-book request");
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(500).json({ message: "Upload error", error: err.message });
    }
    try {
      const { id } = req.headers || {};
      console.log("User ID from headers:", id);
      if (!id) {
        return res.status(400).json({ message: "Missing user ID in headers" });
      }

      const user = await User.findById(id);
      console.log("User found:", !!user, "Role:", user?.role);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to add a book" });
      }

      const { title, author, price } = req.body || {};
      console.log("Request body:", { title, author, price }, "File:", !!req.file);
      if (!title || !author || !price || !req.file) {
        return res.status(400).json({ message: "Title, author, price, and PDF are required" });
      }

      const fullPath = path.join(uploadDir, req.file.filename);
      console.log("PDF temporarily saved at:", fullPath);

      // Upload to Google Drive
      const pdfUrl = await uploadToGoogleDrive(fullPath, req.file.filename);
      console.log("PDF uploaded to Google Drive:", pdfUrl);

      // Delete temporary file after uploading
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("Temporary file deleted:", fullPath);
      }

      const book = new Book({
        ...(req.body || {}),
        pdf: pdfUrl, // Store Google Drive URL
      });

      await book.save();
      console.log("Book saved with ID:", book._id);
      const bookWithRatings = await addRatingsToBooks([book]);
      return res.status(201).json({
        message: "Book added successfully",
        data: bookWithRatings[0] || {},
      });
    } catch (error) {
      console.error("Error in /add-book:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});

// Update Book Route with Google Drive
router.put("/update-book/:id", authenticateToken, (req, res) => {
  console.log("Starting /update-book request");
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(500).json({ message: "Upload error", error: err.message });
    }
    try {
      const userId = req.headers["id"] || "";
      const bookId = req.params.id || "";
      console.log("User ID from headers:", userId, "Book ID:", bookId);
      if (!userId || !bookId) {
        return res.status(400).json({ message: "Missing user ID or book ID" });
      }

      const user = await User.findById(userId);
      console.log("User found:", !!user, "Role:", user?.role);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to update a book" });
      }

      const existingBook = await Book.findById(bookId);
      if (!existingBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Prepare update data
      const updateData = {
        url: req.body.url || existingBook.url,
        title: req.body.title || existingBook.title,
        author: req.body.author || existingBook.author,
        subject: req.body.subject || existingBook.subject,
        genre: req.body.genre || existingBook.genre,
        desc: req.body.desc || existingBook.desc,
        price: req.body.price || existingBook.price,
        language: req.body.language || existingBook.language,
        image: req.body.image || existingBook.image,
      };

      // Handle PDF update if a new file is uploaded
      if (req.file) {
        const fullPath = path.join(uploadDir, req.file.filename);
        console.log("New PDF temporarily saved at:", fullPath);

        // Upload to Google Drive
        const pdfUrl = await uploadToGoogleDrive(fullPath, req.file.filename);
        console.log("New PDF uploaded to Google Drive:", pdfUrl);

        // Delete temporary file after uploading
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log("Temporary file deleted:", fullPath);
        }

        updateData.pdf = pdfUrl; // Update with new Google Drive URL
      } else {
        updateData.pdf = existingBook.pdf; // Keep existing PDF URL
      }

      const book = await Book.findByIdAndUpdate(bookId, updateData, { new: true });
      console.log("Book updated with ID:", book._id);
      const bookWithRatings = await addRatingsToBooks([book]);
      return res.status(200).json({
        message: "Book updated successfully",
        data: bookWithRatings[0] || {},
      });
    } catch (error) {
      console.error("Error in /update-book:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers || {};
    if (!id || !bookid) {
      return res.status(400).json({ message: "Missing user ID or book ID in headers" });
    }
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete a book" });
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
      { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
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
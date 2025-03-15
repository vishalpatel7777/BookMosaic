const express = require("express");
const router = express.Router();
const axios = require("axios");
const { Cashfree } = require("cashfree-pg");
const User = require("../models/user");
const Book = require("../models/book");
const Review = require("../models/Review");
const Rating = require("../models/rating");
const Purchase = require("../models/purchase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../routes/userAuth");

router.get("/get-admin-profile", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers || {};
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (req.user.id !== id) {
      return res.status(403).json({ message: "Token and ID mismatch" });
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    return res.status(200).json(user || {});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-admin-profile", authenticateToken, async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      oldPassword,
      profilePicture,
      age,
      genre,
      phone,
    } = req.body || {};
    const id = req.headers.id || "";

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedFields = {
      fullname: fullname || undefined,
      email: email || undefined,
      profilePicture: profilePicture || undefined,
      age: age || undefined,
      genre: genre || undefined,
      phone: phone || undefined,
    };

    const existingAdmin = await User.findById(id);
    if (!existingAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (oldPassword && password) {
      const isMatch = await bcrypt.compare(
        oldPassword || "",
        existingAdmin.password || ""
      );
      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect" });
      }
      const hashedPassword = await bcrypt.hash(password || "", 10);
      updatedFields.password = hashedPassword;
    }

    const updatedAdmin = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    }).select("-password");

    if (!updatedAdmin) {
      return res.status(400).json({ error: "Update failed" });
    }

    res.status(200).json(updatedAdmin || {});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/daily", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const totalPurchases = await Book.aggregate([
      { $group: { _id: null, total: { $sum: { $ifNull: ["$purchases", 0] } } },
  }]);
    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalPurchases: totalPurchases.length ? totalPurchases[0].total : 0,
      totalReviews: totalReviews || 0,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/user-activity", async (req, res) => {
  try {
    const users = await User.find({}, "username email lastLogin role").sort({
      lastLogin: -1,
    });
    res.json({ success: true, users: users || [] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/book-analytics", async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const topRatedBooks = await Rating.aggregate([
      { $group: { _id: "$book", ratings: { $avg: "$rating" } } },
      { $sort: { ratings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookData",
        },
      },
      { $unwind: "$bookData" },
      { $project: { title: "$bookData.title", ratings: 1 } },
    ]);
    const mostPurchasedBooks = await Purchase.aggregate([
      { $group: { _id: "$book", purchases: { $sum: 1 } } },
      { $sort: { purchases: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookData",
        },
      },
      { $unwind: "$bookData" },
      { $project: { title: "$bookData.title", purchases: 1 } },
    ]);
    const recentBooks = await Book.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    res.status(200).json({
      totalBooks: totalBooks || 0,
      topRatedBooks: topRatedBooks || [],
      mostPurchasedBooks: mostPurchasedBooks || [],
      recentBooks: recentBooks || [],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/monthly-analytics", async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const revenueStats = await Purchase.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookData",
        },
      },
      { $unwind: "$bookData" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: { $ifNull: ["$bookData.price", 0] } },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const topGenres = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      userStats: userStats.length ? userStats : [],
      revenueStats: revenueStats.length ? revenueStats : [],
      topGenres: topGenres.length ? topGenres : [],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
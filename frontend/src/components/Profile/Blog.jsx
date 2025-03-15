import React from "react";
import { motion } from "framer-motion";

const blogs = [
  {
    id: 1,
    title: "Why Personalized Book Recommendations Matter 📚",
    date: "March 5, 2025",
    summary: "Discover how AI-driven recommendations are transforming the way we find and enjoy books.",
  },
  {
    id: 2,
    title: "Top 10 Must-Read Books of 2025 ✨",
    date: "February 28, 2025",
    summary: "A curated list of this year's most popular and critically acclaimed books!",
  },
  {
    id: 3,
    title: "How AI is Shaping the Future of Reading 🤖",
    date: "January 20, 2025",
    summary: "Learn how AI is making book recommendations smarter and more personalized than ever before.",
  },
];

const BlogPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📖 BookMosaic Blog
      </motion.h1>
      <div className="grid gap-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{blog.title}</h2>
            <p className="text-gray-500 text-sm mb-3">🗓 {blog.date}</p>
            <p className="text-gray-700">{blog.summary}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
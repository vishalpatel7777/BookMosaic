const mongoose = require("mongoose"); 

const conn = async () => {
  try {
    const uri = process.env.URI || "";
    if (!uri) {
      throw new Error("MongoDB URI is not provided in environment variables");
    }
    await mongoose.connect(uri); 
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

conn();
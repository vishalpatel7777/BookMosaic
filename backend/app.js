const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");

const app = express();
const user = require("./routes/user");
const book = require("./routes/book");
const wishlist = require("./routes/wishlist");
const Cart = require("./routes/cart");
const Notification = require("./routes/notification");
const Filter = require("./routes/filter");
const adminRoutes = require("./routes/adminRoutes");
const payment = require("./routes/payment");
const order = require("./routes/order");

const path = require("path");

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", wishlist);
app.use("/api/v1", Cart);
app.use("/api/v1", Notification);
app.use("/api/v1", Filter);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", payment);
app.use("/api/v1", order);

app.use("/uploads", (req, res, next) => {
  console.log("Requesting:", req.path);
  next();
}, express.static("/uploads"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "bookMosaic017", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
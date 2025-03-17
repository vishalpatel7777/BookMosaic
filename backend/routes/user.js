const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { authenticateToken } = require("../routes/userAuth");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

router.post("/validate-step1", async (req, res) => {
  try {
    const { email, username, age } = req.body || {};
    if (!email || !username || !age) {
      return res.status(400).json({ message: "Email, username, and age are required." });
    }
    if (username.length <= 4) {
      return res.status(400).json({ message: "Username length should be greater than 4." });
    }
    if (age <= 0) {
      return res.status(400).json({ message: "Age should be greater than 0." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    return res.status(200).json({ message: "Step 1 validation successful. Proceed to Step 2." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/validate-step2", async (req, res) => {
  try {
    const { phone, password } = req.body || {};
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required." });
    }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
    }
    if (!password || !validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 6+ characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character (e.g., !@#$%^&*).",
      });
    }

    return res.status(200).json({ message: "Step 2 validation successful. Proceed to Step 3." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, username, password, age, genre, fullname, phone, image } = req.body || {};

    if (!email || !username || !password || !age || !genre || !fullname || !phone) {
      return res.status(400).json({ message: "All fields except image are required." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 6+ characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character (e.g., !@#$%^&*).",
      });
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultImage = "https://www.bing.com/th?id=OIP.S_BEyoTYNIwRpRXmQWtKJAHaHa";
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      genre,
      fullname,
      phone,
      image: image || defaultImage,
      isVerified: false,
      verificationToken,
    });

    await newUser.save();

    const verificationLink = `${
      process.env.BASE_URL || "https://bookmosaic.onrender.com"
    }/api/v1/verify-email/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Welcome to bookMosaic – Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4A90E2;">Welcome to bookMosaic! 📚</h2>
            <p>Hi there,</p>
            <p>Thank you for joining <strong>bookMosaic</strong>! To get started, please verify your email by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${verificationLink}" style="background-color: #4A90E2; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    ✅ Verify My Email
                </a>
            </p>
            <p>If you didn’t sign up for bookMosaic, you can safely ignore this email.</p>
            <p>Happy Reading! 📖</p>
            <p>Best Regards,<br><strong>The bookMosaic Team</strong></p>
            <hr>
            <p style="font-size: 12px; color: #888;">📩 Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
            <p style="font-size: 12px; color: #888;">🌍 Visit us: <a href="https://bookmosaic.netlify.app/">www.bookMosaic.com</a></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(201).json({
      message: "User created successfully. Please check your email for verification.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params || {};
    if (!token) {
      return res.status(400).send("Invalid request");
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.send(`
        <html>
        <head>
            <title>Invalid Token</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .container { max-width: 500px; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                h1 { color: #e74c3c; }
                p { color: #333; }
                a { text-decoration: none; color: white; background: #4A90E2; padding: 10px 20px; border-radius: 5px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>⚠️ Invalid or Expired Link</h1>
                <p>The verification link is invalid or has expired.</p>
                <a href="https://bookmosaic.netlify.app/">Go to bookMosaic</a>
            </div>
        </body>
        </html>
      `);
    }

    if (user.isVerified) {
      return res.redirect("https://bookmosaic.netlify.app/email-already-verified");
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.redirect("https://bookmosaic.netlify.app/verification-success");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (!existingEmail) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });
    }

    if (!existingEmail.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(
      password,
      existingEmail.password || ""
    );
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });
    }

    const authClaims = {
      id: existingEmail._id,
      username: existingEmail.username,
      role: existingEmail.role,
    };
    const token = jwt.sign(
      authClaims,
      process.env.JWT_SECRET || "bookMosaic017",
      {
        expiresIn: "30d",
      }
    );

    await User.updateOne(
      { _id: existingEmail._id },
      { $set: { lastLogin: new Date() } }
    );

    res.status(200).json({
      id: existingEmail._id,
      role: existingEmail.role,
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers || {};
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const data = await User.findById(id).select("-password");
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers || {};
    const { genre, age } = req.body || {};
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { genre, age },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all-users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users || []);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/delete-user/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id || "";
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password/${resetToken}`;
    const mailOptions = {
      from: "kuzemasachika636@gmail.com",
      to: email,
      subject: "🔑 Reset Your bookMosaic Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4A90E2;">Password Reset Request</h2>
          <p>Hi ${user.fullname || "there"},</p>
          <p>We received a request to reset your bookMosaic password. Click the button below to reset it:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" style="background-color: #4A90E2; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              🔄 Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour. If you didn’t request a reset, please ignore this email.</p>
          <p>Best Regards,<br><strong>The bookMosaic Team</strong></p>
          <hr>
          <p style="font-size: 12px; color: #888;">📩 Need help? Contact us at <a href="mailto:kuzemasachika636@gmail.com">kuzemasachika636@gmail.com</a></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params || {};
    const { password } = req.body || {};

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

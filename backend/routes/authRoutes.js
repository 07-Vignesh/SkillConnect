const express = require("express");
const router = express.Router();
const Freelancer = require("../models/Freelancer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register freelancer (optional)
router.post("/register", async (req, res) => {
  const { name, email, password, category, city, pincode } = req.body;
  try {
    const existing = await Freelancer.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const freelancer = await Freelancer.create({ name, email, password, category, city, pincode });
    res.status(201).json({
      freelancer,
      token: generateToken(freelancer._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login freelancer
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const freelancer = await Freelancer.findOne({ email });
    if (!freelancer) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await freelancer.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      freelancer,
      token: generateToken(freelancer._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

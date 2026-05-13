import express from "express";
import Freelancer from "../models/Freelancer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register freelancer (optional)
// Clerk-only: Register/Upsert freelancer profile (no password)
router.post("/register", async (req, res) => {
  const { name, email, category, city, pincode } = req.body;
  try {
    let freelancer = await Freelancer.findOne({ email });
    if (freelancer) {
      // Update profile if exists
      freelancer.name = name;
      freelancer.category = category;
      freelancer.city = city;
      freelancer.pincode = pincode;
      await freelancer.save();
    } else {
      freelancer = await Freelancer.create({ name, email, category, city, pincode });
    }
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
// Clerk-only: Login is handled by Clerk, this endpoint can be used to fetch freelancer profile by email
router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const freelancer = await Freelancer.findOne({ email });
    if (!freelancer) return res.status(404).json({ message: "Freelancer profile not found" });
    res.json({
      freelancer,
      token: generateToken(freelancer._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

// routes/freelancer.js
import express from "express";
import Project from "../models/Project.js";
import { authMiddleware } from "../middleware/auth.js";
import Freelancer from "../models/Freelancer.js";


const router = express.Router();

// Become a Freelancer
router.post("/become", authMiddleware, async (req, res) => {
  try {
    req.user.role = "freelancer";
    await req.user.save();
    res.json({ success: true, message: "User upgraded to Freelancer", user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




router.get("/location", async (req, res) => {
  const { city, pincode } = req.query;
  try {
    const freelancers = await Freelancer.find({ city, pincode });
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Freelancer Projects
router.get("/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ freelancer: req.user._id });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a Completed Project
router.post("/projects", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      freelancer: req.user._id
    });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// GET freelancer by email
router.get("/by-email/:email", async (req, res) => {
  const freelancer = await Freelancer.findOne({ email: req.params.email });
  if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
  res.json(freelancer);
});

// GET bookings by freelancer ID
router.get("/freelancer/:freelancerId", async (req, res) => {
  const bookings = await Booking.find({ freelancerId: req.params.freelancerId });
  res.json(bookings);
});


export default router;

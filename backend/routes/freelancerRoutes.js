import express from "express";
const router = express.Router();
import Freelancer from "../models/Freelancer.js";

import mongoose from "mongoose";


// ------------------ Freelancer Routes ------------------


// Create or update freelancer profile

// Get freelancer profile by clerkId


// Get all freelancers (for browsing)
router.get('/', async (req, res) => {
  try {
    const freelancers = await Freelancer.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Freelancers retrieved successfully',
      count: freelancers.length,
      freelancers
    });

  } catch (error) {
    console.error('Error fetching freelancers:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update freelancer profile


// Delete freelancer profile





// Create a new freelancer (general)


// Get freelancers by city & optional pincode
router.get("/location", async (req, res) => {
  try {
    const { city, pincode } = req.query;
    if (!city) return res.status(400).json({ message: "City is required" });

    let query = { city: { $regex: new RegExp(city, "i") } };
    if (pincode) query.pincode = pincode;

    const freelancers = await Freelancer.find(query);
    res.json(freelancers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get freelancers by category
router.get("/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const freelancers = await Freelancer.find({
      category: { $regex: new RegExp("^" + categoryName + "$", "i") },
    });
    res.json(freelancers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Search freelancers by city + pincode
router.get("/search", async (req, res) => {
  try {
    const { city, pincode } = req.query;
    if (!city || !pincode)
      return res.status(400).json({ message: "City and pincode are required" });

    const freelancers = await Freelancer.find({
      city: { $regex: new RegExp(city, "i") },
      pincode,
    });

    res.json(freelancers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});






router.post("/", async (req, res) => {
  try {
    const freelancer = new Freelancer(req.body);
    const savedFreelancer = await freelancer.save();
    res.status(201).json(savedFreelancer);
  } catch (err) {
    console.error("❌ Error saving freelancer:", err);
    res.status(500).json({ message: "Server error while saving freelancer" });
  }
});
// 🔵 Get all freelancers
router.get("/", async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch freelancers" });
  }
});

// 🟡 Get single freelancer
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching freelancer" });
  }
});

// 🟠 Update freelancer
router.put("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: "Failed to update freelancer" });
  }
});

// 🔴 Delete freelancer
router.delete("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });
    res.json({ message: "Freelancer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete freelancer" });
  }
});






router.get("/", async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch freelancers" });
  }
});

// Get single freelancer by ID
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching freelancer" });
  }
});

// Add project to freelancer (optional)
router.post("/:id/projects", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });

    freelancer.projects.push(req.body); // req.body = { title, client, amount, rating, review }
    await freelancer.save();

    res.status(201).json(freelancer);
  } catch (err) {
    res.status(500).json({ message: "Failed to add project", error: err.message });
  }
});

// GET freelancer by email
router.get("/by-email/:email", async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ email: req.params.email });
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching freelancer" });
  }
});


router.get("/freelancer/:freelancerId", async (req, res) => {
  const bookings = await Booking.find({ freelancerId: req.params.freelancerId });
  res.json(bookings);
});


export default router;

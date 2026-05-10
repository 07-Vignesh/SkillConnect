import express from "express";
const router = express.Router();
import Freelancer from "../models/Freelancer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ------------------ Freelancer Routes ------------------

// 🌱 SEED ENDPOINT - Load 150 profiles from JSON
router.post("/seed/load-from-json", async (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "../../frontend/src/datas/freelancers.json");
    
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ message: "freelancers.json not found" });
    }

    const freelancersData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // Clear existing data (optional)
    await Freelancer.deleteMany({});

    // Insert all freelancers
    const savedFreelancers = await Freelancer.insertMany(freelancersData);

    res.status(201).json({
      message: "✅ Database seeded successfully!",
      count: savedFreelancers.length,
      freelancers: savedFreelancers,
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    res.status(500).json({
      message: "Error seeding database",
      error: error.message,
    });
  }
});

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

    // Support both nested location.city and flat city field
    let query = {
      $or: [
        { city: { $regex: new RegExp(city, "i") } },
        { "location.city": { $regex: new RegExp(city, "i") } }
      ]
    };
    
    if (pincode) {
      query.$or.push(
        { pincode: { $regex: new RegExp(pincode, "i") } },
        { "location.pincode": { $regex: new RegExp(pincode, "i") } }
      );
    }

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
      $or: [
        { category: { $regex: new RegExp(categoryName, "i") } },
        { subcategory: { $regex: new RegExp(categoryName, "i") } }
      ]
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

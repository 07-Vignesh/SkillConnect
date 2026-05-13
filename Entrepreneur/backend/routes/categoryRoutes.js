import express from "express";
import Category from "../models/categoryModel.js";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Category GET error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST category (prevents duplicates)
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const normalized = req.body.name.trim().toLowerCase();
    // Check if category already exists by normalized
    const existing = await Category.findOne({ normalized });
    if (existing) {
      return res.json(existing); // Return existing category instead of error
    }

    const newCategory = new Category({
      name: req.body.name,
      normalized,
    });

    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Category POST error:", error);
    res.status(500).json({ message: "Error adding category", error: error.message });
  }
});

export default router;
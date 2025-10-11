const Freelancer = require("../models/Freelancer");

// Get all freelancers
exports.getFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one freelancer by ID
exports.getFreelancerById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ error: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new freelancer
exports.createFreelancer = async (req, res) => {
  try {
    const newFreelancer = new Freelancer(req.body);
    const saved = await newFreelancer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update freelancer
exports.updateFreelancer = async (req, res) => {
  try {
    const updated = await Freelancer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Freelancer not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete freelancer
exports.deleteFreelancer = async (req, res) => {
  try {
    const deleted = await Freelancer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Freelancer not found" });
    res.json({ message: "Freelancer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

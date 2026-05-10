import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import bookingRoutes from "./routes/bookingroutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import Freelancer from "./models/Freelancer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

// 🌱 AUTO-SEED DATABASE ON STARTUP
const seedDatabase = async () => {
  try {
    const jsonPath = path.join(__dirname, "../frontend/src/datas/freelancers.json");

    if (!fs.existsSync(jsonPath)) {
      console.log("⚠️ freelancers.json not found at:", jsonPath);
      return;
    }

    const freelancersData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const count = await Freelancer.countDocuments();

    if (count !== freelancersData.length) {
      console.log(
        `📊 Syncing MongoDB freelancers (${count}) with JSON source (${freelancersData.length})...`
      );
      await Freelancer.deleteMany({});
      const result = await Freelancer.insertMany(freelancersData);
      console.log(`✅ Seeded ${result.length} freelancer profiles successfully!`);
    } else {
      console.log(`✅ Database already has ${count} freelancers`);
    }
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
};

// Run seeding after a short delay to ensure DB connection is ready
setTimeout(seedDatabase, 1000);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => res.send("Freelancer API is running ✅"));

// API routes
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/categories", categoryRoutes);
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    res.json({
      reply: `You said: ${message}`,
    });

  } catch (error) {
    res.status(500).json({
      error: "Chat error",
    });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

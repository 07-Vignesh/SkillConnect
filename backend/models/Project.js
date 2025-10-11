// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: String,
  client: String,
  amount: Number,
  rating: Number,
  review: String,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Project", projectSchema);

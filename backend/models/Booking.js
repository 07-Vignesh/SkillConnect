import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
  clientName: String,
  clientEmail: String,
  projectDetails: String,
  advanceFee: Number,
  status: { type: String, default: "pending" },
  rating: { type: Number, min: 1, max: 5 },
});

export default mongoose.model("booking", bookingSchema);

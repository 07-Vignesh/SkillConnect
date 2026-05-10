import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    type: String,
    amount: Number,
    description: String,
  },
  { _id: false }
);

const freelancerSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  category: String,
  subcategory: String,
  skills: [String],
  experience: String,
  location: {
    city: String,
    pincode: String,
  },
  city: String,
  pincode: String,
  pricing: pricingSchema,
  price: Number,
  rating: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  linkedin: String,
  profileImage: String,

  projects: [
    {
      projectTitle: String,
      clientName: String,
      clientEmail: String,
      amount: Number,
      review: String,
      rating: Number,
    },
  ],
  totalRatings: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("freelancer", freelancerSchema);

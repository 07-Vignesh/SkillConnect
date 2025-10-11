import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema({
  name: String,
  email: String,
  category: String,
  price: Number,
  city: String,
  pincode: String,
  averageRating: { type: Number, default: 0 },

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
  averageRating: { type: Number, default: 0 },
totalRatings: { type: Number, default: 0 },
ratingSum: { type: Number, default: 0 },


});

export default mongoose.model("freelancer", freelancerSchema);

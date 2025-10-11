// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // or Clerk ID if using Clerk
  role: {
    type: String,
    enum: ["user", "freelancer", "admin"],
    default: "user"
  }
});

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null }, // allow null for Google users
  googleId: { type: String, default: null },
  provider: { type: String, default: "google" }, // "manual" or "google"
});

export default mongoose.model("User", userSchema);
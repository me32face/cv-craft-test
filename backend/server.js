import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "https://cvcraft.in",       
    "http://localhost:3000"     
  ],
  credentials: true,
})
);

app.use(express.json());

//  Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

//  Routes
app.use("/api", authRoutes);

//  Test route
app.get("/", (req, res) => {
  res.send("Backend is running fine!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

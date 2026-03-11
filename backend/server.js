import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "https://cv-craft-test.vercel.app",
    "https://cvcraft.in",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
})
);

app.use(express.json({ limit: '2mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per IP per window
  message: { success: false, message: 'Too many requests, try again later' }
});

//  Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

//  Routes
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/share/create", authLimiter);

app.use("/api", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/share", shareRoutes);

//  Test route
app.get("/", (req, res) => {
  res.send("Backend is running fine!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

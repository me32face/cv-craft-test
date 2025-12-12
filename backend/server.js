import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

dotenv.config();

const app = express();
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: [
    "https://cvcraft.in",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
})
);

app.use(express.json({ limit: '10mb' }));

//  Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

//  Routes
app.use("/api", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/share", shareRoutes);

//  Test route
app.get("/", (req, res) => {
  res.send("Backend is running fine!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

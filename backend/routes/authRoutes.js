import express from "express";
import { registerUser, loginUser, getProfile,googleAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/auth/google", googleAuth);
export default router;

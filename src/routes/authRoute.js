import express from "express";
import authController from "../controllers/authController.js";
import { verifyToken, verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no middleware needed)
router.post("/login", authController.login);

// Admin routes
router.post("/create-account", verifyToken, verifyAdmin, authController.createAccount);
router.get("/users", verifyToken, verifyAdmin, authController.getAllUsers);
router.put("/users/:userId", verifyToken, verifyAdmin, authController.updateUserByAdmin);
router.delete("/users/:userId", verifyToken, verifyAdmin, authController.deleteUser);

// User routes
router.put("/profile", verifyToken, verifyUser, authController.updateProfile);

export default router;

import express from "express";
import { manualInputMachine } from "../controllers/manualinputController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /manual-input (with token)
router.post("/", verifyToken, manualInputMachine);

export default router;

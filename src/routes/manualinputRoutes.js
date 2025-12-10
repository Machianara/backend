import express from "express";
import { manualInputMachine } from "../controllers/manualinputController.js";

const router = express.Router();

// POST /manual-input
router.post("/", verifyToken, manualInputMachine);

export default router;

import express from "express";
import { manualInputMachine } from "../controllers/manualinputController.js";
<<<<<<< HEAD

const router = express.Router();

// POST /manual-input
router.post("/", manualInputMachine);
=======
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /manual-input - require token
router.post("/", verifyToken, manualInputMachine);
>>>>>>> origin/feature/admin

export default router;

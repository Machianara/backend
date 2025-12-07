import express from "express";

import { manualInputMachine } from "../controllers/manualinputController.js";

const router = express.Router();

// POST /manual-input

router.post("/", manualInputMachine);

export default router;

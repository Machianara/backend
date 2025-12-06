// src/routes/autoTicketRoutes.js
import express from "express";
import { createAutoTicket } from "../controllers/autoTicketController.js";

const router = express.Router();

// POST /api/auto-tickets/create-from-ai
router.post("/create-from-ai", createAutoTicket);

export default router;

import express from "express";
import { createAutoTicket } from "../controllers/autoTicketController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Endpoint ini akan diakses lewat: POST /api/auto-tickets - require token
router.post("/", verifyToken, createAutoTicket);

export default router;

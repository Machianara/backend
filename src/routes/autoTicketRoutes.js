// src/routes/autoTicketRoutes.js
import express from "express";
import { createAutoTicket } from "../controllers/autoTicketController.js";

const router = express.Router();

// Endpoint ini akan diakses lewat: POST /api/auto-tickets
router.post("/", createAutoTicket);

export default router;

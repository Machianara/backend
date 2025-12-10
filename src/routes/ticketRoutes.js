import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTicket);
router.get("/", verifyToken, getTickets);
router.get("/:id", verifyToken, getTicketById);
router.put("/:id", verifyToken, updateTicket);
router.delete("/:id", verifyToken, deleteTicket);

export default router;

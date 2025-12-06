// src/controllers/autoTicketController.js
import Ticket from "../models/ticket.js";

/**
 * Create ticket otomatis dari AI button
 * @param req.body: { machine_name, issue, priority (optional) }
 */
export const createAutoTicket = async (req, res) => {
  try {
    const { machine_name, issue, priority } = req.body;

    if (!machine_name || !issue) {
      return res
        .status(400)
        .json({ error: "machine_name and issue are required" });
    }

    const ticket = await Ticket.create({
      machine_name,
      date: new Date(),
      issue,
      status: "open",
      auto_generated: true,
      priority: priority || "medium",
    });

    // Response sama format manual ticketing
    res.status(201).json({
      id: ticket.id,
      machine_name: ticket.machine_name,
      date: ticket.date,
      issue: ticket.issue,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    });
  } catch (err) {
    console.error("Auto Ticket Creation Error:", err);
    res.status(500).json({ error: "Failed to create auto ticket" });
  }
};

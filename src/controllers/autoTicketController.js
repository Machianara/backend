// src/controllers/autoTicketController.js
import Ticket from "../models/ticket.js";

export const createAutoTicket = async (req, res) => {
  try {
    // 1. Terima priority dari body (dikirim oleh Python)
    const { machine_name, issue, priority } = req.body;

    if (!machine_name || !issue) {
      return res
        .status(400)
        .json({ error: "machine_name and issue are required" });
    }

    // 2. Logic Priority Fallback
    // Jika AI mengirim priority valid (low/medium/high), pakai itu.
    // Jika tidak, default ke 'medium'.
    const validPriorities = ["low", "medium", "high"];
    const finalPriority = validPriorities.includes(priority)
      ? priority
      : "medium";

    const ticket = await Ticket.create({
      machine_name,
      date: new Date(), // Sequelize akan otomatis ambil tanggalnya saja karena tipe DATEONLY
      issue,
      status: "open",
      auto_generated: true, // Flag bahwa ini dari AI
      priority: finalPriority,
    });

    // 3. Response JSON yang dibutuhkan Python
    res.status(201).json({
      success: true, // Tambahan flag biar Python gampang ngecek if ticket_res["success"]
      ticket_id: ticket.id,
      machine_name: ticket.machine_name,
      status: ticket.status,
      priority: ticket.priority,
    });
  } catch (err) {
    console.error("Auto Ticket Creation Error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to create auto ticket" });
  }
};

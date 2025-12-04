import Ticket from "../models/ticket.js";

// Create
export const createTicket = async (req, res) => {
  try {
    const { machine_name, date, issue } = req.body;

    const ticket = await Ticket.create({
      machine_name,
      date,
      issue,
      status: "open",
    });

    res.status(201).json({ message: "Ticket created", ticket });
  } catch (error) {
    console.error("Create Ticket Error:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};


// Get all
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};


// Get by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};

// Update ticket (title, description, priority)
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    await ticket.update(req.body);

    res.json({ message: "Ticket updated", ticket });
  } catch (error) {
    console.error("Update Ticket Error:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};


// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    await ticket.destroy();
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};

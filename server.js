// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

// Models
import Ticket from "./src/models/ticket.js";

// Routes
import ticketRoutes from "./src/routes/ticketRoutes.js";
import autoTicketRoutes from "./src/routes/autoTicketRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB connect & sync
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err));

sequelize
  .sync({ alter: true })
  .then(() => console.log("Tables synced"))
  .catch((err) => console.error("Table sync failed:", err));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Machinara backend running" })
);

// Routes
app.use("/api/tickets", ticketRoutes); // CRUD manual
app.use("/api/auto-tickets", autoTicketRoutes); // Auto ticket via AI button

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

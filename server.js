// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

// Models (pastikan semua model di-import sebelum sync)
import "./src/models/ticket.js";

// Routes
import ticketRoutes from "./src/routes/ticketRoutes.js";
import autoTicketRoutes from "./src/routes/autoTicketRoutes.js";
import manualInputRoutes from "./src/routes/manualinputRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route (Wajib biar Railway gak tampil "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Machinara Ticketing API is running 🚀");
});

// Health Check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Machinara backend running" })
);

// Database Connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Sync Tables
sequelize
  .sync()
  .then(() => console.log("✅ Tables synced"))
  .catch((err) => console.error("❌ Table sync failed:", err));

// API Routes
app.use("/api/tickets", ticketRoutes); // CRUD manual
app.use("/api/auto-tickets", autoTicketRoutes); // Auto ticket by AI button
app.use("/api/manual-input", manualInputRoutes); // Manual input

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

// Models
import Machine from "./src/models/machine.js";
import Metric from "./src/models/metric.js";
import Prediction from "./src/models/prediction.js";
import User from "./src/models/user.js";
import Ticket from "./src/models/ticket.js";

// Routes
import ticketRoutes from "./src/routes/ticketRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Check
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err));

sequelize
  .sync({ alter: true })
  .then(() => console.log("Tables synced"))
  .catch((err) => console.error("Table sync failed:", err));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Machinara backend running" });
});

// Ticketing route
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

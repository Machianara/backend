import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

// Models
import Machine from "./src/models/machine.js";
import Metric from "./src/models/metric.js";
import Prediction from "./src/models/prediction.js";
import User from "./src/models/user.js";

// Routes
import authRoute from "./src/routes/authRoute.js";
import ticketRoutes from "./src/routes/ticketRoutes.js";
import autoTicketRoutes from "./src/routes/autoTicketRoutes.js";
import manualinputRoutes from "./src/routes/manualinputRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err));

// Sync models
sequelize
  .sync({ alter: true })
  .then(() => console.log("Tables synced"))
  .catch((err) => console.error("Table sync failed:", err));

// Register Routes
app.use("/auth", authRoute);
app.use("/tickets", ticketRoutes);
app.use("/auto-tickets", autoTicketRoutes);
app.use("/manual-input", manualinputRoutes);

// Sample route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Machinara backend running" });
});

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

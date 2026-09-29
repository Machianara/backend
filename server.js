import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

// Models (gabungan HEAD + feature/admin)
import Machine from "./src/models/machine.js";
import Metric from "./src/models/metric.js";
import Prediction from "./src/models/prediction.js";
import User from "./src/models/user.js";
import "./src/models/ticket.js"; // ticket model tetap auto load

// Routes
import authRoute from "./src/routes/authRoute.js";
import ticketRoutes from "./src/routes/ticketRoutes.js";
import autoTicketRoutes from "./src/routes/autoTicketRoutes.js";
import manualinputRoutes from "./src/routes/manualinputRoutes.js";

// Swagger Documentation
import { setupSwagger } from "./swaggerSetup.js";

// Load environment vars
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Sync models
sequelize
  .sync()
  .then(() => console.log("✅ Tables synced"))
  .catch((err) => console.error("❌ Table sync failed:", err));

// Setup Swagger Documentation
setupSwagger(app);

// Register Routes
app.use("/auth", authRoute);
app.use("/api/tickets", ticketRoutes);
app.use("/api/auto-tickets", autoTicketRoutes);
app.use("/api/manual-input", manualinputRoutes);

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ticket = sequelize.define("ticket", {
  machine_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  issue: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("open", "in_progress", "resolved"),
    defaultValue: "open",
  },
});

export default Ticket;

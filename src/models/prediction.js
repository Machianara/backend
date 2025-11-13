import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Machine from "./machine.js";

const Prediction = sequelize.define(
  "Prediction",
  {
    machine_id: {
      type: DataTypes.INTEGER,
      references: { model: "machines", key: "id" },
      allowNull: false,
    },
    predicted_risk: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Low",
    },
    failure_probability: DataTypes.FLOAT,
    recommended_action: DataTypes.TEXT,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "predictions",
    timestamps: true,
  }
);

Machine.hasMany(Prediction, { foreignKey: "machine_id" });
Prediction.belongsTo(Machine, { foreignKey: "machine_id" });

export default Prediction;

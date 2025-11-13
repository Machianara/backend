import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Machine from "./machine.js";

const Metric = sequelize.define(
  "Metric",
  {
    machine_id: {
      type: DataTypes.INTEGER,
      references: { model: "machines", key: "id" },
      allowNull: false,
    },
    air_temperature: DataTypes.FLOAT,
    process_temperature: DataTypes.FLOAT,
    rotational_speed: DataTypes.FLOAT,
    torque: DataTypes.FLOAT,
    tool_wear: DataTypes.FLOAT,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "metrics",
    timestamps: true,
  }
);

Machine.hasMany(Metric, { foreignKey: "machine_id" });
Metric.belongsTo(Machine, { foreignKey: "machine_id" });

export default Metric;

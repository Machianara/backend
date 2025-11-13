import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Machine = sequelize.define(
  "Machine",
  {
    product_id: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING },
  },
  {
    tableName: "machines",
    timestamps: true,
  }
);

export default Machine;

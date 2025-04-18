const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Reject"),
      defaultValue: "Pending",
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;

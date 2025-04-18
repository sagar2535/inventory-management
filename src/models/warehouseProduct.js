const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WarehouseProduct = sequelize.define(
  "warehouse_products",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: "warehouse_products",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = WarehouseProduct;

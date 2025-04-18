const { catchAsync, AppError } = require("../utils/appError");
const Model = require("../models/index");
const sequelize = require("../config/database");

exports.createStock = catchAsync(async (req, res, next) => {
  const { product_id, warehouse_id, stock_quantity } = req.body;

  if (!product_id || !warehouse_id || !stock_quantity) {
    return next(
      new AppError(
        "All fields (product_id, warehouse_id, stock_quantity) are required",
        400
      )
    );
  }

  const existingEntry = await Model.WarehouseProduct.findOne({
    where: {
      product_id,
      warehouse_id,
    },
  });

  if (existingEntry) {
    existingEntry.stock_quantity += parseInt(stock_quantity);
    await existingEntry.save();

    return res.status(200).json({
      status: "success",
      data: existingEntry,
      message: "Stock updated successfully",
    });
  }

  const newEntry = await Model.WarehouseProduct.create({
    product_id,
    warehouse_id,
    stock_quantity,
  });

  res.status(201).json({
    status: "success",
    data: newEntry,
    message: "Product stock added successfully",
  });
});

exports.getAllStocks = catchAsync(async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = page * limit;

  const stocks = await Model.WarehouseProduct.findAll({
    limit,
    offset,
    raw: true,
    attributes: [
      "id",
      "product_id",
      "warehouse_id",
      "stock_quantity",
      [
        sequelize.literal(
          `(SELECT name FROM public.products WHERE id = warehouse_products.product_id LIMIT 1)`
        ),
        "product_name",
      ],
      [
        sequelize.literal(
          `(SELECT name FROM public.warehouses WHERE id = warehouse_products.warehouse_id LIMIT 1)`
        ),
        "warehouse_name",
      ],
    ],
  });

  if (stocks.length === 0) {
    return next(new AppError("No Stocks Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: stocks,
    message: "Stocks fetched successfully",
  });
});

exports.getStockById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const stock = await Model.WarehouseProduct.findOne({
    where: { id },
    raw: true,
    attributes: [
      "id",
      "product_id",
      "warehouse_id",
      "stock_quantity",
      [
        sequelize.literal(
          `(SELECT name FROM public.products WHERE id = warehouse_products.product_id LIMIT 1)`
        ),
        "product_name",
      ],
      [
        sequelize.literal(
          `(SELECT name FROM public.warehouses WHERE id = warehouse_products.warehouse_id LIMIT 1)`
        ),
        "warehouse_name",
      ],
    ],
  });

  if (!stock) {
    return next(new AppError("Stock not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: stock,
    message: "Stock fetched successfully",
  });
});

exports.updateStockById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;

  if (stock_quantity == null || isNaN(stock_quantity)) {
    return next(new AppError("Valid stock quantity is required", 400));
  }

  if (stock_quantity < 0) {
    return next(new AppError("Stock quantity cannot be negative", 400));
  }

  const stock = await Model.WarehouseProduct.findByPk(id);

  if (!stock) {
    return next(new AppError("Stock entry not found", 404));
  }

  await Model.WarehouseProduct.update({ stock_quantity }, { where: { id } });

  res.status(200).json({
    status: "success",
    message: "Stock updated successfully",
  });
});

exports.deleteStockById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Stock ID is required", 400));
  }

  const deleted = await Model.WarehouseProduct.destroy({
    where: { id },
  });

  if (!deleted) {
    return next(new AppError("Stock not found or already deleted", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Stock deleted successfully",
  });
});

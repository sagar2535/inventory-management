const { catchAsync, AppError } = require("../utils/appError");
const Model = require("../models/index");

exports.createWarehouse = catchAsync(async (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return next(
      new AppError(
        "All fields (name, address, latitude, longitude) are required",
        400
      )
    );
  }

  const newWarehouse = await Model.Warehouses.create({
    name,
    address,
    latitude,
    longitude,
  });

  res.status(201).json({
    status: "success",
    data: newWarehouse,
    message: "Warehouse created successfully",
  });
});

exports.getAllWarehouses = catchAsync(async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = page * limit;

  const { name } = req.query;
  const whereCondition = {};

  if (name) {
    whereCondition.name = name;
  }

  const warehouses = await Model.Warehouses.findAll({
    where: whereCondition,
    limit,
    offset,
    raw: true,
  });

  if (warehouses.length === 0) {
    return next(new AppError("No Warehouses Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: warehouses,
    message: "Warehouses fetched successfully",
  });
});

exports.getWarehouseById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const warehouse = await Model.Warehouses.findOne({
    where: { id },
    raw: true,
  });

  if (!warehouse) {
    return next(new AppError("Warehouse not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: warehouse,
    message: "Warehouse fetched successfully",
  });
});

exports.updateWarehouseById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, address, longitude, latitude } = req.body;

  const warehouse = await Model.Warehouses.findByPk(id, { raw: true });

  if (!warehouse) {
    return next(new AppError("Warehouse not found", 404));
  }

  await Model.Warehouses.update(
    { name, address, longitude, latitude },
    { where: { id } }
  );

  res.status(200).json({
    status: "success",
    message: "Warehouse updated successfully",
  });
});

exports.deleteWarehouseById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Warehouse ID is required", 400));
  }

  const deleted = await Model.Warehouses.destroy({
    where: { id },
  });

  if (!deleted) {
    return next(new AppError("Warehouse not found or already deleted", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Warehouse deleted successfully",
  });
});

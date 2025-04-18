const { catchAsync, AppError } = require("../utils/appError");
const Model = require("../models/index");
const sequelize = require("../config/database");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { product_id, warehouse_id } = req.body;
  const user_id = req.user;

  const user = await Model.User.findByPk(user_id?.user.id);
  if (!user) {
    return next(new AppError("User not found", 403));
  }

  if (user.status !== "Approved") {
    return next(
      new AppError(
        `Your account is currently '${user.status}'. Only approved users can place orders.`,
        403
      )
    );
  }

  if (!product_id || !warehouse_id) {
    return next(
      new AppError("All fields (product_id, warehouse_id) are required", 400)
    );
  }

  const warehouseProduct = await Model.WarehouseProduct.findOne({
    where: { product_id, warehouse_id },
  });

  if (!warehouseProduct || warehouseProduct.stock_quantity <= 0) {
    return next(
      new AppError("Product is out of stock at the selected warehouse", 400)
    );
  }

  const newOrder = await Model.Order.create({
    user_id: user_id?.user.id,
    product_id,
    warehouse_id,
  });

  res.status(201).json({
    status: "success",
    data: newOrder,
    message: "Order created successfully",
  });
});

exports.getAllOrder = catchAsync(async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = page * limit;

  const { status } = req.query;
  const whereCondition = {};
  if (status) {
    whereCondition.status = status;
  }

  const orders = await Model.Order.findAll({
    where: whereCondition,
    limit,
    offset,
    raw: true,
    attributes: [
      "id",
      "user_id",
      "product_id",
      "warehouse_id",
      "status",
      [
        sequelize.literal(
          `(SELECT first_name from public.users where id = orders.user_id LIMIT 1)`
        ),
        "user_name",
      ],
      [
        sequelize.literal(
          `(SELECT name from public.products where id = orders.product_id LIMIT 1)`
        ),
        "product_name",
      ],
      [
        sequelize.literal(
          `(SELECT name from public.warehouses where id = orders.warehouse_id LIMIT 1)`
        ),
        "warehouse_name",
      ],
    ],
  });

  if (orders.length === 0) {
    return next(new AppError("No Orders Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: orders,
    message: "Orders fetched successfully",
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Model.Order.findOne({
    where: { id },
    raw: true,
    attributes: [
      "id",
      "user_id",
      "product_id",
      "warehouse_id",
      "status",
      [
        sequelize.literal(
          `(SELECT first_name from public.users where id = orders.user_id LIMIT 1)`
        ),
        "user_name",
      ],
      [
        sequelize.literal(
          `(SELECT name from public.products where id = orders.product_id LIMIT 1)`
        ),
        "product_name",
      ],
      [
        sequelize.literal(
          `(SELECT name from public.warehouses where id = orders.warehouse_id LIMIT 1)`
        ),
        "warehouse_name",
      ],
    ],
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: order,
    message: "Order fetched successfully",
  });
});

exports.updateOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Model.Order.findByPk(id, { raw: true });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  await Model.OrderModel.update({ status }, { where: { id } });

  res.status(200).json({
    status: "success",
    message: "Order updated successfully",
  });
});

exports.deleteOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Order ID is required", 400));
  }

  const deleted = await Model.Order.destroy({
    where: { id },
  });

  if (!deleted) {
    return next(new AppError("Order not found or already deleted", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
  });
});

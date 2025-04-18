const { catchAsync, AppError } = require("../utils/appError");
const Model = require("../models/index");

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, stock, latitude, longitude } = req.body;

  if (!name || !description || !price || !stock || !latitude || !longitude) {
    return next(
      new AppError(
        "All fields (name, description, price, stock, latitude, longitude) are required",
        400
      )
    );
  }

  const existingProduct = await Model.Product.findOne({ where: { name } });

  if (existingProduct) {
    return next(new AppError("Product already exists", 400));
  }

  const newProduct = await Model.Product.create({
    name,
    description,
    price,
    stock,
    latitude,
    longitude,
  });

  res.status(201).json({
    status: "success",
    data: newProduct,
    message: "Product created successfully",
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = page * limit;

  const { name, price, stock } = req.query;
  const whereCondition = {};

  if (name) {
    whereCondition.name = name;
  }
  if (price) {
    whereCondition.price = price;
  }
  if (stock) {
    whereCondition.stock = stock;
  }

  const products = await Model.Product.findAll({
    where: whereCondition,
    limit,
    offset,
    raw: true,
  });

  if (products.length === 0) {
    return next(new AppError("No Products Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: products,
    message: "Products fetched successfully",
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Model.Product.findOne({
    where: { id },
    raw: true,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
    message: "Product fetched successfully",
  });
});

exports.updateProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;

  const product = await Model.Product.findByPk(id, { raw: true });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  await Model.Product.update(
    { name, price, description, stock },
    { where: { id } }
  );

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
  });
});

exports.deleteProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Product ID is required", 400));
  }

  const deleted = await Model.Product.destroy({
    where: { id },
  });

  if (!deleted) {
    return next(new AppError("Product not found or already deleted", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});


const { catchAsync, AppError } = require("../utils/appError");
const Model = require("../models/index");
const bcrypt = require("bcryptjs");
const { isValidatePassword } = require("../utils/validators");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = page * limit;

  const { first_name, email, phone_number } = req.query;

  const whereCondition = {};
  if (first_name) {
    whereCondition.first_name = first_name;
  }
  if (email) {
    whereCondition.email = email;
  }
  if (phone_number) {
    whereCondition.phone_number = phone_number;
  }

  const users = await Model.User.findAll({
    where: whereCondition,
    limit,
    offset,
    raw: true,
    attributes: { exclude: ["password", "role"] },
  });

  if (users.length === 0) {
    return next(new AppError("No Users Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: users,
    message: "Users fetched successfully",
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Model.User.findByPk(id, {
    attributes: [
      "id",
      "email",
      "first_name",
      "last_name",
      "phone_number",
      "role",
    ],
    raw: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
    message: "User fetched successfully",
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { first_name, last_name, role, status, password } = req.body;

  const user = await Model.User.findByPk(id, {
    attributes: [
      "id",
      "email",
      "first_name",
      "last_name",
      "phone_number",
      "role",
      "password",
    ],
    raw: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const updatedData = {};

  if (first_name !== undefined) updatedData.first_name = first_name;
  if (last_name !== undefined) updatedData.last_name = last_name;
  if (role !== undefined) updatedData.role = role;
  if (status !== undefined) updatedData.status = status;

  if (password !== undefined) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Incorrect Password", 401));
    }

    if (!isValidatePassword(password)) {
      return next(
        new AppError(
          "Password must be at least 8 characters long and include at least one number and one special character (e.g., !@#$%^&*)",
          400
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  if (Object.keys(updatedData).length === 0) {
    return next(new AppError("No valid fields provided for update", 400));
  }

  await Model.User.update(updatedData, { where: { id } });

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("User ID is required", 400));
  }

  const deleted = await Model.User.destroy({
    where: { id },
  });

  if (!deleted) {
    return next(new AppError("User not found or already deleted", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});

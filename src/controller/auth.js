const bcrypt = require("bcryptjs");
const { AppError, catchAsync } = require("../utils/appError");
const { signJwtToken } = require("../utils/jwt");
const Model = require("../models/index");
const { isValidateEmail, isValidatePassword, isValidatePhoneNumber} = require("../utils/validators");

const registerAccount = async ({ role, status }, req, res, next) => {
  const { first_name, last_name, email, phone_number, password, latitude, longitude } = req.body;

  if (!isValidateEmail(email)) {
    return next(
      new AppError("Please provide a valid email address (e.g. user@example.com)", 400)
    );
  }

  if (!isValidatePhoneNumber(phone_number)) {
    return next(new AppError("Phone number must be exactly 10 digits", 400));
  }

  if (!isValidatePassword(password)) {
    return next(
      new AppError("Password must be at least 8 characters long and include at least one number and one special character (e.g., !@#$%^&*)", 400)
    );
  }

  const existingEmail = await Model.User.findOne({ where: { email } });
  if (existingEmail) {
    return next(new AppError("Email already in use", 409));
  }

  const existingPhone = await Model.User.findOne({ where: { phone_number } });
  if (existingPhone) {
    return next(new AppError("Phone number already in use", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Model.User.create({
    first_name,
    last_name,
    phone_number,
    email,
    password: hashedPassword,
    status,
    role,
    latitude,
    longitude,
  });

  res.status(201).json({
    status: "success",
    message: `${role} registered successfully`,
  });
};

exports.registerAdmin = catchAsync((req, res, next) =>
  registerAccount({ role: "Admin", status: "Approved" }, req, res, next)
);

exports.registerUser = catchAsync((req, res, next) =>
  registerAccount({ role: "User", status: "Pending" }, req, res, next)
);

exports.loginUser = catchAsync(async (req, res, next) => {
  const { phone_number, email, password } = req.body;

  if (!password || (!email && !phone_number)) {
    return next(
      new AppError("Please provide email or phone number and password", 400)
    );
  }
  if (!isValidatePhoneNumber(phone_number)) {
    return next(new AppError("Phone number must be exactly 10 digits", 400));
  }
  const whereCondition = {};
  if (email) {
    whereCondition.email = email;
  }
  if (phone_number) {
    whereCondition.phone_number = phone_number;
  }
  const user = await Model.User.findOne({
    where: whereCondition,
    raw: true,
  });

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  if (["Block", "Pending", "Reject"].includes(user.status)) {
    return next(
      new AppError(
        `Your account is currently '${user.status}'. Please contact support.`,
        403
      )
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  const loggedInUser = { ...user };
  delete loggedInUser.password;

  console.log(loggedInUser)
  const token = signJwtToken(loggedInUser);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    user: loggedInUser,
    token,
  });
});

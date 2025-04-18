const { catchAsync, AppError } = require("../utils/appError");

module.exports = catchAsync(async (req, res, next) => {
  const loggedInUser = req.user;

  if (loggedInUser.user.role !== "Admin") {
    return next(
      new AppError(
        "Access denied: Only admin users can access this resource.",
        403
      )
    );
  }

  next();
});

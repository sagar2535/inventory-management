const { AppError, catchAsync } = require("../utils/appError");
const { verifyJwtToken } = require("../utils/jwt");

module.exports = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  const decoded = verifyJwtToken(token);
  req.user = decoded;
  next();
});

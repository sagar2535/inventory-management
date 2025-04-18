const devErrorHandler = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      error: err,
      status: err.status,
      message: err.message,
      errorStack: err.stack,
    });
  } else {
    //NON API DEV
    return res.status(err.statusCode).json({
      code: err.statusCode,
      error: err,
      status: err.status,
      message: err.message,
      errorStack: err.stack,
    });
  }
};

const prodErrorHandler = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      status: err.status,
      message: "Something went wrong.",
    });
  } else {
    //NON API PROD
    return res.status(err.statusCode).json({
      code: err.statusCode,
      status: err.status,
      message: "Something went wrong.",
    });
  }
};

// ERROR HANDLER MIDDLEWARE
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Fail";
  error.isOperational = error.isOperational || false;
  console.log(process.env.NODE_ENV);
  switch (process.env.NODE_ENV) {
    case "devlopment":
      devErrorHandler(error, req, res);
      break;
    default:
      prodErrorHandler(error, req, res);
      break;
  }
};

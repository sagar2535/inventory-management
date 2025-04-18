const ErrorHandler = require("../middleware/ErrorHandler");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { AppError } = require("../utils/appError");
const app = express();
const setupSwaggerDocs = require("./swagger");

const Routes = require("../routes/index");

app.use(express.json({ limit: "25mb" }));
app.use(cors());
app.use(morgan("dev"));

app.use((req, res, next) => {
  req.currentDate = new Date().toISOString().split("T")[0];
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    currentDate: req.currentDate,
    message: "server started successfully...",
  });
});

app.use(`/api/v1/auth`, Routes.AuthRoutes);
app.use(`/api/v1/users`, Routes.UserRoutes);
app.use(`/api/v1/stocks`, Routes.StockRoutes);
app.use(`/api/v1/orders`, Routes.OrderRoutes);
app.use(`/api/v1/products`, Routes.ProductRoutes);
app.use(`/api/v1/warehouses`, Routes.WarehouseRoutes);

setupSwaggerDocs(app);

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(ErrorHandler);

module.exports = app;

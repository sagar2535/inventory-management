require("dotenv").config();
const sequelize = require("./database");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);
  process.exit(1);
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "✅ Database connection successful!",
      sequelize.getDatabaseName()
    );
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
const port = process.env.PORT || 3000;

console.log(`Node Enviornment is : ${process.env.NODE_ENV}`);

const server = app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

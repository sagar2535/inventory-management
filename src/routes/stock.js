const router = require("express").Router();
const Controller = require("../controller/index");
const Middleware = require("../middleware/index");

router.use(Middleware.Protect, Middleware.CheckAdmin);

router.post("/", Controller.StockController.createStock);

router.get("/", Controller.StockController.getAllStocks);
router
  .route("/:id")
  .get(Controller.StockController.getStockById)
  .patch(Controller.StockController.updateStockById)
  .delete(Controller.StockController.deleteStockById);

module.exports = router;

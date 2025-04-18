const router = require("express").Router();
const Controller = require("../controller/index");
const Middleware = require("../middleware/index");

router.use(Middleware.Protect, Middleware.CheckAdmin);

router.post("/", Controller.WarehouseController.createWarehouse);
router.get("/", Controller.WarehouseController.getAllWarehouses);
router
  .route("/:id")
  .get(Controller.WarehouseController.getWarehouseById)
  .patch(Controller.WarehouseController.updateWarehouseById)
  .delete(Controller.WarehouseController.deleteWarehouseById);

module.exports = router;

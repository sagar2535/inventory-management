const router = require("express").Router();
const Controller = require("../controller/index");
const Middleware = require("../middleware/index");

router.use(Middleware.Protect, Middleware.CheckAdmin);

router.post("/", Controller.OrderController.createOrder);
router.get("/", Controller.OrderController.getAllOrder);
router
  .route("/:id")
  .get(Controller.OrderController.getOrderById)
  .patch(Controller.OrderController.updateOrderById)
  .delete(Controller.OrderController.deleteOrderById);

module.exports = router;

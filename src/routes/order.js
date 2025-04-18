const router = require("express").Router();
const Controller = require("../controller/index");
const Middleware = require("../middleware/index");

router.use(Middleware.Protect);

router.post("/", Controller.OrderController.createOrder);

router.use(Middleware.CheckAdmin);

router.get("/", Controller.OrderController.getAllOrder);
router
  .route("/:id")
  .get(Controller.OrderController.getOrderById)
  .patch(Controller.OrderController.updateOrderById)
  .delete(Controller.OrderController.deleteOrderById);

module.exports = router;

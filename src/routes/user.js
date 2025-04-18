const router = require("express").Router();
const Controller = require("../controller/index");
const Middleware = require("../middleware/index");

router.use(Middleware.Protect, Middleware.CheckAdmin);

router.get("/", Controller.UserController.getAllUser);
router
  .route("/:id")
  .get(Controller.UserController.getUserById)
  .patch(Controller.UserController.updateUser)
  .delete(Controller.UserController.deleteUser);

module.exports = router;

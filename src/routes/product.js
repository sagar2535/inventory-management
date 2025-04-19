const router = require("express").Router();
const Controller = require("../controller/index");
const Middleware = require("../middleware/index");

router.use(Middleware.Protect);

router.get("/", Controller.ProductController.getAllProducts);

router.use(Middleware.CheckAdmin);

router.post("/", Controller.ProductController.createProduct);

router
  .route("/:id")
  .get(Controller.ProductController.getProductById)
  .patch(Controller.ProductController.updateProductById)
  .delete(Controller.ProductController.deleteProductById);

module.exports = router;

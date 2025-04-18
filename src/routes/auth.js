const router = require("express").Router();
const Controller = require("../controller/index");

router.post("/register/admin", Controller.AuthController.registerAdmin);
router.post("/register", Controller.AuthController.registerUser);
router.post("/login", Controller.AuthController.loginUser);

module.exports = router;

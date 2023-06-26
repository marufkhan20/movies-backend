const {
  checkUserByEmailController,
  registerController,
  loginController,
} = require("../controllers/authController");

const router = require("express").Router();

// check user by email
router.post("/check-user", checkUserByEmailController);

// register user
router.post("/register", registerController);

// login user
router.post("/login", loginController);

module.exports = router;

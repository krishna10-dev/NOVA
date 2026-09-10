const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword
} = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const protect = require("../middleware/authMiddleware");
const {
  registerSchema,
  loginSchema
} = require("../validators/authValidator");

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

router.get(
  "/me",
  protect,
  asyncHandler(getMe)
);

router.post(
  "/logout",
  asyncHandler(logout)
);

router.patch(
  "/profile",
  protect,
  updateProfile
);

router.patch(
  "/password",
  protect,
  changePassword
);

module.exports = router;

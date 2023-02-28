const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const upload = require("../../utils/fileUploads");
const {
  login,
  signup,
  getMe,
  getAll,
  updateMe,
  forgotPassword,
  resetPassword,
} = require("./controller");
const {
  loginValidation,
  signUpValidation,
  forgotPasswordValidation,
} = require("./validation");
const cpUpload = upload.fields([
  { name: "panCard", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "anyOtherCompanySpecificId", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
]);

router.post("/login", loginValidation, login);
router.post("/signup", cpUpload, signUpValidation, signup);
router.get(
  "/getMe",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  getMe
);
router.patch(
  "/updateMe",
  cpUpload,
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  updateMe
);
router.get(
  "/getAll",
  auth.authMiddleware,
  auth.restrictTo("superAdmin"),
  getAll
);
router.post("/forgotPassword", forgotPasswordValidation, forgotPassword);
router.post("/resetPassword/:token", resetPassword);
module.exports = router;

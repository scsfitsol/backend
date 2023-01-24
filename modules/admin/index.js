const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const upload = require("../../utils/fileUploads");
const { login, signup, getMe } = require("./controller");
const { loginValidation, signUpValidation } = require("./validation");
const cpUpload = upload.fields([
  { name: "panCard", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "anyOtherCompanySpecificId", maxCount: 1 },
]);

router.post("/login", loginValidation, login);
router.post("/signup", cpUpload, signUpValidation, signup);
router.get("/getMe", auth.authMiddleware, getMe);
module.exports = router;

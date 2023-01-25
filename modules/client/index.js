const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");
const auth = require("../../middleware/auth");

const {
  create,
  get,
  update,
  remove,
  getAll,
  login,
  forgotPassword,
  resetPassword,
} = require("./controller");
const {
  clientValidation,
  updateClientValidation,
  loginValidation,
  forgotPasswordValidation,
} = require("./validation");

router
  .route("/")
  .post(clientValidation, auth.restrictTo("admin", "superAdmin"), create)
  .get(getAll);
router.post("/login", loginValidation, login);
router.post(
  "/forgotPassword",
  forgotPasswordValidation,
  auth.restrictTo("client"),
  forgotPassword
);
router.post("/resetPassword", resetPassword);
router
  .route("/:id")
  .get(get)
  .patch(updateClientValidation, update)
  .delete(remove);

module.exports = router;

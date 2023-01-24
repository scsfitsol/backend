const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");

const {
  create,
  get,
  update,
  remove,
  getAll,
  login,
  forgotPassword,
} = require("./controller");
const {
  clientValidation,
  updateClientValidation,
  loginValidation,
  forgotPasswordValidation,
} = require("./validation");

router.route("/").post(clientValidation, create).get(getAll);
router.post("/login", loginValidation, login);
router.post("/forgotPassword", forgotPasswordValidation, forgotPassword);
router
  .route("/:id")
  .get(get)
  .patch(updateClientValidation, update)
  .delete(remove);

module.exports = router;

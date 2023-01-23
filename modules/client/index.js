const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");

const { create, get, update, remove, getAll, login } = require("./controller");
const {
  clientValidation,
  updateClientValidation,
  loginValidation,
} = require("./validation");

router.route("/").post(clientValidation, create).get(getAll);
router.post("/login", loginValidation, login);
router
  .route("/:id")
  .get(get)
  .patch(updateClientValidation, update)
  .delete(remove);

module.exports = router;

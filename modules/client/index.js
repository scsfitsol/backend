const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");

const { create, get, update, remove, getAll } = require("./controller");
const { clientValidation, updateClientValidation } = require("./validation");

router.route("/").post(clientValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(updateClientValidation, update)
  .delete(remove);

module.exports = router;

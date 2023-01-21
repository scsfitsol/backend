const express = require("express");
const router = express.Router();

const { create, get, update, remove, getAll } = require("./controller");
const {
  transporterValidation,
  updateTransporterValidation,
} = require("./validation");
const upload = require("../../utils/fileUploads");

router.route("/").post(transporterValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(updateTransporterValidation, update)
  .delete(remove);

module.exports = router;

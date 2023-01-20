const express = require("express");
const router = express.Router();

const { create, get, update, remove, getAll } = require("./controller");
const { vehicleValidation, updateVehicleValidation } = require("./validation");
const upload = require("../../utils/fileUploads");

router.route("/").post(vehicleValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(updateVehicleValidation, update)
  .delete(remove);

module.exports = router;

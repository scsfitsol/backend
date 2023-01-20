const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");

const { create, get, update, remove, getAll } = require("./controller");
const {
  vehicleTypeValidation,
  updateVehicleTypeValidation,
} = require("./validation");

router.route("/").post(vehicleTypeValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(updateVehicleTypeValidation, update)
  .delete(remove);

// router.route("/").get(getAllByUser).post(clinicDataValidation, create);
// router.route("/:id").patch(updateClinicDataValidation, edit).delete(remove);

module.exports = router;

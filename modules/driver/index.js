const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");

const { create, get, update, remove, getAll } = require("./controller");
const { driverValidation, updateDriverValidation } = require("./validation");

router
  .route("/")
  .post(upload.single("drivingLicense"), driverValidation, create)
  .get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(upload.single("drivingLicense"), updateDriverValidation, update)
  .delete(remove);

// router.route("/").get(getAllByUser).post(clinicDataValidation, create);
// router.route("/:id").patch(updateClinicDataValidation, edit).delete(remove);

module.exports = router;

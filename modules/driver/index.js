const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");

const { create, get, update, remove, getAll } = require("./controller");
const { driverValidation, updateDriverValidation } = require("./validation");

const cpUpload = upload.fields([
  { name: "drivingLicense", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
]);

router.route("/").post(cpUpload, driverValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(cpUpload, updateDriverValidation, update)
  .delete(remove);

module.exports = router;

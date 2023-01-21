const express = require("express");
const router = express.Router();

const { create, get, update, remove, getAll } = require("./controller");
const { plantValidation, updatePlantValidation } = require("./validation");
const upload = require("../../utils/fileUploads");

router.route("/").post(plantValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(updatePlantValidation, update)
  .delete(remove);

module.exports = router;

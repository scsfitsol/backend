const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");

const { create, get, update, remove, getAll } = require("./controller");
const {
  organizationValidation,
  updateOrganizationValidation,
} = require("./validation");

router.route("/").post(organizationValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(updateOrganizationValidation, update)
  .delete(remove);

module.exports = router;

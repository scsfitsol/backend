const express = require("express");
const router = express.Router();

const { create, get, update, remove, getAll } = require("./controller");
const { tripValidation, updateTripValidation } = require("./validation");

router.route("/").post(tripValidation, create).get(getAll);
router
  .route("/:id")
  .get(get)
  .patch(updateTripValidation, update)
  .delete(remove);

module.exports = router;

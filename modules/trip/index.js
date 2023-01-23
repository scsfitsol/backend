const express = require("express");
const router = express.Router();

const {
  create,
  get,
  update,
  remove,
  getAll,
  updateTripStatus,
} = require("./controller");
const {
  tripValidation,
  updateTripValidation,
  updateTripStatusValidation,
} = require("./validation");

router.route("/").post(tripValidation, create).get(getAll);
router
  .route("/updateTripStatus/:id")
  .patch(updateTripStatusValidation, updateTripStatus);
router
  .route("/:id")
  .get(get)
  .patch(updateTripValidation, update)
  .delete(remove);

module.exports = router;

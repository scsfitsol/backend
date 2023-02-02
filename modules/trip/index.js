const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

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

router.post(
  "/",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  tripValidation,
  create
);
router.get(
  "/",
  auth.authMiddleware,
  auth.restrictTo("client", "admin", "superAdmin"),
  getAll
);
router.patch(
  "/updateTripStatus/:id",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  updateTripStatusValidation,
  updateTripStatus
);
router.get(
  "/:id",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  get
);
router.patch(
  "/:id",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  updateTripValidation,
  update
);
router.delete(
  "/:id",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  remove
);

module.exports = router;

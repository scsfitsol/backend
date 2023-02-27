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
  importApi,
  getClientAnalytics,
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
  importApi,
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
router.get("/clientAnalytics", auth.authMiddleware, getClientAnalytics);

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

const express = require("express");
const router = express.Router();
const auth = require(".././middleware/auth");

router.use("/admin", require("../modules/admin"));
router.use(
  "/driver",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  require("../modules/driver")
);

router.use(
  "/vehicle",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  require("../modules/vehicle")
);
router.use("/trip", require("../modules/trip"));
router.use(
  "/organization",
  auth.authMiddleware,
  auth.restrictTo("superAdmin"),
  require("../modules/organization")
);
router.use("/client", require("../modules/client"));
router.use(
  "/transporter",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  require("../modules/transporter")
);
router.use(
  "/plant",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  require("../modules/plant")
);
router.use(
  "/analysis",
  auth.authMiddleware,
  auth.restrictTo("admin", "superAdmin"),
  require("../modules/analysis")
);

module.exports = router;

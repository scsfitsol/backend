const express = require("express");
const router = express.Router();
const auth = require(".././middleware/auth");

// router.use(
//   "/notification",
//   auth.authMiddleware,
//   require("../modules/notification")
// );
//router.use("/user", require("../modules/user"));
router.use("/admin", require("../modules/admin"));
router.use("/driver", auth.authMiddleware, require("../modules/driver"));
router.use(
  "/vehicleType",
  auth.authMiddleware,
  require("../modules/vehicleType")
);
router.use("/vehicle", auth.authMiddleware, require("../modules/vehicle"));
router.use("/trip", auth.authMiddleware, require("../modules/trip"));

module.exports = router;

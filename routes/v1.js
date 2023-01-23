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

router.use("/vehicle", auth.authMiddleware, require("../modules/vehicle"));
router.use("/trip", auth.authMiddleware, require("../modules/trip"));
router.use(
  "/organization",
  auth.authMiddleware,
  require("../modules/organization")
);
router.use("/client", auth.authMiddleware, require("../modules/client"));
router.use(
  "/transporter",
  auth.authMiddleware,
  require("../modules/transporter")
);
router.use("/plant", auth.authMiddleware, require("../modules/plant"));
router.use("/analysis", auth.authMiddleware, require("../modules/analysis"));

module.exports = router;

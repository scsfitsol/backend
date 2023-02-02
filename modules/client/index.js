const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");
const auth = require("../../middleware/auth");

const {
  create,
  get,
  update,
  remove,
  getAll,
  login,
  forgotPassword,
  resetPassword,
} = require("./controller");
const {
  clientValidation,
  updateClientValidation,
  loginValidation,
  forgotPasswordValidation,
} = require("./validation");

router
  .route("/")
  .post(
    upload.single("profilePic"),
    clientValidation,
    auth.authMiddleware,
    auth.restrictTo("admin", "superAdmin"),
    create
  )
  .get(auth.authMiddleware, auth.restrictTo("admin", "superAdmin"), getAll);
router.post("/login", loginValidation, login);
router.post("/forgotPassword", forgotPasswordValidation, forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router
  .route("/:id")
  .get(auth.authMiddleware, get)
  .patch(
    auth.authMiddleware,
    upload.single("profilePic"),
    updateClientValidation,
    update
  )
  .delete(auth.authMiddleware, auth.restrictTo("admin", "superAdmin"), remove);

module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../../utils/fileUploads");
const auth = require("../../middleware/auth");

const { get } = require("./controller");
router.route("/:id").get(get);

module.exports = router;

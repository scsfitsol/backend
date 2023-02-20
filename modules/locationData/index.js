const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const { get, getData } = require("./controller");
router.route("/getData").get(getData);
router.route("/:id").get(get);

module.exports = router;

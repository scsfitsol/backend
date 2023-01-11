const express = require("express");
const router = express.Router();

const { create, get, update } = require("./controller");

router.route("/").post(create);

router.route("/:id").get(get).patch(update);

module.exports = router;

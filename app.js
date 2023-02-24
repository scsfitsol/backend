const express = require("express");
const cron = require("node-cron");

require("dotenv").config();
global.createError = require("http-errors");
const corsOpts = {
  origin: "*",
};

const logger = require("morgan");
var cors = require("cors");

const indexRouter = require("./routes");
const { locationUpdate } = require("./modules/locationData/locationCron");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(cors(corsOpts));
app.use("/", indexRouter);

app.use(function (req, res, next) {
  next(createError(404, "URL Not Found"));
});
//error handler
app.use(function (err, req, res, next) {
  console.log({ err });
  res.status(err.status || err.statusCode || 500).json({
    status: err.status || 500,
    message: err.message || "Unknown Error",
    stack: err.stack,
  });
});
cron.schedule(" * * * * *", locationUpdate);

module.exports = app;

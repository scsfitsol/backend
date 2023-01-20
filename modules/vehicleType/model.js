"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Admin = require("../admin/model");

const VehicleType = sequelize.define(
  "vehicleType",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    width: {
      type: Sequelize.INTEGER,
    },
    capacity: {
      type: Sequelize.INTEGER,
    },
  },

  {
    paranoid: true,
  }
);
module.exports = VehicleType;

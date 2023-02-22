"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Trip = require("../trip/model");

const Location = sequelize.define(
  "location",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    latitude: {
      type: Sequelize.FLOAT,
    },
    longtitude: {
      type: Sequelize.FLOAT,
    },
    timestamp: {
      type: Sequelize.STRING,
    },
    detailedAddress: {
      type: Sequelize.STRING,
    },
    updateLocationTime: {
      type: Sequelize.STRING,
    },
    locationResultStatusText: {
      type: Sequelize.STRING,
    },
  },
  {
    paranoid: true,
  }
);
Trip.hasMany(Location, {
  foreignKey: {
    allowNull: false,
  },
});
Location.belongsTo(Trip);
module.exports = Location;

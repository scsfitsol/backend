"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Vehicle = require("../vehicle/model");
const Driver = require("../driver/model");

const Trip = sequelize.define(
  "trip",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    startLocation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    endLocation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    startTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    targetTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    completedTime: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.ENUM("pending", "ongoing", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
  },

  {
    paranoid: true,
  }
);
Driver.hasMany(Trip, {
  foreignKey: {
    allowNull: false,
  },
});
Trip.belongsTo(Driver);
Vehicle.hasMany(Trip, {
  foreignKey: {
    allowNull: false,
  },
});
Trip.belongsTo(Vehicle);
module.exports = Trip;

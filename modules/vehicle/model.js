"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const VehicleType = require("../vehicleType/model");

const Vehicle = sequelize.define(
  "vehicle",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    registrationNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    make: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tonnage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },

  {
    paranoid: true,
  }
);
VehicleType.hasMany(Vehicle, {
  foreignKey: {
    allowNull: false,
  },
});
Vehicle.belongsTo(VehicleType);
module.exports = Vehicle;

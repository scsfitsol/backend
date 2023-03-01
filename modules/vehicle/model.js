"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Organization = require("../organization/model");
const Transporter = require("../transporter/model");

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
    engineType: {
      type: Sequelize.STRING,
    },
    capacity: {
      type: Sequelize.FLOAT,
    },
    co2PerKm: {
      type: Sequelize.FLOAT,
    },
    length: {
      type: Sequelize.FLOAT,
    },
    manufacture: {
      type: Sequelize.STRING,
    },
    allocate: {
      type: Sequelize.ENUM("true", "false"),
      defaultValue: "false",
      allowNull: false,
    },
    fuelType: {
      type: Sequelize.STRING,
    },
    mileage: {
      type: Sequelize.FLOAT,
    },
  },

  {
    paranoid: true,
    alter: true,
  }
);

Organization.hasMany(Vehicle, {
  foreignKey: {
    allowNull: false,
  },
});
Vehicle.belongsTo(Organization);
Organization.hasMany(Vehicle);
Vehicle.belongsTo(Transporter);
Transporter.hasMany(Vehicle);
module.exports = Vehicle;

"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Vehicle = require("../vehicle/model");
const Driver = require("../driver/model");
const Client = require("../client/model");
const Organization = require("../organization/model");

const Trip = sequelize.define(
  "trip",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    startTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    sourceLocation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    destinationLocation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    weight: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    targetedDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    targetedTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    completedTime: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.ENUM("1", "2", "3"),
      defaultValue: "1",
      allowNull: false,
    },
    carbonEmitted: {
      type: Sequelize.STRING,
      default: 0,
    },
    utilisation: {
      type: Sequelize.INTEGER,
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
Organization.hasMany(Trip, {
  foreignKey: {
    allowNull: false,
  },
});
Trip.belongsTo(Organization);
Vehicle.hasMany(Trip, {
  foreignKey: {
    allowNull: false,
  },
});
Trip.belongsTo(Vehicle);
Client.hasMany(Trip);
Trip.belongsTo(Client);
module.exports = Trip;

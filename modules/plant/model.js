"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Organization = require("../organization/model");
const Client = require("../client/model");

const Plant = sequelize.define(
  "plant",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    unitName: {
      type: Sequelize.STRING,
    },
    GST: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
    },
  },

  {
    paranoid: true,
  }
);

Organization.hasMany(Plant, {
  foreignKey: {
    allowNull: false,
  },
});
Plant.belongsTo(Organization);
Client.hasMany(Plant, {
  foreignKey: {
    allowNull: false,
  },
});
Plant.belongsTo(Client);
module.exports = Plant;

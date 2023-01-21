"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Organization = require("../organization/model");

const Transporter = sequelize.define(
  "transporter",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    transporterName: {
      type: Sequelize.STRING,
    },
    gstNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },

  {
    paranoid: true,
  }
);

Organization.hasMany(Transporter, {
  foreignKey: {
    allowNull: false,
  },
});
Transporter.belongsTo(Organization);
module.exports = Transporter;

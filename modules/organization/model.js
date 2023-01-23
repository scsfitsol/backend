"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");

const Organization = sequelize.define(
  "organization",
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
  },

  {
    paranoid: true,
  }
);

module.exports = Organization;

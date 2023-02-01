"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Organization = require("../organization/model");

const Driver = sequelize.define(
  "driver",
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
    drivingLicense: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    allocate: {
      type: Sequelize.ENUM("true", "false"),
      defaultValue: "false",
      allowNull: false,
    },
    mobile: {
      type: Sequelize.BIGINT,
      unique: true,
      validate: {
        not: {
          args: ["[a-z]", "i"],
          msg: "Please enter a valid number",
        },
        len: {
          args: [10, 10],
          msg: "length of the phone number is 10",
        },
      },
    },
    profilePic: {
      type: Sequelize.STRING,
    },
  },
  {
    paranoid: true,
  }
);
Organization.hasMany(Driver, {
  foreignKey: {
    allowNull: false,
  },
});
Driver.belongsTo(Organization);
module.exports = Driver;

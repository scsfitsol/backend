"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const Admin = require("../admin/model");

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
  },

  {
    paranoid: true,
  }
);
Admin.hasMany(Driver, {
  foreignKey: {
    allowNull: false,
  },
});
Driver.belongsTo(Admin);
module.exports = Driver;

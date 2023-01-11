"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");

const Academy = sequelize.define(
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      isEmail: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profilePic: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.BIGINT,
      unique: true,
      allowNull: false,
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
    description: {
      type: Sequelize.TEXT,
    },

    sport: {
      type: Sequelize.TEXT,
      get: function () {
        return this.getDataValue("sport")
          ? JSON.parse(this.getDataValue("sport"))
          : [];
      },
      set: function (val) {
        return this.setDataValue("sport", JSON.stringify(val.split(",")));
      },
    },
  },
  {
    paranoid: true,
  }
);

// User.hasMany(Academy);
// Academy.belongsTo(User);

module.exports = Academy;

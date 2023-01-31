"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const Organization = require("../organization/model");

const Admin = sequelize.define(
  "admin",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      isEmail: true,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("admin", "superAdmin"),
      defaultValue: "admin",
      allowNull: false,
    },
    panCard: {
      type: Sequelize.STRING,
    },
    aadharCard: {
      type: Sequelize.STRING,
    },
    anyOtherCompanySpecificId: {
      type: Sequelize.STRING,
    },
    profilePic: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: (Admin) => {
        const salt = bcrypt.genSaltSync();
        Admin.password = bcrypt.hashSync(Admin.password, salt);
      },
    },
  }
);

// Admin.prototype.validPassword = async function (password) {
//   return await bcrypt.compare(`${password}`, `${this.password}`);
// };
Organization.hasMany(Admin);
Admin.belongsTo(Organization);

module.exports = Admin;

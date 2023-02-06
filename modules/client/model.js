"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const Organization = require("../organization/model");

const Client = sequelize.define(
  "client",
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
    passResetToken: {
      type: Sequelize.STRING,
    },
    passResetTokenExpiresIn: {
      type: Sequelize.BIGINT,
    },
    profilePic: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: (Client) => {
        const salt = bcrypt.genSaltSync();
        Client.password = bcrypt.hashSync(Client.password, salt);
      },
    },
  }
);
Organization.hasMany(Client, {
  foreignKey: {
    allowNull: false,
  },
});
Client.belongsTo(Organization);
module.exports = Client;

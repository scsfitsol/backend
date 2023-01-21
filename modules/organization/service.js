const organization = require("./model");

exports.create = async (data) => {
  return organization.create(data);
};

exports.get = async (condition) => {
  return organization.findAll(condition);
};

exports.update = async (data, condition) => {
  return organization.update(data, condition);
};

exports.remove = async (condition) => {
  return organization.destroy(condition);
};

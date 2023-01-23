const Vehicle = require("./model");

exports.create = async (data) => {
  return Vehicle.create(data);
};

exports.get = async (condition) => {
  return Vehicle.findAll(condition);
};

exports.update = async (data, condition) => {
  return Vehicle.update(data, condition);
};

exports.remove = async (condition) => {
  return Vehicle.destroy(condition);
};
